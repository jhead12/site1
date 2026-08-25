import { style } from "@vanilla-extract/css"
import { theme } from "../theme.css"
import { media } from "./media.css"

// Grid's own gridTemplateColumns implementation in ui.js joins multiple
// repeat() tracks with commas into one declaration, which is invalid CSS and
// gets dropped - so a lone card stretches full-width instead of sitting in a
// column. Defining our own responsive grid here avoids relying on that.
export const grid = style({
  display: "grid",
  gridTemplateColumns: "1fr",
  gap: theme.space[4],
  "@media": {
    [media.small]: { gridTemplateColumns: "repeat(2, 1fr)" },
    [media.large]: { gridTemplateColumns: "repeat(3, 1fr)" },
  },
})

export const card = style({
  display: "flex",
  flexDirection: "column",
  borderRadius: theme.radii.large,
  border: "1px solid rgba(0, 164, 255, 0.25)",
  background: "rgba(255, 255, 255, 0.06)",
  backdropFilter: "blur(4px)",
  overflow: "hidden",
  transition: "border-color 200ms ease, box-shadow 200ms ease, transform 200ms ease",
  ":hover": {
    borderColor: theme.colors.primary,
    boxShadow: "0 0 0 1px rgba(0, 164, 255, 0.4), 0 0 32px rgba(0, 164, 255, 0.35)",
    transform: "translateY(-2px)",
  },
})

export const cover = style({
  width: "100%",
  aspectRatio: "1 / 1",
  objectFit: "cover",
  display: "block",
})

export const body = style({
  display: "flex",
  flexDirection: "column",
  gap: theme.space[2],
  padding: theme.space[3],
  flex: 1,
})

export const name = style({
  fontFamily: theme.fonts.heading,
  fontWeight: theme.fontWeights.semibold,
  fontSize: theme.fontSizes[3],
  color: theme.colors.text,
  margin: 0,
})

export const priceRow = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  marginTop: "auto",
  paddingTop: theme.space[2],
})

export const priceTag = style({
  fontFamily: theme.fonts.mono,
  fontSize: theme.fontSizes[1],
  letterSpacing: theme.letterSpacings.wide,
  color: theme.colors.primary,
  border: "1px solid rgba(0, 164, 255, 0.4)",
  borderRadius: theme.radii.button,
  padding: `${theme.space[1]} ${theme.space[2]}`,
})
