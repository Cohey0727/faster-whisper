import { useCallback } from "react"
import { AppTemplate } from "./components/templates"
import { AvatarCanvas } from "./components/organisms"
import { ChatPanel, RecordButton } from "./components/molecules"
import { useChat } from "./hooks/useChat"

export function App() {
  const {
    sendAudio,
    startLiveTranscription,
    stopLiveTranscription,
    messages,
    liveTranscript,
    visemes,
    audioBase64,
    isLoading,
    error,
    action,
  } = useChat()

  const handleRecorded = useCallback(
    (blob: Blob) => {
      sendAudio(blob)
    },
    [sendAudio],
  )

  return (
    <AppTemplate
      avatar={<AvatarCanvas visemes={visemes} audioBase64={audioBase64} action={action} />}
      chatContent={
        <ChatPanel
          messages={messages}
          liveTranscript={liveTranscript}
          isLoading={isLoading}
          error={error}
        />
      }
      recordButton={
        <RecordButton
          onRecorded={handleRecorded}
          onRecordingStart={startLiveTranscription}
          onRecordingStop={stopLiveTranscription}
          disabled={isLoading}
        />
      }
    />
  )
}
