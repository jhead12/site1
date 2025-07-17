import { style } from "@vanilla-extract/css"
import { theme } from "../theme.css"
import { media } from "./media.css"

export const logoContainer = style({
  listStyle: "none",
  margin: 0,
  padding: 0,
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
  gap: "1.5rem",
  maxWidth: "800px",
  marginLeft: "auto",
  marginRight: "auto",
  justifyItems: "center",
  
  "@media": {
    [media.small]: {
      gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))",
      gap: "1rem",
    },
  },
})

export const logoItem = style({
  width: "120px",
  height: "120px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  
  "@media": {
    [media.small]: {
      width: "100px",
      height: "100px",
    },
  },
})

export const logoLink = style({
  display: "block",
  width: "120px",
  height: "120px",
  textDecoration: "none",
  transition: "all 0.2s ease",
  borderRadius: "8px",
  overflow: "hidden",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
  
  ":hover": {
    transform: "scale(1.05)",
    opacity: 0.8,
    boxShadow: "0 6px 16px rgba(0, 0, 0, 0.4)",
  },
  
  ":focus": {
    outline: `2px solid ${theme.colors.primary}`,
    outlineOffset: "2px",
    borderRadius: "8px",
  },
  
  "@media": {
    [media.small]: {
      width: "100px",
      height: "100px",
    },
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
