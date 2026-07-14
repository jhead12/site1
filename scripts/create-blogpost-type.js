/**
 * Create blogPost Content Type with correct fields
 */

require("dotenv").config()

const SPACE = process.env.CONTENTFUL_SPACE_ID
const TOKEN = process.env.CONTENTFUL_MANAGEMENT_TOKEN
const ENV = process.env.CONTENTFUL_ENV || "master"

const CMA_BASE = `https://api.contentful.com/spaces/${SPACE}/environments/${ENV}`

const headers = {
  Authorization: `Bearer ${TOKEN}`,
  "Content-Type": "application/vnd.contentful.management.v1+json",
}

async function api(path, method = "GET", body = null, version = null) {
  const options = { method, headers: { ...headers } }
  if (version) options.headers["X-Contentful-Version"] = version
  if (body) options.body = JSON.stringify(body)

  const res = await fetch(`${CMA_BASE}${path}`, options)
  const data = await res.json()
  if (!res.ok) throw new Error(`${method} ${path} failed (${res.status}): ${data.message || "Unknown error"}`)
  return data
}

async function main() {
  console.log("Creating blogPost content type with proper fields...\n")

  // Check if blogPost already exists
  try {
    const existing = await api(`/content_types/blogPost`)
    console.log("✓ blogPost content type already exists")
    console.log(`   ID: ${existing.sys.id}`)
    console.log(`   Name: ${existing.name}`)
    console.log(`   Fields: ${existing.fields.map(f => f.id).join(", ")}`)

    // Check if already published
    if (existing.sys.publishedVersion !== undefined) {
      console.log("✓ Already published")
      return
    }
  } catch (e) {
    if (!e.message.includes("404")) {
      console.log("Note: blogPost doesn't exist yet, will create it")
    }
  }

  // Create blogPost with proper fields
  console.log("Creating blogPost content type...")
  const ct = await api(`/content_types`, "POST", {
    name: "Blog Post",
    description: "Blog article for the website",
    displayField: "title",
    fields: [
      { id: "title", name: "Title", type: "Symbol", required: true },
      { id: "slug", name: "Slug", type: "Symbol", required: true, validations: [{ unique: true }] },
      { id: "excerpt", name: "Excerpt", type: "Text" },
      { id: "content", name: "Content", type: "RichText" },
      { id: "publishDate", name: "Publish Date", type: "Date", required: true },
      { id: "author", name: "Author", type: "Symbol" },
      { id: "featuredImage", name: "Featured Image", type: "Link", linkType: "Asset" },
      {
        id: "categories",
        name: "Categories",
        type: "Array",
        items: { type: "Link", linkType: "Entry", validations: [{ linkContentType: ["3JaTjreFT5xvXRBvlhNxfF"] }] }
      },
      {
        id: "tags",
        name: "Tags",
        type: "Array",
        items: { type: "Link", linkType: "Entry", validations: [{ linkContentType: ["3MLj3DuEhUcU6tT73rVD4"] }] }
      },
      { id: "seoTitle", name: "SEO Title", type: "Symbol" },
      { id: "seoDescription", name: "SEO Description", type: "Text" },
    ],
  })

  const ctId = ct.sys.id
  console.log(`✓ Created blogPost (ID: ${ctId})`)

  // Publish using the actual ID returned
  try {
    await api(`/content_types/${ctId}/published`, "PUT", null, ct.sys.version)
    console.log("✓ Published blogPost")
  } catch (e) {
    // Try getting fresh version and publishing
    console.log("Refreshing content type version...")
    const fresh = await api(`/content_types/${ctId}`)
    await api(`/content_types/${ctId}/published`, "PUT", null, fresh.sys.version)
    console.log("✓ Published blogPost")
  }

  console.log("\n✅ Done! blogPost content type is ready.")
  console.log("\n📝 Next steps:")
  console.log("   1. Run: yarn clean && yarn develop")
  console.log("   2. Visit http://localhost:8000/blog/ to see blog posts")
}

main().catch(e => {
  console.error("❌ Error:", e.message)
  console.error("\nStack:", e.stack)
  process.exit(1)
})
