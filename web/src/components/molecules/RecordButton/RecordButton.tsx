import { useCallback, useState } from "react"
import clsx from "clsx"
import { useAudioRecorder } from "../../../hooks/useAudioRecorder"
import { MicIcon } from "../MicIcon"
import * as styles from "./RecordButton.css"

interface RecordButtonProps {
  readonly onRecorded: (blob: Blob) => void
  readonly onRecordingStart: (getBlob: () => Blob | null) => void
  readonly onRecordingStop: () => void
  readonly disabled: boolean
}

export function RecordButton({
  onRecorded,
  onRecordingStart,
  onRecordingStop,
  disabled,
}: RecordButtonProps) {
  const {
    isRecording,
    startRecording,
    stopRecording,
    getAccumulatedBlob,
    error,
  } = useAudioRecorder()
  const [isPressing, setIsPressing] = useState(false)

  const handlePointerDown = useCallback(async () => {
    if (disabled) return
    setIsPressing(true)
    try {
      await startRecording()
      onRecordingStart(getAccumulatedBlob)
    } catch {
      setIsPressing(false)
    }
  }, [disabled, startRecording, onRecordingStart, getAccumulatedBlob])

  const handlePointerUp = useCallback(async () => {
    setIsPressing(false)
    if (!isRecording) return
    onRecordingStop()
    try {
      const blob = await stopRecording()
      onRecorded(blob)
    } catch {
      /* recording was not active */
    }
  }, [isRecording, stopRecording, onRecorded, onRecordingStop])

  return (
    <div className={styles.container}>
      <button
        type="button"
        className={clsx(
          styles.button,
          isRecording && styles.recording,
          isPressing && styles.pressing,
        )}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        disabled={disabled}
        aria-label={isRecording ? "Recording..." : "Hold to talk"}
      >
        <MicIcon recording={isRecording} />
      </button>
      {!isRecording && !error && (
        <span className={styles.hint}>Hold to talk</span>
      )}
      {isRecording && (
        <span className={styles.hint}>Release to send</span>
      )}
      {error && <span className={styles.errorMsg}>{error}</span>}
    </div>
  )
}
