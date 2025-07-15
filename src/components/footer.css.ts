import { style } from "@vanilla-extract/css"
import { theme } from "../theme.css"
import { media } from "./media.css"

// Main footer container
export const footerContainer = style({
  backgroundColor: theme.colors.background,
  borderTop: `1px solid rgba(255, 255, 255, 0.1)`,
  paddingTop: theme.space[6],
  paddingBottom: theme.space[5],
  marginTop: theme.space[6],
})

// Main footer content - rule of thirds layout
export const footerContent = style({
  display: "flex",
  flexDirection: "column",
  gap: theme.space[5],
  
  "@media": {
    [media.medium]: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      gap: theme.space[6],
    },
  },
})

// Brand section (left - 1/3)
export const footerBrandSection = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  flex: "1",
  maxWidth: "100%",
  
  "@media": {
    [media.medium]: {
      maxWidth: "300px", // Limit width for rule of thirds
    },
  },
})

// Navigation section (center - 1/3)
export const footerNavSection = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  flex: "1",
  
  "@media": {
    [media.medium]: {
      alignItems: "center", // Center on desktop
      textAlign: "center",
    },
  },
})

// Meta/Legal section (right - 1/3)
export const footerMetaSection = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  flex: "1",
  
  "@media": {
    [media.medium]: {
      alignItems: "flex-end", // Right align on desktop
      textAlign: "right",
    },
  },
})

// Footer logo styling
export const footerLogo = style({
  display: "flex",
  alignItems: "center",
  textDecoration: "none",
  transition: "opacity 0.2s ease",
  
  ":hover": {
    opacity: 0.8,
  },
  
  ":focus": {
    outline: `2px solid ${theme.colors.primary}`,
    outlineOffset: "2px",
    borderRadius: "4px",
  },
})

// Social links container
export const socialLinksContainer = style({
  width: "100%",
})

// Social links list
export const socialLinks = style({
  display: "flex",
  flexWrap: "wrap",
  gap: theme.space[3],
  listStyle: "none",
  margin: 0,
  padding: 0,
  
  "@media": {
    [media.medium]: {
      justifyContent: "flex-start",
    },
  },
})

// Individual social link
export const socialLink = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "40px",
  height: "40px",
  borderRadius: "50%",
  backgroundColor: "rgba(255, 255, 255, 0.1)",
  color: theme.colors.text,
  textDecoration: "none",
  transition: "all 0.2s ease",
  
  ":hover": {
    backgroundColor: theme.colors.primary,
    color: theme.colors.background,
    transform: "translateY(-2px)",
  },
  
  ":focus": {
    outline: `2px solid ${theme.colors.primary}`,
    outlineOffset: "2px",
  },
})

// Section titles
export const footerSectionTitle = style({
  color: theme.colors.primary,
  fontWeight: theme.fontWeights.bold,
  fontSize: theme.fontSizes[1],
  textTransform: "uppercase",
  letterSpacing: "0.1em",
  marginBottom: theme.space[2],
})

// Navigation links
export const footerNavLinks = style({
  display: "flex",
  flexDirection: "column",
  gap: theme.space[2],
  listStyle: "none",
  margin: 0,
  padding: 0,
  
  "@media": {
    [media.medium]: {
      alignItems: "center",
    },
  },
})

export const footerNavLink = style({
  color: theme.colors.text,
  textDecoration: "none",
  fontSize: theme.fontSizes[2],
  fontWeight: theme.fontWeights.medium,
  transition: "color 0.2s ease",
  
  ":hover": {
    color: theme.colors.primary,
  },
  
  ":focus": {
    outline: `2px solid ${theme.colors.primary}`,
    outlineOffset: "2px",
    borderRadius: "4px",
  },
})

// Meta/Legal links
export const footerMetaLinks = style({
  display: "flex",
  flexDirection: "column",
  gap: theme.space[2],
  listStyle: "none",
  margin: 0,
  padding: 0,
  
  "@media": {
    [media.medium]: {
      alignItems: "flex-end",
    },
  },
})

export const footerMetaLink = style({
  color: theme.colors.muted,
  textDecoration: "none",
  fontSize: theme.fontSizes[1],
  transition: "color 0.2s ease",
  
  ":hover": {
    color: theme.colors.text,
  },
  
  ":focus": {
    outline: `2px solid ${theme.colors.primary}`,
    outlineOffset: "2px",
    borderRadius: "4px",
  },
})

// Footer bottom section
export const footerBottom = style({
  marginTop: theme.space[5],
  paddingTop: theme.space[4],
  borderTop: `1px solid rgba(255, 255, 255, 0.1)`,
  textAlign: "center",
})

// Copyright text
export const copyright = style({
  color: theme.colors.muted,
  fontSize: theme.fontSizes[1],
  fontWeight: theme.fontWeights.normal,
})

// Responsive adjustments for mobile
export const mobileStackedLayout = style({
  "@media": {
    [`(max-width: 52em)`]: {
      textAlign: "center",
    },
  },
})

// Animation for social links
export const socialLinkHover = style({
  "@media": {
    "(prefers-reduced-motion: no-preference)": {
      ":hover": {
        animation: "bounce 0.3s ease",
      },
    },
  },
})
