import * as React from "react"
import { Link } from "gatsby"
import { Container, Section, Flex, Button, Heading, Text, Box } from "./ui"

export default function ShopFeature(props) {
  const { allShopifyProduct } = props.data

  // Only use real Shopify data - no fallbacks
  const products = allShopifyProduct?.edges?.length
    ? allShopifyProduct.edges.slice(0, 6).map((edge) => edge.node)
    : allShopifyProduct?.nodes?.slice(0, 6) || []

  // Don't render if no products
  if (!products.length) {
    return null
  }

  return (
    <Section padding={5} background="muted">
      <Container>
        <Box textAlign="center" marginBottom={4}>
          <Heading as="h2">Featured Products</Heading>
          <Text variant="lead">
            Check out our latest beats, tracks, and merchandise
          </Text>
        </Box>

        <Flex wrap="wrap" gap={4} justifyContent="center">
          {products.map((product) => (
            <Box
              key={product.id || product.handle}
              width={["100%", "45%", "30%"]}
              marginBottom={4}
            >
              <Box
                backgroundColor="white"
                borderRadius="8px"
                padding={3}
                boxShadow="0 2px 8px rgba(0,0,0,0.1)"
                height="100%"
                display="flex"
                flexDirection="column"
              >
                {product.images && product.images[0] && (
                  <Box marginBottom={3}>
                    <img
                      src={product.images[0].url}
                      alt={product.images[0].altText || product.title}
                      style={{
                        width: "100%",
                        height: "200px",
                        objectFit: "cover",
                        borderRadius: "4px",
                      }}
                    />
                  </Box>
                )}

                <Box flex="1" display="flex" flexDirection="column">
                  <Heading as="h3" variant="subhead" marginBottom={2}>
                    {product.title}
                  </Heading>

                  {product.description && (
                    <Text
                      variant="body"
                      marginBottom={3}
                      style={{
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {product.description}
                    </Text>
                  )}

                  {product.priceRangeV2 && (
                    <Text variant="body" fontWeight="bold" marginBottom={3}>
                      ${product.priceRangeV2.minVariantPrice.amount}
                      {product.priceRangeV2.minVariantPrice.amount !==
                        product.priceRangeV2.maxVariantPrice.amount &&
                        ` - $${product.priceRangeV2.maxVariantPrice.amount}`}
                    </Text>
                  )}

                  <Box marginTop="auto">
                    {product.onlineStoreUrl ? (
                      <Button
                        variant="primary"
                        as="a"
                        href={product.onlineStoreUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View Product
                      </Button>
                    ) : (
                      <Button
                        variant="primary"
                        as={Link}
                        to={`/products/${product.handle}`}
                      >
                        View Product
                      </Button>
                    )}
                  </Box>
                </Box>
              </Box>
            </Box>
          ))}
        </Flex>

        <Box textAlign="center" marginTop={4}>
          <Button variant="outline" as={Link} to="/products">
            View All Products
          </Button>
        </Box>
      </Container>
    </Section>
  )
}
