import { useEffect, useRef } from "react"
import type { ChatMessage } from "../../../hooks/useChat"
import * as styles from "./ChatPanel.css"

interface ChatPanelProps {
  readonly messages: readonly ChatMessage[]
  readonly liveTranscript: string
  readonly isLoading: boolean
  readonly error: string | null
}

export function ChatPanel({
  messages,
  liveTranscript,
  isLoading,
  error,
}: ChatPanelProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, liveTranscript, isLoading])

  if (messages.length === 0 && !liveTranscript && !isLoading && !error) {
    return null
  }

  return (
    <div className={styles.panel}>
      {messages.map((msg, i) => (
        <div key={msg.id ?? i}>
          <div
            className={
              msg.role === "user" ? styles.labelRight : styles.labelLeft
            }
          >
            {msg.role === "user" ? "You" : "AI"}
          </div>
          <p
            className={
              msg.role === "user" ? styles.userBubble : styles.aiBubble
            }
          >
            {msg.content}
          </p>
        </div>
      ))}

      {liveTranscript && (
        <>
          <div className={styles.labelRight}>You</div>
          <p className={styles.userBubbleLive}>{liveTranscript}</p>
        </>
      )}

      {isLoading && <p className={styles.thinkingDots}>Thinking...</p>}

      {error && <p className={styles.errorBubble}>{error}</p>}

      <div ref={bottomRef} />
    </div>
  )
}
