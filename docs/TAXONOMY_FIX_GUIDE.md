# GraphQL Schema Issues - WordPress Plugin Dependencies Fix

## Issues Description
During Gatsby build, encountering errors:
```
Type with name "WpToMoodConnection" does not exists
Type with name "WpToMusicGenreConnection" does not exists
Type with name "WpPostTypeSEO" does not exists
```

## Root Cause
Multiple WordPress plugin dependencies are missing or not properly configured:
1. **Custom taxonomies** (`mood` and `music_genre`) - WordPress not running
2. **SEO plugin** (`WpPostTypeSEO`) - Yoast SEO or WP GraphQL SEO extension not installed
3. **Plugin registration** hasn't been flushed
4. **WP GraphQL** hasn't detected the plugins/taxonomies

## Temporary Fix Applied ✅
To allow the build to continue, **all problematic plugin references** have been temporarily commented out in:
- `gatsby-node.js` (WpBeat, WpTutorial, and WpMix type definitions)
- `src/utils/graphql-fragments.js` (SEO fields, beatFields and mixFields)
- `src/templates/beat.tsx` (genre and mood field display)
- `src/templates/mix.tsx` (genre field display)
- `src/pages/beats.tsx` (genre field display)
- `src/pages/mixes.tsx` (genre field display)

### Disabled Features:
- ❌ **Custom Taxonomies**: Genre and mood classification
- ❌ **SEO Fields**: Meta titles, descriptions, Open Graph data
- ✅ **Core Content**: All ACF fields, audio files, content display

## Permanent Fix Steps

### 1. Start WordPress Environment
```bash
# Open Local by Flywheel
# Start the "w-jeldonmusic" site
# Verify accessible at: http://w-jeldonmusic.local
```

### 2. Run Diagnostic Script
```bash
yarn wp:fix-taxonomy
```

### 3. Verify Taxonomy Registration
```bash
# In WordPress directory
cd "/Users/jeldonmusic/Local Sites/w-jeldonmusic/app/public"
wp taxonomy list
wp rewrite flush
```

### 4. Install Missing WordPress Plugins
```bash
# Install SEO plugin (choose one)
wp plugin install wordpress-seo --activate
# OR
wp plugin install rankmath --activate

# Install WP GraphQL SEO extension
wp plugin install wp-graphql-yoast-seo --activate
# OR for RankMath
wp plugin install wp-graphql-rank-math --activate
```

### 5. Check GraphQL Schema
Visit: http://w-jeldonmusic.local/graphql

Test query:
```graphql
{
  moods {
    nodes {
      id
      name
      slug
    }
  }
}
```

### 6. Re-enable All Plugin Fields
Once WordPress is running and all plugins are confirmed:

1. **Uncomment in `gatsby-node.js`:**
   ```javascript
   musicGenres: WpToMusicGenreConnection  # Remove the comment
   moods: WpToMoodConnection  # Remove the comment
   seo: WpPostTypeSEO  # Remove the comment
   ```

2. **Uncomment in `src/utils/graphql-fragments.js`:**
   ```graphql
   musicGenres {
     nodes {
       id
       name
       slug
     }
   }
   moods {
     nodes {
       id
       name
       slug
     }
   }
   seo {
     title
     metaDesc
     canonical
     opengraphTitle
     opengraphDescription
   }
   ```

3. **Uncomment in templates:**
   ```typescript
   genre?: string  # Remove the comment
   mood?: string   # Remove the comment
   ```

### 7. Test Build
```bash
gatsby clean
gatsby develop
```

## Alternative Solutions

### Option 1: Remove All Optional Plugins (Simplest)
If taxonomies and SEO aren't critical, remove them entirely from:
- `functions-music.php` (taxonomies)
- All GraphQL queries
- All template references
- WordPress plugin requirements

### Option 2: Gatsby Config Exclusion
Add to `gatsby-config.js`:
```javascript
{
  resolve: "gatsby-source-wordpress",
  options: {
    type: {
      Mood: {
        exclude: true, // Skip mood taxonomy
      },
      MusicGenre: {
        exclude: true, // Skip music genre taxonomy
      },
      WpPostTypeSEO: {
        exclude: true, // Skip SEO fields
      }
    }
  }
}
```

## Current Build Status
✅ **Gatsby build now works** with plugin dependencies temporarily disabled
🚧 **Genre, mood, and SEO functionality** will be restored once WordPress + plugins are running
⚡ **All core features** (beats, tutorials, mixes with ACF fields) work normally

## Files Modified for Temporary Fix
- `gatsby-node.js` - Commented plugin references in type definitions
- `src/utils/graphql-fragments.js` - Commented SEO and taxonomy queries
- `src/templates/beat.tsx` - Commented genre and mood field display
- `src/templates/mix.tsx` - Commented genre field display  
- `src/pages/beats.tsx` - Commented genre field display
- `src/pages/mixes.tsx` - Commented genre field display
- Added diagnostic script: `scripts/fix-taxonomy-issues.js`

## WordPress Plugin Requirements (For Full Functionality)
- **Core**: WP GraphQL, Advanced Custom Fields Pro
- **Taxonomies**: Custom post type functions in theme
- **SEO**: Yoast SEO + WP GraphQL Yoast SEO Extension
- **Content**: Sample beats, tutorials, mixes
