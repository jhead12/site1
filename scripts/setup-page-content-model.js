/**
 * Provision the Contentful content model for generic CMS pages (About, etc.).
 *
 * Creates (idempotently) one content type in the configured Contentful
 * space/environment:
 *   - page  (title, slug, description, body[RichText], image[Asset])
 *
 * The `body` field id MUST stay "body" — src/gatsby/schema.js exposes it as
 * `html` via the @richText extension, which reads source.body.raw.
 *
 * Uses the Contentful Management REST API directly (node-fetch) so no new
 * dependency is required. Run:
 *   CONTENTFUL_MANAGEMENT_TOKEN=... CONTENTFUL_SPACE_ID=... \
 *     node ./scripts/setup-page-content-model.js
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

const page = {
  sys: { id: "page" },
  name: "Page",
  displayField: "title",
  description: "A generic CMS page (e.g. About, Terms, Privacy).",
  fields: [
    { id: "title", name: "Title", type: "Symbol", required: true },
    {
      id: "slug",
      name: "Slug",
      type: "Symbol",
      required: true,
      validations: [{ regexp: { pattern: "^[a-z0-9-]+$", flags: "" } }],
    },
    { id: "description", name: "Description", type: "Text", required: false },
    {
      id: "body",
      name: "Body",
      type: "RichText",
      required: true,
      // Matches the @richText extension in src/gatsby/schema.js which reads
      // source.body.raw and renders it to HTML via documentToHtmlString.
    },
    {
      id: "image",
      name: "Image",
      type: "Link",
      linkType: "Asset",
      required: false,
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
  await ensureContentType(page)
  console.log("\n✅ Page content model ready.")
  console.log(
    "   Next: create a `page` entry with slug `about` in Contentful and publish it."
  )
}

main().catch((e) => {
  console.error("\n❌ Provisioning failed:", e.message)
  process.exit(1)
})