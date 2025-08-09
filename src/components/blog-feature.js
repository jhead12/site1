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
                      src={post.featuredImage?.node?.sourceUrl || '/static/placeholder-blog.jpg'}
                      alt={post.featuredImage?.node?.altText || post.title}
                      className="blog-feature-image"
                      loading="lazy"
                      onLoad={(e) => {
                        e.target.style.opacity = '1';
                        e.target.classList.remove('loading');
                      }}
                      onError={(e) => {
                        // If image fails, show a music-themed placeholder
                        e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjE4MCIgdmlld0JveD0iMCAwIDMwMCAxODAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMTgwIiBmaWxsPSIjZjBmMGYwIi8+Cjx0ZXh0IHg9IjE1MCIgeT0iOTAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNiIgZmlsbD0iIzY2NjY2NiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSI+SmVsZG9uIE11c2ljPC90ZXh0Pgo8L3N2Zz4K';
                        e.target.style.opacity = '1';
                      }}
                      style={{ opacity: 0, transition: 'opacity 0.3s ease' }}
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