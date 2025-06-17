<?php
/**
 * YouTube Video Integration for WordPress
 * Add this to your WordPress theme's functions.php
 */

// Register YouTube Videos Custom Post Type
function register_youtube_videos_post_type() {
    register_post_type('video', [
        'labels' => [
            'name' => 'Videos',
            'singular_name' => 'Video',
            'add_new' => 'Add New Video',
            'add_new_item' => 'Add New Video',
            'edit_item' => 'Edit Video',
            'new_item' => 'New Video',
            'view_item' => 'View Video',
            'search_items' => 'Search Videos',
            'not_found' => 'No videos found',
            'not_found_in_trash' => 'No videos found in trash'
        ],
        'public' => true,
        'has_archive' => true,
        'supports' => ['title', 'editor', 'excerpt', 'thumbnail'],
        'show_in_rest' => true,
        'show_in_graphql' => true,
        'graphql_single_name' => 'video',
        'graphql_plural_name' => 'videos',
        'menu_icon' => 'dashicons-video-alt3',
        'rewrite' => ['slug' => 'videos'],
    ]);
}
add_action('init', 'register_youtube_videos_post_type');

// Register Video Categories
function register_video_categories() {
    register_taxonomy('video_category', 'video', [
        'labels' => [
            'name' => 'Video Categories',
            'singular_name' => 'Video Category',
        ],
        'hierarchical' => true,
        'public' => true,
        'show_in_rest' => true,
        'show_in_graphql' => true,
        'graphql_single_name' => 'videoCategory',
        'graphql_plural_name' => 'videoCategories',
    ]);
}
add_action('init', 'register_video_categories');

// ACF Fields for Videos (export this from ACF and import)
function create_video_acf_fields() {
    if (function_exists('acf_add_local_field_group')) {
        acf_add_local_field_group([
            'key' => 'group_videos',
            'title' => 'Video Details',
            'fields' => [
                [
                    'key' => 'field_youtube_video_id',
                    'label' => 'YouTube Video ID',
                    'name' => 'youtube_video_id',
                    'type' => 'text',
                    'instructions' => 'Enter the YouTube video ID (e.g., dQw4w9WgXcQ)',
                    'required' => 1,
                ],
                [
                    'key' => 'field_youtube_url',
                    'label' => 'YouTube URL',
                    'name' => 'youtube_url',
                    'type' => 'url',
                    'instructions' => 'Full YouTube video URL',
                ],
                [
                    'key' => 'field_video_duration',
                    'label' => 'Duration',
                    'name' => 'video_duration',
                    'type' => 'text',
                    'instructions' => 'Video duration (e.g., 5:23)',
                ],
                [
                    'key' => 'field_video_views',
                    'label' => 'View Count',
                    'name' => 'video_views',
                    'type' => 'number',
                    'instructions' => 'Number of views',
                ],
                [
                    'key' => 'field_video_tags',
                    'label' => 'Video Tags',
                    'name' => 'video_tags',
                    'type' => 'textarea',
                    'instructions' => 'Comma-separated tags from YouTube',
                ],
                [
                    'key' => 'field_video_thumbnail',
                    'label' => 'Custom Thumbnail',
                    'name' => 'video_thumbnail',
                    'type' => 'image',
                    'instructions' => 'Upload custom thumbnail or leave blank to use YouTube thumbnail',
                ],
            ],
            'location' => [
                [
                    [
                        'param' => 'post_type',
                        'operator' => '==',
                        'value' => 'video',
                    ],
                ],
            ],
        ]);
    }
}
add_action('acf/init', 'create_video_acf_fields');

// YouTube API Integration (requires API key)
function sync_youtube_videos() {
    $api_key = get_option('youtube_api_key'); // Set this in WordPress admin
    $channel_id = get_option('youtube_channel_id'); // Set this in WordPress admin
    
    if (!$api_key || !$channel_id) {
        return;
    }
    
    $api_url = "https://www.googleapis.com/youtube/v3/search?key={$api_key}&channelId={$channel_id}&part=snippet,id&order=date&maxResults=20";
    
    $response = wp_remote_get($api_url);
    
    if (is_wp_error($response)) {
        return;
    }
    
    $body = wp_remote_retrieve_body($response);
    $data = json_decode($body, true);
    
    if (!isset($data['items'])) {
        return;
    }
    
    foreach ($data['items'] as $item) {
        if ($item['id']['kind'] !== 'youtube#video') {
            continue;
        }
        
        $video_id = $item['id']['videoId'];
        $existing_post = get_posts([
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
        
        if (!empty($existing_post)) {
            continue; // Video already exists
        }
        
        // Create new video post
        $post_id = wp_insert_post([
            'post_title' => $item['snippet']['title'],
            'post_content' => $item['snippet']['description'],
            'post_excerpt' => wp_trim_words($item['snippet']['description'], 20),
            'post_status' => 'publish',
            'post_type' => 'video',
            'post_date' => date('Y-m-d H:i:s', strtotime($item['snippet']['publishedAt'])),
        ]);
        
        if (!is_wp_error($post_id)) {
            // Add ACF fields
            update_field('youtube_video_id', $video_id, $post_id);
            update_field('youtube_url', "https://www.youtube.com/watch?v={$video_id}", $post_id);
            
            // Set featured image from YouTube thumbnail
            $thumbnail_url = $item['snippet']['thumbnails']['high']['url'];
            $image_id = upload_image_from_url($thumbnail_url, $post_id);
            if ($image_id) {
                set_post_thumbnail($post_id, $image_id);
            }
        }
    }
}

// Helper function to upload image from URL
function upload_image_from_url($image_url, $post_id = 0) {
    $upload_dir = wp_upload_dir();
    $image_data = file_get_contents($image_url);
    $filename = basename($image_url);
    
    if (wp_mkdir_p($upload_dir['path'])) {
        $file = $upload_dir['path'] . '/' . $filename;
    } else {
        $file = $upload_dir['basedir'] . '/' . $filename;
    }
    
    file_put_contents($file, $image_data);
    
    $wp_filetype = wp_check_filetype($filename, null);
    $attachment = array(
        'post_mime_type' => $wp_filetype['type'],
        'post_title' => sanitize_file_name($filename),
        'post_content' => '',
        'post_status' => 'inherit'
    );
    
    $attach_id = wp_insert_attachment($attachment, $file, $post_id);
    require_once(ABSPATH . 'wp-admin/includes/image.php');
    $attach_data = wp_generate_attachment_metadata($attach_id, $file);
    wp_update_attachment_metadata($attach_id, $attach_data);
    
    return $attach_id;
}

// Schedule automatic sync (daily)
function schedule_youtube_sync() {
    if (!wp_next_scheduled('sync_youtube_videos_hook')) {
        wp_schedule_event(time(), 'daily', 'sync_youtube_videos_hook');
    }
}
add_action('wp', 'schedule_youtube_sync');
add_action('sync_youtube_videos_hook', 'sync_youtube_videos');

// Add YouTube settings to WordPress admin
function youtube_integration_settings() {
    add_options_page(
        'YouTube Integration',
        'YouTube Settings',
        'manage_options',
        'youtube-settings',
        'youtube_settings_page'
    );
}
add_action('admin_menu', 'youtube_integration_settings');

function youtube_settings_page() {
    if (isset($_POST['submit'])) {
        update_option('youtube_api_key', sanitize_text_field($_POST['youtube_api_key']));
        update_option('youtube_channel_id', sanitize_text_field($_POST['youtube_channel_id']));
        echo '<div class="notice notice-success"><p>Settings saved!</p></div>';
    }
    
    $api_key = get_option('youtube_api_key', '');
    $channel_id = get_option('youtube_channel_id', '');
    ?>
    <div class="wrap">
        <h1>YouTube Integration Settings</h1>
        <form method="post" action="">
            <table class="form-table">
                <tr>
                    <th scope="row">YouTube API Key</th>
                    <td><input name="youtube_api_key" type="text" value="<?php echo esc_attr($api_key); ?>" class="regular-text" /></td>
                </tr>
                <tr>
                    <th scope="row">YouTube Channel ID</th>
                    <td><input name="youtube_channel_id" type="text" value="<?php echo esc_attr($channel_id); ?>" class="regular-text" /></td>
                </tr>
            </table>
            <?php submit_button(); ?>
        </form>
        
        <h2>Manual Sync</h2>
        <p><a href="<?php echo admin_url('admin.php?page=youtube-settings&sync=1'); ?>" class="button">Sync Videos Now</a></p>
        
        <?php if (isset($_GET['sync']) && $_GET['sync'] == '1'): ?>
            <?php sync_youtube_videos(); ?>
            <div class="notice notice-success"><p>Videos synced successfully!</p></div>
        <?php endif; ?>
    </div>
    <?php
}
?>
