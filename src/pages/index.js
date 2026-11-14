import * as React from "react"
import { graphql } from "gatsby"
import { Render } from "@measured/puck"
import Layout from "../components/layout"
import * as sections from "../components/sections"
import SEOHead from "../components/head"
import { config } from "../lib/puck/config"
// The top of the homepage is composed in the Puck editor (/edit/?page=home)
// and saved to this file. Publishing from /edit commits it and Netlify
// rebuilds the site. Data-driven sections (latest posts, shop) stay below.
import homeData from "../../static/puck-content/home.json"

export default function Homepage(props) {
  const blogPosts = props.data?.allContentfulBlogPost || { nodes: [] }

  return (
    <Layout>
      <Render config={config} data={homeData} />

      <sections.BlogFeature data={{ allContentfulBlogPost: blogPosts }} />

      {/* Shopify section - only renders if products exist */}
      <sections.ShopFeature
        data={{
          allShopifyProduct: props.data?.allShopifyProduct || { nodes: [] },
        }}
      />
    </Layout>
  )
}

export const Head = () => {
  const rootProps = homeData?.root?.props || {}
  const heroImage = homeData?.content?.find((b) => b.type === "Hero")?.props?.imageUrl
  return (
    <SEOHead
      title={rootProps.title || "J. Eldon Music"}
      description={rootProps.description}
      image={heroImage ? { url: heroImage } : null}
      pathname="/"
    />
  )
}

export const query = graphql`
  query HomePageQuery {
    allContentfulBlogPost(sort: { publishDate: DESC }, limit: 3) {
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
          gatsbyImageData(width: 600, placeholder: BLURRED, formats: [AUTO, WEBP, AVIF])
        }
      }
    }
  }
`
