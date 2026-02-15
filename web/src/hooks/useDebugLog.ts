import { useCallback, useEffect, useRef, useState } from "react"
import type { AvatarAction } from "../lib/avatarActions"

export interface DebugEntry {
  readonly id: number
  readonly timestamp: string
  readonly type: "action" | "audio" | "viseme" | "info"
  readonly message: string
}

interface UseDebugLogResult {
  readonly entries: readonly DebugEntry[]
  readonly isVisible: boolean
  readonly toggleVisible: () => void
  readonly clear: () => void
}

const MAX_ENTRIES = 50

let nextId = 0

function formatTime(): string {
  const d = new Date()
  const h = String(d.getHours()).padStart(2, "0")
  const m = String(d.getMinutes()).padStart(2, "0")
  const s = String(d.getSeconds()).padStart(2, "0")
  const ms = String(d.getMilliseconds()).padStart(3, "0")
  return `${h}:${m}:${s}.${ms}`
}

export function useDebugLog(deps: {
  readonly action: AvatarAction
  readonly audioBase64: string
  readonly visemeCount: number
}): UseDebugLogResult {
  const [entries, setEntries] = useState<readonly DebugEntry[]>([])
  const [isVisible, setIsVisible] = useState(false)
  const prevActionRef = useRef<AvatarAction>(null)
  const prevAudioRef = useRef("")

  const addEntry = useCallback(
    (type: DebugEntry["type"], message: string) => {
      const entry: DebugEntry = {
        id: nextId++,
        timestamp: formatTime(),
        type,
        message,
      }
      setEntries((prev) => [...prev.slice(-(MAX_ENTRIES - 1)), entry])
    },
    [],
  )

  useEffect(() => {
    if (deps.action !== prevActionRef.current) {
      prevActionRef.current = deps.action
      if (deps.action) {
        addEntry("action", `Action: ${deps.action}`)
      }
    }
  }, [deps.action, addEntry])

  useEffect(() => {
    if (deps.audioBase64 && deps.audioBase64 !== prevAudioRef.current) {
      prevAudioRef.current = deps.audioBase64
      const sizeKB = Math.round((deps.audioBase64.length * 3) / 4 / 1024)
      addEntry("audio", `Audio received (${sizeKB}KB)`)
    }
  }, [deps.audioBase64, addEntry])

  useEffect(() => {
    if (deps.visemeCount > 0) {
      addEntry("viseme", `Visemes: ${deps.visemeCount} phonemes`)
    }
  }, [deps.visemeCount, addEntry])

  const toggleVisible = useCallback(() => {
    setIsVisible((prev) => !prev)
  }, [])

  const clear = useCallback(() => {
    setEntries([])
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "F2") {
        e.preventDefault()
        setIsVisible((prev) => !prev)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  return { entries, isVisible, toggleVisible, clear }
}
