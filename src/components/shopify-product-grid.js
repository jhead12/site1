import * as React from "react"
import { graphql } from "gatsby"
import { GatsbyImage, getImage } from "gatsby-plugin-image"
import {
  Container,
  Section,
  FlexList,
  Text,
  Kicker,
  Heading,
  Subhead,
  Box,
  ButtonList,
  IconLink
} from "./ui"
import * as styles from "./shopify-product-grid.css"

function formatPrice(priceV2) {
  if (!priceV2) return ""
  
  // Get the price and currency
  const amount = priceV2.amount || "0"
  const currencyCode = priceV2.currencyCode || "USD"
  
  // Format with locale
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
  }).format(amount)
}

function ShopifyProductCard(props) {
  const { product } = props
  
  // Safety check for product data
  if (!product) return null
  
  // Get product image
  const productImage = product.featuredImage?.localFile 
    ? getImage(product.featuredImage.localFile) 
    : null
    
  // Get price range
  const price = product.priceRange?.minVariantPrice
    ? formatPrice(product.priceRange.minVariantPrice)
    : "Price unavailable"

  return (
    <Box className={styles.productCard}>
      <Box className={styles.productImageContainer}>
        {productImage ? (
          <GatsbyImage
            alt={product.featuredImage?.altText || product.title}
            image={productImage}
            className={styles.productImage}
          />
        ) : (
          <div className={styles.placeholderImage}>
            <Text variant="caps">No Image</Text>
          </div>
        )}
      </Box>
      <Box className={styles.productInfo}>
        <Subhead className={styles.productTitle}>{product.title}</Subhead>
        <Text className={styles.productPrice}>{price}</Text>
        <Text variant="small" className={styles.productDescription}>
          {product.description && product.description.length > 100
            ? `${product.description.substring(0, 100)}...`
            : product.description}
        </Text>
        <ButtonList>
          <IconLink to={`/products/${product.handle}`} text="View Details" />
        </ButtonList>
      </Box>
    </Box>
  )
}

export default function ShopifyProductGrid(props) {
  const { title, subtitle, products, showMoreLink } = props
  
  if (!products || products.length === 0) {
    return null
  }

  return (
    <Section>
      <Container>
        {subtitle && <Kicker>{subtitle}</Kicker>}
        {title && <Heading>{title}</Heading>}
        <FlexList gap={4} variant="start" responsive>
          {products.map((product, i) => (
            <li key={product.id || i}>
              <ShopifyProductCard product={product} />
            </li>
          ))}
        </FlexList>
        {showMoreLink && (
          <Box textAlign="center" marginTop={4}>
            <IconLink to="/shop" text="View All Products" />
          </Box>
        )}
      </Container>
    </Section>
  )
}

export const query = graphql`
  fragment ShopifyProductGridContent on ShopifyProductGrid {
    id
    title
    subtitle
    products {
      id
      title
      handle
      description
      featuredImage {
        altText
        localFile {
          childImageSharp {
            gatsbyImageData(
              width: 600
              aspectRatio: 1
              placeholder: BLURRED
              formats: [AUTO, WEBP]
              transformOptions: {cropFocus: CENTER}
            )
          }
        }
      }
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
      variants {
        id
        title
        price
      }
    }
    showMoreLink
  }
`
