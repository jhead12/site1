/**
 * YouTube → Contentful Video Post sync
 *
 * Pulls recent uploads from a YouTube channel (Data API v3) and upserts them as
 * `Video Post` entries in Contentful, keyed on the `youtubeVideoId` field so the
 * sync is idempotent (re-running only updates changed videos).
 *
 * Required env:
 *   YOUTUBE_API_KEY            Google API key with YouTube Data API v3 enabled
 *   YOUTUBE_CHANNEL_ID          e.g. UCxxxxxxxxxxxxxxxxxxxxxxxxx
 *   CONTENTFUL_SPACE_ID
 *   CONTENTFUL_MANAGEMENT_TOKEN
 * Optional env:
 *   CONTENTFUL_ENV              default "master"
 *   YOUTUBE_SYNC_LIMIT          how many recent uploads to pull (default 10; paginated, no hard cap)
 *   YOUTUBE_AUTHOR              author string written to each post (default "Jeldon")
 *   YOUTUBE_CATEGORY_SLUG       if set, links each post to this videoCategory (must exist)
 *   YOUTUBE_SKIP_IMAGE          "true" to skip thumbnail asset upload (faster)
 *
 * Usage:
 *   node ./scripts/sync-youtube-to-videos.js            # live
 *   node ./scripts/sync-youtube-to-videos.js --dry-run   # preview, no writes
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
    .replace(/['']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 70)
}

function truncate(text, max = 200) {
  const clean = String(text || "")
    .replace(/\s+/g, " ")
    .replace(/[#*_~`]/g, '') // Remove markdown chars
    .trim()
  if (clean.length <= max) return clean
  return clean.slice(0, max).replace(/\s+\S*$/, "") + "…"
}

// Parse YouTube ISO 8601 duration (e.g., "PT3M45S" → "3:45")
function parseYouTubeDuration(isoDuration) {
  if (!isoDuration) return null

  const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
  if (!match) return isoDuration

  const hours = match[1] ? parseInt(match[1], 10) : 0
  const minutes = match[2] ? parseInt(match[2], 10) : 0
  const seconds = match[3] ? parseInt(match[3], 10) : 0

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

function richText(description, videoUrl, title) {
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
        nodeType: "hyperlink",
        data: { uri: videoUrl },
        content: [
          {
            nodeType: "text",
            value: "YouTube",
            marks: [{ type: "underline", object: "mark" }],
            data: {},
          },
        ],
      },
      { nodeType: "text", value: " →", marks: [], data: {} },
    ],
  })

  return {
    nodeType: "document",
    data: {},
    content,
  }
}

// --- Contentful helpers ------------------------------------------------------

const UPLOAD = `https://upload.contentful.com/spaces/${SPACE}/environments/${ENV}`

async function cf(path, opts = {}) {
  const res = await fetch(`${CMA}${path}`, { ...opts, headers: { ...opts.headers } })
  return res
}

async function upload(path, opts = {}) {
  const res = await fetch(`${UPLOAD}${path}`, { ...opts, headers: { ...opts.headers } })
  return res
}

async function fetchExistingVideos() {
  const out = []
  let skip = 0
  for (;;) {
    const res = await cf(`/entries?content_type=videoPost&limit=1000&skip=${skip}`, {
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
  const thumbs = video.snippet.thumbnails || {}
  const t =
    thumbs.maxres || thumbs.standard || thumbs.high || thumbs.medium || thumbs.default
  if (!t) return null

  const imgRes = await fetch(t.url)
  if (!imgRes.ok) throw new Error(`thumbnail download failed (${imgRes.status})`)
  const buffer = await imgRes.buffer()
  const contentType = t.url.endsWith(".png") ? "image/png" : "image/jpeg"
  const fileName = `${video.contentDetails.videoId}.${contentType === "image/png" ? "png" : "jpg"}`

  // Upload to upload.contentful.com (not api.contentful.com)
  // Must use application/octet-stream for uploads
  const upRes = await upload(`/uploads`, {
    method: "POST",
    headers: { ...auth, "Content-Type": "application/octet-stream" },
    body: buffer,
  })
  if (!upRes.ok) throw new Error(`upload create failed (${upRes.status}): ${await upRes.text()}`)
  const uploadId = (await upRes.json()).sys.id

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
  console.log(`   🖼️  uploaded thumbnail for "${video.snippet.title}"`)

  const procRes = await cf(`/assets/${asset.sys.id}/files/${encodeURIComponent(LOCALE)}/process`, {
    method: "PUT",
    headers: { ...auth, "X-Contentful-Version": asset.sys.version },
  })
  if (!procRes.ok) throw new Error(`asset process failed (${procRes.status}): ${await procRes.text()}`)

  let ready = null
  for (let i = 0; i < 20; i++) {
    await new Promise((r) => setTimeout(r, 1000))
    const got = await cf(`/assets/${asset.sys.id}`, { headers: auth })
    const body = await got.json()
    if (body.fields?.file?.[LOCALE]?.url) {
      ready = body
      break
    }
  }
  if (!ready) throw new Error("asset processing timed out")

  await cf(`/assets/${asset.sys.id}/published`, {
    method: "PUT",
    headers: { ...jsonHeaders, "X-Contentful-Version": ready.sys.version },
  })

  return asset.sys.id
}

async function findCategoryEntry(slug) {
  const res = await cf(`/entries?content_type=videoCategory&limit=1000`, { headers: auth })
  if (!res.ok) return null
  const body = await res.json()
  return body.items.find((e) => getField(e, "slug") === slug) || null
}

// --- main sync ---------------------------------------------------------------

async function fetchUploads() {
  const chanRes = await fetch(
    `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${YT_CHANNEL}&key=${YT_KEY}`
  )
  if (!chanRes.ok) throw new Error(`YouTube channels API failed (${chanRes.status}): ${await chanRes.text()}`)
  const chan = await chanRes.json()
  const uploadsPlaylist = chan.items?.[0]?.contentDetails?.relatedPlaylists?.uploads
  if (!uploadsPlaylist) throw new Error("Could not resolve channel uploads playlist — check YOUTUBE_CHANNEL_ID")

  // Page through the uploads playlist (newest-first) until we have LIMIT
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

  // Fetch video details (duration) in chunks of 50 (videos endpoint limit).
  const videoDetailsMap = new Map()
  for (let i = 0; i < allItems.length; i += 50) {
    const chunk = allItems
      .slice(i, i + 50)
      .map((item) => item.contentDetails.videoId)
      .filter(Boolean)
      .join(",")
    if (!chunk) continue
    const videosRes = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=${chunk}&key=${YT_KEY}`
    )
    if (!videosRes.ok) throw new Error(`YouTube videos API failed (${videosRes.status}): ${await videosRes.text()}`)
    const videos = await videosRes.json()
    videos.items.forEach((v) => videoDetailsMap.set(v.id, v.contentDetails))
  }

  // Merge duration from videos API into playlist items
  return allItems.map((item) => ({
    ...item,
    contentDetails: {
      ...item.contentDetails,
      duration: videoDetailsMap.get(item.contentDetails.videoId)?.duration || null,
    },
  }))
}

async function upsertVideo(video, existing, categoryEntry) {
  const videoId = video.contentDetails.videoId
  const title = video.snippet.title || "Untitled"
  const description = video.snippet.description || ""
  const publishedAt = video.snippet.publishedAt
  const watchUrl = `https://www.youtube.com/watch?v=${videoId}`
  const baseSlug = slugify(title) || videoId

  const match = existing.find((e) => getField(e, "youtubeVideoId") === videoId)
  const usedSlugs = new Set(
    existing.filter((e) => e.sys.id !== match?.sys.id).map((e) => getField(e, "slug"))
  )
  let slug = baseSlug
  let i = 1
  while (usedSlugs.has(slug)) slug = `${baseSlug}-${++i}`

  // Extract duration from video (ISO 8601 format from YouTube API, e.g., "PT3M45S")
  const isoDuration = video.contentDetails?.duration
  const duration = isoDuration ? parseYouTubeDuration(isoDuration) : null

  // Bail before any writes (including thumbnail uploads) in dry-run mode.
  if (DRY_RUN) {
    console.log(`   [dry-run] ${match ? "would update" : "would create"} "${title}" → /videos/${slug}/ (yt:${videoId})`)
    return
  }

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
    excerpt: loc(truncate(description, 180)),  // Keep well under 255 char limit
    body: loc(richText(description, watchUrl, title)),
    publishDate: loc(publishedAt),
    author: loc(AUTHOR),
    youtubeVideoId: loc(videoId),
    duration: loc(duration),
  }
  if (featuredImageLink) fields.featuredImage = loc(featuredImageLink)
  if (categoryEntry) fields.categories = loc([{ sys: { type: "Link", linkType: "Entry", id: categoryEntry.sys.id } }])

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
    console.log(`   ✓ updated "${title}" → /videos/${slug}/`)
  } else {
    // Create
    const res = await cf(`/entries`, {
      method: "POST",
      headers: { ...jsonHeaders, "X-Contentful-Content-Type": "videoPost" },
      body: JSON.stringify({ fields }),
    })
    if (!res.ok) throw new Error(`create ${videoId} failed (${res.status}): ${await res.text()}`)
    const created = await res.json()
    await publishEntry(created.sys.id, created.sys.version)
    console.log(`   ✓ created "${title}" → /videos/${slug}/`)
  }
}

async function main() {
  console.log(`🎬 YouTube → Contentful Video sync  (env: ${ENV}, limit: ${LIMIT}${DRY_RUN ? ", dry-run" : ""})`)

  let categoryEntry = null
  if (CATEGORY_SLUG) {
    categoryEntry = await findCategoryEntry(CATEGORY_SLUG)
    if (!categoryEntry) console.warn(`⚠️  YOUTUBE_CATEGORY_SLUG="${CATEGORY_SLUG}" not found — videos will have no category.`)
  }

  const existing = await fetchExistingVideos()
  console.log(`📥 Found ${existing.length} existing Video Post entries in Contentful.`)

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
    console.log("💡 Trigger a Gatsby rebuild (Contentful webhook → Netlify) to publish the new videos.")
  }
}

main().catch((e) => {
  console.error("\n❌ Sync failed:", e.message)
  process.exit(1)
})
