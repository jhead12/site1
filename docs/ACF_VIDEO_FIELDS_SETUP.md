# ACF Video Fields Setup Guide
## Step-by-Step Instructions for WordPress Admin

### 📋 **Prerequisites**
- WordPress with ACF Pro installed
- Video custom post type added to functions.php
- WPGraphQL plugin installed

---

## 🎯 **Step 1: Create Video Field Group**

### In WordPress Admin:
1. **Navigate to:** Custom Fields → Field Groups
2. **Click:** "Add New"
3. **Title:** "Video Details"

---

## 🏷️ **Step 2: Add These Fields**

### **Field 1: YouTube Video ID**
- **Field Label:** YouTube Video ID
- **Field Name:** youtube_video_id
- **Field Type:** Text
- **Required:** Yes
- **Instructions:** Enter the YouTube video ID (e.g., dQw4w9WgXcQ)
- **Placeholder:** dQw4w9WgXcQ

### **Field 2: YouTube URL**
- **Field Label:** YouTube URL
- **Field Name:** youtube_url
- **Field Type:** URL
- **Required:** No
- **Instructions:** Full YouTube video URL (auto-filled by sync)

### **Field 3: Video Duration**
- **Field Label:** Duration
- **Field Name:** video_duration
- **Field Type:** Text
- **Required:** No
- **Instructions:** Video duration (e.g., 5:23)
- **Placeholder:** 0:00

### **Field 4: View Count**
- **Field Label:** View Count
- **Field Name:** video_views
- **Field Type:** Number
- **Required:** No
- **Instructions:** Number of YouTube views

### **Field 5: Video Tags**
- **Field Label:** Video Tags
- **Field Name:** video_tags
- **Field Type:** Textarea
- **Required:** No
- **Instructions:** Comma-separated tags from YouTube
- **Rows:** 3

### **Field 6: Custom Thumbnail**
- **Field Label:** Custom Thumbnail
- **Field Name:** custom_thumbnail
- **Field Type:** Image
- **Required:** No
- **Instructions:** Upload custom thumbnail (optional - YouTube thumbnail used by default)
- **Return Format:** Array

### **Field 7: Video Quality**
- **Field Label:** Video Quality
- **Field Name:** video_quality
- **Field Type:** Select
- **Required:** No
- **Choices:**
  - 720p : 720p HD
  - 1080p : 1080p Full HD
  - 1440p : 1440p 2K
  - 2160p : 2160p 4K
- **Default Value:** 1080p

### **Field 8: Equipment Used**
- **Field Label:** Equipment Used
- **Field Name:** equipment_used
- **Field Type:** Textarea
- **Required:** No
- **Instructions:** List equipment/software used in video
- **Rows:** 4

---

## 📍 **Step 3: Location Rules**

### **Rule:** Show this field group if
- **Post Type** is equal to **video**

---

## ⚙️ **Step 4: Settings**

### **Options:**
- **Style:** Default (WP metabox)
- **Position:** Normal (after content)
- **Label placement:** Top aligned
- **Instruction placement:** Label
- **Hide on screen:** 
  - [x] Custom Fields (to hide default custom fields)

---

## 💾 **Step 5: Save & Test**

1. **Click:** "Publish" to save the field group
2. **Navigate to:** Videos → Add New
3. **Verify:** All fields appear correctly
4. **Test:** Add a sample video with YouTube ID

---

## 🧪 **Quick Test Video**

### **Sample Data:**
- **Title:** Music Production Basics - Getting Started
- **YouTube Video ID:** dQw4w9WgXcQ
- **Duration:** 5:23
- **View Count:** 1000
- **Tags:** music production, tutorial, beginner
- **Category:** Tutorials

---

## 🔄 **What Happens Next**

After creating the ACF fields:

1. **Manual Entry:** You can manually add videos
2. **Auto-Sync:** Enable YouTube API for automatic sync
3. **Gatsby Integration:** Uncomment video queries
4. **Real Content:** Replace placeholder data

---

## 🚨 **Troubleshooting**

### **Fields Not Showing:**
- Check location rules are set to "video" post type
- Verify ACF Pro is active
- Clear cache if using caching plugins

### **GraphQL Issues:**
- Install WPGraphQL for ACF plugin
- Regenerate GraphQL schema
- Check field names match exactly

### **Sync Problems:**
- Verify YouTube API credentials
- Check video post type registration
- Review error logs in WordPress

---

## 📚 **Next Steps**

1. ✅ Create field group (this guide)
2. 🔄 Add YouTube API credentials
3. 🔄 Enable auto-sync
4. 🔄 Test with real videos
5. 🔄 Update Gatsby queries
