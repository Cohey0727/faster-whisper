import { useCallback, useRef, useState } from "react"

interface UseAudioRecorderResult {
  readonly isRecording: boolean
  readonly startRecording: () => Promise<void>
  readonly stopRecording: () => Promise<Blob>
  readonly getAccumulatedBlob: () => Blob | null
  readonly error: string | null
}

export function useAudioRecorder(): UseAudioRecorderResult {
  const [isRecording, setIsRecording] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])

  const startRecording = useCallback(async () => {
    try {
      setError(null)
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "audio/webm;codecs=opus",
      })

      chunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current = [...chunksRef.current, event.data]
        }
      }

      mediaRecorderRef.current = mediaRecorder
      mediaRecorder.start(100)
      setIsRecording(true)
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to access microphone"
      setError(message)
      throw new Error(message)
    }
  }, [])

  const getAccumulatedBlob = useCallback((): Blob | null => {
    if (chunksRef.current.length === 0) return null
    return new Blob(chunksRef.current, { type: "audio/webm" })
  }, [])

  const stopRecording = useCallback((): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const mediaRecorder = mediaRecorderRef.current
      if (!mediaRecorder || mediaRecorder.state === "inactive") {
        reject(new Error("No active recording"))
        return
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" })
        chunksRef.current = []

        mediaRecorder.stream.getTracks().forEach((track) => track.stop())
        mediaRecorderRef.current = null

        setIsRecording(false)

        if (blob.size === 0) {
          reject(new Error("Recording is empty"))
          return
        }
        resolve(blob)
      }

      mediaRecorder.stop()
    })
  }, [])

  return { isRecording, startRecording, stopRecording, getAccumulatedBlob, error }
}
