import { Hono } from "hono"
import type { AppConfig } from "../config.js"
import type { ChatResponse } from "../types/index.js"
import { transcribeAudio } from "../services/whisper.js"
import { generateResponse } from "../services/llm.js"
import { textToSpeech } from "../services/voicevox.js"
import { extractVisemes } from "../services/viseme.js"
import { saveMessage, getMessagesForLLM } from "../services/messages.js"

function parseOptionalSpeakerId(value: unknown): number | undefined {
  if (value === undefined || value === null) return undefined
  const num = typeof value === "string" ? Number(value) : value
  if (typeof num !== "number" || Number.isNaN(num) || !Number.isInteger(num) || num < 0) {
    return undefined
  }
  return num
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer)
  let binary = ""
  for (const byte of bytes) {
    binary += String.fromCharCode(byte)
  }
  return btoa(binary)
}

async function processChat(
  userText: string,
  config: AppConfig,
  speakerId?: number,
): Promise<ChatResponse> {
  const history = await getMessagesForLLM()
  const llmResponse = await generateResponse(userText, config, history)
  const { audioBuffer, audioQuery } = await textToSpeech(
    llmResponse.text,
    config,
    speakerId,
  )

  await saveMessage("user", userText)
  await saveMessage("assistant", llmResponse.text)

  const audioBase64 = arrayBufferToBase64(audioBuffer)
  const visemes = extractVisemes(audioQuery)

  return {
    transcript: userText,
    response: llmResponse.text,
    audioBase64,
    visemes,
    action: llmResponse.action,
  }
}

export function createChatRoute(config: AppConfig): Hono {
  const chat = new Hono()

  chat.post("/api/chat", async (c) => {
    try {
      const formData = await c.req.formData()
      const audioFile = formData.get("audio")

      if (!(audioFile instanceof File)) {
        return c.json({ error: "Missing audio file in form data" }, 400)
      }

      const speakerId = parseOptionalSpeakerId(formData.get("speakerId"))

      const transcript = await transcribeAudio(audioFile, config)
      const result = await processChat(transcript, config, speakerId)
      return c.json(result)
    } catch (error) {
      console.error("Chat endpoint failed:", error)
      return c.json({ error: "An internal error occurred" }, 500)
    }
  })

  chat.post("/api/chat/text", async (c) => {
    try {
      const body = await c.req.json<{ text?: string; speakerId?: number }>()
      const text = typeof body.text === "string" ? body.text.trim() : ""

      if (text === "") {
        return c.json({ error: "Missing or empty text" }, 400)
      }

      const MAX_TEXT_LENGTH = 10000
      if (text.length > MAX_TEXT_LENGTH) {
        return c.json({ error: `Text exceeds maximum length of ${MAX_TEXT_LENGTH} characters` }, 400)
      }

      const speakerId = parseOptionalSpeakerId(body.speakerId)

      const result = await processChat(text, config, speakerId)
      return c.json(result)
    } catch (error) {
      console.error("Chat text endpoint failed:", error)
      return c.json({ error: "An internal error occurred" }, 500)
    }
  })

  return chat
}
