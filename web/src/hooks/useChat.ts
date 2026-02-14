import { useCallback, useEffect, useRef, useState } from "react"
import type { AvatarAction } from "../lib/avatarActions"

export type { AvatarAction } from "../lib/avatarActions"

export interface Viseme {
  readonly time: number
  readonly duration: number
  readonly vowel: string
}

export interface ChatMessage {
  readonly id?: number
  readonly role: "user" | "assistant"
  readonly content: string
  readonly createdAt?: string
}

interface UseChatResult {
  readonly sendAudio: (audioBlob: Blob) => Promise<void>
  readonly startLiveTranscription: (getBlob: () => Blob | null) => void
  readonly stopLiveTranscription: () => void
  readonly messages: readonly ChatMessage[]
  readonly liveTranscript: string
  readonly visemes: readonly Viseme[]
  readonly audioBase64: string
  readonly isLoading: boolean
  readonly error: string | null
  readonly action: AvatarAction
}

interface ChatApiResponse {
  readonly transcript: string
  readonly response: string
  readonly audioBase64: string
  readonly visemes: readonly Viseme[]
  readonly action: AvatarAction
}

interface TranscribeApiResponse {
  readonly transcript: string
}

interface MessagesApiResponse {
  readonly messages: readonly ChatMessage[]
}

const LIVE_TRANSCRIPTION_POLL_MS = 1000

export function useChat(): UseChatResult {
  const [messages, setMessages] = useState<readonly ChatMessage[]>([])
  const [liveTranscript, setLiveTranscript] = useState("")
  const [visemes, setVisemes] = useState<readonly Viseme[]>([])
  const [audioBase64, setAudioBase64] = useState("")
  const [action, setAction] = useState<AvatarAction>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const abortRef = useRef<AbortController | null>(null)
  const isLiveRef = useRef(false)

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch("/api/messages")
        if (!res.ok) return
        const data: MessagesApiResponse = await res.json()
        setMessages(data.messages)
      } catch {
        /* ignore fetch errors on initial load */
      }
    }
    fetchHistory()
  }, [])

  const stopLiveTranscription = useCallback(() => {
    isLiveRef.current = false
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    if (abortRef.current) {
      abortRef.current.abort()
      abortRef.current = null
    }
  }, [])

  useEffect(() => {
    return () => {
      stopLiveTranscription()
    }
  }, [stopLiveTranscription])

  const startLiveTranscription = useCallback(
    (getBlob: () => Blob | null) => {
      stopLiveTranscription()
      setLiveTranscript("")
      isLiveRef.current = true

      intervalRef.current = setInterval(async () => {
        if (!isLiveRef.current) return

        const blob = getBlob()
        if (!blob || blob.size === 0) return

        if (abortRef.current) {
          abortRef.current.abort()
        }

        const controller = new AbortController()
        abortRef.current = controller

        try {
          const formData = new FormData()
          formData.append("audio", blob, "recording.webm")

          const res = await fetch("/api/transcribe", {
            method: "POST",
            body: formData,
            signal: controller.signal,
          })

          if (!res.ok || !isLiveRef.current) return

          const data: TranscribeApiResponse = await res.json()
          if (data.transcript && isLiveRef.current) {
            setLiveTranscript(data.transcript)
          }
        } catch {
          /* aborted or network error -- ignore during live transcription */
        }
      }, LIVE_TRANSCRIPTION_POLL_MS)
    },
    [stopLiveTranscription],
  )

  const sendAudio = useCallback(async (audioBlob: Blob) => {
    setIsLoading(true)
    setError(null)
    setLiveTranscript("")

    try {
      const formData = new FormData()
      formData.append("audio", audioBlob, "recording.webm")

      const res = await fetch("/api/chat", {
        method: "POST",
        body: formData,
      })

      if (!res.ok) {
        throw new Error(`Server error: ${res.status}`)
      }

      const data: ChatApiResponse = await res.json()

      setMessages((prev) => [
        ...prev,
        { role: "user", content: data.transcript },
        { role: "assistant", content: data.response },
      ])
      setVisemes(data.visemes)
      setAudioBase64(data.audioBase64)
      setAction(data.action)
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to send audio"
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    sendAudio,
    startLiveTranscription,
    stopLiveTranscription,
    messages,
    liveTranscript,
    visemes,
    audioBase64,
    isLoading,
    error,
    action,
  }
}
