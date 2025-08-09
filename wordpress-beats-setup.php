<?php
/**
 * Beats Custom Post Type for WordPress
 * Add this to your theme's functions.php or create as a plugin
 */

// Register Beats Custom Post Type
function create_beats_post_type() {
    register_post_type('beats', array(
        'labels' => array(
            'name' => 'Beats',
            'singular_name' => 'Beat',
            'add_new' => 'Add New Beat',
            'add_new_item' => 'Add New Beat',
            'edit_item' => 'Edit Beat',
            'new_item' => 'New Beat',
            'view_item' => 'View Beat',
            'search_items' => 'Search Beats',
            'not_found' => 'No beats found',
            'not_found_in_trash' => 'No beats found in trash'
        ),
        'public' => true,
        'has_archive' => true,
        'supports' => array('title', 'editor', 'thumbnail', 'custom-fields'),
        'show_in_rest' => true, // Enable for Gatsby GraphQL
        'rest_base' => 'beats',
        'menu_icon' => 'dashicons-format-audio',
        'menu_position' => 5,
        'rewrite' => array('slug' => 'beats'),
        'show_in_graphql' => true, // Required for WPGraphQL
        'graphql_single_name' => 'beat',
        'graphql_plural_name' => 'beats',
    ));
}
add_action('init', 'create_beats_post_type');

// Register Beat Genres Taxonomy
function create_beat_genres_taxonomy() {
    register_taxonomy('beat_genre', 'beats', array(
        'labels' => array(
            'name' => 'Beat Genres',
            'singular_name' => 'Beat Genre',
            'add_new_item' => 'Add New Genre',
            'edit_item' => 'Edit Genre',
            'view_item' => 'View Genre',
            'search_items' => 'Search Genres',
        ),
        'hierarchical' => true,
        'show_ui' => true,
        'show_admin_column' => true,
        'query_var' => true,
        'rewrite' => array('slug' => 'beat-genre'),
        'show_in_rest' => true,
        'show_in_graphql' => true,
        'graphql_single_name' => 'beatGenre',
        'graphql_plural_name' => 'beatGenres',
    ));
}
add_action('init', 'create_beat_genres_taxonomy');

// Register Beat Keys Taxonomy
function create_beat_keys_taxonomy() {
    register_taxonomy('beat_key', 'beats', array(
        'labels' => array(
            'name' => 'Beat Keys',
            'singular_name' => 'Beat Key',
            'add_new_item' => 'Add New Key',
            'edit_item' => 'Edit Key',
            'view_item' => 'View Key',
            'search_items' => 'Search Keys',
        ),
        'hierarchical' => true,
        'show_ui' => true,
        'show_admin_column' => true,
        'query_var' => true,
        'rewrite' => array('slug' => 'beat-key'),
        'show_in_rest' => true,
        'show_in_graphql' => true,
        'graphql_single_name' => 'beatKey',
        'graphql_plural_name' => 'beatKeys',
    ));
}
add_action('init', 'create_beat_keys_taxonomy');

// Add default beat genres
function populate_beat_genres() {
    $genres = array('Trap', 'Drill', 'Hip Hop', 'Afrobeat', 'Rage', 'R&B', 'Pop', 'Electronic');
    
    foreach ($genres as $genre) {
        if (!term_exists($genre, 'beat_genre')) {
            wp_insert_term($genre, 'beat_genre');
        }
    }
}
add_action('init', 'populate_beat_genres');

// Add default beat keys
function populate_beat_keys() {
    $keys = array(
        'C Major', 'C Minor', 'C# Major', 'C# Minor',
        'D Major', 'D Minor', 'D# Major', 'D# Minor',
        'E Major', 'E Minor', 'F Major', 'F Minor',
        'F# Major', 'F# Minor', 'G Major', 'G Minor',
        'G# Major', 'G# Minor', 'A Major', 'A Minor',
        'A# Major', 'A# Minor', 'B Major', 'B Minor'
    );
    
    foreach ($keys as $key) {
        if (!term_exists($key, 'beat_key')) {
            wp_insert_term($key, 'beat_key');
        }
    }
}
add_action('init', 'populate_beat_keys');

// ACF Fields for Beats (if you're using ACF)
if (function_exists('acf_add_local_field_group')) {
    acf_add_local_field_group(array(
        'key' => 'group_beats_details',
        'title' => 'Beat Details',
        'fields' => array(
            array(
                'key' => 'field_beat_bpm',
                'label' => 'BPM',
                'name' => 'bpm',
                'type' => 'number',
                'instructions' => 'Beats per minute',
                'required' => 1,
                'min' => 60,
                'max' => 200,
            ),
            array(
                'key' => 'field_beat_preview_audio',
                'label' => 'Preview Audio',
                'name' => 'preview_audio',
                'type' => 'file',
                'instructions' => 'Upload a 30-60 second preview (MP3)',
                'required' => 1,
                'return_format' => 'array',
                'mime_types' => 'mp3,wav',
            ),
            array(
                'key' => 'field_beat_full_audio',
                'label' => 'Full Audio Files',
                'name' => 'full_audio',
                'type' => 'repeater',
                'instructions' => 'Upload full beat files (MP3, WAV, Stems)',
                'sub_fields' => array(
                    array(
                        'key' => 'field_audio_type',
                        'label' => 'File Type',
                        'name' => 'type',
                        'type' => 'select',
                        'choices' => array(
                            'mp3' => 'MP3',
                            'wav' => 'WAV',
                            'stems' => 'Stems Package',
                            'midi' => 'MIDI File',
                        ),
                    ),
                    array(
                        'key' => 'field_audio_file',
                        'label' => 'Audio File',
                        'name' => 'file',
                        'type' => 'file',
                        'return_format' => 'array',
                        'mime_types' => 'mp3,wav,zip',
                    ),
                ),
            ),
            array(
                'key' => 'field_beat_duration',
                'label' => 'Duration',
                'name' => 'duration',
                'type' => 'text',
                'instructions' => 'Beat duration (e.g., 3:45)',
            ),
            array(
                'key' => 'field_beat_tags',
                'label' => 'Tags',
                'name' => 'tags',
                'type' => 'text',
                'instructions' => 'Comma-separated tags (e.g., Dark, Heavy, Melodic)',
            ),
            array(
                'key' => 'field_beat_featured',
                'label' => 'Featured Beat',
                'name' => 'featured',
                'type' => 'true_false',
                'instructions' => 'Show this beat prominently',
                'default_value' => 0,
            ),
            array(
                'key' => 'field_beat_price_override',
                'label' => 'Custom Pricing',
                'name' => 'custom_pricing',
                'type' => 'group',
                'instructions' => 'Override default license prices for this beat',
                'sub_fields' => array(
                    array(
                        'key' => 'field_basic_price',
                        'label' => 'Basic License Price',
                        'name' => 'basic_price',
                        'type' => 'number',
                        'placeholder' => '50',
                    ),
                    array(
                        'key' => 'field_premium_price',
                        'label' => 'Premium License Price',
                        'name' => 'premium_price',
                        'type' => 'number',
                        'placeholder' => '150',
                    ),
                    array(
                        'key' => 'field_exclusive_price',
                        'label' => 'Exclusive License Price',
                        'name' => 'exclusive_price',
                        'type' => 'number',
                        'placeholder' => '1000',
                    ),
                ),
            ),
            array(
                'key' => 'field_custom_licenses',
                'label' => 'Custom License Configuration',
                'name' => 'custom_licenses',
                'type' => 'group',
                'instructions' => 'Customize license types and contract terms for this beat',
                'sub_fields' => array(
                    array(
                        'key' => 'field_basic_license_config',
                        'label' => 'Basic License Settings',
                        'name' => 'basic',
                        'type' => 'group',
                        'sub_fields' => array(
                            array(
                                'key' => 'field_basic_enabled',
                                'label' => 'Enable Basic License',
                                'name' => 'enabled',
                                'type' => 'true_false',
                                'default_value' => 1,
                            ),
                            array(
                                'key' => 'field_basic_name_override',
                                'label' => 'License Name Override',
                                'name' => 'name',
                                'type' => 'text',
                                'placeholder' => 'Basic License',
                            ),
                            array(
                                'key' => 'field_basic_description_override',
                                'label' => 'Description Override',
                                'name' => 'description',
                                'type' => 'text',
                                'placeholder' => 'Perfect for independent artists',
                            ),
                            array(
                                'key' => 'field_basic_contract_type',
                                'label' => 'Contract Type',
                                'name' => 'contract_type',
                                'type' => 'select',
                                'choices' => array(
                                    'non_exclusive' => 'Non-Exclusive',
                                    'exclusive_licensing' => 'Exclusive Licensing',
                                    'buyout' => 'Complete Buyout',
                                    'custom' => 'Custom Terms',
                                ),
                                'default_value' => 'non_exclusive',
                            ),
                            array(
                                'key' => 'field_basic_features_override',
                                'label' => 'Features Override',
                                'name' => 'features',
                                'type' => 'textarea',
                                'instructions' => 'One feature per line. Leave empty to use defaults.',
                                'placeholder' => "MP3 & WAV files\nCommercial use rights\nUp to 10,000 streams",
                            ),
                        ),
                    ),
                    array(
                        'key' => 'field_premium_license_config',
                        'label' => 'Premium License Settings',
                        'name' => 'premium',
                        'type' => 'group',
                        'sub_fields' => array(
                            array(
                                'key' => 'field_premium_enabled',
                                'label' => 'Enable Premium License',
                                'name' => 'enabled',
                                'type' => 'true_false',
                                'default_value' => 1,
                            ),
                            array(
                                'key' => 'field_premium_name_override',
                                'label' => 'License Name Override',
                                'name' => 'name',
                                'type' => 'text',
                                'placeholder' => 'Premium License',
                            ),
                            array(
                                'key' => 'field_premium_description_override',
                                'label' => 'Description Override',
                                'name' => 'description',
                                'type' => 'text',
                                'placeholder' => 'Enhanced rights for serious artists',
                            ),
                            array(
                                'key' => 'field_premium_contract_type',
                                'label' => 'Contract Type',
                                'name' => 'contract_type',
                                'type' => 'select',
                                'choices' => array(
                                    'non_exclusive' => 'Non-Exclusive',
                                    'exclusive_licensing' => 'Exclusive Licensing',
                                    'buyout' => 'Complete Buyout',
                                    'custom' => 'Custom Terms',
                                ),
                                'default_value' => 'exclusive_licensing',
                            ),
                            array(
                                'key' => 'field_premium_popular',
                                'label' => 'Mark as Popular',
                                'name' => 'popular',
                                'type' => 'true_false',
                                'default_value' => 1,
                            ),
                            array(
                                'key' => 'field_premium_features_override',
                                'label' => 'Features Override',
                                'name' => 'features',
                                'type' => 'textarea',
                                'instructions' => 'One feature per line. Leave empty to use defaults.',
                                'placeholder' => "High-quality WAV & MP3\nExtended commercial rights\nUp to 100,000 streams",
                            ),
                        ),
                    ),
                    array(
                        'key' => 'field_exclusive_license_config',
                        'label' => 'Exclusive License Settings',
                        'name' => 'exclusive',
                        'type' => 'group',
                        'sub_fields' => array(
                            array(
                                'key' => 'field_exclusive_enabled',
                                'label' => 'Enable Exclusive License',
                                'name' => 'enabled',
                                'type' => 'true_false',
                                'default_value' => 1,
                            ),
                            array(
                                'key' => 'field_exclusive_name_override',
                                'label' => 'License Name Override',
                                'name' => 'name',
                                'type' => 'text',
                                'placeholder' => 'Exclusive License',
                            ),
                            array(
                                'key' => 'field_exclusive_description_override',
                                'label' => 'Description Override',
                                'name' => 'description',
                                'type' => 'text',
                                'placeholder' => 'Complete ownership rights',
                            ),
                            array(
                                'key' => 'field_exclusive_contract_type',
                                'label' => 'Contract Type',
                                'name' => 'contract_type',
                                'type' => 'select',
                                'choices' => array(
                                    'non_exclusive' => 'Non-Exclusive',
                                    'exclusive_licensing' => 'Exclusive Licensing',
                                    'buyout' => 'Complete Buyout',
                                    'custom' => 'Custom Terms',
                                ),
                                'default_value' => 'buyout',
                            ),
                            array(
                                'key' => 'field_exclusive_features_override',
                                'label' => 'Features Override',
                                'name' => 'features',
                                'type' => 'textarea',
                                'instructions' => 'One feature per line. Leave empty to use defaults.',
                                'placeholder' => "Master-quality files\nComplete exclusive rights\nUnlimited distribution",
                            ),
                        ),
                    ),
                ),
            ),
        ),
        'location' => array(
            array(
                array(
                    'param' => 'post_type',
                    'operator' => '==',
                    'value' => 'beats',
                ),
            ),
        ),
        'menu_order' => 0,
        'position' => 'normal',
        'style' => 'default',
        'label_placement' => 'top',
        'instruction_placement' => 'label',
    ));
}

// Add admin columns for beats
function beats_admin_columns($columns) {
    $new_columns = array();
    $new_columns['cb'] = $columns['cb'];
    $new_columns['title'] = $columns['title'];
    $new_columns['beat_genre'] = 'Genre';
    $new_columns['beat_key'] = 'Key';
    $new_columns['bpm'] = 'BPM';
    $new_columns['featured'] = 'Featured';
    $new_columns['date'] = $columns['date'];
    return $new_columns;
}
add_filter('manage_beats_posts_columns', 'beats_admin_columns');

// Populate admin columns
function beats_admin_column_content($column, $post_id) {
    switch ($column) {
        case 'beat_genre':
            $terms = get_the_terms($post_id, 'beat_genre');
            if ($terms && !is_wp_error($terms)) {
                echo esc_html($terms[0]->name);
            }
            break;
        case 'beat_key':
            $terms = get_the_terms($post_id, 'beat_key');
            if ($terms && !is_wp_error($terms)) {
                echo esc_html($terms[0]->name);
            }
            break;
        case 'bpm':
            $bpm = get_field('bpm', $post_id);
            echo $bpm ? esc_html($bpm) : '-';
            break;
        case 'featured':
            $featured = get_field('featured', $post_id);
            echo $featured ? '⭐' : '-';
            break;
    }
}
add_action('manage_beats_posts_custom_column', 'beats_admin_column_content', 10, 2);

?>
