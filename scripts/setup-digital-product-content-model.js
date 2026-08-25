/**
 * Provision the Contentful content model for downloadable digital products
 * (the S3-delivered ZIPs sold via ThriveCart, e.g. the MPC Wonder Kit).
 *
 * Creates (idempotently) one content type:
 *   - digitalProduct (name, thrivecartProductId, s3Key, fileSizeLabel,
 *                     productTagline, isFree)
 *
 * `thrivecartProductId` must exactly match the numeric product_id ThriveCart
 * sends back in its signed order data. `s3Key` must exactly match the real
 * S3 object key (case-sensitive) in jeldonmusic-s3-bucket.
 *
 * This entry list is synced to S3 by scripts/sync-product-map-to-s3.js,
 * which the Lambda (aws/lambda/presign_lambda.py in the Product repo) reads
 * at request time instead of a hardcoded map — publishing an entry here plus
 * uploading the file to S3 is the entire process for adding a new product.
 *
 * Uses the Contentful Management REST API directly (node-fetch), matching
 * scripts/setup-blog-content-model.js. Run:
 *   CONTENTFUL_MANAGEMENT_TOKEN=... CONTENTFUL_SPACE_ID=... \
 *     node ./scripts/setup-digital-product-content-model.js
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

const digitalProduct = {
  sys: { id: "digitalProduct" },
  name: "Digital Product",
  displayField: "name",
  description:
    "A downloadable digital product delivered via S3 presigned URL after a ThriveCart purchase.",
  fields: [
    { id: "name", name: "Name", type: "Symbol", required: true },
    // Numeric product ID from ThriveCart's product overview page, as a string (e.g. "20").
    { id: "thrivecartProductId", name: "ThriveCart Product ID", type: "Symbol", required: true },
    // Exact, case-sensitive S3 object key in jeldonmusic-s3-bucket, e.g. "Previews/MPC_WonderKit.zip".
    { id: "s3Key", name: "S3 File Key", type: "Symbol", required: true },
    // Human-readable size shown on the download page, e.g. "1.2 GB".
    { id: "fileSizeLabel", name: "File Size Label", type: "Symbol", required: true },
    // Used on the thank-you page as "Your ___ is ready". Defaults to Name if left blank.
    { id: "productTagline", name: "Product Tagline", type: "Symbol", required: false },
    // Cover art / thumbnail for the kit, for use on landing pages.
    { id: "coverImage", name: "Cover Image", type: "Link", linkType: "Asset", required: false },
    // Display price shown on the Products page, e.g. "$27".
    { id: "price", name: "Price", type: "Symbol", required: false },
    {
      id: "isFree",
      name: "Is Free",
      type: "Boolean",
      required: true,
    },
  ],
}

async function ensureContentType(def) {
  const id = def.sys.id
  const getRes = await fetch(`${BASE}/content_types/${id}`, {
    headers: { Authorization: `Bearer ${TOKEN}` },
  })
  if (getRes.status === 200) {
    const existing = await getRes.json()
    const existingFieldIds = new Set(existing.fields.map((f) => f.id))
    const missingFields = def.fields.filter((f) => !existingFieldIds.has(f.id))

    if (missingFields.length === 0) {
      if (!existing.sys.isPublished) {
        await publish(id, existing.sys.version)
      }
      console.log(`✓ ${def.name} (${id}) already up to date`)
      return
    }

    const putRes = await fetch(`${BASE}/content_types/${id}`, {
      method: "PUT",
      headers: { ...headers, "X-Contentful-Version": existing.sys.version },
      body: JSON.stringify({
        name: def.name,
        displayField: def.displayField,
        description: def.description,
        fields: [...existing.fields, ...missingFields],
      }),
    })
    if (!putRes.ok) {
      const err = await putRes.text()
      throw new Error(`Update ${id} failed (${putRes.status}): ${err}`)
    }
    const updated = await putRes.json()
    await publish(id, updated.sys.version)
    console.log(`✓ ${def.name} (${id}) updated - added field(s): ${missingFields.map((f) => f.id).join(", ")}`)
    return
  }
  if (getRes.status !== 404) {
    const err = await getRes.text()
    throw new Error(`Unexpected GET ${id} status ${getRes.status}: ${err}`)
  }

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
  await ensureContentType(digitalProduct)
  console.log("\n✅ Digital product content model ready.")
  console.log(
    "   Next: create a Digital Product entry for MPC Wonder Kit (thrivecartProductId=20,\n" +
      "   s3Key=\"Previews/MPC_WonderKit.zip\", fileSizeLabel=\"1.2 GB\", isFree=false), publish it,\n" +
      "   then run scripts/sync-product-map-to-s3.js (or just let the next Netlify build do it)."
  )
}

main().catch((e) => {
  console.error("\n❌ Provisioning failed:", e.message)
  process.exit(1)
})
