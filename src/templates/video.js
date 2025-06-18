import * as React from "react"
import { Link, graphql } from "gatsby"
import { GatsbyImage, getImage } from "gatsby-plugin-image"
import Layout from "../components/layout"
import {
  Container,
  Box,
  Space,
  Heading,
  Text,
  Subhead,
  Flex,
} from "../components/ui"
import SEOHead from "../components/head"

export default function VideoPost({ data, pageContext }) {
  const video = data.wpVideo
  const relatedVideos = data.allWpVideo?.nodes || []
  const { previousVideo, nextVideo } = pageContext || {}
  
  // Get featured image
  const featuredImage = video?.featuredImage?.node?.localFile ? 
    getImage(video.featuredImage.node.localFile) : null
  
  // Extract YouTube ID from title or content as fallback
  const extractYouTubeId = (text) => {
    if (!text) return null;
    // Try to match YouTube ID patterns like v=dQw4w9WgXcQ or youtu.be/dQw4w9WgXcQ
    const youtubeRegex = /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/i;
    const match = text.match(youtubeRegex);
    return match ? match[1] : null;
  };
  
  // Get YouTube video ID for embedding directly from ACF fields or extract from content
  const youtubeVideoId = video?.videoDetails?.youtubeVideoId || 
                         extractYouTubeId(video?.content) || 
                         extractYouTubeId(video?.title);
  
  return (
    <Layout>
      <Container>
        <Box paddingY={5}>
          <Heading as="h1" center>
            {video?.title || "Video"}
          </Heading>
          <Space size={4} />
          
          <Box center>
            <Text variant="bold">Jeldon</Text>
          </Box>
          
          <Space size={4} />
          <Text center>{video?.date || "Date unavailable"}</Text>
          <Space size={4} />
          
          {/* Video Player */}
          <Box marginY={5}>
            {youtubeVideoId ? (
              <Box 
                style={{
                  position: 'relative',
                  paddingBottom: '56.25%', // 16:9 aspect ratio
                  height: 0,
                  overflow: 'hidden',
                  borderRadius: '8px'
                }}
              >
                <iframe
                  src={`https://www.youtube.com/embed/${youtubeVideoId}`}
                  title={video?.title || "Video"}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%'
                  }}
                />
              </Box>
            ) : featuredImage ? (
              <GatsbyImage 
                image={featuredImage} 
                alt={video?.featuredImage?.node?.altText || video?.title || "Video"} 
                style={{ borderRadius: '8px' }}
              />
            ) : (
              <Box 
                style={{
                  width: '100%',
                  height: '400px',
                  backgroundColor: '#f0f0f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px dashed #ccc',
                  borderRadius: '8px'
                }}
              >
                <Text>No video available</Text>
              </Box>
            )}
          </Box>
          
          {/* Video Details */}
          <Box marginY={4}>
            <Flex>
              {video?.videoDetails?.videoDuration && (
                <Text variant="bold">Duration: {video.videoDetails.videoDuration}</Text>
              )}
              {video?.videoDetails?.videoViews && (
                <Text style={{ marginLeft: '20px' }}>Views: {video.videoDetails.videoViews}</Text>
              )}
            </Flex>
          </Box>
          
          
          {/* Categories */}
          {video?.videoCategories?.nodes?.length > 0 && (
            <Box marginY={3}>
              <Text variant="bold">Categories: </Text>
              {video.videoCategories.nodes.map((category, index) => (
                <span key={category.id}>
                  {category.name}
                  {index < video.videoCategories.nodes.length - 1 ? ', ' : ''}
                </span>
              ))}
            </Box>
          )}
          
          {/* Content */}
          {(video?.content || video?.excerpt) && (
            <Box marginY={4}>
              <div dangerouslySetInnerHTML={{ 
                __html: video?.content || video?.excerpt || '' 
              }} />
            </Box>
          )}
          
          {/* Navigation */}
          <Box marginY={5}>
            <Flex style={{ justifyContent: 'space-between', flexWrap: 'wrap' }}>
              <div>
                <Link to="/videos">← Back to Videos</Link>
              </div>
              <div style={{ display: 'flex', gap: '20px' }}>
                {previousVideo && (
                  <Link to={`/videos/${previousVideo.slug}/`}>← {previousVideo.title}</Link>
                )}
                {nextVideo && (
                  <Link to={`/videos/${nextVideo.slug}/`}>{nextVideo.title} →</Link>
                )}
              </div>
            </Flex>
          </Box>
          
          {/* Related Videos */}
          {relatedVideos.length > 0 && (
            <Box marginY={5}>
              <Subhead>Related Videos</Subhead>
              <Space size={3} />
              <Box 
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                  gap: '20px'
                }}
              >
                {relatedVideos.map(relatedVideo => {
                  const relatedImage = relatedVideo?.featuredImage?.node?.localFile ? 
                    getImage(relatedVideo.featuredImage.node.localFile) : null
                  
                  return (
                    <Box key={relatedVideo.id} style={{ border: '1px solid #eee', borderRadius: '8px', overflow: 'hidden' }}>
                      <Link to={`/videos/${relatedVideo.slug}/`} style={{ textDecoration: 'none', color: 'inherit' }}>
                        {relatedImage ? (
                          <GatsbyImage 
                            image={relatedImage} 
                            alt={relatedVideo.featuredImage?.node?.altText || relatedVideo.title}
                            style={{ height: '160px' }}
                          />
                        ) : (
                          <Box style={{ height: '160px', backgroundColor: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Text>No image</Text>
                          </Box>
                        )}
                        <Box style={{ padding: '15px' }}>
                          <Subhead as="h3" style={{ fontSize: '16px', marginBottom: '8px' }}>
                            {relatedVideo.title}
                          </Subhead>
                          {relatedVideo.excerpt && (
                            <Text style={{ fontSize: '14px', color: '#666', lineHeight: '1.4' }}>
                              {relatedVideo.excerpt.replace(/<[^>]*>/g, '').substring(0, 100)}...
                            </Text>
                          )}
                          <Text style={{ fontSize: '12px', color: '#999', marginTop: '8px' }}>
                            {relatedVideo.date}
                          </Text>
                        </Box>
                      </Link>
                    </Box>
                  )
                })}
              </Box>
            </Box>
          )}
        </Box>
      </Container>
    </Layout>
  )
}

export function Head({ data }) {
  const video = data?.wpVideo
  
  return <SEOHead 
    title={video?.title || "Video"} 
    description={video?.excerpt?.replace(/<[^>]*>/g, '') || "Watch this video by Jeldon"} 
  />
}

export const query = graphql`
  query VideoBySlug($slug: String!) {
    wpVideo(slug: { eq: $slug }) {
      id
      title
      content
      excerpt
      date(formatString: "MMMM DD, YYYY")
      slug
      uri
      featuredImage {
        node {
          altText
          sourceUrl
          localFile {
            childImageSharp {
              gatsbyImageData(width: 800, height: 400, placeholder: BLURRED)
            }
          }
        }
      }
      videoCategories {
        nodes {
          id
          name
          slug
        }
      }
      # ACF fields - these will only work if WPGraphQL for ACF is properly configured
      # If these fields are not available, we'll extract YouTube ID from content
      videoDetails {
        youtubeVideoId
        videoDuration
        videoViews
        youtubeUrl
      }
    }
    # Get related videos
    allWpVideo(
      filter: { 
        slug: { ne: $slug }
      }
      limit: 6
      sort: { date: DESC }
    ) {
      nodes {
        id
        title
        slug
        excerpt
        content
        date(formatString: "MMMM DD, YYYY")
        featuredImage {
          node {
            sourceUrl
            altText
            localFile {
              childImageSharp {
                gatsbyImageData(width: 280, height: 160, placeholder: BLURRED)
              }
            }
          }
        }
        videoDetails {
          youtubeVideoId
          videoDuration
        }
        videoCategories {
          nodes {
            name
          }
        }
      }
    }
  }
`
