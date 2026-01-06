# Local WordPress Installation Review
**Date:** January 5, 2026  
**Location:** `/Users/jeldonmusic/Local Sites/w-jeldonmusic/`  
**GraphQL Endpoint:** http://localhost:10008/graphql

---

## ✅ Installation Summary

### Core WordPress
- **Version:** Latest (confirmed working)
- **URL:** http://w-jeldonmusic.local or http://localhost:10008

### Plugin Versions (Verified)
| Plugin | Version | Status |
|--------|---------|--------|
| **WPGraphQL** | 2.3.0 | ✅ Installed |
| **WPGraphQL for ACF** | 0.6.2 | ✅ Installed (correct version) |
| **Advanced Custom Fields** | 6.7.0 | ✅ Installed |
| **WPGraphQL Meta Query** | - | ✅ Installed |

### MU-Plugin
- **enable-wpgraphql-video-mu-plugin.php** → ✅ Installed in `/wp-content/mu-plugins/`
- Exposes Video, Tutorial, Beat, Mix CPTs to WPGraphQL with unique names

---

## 🔍 GraphQL Schema Analysis

### Video Type Configuration
**Successfully Registered:**
- ✅ `Video` (singular type)
- ✅ `videos` (plural query)
- ✅ `VideoCategory` (taxonomy)
- ✅ `videoDetails` (ACF field group)

### ACF Field Group: "Video Details"
**GraphQL Type Name:** `ContentNode_Videodetails`  
**Registered On:** `Video` type  
**Access Path:** `video.videoDetails`

**Available Fields:**
```graphql
type ContentNode_Videodetails {
  customThumbnail: MediaItem
  fieldGroupName: String
  videoDuration: String
  videoTags: String
  viewCount: Float
  youtubeUrl: String
  youtubeVideoId: String
}
```

### Sample Working Query
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
        customThumbnail {
          sourceUrl
          mediaItemUrl
        }
      }
    }
  }
}
```

**Test Result:** ✅ Successfully returned 5 videos with populated videoDetails

---

## 🎯 Key Findings

### ✅ What's Working
1. **GraphQL Exposure:** Video CPT properly exposed via mu-plugin
2. **ACF Integration:** WPGraphQL-ACF correctly generating types from field groups
3. **Data Availability:** Videos query returns actual data with YouTube IDs, URLs, durations
4. **Type Structure:** `ContentNode_Videodetails` includes all required fields

### ⚠️ Important Notes

#### 1. **Type Name Difference**
- **Local WordPress:** `ContentNode_Videodetails` (with underscore)
- **Production WordPress:** `VideoDetails` (without prefix)
- **Cause:** Different ACF field group configurations or WPGraphQL-ACF versions

#### 2. **Gatsby Type Prefixing**
- gatsby-source-wordpress adds `Wp` prefix to all WordPress types
- `ContentNode_Videodetails` → `WpContentNode_Videodetails` in Gatsby
- `Video` → `WpVideo` in Gatsby

#### 3. **Missing from Introspection**
- `__type(name:"VideoDetails")` returns `null`
- But `ContentNode_Videodetails` exists and works
- This is expected for ACF-generated types in WPGraphQL

---

## 🔧 Production vs Local Comparison

| Aspect | Local (Port 10008) | Production (blog.jeldonmusic.com) |
|--------|-------------------|-----------------------------------|
| **WPGraphQL** | v2.3.0 | Unknown (likely v2.x) |
| **WPGraphQL-ACF** | v0.6.2 | v0.6.2 (after duplicate removed) |
| **ACF** | v6.7.0 | Unknown |
| **VideoDetails Type** | `ContentNode_Videodetails` | `VideoDetails` |
| **Duplicate Plugins** | ❌ Removed | ⚠️ Still present (needs removal) |
| **MU-Plugin** | ✅ Installed | ⚠️ Needs deployment |
| **Data Count** | Unknown | 32 videos |

---

## 📋 Action Plan for Production Sync

### Phase 1: Prepare Local Export
- [ ] Export ACF field group to JSON
- [ ] Document exact field group settings (GraphQL field name, location rules)
- [ ] Create database backup
- [ ] Create plugins/themes backup

### Phase 2: Production Cleanup
- [ ] Remove duplicate `wpgraphql-acf` plugin from production
- [ ] Deploy `enable-wpgraphql-video-mu-plugin.php` to production `/wp-content/mu-plugins/`
- [ ] Flush permalinks (Settings → Permalinks → Save)

### Phase 3: Verify Type Name
**Critical:** Determine why production uses `VideoDetails` vs local's `ContentNode_Videodetails`

**Possible causes:**
1. Different ACF field group "GraphQL Field Name" setting
2. Different WPGraphQL-ACF version behavior
3. Manual type definitions in production WordPress

**Resolution:**
- Check production ACF field group settings
- Verify GraphQL Type Name is set correctly
- May need to update gatsby-node.js to reference correct type name

### Phase 4: Gatsby Build Fix
Once production type name is confirmed, update gatsby-node.js:
```javascript
// Line 86 - Update based on actual production type name
videoDetails: WpContentNode_Videodetails  // if local style
// OR
videoDetails: WpVideoDetails              // if production already uses this
```

---

## 🚀 Recommended Next Steps

### Immediate (Do Now)
1. **Export ACF Field Group**
   - Go to: http://w-jeldonmusic.local/wp-admin/edit.php?post_type=acf-field-group
   - Find "Video Details"
   - Click "Export" or use ACF JSON sync
   - Save to `/docs/acf-exports/`

2. **Document Field Group Settings**
   - GraphQL Field Name (should be `videoDetails`)
   - GraphQL Type Name (check if it's set or auto-generated)
   - Location Rules (Post Type = Video)
   - All field configurations

3. **Create Production Deploy Package**
   - MU-plugin file
   - ACF field group export
   - Plugin removal script
   - Verification checklist

### Before Production Deploy
1. **Backup Production**
   - Full database export
   - All `/wp-content/` files
   - Test restore procedure

2. **Staging Test (If Available)**
   - Deploy changes to staging first
   - Run full GraphQL schema test
   - Test Gatsby build against staging
   - Verify 32 videos load correctly

3. **Update Gatsby Schema References**
   - Update gatsby-node.js type references
   - Test local Gatsby build against local WP
   - Commit and push changes

---

## 📝 Technical Notes

### ACF Field Group Configuration
**Expected Settings:**
```
Field Group: Video Details
Show in GraphQL: Yes
GraphQL Field Name: videoDetails
GraphQL Type Name: [Auto-generated or "VideoDetails"]

Location:
- Post Type is equal to Video

Fields:
- youtubeUrl (Text)
- youtubeVideoId (Text)
- videoDuration (Text)
- viewCount (Number)
- videoTags (Text)
- customThumbnail (Image)
```

### MU-Plugin Functionality
The `enable-wpgraphql-video-mu-plugin.php` ensures:
- `show_in_graphql = true` for Video, Tutorial, Beat, Mix CPTs
- Unique `graphql_single_name` and `graphql_plural_name`
- Prevents type name collisions
- Auto-loads on every WordPress request

### Known Issues Resolved
- ✅ Duplicate WPGraphQL-ACF plugins removed (local)
- ✅ MU-plugin installed and working (local)
- ✅ GraphQL schema generating correctly (local)
- ✅ Videos query returning data (local)

### Remaining Issues
- ⚠️ Type name mismatch between local and production
- ⚠️ Production still has duplicate plugin
- ⚠️ gatsby-node.js references need updating
- ⚠️ Netlify build failing on schema errors

---

## 🎯 Success Criteria

✅ **Local WordPress (COMPLETE)**
- [x] Duplicate plugins removed
- [x] Correct plugin versions installed
- [x] MU-plugin active
- [x] GraphQL schema valid
- [x] Videos query working
- [x] videoDetails fields populated

⬜ **Production WordPress (PENDING)**
- [ ] Duplicate plugins removed
- [ ] MU-plugin deployed
- [ ] Permalinks flushed
- [ ] GraphQL schema validated
- [ ] Type name confirmed
- [ ] 32 videos queryable

⬜ **Gatsby Build (PENDING)**
- [ ] gatsby-node.js updated with correct type names
- [ ] Local build success
- [ ] Netlify build success
- [ ] Videos page displays all videos
- [ ] Individual video pages render

---

## 📞 Deployment Coordination

### Pre-Deploy Checklist
- [ ] ACF field group exported
- [ ] Production backup created
- [ ] MU-plugin file ready
- [ ] gatsby-node.js updated
- [ ] Removal script tested
- [ ] Rollback plan documented

### Deploy Steps
1. Backup production DB and files
2. Remove duplicate `wpgraphql-acf` plugin
3. Upload MU-plugin
4. Flush permalinks
5. Test GraphQL endpoint
6. Commit Gatsby changes
7. Trigger Netlify build
8. Monitor build logs
9. Verify live site

### Rollback Plan
If production deploy fails:
1. Restore database from backup
2. Restore /wp-content/ from backup
3. Revert Gatsby commit
4. Wait for Netlify redeploy

---

**Last Updated:** January 5, 2026  
**Review Status:** Complete  
**Ready for Production Deploy:** Pending ACF export and type name verification
