// Test GraphQL fragments for validation
const { graphql } = require("gatsby")

// Test fragment for HomepageHero
const testHomepageHero = graphql`
  fragment TestHomepageHeroContent on ContentfulHomepageHero {
    id
    heroHeading: heading
    kicker
    subhead
    text
    image {
      id
      gatsbyImageData
      alt
      title
      description
    }
    links {
      id
      href
      text
    }
  }
`

// Test fragment for HomepageLogoList
const testHomepageLogoList = graphql`
  fragment TestHomepageLogoListContent on ContentfulHomepageLogoList {
    id
    logoHeading: name
    text
    logos {
      id
      alt
      link
      image {
        id
        gatsbyImageData
        title
        description
      }
    }
  }
`

// Test fragment for HomepageTestimonialList
const testHomepageTestimonialList = graphql`
  fragment TestHomepageTestimonialListContent on ContentfulHomepageTestimonialList {
    id
    testimonialHeading: heading
    kicker
    content {
      id
      quote
      source
      avatar {
        id
        alt
        title
        description
        gatsbyImageData
      }
    }
  }
`

module.exports = {
  testHomepageHero,
  testHomepageLogoList,
  testHomepageTestimonialList,
}
