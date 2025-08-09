import { style, styleVariants } from "@vanilla-extract/css"
import { theme } from "../theme.css"
import { media } from "./media.css"
import { mobileNavLink, navItemBase, navHover } from "./header.css"

export const navGroupWrapper = style({
  position: "relative",
})

export const navGroupTitle = style([
  navItemBase,
  navHover,
  {
    
    "@media": {
      [media.small]: {
        color: "#ffffff",
        fontSize: theme.fontSizes[5],
        fontWeight: "500",
        paddingTop: theme.space[4],
        paddingBottom: theme.space[4],
        textAlign: "left",
        borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
      },
    },
  }
])

// Add active state for when dropdown is open
export const navGroupTitleActive = style({
  "@media": {
    [media.small]: {
      background: "rgba(59, 130, 246, 0.15)",
      boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
    },
  },
})

const navLinkListWrapperBase = style({
position: "absolute",
zIndex: 1000,
whiteSpace: "nowrap",
width: "fit-content",
background: theme.colors.background,
padding: `${theme.space[3]} ${theme.space[3]} ${theme.space[0]} ${theme.space[3]}`,
top: "calc(100% + 20px)",
left: "50%",
transform: "translateX(-50%)",
borderRadius: theme.radii.large,
minWidth: theme.sizes.navGroupBoxMin,
maxWidth: theme.sizes.navGroupBoxMax,
boxShadow: theme.shadows.large,
selectors: {
  "&::before": {
    content: "",
    position: "absolute",
    top: 0,
    left: "50%",
    transform: "translateX(-50%) translateY(calc(-100% + 2px))",
    width: 0,
    height: 0,
    borderStyle: "solid",
    borderWidth: "0 14px 17.3px 14px",
    borderColor: `transparent transparent ${theme.colors.background} transparent`,
  },
},
})

export const navLinkListWrapper = styleVariants({
  opened: [
    navLinkListWrapperBase,
    {
      "@media": {
        [media.small]: {
          animation: "zoomInUp 0.15s ease-in-out",
        },
      },
    },
  ],
  closed: [
    navLinkListWrapperBase,
    {
      "@media": {
        [media.small]: {
          animation: "zoomOutDown 0.15s ease-in-out",
          animationFillMode: "forwards",
        },
      },
    },
  ],
})

export const navLinkListWrapperInner = style({
  paddingLeft: theme.space[4],
  paddingBottom: theme.space[3],
  "@media": {
    [media.small]: {
      paddingLeft: 0,
      alignItems: "stretch",
    },
  },
})

export const navIcon = style({
  flexShrink: 0,
  width: theme.sizes.navIcon,
  height: theme.sizes.navIcon,
  "@media": {
    [media.small]: {
      width: theme.sizes.navIconSmall,
      height: theme.sizes.navIconSmall,
    },
  },
})

export const navLinkListLink = style([
  mobileNavLink,
  {
    "@media": {
      [media.small]: {
        padding: theme.space[3],
        margin: 0,
        color: "#ffffff",
        fontSize: theme.fontSizes[2],
        fontWeight: theme.fontWeights.bold,
        borderRadius: "8px",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        position: "relative",
        overflow: "hidden",
        
        "::before": {
          content: "",
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(147, 51, 234, 0.1))",
          opacity: 0,
          transition: "opacity 0.3s ease",
          borderRadius: "8px",
          zIndex: -1,
        },
        
        ":hover": {
          background: "rgba(59, 130, 246, 0.1)",
          color: "#ffffff",
          transform: "translateX(8px)",
          boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
        },
        
        // Use selectors for hover pseudo-element
        selectors: {
          "&:hover::before": {
            opacity: 1,
          },
        },
        
        ":active": {
          transform: "translateX(4px)",
        }
      },
    },
  },
])

export const navLinkDescription = style({
  display: "none",
  whiteSpace: "normal",
  "@media": {
    [media.small]: {
      display: "block",
      fontSize: theme.fontSizes[1],
      margin: 0,
      minWidth: "300px",
    },
  },
})

export const navLinkTitle = style({
  margin: 0,
  padding: 0,
})
