interface ChatPanelProps {
  readonly transcript: string
  readonly liveTranscript: string
  readonly response: string
  readonly isLoading: boolean
  readonly error: string | null
}

const panelStyle: React.CSSProperties = {
  position: "fixed",
  bottom: 100,
  left: "50%",
  transform: "translateX(-50%)",
  width: "90%",
  maxWidth: 600,
  padding: 16,
  backgroundColor: "rgba(0, 0, 0, 0.7)",
  borderRadius: 12,
  color: "#fff",
  zIndex: 10,
  backdropFilter: "blur(8px)",
}

const labelStyle: React.CSSProperties = {
  fontSize: 11,
  textTransform: "uppercase" as const,
  letterSpacing: 1,
  color: "rgba(255, 255, 255, 0.5)",
  marginBottom: 4,
}

const textStyle: React.CSSProperties = {
  fontSize: 14,
  lineHeight: 1.5,
  margin: 0,
}

const errorStyle: React.CSSProperties = {
  ...textStyle,
  color: "#ff6b6b",
}

const dividerStyle: React.CSSProperties = {
  height: 1,
  backgroundColor: "rgba(255, 255, 255, 0.15)",
  margin: "10px 0",
}

const liveTextStyle: React.CSSProperties = {
  ...textStyle,
  color: "rgba(255, 255, 255, 0.6)",
  fontStyle: "italic",
}

export function ChatPanel({
  transcript,
  liveTranscript,
  response,
  isLoading,
  error,
}: ChatPanelProps) {
  const displayTranscript = liveTranscript || transcript

  if (!displayTranscript && !response && !isLoading && !error) {
    return null
  }

  return (
    <div style={panelStyle}>
      {error && <p style={errorStyle}>{error}</p>}

      {liveTranscript && (
        <div>
          <div style={labelStyle}>You</div>
          <p style={liveTextStyle}>{liveTranscript}</p>
        </div>
      )}

      {!liveTranscript && transcript && (
        <div>
          <div style={labelStyle}>You</div>
          <p style={textStyle}>{transcript}</p>
        </div>
      )}

      {displayTranscript && (response || isLoading) && (
        <div style={dividerStyle} />
      )}

      {isLoading && <p style={textStyle}>Thinking...</p>}

      {response && !isLoading && (
        <div>
          <div style={labelStyle}>AI</div>
          <p style={textStyle}>{response}</p>
        </div>
      )}
    </div>
  )
}
