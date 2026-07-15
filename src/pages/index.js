import * as React from "react"
import { graphql } from "gatsby"
import Layout from "../components/layout"
import * as sections from "../components/sections"
import Fallback from "../components/fallback"
import SEOHead from "../components/head"
import RotatingHeroBanner from "../components/hero/rotating-hero-banner"

export default function Homepage(props) {
  // Defensive: handle missing data
  const data = props.data || {}
  const blogPosts = data.allContentfulBlogPost || { nodes: [] }

  // Check if homepage data exists (won't exist in bypass mode)
  const homepage = data.homepage || { blocks: [] }

  return (
    <Layout>
      {/* Dynamic Rotating Hero Banner */}
      <RotatingHeroBanner />

      {/* Contentful blocks - only render if they exist */}
      {homepage.blocks &&
        homepage.blocks.length > 0 &&
        homepage.blocks.map((block) => {
          const { id, blocktype, ...componentProps } = block
          const Component = sections[blocktype] || Fallback
          return <Component key={id} {...componentProps} />
        })}

      {/* Always render these core sections */}
      <sections.HomepageFeatureList />

      <sections.BeatsStatList />

      <sections.BlogFeature data={{ allContentfulBlogPost: blogPosts }} />

      {/* Shopify section - only show if products exist */}
      <sections.ShopFeature
        data={{
          allShopifyProduct:
            props.data && props.data.allShopifyProduct
              ? props.data.allShopifyProduct
              : { nodes: [] },
        }}
      />
    </Layout>
  )
}

export const Head = (props) => {
  const site = props.data?.site
  const title = site?.siteMetadata?.title || "Jeldon Music"
  const description =
    site?.siteMetadata?.description || "Music Producer & Audio Engineer"
  const image = props.data?.homepage?.image?.url || null
  return (
    <SEOHead
      title={title}
      description={description}
      image={image}
      pathname="/"
    />
  )
}

export const query = graphql`
  query HomePageQuery {
    site {
      siteMetadata {
        title
        description
      }
    }

    # Simplified homepage query - basic fields only
    homepage: contentfulHomepage {
      id
      title
      description
      image {
        id
        url
        title
        description
        gatsbyImageData(width: 1200)
      }
      blocks: content {
        id
        blocktype
        # Only query basic fields that exist on all types
        ... on ContentfulHomepageHero {
          id
          blocktype
          heading
          kicker
          subhead
          text
          image {
            id
            gatsbyImageData
            alt
          }
          links {
            id
            href
            text
          }
        }
        ... on ContentfulHomepageLogoList {
          id
          blocktype
          name
          text
          logos {
            id
            alt
            link
            image {
              id
              alt
              gatsbyImageData(height: 80)
            }
          }
        }
        ... on ContentfulHomepageCta {
          id
          text
          image {
            id
            gatsbyImageData
            alt
          }
        }
      }
    }

    allContentfulBlogPost(sort: { publishDate: DESC }, limit: 3) {
      nodes {
        id
        title
        slug
        excerpt
        publishDate(formatString: "MMMM DD, YYYY")
        featuredImage {
          url
          description
          alt
          gatsbyImageData(width: 600, placeholder: BLURRED, formats: [AUTO, WEBP, AVIF])
        }
      }
    }
  }
`
