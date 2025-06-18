import * as React from "react"
import { graphql } from "gatsby"
import { GatsbyImage, getImage } from "gatsby-plugin-image"
import Layout from "../components/layout"
import {
  Container,
  Box,
  Space,
  Heading,
  Text,
  Subhead,
  Flex,
  Link,
} from "../components/ui"
import * as styles from "./blog-post.css"
import SEOHead from "../components/head"
import RelatedPosts from "../components/blog/related-posts"
import WordPressComments from "../components/wordpress-comments"
import BlogNavigation from "../components/blog/blog-navigation"
import SocialShare from "../components/blog/social-share"
import "../components/blog-mobile-fix.css"

export default function BlogPost({ data, pageContext, location }) {
  const post = data.wpPost
  const relatedPosts = data.allWpPost.nodes
  const { previousPost, nextPost } = pageContext
  const featuredImage = post.featuredImage?.node
  const imageData = featuredImage?.localFile?.childImageSharp?.gatsbyImageData
  
  // Get the full URL for social sharing
  const siteUrl = typeof window !== "undefined" ? window.location.origin : ""
  const postUrl = `${siteUrl}/blog/${post.slug}/`
  
  return (
    <Layout>
      <Container>
        <Box paddingY={5}>
          <Heading as="h1" center>
            {post.title}
          </Heading>
          <Space size={4} />
          
          {post.author?.node && (
            <Box center>
              <Text variant="bold">{post.author.node.name}</Text>
            </Box>
          )}
          
          <Space size={4} />
          {/* Date hidden per user request */}
          {/* <Text center>{post.date}</Text> */}
          <Space size={4} />
          
          {featuredImage && (imageData || featuredImage.sourceUrl) && (
            <Box center marginY={5} style={{ textAlign: "center" }}>
              {imageData ? (
                <GatsbyImage
                  alt={featuredImage.altText || post.title}
                  image={getImage(imageData)}
                  style={{ margin: "0 auto", borderRadius: "8px" }}
                  loading="lazy"
                />
              ) : (
                <div className="blog-image-wrapper">
                  <img
                    src={featuredImage.sourceUrl}
                    alt={featuredImage.altText || post.title}
                    loading="lazy"
                    onLoad={(e) => e.target.style.opacity = '1'}
                    onError={(e) => e.target.style.display = 'none'}
                    style={{ 
                      width: '100%', 
                      height: 'auto', 
                      borderRadius: '8px',
                      margin: "0 auto",
                      display: "block",
                      opacity: 0,
                      transition: "opacity 0.3s ease"
                    }}
                  />
                </div>
              )}
            </Box>
          )}
          
          <Space size={5} />
          
          {post.excerpt && (
            <Box marginY={4}>
              <div 
                dangerouslySetInnerHTML={{ __html: post.excerpt }}
              />
              <Space size={4} />
            </Box>
          )}
          
          <div
            className={styles.blogPost}
            dangerouslySetInnerHTML={{
              __html: post.content,
            }}
          />
          
          {post.categories?.nodes?.length > 0 && (
            <Box marginY={5}>
              <Subhead>Categories</Subhead>
              <Space size={2} />
              <Flex gap={2} style={{ flexWrap: "wrap" }}>
                {post.categories.nodes.map((category) => (
                  <Link key={category.id} to={`/blog/?category=${category.slug}`} style={{ textDecoration: "none" }}>
                    <Box style={{
                      padding: "0.5rem 1rem",
                      backgroundColor: "#004ca3",
                      color: "white",
                      borderRadius: "20px",
                      fontSize: "0.9rem",
                      margin: "0.25rem 0.5rem 0.25rem 0",
                      display: "inline-block",
                      transition: "all 0.2s ease"
                    }}>
                      {category.name}
                    </Box>
                  </Link>
                ))}
              </Flex>
            </Box>
          )}

          {/* Blog Navigation */}
          <BlogNavigation previousPost={previousPost} nextPost={nextPost} />

          {/* Social Share */}
          <SocialShare 
            title={post.title}
            url={postUrl}
            excerpt={post.excerpt}
          />

          {/* Related Posts Section */}
          <RelatedPosts posts={relatedPosts} currentPostSlug={post.slug} />

          {/* Comments Section */}
          <WordPressComments 
            postId={post.databaseId} 
            postSlug={post.slug} 
          />
        </Box>
      </Container>
    </Layout>
  )
}

export const Head = ({ data }) => {
  return <SEOHead 
    title={data.wpPost.title} 
    description={data.wpPost.excerpt?.replace(/<[^>]*>/g, '')} 
  />
}

export const query = graphql`
  query BlogPostBySlug($slug: String!) {
    wpPost(slug: { eq: $slug }) {
      id
      title
      content
      excerpt
      date(formatString: "MMMM DD, YYYY")
      slug
      uri
      author {
        node {
          name
        }
      }
      featuredImage {
        node {
          altText
          sourceUrl
          localFile {
            childImageSharp {
              gatsbyImageData(width: 800, height: 400, placeholder: BLURRED)
            }
          }
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
    # Get related posts based on categories
    allWpPost(
      filter: { 
        slug: { ne: $slug }
        categories: { nodes: { elemMatch: { slug: { in: [] } } } }
      }
      limit: 3
      sort: { date: DESC }
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
            name
          }
        }
      }
    }
  }
`
