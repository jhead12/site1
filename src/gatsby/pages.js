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

  // Skip WordPress page creation if BYPASS_WORDPRESS is true
  if (process.env.BYPASS_WORDPRESS === "true") {
    console.log(
      "WordPress data fetch bypassed by BYPASS_WORDPRESS environment variable"
    )
    return
  }

  // Create WordPress pages
  let result
  try {
    result = await graphql(`
      {
        allWpPage {
          nodes {
            id
            slug
            title
            content
          }
        }
        allWpPost {
          nodes {
            id
            slug
            title
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

    if (result.errors) {
      console.error("GraphQL errors:", result.errors)
      console.warn("Continuing build despite GraphQL errors")
    }
  } catch (error) {
    console.error("Error fetching WordPress data:", error)
    console.warn("Continuing build despite fetch error")
    // Create empty result object to allow the build to continue
    result = { data: {} }
  }

  // Safely access data with fallbacks
  const pages = result.data?.allWpPage?.nodes || []
  const posts = result.data?.allWpPost?.nodes || []
  const beats = result.data?.allWpBeat?.nodes || []
  const tutorials = result.data?.allWpTutorial?.nodes || []
  const mixes = result.data?.allWpMix?.nodes || []
  const videos = result.data?.allWpVideo?.nodes || []

  // Debug logging
  console.log(`Creating ${pages.length} WordPress pages`)
  console.log(`Creating ${posts.length} blog posts`)
  console.log(`Creating ${beats.length} beats`)
  console.log(`Creating ${tutorials.length} tutorials`)
  console.log(`Creating ${mixes.length} mixes`)
  console.log(`Creating ${videos.length} videos`)

  // Check for WordPress connection
  if (posts.length === 0) {
    console.warn(
      "⚠️  No WordPress posts found. Check WordPress connection at:",
      process.env.WPGRAPHQL_URL
    )
  }

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

  // Create Video pages with next/previous navigation
  videos.forEach((video, index) => {
    console.log(`Creating video page: /videos/${video.slug}/`)
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

