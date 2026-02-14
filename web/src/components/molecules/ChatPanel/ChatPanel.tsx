import { useEffect, useMemo, useRef } from "react"
import type { ChatMessage } from "../../../hooks/useChat"
import * as styles from "./ChatPanel.css"

interface ChatPanelProps {
  readonly messages: readonly ChatMessage[]
  readonly liveTranscript: string
  readonly isLoading: boolean
  readonly error: string | null
}

function formatTime(dateStr: string | undefined): string {
  if (!dateStr) return ""
  const d = new Date(dateStr)
  if (Number.isNaN(d.getTime())) return ""
  return d.toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" })
}

function formatDateLabel(dateStr: string): string {
  const d = new Date(dateStr)
  if (Number.isNaN(d.getTime())) return ""
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const target = new Date(d.getFullYear(), d.getMonth(), d.getDate())
  const diffDays = Math.floor(
    (today.getTime() - target.getTime()) / (1000 * 60 * 60 * 24),
  )

  if (diffDays === 0) return "Today"
  if (diffDays === 1) return "Yesterday"
  return d.toLocaleDateString("ja-JP", {
    month: "short",
    day: "numeric",
    weekday: "short",
  })
}

function getDateKey(dateStr: string | undefined): string {
  if (!dateStr) return ""
  const d = new Date(dateStr)
  if (Number.isNaN(d.getTime())) return ""
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
}

function isGroupedWithPrev(
  messages: readonly ChatMessage[],
  index: number,
): boolean {
  if (index === 0) return false
  const prev = messages[index - 1]
  const curr = messages[index]
  return prev.role === curr.role
}

function isLastInGroup(
  messages: readonly ChatMessage[],
  index: number,
): boolean {
  if (index === messages.length - 1) return true
  return messages[index + 1].role !== messages[index].role
}

function TypingIndicator() {
  return (
    <div className={styles.typingRow} role="status" aria-label="AI is typing">
      <div className={styles.avatarIconAi} aria-hidden="true">AI</div>
      <div className={styles.typingBubble} aria-hidden="true">
        <span className={styles.typingDot} />
        <span className={styles.typingDot} />
        <span className={styles.typingDot} />
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <div className={styles.emptyState} role="status">
      <div className={styles.emptyIcon} aria-hidden="true">
        <svg
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      </div>
      <p className={styles.emptyText}>
        Hold the mic button to start talking
      </p>
    </div>
  )
}

function DateSeparator({ dateStr }: { readonly dateStr: string }) {
  return (
    <div className={styles.dateSeparator}>
      <div className={styles.dateLine} />
      <span className={styles.dateLabel}>{formatDateLabel(dateStr)}</span>
      <div className={styles.dateLine} />
    </div>
  )
}

function MessageBubble({
  message,
  grouped,
  showAvatar,
  showTimestamp,
}: {
  readonly message: ChatMessage
  readonly grouped: boolean
  readonly showAvatar: boolean
  readonly showTimestamp: boolean
}) {
  const isUser = message.role === "user"

  const rowClass = isUser ? styles.messageRowUser : styles.messageRowAi

  const bubbleClass = isUser
    ? grouped
      ? styles.userBubbleGrouped
      : styles.userBubble
    : grouped
      ? styles.aiBubbleGrouped
      : styles.aiBubble

  const avatarClass = isUser ? styles.avatarIconUser : styles.avatarIconAi

  return (
    <>
      <div className={rowClass}>
        {showAvatar ? (
          <div className={avatarClass}>{isUser ? "You" : "AI"}</div>
        ) : (
          <div className={styles.avatarIconHidden} />
        )}
        <div>
          <p className={bubbleClass}>{message.content}</p>
          {showTimestamp && message.createdAt && (
            <div
              className={
                isUser ? styles.timestampRight : styles.timestampLeft
              }
            >
              {formatTime(message.createdAt)}
            </div>
          )}
        </div>
      </div>
    </>
  )
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

  const dateSeparatorIndices = useMemo(() => {
    const indices = new Set<number>()
    let prev = ""
    for (let i = 0; i < messages.length; i++) {
      const key = getDateKey(messages[i].createdAt)
      if (key !== "" && key !== prev) {
        indices.add(i)
        prev = key
      }
    }
    return indices
  }, [messages])

  if (messages.length === 0 && !liveTranscript && !isLoading && !error) {
    return <EmptyState />
  }

  return (
    <div className={styles.panel}>
      {messages.map((msg, i) => {
        const showDate =
          dateSeparatorIndices.has(i) && msg.createdAt !== undefined

        const grouped = isGroupedWithPrev(messages, i)
        const lastInGroup = isLastInGroup(messages, i)

        return (
          <div key={msg.id ?? i}>
            {showDate && msg.createdAt && (
              <DateSeparator dateStr={msg.createdAt} />
            )}
            <MessageBubble
              message={msg}
              grouped={grouped}
              showAvatar={lastInGroup}
              showTimestamp={lastInGroup}
            />
          </div>
        )
      })}

      {liveTranscript && (
        <div className={styles.messageRowUser}>
          <div className={styles.avatarIconUser}>You</div>
          <p className={styles.userBubbleLive}>{liveTranscript}</p>
        </div>
      )}

      {isLoading && <TypingIndicator />}

      {error && <p className={styles.errorBubble} role="alert">{error}</p>}

      <div ref={bottomRef} />
    </div>
  )
}
