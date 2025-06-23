# WordPress Schema Fix and Bypass Mode Implementation

## Summary

This document outlines the changes made to fix GraphQL schema errors and enable WordPress bypass mode for the J. Eldon Music website. The goal was to ensure the site can build successfully even when WordPress or Contentful APIs are not available, especially during Netlify deployments.

## Key Changes

### 1. GraphQL Schema Customization

- Added custom types for WordPress entities (WpPost, WpBeat, WpMix, WpVideo, etc.)
- Fixed naming conflicts with Gatsby's reserved types (renamed *FilterInput and *SortInput)
- Added missing fields to schema types (musicalKey, tracklist, videoViews, alt, etc.)
- Added proper field aliases (beatFields → acfBeats, mixFields → acfMixes) directly to type definitions
- Added @dontInfer directive to custom types to prevent interference with WordPress schema
- Implemented proxy resolvers (allPage → allSitePage)
- Fixed order of operations to ensure types are fully defined before resolvers are created

### 2. Mock Data Resolvers

- Added resolvers for all WordPress entities with realistic mock data
- Made resolver creation conditional based on BYPASS_WORDPRESS environment variable
- Avoided conflicts with existing WordPress field resolvers
- Added layout field resolver for header and footer navigation
- Added ContentfulAsset resolver with alt field support
- Created isolated mock data for static queries
- Added proper fallback/mock data for all required fields (dates, images, metadata, etc.)

### 3. Build System Updates

- Updated Netlify configuration for bypass mode
- Added build scripts for WordPress bypass mode
- Fixed syntax error in video.js template
- Created bypass helper utilities

### 4. Fixing Specific Issues

- Fixed "tracklist" field to be a String rather than an object with subfields
- Added missing musicalKey field to WpBeatAcfBeats type
- Added videoViews field to WpContentNode_Videodetails
- Fixed client-side routing and static query issues

## Testing

To test WordPress bypass mode locally:

```bash
# Run with WordPress bypass enabled
yarn develop:mock

# Or build with WordPress bypass
yarn build:no-wp
```

## Future Improvements

1. Consider separating mock data into dedicated JSON files
2. Implement more comprehensive fallback content
3. Add unit tests for bypass mode functionality

## Conclusion

These changes ensure that the site can be built and deployed even when external data sources are unavailable. This improves CI/CD reliability and allows for more robust testing and development workflows.

## Troubleshooting Common Issues

### 1. Type Definition Order Issues

If you see errors like "Type with name X does not exist":
- Make sure all types are defined before they're referenced
- Use @dontInfer directive on custom types
- Define all type relationships explicitly

### 2. Field Resolution Conflicts

If you see warnings about duplicate field resolvers:
- Use createTypes to override existing fields instead of createResolvers
- Make resolver creation conditional based on BYPASS_WORDPRESS mode
- Check for type name conflicts with Gatsby's internal types

### 3. Static Query Issues

If you see errors about missing static query JSON files:
- Check if the component is properly handling bypass mode
- Make sure mock data is provided before build time
- Consider using conditional rendering for components that require external data

### 4. Missing Fields in Components

If components throw errors about missing fields:
- Check that all referenced fields exist in both schema and resolvers
- Ensure aliased fields (like beatFields → acfBeats) are properly defined
- Add fallback/null handling in components

Date: June 22, 2025
