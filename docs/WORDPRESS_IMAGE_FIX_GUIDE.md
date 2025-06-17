# WordPress Image Handling Fix Guide

## Issue
GraphQL error: `Cannot query field "gatsbyImageData" on type "WpMediaItem"`

## Root Cause
WordPress images in Gatsby don't automatically get `gatsbyImageData` field. They need to be processed through `localFile` and `childImageSharp`.

## Solution Applied

### 1. Updated Blog Post Template GraphQL Query
**Before:**
```graphql
featuredImage {
  node {
    altText
    gatsbyImageData(width: 800, height: 400, placeholder: BLURRED)
  }
}
```

**After:**
```graphql
featuredImage {
  node {
    altText
    sourceUrl
    localFile {
      childImageSharp {
        gatsbyImageData(width: 800, height: 400, placeholder: BLURRED)
      }
    }
  }
}
```

### 2. Updated Component Logic
- Added fallback to `sourceUrl` if `gatsbyImageData` is not available
- Uses `GatsbyImage` when processed image is available
- Uses regular `<img>` tag as fallback

### 3. WordPress Plugin Requirements
For optimal image processing, ensure these WordPress plugins are active:
- **gatsby-source-wordpress**: Core plugin for WordPress integration
- **gatsby-plugin-image**: For image optimization
- **gatsby-plugin-sharp**: For image processing
- **gatsby-transformer-sharp**: For image transformations

## File Changes Made

1. **src/templates/blog-post.js**
   - Updated GraphQL query structure
   - Added dual image rendering logic
   - Fallback to sourceUrl if needed

2. **src/pages/blog.js**
   - Already using sourceUrl (no changes needed)
   - Simple image display for archive

## Testing
1. Restart development server: `gatsby clean && gatsby develop`
2. Visit `/blog/` to see blog archive
3. Click on individual blog posts to test templates
4. Verify images load correctly

## Next Steps
- Monitor for any remaining GraphQL errors
- Test with real WordPress content
- Optimize image queries based on actual data structure

## Alternative Solutions
If issues persist:
1. Check WordPress plugin compatibility
2. Verify gatsby-source-wordpress configuration
3. Consider using only sourceUrl for simpler implementation
4. Add gatsby-plugin-remote-images for external image optimization
