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
import GiscusComments from "../components/blog/giscus-comments"
import BlogNavigation from "../components/blog/blog-navigation"
import SocialShare from "../components/blog/social-share"
import "../components/blog-mobile-fix.css"

export default function BlogPost({ data, pageContext, location }) {
  const post = data.contentfulBlogPost
  const relatedPosts = data.allContentfulBlogPost.nodes
  const { previousPost, nextPost } = pageContext
  const featuredImage = post.featuredImage
  const imageData = featuredImage?.gatsbyImageData
  
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
          
          {post.author && (
            <Box center>
              <Text variant="bold">{post.author}</Text>
            </Box>
          )}

          <Space size={4} />
          {/* Date hidden per user request */}
          {/* <Text center>{post.publishDate}</Text> */}
          <Space size={4} />

          {featuredImage && (imageData || featuredImage.url) && (
            <Box center marginY={5} style={{ textAlign: "center" }}>
              {imageData ? (
                <GatsbyImage
                  alt={featuredImage.description || featuredImage.alt || post.title}
                  image={getImage(imageData)}
                  style={{ margin: "0 auto", borderRadius: "8px" }}
                  loading="lazy"
                />
              ) : (
                <div className="blog-image-wrapper">
                  <img
                    src={featuredImage.url}
                    alt={featuredImage.description || featuredImage.alt || post.title}
                    loading="lazy"
                    onLoad={(e) => (e.target.style.opacity = "1")}
                    onError={(e) => (e.target.style.display = "none")}
                    style={{
                      width: "100%",
                      height: "auto",
                      borderRadius: "8px",
                      margin: "0 auto",
                      display: "block",
                      opacity: 0,
                      transition: "opacity 0.3s ease",
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
          
          {post.categories?.length > 0 && (
            <Box marginY={5}>
              <Subhead>Categories</Subhead>
              <Space size={2} />
              <Flex gap={2} style={{ flexWrap: "wrap" }}>
                {post.categories.map((category) => (
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

          {/* Comments Section (Giscus — GitHub Discussions) */}
          <GiscusComments />
        </Box>
      </Container>
    </Layout>
  )
}

export const Head = ({ data }) => {
  const post = data.contentfulBlogPost
  return (
    <SEOHead
      title={post.seoTitle || post.title}
      description={post.seoDescription || post.excerpt}
      pathname={`/blog/${post.slug}/`}
    />
  )
}

export const query = graphql`
  query BlogPostBySlug($slug: String!) {
    contentfulBlogPost(slug: { eq: $slug }) {
      id
      title
      slug
      excerpt
      content
      publishDate(formatString: "MMMM DD, YYYY")
      author
      seoTitle
      seoDescription
      featuredImage {
        id
        url
        alt
        description
        gatsbyImageData(width: 800, height: 400, placeholder: BLURRED)
      }
      categories {
        id
        name
        slug
      }
      tags {
        id
        name
        slug
      }
    }
    # Related posts — latest posts excluding the current one.
    # (Client-side category filtering can be applied in RelatedPosts if desired.)
    allContentfulBlogPost(
      filter: { slug: { ne: $slug } }
      limit: 3
      sort: { publishDate: DESC }
    ) {
      nodes {
        id
        title
        slug
        excerpt
        publishDate(formatString: "MMMM DD, YYYY")
        featuredImage {
          url
          description
          alt
        }
        categories {
          name
        }
      }
    }
  }
`
