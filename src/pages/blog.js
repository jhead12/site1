import React, { useState, useMemo, useEffect } from "react"
import { graphql } from "gatsby"
import { GatsbyImage, getImage } from "gatsby-plugin-image"
import Layout from "../components/layout"
import { Link } from "../components/ui"
import CategoryFilter from "../components/blog/category-filter"
import BlogSearch from "../components/blog/blog-search"
import {
  Container,
  Section,
  Box,
  Heading,
  Text,
  Subhead,
  Flex
} from "../components/ui"
import "../components/blog-mobile-fix.css"

const BlogPage = ({ data, location }) => {
  // Blog content comes from Contentful (always available — no WP bypass needed)
  const postsData = useMemo(() => {
    return data.allContentfulBlogPost?.nodes || []
  }, [data.allContentfulBlogPost?.nodes])

  // Derive the category list (with counts) from the posts themselves,
  // so only categories that are actually used appear.
  const categoriesData = useMemo(() => {
    const map = new Map()
    postsData.forEach((post) => {
      ;(post.categories || []).forEach((category) => {
        if (!map.has(category.slug)) {
          map.set(category.slug, { ...category, count: 0 })
        }
        map.get(category.slug).count += 1
      })
    })
    return Array.from(map.values())
  }, [postsData])

  const posts = postsData
  
  // Get category from URL params
  const [selectedCategory, setSelectedCategory] = useState("all")
  // Initialize searchFilteredPosts with posts, but do not directly depend on posts
  const [searchFilteredPosts, setSearchFilteredPosts] = useState([])
  
  // Update searchFilteredPosts when posts change
  useEffect(() => {
    setSearchFilteredPosts(posts)
  }, [posts])
  
  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(location.search)
      const categoryParam = urlParams.get("category")
      if (categoryParam) {
        setSelectedCategory(categoryParam)
      }
    }
  }, [location.search])
  
  // Filter posts based on selected category
  const categoryFilteredPosts = useMemo(() => {
    if (selectedCategory === "all") return postsData

    return postsData.filter(post =>
      (post.categories || []).some(category => category.slug === selectedCategory)
    )
  }, [postsData, selectedCategory])

  // Combine category and search filters
  const finalFilteredPosts = useMemo(() => {
    if (selectedCategory === "all") {
      return searchFilteredPosts
    }

    return searchFilteredPosts.filter(post =>
      (post.categories || []).some(category => category.slug === selectedCategory)
    )
  }, [searchFilteredPosts, selectedCategory])

  // Add post counts to categories (derived categories already carry counts,
  // but recompute here to stay consistent with the current filter source).
  const categoriesWithCounts = useMemo(() => {
    return categoriesData
      .map(category => ({
        ...category,
        count: postsData.filter(post =>
          (post.categories || []).some(postCategory => postCategory.slug === category.slug)
        ).length,
      }))
      .filter(category => category.count > 0)
  }, [categoriesData, postsData])

  const handleCategoryChange = (categorySlug) => {
    setSelectedCategory(categorySlug)
    
    // Update URL without page reload
    if (typeof window !== "undefined") {
      const url = new URL(window.location)
      if (categorySlug === "all") {
        url.searchParams.delete("category")
      } else {
        url.searchParams.set("category", categorySlug)
      }
      window.history.replaceState({}, "", url)
    }
  }
  
  return (
    <Layout>
      <Section paddingY={5}>
        <Container width="normal">
          <Heading as="h1" center>Blog</Heading>
          <Text center variant="lead">
            Latest thoughts on music production, tutorials, and industry insights.
          </Text>

          {/* Search */}
          <Box marginBottom={7}>
            <BlogSearch 
              posts={categoryFilteredPosts}
              onFilteredPosts={setSearchFilteredPosts}
              selectedCategory={selectedCategory}
            />
          </Box>
          {/* Category Filter */}
          <CategoryFilter 
            categories={categoriesWithCounts}
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
          />
          
          {/* Results count */}
          {finalFilteredPosts.length > 0 ? (
            <Text style={{ color: "#666", marginBottom: "1rem" }}>
              {selectedCategory === "all"
                ? `Showing ${finalFilteredPosts.length} of ${posts.length} posts`
                : `Showing ${finalFilteredPosts.length} posts in "${categoriesWithCounts.find(c => c.slug === selectedCategory)?.name || selectedCategory}"`
              }
            </Text>
          ) : (
            <Box marginY={5} center>
              <Heading as="h2">Blogs Coming Soon</Heading>
              <Text variant="lead" center>
                We're working on new content. Check back soon for fresh articles on music production, tutorials, and industry insights.
              </Text>
            </Box>
          )}

          {finalFilteredPosts.length > 0 && (
            <Box marginY={5}>
              <Flex gap={4} variant="column">
                {finalFilteredPosts.map((post) => (
                  <Box key={post.id} paddingY={4} style={{ borderBottom: "1px solid #eee" }}>
                    <Flex gap={4}>
                      {post.featuredImage?.gatsbyImageData && (
                        <Box width="fitContent" style={{ minWidth: "200px", flexShrink: 0 }}>
                          <div className="blog-image-wrapper">
                            <Link to={`/blog/${post.slug}/`}>
                              <GatsbyImage
                                image={getImage(post.featuredImage.gatsbyImageData)}
                                alt={post.featuredImage.description || post.featuredImage.alt || post.title}
                                loading="lazy"
                                style={{ borderRadius: "8px" }}
                                imgStyle={{ objectFit: "cover" }}
                              />
                            </Link>
                          </div>
                        </Box>
                      )}

                      <Box>
                        <Subhead>
                          <Link to={`/blog/${post.slug}/`}>{post.title}</Link>
                        </Subhead>

                        <Text variant="kicker" marginY={2}>
                          {/* Date hidden per user request */}
                          {/* {post.publishDate} */}
                          {post.author && `By ${post.author}`}
                        </Text>

                        {post.excerpt && (
                          <Text dangerouslySetInnerHTML={{ __html: post.excerpt }} />
                        )}

                        <Box marginY={3}>
                          <Link to={`/blog/${post.slug}/`}>Read more →</Link>
                        </Box>
                      </Box>
                    </Flex>
                  </Box>
                ))}
              </Flex>
            </Box>
          )}
        </Container>
      </Section>
    </Layout>
  )
}

export const query = graphql`
  query BlogArchive {
    allContentfulBlogPost(sort: { publishDate: DESC }) {
      nodes {
        id
        title
        excerpt
        slug
        publishDate
        author
        featuredImage {
          url
          alt
          description
          gatsbyImageData(width: 400, placeholder: BLURRED, formats: [AUTO, WEBP, AVIF])
        }
        categories {
          id
          name
          slug
        }
      }
    }
  }
`

export default BlogPage
