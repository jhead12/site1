<?php
/**
 * WordPress Video Integration - Complete Setup
 * Add this entire block to your WordPress theme's functions.php file
 * 
 * Location: /Volumes/jeldonmusic/Local Sites/w-jeldonmusic/app/public/wp-content/themes/[your-theme]/functions.php
 */

// ========================================
// 1. REGISTER VIDEO CUSTOM POST TYPE
// ========================================

function jeldon_register_video_post_type() {
    register_post_type('video', array(
        'labels' => array(
            'name' => 'Videos',
            'singular_name' => 'Video',
            'add_new' => 'Add New Video',
            'add_new_item' => 'Add New Video',
            'edit_item' => 'Edit Video',
            'new_item' => 'New Video',
            'view_item' => 'View Video',
            'search_items' => 'Search Videos',
            'not_found' => 'No videos found',
            'not_found_in_trash' => 'No videos found in trash',
            'all_items' => 'All Videos',
            'menu_name' => 'Videos'
        ),
        'public' => true,
        'has_archive' => true,
        'publicly_queryable' => true,
        'show_ui' => true,
        'show_in_menu' => true,
        'query_var' => true,
        'capability_type' => 'post',
        'hierarchical' => false,
        'menu_position' => 5,
        'menu_icon' => 'dashicons-video-alt3',
        'supports' => array('title', 'editor', 'excerpt', 'thumbnail', 'comments', 'custom-fields'),
        'show_in_rest' => true,
        'rest_base' => 'videos',
        'show_in_graphql' => true,
        'graphql_single_name' => 'video',
        'graphql_plural_name' => 'videos',
        'rewrite' => array(
            'slug' => 'videos',
            'with_front' => false
        ),
    ));
}
add_action('init', 'jeldon_register_video_post_type');

// ========================================
// 2. REGISTER VIDEO CATEGORIES TAXONOMY
// ========================================

function jeldon_register_video_categories() {
    register_taxonomy('video_category', 'video', array(
        'labels' => array(
            'name' => 'Video Categories',
            'singular_name' => 'Video Category',
            'menu_name' => 'Categories',
            'all_items' => 'All Categories',
            'edit_item' => 'Edit Category',
            'view_item' => 'View Category',
            'update_item' => 'Update Category',
            'add_new_item' => 'Add New Category',
            'new_item_name' => 'New Category Name',
            'search_items' => 'Search Categories',
            'not_found' => 'No categories found'
        ),
        'hierarchical' => true,
        'public' => true,
        'show_ui' => true,
        'show_admin_column' => true,
        'show_in_nav_menus' => true,
        'show_tagcloud' => true,
        'show_in_rest' => true,
        'rest_base' => 'video-categories',
        'show_in_graphql' => true,
        'graphql_single_name' => 'videoCategory',
        'graphql_plural_name' => 'videoCategories',
        'rewrite' => array(
            'slug' => 'video-category',
            'with_front' => false,
        ),
    ));
}
add_action('init', 'jeldon_register_video_categories');

// ========================================
// 3. CREATE DEFAULT VIDEO CATEGORIES
// ========================================

function jeldon_create_default_video_categories() {
    // Only create if they don't exist
    $categories = array(
        'tutorials' => 'Tutorials',
        'beat-making' => 'Beat Making',
        'mixing' => 'Mixing & Mastering',
        'reviews' => 'Gear Reviews',
        'live' => 'Live Sessions',
        'behind-the-scenes' => 'Behind the Scenes'
    );
    
    foreach ($categories as $slug => $name) {
        if (!term_exists($slug, 'video_category')) {
            wp_insert_term($name, 'video_category', array('slug' => $slug));
        }
    }
}
add_action('init', 'jeldon_create_default_video_categories');

// ========================================
// 4. CUSTOMIZE ADMIN INTERFACE
// ========================================

// Add custom columns to video list
function jeldon_video_admin_columns($columns) {
    $new_columns = array();
    $new_columns['cb'] = $columns['cb'];
    $new_columns['title'] = $columns['title'];
    $new_columns['youtube_id'] = 'YouTube ID';
    $new_columns['video_duration'] = 'Duration';
    $new_columns['video_views'] = 'Views';
    $new_columns['taxonomy-video_category'] = 'Categories';
    $new_columns['date'] = $columns['date'];
    
    return $new_columns;
}
add_filter('manage_video_posts_columns', 'jeldon_video_admin_columns');

// Populate custom columns
function jeldon_video_admin_column_content($column, $post_id) {
    switch ($column) {
        case 'youtube_id':
            $youtube_id = get_field('youtube_video_id', $post_id);
            if ($youtube_id) {
                echo '<code>' . esc_html($youtube_id) . '</code><br>';
                echo '<a href="https://youtube.com/watch?v=' . esc_attr($youtube_id) . '" target="_blank">View on YouTube</a>';
            } else {
                echo '—';
            }
            break;
            
        case 'video_duration':
            $duration = get_field('video_duration', $post_id);
            echo $duration ? esc_html($duration) : '—';
            break;
            
        case 'video_views':
            $views = get_field('video_views', $post_id);
            if ($views) {
                echo number_format($views) . ' views';
            } else {
                echo '—';
            }
            break;
    }
}
add_action('manage_video_posts_custom_column', 'jeldon_video_admin_column_content', 10, 2);

// ========================================
// 5. FLUSH REWRITE RULES ON ACTIVATION
// ========================================

function jeldon_video_flush_rewrites() {
    jeldon_register_video_post_type();
    jeldon_register_video_categories();
    flush_rewrite_rules();
}
register_activation_hook(__FILE__, 'jeldon_video_flush_rewrites');

// ========================================
// 6. ADD ADMIN NOTICE FOR SETUP STATUS
// ========================================

function jeldon_video_setup_notice() {
    $screen = get_current_screen();
    if ($screen->id === 'edit-video' || $screen->id === 'video') {
        $acf_installed = class_exists('ACF');
        $wpgraphql_installed = class_exists('WPGraphQL');
        
        if (!$acf_installed || !$wpgraphql_installed) {
            echo '<div class="notice notice-warning"><p>';
            echo '<strong>Video Setup Status:</strong> ';
            if (!$acf_installed) echo 'ACF Plugin Required | ';
            if (!$wpgraphql_installed) echo 'WPGraphQL Plugin Required | ';
            echo 'Please install missing plugins for full functionality.';
            echo '</p></div>';
        } else {
            // Check if ACF fields exist
            $field_group = acf_get_field_group('group_videos');
            if (!$field_group) {
                echo '<div class="notice notice-info"><p>';
                echo '<strong>Next Step:</strong> Create ACF field group for videos with YouTube fields.';
                echo '</p></div>';
            }
        }
    }
}
add_action('admin_notices', 'jeldon_video_setup_notice');

?>
