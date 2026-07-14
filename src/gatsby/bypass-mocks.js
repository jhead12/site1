exports.onPostBuild = ({ store }) => {
  const { program } = store.getState()
  const fs = require("fs")
  const path = require("path")

  if (process.env.BYPASS_WORDPRESS === "true") {
    const publicPath = path.join(program.directory, "public")
    const dataPath = path.join(publicPath, "page-data", "sq", "d")

    // Ensure the directory exists
    if (!fs.existsSync(dataPath)) {
      fs.mkdirSync(dataPath, { recursive: true })
    }

    // Mock data for layout query used in header (ID: 860043902)
    const headerData = {
      data: {
        layout: {
          header: {
            id: "header-mock",
            navItems: [
              { id: "home", navItemType: "LINK", href: "/", text: "Home" },
              {
                id: "music",
                navItemType: "LINK",
                href: "/music",
                text: "Music",
              },
              {
                id: "videos",
                navItemType: "LINK",
                href: "/videos",
                text: "Videos",
              },
              { id: "blog", navItemType: "LINK", href: "/blog", text: "Blog" },
              {
                id: "contact",
                navItemType: "LINK",
                href: "/contact",
                text: "Contact",
              },
            ],
          },
        },
      },
    }

    // Mock data for layout query used in footer
    const footerData = {
      data: {
        layout: {
          footer: {
            id: "footer-mock",
            copyright: "© 2025 J. Eldon Music",
            links: [
              { id: "home", href: "/", text: "Home" },
              { id: "about", href: "/about", text: "About" },
              { id: "contact", href: "/contact", text: "Contact" },
            ],
            meta: [
              { id: "privacy", href: "/privacy", text: "Privacy Policy" },
              { id: "terms", href: "/terms", text: "Terms of Service" },
            ],
            socialLinks: [
              { id: "yt", service: "YOUTUBE", username: "jeldonmusic" },
              { id: "ig", service: "INSTAGRAM", username: "jeldonmusic" },
              { id: "tw", service: "TWITTER", username: "jeldonmusic" },
              { id: "sc", service: "SOUNDCLOUD", username: "jeldonmusic" },
            ],
          },
        },
      },
    }

    // Hero banner data
    const { getDemoBlogPosts } = require("../utils/fallback-data")
    const heroBannerData = {
      data: {
        allWpPost: { nodes: getDemoBlogPosts(5) },
        allWpVideo: {
          nodes: [
            {
              id: "video-1",
              title: "Beat Making Tutorial",
              excerpt:
                "<p>Learn how to create beats with industry standard tools</p>",
              slug: "beat-making-tutorial",
              date: "2025-06-10",
              videoDetails: {
                youtubeVideoId: "dQw4w9WgXcQ",
                videoViews: "12345",
              },
              featuredImage: {
                node: {
                  altText: "Beat Making",
                  localFile: {
                    childImageSharp: {
                      gatsbyImageData: {},
                    },
                  },
                },
              },
            },
            {
              id: "video-2",
              title: "Mixing Vocals",
              excerpt: "<p>Professional vocal mixing techniques</p>",
              slug: "mixing-vocals",
              date: "2025-05-20",
              videoDetails: {
                youtubeVideoId: "dQw4w9WgXcQ",
                videoViews: "5432",
              },
              featuredImage: {
                node: {
                  altText: "Vocal Mixing",
                  localFile: {
                    childImageSharp: {
                      gatsbyImageData: {},
                    },
                  },
                },
              },
            },
          ],
        },
        allWpBeat: { nodes: [] },
        allWpMix: { nodes: [] },
        allContentfulHomepageHero: {
          nodes: [
            {
              heading: "J. Eldon Music",
              subheading: "Music Producer | Artist | Engineer",
              image: {
                gatsbyImageData: {},
                alt: "J. Eldon Music",
              },
              links: [
                { href: "/music", text: "Explore Music" },
                { href: "/videos", text: "Watch Videos" },
              ],
            },
          ],
        },
      },
    }

    // Mock data for related posts
    const relatedPostsData = {
      data: {
        allWpPost: {
          nodes: getDemoBlogPosts(10), // Use the same helper function to get mock blog posts
        },
      },
    }

    // Write the mock data files
    fs.writeFileSync(
      path.join(dataPath, "860043902.json"),
      JSON.stringify(headerData)
    )
    fs.writeFileSync(
      path.join(dataPath, "3235098977.json"),
      JSON.stringify(footerData)
    )
    fs.writeFileSync(
      path.join(dataPath, "3265857146.json"),
      JSON.stringify(heroBannerData)
    )
    fs.writeFileSync(
      path.join(dataPath, "2141841991.json"),
      JSON.stringify(relatedPostsData)
    )

    console.log("📝 Created mock static query data files for bypass mode")
  }
}
