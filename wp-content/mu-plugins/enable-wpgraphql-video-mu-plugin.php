<?php
/*
Plugin Name: Enable WPGraphQL for Video CPT (mu-plugin)
Description: Mu-plugin to expose the 'video' custom post type to WPGraphQL by ensuring `show_in_graphql` is enabled and GraphQL names are set. Drop this file into the WordPress site's `wp-content/mu-plugins/` directory.
Version: 1.0
Author: jeldonmusic.com automation
*/

if ( ! defined( 'ABSPATH' ) ) {
  exit; // Exit if accessed directly
}

add_filter( 'register_post_type_args', function( $args, $post_type ) {
    // Map post types to their unique GraphQL names
    $graphql_type_map = array(
        'video'    => array( 'single' => 'Video', 'plural' => 'Videos' ),
        'tutorial' => array( 'single' => 'Tutorial', 'plural' => 'Tutorials' ),
        'beat'     => array( 'single' => 'Beat', 'plural' => 'Beats' ),
        'mix'      => array( 'single' => 'Mix', 'plural' => 'Mixes' ),
    );

    if ( isset( $graphql_type_map[ $post_type ] ) ) {
        // Enable GraphQL exposure if not already enabled
        if ( empty( $args['show_in_graphql'] ) || $args['show_in_graphql'] !== true ) {
            $args['show_in_graphql'] = true;
        }

        // Provide unique GraphQL type names if not set
        if ( empty( $args['graphql_single_name'] ) ) {
            $args['graphql_single_name'] = $graphql_type_map[ $post_type ]['single'];
        }
        if ( empty( $args['graphql_plural_name'] ) ) {
            $args['graphql_plural_name'] = $graphql_type_map[ $post_type ]['plural'];
        }
    }

    return $args;
}, 10, 2 );

// Optional: Add an admin notice to remind to flush permalinks after enabling
add_action( 'admin_notices', function() {
    if ( ! current_user_can( 'manage_options' ) ) {
        return;
    }

    $screen = get_current_screen();
    if ( ! $screen || $screen->base !== 'options-permalink' ) {
        echo '<div class="notice notice-info"><p><strong>WPGraphQL Video Exposure:</strong> If you just installed this mu-plugin, visit <a href="options-permalink.php">Settings  Permalinks</a> and click "Save Changes" to flush rewrite rules. Then check <a href="/graphql?ide">GraphiQL</a> to verify the `allWpVideo` query is available.</p></div>';
    }
} );
