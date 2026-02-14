import { AVATAR_PRESETS } from "../../../lib/avatarPresets"
import * as styles from "./SettingsDrawer.css"

interface AvatarSelectorProps {
  readonly selectedId: string
  readonly onSelect: (avatarId: string) => void
}

const AVATAR_ICONS = ["A", "B", "C", "D", "E"] as const

export function AvatarSelector({ selectedId, onSelect }: AvatarSelectorProps) {
  return (
    <div className={styles.section}>
      <div className={styles.sectionTitle}>Avatar</div>
      <div className={styles.avatarGrid}>
        {AVATAR_PRESETS.map((preset, index) => {
          const isSelected = preset.id === selectedId
          const className = isSelected
            ? `${styles.avatarCard} ${styles.avatarCardSelected}`
            : styles.avatarCard

          return (
            <button
              key={preset.id}
              className={className}
              onClick={() => onSelect(preset.id)}
              type="button"
            >
              <div className={styles.avatarIcon}>
                {AVATAR_ICONS[index] ?? "?"}
              </div>
              <div className={styles.avatarName}>{preset.name}</div>
              <div className={styles.avatarDescription}>
                {preset.description}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
