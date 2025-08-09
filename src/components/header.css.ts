import { style, keyframes, styleVariants } from "@vanilla-extract/css"
import { theme } from "../theme.css"
import { media } from "./media.css"

// Define keyframes first
const fadeIn = keyframes({
  "0%": { 
    opacity: 0,
    transform: "translateY(-10px)",
  },
  "100%": { 
    opacity: 1,
    transform: "translateY(0)",
  },
})

// Mini stars animation
const floatingStars = keyframes({
  "0%": {
    transform: "translateY(0px) rotate(0deg)",
    opacity: 0,
  },
  "10%": {
    opacity: 1,
  },
  "90%": {
    opacity: 1,
  },
  "100%": {
    transform: "translateY(-20px) rotate(180deg)",
    opacity: 0,
  },
})

const twinkle = keyframes({
  "0%, 100%": {
    opacity: 0.3,
    transform: "scale(0.8)",
  },
  "50%": {
    opacity: 1,
    transform: "scale(1.2)",
  },
})

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

// Navigation alignment - ensures all nav items are perfectly aligned
export const navAlignment = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  height: "44px",
})

// Style for navigation list items
export const navListItem = style({
  display: "flex",
  alignItems: "center",
  height: "44px",
})

// Base styling for navigation links and buttons
export const navItemBase = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  lineHeight: "1",
  textDecoration: "none",
  padding: "12px 16px",
  borderRadius: "8px",
  transition: "all 0.3s ease",
  position: "relative",
  fontSize: "16px",
  fontWeight: "500",
  color: "rgba(255, 255, 255, 0.9)",
  background: "transparent",
  border: "none",
  cursor: "pointer",
  height: "44px",
  minHeight: "44px",
  boxSizing: "border-box",
  textAlign: "center",
})

// Simple hover effects for navigation links - consistent across all nav items
export const navHover = style({
  ":hover": {
    color: "#ffffff",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
})

export const desktopHeaderNavList = style({
  display: "flex",
  alignItems: "center",
  height: "auto",
  lineHeight: "1.5",
})

// Add glow effect for CTA button
export const ctaButtonGlow = style({
  position: "relative",
  background: "linear-gradient(135deg, #3b82f6, #9333ea)",
  color: "#ffffff",
  padding: `${theme.space[3]} ${theme.space[5]}`,
  borderRadius: "12px",
  border: "none",
  textDecoration: "none",
  fontWeight: "600",
  fontSize: theme.fontSizes[3],
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  overflow: "hidden",
  
  "::before": {
    content: "",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
    opacity: 0,
    transition: "opacity 0.3s ease",
    borderRadius: "12px",
    zIndex: -1,
  },
  
  ":hover": {
    transform: "translateY(-3px) scale(1.05)",
    boxShadow: "0 20px 40px rgba(59, 130, 246, 0.3)",
  },
  
  // Use selectors for hover pseudo-element
  selectors: {
    "&:hover::before": {
      opacity: 1,
    },
  },
  
  ":active": {
    transform: "translateY(-1px) scale(1.02)",
  }
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
  fontSize: theme.fontSizes[5],
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
    backgroundColor: theme.colors.primary,
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
