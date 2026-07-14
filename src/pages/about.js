import * as React from "react"
import { graphql } from "gatsby"
import { GatsbyImage, getImage } from "gatsby-plugin-image"
import Layout from "../components/layout"
import { Container, Box, Heading, Text } from "../components/ui"
import SEOHead from "../components/head"

export default function About(props) {
  const page = props.data.contentfulPage

  if (!page) {
    return (
      <Layout>
        <Box paddingY={5}>
          <Container width="narrow">
            <Heading as="h1">About</Heading>
            <Text>
              About page content will appear once a Contentful <code>page</code>{" "}
              entry with slug <code>about</code> is published.
            </Text>
          </Container>
        </Box>
      </Layout>
    )
  }

  const imageData = page.image?.gatsbyImageData

  return (
    <Layout>
      <Box paddingY={5}>
        <Container width="narrow">
          <Heading as="h1">{page.title}</Heading>
          {page.description && <Text variant="lead">{page.description}</Text>}
          {page.image && (imageData || page.image.url) && (
            <Box
              style={{ textAlign: "center", margin: "2rem 0" }}
            >
              {imageData ? (
                <GatsbyImage
                  alt={page.image.alt || page.image.description || page.title}
                  image={getImage(imageData)}
                  style={{ borderRadius: "8px" }}
                />
              ) : (
                <img
                  src={page.image.url}
                  alt={page.image.alt || page.image.description || page.title}
                  style={{ width: "100%", borderRadius: "8px" }}
                />
              )}
            </Box>
          )}
          <div dangerouslySetInnerHTML={{ __html: page.html || "" }} />
        </Container>
      </Box>
    </Layout>
  )
}

export const Head = (props) => {
  const page = props.data.contentfulPage
  return (
    <SEOHead
      title={page?.title || "About"}
      description={page?.description || "About page"}
      pathname="/about/"
    />
  )
}

export const query = graphql`
  query AboutPage {
    contentfulPage(slug: { eq: "about" }) {
      id
      title
      slug
      description
      html
      image {
        id
        url
        alt
        description
        gatsbyImageData(width: 1200, placeholder: BLURRED)
      }
    }
  }
`