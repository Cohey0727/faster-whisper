import { style } from "@vanilla-extract/css"
import { theme } from "../../../configs"

export const panel = style({
  display: "flex",
  flexDirection: "column",
  gap: theme.space.md,
  padding: theme.space.lg,
  overflowY: "auto",
  flex: 1,
})

const bubbleBase = style({
  maxWidth: "85%",
  padding: `${theme.space.md} ${theme.space.lg}`,
  fontSize: theme.fontSizes.md,
  lineHeight: "1.5",
  margin: 0,
})

export const userBubble = style([
  bubbleBase,
  {
    alignSelf: "flex-end",
    backgroundColor: "rgba(99, 102, 241, 0.25)",
    borderRadius: "16px 16px 4px 16px",
  },
])

export const userBubbleLive = style([
  bubbleBase,
  {
    alignSelf: "flex-end",
    backgroundColor: "rgba(99, 102, 241, 0.15)",
    borderRadius: "16px 16px 4px 16px",
    color: theme.colors.textMuted,
    fontStyle: "italic",
  },
])

export const aiBubble = style([
  bubbleBase,
  {
    alignSelf: "flex-start",
    backgroundColor: theme.colors.surface,
    borderRadius: "16px 16px 16px 4px",
    backdropFilter: "blur(8px)",
  },
])

export const label = style({
  fontSize: theme.fontSizes.xs,
  textTransform: "uppercase",
  letterSpacing: "1px",
  color: theme.colors.textLabel,
  marginBottom: `calc(-1 * ${theme.space.sm})`,
})

export const labelRight = style([
  label,
  { alignSelf: "flex-end" },
])

export const labelLeft = style([
  label,
  { alignSelf: "flex-start" },
])

export const errorBubble = style([
  bubbleBase,
  {
    alignSelf: "center",
    backgroundColor: "rgba(255, 107, 107, 0.15)",
    borderRadius: theme.borderRadius.lg,
    color: theme.colors.error,
    textAlign: "center",
  },
])

export const thinkingDots = style([
  bubbleBase,
  {
    alignSelf: "flex-start",
    backgroundColor: theme.colors.surface,
    borderRadius: "16px 16px 16px 4px",
    color: theme.colors.textMuted,
  },
])
