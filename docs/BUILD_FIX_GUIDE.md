# WordPress and GraphQL Build Issues Resolution

## Issues and Fixes

### 1. WordPress Connection Timeout
**Issue**: The Gatsby build fails with `timeout of 30000ms exceeded` when connecting to WordPress GraphQL endpoint.

**Fix**:
- Added a bypass mechanism to build without WordPress content on Netlify
- Created a separate build command `build:netlify` that sets `BYPASS_WORDPRESS=true`
- Updated `netlify.toml` to use the WordPress-bypassed build

### 2. GraphQL Schema Errors with `publicURL`
**Issue**: The `publicURL` field was not available on the File type in GraphQL, causing build failures.

**Fix**:
- Fixed duplicate resolver in `gatsby-node.js`
- Added proper fallback for non-existent files
- Added `url` field as an alias to maintain consistency with Contentful patterns

## Deployment Strategy

For local development:
- `yarn develop` - Normal development with WordPress if available
- `yarn develop:mock` - Development without WordPress

For Netlify:
- The site now builds without requiring WordPress connection
- Static Contentful content still works
- WordPress-dependent pages are skipped during build

## Future Improvements

1. Set up a stable WordPress instance that Netlify can connect to
2. Configure proper CORS and rate limits to prevent timeouts
3. Remove the bypass once WordPress is stable

## Testing Your Changes

1. Test local build with WordPress: `yarn develop`
2. Test local build without WordPress: `yarn develop:mock`
3. Test Netlify build locally: `yarn build:netlify`
4. Push changes to trigger Netlify build
