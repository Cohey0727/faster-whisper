import { style } from "@vanilla-extract/css"
import { theme } from "../../../configs"

export const button = style({
  position: "absolute",
  top: theme.space.md,
  right: theme.space.md,
  width: "40px",
  height: "40px",
  borderRadius: theme.borderRadius.full,
  backgroundColor: theme.colors.buttonBg,
  border: "none",
  color: theme.colors.text,
  fontSize: theme.fontSizes.xl,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 10,
  transition: "background-color 0.15s",
  ":hover": {
    backgroundColor: "rgba(255, 255, 255, 0.25)",
  },
})
