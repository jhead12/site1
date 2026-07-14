/**
 * Provision the Contentful content model for the blog migration.
 *
 * Creates (idempotently) three content types in the configured Contentful
 * space/environment:
 *   - blogCategory  (name, slug)
 *   - blogTag       (name, slug)
 *   - blogPost      (title, slug, excerpt, body[RichText], publishDate,
 *                    author, featuredImage[Asset], categories[], tags[],
 *                    seoTitle, seoDescription, youtubeVideoId)
 *
 * The `body` field id MUST stay "body" — src/gatsby/schema.js exposes it as
 * `content` via the @richText extension, which reads source.body.raw.
 *
 * Uses the Contentful Management REST API directly (node-fetch) so no new
 * dependency is required. Run:
 *   CONTENTFUL_MANAGEMENT_TOKEN=... CONTENTFUL_SPACE_ID=... \
 *     node ./scripts/setup-blog-content-model.js
 */
require("dotenv").config()
const fetch = require("node-fetch")

const SPACE = process.env.CONTENTFUL_SPACE_ID
const ENV = process.env.CONTENTFUL_ENV || "master"
const TOKEN = process.env.CONTENTFUL_MANAGEMENT_TOKEN
const BASE = `https://api.contentful.com/spaces/${SPACE}/environments/${ENV}`

if (!SPACE || !TOKEN) {
  console.error(
    "❌ Missing CONTENTFUL_SPACE_ID or CONTENTFUL_MANAGEMENT_TOKEN.\n" +
      "   Set them in your .env (or export inline) and re-run."
  )
  process.exit(1)
}

const headers = {
  Authorization: `Bearer ${TOKEN}`,
  "Content-Type": "application/vnd.contentful.management.v1+json",
}

const blogCategory = {
  sys: { id: "blogCategory" },
  name: "Blog Category",
  displayField: "name",
  description: "A category used to group blog posts (e.g. Tutorials, Production).",
  fields: [
    { id: "name", name: "Name", type: "Symbol", required: true },
    {
      id: "slug",
      name: "Slug",
      type: "Symbol",
      required: true,
      validations: [{ regexp: { pattern: "^[a-z0-9-]+$", flags: "" } }],
    },
  ],
}

const blogTag = {
  sys: { id: "blogTag" },
  name: "Blog Tag",
  displayField: "name",
  description: "A free-form tag for blog posts.",
  fields: [
    { id: "name", name: "Name", type: "Symbol", required: true },
    {
      id: "slug",
      name: "Slug",
      type: "Symbol",
      required: true,
      validations: [{ regexp: { pattern: "^[a-z0-9-]+$", flags: "" } }],
    },
  ],
}

const blogPost = {
  sys: { id: "blogPost" },
  name: "Blog Post",
  displayField: "title",
  description: "A blog post. Replaces the WordPress post content type.",
  fields: [
    { id: "title", name: "Title", type: "Symbol", required: true },
    {
      id: "slug",
      name: "Slug",
      type: "Symbol",
      required: true,
      validations: [{ regexp: { pattern: "^[a-z0-9-]+$", flags: "" } }],
    },
    { id: "excerpt", name: "Excerpt", type: "Text", required: false },
    {
      id: "body",
      name: "Body",
      type: "RichText",
      required: true,
      // Matches the @richText extension in src/gatsby/schema.js which reads
      // source.body.raw and renders it to HTML via documentToHtmlString.
    },
    { id: "publishDate", name: "Publish Date", type: "Date", required: false },
    { id: "author", name: "Author", type: "Symbol", required: false },
    {
      id: "featuredImage",
      name: "Featured Image",
      type: "Link",
      linkType: "Asset",
      required: false,
    },
    {
      id: "categories",
      name: "Categories",
      type: "Array",
      required: false,
      items: {
        type: "Link",
        linkType: "Entry",
        validations: [{ linkContentType: ["blogCategory"] }],
      },
    },
    {
      id: "tags",
      name: "Tags",
      type: "Array",
      required: false,
      items: {
        type: "Link",
        linkType: "Entry",
        validations: [{ linkContentType: ["blogTag"] }],
      },
    },
    { id: "seoTitle", name: "SEO Title", type: "Symbol", required: false },
    { id: "seoDescription", name: "SEO Description", type: "Text", required: false },
    {
      id: "youtubeVideoId",
      name: "YouTube Video ID",
      type: "Symbol",
      required: false,
      description:
        "Unique key used by the YouTube→Contentful auto-sync script to upsert entries.",
    },
  ],
}

async function ensureContentType(def) {
  const id = def.sys.id
  // Does it already exist?
  const getRes = await fetch(`${BASE}/content_types/${id}`, {
    headers: { Authorization: `Bearer ${TOKEN}` },
  })
  if (getRes.status === 200) {
    const existing = await getRes.json()
    if (existing.sys.type === "ContentType" && !existing.sys.isPublished) {
      await publish(id, existing.sys.version)
    }
    console.log(`✓ ${def.name} (${id}) already exists`)
    return
  }
  if (getRes.status !== 404) {
    const err = await getRes.text()
    throw new Error(`Unexpected GET ${id} status ${getRes.status}: ${err}`)
  }

  // Create it.
  const putRes = await fetch(`${BASE}/content_types/${id}`, {
    method: "PUT",
    headers,
    body: JSON.stringify(def),
  })
  if (!putRes.ok) {
    const err = await putRes.text()
    throw new Error(`Create ${id} failed (${putRes.status}): ${err}`)
  }
  const created = await putRes.json()
  await publish(id, created.sys.version)
  console.log(`✓ ${def.name} (${id}) created and published`)
}

async function publish(id, version) {
  const res = await fetch(`${BASE}/content_types/${id}/published`, {
    method: "PUT",
    headers: { ...headers, "X-Contentful-Version": version },
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Publish ${id} failed (${res.status}): ${err}`)
  }
}

async function main() {
  console.log(`📡 Contentful space: ${SPACE}  env: ${ENV}`)
  // Order matters: blogCategory/blogTag must exist before blogPost references them.
  for (const def of [blogCategory, blogTag, blogPost]) {
    await ensureContentType(def)
  }
  console.log("\n✅ Blog content model ready.")
  console.log("   Next: create Blog Category entries, then Blog Post entries in Contentful.")
}

main().catch((e) => {
  console.error("\n❌ Provisioning failed:", e.message)
  process.exit(1)
})