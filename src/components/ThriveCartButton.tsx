import * as React from "react"
import { Button } from "./ui"

interface ThriveCartButtonProps {
  label: string
  productSlug: string
  productIdEnvVar?: string
  className?: string
}

/**
 * Triggers ThriveCart's popup checkout so the buyer stays on this domain
 * instead of being redirected to a hosted checkout page. Requires the
 * ThriveCart embed script to be loaded on the page (see head.js).
 * Account name comes from GATSBY_THRIVECART_ACCOUNT, defaulting to the
 * real "nomoneyblanks" subdomain. productIdEnvVar should hold ThriveCart's
 * numeric product ID (e.g. GATSBY_THRIVECART_WONDERKIT_ID=20); productSlug
 * is used as a fallback only for offers that don't have a real ID wired up
 * yet, and will 404 in the popup until they do.
 */
export default function ThriveCartButton({
  label,
  productSlug,
  productIdEnvVar,
  className,
}: ThriveCartButtonProps) {
  const account = process.env.GATSBY_THRIVECART_ACCOUNT || "nomoneyblanks"
  const productId = (productIdEnvVar ? process.env[productIdEnvVar] : undefined) || productSlug

  return (
    <Button
      href="#"
      onClick={(e: React.MouseEvent) => e.preventDefault()}
      variant="primary"
      className={`thrivecart-button ${className || ""}`.trim()}
      data-thrivecart-account={account}
      data-thrivecart-product={productId}
    >
      {label}
    </Button>
  )
}
