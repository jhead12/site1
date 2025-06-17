import React, { useState, useMemo } from "react"
import { Box, Flex, Text } from "../ui"

const BlogSearch = ({ posts, onFilteredPosts, selectedCategory }) => {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredPosts = useMemo(() => {
    if (!searchTerm.trim()) {
      return posts
    }

    const term = searchTerm.toLowerCase()
    return posts.filter(post => {
      const titleMatch = post.title.toLowerCase().includes(term)
      const excerptMatch = post.excerpt?.toLowerCase().includes(term)
      const contentMatch = post.content?.toLowerCase().includes(term)
      const categoryMatch = post.categories?.nodes?.some(cat => 
        cat.name.toLowerCase().includes(term)
      )
      const tagMatch = post.tags?.nodes?.some(tag => 
        tag.name.toLowerCase().includes(term)
      )
      
      return titleMatch || excerptMatch || contentMatch || categoryMatch || tagMatch
    })
  }, [posts, searchTerm])

  // Call the parent callback when filtered posts change
  React.useEffect(() => {
    onFilteredPosts(filteredPosts)
  }, [filteredPosts, onFilteredPosts])

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value)
  }

  const clearSearch = () => {
    setSearchTerm("")
  }

  return (
    <Box marginY={4}>
      <Flex gap={2} style={{ alignItems: "center", justifyContent: "center" }}>
        <Box style={{ position: "relative", maxWidth: "400px", width: "100%" }}>
          <input
            type="text"
            placeholder="Search blog posts..."
            value={searchTerm}
            onChange={handleSearchChange}
            style={{
              width: "100%",
              padding: "0.75rem 1rem",
              border: "2px solid #e0e0e0",
              borderRadius: "25px",
              fontSize: "1rem",
              outline: "none",
              transition: "border-color 0.2s ease",
              paddingRight: searchTerm ? "40px" : "1rem"
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "#004ca3"
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "#e0e0e0"
            }}
          />
          {searchTerm && (
            <button
              onClick={clearSearch}
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: "1.2rem",
                color: "#666",
                padding: "5px"
              }}
              title="Clear search"
            >
              ×
            </button>
          )}
        </Box>
      </Flex>
      
      {searchTerm && (
        <Text style={{ 
          textAlign: "center", 
          marginTop: "1rem", 
          color: "#666",
          fontSize: "0.9rem"
        }}>
          {filteredPosts.length} result{filteredPosts.length !== 1 ? 's' : ''} for "{searchTerm}"
          {selectedCategory !== "all" && (
            <span> in "{selectedCategory}" category</span>
          )}
        </Text>
      )}
    </Box>
  )
}

export default BlogSearch
