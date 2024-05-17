import * as React from "react"
import { graphql, Link } from "gatsby"

import {
  Container,
  Section,
  Flex,
  Box,
  Subhead,
  Kicker,
  Text
} from "./ui"

export default function BlogFeature(props) {
  const {allWpPost } = props.data
  const recentPosts = allWpPost.nodes

  return (
      <Section padding={4} background="muted">
        <Container width="fullbleed">
          <Subhead>Recent Blog Posts</Subhead>
          <Flex>
            {recentPosts.map((post) => (
              <Box key={post.id}>
              {post.featuredImage?.node?.sourceUrl && (
                <Link to={`https://blog.jeldonmusic.com${post.uri}`}>
                  <img
                    src={post.featuredImage.node.sourceUrl}
                    alt={post.featuredImage.node.altText || post.title}
                    style={{ width: '100%', height: 'auto' }}
                  />
                </Link>
              )}
                 <Kicker>
                <Link to={`https://blog.jeldonmusic.com${post.uri}`}>{post.title}</Link>
              </Kicker>
                <Text>{post.date}</Text>
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