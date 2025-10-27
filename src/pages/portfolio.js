import * as React from "react"
import { graphql } from "gatsby"
import Layout from "../components/layout"
import { Container, Box, Heading, Text } from "../components/ui"
import SEOHead from "../components/head"

export default function Portfolio(props) {
  const { wpPage } = props.data

  return (
    <Layout>
      <Box paddingY={5}>
        <Container width="narrow">
          {wpPage ? (
            <>
              <Heading as="h1">{wpPage.title}</Heading>
              <div
                dangerouslySetInnerHTML={{
                  __html: wpPage.content || "",
                }}
              />
            </>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                padding: "100px",
              }}
            >
              <Heading as="h1">Portfolio</Heading>
              <Text>
                The Portfolio page content will be loaded from WordPress once it's configured.
                Please create a "Portfolio" page in your WordPress admin with slug "portfolio".
              </Text>
            </div>
          )}
        </Container>
      </Box>
    </Layout>
  )
}

export const Head = (props) => {
  const { wpPage } = props.data
  return <SEOHead title={wpPage?.title || "Portfolio"} description={wpPage?.excerpt || "Portfolio page"} />
}

export const query = graphql`
  {
    wpPage(slug: { eq: "portfolio" }) {
      id
      title
      content
      slug
      featuredImage {
        node {
          id
          sourceUrl
          altText
        }
      }
    }
  }
`
