import { globalStyle, keyframes } from "@vanilla-extract/css"
import { theme } from "../configs"

globalStyle("*", {
  margin: 0,
  padding: 0,
  boxSizing: "border-box",
})

globalStyle("html, body, #root", {
  width: "100%",
  height: "100%",
  overflow: "hidden",
})

globalStyle("body", {
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  backgroundColor: theme.colors.background,
  color: theme.colors.text,
})

export const pulse = keyframes({
  "0%, 100%": { boxShadow: `0 0 0 0 rgba(229, 62, 62, 0.5)` },
  "50%": { boxShadow: `0 0 0 12px rgba(229, 62, 62, 0)` },
})
