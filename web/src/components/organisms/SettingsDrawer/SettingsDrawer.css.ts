import { style, keyframes } from "@vanilla-extract/css"
import { theme } from "../../../configs"

export const overlay = style({
  position: "fixed",
  inset: 0,
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  zIndex: 100,
  opacity: 0,
  transition: "opacity 0.3s ease",
})

export const overlayVisible = style({
  opacity: 1,
})

export const drawer = style({
  position: "fixed",
  top: 0,
  right: 0,
  bottom: 0,
  width: "320px",
  maxWidth: "85vw",
  backgroundColor: theme.colors.background,
  zIndex: 101,
  transform: "translateX(100%)",
  transition: "transform 0.3s ease",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
})

export const drawerOpen = style({
  transform: "translateX(0)",
})

export const header = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: `${theme.space.lg} ${theme.space.xl}`,
  borderBottom: `1px solid ${theme.colors.divider}`,
  flexShrink: 0,
})

export const headerTitle = style({
  fontSize: theme.fontSizes.lg,
  fontWeight: "600",
  color: theme.colors.text,
  margin: 0,
})

export const closeButton = style({
  background: "none",
  border: "none",
  color: theme.colors.textMuted,
  fontSize: theme.fontSizes.xl,
  cursor: "pointer",
  padding: theme.space.xs,
  lineHeight: 1,
  ":hover": {
    color: theme.colors.text,
  },
})

export const content = style({
  flex: 1,
  overflowY: "auto",
  padding: theme.space.xl,
})

export const section = style({
  selectors: {
    "& + &": {
      marginTop: theme.space.xl,
      paddingTop: theme.space.xl,
      borderTop: `1px solid ${theme.colors.divider}`,
    },
  },
})

export const sectionTitle = style({
  fontSize: theme.fontSizes.md,
  fontWeight: "600",
  color: theme.colors.text,
  marginBottom: theme.space.md,
})

export const avatarGrid = style({
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: theme.space.md,
})

export const avatarCard = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: theme.space.sm,
  padding: theme.space.md,
  borderRadius: theme.borderRadius.md,
  border: `2px solid transparent`,
  backgroundColor: theme.colors.buttonBg,
  cursor: "pointer",
  transition: "border-color 0.15s, background-color 0.15s",
  ":hover": {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
})

export const avatarCardSelected = style({
  borderColor: theme.colors.buttonBorder,
  backgroundColor: "rgba(255, 255, 255, 0.25)",
})

export const avatarIcon = style({
  width: "48px",
  height: "48px",
  borderRadius: theme.borderRadius.full,
  backgroundColor: "rgba(255, 255, 255, 0.1)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: theme.fontSizes.xl,
})

export const avatarName = style({
  fontSize: theme.fontSizes.sm,
  color: theme.colors.text,
  textAlign: "center",
})

export const avatarDescription = style({
  fontSize: theme.fontSizes.xs,
  color: theme.colors.textMuted,
  textAlign: "center",
})

export const voiceList = style({
  display: "flex",
  flexDirection: "column",
  gap: theme.space.sm,
})

export const voiceItem = style({
  display: "flex",
  flexDirection: "column",
  gap: theme.space.xs,
  padding: theme.space.md,
  borderRadius: theme.borderRadius.md,
  border: `2px solid transparent`,
  backgroundColor: theme.colors.buttonBg,
  cursor: "pointer",
  transition: "border-color 0.15s, background-color 0.15s",
  ":hover": {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
})

export const voiceItemSelected = style({
  borderColor: theme.colors.buttonBorder,
  backgroundColor: "rgba(255, 255, 255, 0.25)",
})

export const voiceName = style({
  fontSize: theme.fontSizes.md,
  color: theme.colors.text,
})

export const voiceStyles = style({
  display: "flex",
  flexWrap: "wrap",
  gap: theme.space.xs,
})

export const styleChip = style({
  fontSize: theme.fontSizes.xs,
  color: theme.colors.textMuted,
  backgroundColor: "rgba(255, 255, 255, 0.1)",
  padding: `2px ${theme.space.sm}`,
  borderRadius: theme.borderRadius.full,
  cursor: "pointer",
  transition: "background-color 0.15s, color 0.15s",
  border: "none",
  ":hover": {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
})

export const styleChipSelected = style({
  backgroundColor: "rgba(255, 255, 255, 0.3)",
  color: theme.colors.text,
})

export const loadingText = style({
  fontSize: theme.fontSizes.sm,
  color: theme.colors.textMuted,
})

export const errorText = style({
  fontSize: theme.fontSizes.sm,
  color: theme.colors.error,
})
