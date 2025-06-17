# YouTube Integration Setup Checklist
## Complete Implementation Guide

### 🎯 **Goal:** Replace placeholder videos with real YouTube content

---

## ✅ **Phase 1: WordPress Setup (15 minutes)**

### **Step 1.1: Add Video Post Type**
- [ ] **Copy code** from `/scripts/wordpress-video-setup-complete.php`
- [ ] **Open WordPress:** Local by Flywheel → w-jeldonmusic site
- [ ] **Navigate to:** Appearance → Theme Editor → functions.php
- [ ] **Paste code** at the end of functions.php
- [ ] **Save changes**
- [ ] **Verify:** Videos menu appears in WordPress admin

### **Step 1.2: Create ACF Video Fields**
- [ ] **Navigate to:** Custom Fields → Field Groups → Add New
- [ ] **Follow guide:** `/docs/ACF_VIDEO_FIELDS_SETUP.md`
- [ ] **Add all 8 fields** (YouTube ID, URL, Duration, Views, Tags, etc.)
- [ ] **Set location rule:** Post Type = video
- [ ] **Publish** field group
- [ ] **Test:** Create a sample video post

---

## 🔑 **Phase 2: YouTube API Setup (10 minutes)**

### **Step 2.1: Get YouTube Data API Key**
- [ ] **Visit:** https://console.cloud.google.com/
- [ ] **Create/Select** project
- [ ] **Enable:** YouTube Data API v3
- [ ] **Create credentials:** API Key
- [ ] **Copy API key** for later use

### **Step 2.2: Find Your Channel ID**
- [ ] **Method 1:** Check your YouTube channel URL
- [ ] **Method 2:** YouTube Studio → Settings → Channel → Advanced
- [ ] **Copy Channel ID** for later use

### **Step 2.3: Configure Auto-Sync (Optional)**
- [ ] **Add auto-sync code** from `/scripts/youtube-auto-sync.php`
- [ ] **Update API credentials** in WordPress
- [ ] **Test manual sync** first

---

## 🔄 **Phase 3: Gatsby Integration (10 minutes)**

### **Step 3.1: Enable Video Queries**
- [ ] **Open:** `gatsby-node.js`
- [ ] **Uncomment:** Video type definitions (around line 1109)
- [ ] **Uncomment:** `allWpVideo` query (around line 1205)
- [ ] **Uncomment:** Video page creation (around line 1314)

### **Step 3.2: Restore Video Template**
- [ ] **Update:** `src/templates/video.js` with real GraphQL queries
- [ ] **Update:** `src/pages/videos.js` to use WordPress data
- [ ] **Remove:** Placeholder data logic

### **Step 3.3: Test Build**
- [ ] **Run:** `gatsby clean`
- [ ] **Run:** `gatsby develop`
- [ ] **Check:** No GraphQL errors
- [ ] **Visit:** `/videos` page

---

## 🧪 **Phase 4: Testing & Validation (15 minutes)**

### **Step 4.1: Add Test Content**
- [ ] **Create 3-5 test videos** in WordPress
- [ ] **Use real YouTube IDs** from your channel
- [ ] **Add categories** and metadata
- [ ] **Set featured images**

### **Step 4.2: Verify Functionality**
- [ ] **Check:** Videos appear on `/videos` page
- [ ] **Test:** Individual video pages load
- [ ] **Verify:** YouTube embeds work
- [ ] **Test:** Category filtering
- [ ] **Check:** Related videos show

### **Step 4.3: SEO & Performance**
- [ ] **Test:** Meta tags and Open Graph
- [ ] **Check:** Image optimization
- [ ] **Verify:** Page load speeds
- [ ] **Test:** Mobile responsiveness

---

## 🚀 **Phase 5: Go Live (5 minutes)**

### **Step 5.1: Enable Auto-Sync**
- [ ] **Configure:** Hourly sync schedule
- [ ] **Test:** Manual sync works
- [ ] **Monitor:** Error logs
- [ ] **Verify:** New videos sync automatically

### **Step 5.2: Content Migration**
- [ ] **Remove:** All placeholder references
- [ ] **Update:** Documentation
- [ ] **Deploy:** Updated site
- [ ] **Announce:** Video section is live!

---

## 📋 **Quick Reference**

### **Key Files to Modify:**
1. **WordPress functions.php** - Add video post type
2. **WordPress ACF** - Create video fields  
3. **gatsby-node.js** - Uncomment video queries
4. **src/templates/video.js** - Restore GraphQL template
5. **src/pages/videos.js** - Remove placeholder data

### **Environment Variables Needed:**
```bash
YOUTUBE_API_KEY=your_api_key_here
YOUTUBE_CHANNEL_ID=your_channel_id_here
```

### **Commands to Run:**
```bash
# Clean and rebuild
gatsby clean && gatsby develop

# Test video sync (if auto-sync enabled)
npm run wp:sync-videos
```

---

## 🎉 **Success Criteria**

### **You'll know it's working when:**
- ✅ Videos menu appears in WordPress admin
- ✅ ACF fields show on video edit pages
- ✅ `/videos` page shows real content (not placeholders)
- ✅ Individual video pages load with YouTube embeds
- ✅ New YouTube videos sync automatically (if enabled)
- ✅ No GraphQL or build errors

---

## 🆘 **Need Help?**

### **Common Issues:**
- **GraphQL Errors:** Check video post type is registered
- **No Videos Showing:** Verify ACF fields are created
- **YouTube API Errors:** Check API key and permissions
- **Build Failures:** Run `gatsby clean` first

### **Support Files:**
- `/docs/ACF_VIDEO_FIELDS_SETUP.md` - Detailed ACF setup
- `/docs/YOUTUBE_AUTO_SYNC_GUIDE.md` - Auto-sync setup
- `/scripts/wordpress-video-setup-complete.php` - Complete WordPress code

**Ready to start? Let's begin with Phase 1! 🚀**
