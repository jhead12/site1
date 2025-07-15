import * as React from "react"
import { graphql } from "gatsby"
import Layout from "../components/layout"
import * as sections from "../components/sections"
import Fallback from "../components/fallback"
import SEOHead from "../components/head"
import RotatingHeroBanner from "../components/hero/rotating-hero-banner"
import { getDemoBlogPosts } from "../utils/fallback-data"

export default function Homepage(props) {
  // Defensive: handle missing data
  const data = props.data || {};
  const wpPosts = data.allWpPost?.nodes;
  const wpBypassMode = !wpPosts;
  const blogPosts = wpBypassMode
    ? { nodes: getDemoBlogPosts(5) } // Use 5 demo posts when WordPress is bypassed
    : data.allWpPost;

  // Check if homepage data exists (won't exist in bypass mode)
  const homepage = data.homepage || { blocks: [] };

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

      <sections.BlogFeature data={{ allWpPost: blogPosts }} />

      {/* Shopify section - only show if products exist */}
      <sections.ShopFeature
        data={{
          allShopifyProduct: (props.data && props.data.allShopifyProduct) ? props.data.allShopifyProduct : { nodes: [] },
        }}
      />

      {wpBypassMode && (
        <div
          style={{
            textAlign: "center",
            padding: "20px",
            background: "#fff8e1",
            margin: "20px auto",
            maxWidth: "800px",
            borderRadius: "8px",
          }}
        >
          <p style={{ margin: 0 }}>
            <strong>WordPress Bypass Mode:</strong> Sample content is being
            displayed. Connect to WordPress to see actual content.
          </p>
        </div>
      )}
    </Layout>
  )
}

export const Head = (props) => {
  const site = props.data?.site;
  const title = site?.siteMetadata?.title || "Jeldon Music";
  const description = site?.siteMetadata?.description || "Music Producer & Audio Engineer";
  const image = props.data?.homepage?.image?.url || null;
  return (
    <SEOHead
      title={title}
      description={description}
      image={image}
      pathname="/"
    />
  );
}

export const query = graphql`
  query HomePageQuery($BYPASS_WORDPRESS: Boolean = false) {
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
          text
          image {
            id
            gatsbyImageData
            alt
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

    allWpPost(sort: { date: DESC }, limit: 3) @skip(if: $BYPASS_WORDPRESS) {
      nodes {
        id
        title
        slug
        excerpt
        date(formatString: "MMMM DD, YYYY")
      }
    }
  }
`
