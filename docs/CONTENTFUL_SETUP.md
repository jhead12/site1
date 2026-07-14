# Contentful Setup Guide

## Getting a New Management Token

1. Go to [Contentful](https://app.contentful.com)
2. Click on your profile icon (top left) → **Account settings**
3. Go to **Authorized personal access tokens**
4. Click **Create personal access token**
5. Give it a name (e.g., "Local Development")
6. Copy the token immediately (you can't see it again!)
7. Add it to your `.env.development`:

```bash
CONTENTFUL_MANAGEMENT_TOKEN='your_new_token_here'
```

## Creating Content Types Programmatically

Once you have a valid management token:

```bash
# Load environment and run the script
source .env.development
node ./scripts/create-contentful-content-types.js
```

This will create:
- `videoPost` - For YouTube videos
- `videoCategory` - Video categories
- `videoTag` - Video tags
- `blogPost` - Blog articles
- `blogCategory` - Blog categories
- `blogTag` - Blog tags

## Alternative: Manual Setup via Contentful UI

If you prefer to create content types manually:

1. Go to [Contentful](https://app.contentful.com)
2. Select your space (**Jeldon Music**)
3. Go to **Content model** (left sidebar)
4. Click **Add content type**

### videoPost Fields

| Field ID | Name | Type | Required |
|----------|------|------|----------|
| `title` | Title | Text | ✓ |
| `slug` | Slug | Text | ✓ |
| `excerpt` | Excerpt | Long text | |
| `body` | Description | Rich text | |
| `publishDate` | Publish Date | Date | ✓ |
| `author` | Author | Text | |
| `youtubeVideoId` | YouTube Video ID | Text | ✓ |
| `featuredImage` | Thumbnail | Media | |
| `categories` | Categories | Reference (multiple) | |
| `tags` | Tags | Reference (multiple) | |
| `duration` | Duration | Text | |
| `videoViews` | View Count | Number | |

### videoCategory Fields

| Field ID | Name | Type | Required |
|----------|------|------|----------|
| `name` | Name | Text | ✓ |
| `slug` | Slug | Text | ✓ |
| `description` | Description | Long text | |

### videoTag Fields

| Field ID | Name | Type | Required |
|----------|------|------|----------|
| `name` | Name | Text | ✓ |
| `slug` | Slug | Text | ✓ |

### blogPost Fields

| Field ID | Name | Type | Required |
|----------|------|------|----------|
| `title` | Title | Text | ✓ |
| `slug` | Slug | Text | ✓ |
| `excerpt` | Excerpt | Long text | |
| `content` | Content | Rich text | |
| `publishDate` | Publish Date | Date | ✓ |
| `author` | Author | Text | |
| `featuredImage` | Featured Image | Media | |
| `categories` | Categories | Reference (multiple) | |
| `tags` | Tags | Reference (multiple) | |
| `seoTitle` | SEO Title | Text | |
| `seoDescription` | SEO Description | Long text | |

### blogCategory Fields

| Field ID | Name | Type | Required |
|----------|------|------|----------|
| `name` | Name | Text | ✓ |
| `slug` | Slug | Text | ✓ |

### blogTag Fields

| Field ID | Name | Type | Required |
|----------|------|------|----------|
| `name` | Name | Text | ✓ |
| `slug` | Slug | Text | ✓ |

## After Creating Content Types

1. **Verify** the content types exist:
   ```bash
   curl -s "https://cdn.contentful.com/spaces/esrzm688xldd/environments/master/content_types" \
     -H "Authorization: Bearer 8SjzhspjJ_yogjktpLrJAeTmKomvxxbsUpKK488XP70" \
     | jq -r '.items[].sys.id'
   ```

2. **Run YouTube sync** (requires YouTube API key):
   ```bash
   node ./scripts/sync-youtube-to-videos.js
   ```

3. **Build the site**:
   ```bash
   yarn clean && yarn build
   ```

4. **Visit** `/videos/` to see your video archive
