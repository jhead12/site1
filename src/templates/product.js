import React, { useState } from "react"
import { graphql } from "gatsby"
import { GatsbyImage, getImage } from "gatsby-plugin-image"
import Layout from "../components/layout"
import {
  Container,
  Box,
  Heading,
  Kicker,
  Text,
  ButtonList,
  Button,
  Section,
  Flex,
  FlexList,
  Subhead
} from "../components/ui"
import SEOHead from "../components/head"

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

export default function ProductTemplate({ data = {} }) {
  // Handle case where Shopify data isn't available (query is commented out)
  const product = data.shopifyProduct || null
  const [selectedVariant, setSelectedVariant] = useState(
    product?.variants?.length > 0 ? product.variants[0] : null
  )
  
  if (!product) {
    return (
      <Layout>
        <Container>
          <Box padding={4}>
            <Heading>Product not found</Heading>
            <Text>The requested product could not be found.</Text>
          </Box>
        </Container>
      </Layout>
    )
  }

  const productImage = product.featuredImage?.localFile 
    ? getImage(product.featuredImage.localFile) 
    : null
    
  // Format the price based on selected variant or default price
  const price = selectedVariant?.priceV2
    ? formatPrice(selectedVariant.priceV2)
    : product.priceRange?.minVariantPrice
    ? formatPrice(product.priceRange.minVariantPrice)
    : "Price unavailable"
  
  // Handle add to cart (placeholder - will connect to your cart system)
  const handleAddToCart = () => {
    console.log("Adding to cart:", product.title, selectedVariant?.title)
    // Connect to Shopify Buy SDK or your cart system
    // e.g., client.checkout.addLineItems(checkoutId, [{variantId: selectedVariant.id}])
    
    // Show temporary success message
    alert(`${product.title} (${selectedVariant?.title || "Standard"}) added to cart!`)
  }

  return (
    <Layout>
      <Section padding={5}>
        <Container>
          <Flex gap={6} flexDirection={["column", "column", "row"]}>
            {/* Product Image */}
            <Box width={["100%", "100%", "50%"]}>
              {productImage ? (
                <GatsbyImage 
                  image={productImage} 
                  alt={product.featuredImage?.altText || product.title} 
                  style={{ borderRadius: "8px" }}
                />
              ) : (
                <Box 
                  backgroundColor="muted" 
                  height="500px" 
                  display="flex" 
                  alignItems="center" 
                  justifyContent="center"
                  borderRadius="8px"
                >
                  <Text>No image available</Text>
                </Box>
              )}
            </Box>
            
            {/* Product Details */}
            <Box width={["100%", "100%", "50%"]}>
              {product.productType && (
                <Kicker>{product.productType}</Kicker>
              )}
              <Heading as="h1" marginY={3}>{product.title}</Heading>
              <Text fontSize={4} fontWeight="bold" color="primary" marginY={3}>
                {price}
              </Text>
              
              <Box marginY={4}>
                <Text dangerouslySetInnerHTML={{ __html: product.descriptionHtml }} />
              </Box>
              
              {/* Variants */}
              {product.variants?.length > 1 && (
                <Box marginY={4}>
                  <Subhead>Options</Subhead>
                  <FlexList gap={2} wrap>
                    {product.variants.map(variant => (
                      <Button 
                        key={variant.id} 
                        onClick={() => setSelectedVariant(variant)}
                        variant={selectedVariant?.id === variant.id ? "primary" : "secondary"}
                      >
                        {variant.title}
                      </Button>
                    ))}
                  </FlexList>
                </Box>
              )}
              
              {/* Add to Cart */}
              <Box marginY={4}>
                <ButtonList>
                  <Button variant="primary" onClick={handleAddToCart}>
                    Add to Cart
                  </Button>
                  <Button variant="secondary" href="/shop">
                    Back to Shop
                  </Button>
                </ButtonList>
              </Box>
              
              {/* Additional Product Details */}
              {product.tags && product.tags.length > 0 && (
                <Box marginY={4}>
                  <Subhead>Tags</Subhead>
                  <Flex gap={2} wrap>
                    {product.tags.map(tag => (
                      <Box 
                        key={tag} 
                        padding={2} 
                        backgroundColor="muted" 
                        borderRadius="default"
                      >
                        <Text variant="small">{tag}</Text>
                      </Box>
                    ))}
                  </Flex>
                </Box>
              )}
            </Box>
          </Flex>
        </Container>
      </Section>
    </Layout>
  )
}

export const Head = ({ data = {} }) => {
  // Handle case where Shopify data isn't available (query is commented out)
  const product = data.shopifyProduct || null
  
  if (!product) {
    return (
      <SEOHead
        title="Product | Jeldon Music"
        description="Shop beats, audio tools, and merchandise from Jeldon Music"
      />
    )
  }
  
  return (
    <SEOHead
      title={product.title}
      description={product.description || `Buy ${product.title} from Jeldon Music`}
      image={product.featuredImage?.localFile?.childImageSharp?.gatsbyImageData}
    />
  )
}

// Shopify product query - will be enabled when Shopify is properly configured
// export const query = graphql`
//   query($id: String!) {
//     shopifyProduct(id: { eq: $id }) {
//       id
//       title
//       handle
//       description
//       descriptionHtml
//       productType
//       tags
//       featuredImage {
//         altText
//         localFile {
//           childImageSharp {
//             gatsbyImageData(
//               width: 800
//               placeholder: BLURRED
//               formats: [AUTO, WEBP]
//             )
//           }
//         }
//       }
//       priceRange {
//         minVariantPrice {
//           amount
//           currencyCode
//         }
//       }
//       variants {
//         id
//         title
//         priceV2 {
//           amount
//           currencyCode
//         }
//         availableForSale
//       }
//     }
//   }
// `
