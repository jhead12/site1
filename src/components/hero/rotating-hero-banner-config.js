// src/components/hero/rotating-hero-banner-config.js

/**
 * Configuration for the rotating hero banner
 * This allows for customizing the content sources and display options
 */

const heroConfig = {
  // Content sources to include in the rotation
  contentSources: {
    // WordPress content types
    wordpress: {
      // Blog posts
      posts: {
        enabled: true,
        type: 'blog',
        query: `
          heroBlogPosts: allWpPost(
            filter: { 
              acfPostFields: { isHero: { eq: true } }
              status: { eq: "publish" }
            }
            sort: { date: DESC }
            limit: 10
          ) {
            nodes {
              id
              title
              excerpt
              slug
              date(formatString: "MMMM DD, YYYY")
              featuredImage {
                node {
                  localFile {
                    childImageSharp {
                      gatsbyImageData(
                        width: 1920
                        height: 600
                        placeholder: BLURRED
                        formats: [AUTO, WEBP, AVIF]
                      )
                    }
                  }
                  altText
                }
              }
              acfPostFields {
                isHero
                heroSubtitle
                heroCta
                heroCtaLink
              }
              categories {
                nodes {
                  name
                  slug
                }
              }
            }
          }
        `,
        processData: data => data.heroBlogPosts.nodes.map(post => ({
          id: post.id,
          type: 'blog',
          title: post.title,
          excerpt: post.excerpt,
          slug: post.slug,
          date: post.date,
          image: post.featuredImage?.node?.localFile,
          imageAlt: post.featuredImage?.node?.altText || post.title,
          subtitle: post.acfPostFields?.heroSubtitle,
          cta: post.acfPostFields?.heroCta,
          ctaLink: post.acfPostFields?.heroCtaLink,
          categories: post.categories?.nodes,
          url: `/blog/${post.slug}`
        }))
      },
      
      // Beats
      beats: {
        enabled: true,
        type: 'beat',
        query: `
          heroBeats: allWpBeat(
            filter: { 
              acfBeatFields: { isHero: { eq: true } }
              status: { eq: "publish" }
            }
            sort: { date: DESC }
            limit: 5
          ) {
            nodes {
              id
              title
              excerpt
              slug
              date(formatString: "MMMM DD, YYYY")
              featuredImage {
                node {
                  localFile {
                    childImageSharp {
                      gatsbyImageData(
                        width: 1920
                        height: 600
                        placeholder: BLURRED
                        formats: [AUTO, WEBP, AVIF]
                      )
                    }
                  }
                  altText
                }
              }
              acfBeatFields {
                isHero
                heroSubtitle
                heroCta
                heroCtaLink
                price
                bpm
                key
                genre
                audioPreview {
                  localFile {
                    publicURL
                  }
                }
              }
            }
          }
        `,
        processData: data => data.heroBeats.nodes.map(beat => ({
          id: beat.id,
          type: 'beat',
          title: beat.title,
          excerpt: beat.excerpt,
          slug: beat.slug,
          date: beat.date,
          image: beat.featuredImage?.node?.localFile,
          imageAlt: beat.featuredImage?.node?.altText || beat.title,
          subtitle: beat.acfBeatFields?.heroSubtitle,
          cta: beat.acfBeatFields?.heroCta,
          ctaLink: beat.acfBeatFields?.heroCtaLink,
          metadata: {
            price: beat.acfBeatFields?.price,
            bpm: beat.acfBeatFields?.bpm,
            key: beat.acfBeatFields?.key,
            genre: beat.acfBeatFields?.genre
          },
          audioPreview: beat.acfBeatFields?.audioPreview?.localFile?.publicURL,
          url: `/beats/${beat.slug}`
        }))
      },
      
      // Videos/tutorials
      videos: {
        enabled: true,
        type: 'video',
        query: `
          heroVideos: allWpTutorial(
            filter: { 
              acfTutorialFields: { isHero: { eq: true } }
              status: { eq: "publish" }
            }
            sort: { date: DESC }
            limit: 5
          ) {
            nodes {
              id
              title
              excerpt
              slug
              date(formatString: "MMMM DD, YYYY")
              featuredImage {
                node {
                  localFile {
                    childImageSharp {
                      gatsbyImageData(
                        width: 1920
                        height: 600
                        placeholder: BLURRED
                        formats: [AUTO, WEBP, AVIF]
                      )
                    }
                  }
                  altText
                }
              }
              acfTutorialFields {
                isHero
                heroSubtitle
                heroCta
                heroCtaLink
                difficulty
                duration
                videoUrl
              }
            }
          }
        `,
        processData: data => data.heroVideos.nodes.map(video => ({
          id: video.id,
          type: 'video',
          title: video.title,
          excerpt: video.excerpt,
          slug: video.slug,
          date: video.date,
          image: video.featuredImage?.node?.localFile,
          imageAlt: video.featuredImage?.node?.altText || video.title,
          subtitle: video.acfTutorialFields?.heroSubtitle,
          cta: video.acfTutorialFields?.heroCta,
          ctaLink: video.acfTutorialFields?.heroCtaLink,
          metadata: {
            difficulty: video.acfTutorialFields?.difficulty,
            duration: video.acfTutorialFields?.duration
          },
          videoUrl: video.acfTutorialFields?.videoUrl,
          url: `/tutorials/${video.slug}`
        }))
      },
      
      // Mixes
      mixes: {
        enabled: true,
        type: 'mix',
        query: `
          heroMixes: allWpMix(
            filter: { 
              acfMixFields: { isHero: { eq: true } }
              status: { eq: "publish" }
            }
            sort: { date: DESC }
            limit: 5
          ) {
            nodes {
              id
              title
              excerpt
              slug
              date(formatString: "MMMM DD, YYYY")
              featuredImage {
                node {
                  localFile {
                    childImageSharp {
                      gatsbyImageData(
                        width: 1920
                        height: 600
                        placeholder: BLURRED
                        formats: [AUTO, WEBP, AVIF]
                      )
                    }
                  }
                  altText
                }
              }
              acfMixFields {
                isHero
                heroSubtitle
                heroCta
                heroCtaLink
                duration
                mixAudio {
                  localFile {
                    publicURL
                  }
                }
              }
            }
          }
        `,
        processData: data => data.heroMixes.nodes.map(mix => ({
          id: mix.id,
          type: 'mix',
          title: mix.title,
          excerpt: mix.excerpt,
          slug: mix.slug,
          date: mix.date,
          image: mix.featuredImage?.node?.localFile,
          imageAlt: mix.featuredImage?.node?.altText || mix.title,
          subtitle: mix.acfMixFields?.heroSubtitle,
          cta: mix.acfMixFields?.heroCta,
          ctaLink: mix.acfMixFields?.heroCtaLink,
          metadata: {
            duration: mix.acfMixFields?.duration
          },
          audioPreview: mix.acfMixFields?.mixAudio?.localFile?.publicURL,
          url: `/mixes/${mix.slug}`
        }))
      }
    },
    
    // YouTube Videos (most recent)
    youtube: {
      enabled: true,
      type: 'youtube',
      query: `
        latestYoutubeVideos: allYoutubeVideo(
          sort: { publishedAt: DESC }
          limit: 3
        ) {
          nodes {
            id
            title
            description
            videoId
            publishedAt(formatString: "MMMM DD, YYYY")
            localThumbnail {
              childImageSharp {
                gatsbyImageData(
                  width: 1920
                  height: 600
                  placeholder: BLURRED
                  formats: [AUTO, WEBP, AVIF]
                )
              }
            }
          }
        }
      `,
      processData: data => data.latestYoutubeVideos?.nodes.map(video => ({
        id: video.id,
        type: 'youtube',
        title: video.title,
        excerpt: video.description,
        date: video.publishedAt,
        image: video.localThumbnail,
        imageAlt: `YouTube thumbnail for ${video.title}`,
        subtitle: "Latest YouTube Video",
        cta: "Watch Now",
        ctaLink: `https://www.youtube.com/watch?v=${video.videoId}`,
        videoId: video.videoId,
        url: `https://www.youtube.com/watch?v=${video.videoId}`
      })) || []
    },
    
    // Shopify products (for when we implement the store)
    shopify: {
      enabled: false, // Enable once Shopify is integrated
      type: 'product',
      query: `
        featuredProducts: allShopifyProduct(
          filter: { 
            tags: { elemMatch: { name: { eq: "hero" } } }
          }
          sort: { publishedAt: DESC }
          limit: 5
        ) {
          nodes {
            id
            title
            description
            handle
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
            featuredImage {
              localFile {
                childImageSharp {
                  gatsbyImageData(
                    width: 1920
                    height: 600
                    placeholder: BLURRED
                    formats: [AUTO, WEBP, AVIF]
                  )
                }
              }
              altText
            }
          }
        }
      `,
      processData: data => data.featuredProducts?.nodes.map(product => ({
        id: product.id,
        type: 'product',
        title: product.title,
        excerpt: product.description,
        slug: product.handle,
        image: product.featuredImage?.localFile,
        imageAlt: product.featuredImage?.altText || product.title,
        subtitle: "Featured Product",
        cta: "Shop Now",
        ctaLink: `/products/${product.handle}`,
        metadata: {
          price: product.priceRange?.minVariantPrice?.amount,
          currency: product.priceRange?.minVariantPrice?.currencyCode
        },
        url: `/products/${product.handle}`
      })) || []
    }
  },
  
  // Display configuration
  display: {
    // Auto rotation settings
    autoRotate: {
      enabled: true,
      interval: 6000, // 6 seconds per slide
      pauseOnHover: true
    },
    
    // Feature: Pin latest video upload to beginning of rotation
    pinLatestVideo: {
      enabled: true,
      sources: ['youtube', 'video'], // Order of priority (youtube first, then WP video)
      maxAge: 7 // Days - only pin if video is less than 7 days old
    },
    
    // Animation settings
    animation: {
      type: 'fade',
      duration: 300, // ms
      easing: 'ease-in-out'
    },
    
    // Layout settings
    layout: {
      textPosition: 'center', // 'left', 'center', 'right'
      showMetadata: true,
      showExcerpt: true,
      maxExcerptLength: 150, // characters
      showDate: true
    }
  }
}

export default heroConfig
