# WordPress Headless CMS Setup Guide

## Required WordPress Plugins

### Core Plugins (Essential)
1. **WP GraphQL** (v1.14.0+)
   - Main plugin for GraphQL API
   - Install: `wp plugin install wp-graphql --activate`

2. **Advanced Custom Fields (ACF) Pro** (v6.0+)
   - Custom field management
   - Purchase license from advancedcustomfields.com
   - Upload and activate manually

3. **WP GraphQL for Advanced Custom Fields**
   - Exposes ACF fields to GraphQL
   - Install: `wp plugin install wp-graphql-acf --activate`

### Content Management Plugins
4. **Custom Post Type UI**
   - Easy custom post type creation
   - Install: `wp plugin install custom-post-type-ui --activate`

5. **WP GraphQL Meta Query**
   - Advanced querying capabilities
   - Install: `wp plugin install wp-graphql-meta-query --activate`

### SEO & Performance Plugins
6. **Yoast SEO Premium**
   - SEO optimization with GraphQL support
   - Purchase license and install manually

7. **WP GraphQL Yoast SEO**
   - Exposes Yoast data to GraphQL
   - Install: `wp plugin install wp-graphql-yoast-seo --activate`

### Optional Plugins (Phase 4)
8. **WooCommerce** (for e-commerce)
   - Install: `wp plugin install woocommerce --activate`

9. **WP GraphQL WooCommerce**
   - Exposes WooCommerce to GraphQL
   - Install: `wp plugin install wp-graphql-woocommerce --activate`

## WordPress Configuration

### 1. Permalink Structure
- Go to Settings > Permalinks
- Set to "Post name" structure: `/%postname%/`

### 2. GraphQL Settings
- Go to GraphQL > Settings
- Enable GraphQL endpoint at `/graphql`
- Enable GraphQL IDE for development

### 3. User Permissions
- Create API user with appropriate permissions
- Generate Application Passwords (WordPress 5.6+)

### 4. Disable WordPress Frontend (Optional)
Add to functions.php:
```php
// Disable frontend for headless setup
function disable_wp_frontend() {
    if (!is_admin() && !defined('WP_CLI') && !wp_doing_ajax()) {
        wp_redirect(admin_url(), 301);
        exit;
    }
}
add_action('template_redirect', 'disable_wp_frontend');
```

### 5. CORS Configuration
Add to wp-config.php:
```php
// Enable CORS for GraphQL
header('Access-Control-Allow-Origin: https://your-gatsby-site.com');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
```

## Custom Post Types Setup

### 1. Beats Custom Post Type
```php
// Add to functions.php or use Custom Post Type UI
function register_beats_post_type() {
    register_post_type('beats', [
        'labels' => [
            'name' => 'Beats',
            'singular_name' => 'Beat',
        ],
        'public' => true,
        'show_in_graphql' => true,
        'graphql_single_name' => 'beat',
        'graphql_plural_name' => 'beats',
        'supports' => ['title', 'editor', 'thumbnail', 'custom-fields'],
        'menu_icon' => 'dashicons-format-audio',
    ]);
}
add_action('init', 'register_beats_post_type');
```

### 2. Tutorials Custom Post Type
```php
function register_tutorials_post_type() {
    register_post_type('tutorials', [
        'labels' => [
            'name' => 'Tutorials',
            'singular_name' => 'Tutorial',
        ],
        'public' => true,
        'show_in_graphql' => true,
        'graphql_single_name' => 'tutorial',
        'graphql_plural_name' => 'tutorials',
        'supports' => ['title', 'editor', 'thumbnail', 'custom-fields'],
        'menu_icon' => 'dashicons-video-alt3',
    ]);
}
add_action('init', 'register_tutorials_post_type');
```

### 3. Mixes Custom Post Type
```php
function register_mixes_post_type() {
    register_post_type('mixes', [
        'labels' => [
            'name' => 'Mixes',
            'singular_name' => 'Mix',
        ],
        'public' => true,
        'show_in_graphql' => true,
        'graphql_single_name' => 'mix',
        'graphql_plural_name' => 'mixes',
        'supports' => ['title', 'editor', 'thumbnail', 'custom-fields'],
        'menu_icon' => 'dashicons-playlist-audio',
    ]);
}
add_action('init', 'register_mixes_post_type');
```

## Custom Taxonomies

### 1. Music Genres
```php
function register_music_genre_taxonomy() {
    register_taxonomy('music_genre', ['beats', 'mixes'], [
        'labels' => [
            'name' => 'Music Genres',
            'singular_name' => 'Music Genre',
        ],
        'hierarchical' => true,
        'show_in_graphql' => true,
        'graphql_single_name' => 'musicGenre',
        'graphql_plural_name' => 'musicGenres',
    ]);
}
add_action('init', 'register_music_genre_taxonomy');
```

### 2. Moods
```php
function register_mood_taxonomy() {
    register_taxonomy('mood', ['beats', 'mixes'], [
        'labels' => [
            'name' => 'Moods',
            'singular_name' => 'Mood',
        ],
        'hierarchical' => false,
        'show_in_graphql' => true,
        'graphql_single_name' => 'mood',
        'graphql_plural_name' => 'moods',
    ]);
}
add_action('init', 'register_mood_taxonomy');
```

## Testing GraphQL Endpoint

### 1. Test Basic Query
Visit: `https://your-wordpress-site.com/graphql`

Try this query:
```graphql
query {
  generalSettings {
    title
    description
  }
  posts {
    nodes {
      id
      title
      content
    }
  }
}
```

### 2. Test Custom Post Types
```graphql
query {
  beats {
    nodes {
      id
      title
      content
    }
  }
  tutorials {
    nodes {
      id
      title
      content
    }
  }
}
```

## Next Steps
1. Install and configure all required plugins
2. Set up custom post types and taxonomies
3. Test GraphQL endpoint
4. Move to Phase 1.3: ACF Field Groups Setup

**Quick Start Commands:**
```bash
# Install dependencies
yarn install

# Set up WordPress configuration
yarn setup:wp

# Test WordPress connection
yarn wp:test-connection

# Start development with WordPress
yarn develop:wp
```
