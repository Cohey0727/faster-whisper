import { useEffect, useRef, useCallback } from "react"
import type { VRM } from "@pixiv/three-vrm"
import type { Viseme } from "./useChat"
import { getVrmExpression, ALL_VOWEL_EXPRESSIONS } from "../lib/visemeMap"

interface UseLipSyncParams {
  readonly vrm: VRM | null
  readonly audioBase64: string
  readonly visemes: readonly Viseme[]
}

function resetAllVowels(vrm: VRM): void {
  for (const expr of ALL_VOWEL_EXPRESSIONS) {
    vrm.expressionManager?.setValue(expr, 0)
  }
}

function smoothWeight(t: number): number {
  return Math.sin(t * Math.PI)
}

export function useLipSync({
  vrm,
  audioBase64,
  visemes,
}: UseLipSyncParams): void {
  const animationFrameRef = useRef<number>(0)
  const audioContextRef = useRef<AudioContext | null>(null)
  const startTimeRef = useRef(0)
  const isPlayingRef = useRef(false)

  const cleanup = useCallback(() => {
    isPlayingRef.current = false
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
      animationFrameRef.current = 0
    }
    if (vrm) {
      resetAllVowels(vrm)
    }
  }, [vrm])

  useEffect(() => {
    if (!vrm || !audioBase64 || visemes.length === 0) {
      return
    }

    let cancelled = false

    const play = async () => {
      try {
        if (!audioContextRef.current) {
          audioContextRef.current = new AudioContext()
        }

        const audioContext = audioContextRef.current
        const binaryString = atob(audioBase64)
        const bytes = Uint8Array.from(binaryString, (c) => c.charCodeAt(0))
        const audioBuffer = await audioContext.decodeAudioData(
          bytes.buffer.slice(0),
        )

        if (cancelled) return

        const source = audioContext.createBufferSource()
        source.buffer = audioBuffer
        source.connect(audioContext.destination)

        isPlayingRef.current = true
        startTimeRef.current = audioContext.currentTime

        source.onended = () => {
          if (!cancelled) {
            cleanup()
          }
        }

        source.start()

        const animate = () => {
          if (cancelled || !isPlayingRef.current) return

          const elapsed = audioContext.currentTime - startTimeRef.current

          resetAllVowels(vrm)

          const currentViseme = visemes.find(
            (v) => elapsed >= v.time && elapsed < v.time + v.duration,
          )

          if (currentViseme) {
            const expression = getVrmExpression(currentViseme.vowel)
            if (expression) {
              const progress =
                currentViseme.duration > 0
                  ? (elapsed - currentViseme.time) / currentViseme.duration
                  : 0
              const weight = smoothWeight(Math.min(progress, 1))
              vrm.expressionManager?.setValue(expression, weight)
            }
          }

          animationFrameRef.current = requestAnimationFrame(animate)
        }

        animationFrameRef.current = requestAnimationFrame(animate)
      } catch {
        cleanup()
      }
    }

    play()

    return () => {
      cancelled = true
      cleanup()
    }
  }, [vrm, audioBase64, visemes, cleanup])
}
