import React from "react"
import { graphql, Link } from "gatsby"
import { GatsbyImage, getImage } from "gatsby-plugin-image"
import Layout from "../components/layout"
import { Container, Section, Box, Heading, Text, Subhead } from "../components/ui"

const VideoPostTemplate = ({ data: { post } }) => {
  if (!post) return null

  // Get YouTube thumbnail
  const thumbUrl = post.youtubeVideoId
    ? `https://img.youtube.com/vi/${post.youtubeVideoId}/maxresdefault.jpg`
    : null
  const featuredImage = post.featuredImage ? getImage(post.featuredImage) : null

  // YouTube embed URL
  const embedUrl = post.youtubeVideoId
    ? `https://www.youtube.com/embed/${post.youtubeVideoId}`
    : null

  return (
    <Layout>
      <Section paddingY={5}>
        <Container width="normal">
          {/* Back link */}
          <Box marginY={3}>
            <Link
              to="/videos/"
              style={{
                color: "#004ca3",
                textDecoration: "none",
                fontWeight: "bold",
              }}
            >
              ← Back to Videos
            </Link>
          </Box>

          {/* Title and meta */}
          <Box marginY={4}>
            <Text variant="kicker" marginY={1}>
              {new Date(post.publishDate).toLocaleDateString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </Text>

            <Heading as="h1" size="xl" marginY={2}>
              {post.title}
            </Heading>

            {post.excerpt && (
              <Text variant="lead" marginY={3}>
                {post.excerpt}
              </Text>
            )}

            {/* Categories */}
            {post.categories?.length > 0 && (
              <Box marginY={3}>
                <Flex gap={2} style={{ flexWrap: "wrap" }}>
                  {post.categories.map((category) => (
                    <Link
                      key={category.slug}
                      to={`/videos/?category=${category.slug}`}
                      style={{
                        fontSize: "0.9rem",
                        backgroundColor: "#f0f0f0",
                        color: "#666",
                        padding: "6px 12px",
                        borderRadius: "16px",
                        textDecoration: "none",
                        display: "inline-block",
                      }}
                    >
                      {category.name}
                    </Link>
                  ))}
                </Flex>
              </Box>
            )}
          </Box>

          {/* Video Player */}
          <Box marginY={4}>
            {embedUrl ? (
              <div
                style={{
                  position: "relative",
                  paddingBottom: "56.25%", /* 16:9 aspect ratio */
                  height: 0,
                  overflow: "hidden",
                  borderRadius: "8px",
                  backgroundColor: "#000",
                }}
              >
                <iframe
                  src={embedUrl}
                  title={post.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                  }}
                />
              </div>
            ) : (
              <Box
                style={{
                  backgroundColor: "#f0f0f0",
                  borderRadius: "8px",
                  padding: "3rem",
                  textAlign: "center",
                }}
              >
                <Text>No video available</Text>
              </Box>
            )}
          </Box>

          {/* Video info bar */}
          <Box
            style={{
              backgroundColor: "#f8f9fa",
              padding: "1rem",
              borderRadius: "8px",
              marginBottom: "2rem",
            }}
          >
            <Flex
              style={{
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "1rem",
              }}
            >
              {post.author && (
                <Text>
                  <strong>Author:</strong> {post.author}
                </Text>
              )}
              {post.duration && (
                <Text>
                  <strong>Duration:</strong> {post.duration}
                </Text>
              )}
              {post.videoViews !== undefined && (
                <Text>
                  <strong>Views:</strong> {post.videoViews.toLocaleString()}
                </Text>
              )}
            </Flex>
          </Box>

          {/* Video body content */}
          {post.body && (
            <Box
              marginY={5}
              className="video-content"
              style={{
                fontSize: "1.1rem",
                lineHeight: "1.8",
              }}
              dangerouslySetInnerHTML={{ __html: post.body }}
            />
          )}

          {/* Share section */}
          <Box
            marginY={5}
            style={{
              padding: "2rem",
              backgroundColor: "#f8f9fa",
              borderRadius: "8px",
              textAlign: "center",
            }}
          >
            <Subhead marginY={2}>Share this video</Subhead>
            <Text style={{ marginBottom: "1.5rem" }}>
              Help others discover this content by sharing it
            </Text>
            <Flex gap={3} style={{ justifyContent: "center" }}>
              <ShareButton
                url={typeof window !== "undefined" ? window.location.href : ""}
                title={post.title}
                network="facebook"
              >
                Facebook
              </ShareButton>
              <ShareButton
                url={typeof window !== "undefined" ? window.location.href : ""}
                title={post.title}
                network="twitter"
              >
                Twitter
              </ShareButton>
              <ShareButton
                url={typeof window !== "undefined" ? window.location.href : ""}
                title={post.title}
                network="linkedin"
              >
                LinkedIn
              </ShareButton>
            </Flex>
          </Box>
        </Container>
      </Section>
    </Layout>
  )
}

// Simple share button component
const ShareButton = ({ children, url, title, network }) => {
  const shareUrls = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
    linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
  }

  const handleClick = (e) => {
    e.preventDefault()
    const width = 600
    const height = 400
    const left = window.screenX + (window.innerWidth - width) / 2
    const top = window.screenY + (window.innerHeight - height) / 2

    window.open(
      shareUrls[network],
      "share",
      `width=${width},height=${height},left=${left},top=${top}`
    )
  }

  return (
    <button
      onClick={handleClick}
      style={{
        padding: "0.75rem 1.5rem",
        backgroundColor: "#004ca3",
        color: "white",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: "bold",
        fontSize: "0.95rem",
        transition: "background-color 0.2s ease",
      }}
      onMouseEnter={(e) => (e.target.style.backgroundColor = "#003d82")}
      onMouseLeave={(e) => (e.target.style.backgroundColor = "#004ca3")}
    >
      {children}
    </button>
  )
}

// Simple Flex component for layouts
const Flex = ({ children, gap, style }) => (
  <div
    style={{
      display: "flex",
      gap: gap ? `${gap}rem` : undefined,
      ...style,
    }}
  >
    {children}
  </div>
)

export const query = graphql`
  query VideoPost($id: String!) {
    post: contentfulVideoPost(id: { eq: $id }) {
      id
      title
      slug
      excerpt
      body
      publishDate
      author
      youtubeVideoId
      duration
      videoViews
      featuredImage {
        alt
        gatsbyImageData(width: 800, placeholder: BLURRED)
      }
      categories {
        name
        slug
      }
    }
  }
`

export default VideoPostTemplate
