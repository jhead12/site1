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
          <Flex>
            {recentPosts.map((post) => (
              <Box key={post.id}>
              {post.featuredImage?.node?.sourceUrl && (
                <Link to={`/blog/${post.slug}/`}>
                  <img
                    src={post.featuredImage.node.sourceUrl}
                    alt={post.featuredImage.node.altText || post.title}
                    className="blog-feature-image"
                  />
                </Link>
              )}
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