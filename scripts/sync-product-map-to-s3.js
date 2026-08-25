/**
 * Contentful "Digital Product" entries → S3 product-map config.
 *
 * Reads every published digitalProduct entry from Contentful (Content
 * Delivery API - read-only, published content only) and writes a single
 * JSON config file to S3:
 *
 *   s3://jeldonmusic-s3-bucket/config/product-map.json
 *   { "<thrivecartProductId>": { "s3_key", "product_name", "product_tagline",
 *                                 "file_size", "free" }, ... }
 *
 * aws/lambda/presign_lambda.py (Product repo) reads this file at request
 * time instead of a hardcoded PRODUCT_FILE_MAP, so publishing a Digital
 * Product entry in Contentful plus uploading the file to S3 is the entire
 * process for adding a new product - no Lambda code edits or redeploys.
 *
 * Runs as part of `yarn build:netlify` (see package.json), so it fires on
 * every deploy - including the rebuild a Contentful publish webhook
 * triggers, keeping the Lambda's config current within one build cycle.
 *
 * Required env:
 *   CONTENTFUL_SPACE_ID, CONTENTFUL_ACCESS_TOKEN   (Content Delivery API)
 *   PRODUCT_MAP_AWS_ACCESS_KEY_ID                  scoped IAM user - see below
 *   PRODUCT_MAP_AWS_SECRET_ACCESS_KEY
 * Optional env:
 *   CONTENTFUL_ENV            default "master"
 *   PRODUCT_MAP_S3_BUCKET     default "jeldonmusic-s3-bucket"
 *   PRODUCT_MAP_S3_KEY        default "config/product-map.json"
 *   PRODUCT_MAP_AWS_REGION    default "us-west-2"
 *
 * IAM: the credential used here should be a dedicated IAM user whose policy
 * grants ONLY s3:PutObject on the single object ARN
 * arn:aws:s3:::jeldonmusic-s3-bucket/config/product-map.json - not broad
 * bucket access. Given this account's prior AWS credential-leak history
 * (see SECURITY.md in the Product repo), never reuse a general-purpose
 * AWS key for this.
 *
 * Usage:
 *   node ./scripts/sync-product-map-to-s3.js            # live
 *   node ./scripts/sync-product-map-to-s3.js --dry-run   # preview, no upload
 */
require("dotenv").config()
const fetch = require("node-fetch")
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3")

const SPACE = process.env.CONTENTFUL_SPACE_ID
const ENV = process.env.CONTENTFUL_ENV || "master"
const CDA_TOKEN = process.env.CONTENTFUL_ACCESS_TOKEN
const BUCKET = process.env.PRODUCT_MAP_S3_BUCKET || "jeldonmusic-s3-bucket"
const CONFIG_KEY = process.env.PRODUCT_MAP_S3_KEY || "config/product-map.json"
const REGION = process.env.PRODUCT_MAP_AWS_REGION || "us-west-2"
const DRY_RUN = process.argv.includes("--dry-run")

if (!SPACE || !CDA_TOKEN) {
  console.error("❌ Missing CONTENTFUL_SPACE_ID or CONTENTFUL_ACCESS_TOKEN.")
  process.exit(1)
}
if (!DRY_RUN && (!process.env.PRODUCT_MAP_AWS_ACCESS_KEY_ID || !process.env.PRODUCT_MAP_AWS_SECRET_ACCESS_KEY)) {
  console.error(
    "❌ Missing PRODUCT_MAP_AWS_ACCESS_KEY_ID / PRODUCT_MAP_AWS_SECRET_ACCESS_KEY.\n" +
      "   (Use --dry-run to preview without uploading.)"
  )
  process.exit(1)
}

async function fetchDigitalProducts() {
  const url = `https://cdn.contentful.com/spaces/${SPACE}/environments/${ENV}/entries?content_type=digitalProduct&access_token=${CDA_TOKEN}&limit=1000`
  const res = await fetch(url)
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Contentful CDA fetch failed (${res.status}): ${err}`)
  }
  const data = await res.json()
  return data.items || []
}

function buildProductMap(entries) {
  const map = {}
  for (const entry of entries) {
    const f = entry.fields || {}
    const productId = (f.thrivecartProductId || "").toString().trim().toLowerCase()
    if (!productId || !f.s3Key) {
      console.warn(`⚠️  Skipping entry ${entry.sys.id}: missing thrivecartProductId or s3Key`)
      continue
    }
    map[productId] = {
      s3_key: f.s3Key,
      product_name: f.name || productId,
      product_tagline: f.productTagline || f.name || productId,
      file_size: f.fileSizeLabel || "",
      free: Boolean(f.isFree),
    }
  }
  return map
}

async function uploadProductMap(map) {
  const client = new S3Client({
    region: REGION,
    credentials: {
      accessKeyId: process.env.PRODUCT_MAP_AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.PRODUCT_MAP_AWS_SECRET_ACCESS_KEY,
    },
  })
  await client.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: CONFIG_KEY,
      Body: JSON.stringify(map, null, 2),
      ContentType: "application/json",
    })
  )
}

async function main() {
  console.log(`📡 Contentful space: ${SPACE}  env: ${ENV}`)
  const entries = await fetchDigitalProducts()
  console.log(`   Found ${entries.length} digitalProduct entr${entries.length === 1 ? "y" : "ies"}`)

  const map = buildProductMap(entries)
  console.log(`\n${JSON.stringify(map, null, 2)}\n`)

  if (DRY_RUN) {
    console.log("✅ Dry run - nothing uploaded.")
    return
  }

  await uploadProductMap(map)
  console.log(`✅ Uploaded to s3://${BUCKET}/${CONFIG_KEY}`)
}

main().catch((e) => {
  console.error("\n❌ Sync failed:", e.message)
  process.exit(1)
})
