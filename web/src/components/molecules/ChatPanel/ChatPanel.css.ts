import { keyframes, style } from "@vanilla-extract/css"
import { theme, mediaquery } from "../../../configs"

/* ── Animations ── */

const fadeInUp = keyframes({
  from: { opacity: 0, transform: "translateY(8px)" },
  to: { opacity: 1, transform: "translateY(0)" },
})

const dotBounce = keyframes({
  "0%, 60%, 100%": { transform: "translateY(0)" },
  "30%": { transform: "translateY(-4px)" },
})

/* ── Panel ── */

export const panel = style({
  display: "flex",
  flexDirection: "column",
  gap: "2px",
  padding: `${theme.space.md} ${theme.space.md}`,
  overflowY: "auto",
  flex: 1,
  scrollBehavior: "smooth",
  scrollbarWidth: "thin",
  scrollbarColor: "rgba(255,255,255,0.15) transparent",
  "::-webkit-scrollbar": {
    width: "4px",
  },
  "::-webkit-scrollbar-thumb": {
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: "2px",
  },
  "@media": {
    [mediaquery.md]: {
      padding: `${theme.space.lg} ${theme.space.xl}`,
    },
    "(prefers-reduced-motion: reduce)": {
      scrollBehavior: "auto",
    },
  },
})

/* ── Empty State ── */

export const emptyState = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  flex: 1,
  gap: theme.space.md,
  opacity: 0.5,
  userSelect: "none",
  padding: theme.space.xl,
})

export const emptyIcon = style({
  fontSize: "48px",
  lineHeight: 1,
})

export const emptyText = style({
  fontSize: theme.fontSizes.md,
  color: theme.colors.textMuted,
  textAlign: "center",
})

/* ── Date Separator ── */

export const dateSeparator = style({
  display: "flex",
  alignItems: "center",
  gap: theme.space.md,
  padding: `${theme.space.md} 0`,
  marginTop: theme.space.sm,
})

export const dateLine = style({
  flex: 1,
  height: "1px",
  backgroundColor: "rgba(255,255,255,0.08)",
})

export const dateLabel = style({
  fontSize: "11px",
  color: "rgba(255,255,255,0.35)",
  fontWeight: 500,
  letterSpacing: "0.5px",
  whiteSpace: "nowrap",
})

/* ── Message Row ── */

export const messageRow = style({
  display: "flex",
  gap: theme.space.sm,
  alignItems: "flex-end",
  animation: `${fadeInUp} 0.25s ease-out`,
  padding: `1px 0`,
  "@media": {
    "(prefers-reduced-motion: reduce)": {
      animation: "none",
    },
  },
})

export const messageRowUser = style([
  messageRow,
  {
    flexDirection: "row-reverse",
  },
])

export const messageRowAi = style([
  messageRow,
  {
    flexDirection: "row",
  },
])

/* ── Avatar Icon ── */

export const avatarIcon = style({
  width: "28px",
  height: "28px",
  borderRadius: theme.borderRadius.full,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "13px",
  flexShrink: 0,
  lineHeight: 1,
  marginBottom: "2px",
  "@media": {
    [mediaquery.md]: {
      width: "32px",
      height: "32px",
      fontSize: "14px",
    },
  },
})

export const avatarIconAi = style([
  avatarIcon,
  {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  },
])

export const avatarIconUser = style([
  avatarIcon,
  {
    background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
  },
])

export const avatarIconHidden = style([
  avatarIcon,
  { visibility: "hidden" },
])

/* ── Bubble ── */

const bubbleBase = style({
  maxWidth: "78%",
  padding: "10px 14px",
  fontSize: theme.fontSizes.md,
  lineHeight: "1.55",
  margin: 0,
  wordBreak: "break-word",
  "@media": {
    [mediaquery.md]: {
      maxWidth: "72%",
      fontSize: theme.fontSizes.lg,
      padding: "10px 16px",
    },
  },
})

export const userBubble = style([
  bubbleBase,
  {
    background: "linear-gradient(135deg, rgba(99, 102, 241, 0.35) 0%, rgba(139, 92, 246, 0.35) 100%)",
    borderRadius: "18px 18px 4px 18px",
    color: "#fff",
  },
])

export const userBubbleGrouped = style([
  bubbleBase,
  {
    background: "linear-gradient(135deg, rgba(99, 102, 241, 0.35) 0%, rgba(139, 92, 246, 0.35) 100%)",
    borderRadius: "18px 4px 4px 18px",
    color: "#fff",
  },
])

export const userBubbleLive = style([
  bubbleBase,
  {
    background: "rgba(99, 102, 241, 0.15)",
    borderRadius: "18px 18px 4px 18px",
    color: theme.colors.textMuted,
    fontStyle: "italic",
    border: "1px dashed rgba(99, 102, 241, 0.3)",
  },
])

export const aiBubble = style([
  bubbleBase,
  {
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: "18px 18px 18px 4px",
    backdropFilter: "blur(12px)",
    color: "rgba(255, 255, 255, 0.92)",
    border: "1px solid rgba(255, 255, 255, 0.06)",
  },
])

export const aiBubbleGrouped = style([
  bubbleBase,
  {
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: "4px 18px 18px 4px",
    backdropFilter: "blur(12px)",
    color: "rgba(255, 255, 255, 0.92)",
    border: "1px solid rgba(255, 255, 255, 0.06)",
  },
])

/* ── Timestamp ── */

export const timestamp = style({
  fontSize: "10px",
  color: "rgba(255, 255, 255, 0.3)",
  marginTop: "2px",
  paddingLeft: "2px",
  paddingRight: "2px",
})

export const timestampRight = style([
  timestamp,
  { textAlign: "right" },
])

export const timestampLeft = style([
  timestamp,
  { textAlign: "left" },
])

/* ── Typing Indicator ── */

export const typingRow = style([
  messageRowAi,
  {
    animation: `${fadeInUp} 0.3s ease-out`,
  },
])

export const typingBubble = style({
  display: "flex",
  alignItems: "center",
  gap: "4px",
  padding: "12px 18px",
  backgroundColor: "rgba(255, 255, 255, 0.08)",
  borderRadius: "18px 18px 18px 4px",
  backdropFilter: "blur(12px)",
  border: "1px solid rgba(255, 255, 255, 0.06)",
})

export const typingDot = style({
  width: "6px",
  height: "6px",
  borderRadius: theme.borderRadius.full,
  backgroundColor: "rgba(255, 255, 255, 0.4)",
  animation: `${dotBounce} 1.2s ease-in-out infinite`,
  selectors: {
    "&:nth-child(2)": {
      animationDelay: "0.15s",
    },
    "&:nth-child(3)": {
      animationDelay: "0.3s",
    },
  },
})

/* ── Error ── */

export const errorBubble = style({
  alignSelf: "center",
  maxWidth: "85%",
  padding: "8px 16px",
  borderRadius: theme.borderRadius.lg,
  backgroundColor: "rgba(255, 107, 107, 0.12)",
  color: theme.colors.error,
  textAlign: "center",
  fontSize: theme.fontSizes.sm,
  border: "1px solid rgba(255, 107, 107, 0.2)",
  animation: `${fadeInUp} 0.25s ease-out`,
  margin: `${theme.space.sm} 0`,
})

/* ── Spacer ── */

export const spacer = style({
  height: theme.space.sm,
})
