import * as styles from "./SettingsButton.css"

interface SettingsButtonProps {
  readonly onClick: () => void
}

export function SettingsButton({ onClick }: SettingsButtonProps) {
  return (
    <button
      className={styles.button}
      onClick={onClick}
      type="button"
      aria-label="Open settings"
    >
      &#x2699;
    </button>
  )
}
