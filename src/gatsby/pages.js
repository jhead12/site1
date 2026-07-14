exports.createPages = async ({ graphql, actions }) => {
  const { createPage, createSlice } = actions

  // Always create header/footer slices — they are needed in every mode
  // (including BYPASS_WORDPRESS) since layout.js references <Slice alias="header" />
  // and <Slice alias="footer" /> on every page.
  createSlice({
    id: "header",
    component: require.resolve("../components/header.js"),
  })

  createSlice({
    id: "footer",
    component: require.resolve("../components/footer.js"),
  })

  // Fetch Contentful data (always needed for blog posts and video posts)
  let result
  try {
    result = await graphql(`
      {
        # Blog posts live in Contentful
        allContentfulBlogPost(sort: { publishDate: DESC }) {
          nodes {
            id
            slug
            title
          }
        }
        # Video posts live in Contentful
        allContentfulVideoPost(sort: { publishDate: DESC }) {
          nodes {
            id
            slug
            title
          }
        }
      }
    `)

    if (result.errors) {
      console.error("GraphQL errors:", result.errors)
      console.warn("Continuing build despite GraphQL errors")
    }
  } catch (error) {
    console.error("Error fetching Contentful data:", error)
    console.warn("Continuing build despite fetch error")
    result = { data: {} }
  }

  const posts = result.data?.allContentfulBlogPost?.nodes || []
  const videoPosts = result.data?.allContentfulVideoPost?.nodes || []

  console.log(`Creating ${posts.length} blog post pages`)
  console.log(`Creating ${videoPosts.length} Contentful video post pages`)

  // Create Blog post pages with next/previous navigation
  posts.forEach((post, index) => {
    console.log(`Creating blog post page: /blog/${post.slug}/`)
    const previousPost = index === 0 ? null : posts[index - 1]
    const nextPost = index === posts.length - 1 ? null : posts[index + 1]

    createPage({
      path: `/blog/${post.slug}/`,
      component: require.resolve("../templates/blog-post.js"),
      context: {
        id: post.id,
        slug: post.slug,
        previousPost: previousPost
          ? {
              slug: previousPost.slug,
              title: previousPost.title,
            }
          : null,
        nextPost: nextPost
          ? {
              slug: nextPost.slug,
              title: nextPost.title,
            }
          : null,
      },
    })
  })

  // Create Contentful VideoPost pages with next/previous navigation
  videoPosts.forEach((video, index) => {
    console.log(`Creating Contentful video post page: /videos/${video.slug}/`)
    const previousVideo = index === 0 ? null : videoPosts[index - 1]
    const nextVideo = index === videoPosts.length - 1 ? null : videoPosts[index + 1]

    createPage({
      path: `/videos/${video.slug}/`,
      component: require.resolve("../templates/video-post.js"),
      context: {
        id: video.id,
        slug: video.slug,
        previousVideo: previousVideo
          ? {
              slug: previousVideo.slug,
              title: previousVideo.title,
            }
          : null,
        nextVideo: nextVideo
          ? {
              slug: nextVideo.slug,
              title: nextVideo.title,
            }
          : null,
      },
    })
  })

  // Skip WordPress page creation if BYPASS_WORDPRESS is true
  if (process.env.BYPASS_WORDPRESS === "true") {
    console.log(
      "WordPress data fetch bypassed by BYPASS_WORDPRESS environment variable"
    )
    return
  }

  // Fetch WordPress data
  let wpResult
  try {
    wpResult = await graphql(`
      {
        allWpPage {
          nodes {
            id
            slug
            title
            content
          }
        }
        allWpBeat {
          nodes {
            id
            slug
            title
          }
        }
        allWpTutorial {
          nodes {
            id
            slug
            title
          }
        }
        allWpMix {
          nodes {
            id
            slug
            title
          }
        }
        allWpVideo {
          nodes {
            id
            slug
            title
          }
        }
      }
    `)

    if (wpResult.errors) {
      console.error("GraphQL errors:", wpResult.errors)
      console.warn("Continuing build despite GraphQL errors")
    }
  } catch (error) {
    console.error("Error fetching WordPress data:", error)
    console.warn("Continuing build despite fetch error")
    wpResult = { data: {} }
  }

  // Safely access WordPress data with fallbacks
  const pages = wpResult.data?.allWpPage?.nodes || []
  const beats = wpResult.data?.allWpBeat?.nodes || []
  const tutorials = wpResult.data?.allWpTutorial?.nodes || []
  const mixes = wpResult.data?.allWpMix?.nodes || []
  const videos = wpResult.data?.allWpVideo?.nodes || []

  // Debug logging
  console.log(`Creating ${pages.length} WordPress pages`)
  console.log(`Creating ${beats.length} beats`)
  console.log(`Creating ${tutorials.length} tutorials`)
  console.log(`Creating ${mixes.length} mixes`)
  console.log(`Creating ${videos.length} WordPress videos`)

  // Create WordPress pages
  pages.forEach((page) => {
    createPage({
      path: `/${page.slug}/`,
      component: require.resolve("../templates/wp-page.js"),
      context: {
        id: page.id,
        slug: page.slug,
      },
    })
  })

  // Create Beat pages
  beats.forEach((beat) => {
    createPage({
      path: `/beats/${beat.slug}/`,
      component: require.resolve("../templates/beat.tsx"),
      context: {
        id: beat.id,
        slug: beat.slug,
      },
    })
  })

  // Create Tutorial pages
  tutorials.forEach((tutorial) => {
    createPage({
      path: `/tutorials/${tutorial.slug}/`,
      component: require.resolve("../templates/tutorial.tsx"),
      context: {
        id: tutorial.id,
        slug: tutorial.slug,
      },
    })
  })

  // Create Mix pages
  mixes.forEach((mix) => {
    createPage({
      path: `/mixes/${mix.slug}/`,
      component: require.resolve("../templates/mix.tsx"),
      context: {
        id: mix.id,
        slug: mix.slug,
      },
    })
  })

  // Create Video pages with next/previous navigation (WordPress videos - legacy)
  videos.forEach((video, index) => {
    console.log(`Creating WordPress video page: /videos/${video.slug}/`)
    const previousVideo = index === 0 ? null : videos[index - 1]
    const nextVideo = index === videos.length - 1 ? null : videos[index + 1]

    createPage({
      path: `/videos/${video.slug}/`,
      component: require.resolve("../templates/video.js"),
      context: {
        id: video.id,
        slug: video.slug,
        previousVideo: previousVideo
          ? {
              slug: previousVideo.slug,
              title: previousVideo.title,
            }
          : null,
        nextVideo: nextVideo
          ? {
              slug: nextVideo.slug,
              title: nextVideo.title,
            }
          : null,
      },
    })
  })

  // Slices (header/footer) are created at the top of createPages
  // so they exist in both WordPress and bypass modes.
}

