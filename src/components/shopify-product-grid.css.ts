import { style, globalStyle } from "@vanilla-extract/css"
import { theme } from "../theme.css"

export const productCard = style({
  display: "flex",
  flexDirection: "column",
  height: "100%",
  width: "100%",
  borderRadius: theme.radii.large,
  overflow: "hidden",
  boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  background: theme.colors.background,
  ":hover": {
    transform: "translateY(-4px)",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.15)",
  },
})

export const productImageContainer = style({
  width: "100%",
  height: "280px",
  overflow: "hidden",
  position: "relative",
  borderTopLeftRadius: theme.radii.large,
  borderTopRightRadius: theme.radii.large,
})

export const productImage = style({
  width: "100%",
  height: "100%",
  objectFit: "cover",
  transition: "transform 0.5s ease",
  ":hover": {
    transform: "scale(1.05)",
  },
})

export const placeholderImage = style({
  width: "100%",
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: theme.colors.muted,
  color: theme.colors.text,
})

export const productInfo = style({
  padding: theme.space[4],
  display: "flex",
  flexDirection: "column",
  flexGrow: 1,
  justifyContent: "space-between",
})

export const productTitle = style({
  marginBottom: theme.space[2],
  color: theme.colors.text,
  fontSize: theme.fontSizes[3],
  fontWeight: theme.fontWeights.bold,
})

export const productPrice = style({
  fontSize: theme.fontSizes[3],
  fontWeight: theme.fontWeights.medium,
  color: theme.colors.primary,
  marginBottom: theme.space[3],
})

export const productDescription = style({
  marginBottom: theme.space[3],
  color: theme.colors.muted,
})

// Global styles for product grid
globalStyle(".shopify-product-grid", {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
  gap: theme.space[4],
  margin: `${theme.space[4]} 0`,
})

// Responsive adjustments
globalStyle("@media (max-width: 640px) .shopify-product-grid", {
  gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
})
