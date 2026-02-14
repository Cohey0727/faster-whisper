import { Hono } from "hono"
import type { AppConfig } from "../config.js"
import type { ChatResponse } from "../types/index.js"
import { transcribeAudio } from "../services/whisper.js"
import { generateResponse } from "../services/llm.js"
import { textToSpeech } from "../services/voicevox.js"
import { extractVisemes } from "../services/viseme.js"
import { saveMessage, getMessagesForLLM } from "../services/messages.js"

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer)
  let binary = ""
  for (const byte of bytes) {
    binary += String.fromCharCode(byte)
  }
  return btoa(binary)
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

      const transcript = await transcribeAudio(audioFile, config)
      const history = await getMessagesForLLM()
      const llmResponse = await generateResponse(transcript, config, history)
      const { audioBuffer, audioQuery } = await textToSpeech(
        llmResponse.text,
        config,
      )

      await saveMessage("user", transcript)
      await saveMessage("assistant", llmResponse.text)

      const audioBase64 = arrayBufferToBase64(audioBuffer)
      const visemes = extractVisemes(audioQuery)

      const result: ChatResponse = {
        transcript,
        response: llmResponse.text,
        audioBase64,
        visemes,
        action: llmResponse.action,
      }

      return c.json(result)
    } catch (error) {
      console.error("Chat endpoint failed:", error)
      return c.json({ error: "An internal error occurred" }, 500)
    }
  })

  return chat
}
