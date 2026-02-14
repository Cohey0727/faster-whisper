import { style } from "@vanilla-extract/css";
import { theme, mediaquery } from "../../../configs";

export const layout = style({
  display: "flex",
  flexDirection: "column",
  width: "100%",
  height: "100%",
  overflow: "hidden",
  "@media": {
    [mediaquery.md]: {
      flexDirection: "row",
    },
  },
});

// DOM order: chat(0) → handle(1) → avatar(2)
// SP visual:  avatar(top) → handle → chat(bottom)
// PC visual:  chat(left) → handle → avatar(right)  (= DOM order)

export const avatarArea = style({
  order: -1,
  position: "relative",
  minHeight: 0,
  overflow: "hidden",
  "@media": {
    [mediaquery.md]: {
      order: 0,
    },
  },
});

export const chatArea = style({
  order: 1,
  display: "flex",
  flexDirection: "column",
  minHeight: 0,
  backgroundColor: "rgba(0, 0, 0, 0.4)",
  "@media": {
    [mediaquery.md]: {
      order: 0,
      height: "100%",
      flex: "none",
    },
  },
});

export const handle = style({
  order: 0,
  flexShrink: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  touchAction: "none",
  userSelect: "none",

  // SP: horizontal bar between top/bottom
  width: "100%",
  height: "8px",
  cursor: "ns-resize",
  borderTop: `1px solid ${theme.colors.divider}`,
  borderBottom: `1px solid ${theme.colors.divider}`,

  "@media": {
    [mediaquery.md]: {
      // PC: vertical bar between left/right
      order: 0,
      width: "8px",
      height: "100%",
      cursor: "ew-resize",
      borderTop: "none",
      borderBottom: "none",
      borderLeft: `1px solid ${theme.colors.divider}`,
      borderRight: `1px solid ${theme.colors.divider}`,
    },
  },
});

export const handleKnob = style({
  // SP: horizontal knob
  width: "40px",
  height: "4px",
  borderRadius: theme.borderRadius.full,
  backgroundColor: theme.colors.textMuted,
  transition: "background-color 0.15s",

  "@media": {
    [mediaquery.md]: {
      // PC: vertical knob
      width: "4px",
      height: "40px",
    },
  },
});

export const chatContent = style({
  flex: 1,
  overflow: "auto",
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-end",
});

export const chatActions = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: theme.space.xl,
  padding: `${theme.space.sm} ${theme.space.md}`,
  paddingBottom: theme.space.lg,
  "@media": {
    [mediaquery.md]: {
      paddingLeft: theme.space.lg,
      paddingRight: theme.space.lg,
    },
  },
});

export const chatFooterInputRow = style({
  display: "flex",
  alignItems: "center",
  gap: theme.space.sm,
  width: "100%",
});
