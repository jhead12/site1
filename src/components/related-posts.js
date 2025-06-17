import React from "react"
import { graphql, useStaticQuery, Link } from "gatsby"
import {
  Box,
  Heading,
  Text,
  Flex,
  Space
} from "./ui"

const RelatedPosts = ({ currentPostId, categories, tags }) => {
  const data = useStaticQuery(graphql`
    query RelatedPostsQuery {
      allWpPost(
        sort: { date: DESC }
        limit: 20
      ) {
        nodes {
          id
          title
          slug
          excerpt
          date(formatString: "MMMM DD, YYYY")
          featuredImage {
            node {
              sourceUrl
              altText
            }
          }
          categories {
            nodes {
              id
              name
              slug
            }
          }
          tags {
            nodes {
              id
              name
              slug
            }
          }
        }
      }
    }
  `)

  const allPosts = data.allWpPost.nodes
  
  // Filter out current post
  const otherPosts = allPosts.filter(post => post.id !== currentPostId)
  
  // Find related posts by categories and tags
  const relatedPosts = findRelatedPosts(otherPosts, categories, tags)
  
  if (relatedPosts.length === 0) {
    return null
  }

  return (
    <Box marginY={5}>
      <Heading as="h3">Related Posts</Heading>
      <Space size={4} />
      
      <Flex gap={4} variant="wrap">
        {relatedPosts.slice(0, 3).map((post) => (
          <Box 
            key={post.id} 
            style={{ 
              flex: '1 1 300px',
              minWidth: '250px',
              maxWidth: '350px',
              border: '1px solid #eee',
              borderRadius: '8px',
              padding: '1rem',
              backgroundColor: 'rgba(255, 255, 255, 0.02)'
            }}
          >
            {post.featuredImage?.node?.sourceUrl && (
              <Box marginY={2}>
                <Link to={`/blog/${post.slug}/`}>
                  <img
                    src={post.featuredImage.node.sourceUrl}
                    alt={post.featuredImage.node.altText || post.title}
                    style={{
                      width: '100%',
                      height: '150px',
                      objectFit: 'cover',
                      borderRadius: '4px'
                    }}
                  />
                </Link>
              </Box>
            )}
            
            <Heading as="h4">
              <Link to={`/blog/${post.slug}/`}>{post.title}</Link>
            </Heading>
            
            {/* Date hidden per user request */}
            {/* <Text variant="kicker" marginY={2}>
              {post.date}
            </Text> */}
            
            {post.excerpt && (
              <Text 
                dangerouslySetInnerHTML={{ __html: post.excerpt }} 
                style={{ 
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  fontSize: '0.9rem',
                  lineHeight: '1.4'
                }}
              />
            )}
            
            <Box marginY={3}>
              <Link to={`/blog/${post.slug}/`}>
                <Text variant="kicker" style={{ color: '#0066cc' }}>
                  Read more →
                </Text>
              </Link>
            </Box>
            
            {post.categories?.nodes?.length > 0 && (
              <Box marginY={2}>
                <Text variant="kicker" style={{ fontSize: '0.8rem', opacity: 0.7 }}>
                  {post.categories.nodes.map(cat => cat.name).join(', ')}
                </Text>
              </Box>
            )}
          </Box>
        ))}
      </Flex>
    </Box>
  )
}

// Helper function to find related posts
function findRelatedPosts(posts, categories = [], tags = []) {
  const categoryIds = categories?.map(cat => cat.id) || []
  const tagIds = tags?.map(tag => tag.id) || []
  
  // Score posts based on shared categories and tags
  const scoredPosts = posts.map(post => {
    let score = 0
    
    // Score for shared categories (higher weight)
    if (post.categories?.nodes) {
      post.categories.nodes.forEach(cat => {
        if (categoryIds.includes(cat.id)) {
          score += 3
        }
      })
    }
    
    // Score for shared tags (lower weight)
    if (post.tags?.nodes) {
      post.tags.nodes.forEach(tag => {
        if (tagIds.includes(tag.id)) {
          score += 1
        }
      })
    }
    
    return { ...post, relatedScore: score }
  })
  
  // Sort by score (highest first) and return posts with score > 0
  return scoredPosts
    .filter(post => post.relatedScore > 0)
    .sort((a, b) => b.relatedScore - a.relatedScore)
}

export default RelatedPosts
