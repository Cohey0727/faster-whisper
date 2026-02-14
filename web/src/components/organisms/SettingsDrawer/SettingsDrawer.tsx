import { useCallback, useEffect } from "react"
import type { Settings } from "../../../hooks/useSettings"
import type { Speaker } from "../../../hooks/useSpeakers"
import { AvatarSelector } from "./AvatarSelector"
import { VoiceSelector } from "./VoiceSelector"
import * as styles from "./SettingsDrawer.css"

interface SettingsDrawerProps {
  readonly isOpen: boolean
  readonly onClose: () => void
  readonly settings: Settings
  readonly onAvatarChange: (avatarId: string) => void
  readonly onSpeakerChange: (speakerId: number) => void
  readonly speakers: readonly Speaker[]
  readonly speakersLoading: boolean
  readonly speakersError: string | null
}

export function SettingsDrawer({
  isOpen,
  onClose,
  settings,
  onAvatarChange,
  onSpeakerChange,
  speakers,
  speakersLoading,
  speakersError,
}: SettingsDrawerProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      }
    },
    [onClose],
  )

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown)
      return () => document.removeEventListener("keydown", handleKeyDown)
    }
  }, [isOpen, handleKeyDown])

  const overlayClassName = isOpen
    ? `${styles.overlay} ${styles.overlayVisible}`
    : styles.overlay

  const drawerClassName = isOpen
    ? `${styles.drawer} ${styles.drawerOpen}`
    : styles.drawer

  return (
    <>
      {isOpen && (
        <div
          className={overlayClassName}
          onClick={onClose}
          role="presentation"
        />
      )}
      <div className={drawerClassName} role="dialog" aria-label="Settings">
        <div className={styles.header}>
          <h2 className={styles.headerTitle}>Settings</h2>
          <button
            className={styles.closeButton}
            onClick={onClose}
            type="button"
            aria-label="Close settings"
          >
            &times;
          </button>
        </div>
        <div className={styles.content}>
          <AvatarSelector
            selectedId={settings.avatarId}
            onSelect={onAvatarChange}
          />
          <VoiceSelector
            speakers={speakers}
            selectedId={settings.speakerId}
            isLoading={speakersLoading}
            error={speakersError}
            onSelect={onSpeakerChange}
          />
        </div>
      </div>
    </>
  )
}
