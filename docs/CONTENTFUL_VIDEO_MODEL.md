# Contentful Video Post Content Model

This document defines the Video Post content type for YouTube video sync.

## Prerequisites

Before running the sync or building the site, you need to create the following content types in Contentful:

### Required Content Types

1. **blogPost** - For blog articles
2. **videoPost** - For YouTube videos
3. **videoCategory** - For categorizing videos
4. **videoTag** - For tagging videos

## Content Type: `videoPost`

**Name:** Video Post  
**Description:** YouTube video synced from channel uploads

### Fields

| Field ID | Name | Type | Required | Description |
|----------|------|------|----------|-------------|
| `title` | Title | Text | Yes | Video title from YouTube |
| `slug` | Slug | Text | Yes | URL-friendly identifier |
| `excerpt` | Excerpt | Text | No | Short description (max 300 chars) |
| `body` | Description | Rich Text | No | Full video description |
| `publishDate` | Publish Date | Date | Yes | Original YouTube publish date |
| `author` | Author | Text | No | Video author/channel name |
| `youtubeVideoId` | YouTube Video ID | Text | Yes | 11-character YouTube video ID |
| `featuredImage` | Thumbnail | Asset | No | Video thumbnail image |
| `categories` | Categories | Array (VideoCategory) | No | Video categories for filtering |
| `tags` | Tags | Array (VideoTag) | No | Video tags |
| `duration` | Duration | Text | No | Video duration (e.g., "10:30") |
| `videoViews` | View Count | Number | No | YouTube view count |

---

## Content Type: `videoCategory`

**Name:** Video Category  
**Description:** Category for organizing videos

### Fields

| Field ID | Name | Type | Required | Description |
|----------|------|------|----------|-------------|
| `name` | Name | Text | Yes | Category name |
| `slug` | Slug | Text | Yes | URL-friendly identifier |
| `description` | Description | Text | No | Category description |

---

## Content Type: `videoTag`

**Name:** Video Tag  
**Description:** Tag for organizing videos

### Fields

| Field ID | Name | Type | Required | Description |
|----------|------|------|----------|-------------|
| `name` | Name | Text | Yes | Tag name |
| `slug` | Slug | Text | Yes | URL-friendly identifier |

---

## Content Type: `blogPost`

**Name:** Blog Post  
**Description:** Blog article

### Fields

| Field ID | Name | Type | Required | Description |
|----------|------|------|----------|-------------|
| `title` | Title | Text | Yes | Article title |
| `slug` | Slug | Text | Yes | URL-friendly identifier |
| `excerpt` | Excerpt | Text | No | Short summary |
| `content` | Content | Rich Text | No | Full article content |
| `publishDate` | Publish Date | Date | Yes | Article publish date |
| `author` | Author | Text | No | Article author |
| `featuredImage` | Featured Image | Asset | No | Article cover image |
| `categories` | Categories | Array (BlogCategory) | No | Article categories |
| `tags` | Tags | Array (BlogTag) | No | Article tags |
| `seoTitle` | SEO Title | Text | No | Meta title for SEO |
| `seoDescription` | SEO Description | Text | No | Meta description for SEO |

---

## Content Type: `blogCategory`

**Name:** Blog Category  
**Description:** Category for organizing blog posts

### Fields

| Field ID | Name | Type | Required | Description |
|----------|------|------|----------|-------------|
| `name` | Name | Text | Yes | Category name |
| `slug` | Slug | Text | Yes | URL-friendly identifier |

---

## Content Type: `blogTag`

**Name:** Blog Tag  
**Description:** Tag for organizing blog posts

### Fields

| Field ID | Name | Type | Required | Description |
|----------|------|------|----------|-------------|
| `name` | Name | Text | Yes | Tag name |
| `slug` | Slug | Text | Yes | URL-friendly identifier |

---

## Setup Instructions

### Step 1: Create Content Types in Contentful UI

1. Log into [Contentful](https://app.contentful.com)
2. Navigate to the space: **Jeldon Music** (esrzm688xldd)
3. Go to **Content model** (in the left sidebar)
4. Click **Add content type** for each type below

#### Create `videoPost` first:
- Name: "Video Post"
- Description: "YouTube video synced from channel uploads"
- Add fields as specified in the table above

#### Create `videoCategory`:
- Name: "Video Category"  
- Description: "Category for organizing videos"
- Add fields: name, slug, description

#### Create `videoTag`:
- Name: "Video Tag"
- Description: "Tag for organizing videos"  
- Add fields: name, slug

#### Create `blogPost` (if not exists):
- Name: "Blog Post"
- Description: "Blog article"
- Add fields as specified above

#### Create `blogCategory` and `blogTag` (if not exists):
- Same pattern as video category/tag

### Step 2: Verify Content Types

After creating the content types, verify they exist:

```bash
# Check if content types are available
curl -s "https://cdn.contentful.com/spaces/esrzm688xldd/environments/master/content_types" \
  -H "Authorization: Bearer 8SjzhspjJ_yogjktpLrJAeTmKomvxxbsUpKK488XP70" \
  | jq -r '.items[].sys.id'
```

You should see: `videoPost`, `videoCategory`, `videoTag`, `blogPost`, `blogCategory`, `blogTag`

---

## Running the YouTube Sync

Once the content types are created:

### 1. Set up environment variables

```bash
# Add to .env.development or .env.production
YOUTUBE_API_KEY="your_youtube_api_key"
YOUTUBE_CHANNEL_ID="your_channel_id"
```

### 2. Run the sync script

```bash
# Preview changes (dry run)
node ./scripts/sync-youtube-to-videos.js --dry-run

# Run the sync
node ./scripts/sync-youtube-to-videos.js
```

### 3. Build the site

```bash
# Clean and build
yarn clean && yarn build

# Or for development
yarn clean && yarn develop
```

---

## Optional Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `YOUTUBE_SYNC_LIMIT` | 10 | Number of recent uploads to sync (max 50) |
| `YOUTUBE_AUTHOR` | "Jeldon" | Author name for posts |
| `YOUTUBE_CATEGORY_SLUG` | "" | Link videos to a category by slug |
| `YOUTUBE_SKIP_IMAGE` | "false" | Set to "true" to skip thumbnail upload |
| `CONTENTFUL_ENV` | "master" | Contentful environment |

---

## Verifying Setup

After creating content types and running sync:

1. Check Contentful UI for new Video Post entries
2. Run `yarn develop` and visit `/videos/` to see the video archive
3. Individual videos should be accessible at `/videos/{slug}/`

---

## Troubleshooting

### "Cannot query field 'allContentfulVideoPost'"

This error means the `videoPost` content type doesn't exist in Contentful yet. Create the content types as described above.

### Videos not appearing after sync

1. Check that the sync completed without errors
2. Verify entries are published in Contentful (not in draft state)
3. Trigger a rebuild: `yarn clean && yarn build`

### Build fails with GraphQL errors

The Contentful content types may not match the expected schema. Verify:
- All required fields exist with correct IDs
- Field types match (Text, Date, Rich Text, etc.)
- References use correct content type IDs
