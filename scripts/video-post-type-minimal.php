<?php
// ========================================
// JELDON MUSIC - VIDEO POST TYPE SETUP
// ========================================

// Register Video Custom Post Type
function jeldon_register_video_post_type() {
    register_post_type('video', array(
        'labels' => array(
            'name' => 'Videos',
            'singular_name' => 'Video',
            'add_new' => 'Add New Video',
            'edit_item' => 'Edit Video',
            'menu_name' => 'Videos'
        ),
        'public' => true,
        'has_archive' => true,
        'menu_icon' => 'dashicons-video-alt3',
        'supports' => array('title', 'editor', 'excerpt', 'thumbnail'),
        'show_in_rest' => true,
        'show_in_graphql' => true,
        'graphql_single_name' => 'video',
        'graphql_plural_name' => 'videos',
        'rewrite' => array('slug' => 'videos'),
    ));
}
add_action('init', 'jeldon_register_video_post_type');

// Register Video Categories
function jeldon_register_video_categories() {
    register_taxonomy('video_category', 'video', array(
        'labels' => array(
            'name' => 'Video Categories',
            'singular_name' => 'Video Category',
        ),
        'hierarchical' => true,
        'public' => true,
        'show_in_rest' => true,
        'show_in_graphql' => true,
        'graphql_single_name' => 'videoCategory',
        'graphql_plural_name' => 'videoCategories',
    ));
}
add_action('init', 'jeldon_register_video_categories');

// Create default categories
function jeldon_create_default_video_categories() {
    $categories = array(
        'tutorials' => 'Tutorials',
        'beat-making' => 'Beat Making',
        'mixing' => 'Mixing & Mastering',
        'reviews' => 'Gear Reviews',
        'live' => 'Live Sessions'
    );
    
    foreach ($categories as $slug => $name) {
        if (!term_exists($slug, 'video_category')) {
            wp_insert_term($name, 'video_category', array('slug' => $slug));
        }
    }
}
add_action('init', 'jeldon_create_default_video_categories');
?>
