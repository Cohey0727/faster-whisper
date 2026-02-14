import { style } from "@vanilla-extract/css"
import { theme } from "../../../configs"
import { pulse } from "../../../styles/global.css"

export const container = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: theme.space.sm,
})

export const button = style({
  width: "72px",
  height: "72px",
  borderRadius: theme.borderRadius.full,
  border: `3px solid ${theme.colors.buttonBorder}`,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "transform 0.15s ease",
  backgroundColor: theme.colors.buttonBg,
  ":disabled": {
    opacity: 0.5,
    cursor: "default",
  },
})

export const recording = style({
  backgroundColor: theme.colors.recording,
  animation: `${pulse} 1s infinite`,
})

export const pressing = style({
  transform: "scale(0.92)",
})

export const hint = style({
  color: theme.colors.textMuted,
  fontSize: theme.fontSizes.sm,
})

export const errorMsg = style({
  color: theme.colors.error,
  fontSize: theme.fontSizes.sm,
  maxWidth: "200px",
  textAlign: "center",
})
