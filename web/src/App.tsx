import { useCallback, useState } from "react"
import { AppTemplate } from "./components/templates"
import { AvatarCanvas, SettingsDrawer } from "./components/organisms"
import { ChatInput, ChatPanel, DebugConsole, RecordButton, SettingsButton } from "./components/molecules"
import { useChat } from "./hooks/useChat"
import { useDebugLog } from "./hooks/useDebugLog"
import { useSettings } from "./hooks/useSettings"
import { useSpeakers } from "./hooks/useSpeakers"
import { getModelPath } from "./lib/avatarPresets"

export function App() {
  const { settings, updateAvatar, updateSpeaker } = useSettings()
  const { speakers, isLoading: speakersLoading, error: speakersError } = useSpeakers()
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  const {
    sendAudio,
    sendText,
    startLiveTranscription,
    stopLiveTranscription,
    messages,
    liveTranscript,
    pendingTranscript,
    visemes,
    audioBase64,
    isLoading,
    error,
    action,
  } = useChat()

  const debugLog = useDebugLog({
    action,
    audioBase64,
    visemeCount: visemes.length,
  })

  const handleRecorded = useCallback(
    (blob: Blob) => {
      sendAudio(blob, settings.speakerId)
    },
    [sendAudio, settings.speakerId],
  )

  const handleSendText = useCallback(
    (text: string) => {
      sendText(text, settings.speakerId)
    },
    [sendText, settings.speakerId],
  )

  const handleOpenSettings = useCallback(() => {
    setIsSettingsOpen(true)
  }, [])

  const handleCloseSettings = useCallback(() => {
    setIsSettingsOpen(false)
  }, [])

  const modelUrl = getModelPath(settings.avatarId)

  return (
    <>
      <AppTemplate
        avatar={
          <AvatarCanvas
            visemes={visemes}
            audioBase64={audioBase64}
            action={action}
            modelUrl={modelUrl}
          />
        }
        settingsButton={<SettingsButton onClick={handleOpenSettings} />}
        debugConsole={
          <DebugConsole
            entries={debugLog.entries}
            isVisible={debugLog.isVisible}
            onToggle={debugLog.toggleVisible}
            onClear={debugLog.clear}
          />
        }
        chatContent={
          <ChatPanel
            messages={messages}
            liveTranscript={liveTranscript}
            pendingTranscript={pendingTranscript}
            isLoading={isLoading}
            error={error}
          />
        }
        chatInput={<ChatInput onSend={handleSendText} disabled={isLoading} />}
        recordButton={
          <RecordButton
            onRecorded={handleRecorded}
            onRecordingStart={startLiveTranscription}
            onRecordingStop={stopLiveTranscription}
            disabled={isLoading}
          />
        }
      />
      <SettingsDrawer
        isOpen={isSettingsOpen}
        onClose={handleCloseSettings}
        settings={settings}
        onAvatarChange={updateAvatar}
        onSpeakerChange={updateSpeaker}
        speakers={speakers}
        speakersLoading={speakersLoading}
        speakersError={speakersError}
      />
    </>
  )
}
