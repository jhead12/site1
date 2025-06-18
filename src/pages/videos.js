import React, { useState, useMemo, useEffect } from "react"
import { graphql } from "gatsby"
import Layout from "../components/layout"
import { Link } from "../components/ui"
import {
  Container,
  Section,
  Box,
  Heading,
  Text,
  Subhead,
  Flex
} from "../components/ui"

const VideosPage = ({ data, location }) => {
  // Memoize videos and categories data to avoid unnecessary re-renders
  const allVideos = useMemo(() => data?.allWpVideo?.nodes || [], [data])
  const allCategories = useMemo(() => data?.allWpVideoCategory?.nodes || [], [data])
  
  // Get category from URL params
  const [selectedCategory, setSelectedCategory] = useState("all")
  
  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(location.search)
      const categoryParam = urlParams.get("category")
      if (categoryParam) {
        setSelectedCategory(categoryParam)
      }
    }
  }, [location.search])
  
  // Filter videos based on selected category
  const filteredVideos = useMemo(() => {
    if (selectedCategory === "all") return allVideos
    
    return allVideos.filter(video => 
      video.videoCategories?.nodes?.some(category => category.slug === selectedCategory)
    )
  }, [allVideos, selectedCategory])
  
  // Add video counts to categories
  const categoriesWithCounts = useMemo(() => {
    return allCategories.map(category => ({
      ...category,
      count: allVideos.filter(video => 
        video.videoCategories?.nodes?.some(videoCategory => videoCategory.slug === category.slug)
      ).length
    })).filter(category => category.count > 0)
  }, [allCategories, allVideos])

  const handleCategoryChange = (categorySlug) => {
    setSelectedCategory(categorySlug)
    
    // Update URL without page reload
    if (typeof window !== "undefined") {
      const url = new URL(window.location)
      if (categorySlug === "all") {
        url.searchParams.delete("category")
      } else {
        url.searchParams.set("category", categorySlug)
      }
      window.history.replaceState({}, "", url)
    }
  }
  
  return (
    <Layout>
      <Section paddingY={5}>
        <Container width="normal">
          <Heading as="h1" center>Videos</Heading>
          <Text center variant="lead">
            Latest video tutorials, beats, and music production content.
          </Text>
          
          {/* Category Filter */}
          {categoriesWithCounts.length > 0 && (
            <Box marginY={4}>
              <Text variant="subhead" marginY={2}>Filter by Category:</Text>
              <Flex gap={2} style={{ flexWrap: "wrap", justifyContent: "center" }}>
                <button
                  onClick={() => handleCategoryChange("all")}
                  style={{
                    padding: "0.5rem 1rem",
                    margin: "0.25rem",
                    backgroundColor: selectedCategory === "all" ? "#004ca3" : "#f0f0f0",
                    color: selectedCategory === "all" ? "white" : "#333",
                    border: "none",
                    borderRadius: "20px",
                    cursor: "pointer",
                    fontSize: "0.9rem"
                  }}
                >
                  All Videos ({allVideos.length})
                </button>
                
                {categoriesWithCounts.map((category) => (
                  <button
                    key={category.slug}
                    onClick={() => handleCategoryChange(category.slug)}
                    style={{
                      padding: "0.5rem 1rem",
                      margin: "0.25rem",
                      backgroundColor: selectedCategory === category.slug ? "#004ca3" : "#f0f0f0",
                      color: selectedCategory === category.slug ? "white" : "#333",
                      border: "none",
                      borderRadius: "20px",
                      cursor: "pointer",
                      fontSize: "0.9rem"
                    }}
                  >
                    {category.name} ({category.count})
                  </button>
                ))}
              </Flex>
            </Box>
          )}
          
          {/* Results count */}
          <Text style={{ color: "#666", marginBottom: "2rem", textAlign: "center" }}>
            {selectedCategory === "all" 
              ? `Showing all ${filteredVideos.length} videos`
              : `Showing ${filteredVideos.length} videos in "${categoriesWithCounts.find(c => c.slug === selectedCategory)?.name || selectedCategory}"`
            }
          </Text>
          
          {/* Videos Grid */}
          <Box marginY={5}>
            {filteredVideos.length > 0 ? (
              <div style={{ 
                display: "grid", 
                gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", 
                gap: "2rem" 
              }}>
                {filteredVideos.map((video) => (
                  <Box key={video.id} style={{ 
                    border: "1px solid #eee",
                    borderRadius: "8px",
                    overflow: "hidden",
                    transition: "transform 0.2s ease, box-shadow 0.2s ease"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-5px)"
                    e.currentTarget.style.boxShadow = "0 10px 25px rgba(0,0,0,0.1)"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)"
                    e.currentTarget.style.boxShadow = "none"
                  }}>
                    {/* Video Thumbnail */}
                    <Link to={`/videos/${video.slug}/`}>
                      <Box style={{ position: "relative" }}>
                        {video.videoDetails?.youtubeVideoId || video.content?.includes('youtube.com/embed/') ? (
                          <img
                            src={`https://img.youtube.com/vi/${video.videoDetails?.youtubeVideoId || (video.content?.match(/youtube\.com\/embed\/([^"&?/ ]{11})/i)?.[1])}/mqdefault.jpg`}
                            alt={video.title}
                            style={{ 
                              width: "100%", 
                              height: "200px", 
                              objectFit: "cover",
                              display: "block"
                            }}
                          />
                        ) : (
                          <div style={{
                            width: "100%",
                            height: "200px",
                            backgroundColor: "#f0f0f0",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                          }}>
                            <Text>No thumbnail</Text>
                          </div>
                        )}
                        
                        {/* Duration overlay */}
                        {video.videoDetails?.videoDuration && (
                          <div style={{
                            position: "absolute",
                            bottom: "8px",
                            right: "8px",
                            backgroundColor: "rgba(0,0,0,0.8)",
                            color: "white",
                            padding: "4px 8px",
                            borderRadius: "4px",
                            fontSize: "12px",
                            fontWeight: "bold"
                          }}>
                            {video.videoDetails.videoDuration}
                          </div>
                        )}
                        
                        {/* Views overlay */}
                        {video.videoDetails?.videoViews && (
                          <div style={{
                            position: "absolute",
                            bottom: "8px",
                            left: "8px",
                            backgroundColor: "rgba(0,0,0,0.8)",
                            color: "white",
                            padding: "4px 8px",
                            borderRadius: "4px",
                            fontSize: "12px"
                          }}>
                            {video.videoDetails.videoViews} views
                          </div>
                        )}
                        
                        {/* Play button overlay */}
                        <div style={{
                          position: "absolute",
                          top: "50%",
                          left: "50%",
                          transform: "translate(-50%, -50%)",
                          width: "60px",
                          height: "60px",
                          backgroundColor: "rgba(255, 0, 0, 0.8)",
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          opacity: 0.9,
                          transition: "opacity 0.2s ease"
                        }}>
                          <div style={{
                            width: 0,
                            height: 0,
                            borderLeft: "20px solid white",
                            borderTop: "12px solid transparent",
                            borderBottom: "12px solid transparent",
                            marginLeft: "4px"
                          }} />
                        </div>
                      </Box>
                    </Link>
                    
                    {/* Video Info */}
                    <Box style={{ padding: "16px" }}>
                      <Text variant="kicker" marginY={1} style={{ color: "#666" }}>
                        {video.date}
                        {/* Author field removed as it may not be available in WpVideo schema */}
                      </Text>
                      
                      <Subhead marginY={2}>
                        <Link to={`/videos/${video.slug}/`} style={{ textDecoration: "none" }}>
                          {video.title}
                        </Link>
                      </Subhead>
                      
                      {video.excerpt && (
                        <Text style={{ 
                          color: "#666",
                          display: "-webkit-box",
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden"
                        }} dangerouslySetInnerHTML={{ __html: video.excerpt }} />
                      )}
                      
                      {/* Categories */}
                      {video.videoCategories?.nodes?.length > 0 && (
                        <Box marginY={3}>
                          <Flex gap={1} style={{ flexWrap: "wrap" }}>
                            {video.videoCategories.nodes.slice(0, 3).map((category) => (
                              <span
                                key={category.name}
                                style={{
                                  fontSize: "0.8rem",
                                  backgroundColor: "#f0f0f0",
                                  color: "#666",
                                  padding: "4px 8px",
                                  borderRadius: "12px",
                                  display: "inline-block"
                                }}
                              >
                                {category.name}
                              </span>
                            ))}
                          </Flex>
                        </Box>
                      )}
                      
                      <Box marginY={3}>
                        <Link to={`/videos/${video.slug}/`} style={{
                          color: "#004ca3",
                          textDecoration: "none",
                          fontWeight: "bold"
                        }}>
                          Watch Video →
                        </Link>
                      </Box>
                    </Box>
                  </Box>
                ))}
              </div>
            ) : (
              <Box center marginY={5}>
                <Text>No videos found{selectedCategory !== "all" ? " in this category" : ""}.</Text>
                {allVideos.length === 0 && (
                  <Box marginY={3} style={{ padding: "20px", backgroundColor: "#fff3cd", borderRadius: "8px", textAlign: "center" }}>
                    <Subhead>Ready to add videos?</Subhead>
                    <Text style={{ marginTop: "10px" }}>
                      Create your first video post in WordPress admin → Videos → Add New
                    </Text>
                  </Box>
                )}
              </Box>
            )}
          </Box>
        </Container>
      </Section>
    </Layout>
  )
}

export const query = graphql`
  query VideosArchive {
    allWpVideo(sort: { date: DESC }) {
      nodes {
        id
        title
        excerpt
        slug
        date(formatString: "MMMM DD, YYYY")
        # Commenting out author field as it may not be available in WpVideo schema
        # author {
        #   node {
        #     name
        #   }
        # }
        featuredImage {
          node {
            sourceUrl
            altText
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
        # If these fields aren't available, we'll try to extract YouTube IDs from content
        videoDetails {
          youtubeVideoId
          videoDuration
          videoViews
        }
        content
      }
    }
    allWpVideoCategory(filter: { count: { gt: 0 } }) {
      nodes {
        id
        name
        slug
        count
      }
    }
    site {
      siteMetadata {
        title
      }
    }
  }
`

export default VideosPage
