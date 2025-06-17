import React, { useState, useMemo, useEffect } from "react"
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

const VideosPage = ({ location }) => {
  // Fallback placeholder data when WordPress is not connected (memoized)
  const allVideos = useMemo(() => {
    // Since WordPress video post types aren't created yet, always use placeholder data
    return [
      {
        id: "placeholder-1",
        title: "Music Production Basics - Getting Started",
        excerpt: "Learn the fundamentals of music production with this comprehensive tutorial series.",
        slug: "music-production-basics",
        date: "June 15, 2025",
        author: { node: { name: "Jeldon" } },
        featuredImage: { 
          node: { 
            sourceUrl: "https://via.placeholder.com/400x225/004ca3/white?text=Music+Production+Basics",
            altText: "Music Production Basics Tutorial"
          }
        },
        videoCategories: { nodes: [{ id: "cat-1", name: "Tutorials", slug: "tutorials" }] },
        videoDetails: {
          youtubeVideoId: "placeholder",
          videoDuration: "15:30",
          videoViews: "1.2K"
        }
      },
      {
        id: "placeholder-2", 
        title: "Beat Making Tutorial - Trap Beats",
        excerpt: "Step-by-step guide to creating professional trap beats from scratch.",
        slug: "trap-beat-tutorial",
        date: "June 12, 2025",
        author: { node: { name: "Jeldon" } },
        featuredImage: { 
          node: { 
            sourceUrl: "https://via.placeholder.com/400x225/004ca3/white?text=Trap+Beat+Tutorial",
            altText: "Trap Beat Making Tutorial"
          }
        },
        videoCategories: { nodes: [{ id: "cat-2", name: "Beat Making", slug: "beat-making" }] },
        videoDetails: {
          youtubeVideoId: "placeholder",
          videoDuration: "22:45",
          videoViews: "3.4K"
        }
      },
      {
        id: "placeholder-3",
        title: "Mixing and Mastering Essentials",
        excerpt: "Professional mixing and mastering techniques for better sound quality.",
        slug: "mixing-mastering-essentials", 
        date: "June 10, 2025",
        author: { node: { name: "Jeldon" } },
        featuredImage: { 
          node: { 
            sourceUrl: "https://via.placeholder.com/400x225/004ca3/white?text=Mixing+%26+Mastering",
            altText: "Mixing and Mastering Tutorial"
          }
        },
        videoCategories: { nodes: [{ id: "cat-3", name: "Mixing", slug: "mixing" }] },
        videoDetails: {
          youtubeVideoId: "placeholder",
          videoDuration: "18:20",
          videoViews: "2.1K"
        }
      }
    ]
  }, [])

  // Use placeholder categories if none exist (memoized)
  const allCategories = useMemo(() => {
    // Since WordPress video post types aren't created yet, always use placeholder data
    return [
      { id: "cat-1", name: "Tutorials", slug: "tutorials", count: 1 },
      { id: "cat-2", name: "Beat Making", slug: "beat-making", count: 1 },
      { id: "cat-3", name: "Mixing", slug: "mixing", count: 1 }
    ]
  }, [])
  
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
    const categories = allCategories
    return categories.map(category => ({
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
                      {video.featuredImage?.node?.sourceUrl || video.videoDetails?.youtubeVideoId ? (
                        <img
                          src={video.featuredImage?.node?.sourceUrl || 
                               `https://img.youtube.com/vi/${video.videoDetails.youtubeVideoId}/mqdefault.jpg`}
                          alt={video.featuredImage?.node?.altText || video.title}
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
                      {video.author?.node?.name && ` • By ${video.author.node.name}`}
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
          </Box>
          
          {filteredVideos.length === 0 && (
            <Box center marginY={5}>
              <Text>No videos found in this category.</Text>
            </Box>
          )}
        </Container>
      </Section>
    </Layout>
  )
}

// GraphQL query commented out until WordPress video post types are created
/*
export const query = graphql`
  query VideosArchive {
    allWpVideo(sort: { date: DESC }) {
      nodes {
        id
        title
        excerpt
        slug
        date(formatString: "MMMM DD, YYYY")
        author {
          node {
            name
          }
        }
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
        videoDetails {
          youtubeVideoId
          videoDuration
          videoViews
        }
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
*/

export default VideosPage
