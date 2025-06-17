import React from "react"
import { Link } from "../ui"
import {
  Box,
  Flex,
  Text
} from "../ui"

const BlogNavigation = ({ previousPost, nextPost }) => {
  if (!previousPost && !nextPost) return null

  return (
    <Box marginY={6} paddingY={4} style={{ borderTop: "1px solid #eee", borderBottom: "1px solid #eee" }}>
      <Flex variant="spaceBetween" style={{ flexWrap: "wrap", gap: "1rem" }}>
        {/* Previous Post */}
        <Box style={{ flex: "1", minWidth: "200px" }}>
          {previousPost ? (
            <Link to={`/blog/${previousPost.slug}/`} style={{ textDecoration: "none" }}>
              <Box style={{ 
                padding: "1rem", 
                border: "1px solid #ddd", 
                borderRadius: "8px",
                backgroundColor: "#f9f9f9",
                transition: "all 0.2s ease",
                cursor: "pointer"
              }}>
                <Text variant="kicker" style={{ color: "#666", marginBottom: "0.5rem" }}>
                  ← Previous Post
                </Text>
                <Text variant="bold" style={{ fontSize: "0.9rem" }}>
                  {previousPost.title}
                </Text>
              </Box>
            </Link>
          ) : (
            <Box style={{ height: "100px" }}></Box>
          )}
        </Box>

        {/* Next Post */}
        <Box style={{ flex: "1", minWidth: "200px" }}>
          {nextPost ? (
            <Link to={`/blog/${nextPost.slug}/`} style={{ textDecoration: "none" }}>
              <Box style={{ 
                padding: "1rem", 
                border: "1px solid #ddd", 
                borderRadius: "8px",
                backgroundColor: "#f9f9f9",
                transition: "all 0.2s ease",
                cursor: "pointer",
                textAlign: "right"
              }}>
                <Text variant="kicker" style={{ color: "#666", marginBottom: "0.5rem" }}>
                  Next Post →
                </Text>
                <Text variant="bold" style={{ fontSize: "0.9rem" }}>
                  {nextPost.title}
                </Text>
              </Box>
            </Link>
          ) : (
            <Box style={{ height: "100px" }}></Box>
          )}
        </Box>
      </Flex>
    </Box>
  )
}

export default BlogNavigation
