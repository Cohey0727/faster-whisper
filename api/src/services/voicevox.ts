import type { AppConfig } from "../config.js"
import type { VoicevoxAudioQuery, VoicevoxSynthesisResult } from "../types/index.js"

const SPEAKER_ID = 1

async function createAudioQuery(
  text: string,
  config: AppConfig,
): Promise<VoicevoxAudioQuery> {
  const url = new URL("/audio_query", config.voicevoxUrl)
  url.searchParams.set("text", text)
  url.searchParams.set("speaker", String(SPEAKER_ID))

  const response = await fetch(url.toString(), { method: "POST" })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(
      `VOICEVOX audio_query error (${response.status}): ${errorText}`,
    )
  }

  return (await response.json()) as VoicevoxAudioQuery
}

async function synthesizeAudio(
  audioQuery: VoicevoxAudioQuery,
  config: AppConfig,
): Promise<ArrayBuffer> {
  const url = new URL("/synthesis", config.voicevoxUrl)
  url.searchParams.set("speaker", String(SPEAKER_ID))

  const response = await fetch(url.toString(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(audioQuery),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(
      `VOICEVOX synthesis error (${response.status}): ${errorText}`,
    )
  }

  return response.arrayBuffer()
}

export async function textToSpeech(
  text: string,
  config: AppConfig,
): Promise<VoicevoxSynthesisResult> {
  try {
    const audioQuery = await createAudioQuery(text, config)
    const audioBuffer = await synthesizeAudio(audioQuery, config)

    return { audioBuffer, audioQuery }
  } catch (error) {
    if (error instanceof Error && error.message.includes("VOICEVOX")) {
      throw error
    }
    throw new Error(
      `VOICEVOX TTS failed: ${error instanceof Error ? error.message : String(error)}`,
    )
  }
}
