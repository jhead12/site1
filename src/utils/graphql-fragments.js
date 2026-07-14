// GraphQL fragments for WordPress content types
import { graphql } from "gatsby"

// Common fields for all WordPress content
export const wpContentFields = graphql`
  fragment WpContentFields on WpContentNode {
    id
    title
    slug
    uri
    date
    modified
    content
    featuredImage {
      node {
        altText
        localFile {
          childImageSharp {
            gatsbyImageData(
              width: 800
              placeholder: BLURRED
              formats: [AUTO, WEBP, AVIF]
            )
          }
        }
      }
    }
    # SEO fields from Yoast or RankMath (restored — if the WP SEO plugin
    # is not active, these fields simply won't be populated and the
    # wordpress-seo.js component falls back to title/description props)
    seo {
      title
      metaDesc
      canonical
      opengraphTitle
      opengraphDescription
      opengraphImage {
        altText
        sourceUrl
        localFile {
          childImageSharp {
            gatsbyImageData(width: 1200, height: 630)
          }
        }
      }
    }
  }
`

// Beat-specific fields
export const beatFields = graphql`
  fragment BeatFields on WpBeat {
    ...WpContentFields
    beatFields {
      audioFile {
        localFile {
          url
          # Fallback if publicURL isn't available
          childImageSharp {
            gatsbyImageData
          }
        }
      }
      bpm
      musicalKey
      price
      licenseType
      stemsAvailable
      producerCredits {
        producerName
        role
      }
    }
    # musicGenres {  # Temporarily disabled pending taxonomy fix
    #   nodes {
    #     id
    #     name
    #     slug
    #   }
    # }
    # moods {  # Temporarily disabled pending taxonomy fix
    #   nodes {
    #     id
    #     name
    #     slug
    #   }
    # }
  }
`

// Tutorial-specific fields
export const tutorialFields = graphql`
  fragment TutorialFields on WpTutorial {
    ...WpContentFields
    tutorialFields {
      videoFile {
        localFile {
          url
          childImageSharp {
            gatsbyImageData
          }
        }
      }
      videoUrl
      tutorialLevel
      softwareUsed
      chapterMarkers {
        time
        title
        description
      }
      resources {
        localFile {
          url
          name
          childImageSharp {
            gatsbyImageData
          }
        }
      }
    }
  }
`

// Mix-specific fields
export const mixFields = graphql`
  fragment MixFields on WpMix {
    ...WpContentFields
    mixFields {
      audioFile {
        localFile {
          url
          childImageSharp {
            gatsbyImageData
          }
        }
      }
      mixDuration
      tracklist
      mixType
      downloadLink
      spotifyUrl
      appleMusicUrl
    }
    # musicGenres {  # Temporarily disabled pending taxonomy fix
    #   nodes {
    #     id
    #     name
    #     slug
    #   }
    # }
    # moods {  # Temporarily disabled pending taxonomy fix
    #   nodes {
    #     id
    #     name
    #     slug
    #   }
    # }
  }
`

// Archive/listing fields (lighter queries)
export const contentCardFields = graphql`
  fragment ContentCardFields on WpContentNode {
    id
    title
    slug
    uri
    date
    excerpt
    featuredImage {
      node {
        altText
        localFile {
          childImageSharp {
            gatsbyImageData(
              width: 400
              height: 300
              placeholder: BLURRED
              formats: [AUTO, WEBP]
            )
          }
        }
      }
    }
  }
`

// Beat card fields for listings
export const beatCardFields = graphql`
  fragment BeatCardFields on WpBeat {
    ...ContentCardFields
    beatFields {
      bpm
      musicalKey
      price
      licenseType
    }
    musicGenres {
      nodes {
        name
        slug
      }
    }
  }
`

// Tutorial card fields for listings
export const tutorialCardFields = graphql`
  fragment TutorialCardFields on WpTutorial {
    ...ContentCardFields
    tutorialFields {
      tutorialLevel
      softwareUsed
    }
  }
`

// Mix card fields for listings
export const mixCardFields = graphql`
  fragment MixCardFields on WpMix {
    ...ContentCardFields
    mixFields {
      mixDuration
      mixType
    }
    musicGenres {
      nodes {
        name
        slug
      }
    }
  }
`
