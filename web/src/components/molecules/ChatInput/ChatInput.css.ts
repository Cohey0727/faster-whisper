import { style } from "@vanilla-extract/css"
import { theme, mediaquery } from "../../../configs"

export const wrapper = style({
  display: "flex",
  alignItems: "center",
  gap: theme.space.sm,
  width: "100%",
  padding: `0 ${theme.space.md}`,
  "@media": {
    [mediaquery.md]: {
      padding: `0 ${theme.space.lg}`,
    },
  },
})

export const input = style({
  flex: 1,
  minWidth: 0,
  padding: "10px 16px",
  fontSize: theme.fontSizes.md,
  color: theme.colors.text,
  backgroundColor: "rgba(255, 255, 255, 0.08)",
  border: "1px solid rgba(255, 255, 255, 0.12)",
  borderRadius: theme.borderRadius.full,
  outline: "none",
  transition: "border-color 0.15s, background-color 0.15s",
  "::placeholder": {
    color: theme.colors.textMuted,
  },
  ":focus": {
    borderColor: "rgba(99, 102, 241, 0.5)",
    backgroundColor: "rgba(255, 255, 255, 0.12)",
  },
  ":disabled": {
    opacity: 0.5,
    cursor: "not-allowed",
  },
  "@media": {
    [mediaquery.md]: {
      fontSize: theme.fontSizes.lg,
      padding: "10px 20px",
    },
  },
})

export const sendButton = style({
  flexShrink: 0,
  width: "36px",
  height: "36px",
  borderRadius: theme.borderRadius.full,
  border: "none",
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  color: "#fff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  transition: "opacity 0.15s, transform 0.1s",
  ":hover": {
    opacity: 0.9,
  },
  ":active": {
    transform: "scale(0.92)",
  },
  ":disabled": {
    opacity: 0.4,
    cursor: "not-allowed",
    transform: "none",
  },
  "@media": {
    [mediaquery.md]: {
      width: "40px",
      height: "40px",
    },
  },
})
