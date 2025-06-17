import { style, globalStyle } from "@vanilla-extract/css"
import { theme } from "../../src/theme.css"

export const blogPost = style({
  fontSize: theme.fontSizes[3],
  // Force consistent styling to override WordPress inline styles
  color: `${theme.colors.text} !important`,
  backgroundColor: `${theme.colors.background} !important`,
})

// Reset WordPress styles and ensure readability
globalStyle(`${blogPost} *`, {
  color: `${theme.colors.text} !important`,
  backgroundColor: `transparent !important`,
  fontFamily: `${theme.fonts.text} !important`,
})

globalStyle(`${blogPost} img`, {
  maxWidth: "100%",
  height: "auto",
})

// CENTER-ALIGNED MEDIA STYLING FOR BLOG POSTS
// Images - all types including WordPress blocks
globalStyle(`${blogPost} img`, {
  display: "block",
  margin: "2rem auto",
  maxWidth: "100%",
  height: "auto",
  borderRadius: "8px",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
})

// WordPress image blocks
globalStyle(`${blogPost} .wp-block-image`, {
  display: "block",
  margin: "2rem auto",
  textAlign: "center",
  backgroundColor: `transparent !important`,
})

globalStyle(`${blogPost} .wp-block-image img`, {
  margin: "0 auto",
})

// Gatsby Images - specifically target data-main-image and Gatsby wrappers
globalStyle(`${blogPost} img[data-main-image]`, {
  display: "block",
  margin: "2rem auto !important",
  maxWidth: "100%",
  height: "auto",
  borderRadius: "8px",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
})

globalStyle(`${blogPost} .gatsby-image-wrapper`, {
  display: "block",
  margin: "2rem auto !important",
  textAlign: "center",
})

globalStyle(`${blogPost} .gatsby-image-wrapper img`, {
  margin: "0 auto !important",
})

// Any div or figure containing images should be centered
globalStyle(`${blogPost} div:has(img), ${blogPost} figure:has(img)`, {
  display: "block",
  margin: "2rem auto",
  textAlign: "center",
})

// Videos - all types including WordPress blocks and embeds
globalStyle(`${blogPost} video`, {
  display: "block",
  margin: "2rem auto",
  maxWidth: "100%",
  height: "auto",
  borderRadius: "8px",
})

globalStyle(`${blogPost} .wp-block-video`, {
  display: "block",
  margin: "2rem auto",
  textAlign: "center",
  backgroundColor: `transparent !important`,
})

globalStyle(`${blogPost} .wp-block-video video`, {
  margin: "0 auto",
})

// YouTube and other embeds
globalStyle(`${blogPost} iframe`, {
  display: "block",
  margin: "2rem auto",
  maxWidth: "100%",
  borderRadius: "8px",
})

globalStyle(`${blogPost} .wp-block-embed`, {
  display: "block",
  margin: "2rem auto",
  textAlign: "center",
  backgroundColor: `transparent !important`,
})

globalStyle(`${blogPost} .wp-block-embed iframe`, {
  margin: "0 auto",
  borderRadius: "8px",
})

// Audio blocks
globalStyle(`${blogPost} audio`, {
  display: "block",
  margin: "2rem auto",
  maxWidth: "100%",
})

globalStyle(`${blogPost} .wp-block-audio`, {
  display: "block",
  margin: "2rem auto",
  textAlign: "center",
  backgroundColor: `transparent !important`,
})

// Gallery blocks
globalStyle(`${blogPost} .wp-block-gallery`, {
  display: "block",
  margin: "2rem auto",
  textAlign: "center",
  backgroundColor: `transparent !important`,
})

globalStyle(`${blogPost} .wp-block-gallery img`, {
  borderRadius: "4px",
  margin: "0.5rem",
})

// Media and text blocks
globalStyle(`${blogPost} .wp-block-media-text`, {
  margin: "2rem auto",
  backgroundColor: `transparent !important`,
})

globalStyle(`${blogPost} .wp-block-media-text img`, {
  borderRadius: "8px",
})

// Cover blocks with background images
globalStyle(`${blogPost} .wp-block-cover`, {
  margin: "2rem auto",
  borderRadius: "8px",
  overflow: "hidden",
})

// Pullquotes and blockquotes - center them too
globalStyle(`${blogPost} blockquote`, {
  margin: "2rem auto",
  padding: "1.5rem",
  maxWidth: "600px",
  textAlign: "center",
  fontStyle: "italic",
  fontSize: theme.fontSizes[4],
  borderLeft: `4px solid ${theme.colors.primary}`,
  backgroundColor: `${theme.colors.muted} !important`,
  borderRadius: "4px",
})

globalStyle(`${blogPost} .wp-block-pullquote`, {
  margin: "2rem auto",
  textAlign: "center",
  backgroundColor: `transparent !important`,
})

globalStyle(`${blogPost} .wp-block-quote`, {
  margin: "2rem auto",
  backgroundColor: `transparent !important`,
})

// Tables - make them responsive and centered
globalStyle(`${blogPost} table`, {
  margin: "2rem auto",
  width: "100%",
  maxWidth: "800px",
  borderCollapse: "collapse",
  overflowX: "auto",
  display: "block",
  whiteSpace: "nowrap",
})

globalStyle(`${blogPost} .wp-block-table`, {
  margin: "2rem auto",
  overflow: "auto",
  backgroundColor: `transparent !important`,
})

globalStyle(`${blogPost} table th, ${blogPost} table td`, {
  padding: "0.75rem",
  borderBottom: `1px solid ${theme.colors.muted}`,
  textAlign: "left",
})

globalStyle(`${blogPost} table th`, {
  fontWeight: theme.fontWeights.bold,
  backgroundColor: `${theme.colors.muted} !important`,
})

// Code blocks - center and style them nicely
globalStyle(`${blogPost} pre`, {
  margin: "2rem auto",
  padding: "1.5rem",
  backgroundColor: `${theme.colors.muted} !important`,
  borderRadius: "8px",
  overflow: "auto",
  fontSize: theme.fontSizes[1],
  lineHeight: theme.lineHeights.text,
})

globalStyle(`${blogPost} .wp-block-code`, {
  margin: "2rem auto",
  backgroundColor: `transparent !important`,
})

globalStyle(`${blogPost} code`, {
  backgroundColor: `${theme.colors.muted} !important`,
  padding: "0.2em 0.4em",
  borderRadius: "3px",
  fontSize: "0.9em",
})

// Separator blocks
globalStyle(`${blogPost} .wp-block-separator`, {
  margin: "3rem auto",
  width: "100px",
  height: "4px",
  backgroundColor: `${theme.colors.primary} !important`,
  border: "none",
  borderRadius: "2px",
})

globalStyle(`${blogPost} hr`, {
  margin: "3rem auto",
  width: "100px",
  height: "4px",
  backgroundColor: `${theme.colors.primary} !important`,
  border: "none",
  borderRadius: "2px",
})

// Responsive media queries for better mobile experience
globalStyle(`${blogPost} img, ${blogPost} video, ${blogPost} iframe`, {
  '@media': {
    'screen and (max-width: 768px)': {
      margin: "1rem auto",
      borderRadius: "4px",
    }
  }
})

globalStyle(`${blogPost} blockquote`, {
  '@media': {
    'screen and (max-width: 768px)': {
      margin: "1rem auto",
      padding: "1rem",
      fontSize: theme.fontSizes[3],
    }
  }
})

globalStyle(`${blogPost} table`, {
  '@media': {
    'screen and (max-width: 768px)': {
      fontSize: theme.fontSizes[1],
    }
  }
})

// Force text readability in all scenarios
globalStyle(`${blogPost} div, ${blogPost} span, ${blogPost} section`, {
  color: `${theme.colors.text} !important`,
  backgroundColor: `transparent !important`,
})
