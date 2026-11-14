import { style, globalStyle, keyframes } from "@vanilla-extract/css"
import { theme } from "../../theme.css"
import { media } from "../media.css"

// ---------------------------------------------------------------------------
// Hero
// ---------------------------------------------------------------------------

export const heroImageWrap = style({
  width: "100%",
  maxWidth: "560px",
  borderRadius: theme.radii.large,
  overflow: "hidden",
  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.35)",
})

export const heroImage = style({
  display: "block",
  width: "100%",
  height: "320px",
  objectFit: "cover",
  objectPosition: "center",

  "@media": {
    [media.medium]: {
      height: "420px",
    },
  },
})

// ---------------------------------------------------------------------------
// CTA banner
// ---------------------------------------------------------------------------

export const ctaBanner = style({
  background: `linear-gradient(135deg, ${theme.colors.primary} 0%, #0057a8 100%)`,
})

export const ctaBannerPlain = style({
  backgroundColor: theme.colors.black,
})

// ---------------------------------------------------------------------------
// Feature grid
// ---------------------------------------------------------------------------

export const featureCard = style({
  padding: theme.space[4],
  borderRadius: theme.radii.large,
  backgroundColor: "rgba(255, 255, 255, 0.04)",
  border: "1px solid rgba(255, 255, 255, 0.08)",
  height: "100%",
  transition: "transform 0.2s ease, border-color 0.2s ease",

  ":hover": {
    transform: "translateY(-4px)",
    borderColor: theme.colors.primary,
  },
})

export const featureIcon = style({
  fontSize: theme.fontSizes[6],
  lineHeight: 1,
  marginBottom: theme.space[3],
})

// ---------------------------------------------------------------------------
// Testimonials
// ---------------------------------------------------------------------------

export const testimonialAvatar = style({
  width: "48px",
  height: "48px",
  borderRadius: theme.radii.circle,
  objectFit: "cover",
  flexShrink: 0,
})

// ---------------------------------------------------------------------------
// Logo marquee — continuous horizontal scroll, pauses on hover
// ---------------------------------------------------------------------------

const scroll = keyframes({
  from: { transform: "translateX(0)" },
  to: { transform: "translateX(-50%)" },
})

export const marqueeViewport = style({
  overflow: "hidden",
  position: "relative",
  maskImage:
    "linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)",
  WebkitMaskImage:
    "linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)",
})

export const marqueeTrack = style({
  display: "flex",
  width: "max-content",
  gap: theme.space[6],
  animationName: scroll,
  animationTimingFunction: "linear",
  animationIterationCount: "infinite",
  ":hover": {
    animationPlayState: "paused",
  },
})

export const marqueeTrackSlow = style([marqueeTrack, { animationDuration: "60s" }])
export const marqueeTrackMedium = style([marqueeTrack, { animationDuration: "35s" }])
export const marqueeTrackFast = style([marqueeTrack, { animationDuration: "18s" }])

export const marqueeItem = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  height: "64px",
  flexShrink: 0,
})

export const marqueeImage = style({
  maxHeight: "100%",
  maxWidth: "160px",
  objectFit: "contain",
  filter: "grayscale(1) brightness(1.6)",
  opacity: 0.75,
  transition: "filter 0.2s ease, opacity 0.2s ease",
  ":hover": {
    filter: "none",
    opacity: 1,
  },
})

// ---------------------------------------------------------------------------
// Video embed
// ---------------------------------------------------------------------------

export const videoWrap = style({
  position: "relative",
  width: "100%",
  paddingTop: "56.25%", // 16:9
  borderRadius: theme.radii.large,
  overflow: "hidden",
  backgroundColor: theme.colors.black,
})

globalStyle(`${videoWrap} iframe`, {
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  border: 0,
})

export const videoCaption = style({
  marginTop: theme.space[2],
  color: theme.colors.muted,
})

// ---------------------------------------------------------------------------
// Matrix rain section — animated canvas background behind a headline/CTA
// ---------------------------------------------------------------------------

export const matrixSection = style({
  position: "relative",
  overflow: "hidden",
  backgroundColor: theme.colors.black,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
})

export const matrixSectionMedium = style([matrixSection, { minHeight: "420px" }])
export const matrixSectionLarge = style([matrixSection, { minHeight: "580px" }])
export const matrixSectionViewport = style([
  matrixSection,
  { minHeight: "100vh" },
])

export const matrixCanvasLayer = style({
  position: "absolute",
  inset: 0,
  zIndex: 0,
})

export const matrixScrim = style({
  position: "absolute",
  inset: 0,
  zIndex: 1,
  background:
    "radial-gradient(ellipse at center, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.75) 100%)",
})

export const matrixContent = style({
  position: "relative",
  zIndex: 2,
  maxWidth: "720px",
  padding: theme.space[4],
})

export const matrixHeading = style({
  color: theme.colors.text,
  textShadow: "0 0 24px rgba(0, 164, 255, 0.6)",
})

// ---------------------------------------------------------------------------
// Rich text
// ---------------------------------------------------------------------------

export const richTextParagraph = style({
  marginBottom: theme.space[3],
  color: theme.colors.muted,
  whiteSpace: "pre-wrap",
})

// ---------------------------------------------------------------------------
// Spacer
// ---------------------------------------------------------------------------

export const spacerSmall = style({ height: theme.space[3] })
export const spacerMedium = style({ height: theme.space[4] })
export const spacerLarge = style({ height: theme.space[5] })
export const spacerXlarge = style({ height: theme.space[6] })

// ---------------------------------------------------------------------------
// Email signup
// ---------------------------------------------------------------------------

export const signupCard = style({
  border: `1px solid rgba(0, 164, 255, 0.35)`,
  borderRadius: theme.radii.large,
  padding: theme.space[4],
  background: "linear-gradient(160deg, rgba(0, 164, 255, 0.12) 0%, rgba(0, 0, 0, 0) 60%)",
  "@media": {
    [media.medium]: { padding: theme.space[5] },
  },
})

export const signupBullets = style({
  margin: `0 0 ${theme.space[4]} 0`,
  paddingLeft: "1.2em",
  color: theme.colors.muted,
  lineHeight: 1.8,
})

export const signupForm = style({
  display: "grid",
  gap: theme.space[3],
  gridTemplateColumns: "1fr",
  alignItems: "end",
  "@media": {
    [media.medium]: { gridTemplateColumns: "1fr 1.4fr auto" },
  },
})

export const signupLabel = style({
  display: "grid",
  gap: "6px",
  fontSize: "14px",
  color: theme.colors.muted,
})

export const signupInput = style({
  width: "100%",
  minHeight: "48px",
  padding: "0 14px",
  borderRadius: theme.radii.button,
  border: "1px solid rgba(252, 254, 254, 0.25)",
  background: "rgba(255, 255, 255, 0.06)",
  color: theme.colors.text,
  fontSize: "16px",
  ":focus": {
    outline: `2px solid ${theme.colors.primary}`,
    outlineOffset: "1px",
  },
})

export const signupHoneypot = style({
  position: "absolute",
  left: "-9999px",
  width: "1px",
  height: "1px",
  opacity: 0,
})

export const signupButton = style({
  minHeight: "48px",
  padding: "0 22px",
  borderRadius: theme.radii.button,
  border: "none",
  background: theme.colors.primary,
  color: theme.colors.black,
  fontWeight: 700,
  fontSize: "16px",
  cursor: "pointer",
  ":disabled": { opacity: 0.6, cursor: "wait" },
})

export const signupSuccess = style({
  fontSize: "18px",
  fontWeight: 600,
  color: theme.colors.primary,
})

export const signupError = style({
  gridColumn: "1 / -1",
  color: "#ff8a8a",
  margin: 0,
})
