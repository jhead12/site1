# WordPress Schema Fix - June 21, 2025 (Updated)

## Issue Summary

When running builds with `BYPASS_WORDPRESS=true`, we encountered multiple GraphQL errors:

```
error Field "slug" is not defined by type "WpPostFilterInput".
error Cannot query field "featuredImage" on type "WpVideo".
error Unknown argument "formatString" on field "WpPost.date".
error Cannot query field "categories" on type "WpPost".
error Cannot query field "allWpCategory" on type "Query".
error Cannot query field "wpPage" on type "Query".
error Cannot query field "localFile" on type "File".
```

Additional errors from the latest Netlify build logs:
```
error Cannot query field "slug" on type "WpPost".
error Unknown argument "formatString" on field "WpVideo.date".
error Cannot query field "videoCategories" on type "WpVideo".
error Cannot query field "content" on type "WpVideo".
error Cannot query field "content" on type "WpBeat".
error Cannot query field "featuredImage" on type "WpBeat".
error Cannot query field "content" on type "WpMix".
error Cannot query field "featuredImage" on type "WpMix".
```

These errors occur because:
1. The WordPress GraphQL types aren't fully defined when bypassing WordPress
2. Queries reference fields that don't exist in the bypass schema
3. Filter inputs aren't properly defined
4. Formatting directives like `formatString` aren't implemented
5. Missing Query type extensions for root fields like `wpPage` and `allWpCategory`

## Complete Solution

We've implemented a comprehensive approach to fix all WordPress bypass issues:

### 1. Enhanced Schema Definitions

- **Complete Type Definitions**: Created comprehensive mock types for all WordPress entities:
  - WpPost (with title, excerpt, content, slug, uri, date)
  - WpPage (with title, content, slug, uri, date)
  - WpVideo (with title, excerpt, content, slug, uri, date, videoCategories)
  - WpBeat (with title, content, slug, date, acfBeats)
  - WpMix (with title, content, slug, date, acfMixes)
  - WpTutorial (with title, content, slug, date, acfTutorials)
  - WpCategory, WpTag, WpUser (with name, slug, count)
  - WpMediaItem (with altText, sourceUrl, localFile, gatsbyImage)
  - All connection types for relationships
  
- **Root Query Extensions**: Added extensions to the Query type:
  - `wpPage`, `wpPost`, `wpBeat`, `wpMix`, `wpVideo`, `wpTutorial`
  - `allWpCategory`, `allWpTag`, `allWpTutorial`
  - All connection types for collection queries
  
- **Field Resolvers**: Added resolvers for:
  - Date formatting with `formatString` parameter
  - Image fields with `localFile` and `sourceUrl` support
  - File fields with `publicURL` and `url` support
  - ACF fields for Beats, Mixes, and Tutorials
  - Content fields with proper HTML structure

- **Filter Input Types**: Defined filter input types that match what queries are using:
  - Added `WpPostFilterInput` with `slug`, `categories`, `title`, `content`, and `excerpt` fields
  - Added `StringQueryOperatorInput` and `DateQueryOperatorInput` for basic filtering
  - Added `WpCategoryFilterInput`, `WpTagFilterInput` and connection filter inputs
  - Added all necessary filter list types for array filtering

### 2. Fallback Data System

- Created a utility module `fallback-data.js` that provides:
  - Demo blog posts with featured images, categories, authors
  - Demo categories for filtering
  - Demo content for music/beats/mixes pages
  
- Data is designed to mimic WordPress structure for seamless component compatibility

### 3. Component Updates

- Updated components to detect WordPress bypass mode
- Added graceful fallbacks when WordPress data isn't available
- Display visual indicators when running in bypass mode

### 4. GraphQL Query Improvements

- Used conditional directives like `@skip(if: $BYPASS_WORDPRESS)` where needed
- Restructured problematic queries to work in both modes
- Added proper variables to control query execution

### 5. Date Formatting Support

- Implemented support for the `formatString` argument on Date scalar type fields
- Added a custom `formatString` resolver that works with all content types:
  ```javascript
  Date: {
    formatString: {
      type: 'String',
      args: {
        formatString: { type: 'String', defaultValue: 'MMMM DD, YYYY' },
        locale: { type: 'String', defaultValue: 'en' },
      },
      resolve(source, { formatString, locale }, context, info) {
        // Custom date formatting logic
      }
    },
  }
  ```
- Built a custom date formatter that handles "MMMM DD, YYYY" format consistently
- Ensured all WordPress content types use the `@dateformat` directive on date fields

## Testing and Validation

The site now builds successfully with `BYPASS_WORDPRESS=true`, showing demo content instead of WordPress content. All pages render correctly without errors, and the homepage, blog, and music sections display placeholder content.

To test the solution:

1. **Local development testing**: 
   ```bash
   # Clean the cache first
   gatsby clean
   
   # Run with WordPress bypass
   GATSBY_CONFIG_FILE=gatsby-config-ssl-bypass.js BYPASS_WORDPRESS=true gatsby develop
   ```

2. **Build testing**:
   ```bash
   # Test the Netlify build command 
   yarn build:netlify
   ```

3. **Netlify deployment**:
   The site is configured to use the `build:netlify` script in package.json, which sets the `BYPASS_WORDPRESS=true` flag for reliability.

## Related Changes

Previously, we fixed:
- Directory structure issues with `/static/audio` and `/static/images`
- Added placeholder files for audio playback and blog images
- Enhanced error handling in components
- Fixed audio player and image loading issues

This comprehensive solution ensures the site builds and functions properly even when WordPress is completely unavailable, providing a robust fallback experience.
