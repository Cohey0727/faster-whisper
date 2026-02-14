import { Hono } from "hono"
import type { AppConfig } from "../config.js"

interface VoicevoxStyle {
  readonly id: number
  readonly name: string
}

interface VoicevoxSpeaker {
  readonly name: string
  readonly styles: readonly VoicevoxStyle[]
}

interface SpeakerResponse {
  readonly id: number
  readonly name: string
  readonly styles: readonly { readonly id: number; readonly name: string }[]
}

function toSpeakerResponse(speaker: VoicevoxSpeaker): SpeakerResponse {
  return {
    id: speaker.styles[0]?.id ?? 0,
    name: speaker.name,
    styles: speaker.styles.map((s) => ({ id: s.id, name: s.name })),
  }
}

export function createSpeakersRoute(config: AppConfig): Hono {
  const speakers = new Hono()

  speakers.get("/api/speakers", async (c) => {
    try {
      const url = new URL("/speakers", config.voicevoxUrl)
      const res = await fetch(url.toString())

      if (!res.ok) {
        const errorText = await res.text()
        throw new Error(
          `VOICEVOX speakers error (${res.status}): ${errorText}`,
        )
      }

      const data = (await res.json()) as readonly VoicevoxSpeaker[]
      const mapped = data.map(toSpeakerResponse)

      return c.json({ speakers: mapped })
    } catch (error) {
      console.error("Speakers endpoint failed:", error)
      return c.json({ error: "Failed to fetch speakers" }, 500)
    }
  })

  return speakers
}
