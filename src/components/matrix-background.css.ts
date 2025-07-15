import { style } from "@vanilla-extract/css"

export const matrixContainer = style({
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  zIndex: -1, // Behind all content
  overflow: "hidden",
  pointerEvents: "none", // Don't interfere with page interaction
})

export const matrixCanvas = style({
  display: "block",
  width: "100%",
  height: "100%",
  opacity: 0.15, // Subtle effect so it doesn't interfere with readability
  filter: "blur(0.5px)", // Slight blur for better visual effect
})
