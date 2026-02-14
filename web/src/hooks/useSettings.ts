import { useCallback, useState } from "react"
import { getPresetById } from "../lib/avatarPresets"

export interface Settings {
  readonly avatarId: string
  readonly speakerId: number
}

interface UseSettingsResult {
  readonly settings: Settings
  readonly updateAvatar: (avatarId: string) => void
  readonly updateSpeaker: (speakerId: number) => void
}

const STORAGE_KEY = "avatar-settings"

const DEFAULT_SETTINGS: Settings = {
  avatarId: "avatar_A",
  speakerId: 1,
}

function loadSettings(): Settings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_SETTINGS

    const parsed = JSON.parse(raw) as Partial<Settings>
    return {
      avatarId:
        typeof parsed.avatarId === "string" && getPresetById(parsed.avatarId)
          ? parsed.avatarId
          : DEFAULT_SETTINGS.avatarId,
      speakerId:
        typeof parsed.speakerId === "number"
          ? parsed.speakerId
          : DEFAULT_SETTINGS.speakerId,
    }
  } catch {
    return DEFAULT_SETTINGS
  }
}

function saveSettings(settings: Settings): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
  } catch {
    /* storage full or unavailable */
  }
}

export function useSettings(): UseSettingsResult {
  const [settings, setSettings] = useState<Settings>(loadSettings)

  const updateAvatar = useCallback((avatarId: string) => {
    if (!getPresetById(avatarId)) return
    setSettings((prev) => {
      const next = { ...prev, avatarId }
      saveSettings(next)
      return next
    })
  }, [])

  const updateSpeaker = useCallback((speakerId: number) => {
    setSettings((prev) => {
      const next = { ...prev, speakerId }
      saveSettings(next)
      return next
    })
  }, [])

  return { settings, updateAvatar, updateSpeaker }
}
