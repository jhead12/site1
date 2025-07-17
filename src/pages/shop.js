import React, { useState, useEffect } from "react"
import { graphql } from "gatsby"
import Layout from "../components/layout"
import {
  Container,
  Section,
  Box,
  Heading,
  Text,
  Flex,
  FlexList,
  Kicker,
  Space,
  Subhead,
  Button
} from "../components/ui"
import SEOHead from "../components/head"
import ShopifyProductGrid from "../components/shopify-product-grid"

// Filter component for products
function ProductFilters({ filters, activeFilters, setActiveFilters }) {
  const handleFilterChange = (filterType, value) => {
    setActiveFilters(prev => ({
      ...prev,
      [filterType]: value === "all" ? "" : value
    }))
  }

  return (
    <Box marginY={4}>
      <Subhead marginBottom={3}>Filter Products</Subhead>
      
      {/* Product Type Filter */}
      {filters.productTypes.length > 0 && (
        <Box marginBottom={3}>
          <Text fontWeight="bold" marginBottom={2}>Product Type</Text>
          <FlexList gap={2} wrap>
            <Button 
              variant={!activeFilters.productType ? "primary" : "secondary"}
              onClick={() => handleFilterChange("productType", "all")}
              size="small"
            >
              All
            </Button>
            {filters.productTypes.map(type => (
              <Button
                key={type}
                variant={activeFilters.productType === type ? "primary" : "secondary"}
                onClick={() => handleFilterChange("productType", type)}
                size="small"
              >
                {type}
              </Button>
            ))}
          </FlexList>
        </Box>
      )}
      
      {/* Tags Filter */}
      {filters.tags.length > 0 && (
        <Box>
          <Text fontWeight="bold" marginBottom={2}>Tags</Text>
          <FlexList gap={2} wrap>
            <Button 
              variant={!activeFilters.tag ? "primary" : "secondary"}
              onClick={() => handleFilterChange("tag", "all")}
              size="small"
            >
              All
            </Button>
            {filters.tags.map(tag => (
              <Button
                key={tag}
                variant={activeFilters.tag === tag ? "primary" : "secondary"}
                onClick={() => handleFilterChange("tag", tag)}
                size="small"
              >
                {tag}
              </Button>
            ))}
          </FlexList>
        </Box>
      )}
    </Box>
  )
}

export default function ShopPage({ data = {} }) {
  // Temporarily disable Shopify functionality until properly configured
  // Check if Shopify data is available
  const hasShopifyData = data.allShopifyProduct && data.allShopifyProduct.nodes
  const allProducts = hasShopifyData ? data.allShopifyProduct.nodes : []
  
  const [filteredProducts, setFilteredProducts] = useState(allProducts)
  const [activeFilters, setActiveFilters] = useState({
    productType: "",
    tag: ""
  })

  // Extract all available filters from products
  const filters = {
    productTypes: [...new Set(allProducts.filter(p => p.productType).map(p => p.productType))],
    tags: [...new Set(allProducts.flatMap(p => p.tags || []))]
  }

  // Filter products when active filters change
  useEffect(() => {
    let result = [...allProducts]
    
    // Apply product type filter
    if (activeFilters.productType) {
      result = result.filter(p => p.productType === activeFilters.productType)
    }
    
    // Apply tag filter
    if (activeFilters.tag) {
      result = result.filter(p => p.tags && p.tags.includes(activeFilters.tag))
    }
    
    setFilteredProducts(result)
  }, [activeFilters, allProducts])
  
  // Always show the coming soon message when Shopify is not properly configured
  // This prevents build errors when the GraphQL query is commented out
  if (!hasShopifyData) {
    return (
      <Layout>
        <Section>
          <Container>
            <Box padding={5} textAlign="center">
              <Heading>Shopify Store Coming Soon</Heading>
              <Space size={3} />
              <Text variant="lead">Our product catalog will be available here soon.</Text>
              <Space size={3} />
              <Text>
                This page will automatically populate once your Shopify store is connected.
              </Text>
            </Box>
          </Container>
        </Section>
      </Layout>
    )
  }

  return (
    <Layout>
      <Section paddingY={5}>
        <Container>
          <Box textAlign="center" marginBottom={5}>
            <Kicker>Jeldon Music Store</Kicker>
            <Heading as="h1">Shop Our Products</Heading>
            <Text variant="lead">Browse our collection of beats, audio tools, and merchandise</Text>
          </Box>
          
          <Flex gap={5} flexDirection={["column", "column", "row"]}>
            {/* Sidebar Filters */}
            <Box width={["100%", "100%", "25%"]}>
              <ProductFilters 
                filters={filters} 
                activeFilters={activeFilters} 
                setActiveFilters={setActiveFilters}
              />
            </Box>
            
            {/* Product Grid */}
            <Box width={["100%", "100%", "75%"]}>
              {filteredProducts.length > 0 ? (
                <ShopifyProductGrid products={filteredProducts} />
              ) : (
                <Box padding={5} textAlign="center">
                  <Text>No products match the selected filters.</Text>
                  <Button onClick={() => setActiveFilters({ productType: "", tag: "" })} marginTop={3}>
                    Clear Filters
                  </Button>
                </Box>
              )}
            </Box>
          </Flex>
        </Container>
      </Section>
    </Layout>
  )
}

export const Head = () => (
  <SEOHead 
    title="Shop | Jeldon Music" 
    description="Shop beats, audio tools, and merchandise from Jeldon Music"
  />
)

// Shopify query - will be enabled when Shopify is properly configured
// export const query = graphql`
//   query {
//     allShopifyProduct(sort: {updatedAt: DESC}) {
//       nodes {
//         id
//         title
//         handle
//         description
//         productType
//         tags
//         featuredImage {
//           altText
//           localFile {
//             childImageSharp {
//               gatsbyImageData(
//                 width: 600
//                 aspectRatio: 1
//                 placeholder: BLURRED
//                 formats: [AUTO, WEBP]
//                 transformOptions: {cropFocus: CENTER}
//               )
//             }
//           }
//         }
//         priceRange {
//           minVariantPrice {
//             amount
//             currencyCode
//           }
//         }
//         variants {
//           id
//           title
//           priceV2 {
//             amount
//             currencyCode
//           }
//         }
//       }
//     }
//   }
// `
