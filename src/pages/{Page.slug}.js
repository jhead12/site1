import * as React from "react"
import { graphql } from "gatsby"
import Layout from "../components/layout"
import { Container, Box, Heading } from "../components/ui"
import SEOHead from "../components/head"

export default function Page(props) {
  const { Page } = props.data

  return (
    <Layout>
      <Box paddingY={5}>
        <Container width="narrow">
          <Heading as="h1">{Page.title}</Heading>
          <div
            dangerouslySetInnerHTML={{
              __html: Page.html,
            }}
          />
        </Container>
      </Box>
    </Layout>
  )
}
export const Head = (props) => {
  const { page } = props.data
  return <SEOHead {...page} />
}
export const query = graphql`
query {
  wpPage{
    id
    link
    title
    slug
    featuredImage {
      node {
        id
      }
    }
    
  }
}
`
