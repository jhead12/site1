# Blog 404 Error Fix Guide

## Issues Identified
1. **404 errors on blog post pages** - Pages not being generated
2. **Front page blog links not working** - No posts data available

## Root Cause
WordPress is not connected or accessible at the configured URL (`http://localhost:10008/graphql`)

## Quick Diagnosis
Run: `yarn blog:debug` to check WordPress connection status

## Solutions

### Option 1: Connect to Existing WordPress (Recommended)
1. **Start WordPress Site**
   ```bash
   # If using Local by Flywheel or similar
   # Start your WordPress site at localhost:10008
   ```

2. **Verify WordPress GraphQL**
   - Visit: `http://localhost:10008/graphql`
   - Should show GraphQL playground
   - WP GraphQL plugin must be active

3. **Test Connection**
   ```bash
   yarn blog:debug
   # Check GraphQL playground at http://localhost:8000/___graphql
   ```

### Option 2: Temporarily Disable WordPress Features
If you want to continue development without WordPress:

1. **Comment out WordPress source in gatsby-config.js**
   ```javascript
   // {
   //   resolve: "gatsby-source-wordpress",
   //   options: {
   //     url: process.env.WPGRAPHQL_URL,
   //     // ... rest of config
   //   },
   // },
   ```

2. **Create mock blog data**
   ```javascript
   // In src/pages/index.js, replace allWpPost query with mock data
   ```

### Option 3: Use Demo WordPress
Update `.env.development`:
```bash
WPGRAPHQL_URL='https://demo.wpgraphql.com/graphql'
```

## Verification Steps

1. **Check Console Output**
   ```bash
   gatsby develop
   # Look for: "Creating X blog posts"
   # If 0 posts, WordPress is not connected
   ```

2. **Test GraphQL**
   Visit: `http://localhost:8000/___graphql`
   Run query:
   ```graphql
   query {
     allWpPost {
       nodes {
         id
         title
         slug
       }
     }
   }
   ```

3. **Test Blog Pages**
   - Archive: `http://localhost:8000/blog/`
   - Individual posts will only work if posts exist

## Files Modified for Better Error Handling
- `gatsby-node.js` - Added null checks and warning messages
- `src/components/blog-feature.js` - Graceful handling of empty posts
- Added debug scripts for troubleshooting

## Expected Behavior After Fix
- ✅ Blog post pages generate without 404 errors
- ✅ Front page blog links point to correct internal URLs
- ✅ WordPress content appears throughout site
- ✅ Console shows "Creating X blog posts" with actual count

## Common WordPress Setup Issues
1. **WordPress not running** - Start your local WordPress
2. **Wrong port** - Check if WordPress is on different port
3. **WP GraphQL plugin inactive** - Activate in WordPress admin
4. **No published posts** - Create some blog posts in WordPress
5. **Permalink issues** - Check WordPress permalink settings

Run `yarn blog:debug` for detailed troubleshooting steps.
