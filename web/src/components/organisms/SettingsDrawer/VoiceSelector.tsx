import type { Speaker } from "../../../hooks/useSpeakers"
import * as styles from "./SettingsDrawer.css"

interface VoiceSelectorProps {
  readonly speakers: readonly Speaker[]
  readonly selectedId: number
  readonly isLoading: boolean
  readonly error: string | null
  readonly onSelect: (speakerId: number) => void
}

function isSpeakerSelected(speaker: Speaker, selectedId: number): boolean {
  return speaker.styles.some((s) => s.id === selectedId)
}

export function VoiceSelector({
  speakers,
  selectedId,
  isLoading,
  error,
  onSelect,
}: VoiceSelectorProps) {
  return (
    <div className={styles.section}>
      <div className={styles.sectionTitle}>Voice</div>
      {isLoading && (
        <div className={styles.loadingText}>Loading voices...</div>
      )}
      {error && <div className={styles.errorText}>{error}</div>}
      {!isLoading && !error && (
        <div className={styles.voiceList}>
          {speakers.map((speaker) => {
            const speakerSelected = isSpeakerSelected(speaker, selectedId)
            const itemClassName = speakerSelected
              ? `${styles.voiceItem} ${styles.voiceItemSelected}`
              : styles.voiceItem

            return (
              <div key={speaker.id} className={itemClassName}>
                <div className={styles.voiceName}>{speaker.name}</div>
                <div className={styles.voiceStyles}>
                  {speaker.styles.map((s) => {
                    const chipClassName =
                      s.id === selectedId
                        ? `${styles.styleChip} ${styles.styleChipSelected}`
                        : styles.styleChip

                    return (
                      <button
                        key={s.id}
                        className={chipClassName}
                        onClick={() => onSelect(s.id)}
                        type="button"
                      >
                        {s.name}
                      </button>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
