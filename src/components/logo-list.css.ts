import { style } from "@vanilla-extract/css"
import { theme } from "../theme.css"
import { media } from "./media.css"

export const logoContainer = style({
  listStyle: "none",
  margin: 0,
  padding: 0,
})

export const logoItem = style({
  flex: "0 0 auto",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
})

export const logoLink = style({
  display: "block",
  textDecoration: "none",
  transition: "all 0.2s ease",
  
  ":hover": {
    transform: "scale(1.05)",
    opacity: 0.8,
  },
  
  ":focus": {
    outline: `2px solid ${theme.colors.primary}`,
    outlineOffset: "2px",
    borderRadius: "8px",
  },
})

export const fallbackLogo = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  width: "80px",
  height: "80px",
  backgroundColor: "rgba(255, 255, 255, 0.05)",
  border: "2px solid",
  borderRadius: "12px",
  padding: theme.space[2],
  textAlign: "center",
  transition: "all 0.2s ease",
  
  ":hover": {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    transform: "translateY(-2px)",
  },
  
  "@media": {
    [media.small]: {
      width: "60px",
      height: "60px",
    },
  },
})

export const fallbackIcon = style({
  fontSize: "24px",
  marginBottom: theme.space[1],
  
  "@media": {
    [media.small]: {
      fontSize: "20px",
    },
  },
})

export const fallbackText = style({
  fontSize: theme.fontSizes[0],
  fontWeight: theme.fontWeights.medium,
  color: theme.colors.text,
  lineHeight: 1.2,
  
  "@media": {
    [media.small]: {
      fontSize: "10px",
    },
  },
})
