exports.createResolvers = ({ createResolvers }) => {
  // Always add resolvers, but conditionally return real or mock data
  const bypassWordpress = process.env.BYPASS_WORDPRESS === "true"

  console.log(
    bypassWordpress
      ? "📝 Adding mock data resolvers for BYPASS_WORDPRESS mode"
      : "📝 Adding essential resolvers for WordPress mode"
  )

  // Create a base resolver set that works in both modes
  const baseResolvers = {
    // Navigation item resolvers
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

    // Query resolvers
    Query: {
      allPage: {
        resolve(source, args, context) {
          if (bypassWordpress) {
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
            return context.nodeModel.getAllNodes({ type: "SitePage" })
          }
        },
      },

      allContentfulBlogPost: {
        resolve(_, args, context) {
          // Try to get real Contentful blog posts first
          const realPosts = context.nodeModel.getAllNodes({ type: "ContentfulBlogPost" }) || []

          if (realPosts.length > 0) {
            return {
              nodes: realPosts,
              totalCount: realPosts.length,
            }
          }

          // Return empty nodes when no real Contentful data exists
          return {
            nodes: [],
            totalCount: 0,
          }
        },
      },

      allContentfulVideoPost: {
        resolve(_, args, context) {
          // Try to get real Contentful video posts first
          const realVideos = context.nodeModel.getAllNodes({ type: "ContentfulVideoPost" }) || []

          if (realVideos.length > 0) {
            return {
              nodes: realVideos,
              totalCount: realVideos.length,
            }
          }

          // Return empty nodes when no real Contentful data exists
          return {
            nodes: [],
            totalCount: 0,
          }
        },
      },

      layout: {
        resolve(source, args, context) {
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

    // File resolvers
    File: {
      publicURL: {
        resolve(source) {
          return source.publicURL || source.url || "/static/fallback-file.pdf"
        },
      },
    },

    // ContentfulAsset resolvers
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

  // WordPress mock resolvers for bypass mode
  if (bypassWordpress) {
    // Mock data for Contentful blog and video posts
    const mockBlogPosts = [
      {
        id: "blog-1",
        title: "Music Production Tips for Beginners",
        slug: "music-production-tips-beginners",
        excerpt: "Learn essential music production techniques to take your tracks to the next level.",
        content: "<p>Music production is both an art and a science. In this article, we'll explore key techniques...</p>",
        publishDate: new Date(Date.now() - 86400000 * 5).toISOString(),
        author: "Jeldon",
        featuredImage: { gatsbyImageData: { images: { fallback: { src: "/static/images/demo-cover-1.jpg" } } } },
        categories: { nodes: [{ id: "cat-1", name: "Production", slug: "production" }] },
        tags: { nodes: [{ id: "tag-1", name: "Tutorial", slug: "tutorial" }] },
      },
      {
        id: "blog-2",
        title: "How to Mix Vocals Like a Pro",
        slug: "how-to-mix-vocals-like-pro",
        excerpt: "Professional vocal mixing techniques used in top studios.",
        content: "<p>Vocal mixing is crucial for a polished sound. Here are the secrets...</p>",
        publishDate: new Date(Date.now() - 86400000 * 10).toISOString(),
        author: "Jeldon",
        featuredImage: { gatsbyImageData: { images: { fallback: { src: "/static/images/demo-cover-2.jpg" } } } },
        categories: { nodes: [{ id: "cat-2", name: "Mixing", slug: "mixing" }] },
        tags: { nodes: [{ id: "tag-2", name: "Vocals", slug: "vocals" }] },
      },
      {
        id: "blog-3",
        title: "Choosing the Right DAW for Your Workflow",
        slug: "choosing-right-daw-workflow",
        excerpt: "A comprehensive guide to selecting the best digital audio workstation.",
        content: "<p>The right DAW can transform your production workflow...</p>",
        publishDate: new Date(Date.now() - 86400000 * 20).toISOString(),
        author: "Jeldon",
        featuredImage: { gatsbyImageData: { images: { fallback: { src: "/static/images/demo-cover-3.jpg" } } } },
        categories: { nodes: [{ id: "cat-3", name: "Software", slug: "software" }] },
        tags: { nodes: [{ id: "tag-3", name: "DAW", slug: "daw" }] },
      },
    ]

    const mockVideoPosts = [
      {
        id: "video-1",
        title: "FL Studio Beat Making Tutorial",
        slug: "fl-studio-beat-making-tutorial",
        excerpt: "Watch how to create a complete beat from scratch in FL Studio.",
        body: "<p>In this tutorial, we'll build a complete beat...</p>",
        publishDate: new Date(Date.now() - 86400000 * 3).toISOString(),
        author: "Jeldon",
        youtubeVideoId: "dQw4w9WgXcQ",
        duration: "12:45",
        videoViews: 15420,
        featuredImage: { gatsbyImageData: { images: { fallback: { src: "/static/images/video-cover-1.jpg" } } } },
        categories: { nodes: [{ id: "vcat-1", name: "Tutorials", slug: "tutorials" }] },
      },
      {
        id: "video-2",
        title: "Mixing Bass and Kick Together",
        slug: "mixing-bass-kick-together",
        excerpt: "Learn how to get your bass and kick sitting perfectly in the mix.",
        body: "<p>The relationship between bass and kick is crucial...</p>",
        publishDate: new Date(Date.now() - 86400000 * 7).toISOString(),
        author: "Jeldon",
        youtubeVideoId: "abc123xyz",
        duration: "8:30",
        videoViews: 28900,
        featuredImage: { gatsbyImageData: { images: { fallback: { src: "/static/images/video-cover-2.jpg" } } } },
        categories: { nodes: [{ id: "vcat-2", name: "Mixing Tips", slug: "mixing-tips" }] },
      },
    ]

    const wpResolvers = {
      // Mock Contentful BlogPost resolvers
      ContentfulBlogPost: {
        formattedDate: {
          type: "String",
          resolve(source) {
            if (!source.publishDate) return ""
            const dateObj = new Date(source.publishDate)
            const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
            const month = months[dateObj.getMonth()]
            const day = dateObj.getDate()
            const year = dateObj.getFullYear()
            return `${month} ${day < 10 ? "0" + day : day}, ${year}`
          },
        },
        categories: {
          type: "[ContentfulBlogCategory]",
          resolve(source) {
            return source.categories?.nodes || []
          },
        },
        tags: {
          type: "[ContentfulBlogTag]",
          resolve(source) {
            return source.tags?.nodes || []
          },
        },
      },
      // Mock Contentful VideoPost resolvers
      ContentfulVideoPost: {
        formattedDate: {
          type: "String",
          resolve(source) {
            if (!source.publishDate) return ""
            const dateObj = new Date(source.publishDate)
            const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
            const month = months[dateObj.getMonth()]
            const day = dateObj.getDate()
            const year = dateObj.getFullYear()
            return `${month} ${day < 10 ? "0" + day : day}, ${year}`
          },
        },
        categories: {
          type: "[ContentfulVideoCategory]",
          resolve(source) {
            return source.categories?.nodes || []
          },
        },
        tags: {
          type: "[ContentfulVideoTag]",
          resolve(source) {
            return source.tags?.nodes || []
          },
        },
      },
      WpPost: {
        formattedDate: {
          type: "String",
          resolve(source) {
            if (!source.date) return ""
            const dateObj = new Date(source.date)
            const months = [
              "January", "February", "March", "April", "May", "June",
              "July", "August", "September", "October", "November", "December",
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
      WpVideo: {
        formattedDate: {
          type: "String",
          resolve(source) {
            if (!source.date) return ""
            const dateObj = new Date(source.date)
            const months = [
              "January", "February", "March", "April", "May", "June",
              "July", "August", "September", "October", "November", "December",
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
      // Minimal WpBeat resolvers
      WpBeat: {
        featuredImage: {
          type: "WpNodeWithFeaturedImageToMediaItemConnectionEdgeType",
          resolve() {
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
      },
      // Minimal WpMix resolvers
      WpMix: {
        featuredImage: {
          type: "WpNodeWithFeaturedImageToMediaItemConnectionEdgeType",
          resolve() {
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
      },
    }

    const resolvers = { ...baseResolvers, ...wpResolvers }
    createResolvers(resolvers)
  } else {
    createResolvers(baseResolvers)
  }
}
