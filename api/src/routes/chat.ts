import { Hono } from "hono"
import type { AppConfig } from "../config.js"
import type { ChatResponse } from "../types/index.js"
import { transcribeAudio } from "../services/whisper.js"
import { generateResponse } from "../services/llm.js"
import { textToSpeech } from "../services/voicevox.js"
import { extractVisemes } from "../services/viseme.js"

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
      const response = await generateResponse(transcript, config)
      const { audioBuffer, audioQuery } = await textToSpeech(response, config)

      const audioBase64 = arrayBufferToBase64(audioBuffer)
      const visemes = extractVisemes(audioQuery)

      const result: ChatResponse = {
        transcript,
        response,
        audioBase64,
        visemes,
      }

      return c.json(result)
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown error occurred"
      return c.json({ error: message }, 500)
    }
  })

  return chat
}
