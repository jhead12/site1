import * as React from "react"
import { graphql } from "gatsby"
import Layout from "../components/layout"
import * as sections from "../components/sections"
import Fallback from "../components/fallback"
import SEOHead from "../components/head"
import RotatingHeroBanner from "../components/hero/rotating-hero-banner"

export default function Homepage(props) {
  const { homepage, allWpPost } = props.data

  return (
    <Layout>
      {/* Dynamic Rotating Hero Banner */}
      <RotatingHeroBanner />
      
      {/* Contentful blocks */}
      {homepage.blocks.map((block) => {
        const { id, blocktype, ...componentProps } = block
        const Component = sections[blocktype] || Fallback
        return <Component key={id} {...componentProps} />
      })}

      <sections.BeatsStatList />
      <sections.BlogFeature data={{ allWpPost }} />
    </Layout>
    
  )
}
export const Head = (props) => {
  const { homepage } = props.data
  return <SEOHead {...homepage} />
}
export const query = graphql`
  {
    homepage {
      id
      title
      description
      image {
        id
        url
      }
      blocks: content {
        id
        blocktype
        ...HomepageHeroContent
        ...HomepageFeatureListContent
        ...HomepageCtaContent
        ...HomepageLogoListContent
        ...HomepageTestimonialListContent
        ...HomepageBenefitListContent
        ...HomepageStatListContent
        ...HomepageProductListContent
        
           }
    }
    allWpPost(sort: { date: DESC}, limit: 5) {
      nodes {
        id
        title
        excerpt
        uri
        slug
        date(formatString: "MMMM DD, YYYY")
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
      }
    }
  }
`
