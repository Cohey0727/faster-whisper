import { style } from "@vanilla-extract/css"
import { theme } from "../../../configs"

export const toggleButton = style({
  position: "absolute",
  bottom: theme.space.md,
  right: theme.space.md,
  width: "32px",
  height: "32px",
  borderRadius: theme.borderRadius.sm,
  backgroundColor: "rgba(0, 0, 0, 0.4)",
  border: "none",
  color: theme.colors.textMuted,
  fontSize: theme.fontSizes.sm,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 10,
  fontFamily: "monospace",
  transition: "background-color 0.15s",
  ":hover": {
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
})

export const toggleButtonActive = style({
  backgroundColor: "rgba(0, 180, 0, 0.3)",
  color: theme.colors.text,
  ":hover": {
    backgroundColor: "rgba(0, 180, 0, 0.45)",
  },
})

export const panel = style({
  position: "absolute",
  bottom: "52px",
  right: theme.space.md,
  width: "320px",
  maxWidth: "calc(100vw - 24px)",
  maxHeight: "280px",
  backgroundColor: "rgba(0, 0, 0, 0.85)",
  borderRadius: theme.borderRadius.md,
  border: `1px solid ${theme.colors.divider}`,
  zIndex: 10,
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
  backdropFilter: "blur(8px)",
})

export const header = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: `${theme.space.xs} ${theme.space.sm}`,
  borderBottom: `1px solid ${theme.colors.divider}`,
  flexShrink: 0,
})

export const headerTitle = style({
  fontSize: theme.fontSizes.xs,
  fontFamily: "monospace",
  color: theme.colors.textMuted,
  textTransform: "uppercase",
  letterSpacing: "0.5px",
})

export const clearButton = style({
  background: "none",
  border: "none",
  color: theme.colors.textMuted,
  fontSize: theme.fontSizes.xs,
  fontFamily: "monospace",
  cursor: "pointer",
  padding: `2px ${theme.space.xs}`,
  borderRadius: theme.borderRadius.sm,
  ":hover": {
    color: theme.colors.text,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
})

export const entries = style({
  flex: 1,
  overflowY: "auto",
  padding: theme.space.xs,
})

export const entry = style({
  display: "flex",
  gap: theme.space.sm,
  padding: `2px 0`,
  fontFamily: "monospace",
  fontSize: "11px",
  lineHeight: "1.4",
})

export const entryTimestamp = style({
  color: "rgba(255, 255, 255, 0.35)",
  flexShrink: 0,
})

export const entryAction = style({
  color: "#80d4ff",
})

export const entryAudio = style({
  color: "#a0e080",
})

export const entryViseme = style({
  color: "#e0c080",
})

export const entryInfo = style({
  color: theme.colors.textMuted,
})

export const emptyMessage = style({
  fontSize: theme.fontSizes.xs,
  fontFamily: "monospace",
  color: "rgba(255, 255, 255, 0.25)",
  textAlign: "center",
  padding: theme.space.lg,
})
