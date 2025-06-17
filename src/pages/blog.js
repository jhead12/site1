import React, { useState, useMemo, useEffect } from "react"
import { graphql } from "gatsby"
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

const BlogPage = ({ data, location }) => {
  const posts = data.allWpPost.nodes
  const categories = data.allWpCategory.nodes
  
  // Get category from URL params
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchFilteredPosts, setSearchFilteredPosts] = useState(posts)
  
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
    if (selectedCategory === "all") return posts
    
    return posts.filter(post => 
      post.categories.nodes.some(category => category.slug === selectedCategory)
    )
  }, [posts, selectedCategory])
  
  // Combine category and search filters
  const finalFilteredPosts = useMemo(() => {
    if (selectedCategory === "all") {
      return searchFilteredPosts
    }
    
    return searchFilteredPosts.filter(post => 
      post.categories.nodes.some(category => category.slug === selectedCategory)
    )
  }, [searchFilteredPosts, selectedCategory])
  
  // Add post counts to categories
  const categoriesWithCounts = useMemo(() => {
    return categories.map(category => ({
      ...category,
      count: posts.filter(post => 
        post.categories.nodes.some(postCategory => postCategory.slug === category.slug)
      ).length
    })).filter(category => category.count > 0)
  }, [categories, posts])

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
          <BlogSearch 
            posts={categoryFilteredPosts}
            onFilteredPosts={setSearchFilteredPosts}
            selectedCategory={selectedCategory}
          />
          
          {/* Category Filter */}
          <CategoryFilter 
            categories={categoriesWithCounts}
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
          />
          
          {/* Results count */}
          <Text style={{ color: "#666", marginBottom: "1rem" }}>
            {selectedCategory === "all" 
              ? `Showing ${finalFilteredPosts.length} of ${posts.length} posts`
              : `Showing ${finalFilteredPosts.length} posts in "${categoriesWithCounts.find(c => c.slug === selectedCategory)?.name || selectedCategory}"`
            }
          </Text>
          
          <Box marginY={5}>
            <Flex gap={4} variant="column">
              {finalFilteredPosts.map((post) => (
                <Box key={post.id} paddingY={4} style={{ borderBottom: "1px solid #eee" }}>
                  <Flex gap={4}>
                    {post.featuredImage?.node?.sourceUrl && (
                      <Box style={{ minWidth: "200px" }}>
                        <Link to={`/blog/${post.slug}/`}>
                          <img
                            src={post.featuredImage.node.sourceUrl}
                            alt={post.featuredImage.node.altText || post.title}
                            style={{ 
                              width: "200px", 
                              height: "120px", 
                              objectFit: "cover",
                              borderRadius: "8px"
                            }}
                          />
                        </Link>
                      </Box>
                    )}
                    
                    <Box>
                      <Subhead>
                        <Link to={`/blog/${post.slug}/`}>{post.title}</Link>
                      </Subhead>
                      
                      <Text variant="kicker" marginY={2}>
                        {/* Date hidden per user request */}
                        {/* {post.date} */}
                        {post.author?.node?.name && `By ${post.author.node.name}`}
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
        </Container>
      </Section>
    </Layout>
  )
}

export const query = graphql`
  query BlogArchive {
    allWpPost(sort: { date: DESC }) {
      nodes {
        id
        title
        excerpt
        slug
        date(formatString: "MMMM DD, YYYY")
        author {
          node {
            name
          }
        }
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
      }
    }
    allWpCategory(filter: { count: { gt: 0 } }) {
      nodes {
        id
        name
        slug
        count
      }
    }
  }
`

export default BlogPage
