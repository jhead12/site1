import * as React from "react"
import { graphql } from "gatsby"
import { Link } from "../components/ui"

import {
  Container,
  Section,
  Flex,
  Box,
  Subhead,
  Kicker,
  Text
} from "./ui"
import "./blogimg.css"
import "./blog-mobile-fix.css"
import "./blog-section-fix.css"

export default function BlogFeature(props) {
  const {allWpPost } = props.data
  const recentPosts = allWpPost?.nodes || []

  // If no posts available, show a message or return null
  if (recentPosts.length === 0) {
    return (
      <Section padding={4} background="muted">
        <Container width="fullbleed">
          <Subhead>Recent Blog Posts</Subhead>
          <Text>Blog posts will appear here when WordPress is connected.</Text>
        </Container>
      </Section>
    )
  }

  return (
      <Section padding={4} background="muted">
        <Container width="fullbleed">
          <Subhead>Recent Blog Posts</Subhead>
          <Flex gap={3} className="blog-posts-container">
            {recentPosts.map((post) => (
              <Box key={post.id} className="blog-post-item">
                <div className="blog-image-wrapper">
                  <Link to={`/blog/${post.slug}/`}>
                    <img
                      src={post.featuredImage?.node?.sourceUrl || 'https://via.placeholder.com/300x180/f0f0f0/666666/?text=Jeldon+Music'}
                      alt={post.featuredImage?.node?.altText || post.title}
                      className="blog-feature-image"
                      loading="lazy"
                      onLoad={(e) => {
                        e.target.style.opacity = '1';
                        e.target.style.zIndex = '1';
                        e.target.style.position = 'relative';
                      }}
                      onError={(e) => {
                        // If image fails, show a placeholder
                        e.target.src = 'https://via.placeholder.com/300x180/f0f0f0/666666/?text=Jeldon+Music';
                        e.target.style.opacity = '1';
                      }}
                      style={{ opacity: 1, position: 'relative', zIndex: 1 }}
                    />
                  </Link>
                </div>
                <Kicker>
                  <Link to={`/blog/${post.slug}/`}>{post.title}</Link>
                </Kicker>
                {/* Date hidden per user request */}
                {/* <Text>{post.date}</Text> */}
                <Text dangerouslySetInnerHTML={{ __html: post.excerpt }} />
              </Box>
            ))}
          </Flex>
        </Container>
      </Section>
  )
}

export const query = graphql`
fragment BlogFeatureContent on BlogFeature {
    id
    blocktype
    title
    excerpt
    uri
    date
  
}
`