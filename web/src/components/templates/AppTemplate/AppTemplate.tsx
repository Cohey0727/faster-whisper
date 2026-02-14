import { type ReactNode, useCallback, useEffect, useRef, useState } from "react"
import { useMediaQuery } from "../../../hooks/useMediaQuery"
import * as styles from "./AppTemplate.css"

interface AppTemplateProps {
  readonly chatContent: ReactNode
  readonly recordButton: ReactNode
  readonly avatar: ReactNode
}

const DEFAULT_PC_WIDTH = 0.4
const DEFAULT_SP_HEIGHT = 0.45
const MIN_RATIO = 0.2
const MAX_RATIO = 0.7

export function AppTemplate({
  chatContent,
  recordButton,
  avatar,
}: AppTemplateProps) {
  const isDesktop = useMediaQuery("md")
  const layoutRef = useRef<HTMLDivElement>(null)
  const [chatRatio, setChatRatio] = useState(
    isDesktop ? DEFAULT_PC_WIDTH : DEFAULT_SP_HEIGHT,
  )
  const draggingRef = useRef(false)

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault()
      draggingRef.current = true
      ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
    },
    [],
  )

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!draggingRef.current || !layoutRef.current) return

      const rect = layoutRef.current.getBoundingClientRect()

      // PC: chatArea is left, so ratio = x position from left
      // SP: chatArea is bottom, so ratio = distance from bottom
      const ratio = isDesktop
        ? (e.clientX - rect.left) / rect.width
        : 1 - (e.clientY - rect.top) / rect.height

      setChatRatio(Math.min(MAX_RATIO, Math.max(MIN_RATIO, ratio)))
    },
    [isDesktop],
  )

  const handlePointerUp = useCallback(() => {
    draggingRef.current = false
  }, [])

  useEffect(() => {
    setChatRatio(isDesktop ? DEFAULT_PC_WIDTH : DEFAULT_SP_HEIGHT)
  }, [isDesktop])

  const chatSize = isDesktop
    ? { width: `${chatRatio * 100}%` }
    : { height: `${chatRatio * 100}%` }

  const avatarSize = isDesktop
    ? { width: `${(1 - chatRatio) * 100}%` }
    : { height: `${(1 - chatRatio) * 100}%` }

  return (
    <div ref={layoutRef} className={styles.layout}>
      {/* DOM order: chat → handle → avatar */}
      {/* SP visual order via CSS: avatar(-1) → handle(0) → chat(1) */}
      <div className={styles.chatArea} style={chatSize}>
        <div className={styles.chatContent}>{chatContent}</div>
        <div className={styles.chatFooter}>{recordButton}</div>
      </div>
      <div
        className={styles.handle}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <div className={styles.handleKnob} />
      </div>
      <div className={styles.avatarArea} style={avatarSize}>
        {avatar}
      </div>
    </div>
  )
}
