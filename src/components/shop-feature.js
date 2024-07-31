import * as React from "react"
import { Link } from "gatsby"
import {
  Section,
  Flex,
  Button,
  Card,
  CardBlock,
  CardTitle,
  CardText
} from "./ui"

export default function ShopFeature(props) {
  const { allShopifyProduct } = props.data
  const products = allShopifyProduct.edges

  return (
    <Section padding={4} background="dark">
      <Flex wrap="wrap" justifyContent="center">
        {products.map(({ node }) => (
          <CardBlock key={node.id} style={{ width: '18rem', margin: '1rem' }}>
            <Card>
                <img src={node.featuredImage.originalSrc} alt={node.featuredImage.altText} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
              <CardTitle>{node.title}</CardTitle>
              <CardText>{node.description}</CardText>
              <Button variant="primary" as={Link} to={`/products/${node.handle}`}>
                View Product
              </Button>
            </Card>
          </CardBlock>
        ))}
      </Flex>
    </Section>
  )
}