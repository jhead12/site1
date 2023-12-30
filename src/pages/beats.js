import * as React from "react"
import { graphql } from "gatsby"
import Layout from "../components/layout"
import * as sections from "../components/sections"
import Fallback from "../components/fallback"
import SEOHead from "../components/head"

export default function Beats(props) {
  const { beat } = props.data

  return (
    <Layout>
      {beat.blocks.map((block) => {
        const { id, blocktype, ...componentProps } = block
        const Component = sections[blocktype] || Fallback
        return <Component key={id} {...componentProps} />
      })}
    </Layout>
  )
}
export const Head = (props) => {
  const { beat } = props.data
  return <SEOHead {...beat} />
}
export const query = graphql`
  {
    beats {
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
        ...BeatsHeroContent
        ...BeatsFeatureListContent
        ...BeatsCtaContent
        ...BeatsLogoListContent
        ...BeatsTestimonialListContent
        ...BeatsStatListContent
        ...BeatsProductListContent
      }
    }
  }
`
