import { Hono } from "hono"
import type { AppConfig } from "../config.js"
import { transcribeAudio } from "../services/whisper.js"

const MAX_AUDIO_BYTES = 25 * 1024 * 1024

export function createTranscribeRoute(config: AppConfig): Hono {
  const transcribe = new Hono()

  transcribe.post("/api/transcribe", async (c) => {
    try {
      const formData = await c.req.formData()
      const audioFile = formData.get("audio")

      if (!(audioFile instanceof File)) {
        return c.json({ error: "Missing audio file in form data" }, 400)
      }

      if (audioFile.size > MAX_AUDIO_BYTES) {
        return c.json({ error: "Audio file too large" }, 413)
      }

      const transcript = await transcribeAudio(audioFile, config)

      return c.json({ transcript })
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown error occurred"
      return c.json({ error: message }, 500)
    }
  })

  return transcribe
}
