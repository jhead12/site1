import { style, styleVariants } from "@vanilla-extract/css"
import { theme } from "../theme.css"
import { media } from "./media.css"

// Media query definitions for responsive design
const breakpoints = ["40em", "52em", "64em"]

export const desktopHeaderNavWrapper = style({
  position: "relative",
  zIndex: 50,
  display: "none",
  backgroundColor: "rgba(0, 0, 0, 0.9)",
  backdropFilter: "blur(12px)",
  borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
  overflow: "visible",
  "@media": {
    [media.medium]: {
      display: "block",
      paddingTop: theme.space[4],
      paddingBottom: theme.space[4],
    },
  },
})

const mobileHeaderNavWrapperBase = style({
  display: "block",
  position: "sticky",
  top: 0,
  zIndex: 50,
  paddingTop: theme.space[3],
  paddingBottom: theme.space[3],
  backgroundColor: "rgba(0, 0, 0, 0.95)",
  backdropFilter: "blur(12px)",
  borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
  "@media": {
    [media.medium]: {
      display: "none",
    },
  },
})

export const mobileHeaderNavWrapper = styleVariants({
  open: [
    mobileHeaderNavWrapperBase,
    {
      backgroundColor: "rgba(0, 0, 0, 0.98)",
    },
  ],
  closed: [mobileHeaderNavWrapperBase],
})

export const mobileNavSVGColorWrapper = styleVariants({
  primary: [{ color: theme.colors.primary }],
  reversed: [{ color: theme.colors.background }],
})

export const mobileNavOverlay = style({
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  paddingTop: theme.space[6],
  paddingLeft: theme.space[4],
  paddingRight: theme.space[4],
  background: "rgba(0, 0, 0, 0.98)",
  backdropFilter: "blur(20px)",
  zIndex: 100,
  display: "flex",
  flexDirection: "column",
  overflow: "auto",
  "@media": {
    [media.medium]: {
      display: "none",
    },
  },
})

export const mobileNavLink = style({
  display: "block",
  color: "#ffffff",
  fontSize: theme.fontSizes[5], // Larger font size
  fontWeight: "500",
  paddingTop: theme.space[4],
  paddingBottom: theme.space[4],
  paddingLeft: 0,
  paddingRight: 0,
  textAlign: "left",
  textDecoration: "none",
  borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
  transition: "all 0.3s ease",
  lineHeight: "1.2",
  
  ":hover": {
    color: theme.colors.primary,
    paddingLeft: theme.space[2],
  },
  
  ":active": {
    color: theme.colors.primary,
    transform: "translateX(4px)",
  },
})

// Add mobile CTA button styling
export const mobileCTAButton = style({
  width: "100%",
  padding: theme.space[4],
  marginTop: theme.space[6],
  backgroundColor: theme.colors.primary,
  color: "#ffffff",
  fontSize: theme.fontSizes[4],
  fontWeight: "600",
  borderRadius: "8px",
  border: "none",
  textAlign: "center",
  textDecoration: "none",
  transition: "all 0.3s ease",
  
  ":hover": {
    backgroundColor: theme.colors.primaryHover || theme.colors.primary,
    transform: "translateY(-2px)",
    boxShadow: "0 8px 25px rgba(0, 0, 0, 0.3)",
  },
})

// Add desktop navigation hiding on mobile
export const desktopNav = style({
  display: "block",
  "@media": {
    [`screen and (max-width: ${breakpoints[1]})`]: {
      display: "none",
    },
  },
})

// Add mobile logo styling
export const mobileLogo = style({
  maxWidth: "120px",
  height: "auto",
})

// Add hamburger menu button styling
export const mobileMenuButton = style({
  background: "none",
  border: "none",
  color: "#ffffff",
  fontSize: "24px",
  cursor: "pointer",
  padding: theme.space[2],
  borderRadius: "4px",
  transition: "all 0.2s ease",
  
  ":hover": {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
})
