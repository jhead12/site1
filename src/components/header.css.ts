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
  right: 0,
  bottom: 0,
  paddingTop: theme.space[6],
  paddingLeft: theme.space[4],
  paddingRight: theme.space[4],
  background: "rgba(0, 0, 0, 0.98)",
  backdropFilter: "blur(20px)",
  zIndex: 1000,
  display: "flex",
  flexDirection: "column",
  overflowY: "auto",
  overscrollBehavior: "contain",
  WebkitOverflowScrolling: "touch",
  selectors: {
    // ensure the nav inside overlay renders above the decorative prelayers
    "& nav": {
      position: "relative",
      zIndex: 1100,
    },
  },
  "@media": {
    [media.medium]: {
      display: "none",
    },
  },
})

// decorative prelayer color bands behind the mobile panel (staggered look)
export const mobilePrelayers = style({
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  pointerEvents: "none",
  zIndex: 1,
  overflow: "hidden",
})

export const mobilePrelayer = style({
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  transform: "translateX(0%)",
  willChange: "transform, opacity",
  transition: "transform 360ms cubic-bezier(.2,.9,.2,1), opacity 300ms ease",
  mixBlendMode: "screen",
  borderRadius: "0 0 18px 18px",
  pointerEvents: "none",
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
  width: "calc(100% - 2rem)",
  padding: theme.space[5],
  marginTop: theme.space[4],
  backgroundColor: theme.colors.primary,
  color: "#ffffff",
  fontSize: theme.fontSizes[5],
  fontWeight: "700",
  borderRadius: "12px",
  border: "none",
  textAlign: "center",
  textDecoration: "none",
  transition: "all 0.3s ease",
  position: "sticky",
  bottom: "2.5rem",
  alignSelf: "flex-start",
  boxShadow: "0 12px 30px rgba(0,0,0,0.35)",
  ":hover": {
    backgroundColor: theme.colors.primaryHover || theme.colors.primary,
    transform: "translateY(-2px)",
    boxShadow: "0 16px 36px rgba(0,0,0,0.4)",
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
