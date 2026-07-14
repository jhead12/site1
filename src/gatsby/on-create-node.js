exports.onCreateNode = ({ node, actions }) => {
  const { createNodeField } = actions

  // Only process SitePage nodes
  if (node.internal.type === "SitePage") {
    // Extract slug from path (remove leading and trailing slashes)
    const slug = node.path.replace(/^\/|\/$/g, "")

    // Add slug as a field on the node
    createNodeField({
      node,
      name: "slug",
      value: slug || "home", // Default to 'home' for the root path
    })
  }
}

