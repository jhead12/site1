# YouTube Auto-Sync Setup Guide
## Automate Video Updates from YouTube Channel

### Overview
This system automatically syncs new videos from your YouTube channel to your WordPress site every hour, eliminating manual updates.

---

## Setup Steps

### 1. Get YouTube Data API v3 Key

1. **Go to Google Cloud Console**: https://console.cloud.google.com/
2. **Create/Select Project**: Create a new project or select existing
3. **Enable YouTube Data API v3**:
   - Go to "APIs & Services" → "Library"
   - Search for "YouTube Data API v3"
   - Click "Enable"
4. **Create API Key**:
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "API Key"
   - Copy the API key
5. **Restrict API Key** (recommended):
   - Click on your API key
   - Under "API restrictions", select "YouTube Data API v3"

### 2. Get Your YouTube Channel ID

**Method 1**: From your channel URL
- If your URL is `youtube.com/channel/UC1234567890`, the ID is `UC1234567890`

**Method 2**: Using YouTube Studio
- Go to YouTube Studio → Settings → Channel → Advanced settings
- Copy the "Channel ID"

**Method 3**: Using the API
- Visit: `https://www.googleapis.com/youtube/v3/channels?part=id&forUsername=YOUR_USERNAME&key=YOUR_API_KEY`

### 3. Install the Auto-Sync Code

1. **Copy the code** from `/scripts/youtube-auto-sync.php`
2. **Add to WordPress** `functions.php`:
   ```php
   // Update these with your actual values
   define('YOUTUBE_API_KEY', '');
   define('YOUTUBE_CHANNEL_ID', '');
   
   // Then paste the entire auto-sync code below
   ```

### 4. Set Up Video Custom Post Type

Add this to your `functions.php` (if not already added):
```php
// Register Videos Custom Post Type
function register_youtube_videos_post_type() {
    register_post_type('video', [
        'labels' => [
            'name' => 'Videos',
            'singular_name' => 'Video',
        ],
        'public' => true,
        'has_archive' => true,
        'supports' => ['title', 'editor', 'excerpt', 'thumbnail'],
        'show_in_rest' => true,
        'show_in_graphql' => true,
        'graphql_single_name' => 'video',
        'graphql_plural_name' => 'videos',
        'menu_icon' => 'dashicons-video-alt3',
    ]);
}
add_action('init', 'register_youtube_videos_post_type');
```

### 5. Create ACF Fields

In WordPress Admin → Custom Fields → Field Groups:

| Field Label | Field Name | Type | Required |
|-------------|------------|------|----------|
| YouTube Video ID | youtube_video_id | Text | Yes |
| YouTube URL | youtube_url | URL | No |
| Video Duration | video_duration | Text | No |
| View Count | video_views | Number | No |
| Video Tags | video_tags | Textarea | No |

---

## How It Works

### Automatic Sync (Every Hour)
- **WordPress Cron** runs the sync every hour
- **Fetches latest videos** from your YouTube channel
- **Creates/updates** WordPress video posts
- **Downloads thumbnails** as featured images
- **Auto-categorizes** based on video content

### What Gets Synced
✅ **Video title** → Post title  
✅ **Video description** → Post content  
✅ **Upload date** → Post date  
✅ **YouTube thumbnail** → Featured image  
✅ **View count** → ACF field  
✅ **Duration** → ACF field  
✅ **Tags** → ACF field  
✅ **Auto-categorization** → Video categories  

### Manual Sync
- Go to **WordPress Admin → Tools → YouTube Sync**
- Click **"Sync Now"** to manually trigger sync
- View last sync time and status

---

## Alternative Methods

### Option 2: GitHub Actions (Advanced)
```yaml
# .github/workflows/youtube-sync.yml
name: YouTube Sync
on:
  schedule:
    - cron: '0 */6 * * *'  # Every 6 hours
  workflow_dispatch:

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Sync YouTube Videos
        run: |
          curl -X POST "${{ secrets.WORDPRESS_SYNC_URL }}" \
            -H "Authorization: Bearer ${{ secrets.WORDPRESS_TOKEN }}"
```

### Option 3: Zapier/IFTTT (No Code)
1. **Trigger**: New video on YouTube channel
2. **Action**: Create WordPress post via REST API
3. **Setup**: Connect YouTube → WordPress accounts

### Option 4: Webhook (Real-time)
- YouTube sends webhook when video uploaded
- WordPress receives and processes immediately
- Requires public endpoint setup

---

## Benefits of Auto-Sync

🚀 **Zero Manual Work**: Videos appear automatically  
⏱️ **Fast Updates**: New videos sync within an hour  
🖼️ **Thumbnails**: Automatic featured image download  
📊 **View Counts**: Live view count updates  
🏷️ **Auto-Categories**: Smart categorization  
🔄 **Bi-directional**: Updates existing videos too  

---

## Troubleshooting

**Common Issues:**
- **API Key Issues**: Check Google Cloud Console
- **Channel ID Wrong**: Use YouTube Studio to verify
- **Cron Not Running**: Check WordPress cron status
- **Permission Errors**: Ensure ACF fields exist

**Debug Log:**
Check WordPress error logs for sync status and issues.

**Test Sync:**
Use the manual sync button to test before automation.
