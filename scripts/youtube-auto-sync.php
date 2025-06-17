<?php
/**
 * YouTube Auto-Sync for WordPress
 * Automatically sync videos from YouTube channel
 * Add this to your WordPress theme's functions.php
 */

// YouTube API Configuration
define('YOUTUBE_API_KEY', 'YOUR_YOUTUBE_API_KEY_HERE');
define('YOUTUBE_CHANNEL_ID', 'YOUR_CHANNEL_ID_HERE');

// Schedule YouTube sync
function schedule_youtube_sync() {
    if (!wp_next_scheduled('youtube_auto_sync')) {
        wp_schedule_event(time(), 'hourly', 'youtube_auto_sync');
    }
}
add_action('wp', 'schedule_youtube_sync');

// Main sync function
function youtube_auto_sync() {
    error_log('YouTube sync started at ' . date('Y-m-d H:i:s'));
    
    $api_key = YOUTUBE_API_KEY;
    $channel_id = YOUTUBE_CHANNEL_ID;
    
    if (empty($api_key) || empty($channel_id)) {
        error_log('YouTube API key or channel ID not set');
        return false;
    }
    
    // Get videos from YouTube API
    $videos = fetch_youtube_videos($api_key, $channel_id);
    
    if (!$videos) {
        error_log('Failed to fetch videos from YouTube');
        return false;
    }
    
    $synced_count = 0;
    
    foreach ($videos as $video) {
        if (sync_video_to_wordpress($video)) {
            $synced_count++;
        }
    }
    
    error_log("YouTube sync completed. {$synced_count} videos processed.");
    
    // Update last sync time
    update_option('youtube_last_sync', current_time('mysql'));
}
add_action('youtube_auto_sync', 'youtube_auto_sync');

// Fetch videos from YouTube API
function fetch_youtube_videos($api_key, $channel_id, $max_results = 50) {
    $url = "https://www.googleapis.com/youtube/v3/search?" . http_build_query([
        'key' => $api_key,
        'channelId' => $channel_id,
        'part' => 'snippet',
        'type' => 'video',
        'order' => 'date',
        'maxResults' => $max_results
    ]);
    
    $response = wp_remote_get($url);
    
    if (is_wp_error($response)) {
        error_log('YouTube API request failed: ' . $response->get_error_message());
        return false;
    }
    
    $body = wp_remote_retrieve_body($response);
    $data = json_decode($body, true);
    
    if (!isset($data['items'])) {
        error_log('Invalid YouTube API response');
        return false;
    }
    
    $videos = [];
    
    foreach ($data['items'] as $item) {
        $video_id = $item['id']['videoId'];
        
        // Get detailed video info
        $details = fetch_video_details($api_key, $video_id);
        
        if ($details) {
            $videos[] = array_merge($item, $details);
        }
    }
    
    return $videos;
}

// Get detailed video information
function fetch_video_details($api_key, $video_id) {
    $url = "https://www.googleapis.com/youtube/v3/videos?" . http_build_query([
        'key' => $api_key,
        'id' => $video_id,
        'part' => 'snippet,statistics,contentDetails'
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
    
    return $data['items'][0];
}

// Sync video to WordPress
function sync_video_to_wordpress($video_data) {
    $video_id = $video_data['id']['videoId'] ?? $video_data['id'];
    $snippet = $video_data['snippet'];
    $statistics = $video_data['statistics'] ?? [];
    $content_details = $video_data['contentDetails'] ?? [];
    
    // Check if video already exists
    $existing_posts = get_posts([
        'post_type' => 'video',
        'meta_query' => [
            [
                'key' => 'youtube_video_id',
                'value' => $video_id,
                'compare' => '='
            ]
        ],
        'post_status' => 'any'
    ]);
    
    $post_data = [
        'post_title' => $snippet['title'],
        'post_content' => $snippet['description'],
        'post_excerpt' => wp_trim_words($snippet['description'], 30),
        'post_status' => 'publish',
        'post_type' => 'video',
        'post_date' => date('Y-m-d H:i:s', strtotime($snippet['publishedAt']))
    ];
    
    if (!empty($existing_posts)) {
        // Update existing post
        $post_data['ID'] = $existing_posts[0]->ID;
        $post_id = wp_update_post($post_data);
        error_log("Updated existing video: {$snippet['title']}");
    } else {
        // Create new post
        $post_id = wp_insert_post($post_data);
        error_log("Created new video: {$snippet['title']}");
    }
    
    if (is_wp_error($post_id) || !$post_id) {
        error_log("Failed to sync video: {$snippet['title']}");
        return false;
    }
    
    // Update ACF fields
    update_field('youtube_video_id', $video_id, $post_id);
    update_field('youtube_url', "https://www.youtube.com/watch?v={$video_id}", $post_id);
    
    if (isset($content_details['duration'])) {
        $duration = convert_youtube_duration($content_details['duration']);
        update_field('video_duration', $duration, $post_id);
    }
    
    if (isset($statistics['viewCount'])) {
        update_field('video_views', intval($statistics['viewCount']), $post_id);
    }
    
    if (isset($snippet['tags'])) {
        update_field('video_tags', implode(', ', $snippet['tags']), $post_id);
    }
    
    // Set featured image from YouTube thumbnail
    if (isset($snippet['thumbnails']['maxres']['url'])) {
        set_youtube_thumbnail($post_id, $snippet['thumbnails']['maxres']['url'], $snippet['title']);
    } elseif (isset($snippet['thumbnails']['high']['url'])) {
        set_youtube_thumbnail($post_id, $snippet['thumbnails']['high']['url'], $snippet['title']);
    }
    
    // Set categories based on YouTube tags or description
    set_video_categories($post_id, $snippet);
    
    return true;
}

// Convert YouTube duration format (PT4M13S) to readable format (4:13)
function convert_youtube_duration($duration) {
    $interval = new DateInterval($duration);
    
    $hours = $interval->h;
    $minutes = $interval->i;
    $seconds = $interval->s;
    
    if ($hours > 0) {
        return sprintf('%d:%02d:%02d', $hours, $minutes, $seconds);
    } else {
        return sprintf('%d:%02d', $minutes, $seconds);
    }
}

// Set YouTube thumbnail as featured image
function set_youtube_thumbnail($post_id, $thumbnail_url, $title) {
    // Download and set as featured image
    $upload_dir = wp_upload_dir();
    $image_data = file_get_contents($thumbnail_url);
    $filename = sanitize_file_name($title) . '-' . $post_id . '.jpg';
    
    if (wp_mkdir_p($upload_dir['path'])) {
        $file = $upload_dir['path'] . '/' . $filename;
    } else {
        $file = $upload_dir['basedir'] . '/' . $filename;
    }
    
    file_put_contents($file, $image_data);
    
    $wp_filetype = wp_check_filetype($filename, null);
    $attachment = [
        'post_mime_type' => $wp_filetype['type'],
        'post_title' => sanitize_file_name($filename),
        'post_content' => '',
        'post_status' => 'inherit'
    ];
    
    $attach_id = wp_insert_attachment($attachment, $file, $post_id);
    require_once(ABSPATH . 'wp-admin/includes/image.php');
    $attach_data = wp_generate_attachment_metadata($attach_id, $file);
    wp_update_attachment_metadata($attach_id, $attach_data);
    
    set_post_thumbnail($post_id, $attach_id);
}

// Auto-categorize videos based on content
function set_video_categories($post_id, $snippet) {
    $title = strtolower($snippet['title']);
    $description = strtolower($snippet['description']);
    $tags = isset($snippet['tags']) ? array_map('strtolower', $snippet['tags']) : [];
    
    $categories = [];
    
    // Auto-categorize based on keywords
    $category_keywords = [
        'tutorials' => ['tutorial', 'how to', 'guide', 'lesson', 'learn'],
        'beat-making' => ['beat', 'producer', 'production', 'making beats'],
        'mixing' => ['mixing', 'mix', 'mastering', 'audio'],
        'reviews' => ['review', 'gear', 'equipment', 'test'],
        'live' => ['live', 'performance', 'concert', 'stream']
    ];
    
    foreach ($category_keywords as $category_slug => $keywords) {
        foreach ($keywords as $keyword) {
            if (strpos($title, $keyword) !== false || 
                strpos($description, $keyword) !== false || 
                in_array($keyword, $tags)) {
                $categories[] = $category_slug;
                break;
            }
        }
    }
    
    // Set categories
    if (!empty($categories)) {
        wp_set_object_terms($post_id, $categories, 'video_category');
    }
}

// Manual sync button in admin
function add_youtube_sync_admin_page() {
    add_management_page(
        'YouTube Sync',
        'YouTube Sync',
        'manage_options',
        'youtube-sync',
        'youtube_sync_admin_page'
    );
}
add_action('admin_menu', 'add_youtube_sync_admin_page');

function youtube_sync_admin_page() {
    if (isset($_POST['sync_now'])) {
        youtube_auto_sync();
        echo '<div class="notice notice-success"><p>YouTube sync completed!</p></div>';
    }
    
    $last_sync = get_option('youtube_last_sync', 'Never');
    
    ?>
    <div class="wrap">
        <h1>YouTube Auto-Sync</h1>
        <p>Last sync: <?php echo $last_sync; ?></p>
        
        <form method="post">
            <input type="hidden" name="sync_now" value="1">
            <?php submit_button('Sync Now'); ?>
        </form>
        
        <h2>Configuration</h2>
        <p>Current API Key: <?php echo YOUTUBE_API_KEY ? '✓ Set' : '✗ Not set'; ?></p>
        <p>Current Channel ID: <?php echo YOUTUBE_CHANNEL_ID ? '✓ Set' : '✗ Not set'; ?></p>
    </div>
    <?php
}

// Cleanup scheduled events on deactivation
function cleanup_youtube_sync() {
    wp_clear_scheduled_hook('youtube_auto_sync');
}
register_deactivation_hook(__FILE__, 'cleanup_youtube_sync');
?>
