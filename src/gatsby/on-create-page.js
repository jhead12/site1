exports.onCreatePage = ({ page, actions }) => {
  const { createPage, deletePage } = actions

  // Only apply these changes in bypass mode
  if (process.env.BYPASS_WORDPRESS === "true") {
    // Skip if the page is already marked as client-only
    if (
      page.mode === "SSR" &&
      page.path.match(/^\/(music|videos|blog|beats|mixes)/)
    ) {
      deletePage(page)
      createPage({
        ...page,
        mode: "SSG", // Switch to static site generation mode
      })
    }
  }
}

