exports.createResolvers = ({ createResolvers }) => {
  // Always add resolvers, but conditionally return real or mock data
  const bypassWordpress = process.env.BYPASS_WORDPRESS === "true"

  // Log mode for debugging
  console.log(
    bypassWordpress
      ? "📝 Adding mock data resolvers for BYPASS_WORDPRESS mode"
      : "📝 Adding essential resolvers for WordPress mode"
  )

  // Create a base resolver set that works in both modes
  const baseResolvers = {
    // Add field resolvers for navigation items
    ContentfulNavItem: {
      name: {
        resolve: (source) => source.text || source.name || "",
      },
      submenu: {
        resolve: () => [],
      },
    },
    ContentfulNavItemGroup: {
      href: {
        resolve: () => "#",
      },
      text: {
        resolve: (source) => source.name || "",
      },
      description: {
        resolve: () => "",
      },
      submenu: {
        resolve: (source) => source.navItems || [],
      },
    },

    // The Query type resolvers (like allPage) work in both modes
    Query: {
      // allPage resolver for both bypass mode and live mode
      allPage: {
        resolve(source, args, context) {
          if (bypassWordpress) {
            // Return mock pages in bypass mode
            return {
              nodes: [
                { id: "page-1", path: "/", slug: "home", title: "Home" },
                { id: "page-2", path: "/about", slug: "about", title: "About" },
                {
                  id: "page-3",
                  path: "/contact",
                  slug: "contact",
                  title: "Contact",
                },
              ],
            }
          } else {
            // In live mode, delegate to regular SitePage resolver
            return context.nodeModel.getAllNodes({ type: "SitePage" })
          }
        },
      },

      // Add layout resolver for both modes
      layout: {
        resolve(source, args, context) {
          // Prefer an actual ContentfulLayout node if available so the
          // abstract Layout interface resolves to a concrete type.
          try {
            const layouts =
              context.nodeModel.getAllNodes({ type: "ContentfulLayout" }) || []
            if (layouts.length > 0) return layouts[0]
          } catch (e) {
            /* ignore and fall back to mock object below */
          }

          return {
            __typename: "ContentfulLayout",
            header: {
              __typename: "ContentfulLayoutHeader",
              id: "header-1",
              navItems: [
                {
                  __typename: "ContentfulNavItem",
                  id: "nav-1",
                  navItemType: "LINK",
                  text: "Home",
                  url: "/",
                },
                {
                  __typename: "ContentfulNavItem",
                  id: "nav-2",
                  navItemType: "LINK",
                  text: "Blog",
                  url: "/blog",
                },
                {
                  __typename: "ContentfulNavItem",
                  id: "nav-3",
                  navItemType: "LINK",
                  text: "Music",
                  url: "/music",
                },
                {
                  __typename: "ContentfulNavItem",
                  id: "nav-4",
                  navItemType: "LINK",
                  text: "Videos",
                  url: "/videos",
                },
                {
                  __typename: "ContentfulNavItem",
                  id: "nav-5",
                  navItemType: "LINK",
                  text: "Contact",
                  url: "/contact",
                },
              ],
            },
            footer: {
              __typename: "ContentfulLayoutFooter",
              id: "footer-1",
              links: [
                {
                  __typename: "ContentfulNavItem",
                  id: "social-1",
                  navItemType: "SOCIAL",
                  text: "YouTube",
                  url: "https://youtube.com",
                  username: "jeldonmusic",
                  service: "youtube",
                },
                {
                  __typename: "ContentfulNavItem",
                  id: "social-2",
                  navItemType: "SOCIAL",
                  text: "Instagram",
                  url: "https://instagram.com",
                  username: "jeldonmusic",
                  service: "instagram",
                },
              ],
            },
          }
        },
      },
    },

    // File resolvers work in both modes
    File: {
      publicURL: {
        resolve(source) {
          return source.publicURL || source.url || "/static/fallback-file.pdf"
        },
      },
    },

    // ContentfulAsset works in both modes
    ContentfulAsset: {
      id: {
        type: "ID!",
        resolve: (source) =>
          source.id ||
          `mock-contentful-asset-${Math.random().toString(36).substring(2, 9)}`,
      },
      alt: {
        type: "String",
        resolve: (source) => source.alt || source.title || "Asset image",
      },
      gatsbyImageData: {
        type: "GatsbyImageData",
        resolve: (source) => {
          // Return mock GatsbyImageData structure if actual data is not available
          return (
            source.gatsbyImageData || {
              layout: "constrained",
              width: 800,
              height: 600,
              images: {
                sources: [],
                fallback: {
                  src: source.url || `/static/fallback-image.jpg`,
                  srcSet: "",
                  sizes: "",
                },
              },
            }
          )
        },
      },
      url: {
        type: "String",
        resolve: (source) =>
          source.url || source.file?.url || `/static/fallback-image.jpg`,
      },
    },
  }

  // Only add WordPress-specific resolvers in bypass mode
  if (bypassWordpress) {
    // Add all the WordPress mock resolvers
    const wpResolvers = {
      WpPost: {
        formattedDate: {
          type: "String",
          resolve(source) {
            if (!source.date) return ""

            const dateObj = new Date(source.date)
            const months = [
              "January",
              "February",
              "March",
              "April",
              "May",
              "June",
              "July",
              "August",
              "September",
              "October",
              "November",
              "December",
            ]

            const month = months[dateObj.getMonth()]
            const day = dateObj.getDate()
            const year = dateObj.getFullYear()

            return `${month} ${day < 10 ? "0" + day : day}, ${year}`
          },
        },
        featuredImage: {
          type: "WpNodeWithFeaturedImageToMediaItemConnectionEdgeType",
          resolve() {
            // Return a mock featuredImage structure in bypass mode
            return {
              node: {
                sourceUrl: "/static/images/demo-cover-1.jpg",
                altText: "Demo featured image",
                localFile: {
                  childImageSharp: {
                    gatsbyImageData: {},
                  },
                },
              },
            }
          },
        },
        categories: {
          type: "WpPostToCategoryConnection",
          resolve() {
            // Return mock categories in bypass mode
            return {
              nodes: [
                { id: "cat-1", name: "Music", slug: "music" },
                { id: "cat-2", name: "Production", slug: "production" },
              ],
            }
          },
        },
        tags: {
          type: "WpPostToTagConnection",
          resolve() {
            return {
              nodes: [
                { id: "tag-1", name: "Tutorial", slug: "tutorial" },
                { id: "tag-2", name: "Tips", slug: "tips" },
              ],
            }
          },
        },
        author: {
          type: "WpPostToUserConnectionEdge",
          resolve() {
            return {
              node: {
                id: "author-1",
                name: "Jeldon",
                slug: "jeldon",
              },
            }
          },
        },
        seo: {
          type: "WpSEOType",
          resolve(source) {
            // Return sensible SEO defaults derived from the post fields
            return {
              title: source.title || "Jeldon Music",
              metaDesc: source.excerpt
                ? source.excerpt.replace(/<[^>]*>/g, "").substring(0, 160)
                : "Music production, beats, tutorials, and more from Jeldon Music.",
              canonical: source.slug
                ? `https://www.jeldonmusic.com/${source.slug}/`
                : "https://www.jeldonmusic.com",
              opengraphTitle: source.title || "Jeldon Music",
              opengraphDescription: source.excerpt
                ? source.excerpt.replace(/<[^>]*>/g, "").substring(0, 160)
                : "Music production, beats, tutorials, and more from Jeldon Music.",
              opengraphImage: null,
              twitterTitle: source.title || "Jeldon Music",
              twitterDescription: source.excerpt
                ? source.excerpt.replace(/<[^>]*>/g, "").substring(0, 160)
                : "Music production, beats, tutorials, and more from Jeldon Music.",
              twitterImage: null,
            }
          },
        },
      },
      // Add WpVideo resolvers
      WpVideo: {
        formattedDate: {
          type: "String",
          resolve(source) {
            if (!source.date) return ""

            const dateObj = new Date(source.date)
            const months = [
              "January",
              "February",
              "March",
              "April",
              "May",
              "June",
              "July",
              "August",
              "September",
              "October",
              "November",
              "December",
            ]

            const month = months[dateObj.getMonth()]
            const day = dateObj.getDate()
            const year = dateObj.getFullYear()

            return `${month} ${day < 10 ? "0" + day : day}, ${year}`
          },
        },
        featuredImage: {
          type: "WpNodeWithFeaturedImageToMediaItemConnectionEdgeType",
          resolve() {
            // Return a mock featuredImage structure in bypass mode
            return {
              node: {
                sourceUrl: "/static/images/demo-cover-1.jpg",
                altText: "Demo video thumbnail",
                localFile: {
                  childImageSharp: {
                    gatsbyImageData: {},
                  },
                },
              },
            }
          },
        },
        videoCategories: {
          type: "WpVideoToVideoCategoryConnection",
          resolve() {
            // Return mock categories in bypass mode
            return {
              nodes: [
                { id: "vcat-1", name: "Tutorials", slug: "tutorials" },
                {
                  id: "vcat-2",
                  name: "Behind the Scenes",
                  slug: "behind-the-scenes",
                },
              ],
            }
          },
        },
        videoDetails: {
          type: "WpContentNode_Videodetails",
          resolve() {
            return {
              videoViews: "12,345",
              videoDuration: "10:30",
              videoPublishedAt: new Date().toISOString(),
              youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
              youtubeVideoId: "dQw4w9WgXcQ",
            }
          },
        },
      },
      // Enhance WpBeat resolvers
      WpBeat: {
        featuredImage: {
          type: "WpNodeWithFeaturedImageToMediaItemConnectionEdgeType",
          resolve() {
            // Return a mock featuredImage structure in bypass mode
            return {
              node: {
                sourceUrl: "/static/images/demo-cover-1.jpg",
                altText: "Demo beat cover",
                localFile: {
                  childImageSharp: {
                    gatsbyImageData: {},
                  },
                },
              },
            }
          },
        },
        // Add mock acfBeats fields
        acfBeats: {
          type: "WpBeatAcfBeats",
          resolve() {
            return {
              audioFile: {
                localFile: {
                  publicURL: "/static/audio/demo-track-1.mp3",
                  url: "/static/audio/demo-track-1.mp3",
                },
              },
              price: 29.99,
              genre: "Hip-Hop",
              bpm: 95,
              audioUrl: "/static/audio/demo-track-1.mp3",
              soundcloudUrl: "#",
              keySignature: "C Minor",
              musicalKey: "C Minor",
            }
          },
        },
        beatFields: {
          type: "WpBeatAcfBeats",
          resolve(source) {
            // Simply pass through or delegate to the acfBeats resolver
            return {
              audioFile: {
                localFile: {
                  publicURL: "/static/audio/demo-track-1.mp3",
                  url: "/static/audio/demo-track-1.mp3",
                },
              },
              price: 29.99,
              genre: "Hip-Hop",
              bpm: 95,
              audioUrl: "/static/audio/demo-track-1.mp3",
              soundcloudUrl: "#",
              keySignature: "C Minor",
              musicalKey: "C Minor",
              purchaseUrl: "https://example.com/buy",
            }
          },
        },
      },
      // Enhance WpMix resolvers
      WpMix: {
        featuredImage: {
          type: "WpNodeWithFeaturedImageToMediaItemConnectionEdgeType",
          resolve() {
            // Return a mock featuredImage structure in bypass mode
            return {
              node: {
                sourceUrl: "/static/images/demo-cover-1.jpg",
                altText: "Demo mix cover",
                localFile: {
                  childImageSharp: {
                    gatsbyImageData: {},
                  },
                },
              },
            }
          },
        },
        mixFields: {
          type: "WpMixAcfMixes",
          resolve(source) {
            // Only use this resolver in bypass mode
            const bypassWordpress = process.env.BYPASS_WORDPRESS === "true"

            if (!bypassWordpress && source.acfMixes) {
              // In WordPress mode, delegate to the actual ACF field
              return source.acfMixes
            }

            // In bypass mode or if acfMixes is missing, return mock data
            return {
              audioFile: {
                localFile: {
                  publicURL: "/static/audio/demo-track-2.mp3",
                  url: "/static/audio/demo-track-2.mp3",
                },
              },
              genre: "Hip-Hop",
              tracklist: "1. Track One\n2. Track Two\n3. Track Three",
              audioUrl: "/static/audio/demo-track-2.mp3",
              soundcloudUrl: "#",
              spotifyUrl: "https://spotify.com/track",
              mixDuration: "45:30",
              mixType: "DJ Mix",
            }
          },
        },
      },
    }

    // Merge the base resolvers with the WordPress resolvers
    const resolvers = { ...baseResolvers, ...wpResolvers }
    createResolvers(resolvers)
  } else {
    // In WordPress mode, only use the base resolvers to avoid conflicts
    createResolvers(baseResolvers)
  }
}
