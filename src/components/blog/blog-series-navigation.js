import React from "react"
import { Link } from "gatsby"
import { Box, Flex, Text, Heading } from "../ui"

const BlogSeriesNavigation = ({ 
  currentPost, 
  seriesData, 
  allSeriesPosts 
}) => {
  if (!seriesData || !allSeriesPosts || allSeriesPosts.length <= 1) {
    return null
  }

  const currentIndex = allSeriesPosts.findIndex(post => post.slug === currentPost.slug)
  const previousPost = currentIndex > 0 ? allSeriesPosts[currentIndex - 1] : null
  const nextPost = currentIndex < allSeriesPosts.length - 1 ? allSeriesPosts[currentIndex + 1] : null
  
  const progress = ((currentIndex + 1) / allSeriesPosts.length) * 100

  return (
    <Box style={{
      backgroundColor: "#f8f9fa",
      border: "1px solid #e9ecef",
      borderRadius: "8px",
      padding: "1.5rem",
      marginY: "2rem"
    }}>
      {/* Series Header */}
      <Flex style={{ 
        alignItems: "center", 
        justifyContent: "space-between",
        marginBottom: "1rem",
        flexWrap: "wrap",
        gap: "1rem"
      }}>
        <div>
          <Text variant="kicker" style={{ color: "#666", marginBottom: "0.25rem" }}>
            Part {currentIndex + 1} of {allSeriesPosts.length}
          </Text>
          <Heading as="h3" style={{ marginBottom: "0.5rem" }}>
            {seriesData.title}
          </Heading>
          {seriesData.description && (
            <Text style={{ color: "#666", fontSize: "0.9rem" }}>
              {seriesData.description}
            </Text>
          )}
        </div>
        
        {/* Progress Indicator */}
        <div style={{ minWidth: "120px" }}>
          <Flex style={{ alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem" }}>
            <Text style={{ fontSize: "0.8rem", color: "#666" }}>Progress</Text>
            <Text style={{ fontSize: "0.8rem", fontWeight: "bold" }}>{Math.round(progress)}%</Text>
          </Flex>
          <div style={{
            width: "100%",
            height: "8px",
            backgroundColor: "#e9ecef",
            borderRadius: "4px",
            overflow: "hidden"
          }}>
            <div style={{
              width: `${progress}%`,
              height: "100%",
              backgroundColor: "#004ca3",
              borderRadius: "4px",
              transition: "width 0.3s ease"
            }} />
          </div>
        </div>
      </Flex>

      {/* Navigation Arrows */}
      <Flex style={{ 
        justifyContent: "space-between", 
        alignItems: "center",
        marginBottom: "1.5rem",
        gap: "1rem"
      }}>
        {previousPost ? (
          <Link 
            to={`/blog/${previousPost.slug}/`}
            style={{
              textDecoration: "none",
              color: "inherit",
              display: "flex",
              alignItems: "center",
              padding: "0.75rem 1rem",
              backgroundColor: "white",
              border: "1px solid #e0e0e0",
              borderRadius: "6px",
              transition: "all 0.2s ease",
              flex: "1",
              maxWidth: "45%"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)"
              e.currentTarget.style.transform = "translateY(-2px)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "none"
              e.currentTarget.style.transform = "translateY(0)"
            }}
          >
            <div style={{ marginRight: "0.75rem", fontSize: "1.2rem" }}>←</div>
            <div>
              <Text style={{ fontSize: "0.8rem", color: "#666", marginBottom: "0.25rem" }}>
                Previous
              </Text>
              <Text style={{ fontWeight: "bold", fontSize: "0.9rem" }}>
                {previousPost.title}
              </Text>
            </div>
          </Link>
        ) : (
          <div style={{ flex: "1", maxWidth: "45%" }} />
        )}

        {nextPost ? (
          <Link 
            to={`/blog/${nextPost.slug}/`}
            style={{
              textDecoration: "none",
              color: "inherit",
              display: "flex",
              alignItems: "center",
              padding: "0.75rem 1rem",
              backgroundColor: "white",
              border: "1px solid #e0e0e0",
              borderRadius: "6px",
              transition: "all 0.2s ease",
              flex: "1",
              maxWidth: "45%"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)"
              e.currentTarget.style.transform = "translateY(-2px)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "none"
              e.currentTarget.style.transform = "translateY(0)"
            }}
          >
            <div>
              <Text style={{ fontSize: "0.8rem", color: "#666", marginBottom: "0.25rem", textAlign: "right" }}>
                Next
              </Text>
              <Text style={{ fontWeight: "bold", fontSize: "0.9rem", textAlign: "right" }}>
                {nextPost.title}
              </Text>
            </div>
            <div style={{ marginLeft: "0.75rem", fontSize: "1.2rem" }}>→</div>
          </Link>
        ) : (
          <div style={{ flex: "1", maxWidth: "45%" }} />
        )}
      </Flex>

      {/* Series Table of Contents */}
      <details style={{ marginTop: "1rem" }}>
        <summary style={{
          cursor: "pointer",
          fontWeight: "bold",
          padding: "0.5rem 0",
          borderBottom: "1px solid #e0e0e0",
          marginBottom: "1rem",
          outline: "none"
        }}>
          📑 View All Posts in This Series ({allSeriesPosts.length})
        </summary>
        
        <div style={{
          display: "grid",
          gap: "0.75rem",
          maxHeight: "300px",
          overflowY: "auto",
          padding: "1rem 0"
        }}>
          {allSeriesPosts.map((post, index) => {
            const isCurrentPost = post.slug === currentPost.slug
            const isCompleted = index < currentIndex
            
            return (
              <Link
                key={post.id}
                to={`/blog/${post.slug}/`}
                style={{
                  textDecoration: "none",
                  color: "inherit",
                  display: "flex",
                  alignItems: "center",
                  padding: "0.75rem",
                  backgroundColor: isCurrentPost ? "#004ca3" : "white",
                  color: isCurrentPost ? "white" : "#333",
                  border: "1px solid #e0e0e0",
                  borderRadius: "6px",
                  transition: "all 0.2s ease",
                  opacity: isCurrentPost ? 1 : (isCompleted ? 0.8 : 0.6)
                }}
                onMouseEnter={(e) => {
                  if (!isCurrentPost) {
                    e.currentTarget.style.backgroundColor = "#f0f0f0"
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isCurrentPost) {
                    e.currentTarget.style.backgroundColor = "white"
                  }
                }}
              >
                {/* Post Number & Status */}
                <div style={{
                  minWidth: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  backgroundColor: isCurrentPost ? "white" : (isCompleted ? "#28a745" : "#e9ecef"),
                  color: isCurrentPost ? "#004ca3" : (isCompleted ? "white" : "#666"),
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "bold",
                  marginRight: "1rem",
                  fontSize: "0.9rem"
                }}>
                  {isCompleted ? "✓" : index + 1}
                </div>
                
                {/* Post Info */}
                <div style={{ flex: 1 }}>
                  <Text style={{ 
                    fontWeight: "bold", 
                    marginBottom: "0.25rem",
                    color: isCurrentPost ? "white" : "#333"
                  }}>
                    {post.title}
                  </Text>
                  {post.excerpt && (
                    <Text style={{ 
                      fontSize: "0.8rem", 
                      color: isCurrentPost ? "rgba(255,255,255,0.8)" : "#666",
                      display: "-webkit-box",
                      WebkitLineClamp: 1,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden"
                    }}>
                      {post.excerpt.replace(/<[^>]*>/g, '')}
                    </Text>
                  )}
                </div>
                
                {/* Status Indicator */}
                <div style={{ marginLeft: "1rem" }}>
                  {isCurrentPost && (
                    <span style={{ fontSize: "0.8rem", opacity: 0.8 }}>Current</span>
                  )}
                  {isCompleted && !isCurrentPost && (
                    <span style={{ fontSize: "0.8rem", color: "#28a745" }}>Completed</span>
                  )}
                  {!isCompleted && !isCurrentPost && (
                    <span style={{ fontSize: "0.8rem", color: "#666" }}>Coming up</span>
                  )}
                </div>
              </Link>
            )
          })}
        </div>
      </details>

      {/* Series Completion */}
      {currentIndex === allSeriesPosts.length - 1 && (
        <Box style={{
          marginTop: "1rem",
          padding: "1rem",
          backgroundColor: "#d4edda",
          border: "1px solid #c3e6cb",
          borderRadius: "6px",
          textAlign: "center"
        }}>
          <Text style={{ fontWeight: "bold", color: "#155724", marginBottom: "0.5rem" }}>
            🎉 Congratulations! You've completed this series!
          </Text>
          <Text style={{ color: "#155724", fontSize: "0.9rem" }}>
            You've finished all {allSeriesPosts.length} posts in "{seriesData.title}"
          </Text>
        </Box>
      )}
    </Box>
  )
}

export default BlogSeriesNavigation
