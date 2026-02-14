import { useEffect, useState } from "react"

export interface SpeakerStyle {
  readonly id: number
  readonly name: string
}

export interface Speaker {
  readonly id: number
  readonly name: string
  readonly styles: readonly SpeakerStyle[]
}

interface UseSpeakersResult {
  readonly speakers: readonly Speaker[]
  readonly isLoading: boolean
  readonly error: string | null
}

interface SpeakersApiResponse {
  readonly speakers: readonly Speaker[]
}

export function useSpeakers(): UseSpeakersResult {
  const [speakers, setSpeakers] = useState<readonly Speaker[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    const fetchSpeakers = async () => {
      try {
        const res = await fetch("/api/speakers")
        if (!res.ok) {
          throw new Error(`Failed to fetch speakers: ${res.status}`)
        }
        const data: SpeakersApiResponse = await res.json()
        if (!cancelled) {
          setSpeakers(data.speakers)
        }
      } catch (err) {
        if (!cancelled) {
          const message =
            err instanceof Error ? err.message : "Failed to fetch speakers"
          setError(message)
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    fetchSpeakers()

    return () => {
      cancelled = true
    }
  }, [])

  return { speakers, isLoading, error }
}
