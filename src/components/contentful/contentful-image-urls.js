import React from "react"
import { useStaticQuery, graphql } from "gatsby"

/**
 * Component to display all Contentful image URLs for debugging/reference
 */
const ContentfulImageUrls = () => {
  const data = useStaticQuery(graphql`
    query ContentfulImageUrlsQuery {
      allContentfulHomepageFeature {
        nodes {
          id
        }
      }
      allContentfulHomepageFeatureList {
        nodes {
          id
        }
      }
      allContentfulHomepageHero {
        nodes {
          id
          image {
            url
            title
            description
          }
        }
      }
      # Also check for homepage content
      homepage: contentfulHomepage {
        id
        title
        description
        content {
          __typename
          ... on ContentfulHomepageHero {
            id
          }
          ... on ContentfulHomepageLogoList {
            id
          }
        }
      }
    }
  `)

  if (process.env.NODE_ENV !== "development") {
    return null // Only show in development
  }

  return (
    <div
      style={{
        position: "fixed",
        top: "10px",
        right: "10px",
        backgroundColor: "rgba(0,0,0,0.8)",
        color: "white",
        padding: "10px",
        borderRadius: "5px",
        fontSize: "12px",
        maxWidth: "400px",
        maxHeight: "300px",
        overflow: "auto",
        zIndex: 9999,
      }}
    >
      <h4>Contentful Debug Info:</h4>

      {/* Homepage Info */}
      {data.homepage && (
        <div style={{ marginBottom: "10px" }}>
          <strong>Homepage: {data.homepage.id}</strong>
          <br />
          Title: {data.homepage.title || "No title"}
          <br />
          Description: {data.homepage.description || "No description"}
          <br />
          Content blocks: {data.homepage.content?.length || 0}
        </div>
      )}

      {/* Heroes */}
      {data.allContentfulHomepageHero.nodes.map(
        (hero) =>
          hero.image?.url && (
            <div key={hero.id} style={{ marginBottom: "10px" }}>
              <strong>Hero: {hero.id}</strong>
              <br />
              <a
                href={hero.image.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#4da6ff" }}
              >
                {hero.image.url}
              </a>
            </div>
          )
      )}

      {/* Features */}
      <div style={{ marginBottom: "10px" }}>
        <strong>
          Features found: {data.allContentfulHomepageFeature.nodes.length}
        </strong>
      </div>

      {/* Feature Lists */}
      <div style={{ marginBottom: "10px" }}>
        <strong>
          Feature Lists found:{" "}
          {data.allContentfulHomepageFeatureList.nodes.length}
        </strong>
      </div>
    </div>
  )
}

export default ContentfulImageUrls
