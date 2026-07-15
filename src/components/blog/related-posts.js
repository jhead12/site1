import React from "react"
import { GatsbyImage, getImage } from "gatsby-plugin-image"
import { Link } from "../ui"
import {
  Box,
  Text,
  Subhead,
  Flex
} from "../ui"
import "../blog-mobile-fix.css"

const RelatedPosts = ({ posts, currentPostSlug }) => {
  if (!posts || posts.length === 0) {
    return null
  }

  return (
    <Box marginY={6} paddingY={5} style={{ borderTop: "1px solid #eee" }}>
      <Subhead marginY={3}>Related Articles</Subhead>
      
      <Flex gap={4} variant="wrap">
        {posts.map((post) => (
          <Box 
            key={post.id} 
            style={{ 
              flex: "1", 
              minWidth: "280px", 
              padding: "16px",
              border: "1px solid #eee",
              borderRadius: "8px"
            }}
          >
            {post.featuredImage?.gatsbyImageData ? (
              <Box marginY={2}>
                <div className="blog-image-wrapper">
                  <Link to={`/blog/${post.slug}/`}>
                    <GatsbyImage
                      image={getImage(post.featuredImage.gatsbyImageData)}
                      alt={
                        post.featuredImage.description ||
                        post.featuredImage.alt ||
                        post.title
                      }
                      loading="lazy"
                      style={{
                        width: "100%",
                        height: "150px",
                        borderRadius: "4px",
                      }}
                      imgStyle={{ objectFit: "cover" }}
                    />
                  </Link>
                </div>
              </Box>
            ) : post.featuredImage?.url ? (
              <Box marginY={2}>
                <div className="blog-image-wrapper">
                  <Link to={`/blog/${post.slug}/`}>
                    <img
                      src={post.featuredImage.url}
                      alt={
                        post.featuredImage.description ||
                        post.featuredImage.alt ||
                        post.title
                      }
                      loading="lazy"
                      style={{
                        width: "100%",
                        height: "150px",
                        objectFit: "cover",
                        borderRadius: "4px",
                      }}
                    />
                  </Link>
                </div>
              </Box>
            ) : null}

            {/* Date hidden per user request */}
            {/* <Text variant="kicker" marginY={1}>
              {post.publishDate}
            </Text> */}

            <Text variant="subhead" marginY={2}>
              <Link to={`/blog/${post.slug}/`}>{post.title}</Link>
            </Text>

            {post.excerpt && (
              <Text
                variant="small"
                dangerouslySetInnerHTML={{ __html: post.excerpt.substring(0, 120) + "..." }}
              />
            )}

            {post.categories?.length > 0 && (
              <Box marginY={2}>
                <Text variant="kicker">
                  {post.categories.map((cat) => cat.name).join(", ")}
                </Text>
              </Box>
            )}
          </Box>
        ))}
      </Flex>
    </Box>
  )
}

export default RelatedPosts
