import * as React from "react"
import { GatsbyImage, getImage, IGatsbyImageData } from "gatsby-plugin-image"
import ThriveCartButton from "./ThriveCartButton"
import * as styles from "./digital-product-card.css"

export interface DigitalProduct {
  id: string
  name: string
  price?: string | null
  isFree: boolean
  thrivecartProductId: string
  coverImage?: { gatsbyImageData: IGatsbyImageData; title?: string } | null
}

/**
 * Renders Contentful "Digital Product" entries (see
 * scripts/setup-digital-product-content-model.js) as a grid of buy cards.
 * Each Buy button opens the ThriveCart popup checkout for that product's
 * thrivecartProductId - see ThriveCartButton.tsx.
 */
export default function DigitalProductGrid({ products }: { products: DigitalProduct[] }) {
  if (!products || products.length === 0) return null

  return (
    <div className={styles.grid}>
      {products.map((product) => {
        const image = product.coverImage ? getImage(product.coverImage.gatsbyImageData) : null
        return (
          <div className={styles.card} key={product.id}>
            {image && (
              <GatsbyImage
                image={image}
                alt={product.coverImage?.title || product.name}
                className={styles.cover}
              />
            )}
            <div className={styles.body}>
              <h3 className={styles.name}>{product.name}</h3>
              <div className={styles.priceRow}>
                <span className={styles.priceTag}>
                  {product.isFree ? "FREE" : product.price || ""}
                </span>
                <ThriveCartButton
                  label={product.isFree ? "Download" : "Buy Now"}
                  productSlug={product.thrivecartProductId}
                />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
