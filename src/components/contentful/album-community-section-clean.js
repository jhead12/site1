import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import { GatsbyImage } from "gatsby-plugin-image"

const AlbumCommunitySection = () => {
  const data = useStaticQuery(graphql`
    query AlbumCommunitySectionQuery {
      # Try to get album/music related content from Contentful
      allContentfulHomepageFeatureList {
        nodes {
          id
        }
      }
      # Also check for general features that might contain album info
      allContentfulHomepageFeature {
        nodes {
          id
        }
      }
      # Use homepage hero for section content
      allContentfulHomepageHero {
        nodes {
          id
          image {
            gatsbyImageData
            alt
            url
          }
        }
      }
    }
  `)

  // Only use real Contentful data - no fallbacks
  const communitySection = data.allContentfulHomepageFeatureList.nodes[0]
  const albumFeatures = data.allContentfulHomepageFeature.nodes || []

  // Don't render if no data
  if (!communitySection && !albumFeatures.length) {
    return null
  }

  return (
    <section
      className="album-community-section"
      style={{
        padding: "60px 20px",
        maxWidth: "1200px",
        margin: "0 auto",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <h2
          style={{
            fontSize: "2rem",
            fontWeight: "600",
            marginBottom: "20px",
            color: "#333",
          }}
        >
          Join the community of artists who enjoyed the benefits of my works.
        </h2>
      </div>

      {albumFeatures.length > 0 && (
        <ul
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "30px",
            listStyle: "none",
            padding: 0,
            margin: 0,
          }}
        >
          {albumFeatures.map((feature, index) => (
            <li key={feature.id || index}>
              <div
                style={{
                  backgroundColor: "white",
                  borderRadius: "12px",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                  overflow: "hidden",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                }}
              >
                <div style={{ padding: "20px" }}>
                  <h3
                    style={{
                      fontSize: "1.2rem",
                      fontWeight: "600",
                      margin: "0",
                    }}
                  >
                    Feature {index + 1}
                  </h3>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export default AlbumCommunitySection
