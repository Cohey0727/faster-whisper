import type { AppConfig } from "../config.js"

export async function transcribeAudio(
  audioFile: File,
  config: AppConfig,
): Promise<string> {
  const buffer = await audioFile.arrayBuffer()
  const blob = new Blob([buffer], { type: audioFile.type || "audio/webm" })

  const formData = new FormData()
  formData.append("file", blob, audioFile.name || "audio.webm")
  formData.append("model", "small")
  formData.append("language", "ja")

  try {
    const response = await fetch(
      `${config.whisperUrl}/v1/audio/transcriptions`,
      {
        method: "POST",
        body: formData,
      },
    )

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(
        `Whisper API error (${response.status}): ${errorText}`,
      )
    }

    const result = (await response.json()) as { text: string }
    return result.text
  } catch (error) {
    if (error instanceof Error && error.message.includes("Whisper API")) {
      throw error
    }
    throw new Error(
      `Failed to connect to Whisper service: ${error instanceof Error ? error.message : String(error)}`,
    )
  }
}
