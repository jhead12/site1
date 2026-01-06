# Local WordPress Setup Checklist

## ✅ Completed Steps

1. **Removed duplicate WPGraphQL-ACF plugin**
   - ❌ Deleted: `wpgraphql-acf` (old version)
   - ✅ Kept: `wp-graphql-acf` v0.6.2 (modern version)

2. **Installed mu-plugin**
   - ✅ Copied: `enable-wpgraphql-video-mu-plugin.php` to `/wp-content/mu-plugins/`
   - This ensures Video, Tutorial, Beat, and Mix CPTs are exposed to GraphQL

## 📋 Next Steps (Do These in WordPress Admin)

### 1. Activate Correct Plugins
Visit: **http://w-jeldonmusic.local/wp-admin/plugins.php**

Ensure these plugins are **ACTIVE**:
- ✅ WPGraphQL (core)
- ✅ WPGraphQL for Advanced Custom Fields (v0.6.2)
- ✅ Advanced Custom Fields PRO (or Free)
- ✅ WPGraphQL Meta Query (if needed)

### 2. Flush Rewrite Rules
- Go to: **Settings → Permalinks**
- Click: **"Save Changes"** (no need to change anything)
- This activates the mu-plugin's GraphQL type registrations

### 3. Verify ACF Field Group Configuration

Go to: **Custom Fields → Field Groups**

Find: **"Video Details"** field group

**Required Settings:**
```
Field Group: Video Details
Fields:
  - youtubeUrl (Text)
  - youtubeVideoId (Text)
  - videoDuration (Text)
  - viewCount (Number)
  - videoTags (Taxonomy)
  - customThumbnail (Image)

GraphQL Settings:
  ✅ Show in GraphQL: YES
  ✅ GraphQL Field Name: videoDetails
  ✅ GraphQL Type: VideoDetails

Location Rules:
  ✅ Post Type is equal to Video
```

**CRITICAL:** The GraphQL Field Name must be exactly `videoDetails` (camelCase)

### 4. Test GraphQL Query

Visit: **http://w-jeldonmusic.local/graphql**

Run this query:
```graphql
{
  videos(first: 5) {
    nodes {
      title
      slug
      videoDetails {
        youtubeVideoId
        youtubeUrl
        videoDuration
        viewCount
      }
    }
  }
}
```

**Expected Result:**
- Should return video data with videoDetails fields populated
- No errors about "VideoDetails does not exist"

### 5. Verify Type Names in GraphiQL

In the GraphiQL Documentation Explorer, verify:
- ✅ `Video` type exists (singular)
- ✅ `videos` query exists (plural)
- ✅ `VideoDetails` type exists
- ✅ `Video.videoDetails` field exists and returns `VideoDetails` type

### 6. Test One Video in Browser

Create or edit a video post:
1. Add a YouTube URL (e.g., `https://www.youtube.com/watch?v=dQw4w9WgXcQ`)
2. Extract Video ID: `dQw4w9WgXcQ`
3. Add video duration: `3:45`
4. Save/Publish

Then query in GraphiQL:
```graphql
{
  video(id: "YOUR_VIDEO_SLUG", idType: SLUG) {
    title
    videoDetails {
      youtubeUrl
      youtubeVideoId
      videoDuration
    }
  }
}
```

## 🚀 Export/Backup for Production

Once everything works locally, create a backup:

### Option A: All-in-One WP Migration
1. Install "All-in-One WP Migration" plugin (both local + production)
2. Export from local: **Plugins → All-in-One WP Migration → Export**
3. Download the `.wpress` file
4. Import to production: **Plugins → All-in-One WP Migration → Import**

### Option B: Manual Export
1. **Database:** Export via phpMyAdmin or WP-CLI
   ```bash
   wp db export backup.sql
   ```

2. **Files:** Copy these directories:
   - `/wp-content/mu-plugins/` (contains our custom plugin)
   - `/wp-content/plugins/` (only the correct plugins)
   - `/wp-content/themes/` (if customized)
   - `/wp-content/uploads/` (media files)

3. **Find/Replace URLs:** Use Better Search Replace plugin:
   - Replace: `http://w-jeldonmusic.local`
   - With: `https://blog.jeldonmusic.com`

### Option C: WP Migrate (Recommended for Dev→Prod)
1. Install "WP Migrate" plugin
2. Use push/pull functionality for safe database + file sync
3. Automatically handles URL replacements

## 🔍 Troubleshooting

### Issue: "VideoDetails does not exist"
- Check ACF field group GraphQL Field Name is exactly `videoDetails`
- Verify WPGraphQL for ACF plugin is active (v0.6.2)
- Flush permalinks again

### Issue: "No videos query available"
- Check mu-plugin is in `/wp-content/mu-plugins/`
- Verify Video post type exists and has posts
- Flush permalinks

### Issue: Gatsby build still fails
- After production restore, verify production GraphQL: https://blog.jeldonmusic.com/graphql
- Run same test queries
- Check for any remaining duplicate plugins in production

## 📌 Important Notes

1. **gatsby-source-wordpress** automatically prefixes WordPress types with `Wp`
   - WordPress: `VideoDetails` → Gatsby: `WpVideoDetails`
   - WordPress: `Video` → Gatsby: `WpVideo`

2. **ACF Auto-generates Types**
   - Don't manually define VideoDetails in gatsby-node.js
   - Let WPGraphQL + ACF create it from field group settings

3. **Backup First**
   - Always backup production before restoring from local
   - Test restore on staging if available

---

**After completing these steps, your local WordPress should match production requirements.**
