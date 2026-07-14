/**
 * Setup Video Content Model in Contentful
 *
 * Creates the required content types for the video sync system:
 * - videoPost
 * - videoCategory
 * - videoTag
 *
 * Also creates blogPost, blogCategory, blogTag if they don't exist.
 *
 * Usage:
 *   node ./scripts/setup-video-content-model.js
 *
 * Required env:
 *   CONTENTFUL_SPACE_ID
 *   CONTENTFUL_MANAGEMENT_TOKEN
 */

require("dotenv").config()

const SPACE = process.env.CONTENTFUL_SPACE_ID
const TOKEN = process.env.CONTENTFUL_MANAGEMENT_TOKEN
const ENV = process.env.CONTENTFUL_ENV || "master"

if (!SPACE || !TOKEN) {
  console.error("❌ Missing required env vars:")
  console.error("   CONTENTFUL_SPACE_ID")
  console.error("   CONTENTFUL_MANAGEMENT_TOKEN")
  process.exit(1)
}

const CMA = `https://api.contentful.com/spaces/${SPACE}/environments/${ENV}`
const headers = {
  Authorization: `Bearer ${TOKEN}`,
  "Content-Type": "application/vnd.contentful.management.v1+json",
}

async function cma(path, method = "GET", body = null) {
  const options = {
    method,
    headers,
  }
  if (body) {
    options.body = JSON.stringify(body)
  }
  const res = await fetch(`${CMA}${path}`, options)
  const data = await res.json()
  if (!res.ok) {
    throw new Error(`API call failed (${res.status}): ${JSON.stringify(data)}`)
  }
  return data
}

async function getContentType(id) {
  try {
    return await cma(`/content_types/${id}`)
  } catch (e) {
    if (e.message.includes("404")) {
      return null
    }
    throw e
  }
}

async function createContentType(id, name, description, fields) {
  const existing = await getContentType(id)
  if (existing) {
    console.log(`✓ Content type '${id}' already exists`)
    return existing
  }

  console.log(`Creating content type: ${id}...`)

  const ct = await cma(`/content_types`, "POST", {
    name,
    description,
    fields,
  })

  // Publish the content type
  const published = await cma(`/content_types/${id}/published`, "PUT", null, ct.sys.version)
  console.log(`✓ Created and published '${id}'`)
  return published
}

// Field builders
const textField = (id, name, required = false, localized = false) => ({
  id,
  name,
  type: "Symbol",
  localized,
  required,
  disabled: false,
  omitted: false,
})

const slugField = (id, name, required = false) => ({
  id,
  name,
  type: "Symbol",
  localized: false,
  required,
  disabled: false,
  omitted: false,
  validations: [
    {
      unique: true,
    },
    {
      regexp: {
        pattern: "^[a-z0-9]+(?:-[a-z0-9]+)*$",
      },
    },
  ],
})

const textLongField = (id, name, required = false) => ({
  id,
  name,
  type: "Text",
  localized: false,
  required,
  disabled: false,
  omitted: false,
})

const richTextField = (id, name, required = false) => ({
  id,
  name,
  type: "RichText",
  localized: false,
  required,
  disabled: false,
  omitted: false,
  validations: [
    {
      enabledMarks: ["bold", "italic", "underline", "code", "superscript", "subscript"],
      message: "Only bold, italic, underline, code, superscript, and subscript marks are allowed",
    },
    {
      enabledNodeTypes: [
        "heading-1",
        "heading-2",
        "heading-3",
        "heading-4",
        "heading-5",
        "heading-6",
        "ordered-list",
        "unordered-list",
        "hr",
        "blockquote",
        "embedded-entry-block",
        "embedded-asset-block",
        "table",
        "hyperlink",
        "entry-hyperlink",
        "asset-hyperlink",
        "embedded-entry-inline",
      ],
      message: "Only specific node types are allowed",
    },
  ],
})

const dateField = (id, name, required = false) => ({
  id,
  name,
  type: "Date",
  localized: false,
  required,
  disabled: false,
  omitted: false,
})

const numberField = (id, name, required = false) => ({
  id,
  name,
  type: "Integer",
  localized: false,
  required,
  disabled: false,
  omitted: false,
})

const assetLinkField = (id, name, required = false) => ({
  id,
  name,
  type: "Link",
  localized: false,
  required,
  disabled: false,
  omitted: false,
  validations: [
    {
      linkContentType: ["contentfulAsset"],
    },
  ],
  linkType: "Asset",
})

const entryLinkField = (id, name, contentTypes, required = false, multiple = false) => ({
  id,
  name,
  type: "Link",
  localized: false,
  required,
  disabled: false,
  omitted: false,
  validations: multiple
    ? [{ linkContentType: contentTypes }]
    : [
        { linkContentType: contentTypes },
        { size: { max: 1 } },
      ],
  linkType: "Entry",
})

// Content type definitions
const videoPostType = {
  id: "videoPost",
  name: "Video Post",
  description: "YouTube video synced from channel uploads",
  fields: [
    textField("title", "Title", true),
    slugField("slug", "Slug", true),
    textLongField("excerpt", "Excerpt"),
    richTextField("body", "Description"),
    dateField("publishDate", "Publish Date", true),
    textField("author", "Author"),
    textField("youtubeVideoId", "YouTube Video ID", true),
    assetLinkField("featuredImage", "Thumbnail"),
    entryLinkField("categories", "Categories", ["videoCategory"], false, true),
    entryLinkField("tags", "Tags", ["videoTag"], false, true),
    textField("duration", "Duration"),
    numberField("videoViews", "View Count"),
  ],
}

const videoCategoryType = {
  id: "videoCategory",
  name: "Video Category",
  description: "Category for organizing videos",
  fields: [
    textField("name", "Name", true),
    slugField("slug", "Slug", true),
    textLongField("description", "Description"),
  ],
}

const videoTagType = {
  id: "videoTag",
  name: "Video Tag",
  description: "Tag for organizing videos",
  fields: [
    textField("name", "Name", true),
    slugField("slug", "Slug", true),
  ],
}

const blogPostType = {
  id: "blogPost",
  name: "Blog Post",
  description: "Blog article",
  fields: [
    textField("title", "Title", true),
    slugField("slug", "Slug", true),
    textLongField("excerpt", "Excerpt"),
    richTextField("content", "Content"),
    dateField("publishDate", "Publish Date", true),
    textField("author", "Author"),
    assetLinkField("featuredImage", "Featured Image"),
    entryLinkField("categories", "Categories", ["blogCategory"], false, true),
    entryLinkField("tags", "Tags", ["blogTag"], false, true),
    textField("seoTitle", "SEO Title"),
    textLongField("seoDescription", "SEO Description"),
  ],
}

const blogCategoryType = {
  id: "blogCategory",
  name: "Blog Category",
  description: "Category for organizing blog posts",
  fields: [
    textField("name", "Name", true),
    slugField("slug", "Slug", true),
  ],
}

const blogTagType = {
  id: "blogTag",
  name: "Blog Tag",
  description: "Tag for organizing blog posts",
  fields: [
    textField("name", "Name", true),
    slugField("slug", "Slug", true),
  ],
}

async function main() {
  console.log("🚀 Setting up Contentful content types...\n")
  console.log(`Space: ${SPACE}`)
  console.log(`Environment: ${ENV}\n`)

  try {
    // Create video content types
    await createContentType(
      videoCategoryType.id,
      videoCategoryType.name,
      videoCategoryType.description,
      videoCategoryType.fields
    )

    await createContentType(
      videoTagType.id,
      videoTagType.name,
      videoTagType.description,
      videoTagType.fields
    )

    await createContentType(
      videoPostType.id,
      videoPostType.name,
      videoPostType.description,
      videoPostType.fields
    )

    // Create blog content types (if needed)
    await createContentType(
      blogCategoryType.id,
      blogCategoryType.name,
      blogCategoryType.description,
      blogCategoryType.fields
    )

    await createContentType(
      blogTagType.id,
      blogTagType.name,
      blogTagType.description,
      blogTagType.fields
    )

    await createContentType(
      blogPostType.id,
      blogPostType.name,
      blogPostType.description,
      blogPostType.fields
    )

    console.log("\n✅ All content types created successfully!")
    console.log("\n📝 Next steps:")
    console.log("   1. Run the YouTube sync: node ./scripts/sync-youtube-to-videos.js")
    console.log("   2. Build the site: yarn clean && yarn build")
    console.log("   3. Visit /videos/ to see your video archive\n")
  } catch (error) {
    console.error("\n❌ Setup failed:", error.message)
    process.exit(1)
  }
}

main()
