/**
 * Update videoPost Content Type
 *
 * Changes the thumbnail field from Symbol (text) to Link (Asset)
 * so we can store actual image uploads instead of URLs.
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
  console.log("Updating videoPost content type...\n")

  // Get current content type
  const ct = await api(`/content_types/videoPost`)
  console.log(`Current version: ${ct.sys.version}`)
  console.log(`Current fields: ${ct.fields.map(f => `${f.id} (${f.type})`).join(", ")}\n`)

  // Check if featuredImage field already exists
  const hasFeaturedImage = ct.fields.some(f => f.id === "featuredImage")

  if (hasFeaturedImage) {
    console.log("✓ featuredImage field already exists")
    return
  }

  console.log("Adding new featuredImage field...")
  ct.fields.push({
    id: "featuredImage",
    name: "Featured Image",
    type: "Link",
    localized: false,
    required: false,
    disabled: false,
    omitted: false,
    linkType: "Asset",
  })

  // Update content type
  const updated = await api(
    `/content_types/videoPost`,
    "PUT",
    {
      name: ct.name,
      description: ct.description,
      fields: ct.fields,
      displayField: "title",
    },
    ct.sys.version
  )

  console.log(`✓ Updated content type (version: ${updated.sys.version})`)

  // Publish
  await api(`/content_types/videoPost/published`, "PUT", null, updated.sys.version)
  console.log("✓ Published videoPost content type")

  console.log("\n✅ Done! The videoPost model now supports Asset images.")
  console.log("\n📝 Next steps:")
  console.log("   1. Re-run the sync: node ./scripts/sync-youtube-to-videos.js")
  console.log("   2. Build the site: yarn clean && yarn build")
}

main().catch(e => {
  console.error("❌ Error:", e.message)
  console.error("\nDetails:", e)
  process.exit(1)
})
