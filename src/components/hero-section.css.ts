import { style } from "@vanilla-extract/css"
import { theme } from "../theme.css"
import { media } from "./media.css"

// Main hero section container
export const heroSection = style({
  backgroundColor: theme.colors.background,
  position: "relative",
  overflow: "hidden",
  
  // Ensure proper spacing after rotating banner
  "@media": {
    [media.medium]: {
      marginTop: theme.space[6], // Add breathing room from rotating banner
    },
  },
})

// Hero content wrapper following rule of thirds
export const heroContent = style({
  alignItems: "center",
  minHeight: "400px", // Reasonable height, not too overwhelming
  
  "@media": {
    [media.medium]: {
      minHeight: "500px", // Slightly larger on desktop
    },
  },
})

// Content column (left side) - follows rule of thirds
export const contentColumn = style({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  padding: theme.space[3],
  
  "@media": {
    [media.medium]: {
      padding: theme.space[5],
      paddingRight: theme.space[6], // More space between content and image
    },
  },
})

// Content wrapper for better typography control
export const contentWrapper = style({
  maxWidth: "580px", // Optimal reading width
  
  "@media": {
    [media.medium]: {
      maxWidth: "640px",
    },
  },
})

// Image column (right side) - follows rule of thirds
export const imageColumn = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: theme.space[3],
  
  "@media": {
    [media.medium]: {
      padding: theme.space[4],
      paddingLeft: theme.space[6], // More space between image and content
    },
  },
})

// Image wrapper for proper sizing and effects
export const imageWrapper = style({
  width: "100%",
  maxWidth: "500px", // Reasonable max size
  borderRadius: theme.radii.large,
  overflow: "hidden",
  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  
  ":hover": {
    transform: "translateY(-8px)",
    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15)",
  },
  
  "@media": {
    [media.medium]: {
      maxWidth: "600px",
    },
  },
})

// Hero image styling
export const heroImage = style({
  width: "100%",
  height: "auto",
  objectFit: "cover",
  aspectRatio: "4/3", // Good proportions for hero images
  
  "@media": {
    [media.medium]: {
      aspectRatio: "3/2", // Slightly wider on desktop
    },
  },
})

// Typography styles
export const kicker = style({
  color: theme.colors.primary,
  fontWeight: theme.fontWeights.bold,
  textTransform: "uppercase",
  letterSpacing: "0.1em",
  fontSize: theme.fontSizes[1],
  marginBottom: theme.space[2],
})

export const heroHeading = style({
  fontSize: theme.fontSizes[6],
  fontWeight: theme.fontWeights.extrabold,
  lineHeight: theme.lineHeights.tight,
  color: theme.colors.text,
  marginBottom: theme.space[3],
  
  "@media": {
    [media.medium]: {
      fontSize: theme.fontSizes[7], // Larger on desktop
      marginBottom: theme.space[4],
    },
  },
})

export const heroSubhead = style({
  fontSize: theme.fontSizes[4],
  fontWeight: theme.fontWeights.medium,
  lineHeight: theme.lineHeights.text,
  color: theme.colors.muted,
  marginBottom: theme.space[3],
  
  "@media": {
    [media.medium]: {
      fontSize: theme.fontSizes[5],
      marginBottom: theme.space[4],
    },
  },
})

export const heroText = style({
  fontSize: theme.fontSizes[3],
  lineHeight: theme.lineHeights.text,
  color: theme.colors.muted,
  maxWidth: "540px", // Optimal reading width
  
  "@media": {
    [media.medium]: {
      fontSize: theme.fontSizes[4],
    },
  },
})

export const heroButtons = style({
  display: "flex",
  flexDirection: "column",
  gap: theme.space[3],
  
  "@media": {
    [media.medium]: {
      flexDirection: "row",
      gap: theme.space[4],
    },
  },
})

// Responsive mobile-first adjustments
export const mobileContentOrder = style({
  "@media": {
    [media.small]: {
      order: 2, // Content comes after image on mobile
    },
  },
})

export const mobileImageOrder = style({
  "@media": {
    [media.small]: {
      order: 1, // Image comes first on mobile
      marginBottom: theme.space[4],
    },
  },
})
