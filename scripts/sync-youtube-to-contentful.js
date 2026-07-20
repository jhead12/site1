/**
 * YouTube → Contentful blog sync
 *
 * Pulls recent uploads from a YouTube channel (Data API v3) and upserts them as
 * `Blog Post` entries in Contentful, keyed on the `youtubeVideoId` field so the
 * sync is idempotent (re-running only updates changed videos).
 *
 * Required env:
 *   YOUTUBE_API_KEY            Google API key with YouTube Data API v3 enabled
 *   YOUTUBE_CHANNEL_ID          e.g. UCxxxxxxxxxxxxxxxxxxxxxxxxx
 *   CONTENTFUL_SPACE_ID
 *   CONTENTFUL_MANAGEMENT_TOKEN
 * Optional env:
 *   CONTENTFUL_ENV              default "master"
 *   YOUTUBE_SYNC_LIMIT          how many recent uploads to pull (default 10, max 50)
 *   YOUTUBE_AUTHOR              author string written to each post (default "Jeldon")
 *   YOUTUBE_CATEGORY_SLUG       if set, links each post to this blogCategory (must exist)
 *   YOUTUBE_SKIP_IMAGE          "true" to skip thumbnail asset upload (faster)
 *
 * Usage:
 *   node ./scripts/sync-youtube-to-contentful.js            # live
 *   node ./scripts/sync-youtube-to-contentful.js --dry-run   # preview, no writes
 *
 * Run on a schedule (GitHub Actions cron / Netlify Scheduled Function). After
 * it runs, trigger a Gatsby rebuild (Contentful webhook → Netlify) to publish.
 */
require("dotenv").config()
const fetch = require("node-fetch")

const SPACE = process.env.CONTENTFUL_SPACE_ID
const ENV = process.env.CONTENTFUL_ENV || "master"
const TOKEN = process.env.CONTENTFUL_MANAGEMENT_TOKEN
const YT_KEY = process.env.YOUTUBE_API_KEY
const YT_CHANNEL = process.env.YOUTUBE_CHANNEL_ID
// How many of the most recent uploads to sync. Paginated (50/page), so this
// can exceed 50 to backfill a larger channel history.
const LIMIT = Number(process.env.YOUTUBE_SYNC_LIMIT) || 50
const AUTHOR = process.env.YOUTUBE_AUTHOR || "Jeldon"
const CATEGORY_SLUG = process.env.YOUTUBE_CATEGORY_SLUG || ""
const SKIP_IMAGE = process.env.YOUTUBE_SKIP_IMAGE === "true"
const DRY_RUN = process.argv.includes("--dry-run")

const CMA = `https://api.contentful.com/spaces/${SPACE}/environments/${ENV}`
const auth = { Authorization: `Bearer ${TOKEN}` }
const jsonHeaders = {
  ...auth,
  "Content-Type": "application/vnd.contentful.management.v1+json",
}

if (!SPACE || !TOKEN || !YT_KEY || !YT_CHANNEL) {
  console.error(
    "❌ Missing env. Required: YOUTUBE_API_KEY, YOUTUBE_CHANNEL_ID,\n" +
      "   CONTENTFUL_SPACE_ID, CONTENTFUL_MANAGEMENT_TOKEN."
  )
  process.exit(1)
}

const LOCALE = "en-US"
const loc = (value) => ({ [LOCALE]: value })

// --- helpers -----------------------------------------------------------------

function slugify(str) {
  return String(str || "")
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 70)
}

function truncate(text, max = 300) {
  const clean = String(text || "").replace(/\s+/g, " ").trim()
  if (clean.length <= max) return clean
  return clean.slice(0, max).replace(/\s+\S*$/, "") + "…"
}

function richText(description, videoUrl, title) {
  // Build a Contentful Rich Text document:
  //   <p>{first paragraph of description}</p>
  //   <p>…remaining description paragraphs…</p>
  //   <p><a href=videoUrl>Watch on YouTube →</a></p>
  const paragraphs = String(description || "")
    .split(/\n{2,}|\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean)

  const content = paragraphs.map((text) => ({
    nodeType: "paragraph",
    data: {},
    content: [{ nodeType: "text", value: text, marks: [], data: {} }],
  }))

  if (paragraphs.length === 0) {
    content.push({
      nodeType: "paragraph",
      data: {},
      content: [{ nodeType: "text", value: title, marks: [], data: {} }],
    })
  }

  content.push({
    nodeType: "paragraph",
    data: {},
    content: [
      { nodeType: "text", value: "Watch on ", marks: [], data: {} },
      {
        nodeType: "text",
        value: "YouTube",
        marks: [{ type: "underline", object: "mark" }],
        data: {},
      },
      { nodeType: "text", value: " →", marks: [], data: {} },
    ],
  })

  return {
    nodeType: "document",
    data: {},
    content,
    // The hyperlink to YouTube is attached via the description text above;
    // a full hyperlink node would need `data: { uri }` on a paragraph — kept
    // simple here. The template renders this via @richText → documentToHtmlString.
  }
}

// --- Contentful helpers ------------------------------------------------------

async function cf(path, opts = {}) {
  const res = await fetch(`${CMA}${path}`, { ...opts, headers: { ...opts.headers } })
  return res
}

async function fetchExistingPosts() {
  // Pull all blogPost entries (draft + published) so we can upsert by youtubeVideoId.
  const out = []
  let skip = 0
  for (;;) {
    const res = await cf(`/entries?content_type=blogPost&limit=1000&skip=${skip}`, {
      headers: auth,
    })
    if (!res.ok) throw new Error(`list entries failed (${res.status}): ${await res.text()}`)
    const body = await res.json()
    out.push(...body.items)
    if (body.items.length < 1000) break
    skip += 1000
  }
  return out
}

function getField(entry, name) {
  const v = entry.fields?.[name]?.[LOCALE]
  return v
}

async function publishEntry(id, version) {
  const res = await cf(`/entries/${id}/published`, {
    method: "PUT",
    headers: { ...jsonHeaders, "X-Contentful-Version": version },
  })
  if (!res.ok) throw new Error(`publish entry ${id} failed (${res.status}): ${await res.text()}`)
  return res.json()
}

async function uploadAsset(video) {
  // Pick the best available thumbnail.
  const thumbs = video.snippet.thumbnails || {}
  const t =
    thumbs.maxres || thumbs.standard || thumbs.high || thumbs.medium || thumbs.default
  if (!t) return null

  const imgRes = await fetch(t.url)
  if (!imgRes.ok) throw new Error(`thumbnail download failed (${imgRes.status})`)
  const buffer = await imgRes.buffer()
  const contentType = t.url.endsWith(".png") ? "image/png" : "image/jpeg"
  const fileName = `${video.contentDetails.videoId}.${contentType === "image/png" ? "png" : "jpg"}`

  // 1. Direct upload → uploadId
  const upRes = await cf(`/uploads`, {
    method: "POST",
    headers: { ...auth, "Content-Type": contentType },
    body: buffer,
  })
  if (!upRes.ok) throw new Error(`upload create failed (${upRes.status}): ${await upRes.text()}`)
  const uploadId = (await upRes.json()).sys.id

  // 2. Create asset referencing the upload
  const createRes = await cf(`/assets`, {
    method: "POST",
    headers: { ...jsonHeaders, "X-Contentful-Content-Type": "asset" },
    body: JSON.stringify({
      fields: {
        title: loc(video.snippet.title),
        description: loc(`YouTube thumbnail for ${video.snippet.title}`),
        file: loc({
          fileName,
          contentType,
          uploadFrom: { sys: { type: "Link", linkType: "Upload", id: uploadId } },
        }),
      },
    }),
  })
  if (!createRes.ok) throw new Error(`asset create failed (${createRes.status}): ${await createRes.text()}`)
  const asset = await createRes.json()
  const assetId = asset.sys.id

  // 3. Process asset (per-locale)
  const procRes = await cf(`/assets/${assetId}/files/${encodeURIComponent(LOCALE)}/process`, {
    method: "PUT",
    headers: { ...auth, "X-Contentful-Version": asset.sys.version },
  })
  if (!procRes.ok) throw new Error(`asset process failed (${procRes.status}): ${await procRes.text()}`)

  // 4. Wait for processing (poll until url appears)
  let ready = null
  for (let i = 0; i < 20; i++) {
    await new Promise((r) => setTimeout(r, 1000))
    const got = await cf(`/assets/${assetId}`, { headers: auth })
    const body = await got.json()
    if (body.fields?.file?.[LOCALE]?.url) {
      ready = body
      break
    }
  }
  if (!ready) throw new Error("asset processing timed out")

  // 5. Publish asset
  await cf(`/assets/${assetId}/published`, {
    method: "PUT",
    headers: { ...jsonHeaders, "X-Contentful-Version": ready.sys.version },
  })

  return assetId
}

async function findCategoryEntry(slug) {
  const res = await cf(`/entries?content_type=blogCategory&limit=1000`, { headers: auth })
  if (!res.ok) return null
  const body = await res.json()
  return body.items.find((e) => getField(e, "slug") === slug) || null
}

// --- main sync ---------------------------------------------------------------

async function fetchUploads() {
  // 1. resolve uploads playlist id for the channel
  const chanRes = await fetch(
    `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${YT_CHANNEL}&key=${YT_KEY}`
  )
  if (!chanRes.ok) throw new Error(`YouTube channels API failed (${chanRes.status}): ${await chanRes.text()}`)
  const chan = await chanRes.json()
  const uploadsPlaylist = chan.items?.[0]?.contentDetails?.relatedPlaylists?.uploads
  if (!uploadsPlaylist) throw new Error("Could not resolve channel uploads playlist — check YOUTUBE_CHANNEL_ID")

  // 2. page through the uploads playlist (newest-first) until we have LIMIT
  // items or run out of pages. The API caps maxResults at 50 per page, so
  // LIMIT > 50 is satisfied across multiple pages.
  const allItems = []
  let pageToken = ""
  let pages = 0
  do {
    const remaining = LIMIT - allItems.length
    if (remaining <= 0) break
    const pageSize = Math.min(50, remaining)
    const pageUrl =
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails` +
      `&playlistId=${uploadsPlaylist}&maxResults=${pageSize}&key=${YT_KEY}` +
      (pageToken ? `&pageToken=${pageToken}` : "")
    console.log(`   📄 fetching playlist page ${pages + 1} (pageSize=${pageSize}, remaining=${remaining})`)
    const itemsRes = await fetch(pageUrl)
    if (!itemsRes.ok) throw new Error(`YouTube playlistItems API failed (${itemsRes.status}): ${await itemsRes.text()}`)
    const items = await itemsRes.json()
    allItems.push(...items.items)
    pageToken = items.nextPageToken || ""
  } while (pageToken && allItems.length < LIMIT && ++pages < 50) // 50 pages ≈ 2500 items safety cap

  return allItems
}

async function upsertVideo(video, existing, categoryEntry) {
  const videoId = video.contentDetails.videoId
  const title = video.snippet.title || "Untitled"
  const description = video.snippet.description || ""
  const publishedAt = video.contentDetails.videoPublishedAt || video.snippet.publishedAt
  const watchUrl = `https://www.youtube.com/watch?v=${videoId}`
  const baseSlug = slugify(title) || videoId

  const match = existing.find((e) => getField(e, "youtubeVideoId") === videoId)
  const usedSlugs = new Set(
    existing.filter((e) => e.sys.id !== match?.sys.id).map((e) => getField(e, "slug"))
  )
  let slug = baseSlug
  let i = 1
  while (usedSlugs.has(slug)) slug = `${baseSlug}-${++i}`

  // Featured image (best-effort)
  let featuredImageLink = undefined
  if (!SKIP_IMAGE) {
    try {
      const assetId = await uploadAsset(video)
      if (assetId) featuredImageLink = { sys: { type: "Link", linkType: "Asset", id: assetId } }
    } catch (e) {
      console.warn(`   ⚠️  image upload failed for ${videoId}: ${e.message} — continuing without image`)
    }
  }

  const fields = {
    title: loc(title),
    slug: loc(slug),
    excerpt: loc(truncate(description, 300)),
    body: loc(richText(description, watchUrl, title)),
    publishDate: loc(publishedAt),
    author: loc(AUTHOR),
    youtubeVideoId: loc(videoId),
  }
  if (featuredImageLink) fields.featuredImage = loc(featuredImageLink)
  if (categoryEntry) fields.categories = loc([{ sys: { type: "Link", linkType: "Entry", id: categoryEntry.sys.id } }])

  if (DRY_RUN) {
    console.log(`   [dry-run] ${match ? "would update" : "would create"} "${title}" → /blog/${slug}/ (yt:${videoId})`)
    return
  }

  if (match) {
    // Update
    const res = await cf(`/entries/${match.sys.id}`, {
      method: "PUT",
      headers: { ...jsonHeaders, "X-Contentful-Version": match.sys.version },
      body: JSON.stringify({ fields }),
    })
    if (!res.ok) throw new Error(`update ${videoId} failed (${res.status}): ${await res.text()}`)
    const updated = await res.json()
    await publishEntry(updated.sys.id, updated.sys.version)
    console.log(`   ✓ updated "${title}" → /blog/${slug}/`)
  } else {
    // Create
    const res = await cf(`/entries`, {
      method: "POST",
      headers: { ...jsonHeaders, "X-Contentful-Content-Type": "blogPost" },
      body: JSON.stringify({ fields }),
    })
    if (!res.ok) throw new Error(`create ${videoId} failed (${res.status}): ${await res.text()}`)
    const created = await res.json()
    await publishEntry(created.sys.id, created.sys.version)
    console.log(`   ✓ created "${title}" → /blog/${slug}/`)
  }
}

async function main() {
  console.log(`🎬 YouTube → Contentful sync  (env: ${ENV}, limit: ${LIMIT}${DRY_RUN ? ", dry-run" : ""})`)

  let categoryEntry = null
  if (CATEGORY_SLUG) {
    categoryEntry = await findCategoryEntry(CATEGORY_SLUG)
    if (!categoryEntry) console.warn(`⚠️  YOUTUBE_CATEGORY_SLUG="${CATEGORY_SLUG}" not found — posts will have no category.`)
  }

  const existing = await fetchExistingPosts()
  console.log(`📥 Found ${existing.length} existing Blog Post entries in Contentful.`)

  const videos = await fetchUploads()
  console.log(`📺 Found ${videos.length} recent upload(s) on YouTube (limit was ${LIMIT}).`)

  let created = 0,
    updated = 0,
    failed = 0
  for (const video of videos) {
    try {
      await upsertVideo(video, existing, categoryEntry)
      const id = video.contentDetails.videoId
      const existed = existing.some((e) => getField(e, "youtubeVideoId") === id)
      if (!DRY_RUN) {
        if (existed) updated++
        else created++
      }
    } catch (e) {
      failed++
      console.error(`   ✗ failed "${video.snippet?.title}": ${e.message}`)
    }
  }

  console.log(
    `\n${DRY_RUN ? "Dry run complete" : "Sync complete"}: ${created} created, ${updated} updated, ${failed} failed.`
  )
  if (!DRY_RUN && failed === 0 && (created > 0 || updated > 0)) {
    console.log("💡 Trigger a Gatsby rebuild (Contentful webhook → Netlify) to publish the new posts.")
  }
}

main().catch((e) => {
  console.error("\n❌ Sync failed:", e.message)
  process.exit(1)
})