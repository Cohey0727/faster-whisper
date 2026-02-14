import { useCallback } from "react"
import { AvatarCanvas } from "./components/AvatarCanvas"
import { ChatPanel } from "./components/ChatPanel"
import { RecordButton } from "./components/RecordButton"
import { useChat } from "./hooks/useChat"

const globalStyle = `
  @keyframes pulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(229, 62, 62, 0.5); }
    50% { box-shadow: 0 0 0 12px rgba(229, 62, 62, 0); }
  }
`

export function App() {
  const {
    sendAudio,
    startLiveTranscription,
    stopLiveTranscription,
    transcript,
    liveTranscript,
    response,
    visemes,
    audioBase64,
    isLoading,
    error,
  } = useChat()

  const handleRecorded = useCallback(
    (blob: Blob) => {
      sendAudio(blob)
    },
    [sendAudio],
  )

  return (
    <>
      <style>{globalStyle}</style>
      <AvatarCanvas visemes={visemes} audioBase64={audioBase64} />
      <ChatPanel
        transcript={transcript}
        liveTranscript={liveTranscript}
        response={response}
        isLoading={isLoading}
        error={error}
      />
      <RecordButton
        onRecorded={handleRecorded}
        onRecordingStart={startLiveTranscription}
        onRecordingStop={stopLiveTranscription}
        disabled={isLoading}
      />
    </>
  )
}
