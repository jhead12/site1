import * as React from "react"
import { Link } from "gatsby"
import Layout from "../components/layout"
import {
  Container,
  Box,
  Space,
  Heading,
  Text,
  Subhead,
  Flex,
} from "../components/ui"
import SEOHead from "../components/head"

export default function VideoPost({ pageContext }) {
  // Since WordPress video post types aren't created yet, show placeholder content
  const { slug } = pageContext || {}
  
  const placeholderVideo = {
    title: "Video Coming Soon",
    content: "This video page will be populated once the WordPress video custom post types are set up.",
    excerpt: "Video functionality is being developed and will be available soon.",
    date: "Coming Soon",
    author: { node: { name: "Jeldon" } },
    videoId: "placeholder"
  }
  
  return (
    <Layout>
      <Container>
        <Box paddingY={5}>
          <Heading as="h1" center>
            {placeholderVideo.title}
          </Heading>
          <Space size={4} />
          
          <Box center>
            <Text variant="bold">{placeholderVideo.author.node.name}</Text>
          </Box>
          
          <Space size={4} />
          <Text center>{placeholderVideo.date}</Text>
          <Space size={4} />
          
          {/* Placeholder Video Area */}
          <Box marginY={5}>
            <Box 
              style={{
                width: '100%',
                height: '400px',
                backgroundColor: '#f0f0f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px dashed #ccc',
                borderRadius: '8px'
              }}
            >
              <Text>Video player will appear here once WordPress video integration is complete</Text>
            </Box>
          </Box>
          
          {/* Content */}
          <Box marginY={4}>
            <Text>{placeholderVideo.content}</Text>
          </Box>
          
          {/* Navigation */}
          <Box marginY={5}>
            <Flex>
              <Link to="/videos">← Back to Videos</Link>
            </Flex>
          </Box>
          
          {/* Development Notice */}
          <Box marginY={5} style={{ padding: '20px', backgroundColor: '#fff3cd', borderRadius: '8px' }}>
            <Subhead>Development Notice</Subhead>
            <Space size={2} />
            <Text>
              Video functionality is currently under development. To enable videos:
            </Text>
            <ul style={{ marginTop: '10px', paddingLeft: '20px' }}>
              <li>Set up WordPress video custom post types</li>
              <li>Create ACF fields for video details</li>
              <li>Add YouTube integration</li>
              <li>Uncomment video queries in gatsby-node.js</li>
            </ul>
          </Box>
        </Box>
      </Container>
    </Layout>
  )
}

export function Head({ pageContext }) {
  const { slug } = pageContext || {}
  
  return <SEOHead 
    title="Video Coming Soon" 
    description="Video functionality is being developed and will be available soon." 
  />
}
