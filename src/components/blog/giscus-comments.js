import React, { useEffect, useRef } from "react"
import { Box, Heading, Text, Space } from "../ui"

/**
 * Giscus comments — GitHub Discussions-backed comments.
 *
 * Configured via GATSBY_GISCUS_* env vars (set up at https://giscus.app):
 *   GATSBY_GISCUS_REPO            e.g. "jeldonmusic/jeldonmusic_com"
 *   GATSBY_GISCUS_REPO_ID
 *   GATSBY_GISCUS_CATEGORY        e.g. "Announcements"
 *   GATSBY_GISCUS_CATEGORY_ID
 *   GATSBY_GISCUS_MAPPING         default "pathname"
 *   GATSBY_GISCUS_THEME           default "dark_dimmed"
 *
 * Until those are set, a placeholder is rendered so the build never breaks.
 */
const GiscusComments = () => {
  const ref = useRef(null)
  const {
    GATSBY_GISCUS_REPO,
    GATSBY_GISCUS_REPO_ID,
    GATSBY_GISCUS_CATEGORY,
    GATSBY_GISCUS_CATEGORY_ID,
  } = process.env

  const configured =
    GATSBY_GISCUS_REPO &&
    GATSBY_GISCUS_REPO_ID &&
    GATSBY_GISCUS_CATEGORY &&
    GATSBY_GISCUS_CATEGORY_ID

  useEffect(() => {
    if (!configured || !ref.current) return
    // Clear any previous mount (e.g. on route change)
    ref.current.innerHTML = ""

    const script = document.createElement("script")
    script.src = "https://giscus.app/client.js"
    script.setAttribute("data-repo", GATSBY_GISCUS_REPO)
    script.setAttribute("data-repo-id", GATSBY_GISCUS_REPO_ID)
    script.setAttribute("data-category", GATSBY_GISCUS_CATEGORY)
    script.setAttribute("data-category-id", GATSBY_GISCUS_CATEGORY_ID)
    script.setAttribute("data-mapping", process.env.GATSBY_GISCUS_MAPPING || "pathname")
    script.setAttribute("data-strict", "0")
    script.setAttribute("data-reactions-enabled", "1")
    script.setAttribute("data-emit-metadata", "0")
    script.setAttribute("data-input-position", "top")
    script.setAttribute("data-theme", process.env.GATSBY_GISCUS_THEME || "dark_dimmed")
    script.setAttribute("data-lang", "en")
    script.setAttribute("data-loading", "lazy")
    script.setAttribute("crossorigin", "anonymous")
    script.async = true

    ref.current.appendChild(script)
  }, [
    configured,
    GATSBY_GISCUS_REPO,
    GATSBY_GISCUS_REPO_ID,
    GATSBY_GISCUS_CATEGORY,
    GATSBY_GISCUS_CATEGORY_ID,
  ])

  return (
    <Box marginY={5}>
      <Heading as="h3">Comments</Heading>
      <Space size={3} />
      {configured ? (
        <div className="giscus" ref={ref} />
      ) : (
        <Box
          paddingY={4}
          style={{
            border: "1px solid #ddd",
            borderRadius: "8px",
            backgroundColor: "#f9f9f9",
            padding: "1rem",
          }}
        >
          <Text>
            Comments are powered by Giscus (GitHub Discussions). Configure the{" "}
            <code>GATSBY_GISCUS_*</code> environment variables to enable them —
            see <code>docs/BLOG_CONTENTFUL_MIGRATION.md</code>.
          </Text>
        </Box>
      )}
    </Box>
  )
}

export default GiscusComments