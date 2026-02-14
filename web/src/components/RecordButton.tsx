import { useCallback, useState } from "react"
import { useAudioRecorder } from "../hooks/useAudioRecorder"

interface RecordButtonProps {
  readonly onRecorded: (blob: Blob) => void
  readonly onRecordingStart: (getBlob: () => Blob | null) => void
  readonly onRecordingStop: () => void
  readonly disabled: boolean
}

const containerStyle: React.CSSProperties = {
  position: "fixed",
  bottom: 24,
  left: "50%",
  transform: "translateX(-50%)",
  zIndex: 10,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 8,
}

const baseButtonStyle: React.CSSProperties = {
  width: 72,
  height: 72,
  borderRadius: "50%",
  border: "3px solid #fff",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "transform 0.15s ease",
}

const hintStyle: React.CSSProperties = {
  color: "rgba(255, 255, 255, 0.6)",
  fontSize: 12,
}

const errorMsgStyle: React.CSSProperties = {
  color: "#ff6b6b",
  fontSize: 12,
  maxWidth: 200,
  textAlign: "center" as const,
}

export function RecordButton({
  onRecorded,
  onRecordingStart,
  onRecordingStop,
  disabled,
}: RecordButtonProps) {
  const { isRecording, startRecording, stopRecording, getAccumulatedBlob, error } =
    useAudioRecorder()
  const [pressing, setPressing] = useState(false)

  const handlePointerDown = useCallback(async () => {
    if (disabled) return
    setPressing(true)
    try {
      await startRecording()
      onRecordingStart(getAccumulatedBlob)
    } catch {
      setPressing(false)
    }
  }, [disabled, startRecording, onRecordingStart, getAccumulatedBlob])

  const handlePointerUp = useCallback(async () => {
    setPressing(false)
    if (!isRecording) return
    onRecordingStop()
    try {
      const blob = await stopRecording()
      onRecorded(blob)
    } catch {
      /* recording was not active */
    }
  }, [isRecording, stopRecording, onRecorded, onRecordingStop])

  const buttonStyle: React.CSSProperties = {
    ...baseButtonStyle,
    backgroundColor: isRecording ? "#e53e3e" : "rgba(255, 255, 255, 0.15)",
    transform: pressing ? "scale(0.92)" : "scale(1)",
    opacity: disabled ? 0.5 : 1,
    animation: isRecording ? "pulse 1s infinite" : "none",
  }

  return (
    <div style={containerStyle}>
      <button
        type="button"
        style={buttonStyle}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        disabled={disabled}
        aria-label={isRecording ? "Recording..." : "Hold to talk"}
      >
        <MicIcon recording={isRecording} />
      </button>
      {!isRecording && !error && <span style={hintStyle}>Hold to talk</span>}
      {isRecording && <span style={hintStyle}>Release to send</span>}
      {error && <span style={errorMsgStyle}>{error}</span>}
    </div>
  )
}

function MicIcon({ recording }: { readonly recording: boolean }) {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke={recording ? "#fff" : "rgba(255,255,255,0.8)"}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="9" y="1" width="6" height="12" rx="3" />
      <path d="M19 10v1a7 7 0 0 1-14 0v-1" />
      <line x1="12" y1="19" x2="12" y2="23" />
      <line x1="8" y1="23" x2="16" y2="23" />
    </svg>
  )
}
