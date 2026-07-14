/**
 * Create Contentful Content Types Programmatically
 *
 * Creates all required content types for the Jeldon Music site:
 * - videoPost, videoCategory, videoTag
 * - blogPost, blogCategory, blogTag
 *
 * Usage:
 *   node ./scripts/create-contentful-content-types.js
 *
 * Required env:
 *   CONTENTFUL_SPACE_ID
 *   CONTENTFUL_MANAGEMENT_TOKEN
 *
 * Optional:
 *   CONTENTFUL_ENV (default: "master")
 */

require("dotenv").config()

const SPACE = process.env.CONTENTFUL_SPACE_ID
const TOKEN = process.env.CONTENTFUL_MANAGEMENT_TOKEN
const ENV = process.env.CONTENTFUL_ENV || "master"

if (!SPACE || !TOKEN) {
  console.error("❌ Missing required env vars:")
  console.error("   CONTENTFUL_SPACE_ID")
  console.error("   CONTENTFUL_MANAGEMENT_TOKEN")
  console.error("\nGet your management token from: https://app.contentful.com/developers/access-tokens/")
  process.exit(1)
}

const CMA_BASE = `https://api.contentful.com/spaces/${SPACE}/environments/${ENV}`

const headers = {
  Authorization: `Bearer ${TOKEN}`,
  "Content-Type": "application/vnd.contentful.management.v1+json",
}

async function api(path, method = "GET", body = null, version = null) {
  const options = {
    method,
    headers: { ...headers },
  }

  if (version) {
    options.headers["X-Contentful-Version"] = version
  }

  if (body) {
    options.body = JSON.stringify(body)
  }

  const res = await fetch(`${CMA_BASE}${path}`, options)
  const data = await res.json()

  if (!res.ok) {
    const errorMsg = data.message || data.sys?.id || "Unknown error"
    throw new Error(`${method} ${path} failed (${res.status}): ${errorMsg}`)
  }

  return data
}

async function getContentType(id) {
  try {
    return await api(`/content_types/${id}`)
  } catch (e) {
    if (e.message.includes("404")) {
      return null
    }
    throw e
  }
}

async function createOrUpdateContentType(contentType) {
  const existing = await getContentType(contentType.id)

  if (existing) {
    console.log(`⚠️  Content type '${contentType.id}' already exists - updating...`)

    // Update existing content type
    const updated = await api(
      `/content_types/${contentType.id}`,
      "PUT",
      {
        name: contentType.name,
        description: contentType.description,
        fields: contentType.fields,
        displayField: contentType.fields[0]?.id || "title",
      },
      existing.sys.version
    )

    // Publish
    await api(`/content_types/${contentType.id}/published`, "PUT", null, updated.sys.version)
    console.log(`✓ Updated '${contentType.id}'`)
    return updated
  }

  console.log(`Creating content type: ${contentType.id}...`)

  const ct = await api(
    `/content_types`,
    "POST",
    {
      name: contentType.name,
      description: contentType.description,
      fields: contentType.fields,
      displayField: contentType.fields[0]?.id || "title",
    }
  )

  // Publish
  await api(`/content_types/${ct.sys.id}/published`, "PUT", null, ct.sys.version)
  console.log(`✓ Created and published '${contentType.id}'`)
  return ct
}

// Field builders
const symbolField = (id, name, required = false) => ({
  id,
  name,
  type: "Symbol",
  localized: false,
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
    { unique: true },
    { regexp: { pattern: "^[a-z0-9]+(?:-[a-z0-9]+)*$" } },
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

const integerField = (id, name, required = false) => ({
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
  validations: [{ linkContentType: ["contentfulAsset"] }],
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
    : [{ linkContentType: contentTypes }, { size: { max: 1 } }],
  linkType: "Entry",
})

// Content type definitions
const contentTypes = [
  {
    id: "videoTag",
    name: "Video Tag",
    description: "Tag for organizing videos",
    fields: [
      symbolField("name", "Name", true),
      slugField("slug", "Slug", true),
    ],
  },
  {
    id: "videoCategory",
    name: "Video Category",
    description: "Category for organizing videos",
    fields: [
      symbolField("name", "Name", true),
      slugField("slug", "Slug", true),
      textLongField("description", "Description"),
    ],
  },
  {
    id: "videoPost",
    name: "Video Post",
    description: "YouTube video synced from channel uploads",
    fields: [
      symbolField("title", "Title", true),
      slugField("slug", "Slug", true),
      textLongField("excerpt", "Excerpt"),
      richTextField("body", "Description"),
      dateField("publishDate", "Publish Date", true),
      symbolField("author", "Author"),
      symbolField("youtubeVideoId", "YouTube Video ID", true),
      assetLinkField("featuredImage", "Thumbnail"),
      entryLinkField("categories", "Categories", ["videoCategory"], false, true),
      entryLinkField("tags", "Tags", ["videoTag"], false, true),
      symbolField("duration", "Duration"),
      integerField("videoViews", "View Count"),
    ],
  },
  {
    id: "blogTag",
    name: "Blog Tag",
    description: "Tag for organizing blog posts",
    fields: [
      symbolField("name", "Name", true),
      slugField("slug", "Slug", true),
    ],
  },
  {
    id: "blogCategory",
    name: "Blog Category",
    description: "Category for organizing blog posts",
    fields: [
      symbolField("name", "Name", true),
      slugField("slug", "Slug", true),
    ],
  },
  {
    id: "blogPost",
    name: "Blog Post",
    description: "Blog article",
    fields: [
      symbolField("title", "Title", true),
      slugField("slug", "Slug", true),
      textLongField("excerpt", "Excerpt"),
      richTextField("content", "Content"),
      dateField("publishDate", "Publish Date", true),
      symbolField("author", "Author"),
      assetLinkField("featuredImage", "Featured Image"),
      entryLinkField("categories", "Categories", ["blogCategory"], false, true),
      entryLinkField("tags", "Tags", ["blogTag"], false, true),
      symbolField("seoTitle", "SEO Title"),
      textLongField("seoDescription", "SEO Description"),
    ],
  },
]

async function main() {
  console.log("🚀 Creating Contentful content types...\n")
  console.log(`Space: ${SPACE}`)
  console.log(`Environment: ${ENV}\n`)

  // Validate token first
  try {
    await api(``)
    console.log("✓ Connected to Contentful space\n")
  } catch (e) {
    console.error("❌ Failed to connect to Contentful:")
    console.error(`   ${e.message}`)
    console.error("\n💡 Check your CONTENTFUL_MANAGEMENT_TOKEN")
    console.error("   Get a new one at: https://app.contentful.com/developers/access-tokens/")
    process.exit(1)
  }

  // Create content types in dependency order
  for (const ct of contentTypes) {
    try {
      await createOrUpdateContentType(ct)
    } catch (e) {
      console.error(`\n❌ Failed to create '${ct.id}': ${e.message}`)
      console.error("   Continuing with next content type...\n")
    }
  }

  console.log("\n✅ Content type creation complete!")
  console.log("\n📝 Next steps:")
  console.log("   1. Verify content types in Contentful UI")
  console.log("   2. Run YouTube sync: node ./scripts/sync-youtube-to-videos.js")
  console.log("   3. Build site: yarn clean && yarn build")
  console.log("")
}

main().catch(e => {
  console.error("\n❌ Unexpected error:", e.message)
  process.exit(1)
})
