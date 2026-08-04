import * as React from "react"
import { Button } from "./ui"

interface ThriveCartButtonProps {
  label: string
  productSlug: string
  productIdEnvVar?: string
  className?: string
}

/**
 * Links out to a hosted ThriveCart checkout page.
 * Account name comes from GATSBY_THRIVECART_ACCOUNT (already configured for
 * the beats store). Until a real product is created in ThriveCart for this
 * offer, GATSBY_THRIVECART_ACCOUNT falling back to "nomoneyblanks" plus the
 * placeholder productSlug will 404 — swap productIdEnvVar/productSlug once
 * the product exists.
 */
export default function ThriveCartButton({
  label,
  productSlug,
  productIdEnvVar,
  className,
}: ThriveCartButtonProps) {
  const account = process.env.GATSBY_THRIVECART_ACCOUNT || "nomoneyblanks"
  const productOverride = productIdEnvVar ? process.env[productIdEnvVar] : undefined
  const checkoutUrl = productOverride
    ? `https://${account}.thrivecart.com/${productOverride}/`
    : `https://${account}.thrivecart.com/${productSlug}/`

  return (
    <Button
      href={checkoutUrl}
      variant="primary"
      className={className}
      target="_blank"
      rel="noopener noreferrer"
    >
      {label}
    </Button>
  )
}
