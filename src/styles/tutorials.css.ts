import { style, styleVariants } from "@vanilla-extract/css"

export const pageContainer = style({
  maxWidth: "1200px",
  margin: "0 auto",
  padding: "0 1rem",
  paddingTop: "2rem",
})

export const pageHeader = style({
  textAlign: "center",
  marginBottom: "3rem",
})

export const title = style({
  fontSize: "3rem",
  fontWeight: 700,
  marginBottom: "1rem",
})

export const subtitle = style({
  fontSize: "1.25rem",
  color: "#4b5563",
  maxWidth: "42rem",
  margin: "0 auto",
})

export const filters = style({
  marginBottom: "2rem",
  display: "flex",
  flexWrap: "wrap",
  gap: "1rem",
  justifyContent: "center",
})

export const filterButton = style({
  padding: "0.5rem 1rem",
  backgroundColor: "#e5e7eb",
  color: "#374151",
  borderRadius: "0.5rem",
  border: "none",
  cursor: "pointer",
  transition: "background-color 0.2s",
  ":hover": {
    backgroundColor: "#d1d5db",
  },
})

export const filterButtonActive = style({
  backgroundColor: "#2563eb",
  color: "#ffffff",
  ":hover": {
    backgroundColor: "#1d4ed8",
  },
})

export const difficultyFilter = style({
  marginBottom: "2rem",
  display: "flex",
  justifyContent: "center",
  gap: "1rem",
})

export const difficultyButton = style({
  padding: "0.25rem 0.75rem",
  borderRadius: "9999px",
  fontSize: "0.875rem",
  border: "none",
  cursor: "pointer",
  transition: "background-color 0.2s",
})

export const difficultyVariants = styleVariants({
  beginner: { backgroundColor: "#dcfce7", color: "#166534" },
  intermediate: { backgroundColor: "#fef9c3", color: "#854d0e" },
  advanced: { backgroundColor: "#fee2e2", color: "#991b1b" },
  default: { backgroundColor: "#f3f4f6", color: "#374151" },
})

export const tutorialsGrid = style({
  display: "grid",
  gridTemplateColumns: "repeat(1, 1fr)",
  gap: "1.5rem",
  "@media": {
    "screen and (min-width: 768px)": {
      gridTemplateColumns: "repeat(2, 1fr)",
    },
    "screen and (min-width: 1024px)": {
      gridTemplateColumns: "repeat(3, 1fr)",
    },
  },
})

export const tutorialCard = style({
  backgroundColor: "#ffffff",
  border: "1px solid #e5e7eb",
  borderRadius: "0.5rem",
  overflow: "hidden",
  transition: "box-shadow 0.2s",
  ":hover": {
    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
  },
})

export const cardImage = style({
  position: "relative",
  height: "12rem",
  backgroundColor: "#e5e7eb",
})

export const cardImageGradient = style({
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "linear-gradient(to bottom right, #60a5fa, #a855f7)",
})

export const cardImageGradientFallback = style({
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "linear-gradient(to bottom right, #9ca3af, #4b5563)",
})

export const cardImageText = style({
  color: "#ffffff",
  fontSize: "1.125rem",
  fontWeight: 600,
})

export const iconLarge = style({
  width: "3rem",
  height: "3rem",
  color: "#ffffff",
})

export const playButtonOverlay = style({
  position: "absolute",
  inset: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
})

export const playButton = style({
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  borderRadius: "9999px",
  padding: "0.75rem",
})

export const playIcon = style({
  width: "2rem",
  height: "2rem",
  color: "#ffffff",
})

export const difficultyBadge = style({
  position: "absolute",
  top: "0.75rem",
  left: "0.75rem",
})

export const difficultyBadgeText = style({
  padding: "0.25rem 0.5rem",
  borderRadius: "9999px",
  fontSize: "0.75rem",
  fontWeight: 500,
})

export const durationBadge = style({
  position: "absolute",
  top: "0.75rem",
  right: "0.75rem",
})

export const durationBadgeText = style({
  backgroundColor: "rgba(0, 0, 0, 0.7)",
  color: "#ffffff",
  padding: "0.25rem 0.5rem",
  borderRadius: "0.25rem",
  fontSize: "0.75rem",
})

export const cardContent = style({
  padding: "1.5rem",
})

export const tutorialTitle = style({
  fontSize: "1.25rem",
  fontWeight: 600,
  marginBottom: "0.5rem",
})

export const tutorialLink = style({
  color: "#111827",
  transition: "color 0.2s",
  ":hover": {
    color: "#2563eb",
  },
})

export const tutorialMeta = style({
  display: "flex",
  flexWrap: "wrap",
  gap: "0.75rem",
  fontSize: "0.875rem",
  color: "#4b5563",
})

export const categoryTag = style({
  backgroundColor: "#dbeafe",
  color: "#1e40af",
  padding: "0.25rem 0.5rem",
  borderRadius: "0.25rem",
})

export const excerpt = style({
  color: "#374151",
  fontSize: "0.875rem",
  marginBottom: "1rem",
  display: "-webkit-box",
  WebkitLineClamp: 3,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
})

export const cardFooter = style({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
})

export const metaText = style({
  fontSize: "0.875rem",
  color: "#6b7280",
})

export const watchButton = style({
  padding: "0.5rem 1rem",
  backgroundColor: "#2563eb",
  color: "#ffffff",
  fontSize: "0.875rem",
  borderRadius: "0.25rem",
  border: "none",
  cursor: "pointer",
  textDecoration: "none",
  display: "inline-block",
  transition: "background-color 0.2s",
  ":hover": {
    backgroundColor: "#1d4ed8",
  },
})

export const emptyState = style({
  textAlign: "center",
  padding: "3rem 0",
})

export const emptyIcon = style({
  width: "4rem",
  height: "4rem",
  margin: "0 auto",
  color: "#9ca3af",
  marginBottom: "1rem",
})

export const emptyTitle = style({
  fontSize: "1.25rem",
  fontWeight: 600,
  color: "#4b5563",
  marginBottom: "0.5rem",
})

export const emptyText = style({
  color: "#6b7280",
})

export const ctaSection = style({
  marginTop: "3rem",
  textAlign: "center",
})

export const ctaBox = style({
  background: "linear-gradient(to right, #22c55e, #2563eb)",
  color: "#ffffff",
  borderRadius: "0.5rem",
  padding: "2rem",
})

export const ctaTitle = style({
  fontSize: "1.5rem",
  fontWeight: 700,
  marginBottom: "0.75rem",
})

export const ctaText = style({
  marginBottom: "1.5rem",
  opacity: 0.9,
})

export const ctaButton = style({
  backgroundColor: "#ffffff",
  color: "#2563eb",
  fontWeight: 600,
  padding: "0.75rem 2rem",
  borderRadius: "0.5rem",
  border: "none",
  cursor: "pointer",
  transition: "background-color 0.2s",
  ":hover": {
    backgroundColor: "#f3f4f6",
  },
})

export const tutorialsPage = style({})