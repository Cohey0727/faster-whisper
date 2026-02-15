import { useEffect, useRef } from "react"
import type { DebugEntry } from "../../../hooks/useDebugLog"
import * as styles from "./DebugConsole.css"

interface DebugConsoleProps {
  readonly entries: readonly DebugEntry[]
  readonly isVisible: boolean
  readonly onToggle: () => void
  readonly onClear: () => void
}

const TYPE_STYLES: Record<DebugEntry["type"], string> = {
  action: styles.entryAction,
  audio: styles.entryAudio,
  viseme: styles.entryViseme,
  info: styles.entryInfo,
}

export function DebugConsole({
  entries,
  isVisible,
  onToggle,
  onClear,
}: DebugConsoleProps) {
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (listRef.current && isVisible) {
      listRef.current.scrollTop = listRef.current.scrollHeight
    }
  }, [entries, isVisible])

  const buttonClassName = isVisible
    ? `${styles.toggleButton} ${styles.toggleButtonActive}`
    : styles.toggleButton

  return (
    <>
      <button
        className={buttonClassName}
        onClick={onToggle}
        type="button"
        aria-label="Toggle debug console (F2)"
        title="Debug Console (F2)"
      >
        {">_"}
      </button>
      {isVisible && (
        <div className={styles.panel}>
          <div className={styles.header}>
            <span className={styles.headerTitle}>Debug</span>
            <button
              className={styles.clearButton}
              onClick={onClear}
              type="button"
            >
              clear
            </button>
          </div>
          <div ref={listRef} className={styles.entries}>
            {entries.length === 0 ? (
              <div className={styles.emptyMessage}>
                Waiting for events...
              </div>
            ) : (
              entries.map((e) => (
                <div key={e.id} className={styles.entry}>
                  <span className={styles.entryTimestamp}>{e.timestamp}</span>
                  <span className={TYPE_STYLES[e.type]}>{e.message}</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </>
  )
}
