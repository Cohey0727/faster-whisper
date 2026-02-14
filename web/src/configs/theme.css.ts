import { createGlobalTheme } from "@vanilla-extract/css"

export const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
} as const

export const mediaquery = Object.fromEntries(
  Object.entries(breakpoints).map(([key, value]) => [
    key,
    `(min-width: ${value}px)`,
  ]),
) as Record<keyof typeof breakpoints, string>

export const theme = createGlobalTheme(":root", {
  colors: {
    background: "#1a1a2e",
    surface: "rgba(0, 0, 0, 0.7)",
    text: "#ffffff",
    textMuted: "rgba(255, 255, 255, 0.6)",
    textLabel: "rgba(255, 255, 255, 0.5)",
    divider: "rgba(255, 255, 255, 0.15)",
    error: "#ff6b6b",
    recording: "#e53e3e",
    buttonBg: "rgba(255, 255, 255, 0.15)",
    buttonBorder: "#ffffff",
  },
  space: {
    xs: "4px",
    sm: "8px",
    md: "12px",
    lg: "16px",
    xl: "24px",
    xxl: "32px",
  },
  fontSizes: {
    xs: "11px",
    sm: "12px",
    md: "14px",
    lg: "16px",
    xl: "20px",
  },
  borderRadius: {
    sm: "4px",
    md: "8px",
    lg: "12px",
    full: "9999px",
  },
})
