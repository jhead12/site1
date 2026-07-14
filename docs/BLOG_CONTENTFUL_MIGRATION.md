# Blog migration: WordPress → Contentful

The blog now lives in **Contentful** instead of WordPress. Beats, mixes,
videos, and tutorials still come from WordPress (and the `BYPASS_WORDPRESS`
infra stays for those); only the **blog** moved.

This doc is the runbook to take the migration live.

## What changed in code

| File | Change |
| --- | --- |
| `src/gatsby/schema.js` | Added `ContentfulBlogPost`, `ContentfulBlogCategory`, `ContentfulBlogTag` types. `content` is derived from the Contentful `body` Rich Text field via the existing `@richText` extension (renders `body.raw` → HTML). |
| `src/gatsby/pages.js` | Blog post pages are created from `allContentfulBlogPost` (sorted by `publishDate DESC`). Beats/mixes/videos/tutorials unchanged. |
| `src/pages/blog.js` | Archive queries `allContentfulBlogPost`; categories are derived from the posts themselves (only used categories show). WP bypass banner removed. |
| `src/templates/blog-post.js` | Queries `contentfulBlogPost`; uses `@richText` `content`; flattened field access; comments are now **Giscus**. |
| `src/components/blog/giscus-comments.js` | New — Giscus (GitHub Discussions) comments, env-configured. |
| `src/components/blog-feature.js` | Reads `allContentfulBlogPost` shape. |
| `src/pages/index.js` | Homepage recent posts query `allContentfulBlogPost`. |
| `src/components/blog/{related-posts,blog-search}.js` | Flattened WP `.nodes` / `.featuredImage.node` access to Contentful shape. |
| `src/components/hero/rotating-hero-banner.js` | Blog slides now come from `allContentfulBlogPost` (was `allWpPost`). Video slides still from WP. |
| `scripts/setup-blog-content-model.js` | New — provisions the content types via the Contentful Management API. |

WordPress-specific files left in place (untouched, now only relevant to
beats/mixes/videos): `src/components/wordpress-comments.js`,
`src/components/seo/wordpress-seo.js`, the `BYPASS_WORDPRESS` layer.

## Field mapping (WP → Contentful)

| WordPress | Contentful BlogPost field |
| --- | --- |
| `title` | `title` (Symbol) |
| `slug` | `slug` (Symbol, `^[a-z0-9-]+$`) |
| `excerpt` (HTML) | `excerpt` (Text — plain text, not rich) |
| `content` (HTML) | `body` (Rich Text) → exposed as `content` via `@richText` |
| `date` | `publishDate` (Date) |
| `author.node.name` | `author` (Symbol) |
| `featuredImage.node.{sourceUrl,altText,localFile}` | `featuredImage` (Asset) → `{ url, description, alt, gatsbyImageData }` |
| `categories.nodes[]` | `categories` (Array of `blogCategory` entries) |
| `tags.nodes[]` | `tags` (Array of `blogTag` entries) |
| `databaseId` | — (Giscus needs no post id; it maps by URL pathname) |
| — | `seoTitle`, `seoDescription` (optional per-post SEO override) |
| — | `youtubeVideoId` (optional; upsert key for the future YT sync script) |

> The Rich Text field id **must be `body`**. The `@richText` schema extension
> reads `source.body.raw`. If you rename it, update `src/gatsby/schema.js`.

## Steps to go live

> **Order matters.** The Gatsby build will fail with
> `Syntax Error: Unexpected Name "allContentfulBlogPost"` until the `blogPost`
> content type exists in Contentful (step 1). `gatsby-source-contentful` only
> generates the `allContentfulBlogPost` query for content types present in the
> space — the same contract as every other Contentful type in this repo.

### 1. Provision the Contentful content model

```sh
# .env (or .env.development / .env.production)
CONTENTFUL_SPACE_ID=...        # already set for the site
CONTENTFUL_MANAGEMENT_TOKEN=...  # Settings > API Keys > Content management tokens
CONTENTFUL_ENV=master
yarn setup:blog-model
```

This creates and publishes `Blog Category`, `Blog Tag`, and `Blog Post`.
Idempotent — safe to re-run.

### 2. Create your categories

In Contentful, create `Blog Category` entries (e.g. `tutorials`, `production`)
with matching slugs. Slugs must be lowercase-hyphenated.

### 3. Recreate the 3 posts

For each backed-up WordPress post, create a `Blog Post` entry:

- `Title`, `Slug` (reuse the old slug so existing links don't break)
- Paste the body into the **Rich Text** `body` field (convert HTML→Rich Text;
  Contentful's editor accepts pasted HTML).
- `Excerpt`, `Author`, `Publish Date`, link `Featured Image` (upload an asset),
  link one or more `Categories`.
- Optional: `SEO Title` / `SEO Description` for per-post SEO.
- Publish each entry.

### 4. Configure Giscus (comments)

1. Enable **Discussions** on your GitHub repo (Settings → General → Features).
2. Install the **Giscus** GitHub app (https://github.com/apps/giscus).
3. Go to https://giscus.app and fill in your repo; it outputs `repo`,
   `repo-id`, `category`, `category-id`.
4. Add to `.env` (the `GATSBY_` prefix makes them client-visible):

```sh
GATSBY_GISCUS_REPO="your-name/your-repo"
GATSBY_GISCUS_REPO_ID="..."
GATSBY_GISCUS_CATEGORY="Announcements"
GATSBY_GISCUS_CATEGORY_ID="..."
GATSBY_GISCUS_MAPPING="pathname"
GATSBY_GISCUS_THEME="dark_dimmed"
```

Until these are set, the comment section shows a placeholder (build still works).

### 5. Build & verify

```sh
yarn build            # full build (WordPress still sourced for beats/mixes/videos)
# or, to skip WordPress entirely:
yarn build:no-wp
yarn develop          # http://localhost:8000/blog
```

Verify `/blog`, a `/blog/<slug>/` page, and the homepage "Recent Blog Posts"
section render from Contentful.

## Optional follow-ups

- **YouTube → blog auto-sync** (built — `scripts/sync-youtube-to-contentful.js`):
  pulls recent uploads via the YouTube Data API v3 and upserts `Blog Post`
  entries keyed on `youtubeVideoId` (idempotent). Sets title, slug, excerpt
  (description), Rich Text body (description + "Watch on YouTube" link),
  `publishDate`, `author`, and uploads the thumbnail as the featured image
  (best-effort). Optionally links a category (`YOUTUBE_CATEGORY_SLUG`).

  ```sh
  # .env
  YOUTUBE_API_KEY=...
  YOUTUBE_CHANNEL_ID=UC...
  YOUTUBE_SYNC_LIMIT=10            # optional (default 10, max 50)
  YOUTUBE_AUTHOR="Jeldon"          # optional
  YOUTUBE_CATEGORY_SLUG="videos"   # optional — must already exist as a Blog Category
  YOUTUBE_SKIP_IMAGE=""            # "true" to skip thumbnail upload

  yarn sync:youtube:dry-run        # preview, no writes
  yarn sync:youtube                # live
  ```

  Schedule it (GitHub Actions cron or Netlify Scheduled Function). After it
  runs, trigger a Gatsby rebuild (Contentful webhook → Netlify) so new posts
  publish. Note: the synced post body is text + a YouTube link; to render an
  embedded player, add a `youtubeVideoId` check to `src/templates/blog-post.js`.
- **Delete dead blog files** once you confirm the migration works:
  `src/components/blog-query.js` (unused `graphql-tag` stub),
  `src/templates/blog-index.js` (superseded by `src/pages/blog.js`),
  `src/components/related-posts.js` (root — unused; the live one is
  `src/components/blog/related-posts.js`), and
  `src/components/hero/rotating-hero-banner-config.js` (aspirational config,
  never imported). None are imported, so they don't break the build.
- **Trim demo blog data** in `src/utils/fallback-data.js`
  (`getDemoBlogPosts`, `getDemoCategories`) — still imported by
  `src/gatsby/bypass-mocks.js` for WP-bypass mode, so only remove after you
  also drop the `allWpPost` mock there. Low priority.