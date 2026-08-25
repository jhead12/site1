import React, { useState, useMemo, useEffect } from "react"
import { graphql } from "gatsby"
import Layout from "../components/layout"
import VideoSearch from "../components/video/video-search"
import VideoCard from "../components/video/video-card"
import {
  Container,
  Section,
  Box,
  Flex,
  Heading,
  Subhead,
  Text,
} from "../components/ui"

const VideosPage = ({ data, location }) => {
  // Memoize videos and categories data to avoid unnecessary re-renders
  const allVideos = useMemo(() => data?.allContentfulVideoPost?.nodes || [], [data])
  const allCategories = useMemo(
    () => data?.allContentfulVideoCategory?.nodes || [],
    [data]
  )

  // Get category from URL params
  const [selectedCategory, setSelectedCategory] = useState("all")

  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(location.search)
      const categoryParam = urlParams.get("category")
      if (categoryParam) {
        setSelectedCategory(categoryParam)
      }
      const searchParam = urlParams.get("q")
      if (searchParam != null) {
        setSearchTerm(searchParam)
      }
    }
  }, [location.search])

  // Search term for the video search input
  const [searchTerm, setSearchTerm] = useState("")

  // Apply both search and category filters
  const filteredVideos = useMemo(() => {
    let results = allVideos

    // Category filter
    if (selectedCategory !== "all") {
      results = results.filter((video) =>
        video.categories?.some(
          (category) => category.slug === selectedCategory
        )
      )
    }

    // Search filter
    const term = searchTerm.trim().toLowerCase()
    if (term) {
      results = results.filter((video) => {
        const titleMatch = video.title?.toLowerCase().includes(term)
        const excerptMatch = video.excerpt?.toLowerCase().includes(term)
        const categoryMatch = (video.categories || []).some((category) =>
          category.name?.toLowerCase().includes(term)
        )

        return titleMatch || excerptMatch || categoryMatch
      })
    }

    return results
  }, [allVideos, selectedCategory, searchTerm])

  // Add video counts to categories
  const categoriesWithCounts = useMemo(() => {
    return allCategories
      .map((category) => ({
        ...category,
        count: allVideos.filter((video) =>
          video.categories?.some(
            (videoCategory) => videoCategory.slug === category.slug
          )
        ).length,
      }))
      .filter((category) => category.count > 0)
  }, [allCategories, allVideos])

  const selectedCategoryName =
    categoriesWithCounts.find((c) => c.slug === selectedCategory)?.name ||
    selectedCategory

  // Keep the search term in sync with the URL query param
  const handleSearchTermChange = (value) => {
    setSearchTerm(value)

    if (typeof window !== "undefined") {
      const url = new URL(window.location)
      const term = value.trim()
      if (term) {
        url.searchParams.set("q", term)
      } else {
        url.searchParams.delete("q")
      }
      window.history.replaceState({}, "", url)
    }
  }

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
          <Heading as="h1" center>
            Videos
          </Heading>
          <Text center variant="lead">
            Latest video tutorials, production tips, and music content.
          </Text>

          <VideoSearch
            searchTerm={searchTerm}
            onSearchTermChange={handleSearchTermChange}
            resultCount={filteredVideos.length}
            selectedCategoryName={
              selectedCategory === "all" ? null : selectedCategoryName
            }
          />

          {/* Category Filter */}
          {categoriesWithCounts.length > 0 && (
            <Box marginY={4}>
              <Text variant="subhead" marginY={2}>
                Filter by Category:
              </Text>
              <Flex
                gap={2}
                style={{ flexWrap: "wrap", justifyContent: "center" }}
              >
                <button
                  onClick={() => handleCategoryChange("all")}
                  style={{
                    padding: "0.5rem 1rem",
                    margin: "0.25rem",
                    backgroundColor:
                      selectedCategory === "all" ? "#004ca3" : "#f0f0f0",
                    color: selectedCategory === "all" ? "white" : "#333",
                    border: "none",
                    borderRadius: "20px",
                    cursor: "pointer",
                    fontSize: "0.9rem",
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
                      backgroundColor:
                        selectedCategory === category.slug
                          ? "#004ca3"
                          : "#f0f0f0",
                      color:
                        selectedCategory === category.slug ? "white" : "#333",
                      border: "none",
                      borderRadius: "20px",
                      cursor: "pointer",
                      fontSize: "0.9rem",
                    }}
                  >
                    {category.name} ({category.count})
                  </button>
                ))}
              </Flex>
            </Box>
          )}

          {/* Results count */}
          <Text
            style={{ color: "#666", marginBottom: "2rem", textAlign: "center" }}
          >
            {(() => {
              const term = searchTerm.trim()
              if (term) {
                if (selectedCategory === "all") {
                  return `Showing ${filteredVideos.length} of ${allVideos.length} videos matching "${term}"`
                }
                return `Showing ${filteredVideos.length} of ${allVideos.length} videos matching "${term}" in "${selectedCategoryName}"`
              }
              if (selectedCategory === "all") {
                return `Showing all ${filteredVideos.length} videos`
              }
              return `Showing ${filteredVideos.length} videos in "${selectedCategoryName}"`
            })()}
          </Text>

          {/* Videos Grid */}
          <Box marginY={5}>
            {filteredVideos.length > 0 ? (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                  gap: "2rem",
                }}
              >
                {filteredVideos.map((video) => (
                  <VideoCard key={video.id} video={video} />
                ))}
              </div>
            ) : (
              <Box center marginY={5}>
                <Text>
                  {(() => {
                    const term = searchTerm.trim()
                    if (term && selectedCategory !== "all") {
                      return `No videos found matching "${term}" in "${selectedCategoryName}".`
                    }
                    if (term) {
                      return `No videos found matching "${term}".`
                    }
                    if (selectedCategory !== "all") {
                      return `No videos found in "${selectedCategoryName}".`
                    }
                    return "No videos found."
                  })()}
                </Text>
                {allVideos.length === 0 && (
                  <Box
                    marginY={3}
                    style={{
                      padding: "20px",
                      backgroundColor: "#fff3cd",
                      borderRadius: "8px",
                      textAlign: "center",
                    }}
                  >
                    <Subhead>Ready to add videos?</Subhead>
                    <Text style={{ marginTop: "10px" }}>
                      Run the YouTube sync script to import videos from your channel:
                      <br />
                      <code>node ./scripts/sync-youtube-to-videos.js</code>
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
    allContentfulVideoPost(sort: { publishDate: DESC }) {
      nodes {
        id
        title
        excerpt
        slug
        publishDate
        youtubeVideoId
        duration
        featuredImage {
          alt
          gatsbyImageData(
            width: 600
            height: 400
            quality: 85
            placeholder: BLURRED
            formats: [AUTO, WEBP, AVIF]
          )
        }
        categories {
          name
          slug
        }
      }
    }
    allContentfulVideoCategory {
      nodes {
        name
        slug
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
