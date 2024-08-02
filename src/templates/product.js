import * as React from "react"
import { graphql } from "gatsby"
import Layout from "../components/layout"
import {
  Container,
  Box,
  Heading,
  Text,
  Button,
  Image,
} from "../components/ui"

export default function ProductTemplate({ data }) {
  const product = data.shopifyProduct

  return (
    <Layout>
      <Container>
        <Box paddingY={5}>
          <Heading as="h1">{product.title}</Heading>
          <Image src={product.featureImage.originalSrc} alt={product.images.altText} />
          <Text>{product.description}</Text>
          <Text>Price: ${product.priceRangeV2.minVariantPrice.amount}</Text>
          <Button to="/">Go Back</Button>
        </Box>
      </Container>
    </Layout>
  )
}

