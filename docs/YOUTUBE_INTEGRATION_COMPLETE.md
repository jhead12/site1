# YouTube Integration Implementation Guide

## Overview
This guide provides step-by-step instructions for implementing YouTube video synchronization with your WordPress + Gatsby music platform.

## Features Implemented
- ✅ WordPress custom post type for videos
- ✅ ACF fields for YouTube metadata
- ✅ Gatsby video template and archive page
- ✅ Video player component with related videos
- ✅ Category filtering for videos
- 🔄 **YouTube API sync (requires completion)**

## WordPress Setup (Already Done)

### Custom Post Type: Videos
Located in `/Users/jeldonmusic/Local Sites/w-jeldonmusic/app/public/wp-content/themes/twentytwentyfour/functions-music.php`

### ACF Fields
- YouTube URL
- Video Duration
- Video Description
- Video Category
- Thumbnail URL
- Video Tags
- Published Date

## YouTube API Integration

### Step 1: Get YouTube API Key
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable YouTube Data API v3
4. Create credentials (API Key)
5. Restrict the key to YouTube Data API v3

### Step 2: Install YouTube Sync Plugin (Create this file)

```php
<?php
// File: /wp-content/plugins/youtube-sync/youtube-sync.php

/*
Plugin Name: YouTube Channel Sync
Description: Sync YouTube videos to WordPress custom post type
Version: 1.0
Author: Your Name
*/

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

class YouTubeSyncPlugin {
    private $api_key;
    private $channel_id;
    
    public function __construct() {
        add_action('init', array($this, 'init'));
        add_action('admin_menu', array($this, 'admin_menu'));
        add_action('wp_ajax_sync_youtube_videos', array($this, 'sync_youtube_videos'));
        
        // Schedule automatic sync
        add_action('wp', array($this, 'schedule_sync'));
        add_action('youtube_sync_cron', array($this, 'auto_sync_videos'));
    }
    
    public function init() {
        $this->api_key = get_option('youtube_api_key', '');
        $this->channel_id = get_option('youtube_channel_id', '');
    }
    
    public function admin_menu() {
        add_submenu_page(
            'edit.php?post_type=video',
            'YouTube Sync',
            'YouTube Sync',
            'manage_options',
            'youtube-sync',
            array($this, 'admin_page')
        );
    }
    
    public function admin_page() {
        if (isset($_POST['save_settings'])) {
            update_option('youtube_api_key', sanitize_text_field($_POST['youtube_api_key']));
            update_option('youtube_channel_id', sanitize_text_field($_POST['youtube_channel_id']));
            echo '<div class="notice notice-success"><p>Settings saved!</p></div>';
        }
        
        $api_key = get_option('youtube_api_key', '');
        $channel_id = get_option('youtube_channel_id', '');
        
        ?>
        <div class="wrap">
            <h1>YouTube Channel Sync</h1>
            
            <form method="post">
                <table class="form-table">
                    <tr>
                        <th scope="row">YouTube API Key</th>
                        <td>
                            <input type="text" name="youtube_api_key" value="<?php echo esc_attr($api_key); ?>" class="regular-text" />
                            <p class="description">Get this from Google Cloud Console</p>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">Channel ID</th>
                        <td>
                            <input type="text" name="youtube_channel_id" value="<?php echo esc_attr($channel_id); ?>" class="regular-text" />
                            <p class="description">Your YouTube channel ID</p>
                        </td>
                    </tr>
                </table>
                
                <?php submit_button('Save Settings', 'primary', 'save_settings'); ?>
            </form>
            
            <h2>Manual Sync</h2>
            <p>Click the button below to manually sync your latest YouTube videos.</p>
            <button id="sync-videos" class="button button-primary">Sync Videos Now</button>
            <div id="sync-result"></div>
            
            <script>
            jQuery(document).ready(function($) {
                $('#sync-videos').on('click', function() {
                    var button = $(this);
                    button.prop('disabled', true).text('Syncing...');
                    
                    $.ajax({
                        url: ajaxurl,
                        type: 'POST',
                        data: {
                            action: 'sync_youtube_videos',
                            _ajax_nonce: '<?php echo wp_create_nonce('sync_youtube_videos'); ?>'
                        },
                        success: function(response) {
                            $('#sync-result').html('<div class="notice notice-success"><p>' + response.data + '</p></div>');
                            button.prop('disabled', false).text('Sync Videos Now');
                        },
                        error: function() {
                            $('#sync-result').html('<div class="notice notice-error"><p>Error syncing videos</p></div>');
                            button.prop('disabled', false).text('Sync Videos Now');
                        }
                    });
                });
            });
            </script>
        </div>
        <?php
    }
    
    public function sync_youtube_videos() {
        check_ajax_referer('sync_youtube_videos');
        
        if (!current_user_can('manage_options')) {
            wp_die('Unauthorized');
        }
        
        $synced = $this->fetch_and_sync_videos();
        
        if ($synced !== false) {
            wp_send_json_success("Successfully synced {$synced} videos!");
        } else {
            wp_send_json_error('Failed to sync videos. Check your API key and channel ID.');
        }
    }
    
    private function fetch_and_sync_videos($max_results = 10) {
        if (empty($this->api_key) || empty($this->channel_id)) {
            return false;
        }
        
        $url = "https://www.googleapis.com/youtube/v3/search?" . http_build_query([
            'key' => $this->api_key,
            'channelId' => $this->channel_id,
            'part' => 'snippet',
            'order' => 'date',
            'maxResults' => $max_results,
            'type' => 'video'
        ]);
        
        $response = wp_remote_get($url);
        
        if (is_wp_error($response)) {
            return false;
        }
        
        $body = wp_remote_retrieve_body($response);
        $data = json_decode($body, true);
        
        if (!isset($data['items'])) {
            return false;
        }
        
        $synced_count = 0;
        
        foreach ($data['items'] as $video) {
            $video_id = $video['id']['videoId'];
            $title = $video['snippet']['title'];
            $description = $video['snippet']['description'];
            $thumbnail = $video['snippet']['thumbnails']['high']['url'];
            $published_at = $video['snippet']['publishedAt'];
            
            // Check if video already exists
            $existing = get_posts([
                'post_type' => 'video',
                'meta_query' => [
                    [
                        'key' => 'youtube_video_id',
                        'value' => $video_id,
                        'compare' => '='
                    ]
                ],
                'posts_per_page' => 1
            ]);
            
            if (!empty($existing)) {
                continue; // Skip if already exists
            }
            
            // Create new video post
            $post_id = wp_insert_post([
                'post_title' => $title,
                'post_content' => $description,
                'post_status' => 'publish',
                'post_type' => 'video',
                'post_date' => date('Y-m-d H:i:s', strtotime($published_at))
            ]);
            
            if ($post_id) {
                // Save ACF fields
                update_field('youtube_url', "https://www.youtube.com/watch?v={$video_id}", $post_id);
                update_field('youtube_video_id', $video_id, $post_id);
                update_field('video_thumbnail', $thumbnail, $post_id);
                update_field('video_description', $description, $post_id);
                
                // Get additional video details
                $details = $this->get_video_details($video_id);
                if ($details) {
                    update_field('video_duration', $details['duration'], $post_id);
                    update_field('video_tags', $details['tags'], $post_id);
                }
                
                $synced_count++;
            }
        }
        
        return $synced_count;
    }
    
    private function get_video_details($video_id) {
        $url = "https://www.googleapis.com/youtube/v3/videos?" . http_build_query([
            'key' => $this->api_key,
            'id' => $video_id,
            'part' => 'contentDetails,snippet'
        ]);
        
        $response = wp_remote_get($url);
        
        if (is_wp_error($response)) {
            return false;
        }
        
        $body = wp_remote_retrieve_body($response);
        $data = json_decode($body, true);
        
        if (!isset($data['items'][0])) {
            return false;
        }
        
        $video = $data['items'][0];
        
        return [
            'duration' => $this->parse_duration($video['contentDetails']['duration']),
            'tags' => isset($video['snippet']['tags']) ? implode(', ', $video['snippet']['tags']) : ''
        ];
    }
    
    private function parse_duration($duration) {
        // Convert YouTube duration format (PT4M13S) to readable format
        $interval = new DateInterval($duration);
        $format = '';
        
        if ($interval->h > 0) {
            $format .= '%h:';
        }
        $format .= '%I:%S';
        
        return $interval->format($format);
    }
    
    public function schedule_sync() {
        if (!wp_next_scheduled('youtube_sync_cron')) {
            wp_schedule_event(time(), 'hourly', 'youtube_sync_cron');
        }
    }
    
    public function auto_sync_videos() {
        $this->fetch_and_sync_videos(5); // Sync 5 latest videos automatically
    }
}

new YouTubeSyncPlugin();
?>
```

### Step 3: Update Gatsby Configuration

Add to your `gatsby-config.js`:

```javascript
{
  resolve: 'gatsby-source-wordpress',
  options: {
    url: process.env.WPGRAPHQL_URL,
    schema: {
      timeout: 30000,
      perPage: 20,
    },
    type: {
      WpVideo: {
        localFile: {
          requestConcurrency: 1,
        },
      },
    },
  },
}
```

## Testing the Integration

### 1. WordPress Test
```bash
# Run this to check WordPress video sync
curl -X POST "http://your-site.local/wp-admin/admin-ajax.php" \
  -d "action=sync_youtube_videos" \
  -d "_ajax_nonce=YOUR_NONCE"
```

### 2. Gatsby Test
```bash
# Build and check for video pages
npm run build
```

## Troubleshooting

### Common Issues
1. **API Key Invalid**: Check Google Cloud Console settings
2. **Channel ID Wrong**: Use YouTube Channel ID, not username
3. **Quota Exceeded**: YouTube API has daily limits
4. **WordPress Sync Fails**: Check PHP error logs

### Debug Commands
```bash
# Check video posts in WordPress
wp post list --post_type=video

# Check Gatsby GraphQL
http://localhost:8000/___graphql
```

## Next Steps

1. Set up YouTube API credentials
2. Install the YouTube sync plugin
3. Configure automatic sync schedule
4. Test manual sync functionality
5. Monitor sync logs and errors

## API Limits
- YouTube Data API: 10,000 units/day (free)
- Each video search: ~100 units
- Each video details: ~1 unit

Plan your sync frequency accordingly.
