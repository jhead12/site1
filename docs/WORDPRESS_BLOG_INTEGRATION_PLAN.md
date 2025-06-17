# WordPress Blog Integration Plan

## Current Issue
The "Recent blogs" section fetches WordPress posts via GraphQL but links to external WordPress URLs (blog.jeldonmusic.com) instead of creating internal Gatsby pages.

## Current State
- ✅ WordPress posts are being fetched via `gatsby-source-wordpress`
- ✅ Posts appear in GraphQL layer (`allWpPost`)
- ❌ Links point to external WordPress site
- ❌ No internal blog pages or templates created

## Solution Plan

### Phase 1: Create Blog Post Templates
1. **Create Blog Post Template** (`src/templates/blog-post.js`)
   - Single blog post layout
   - Full content rendering
   - Featured image support
   - SEO metadata

2. **Create Blog Archive Page** (`src/pages/blog.js`)
   - List all blog posts
   - Pagination support
   - Search/filter functionality

### Phase 2: Update gatsby-node.js
1. **Add Blog Post Page Generation**
   - Query all WordPress posts
   - Create pages using blog post template
   - Set up URL structure (`/blog/{slug}`)

2. **Add Blog Archive Generation**
   - Create paginated archive pages
   - Set up category/tag pages if needed

### Phase 3: Update Blog Feature Component
1. **Fix Internal Links**
   - Replace external URLs with internal Gatsby links
   - Update to use `/blog/{slug}` pattern

2. **Improve GraphQL Query**
   - Add slug field for internal routing
   - Optimize fields for performance

### Phase 4: WordPress Content Strategy
1. **Content Import Options**
   - Keep existing external blog running
   - Import content to headless WordPress
   - Use WordPress as headless CMS

2. **SEO Considerations**
   - Set up redirects if moving content
   - Maintain existing URL structure if possible

## Implementation Priority

### High Priority (Immediate)
- [ ] Create blog post template
- [ ] Update gatsby-node.js for blog page generation
- [ ] Fix blog-feature.js internal links

### Medium Priority
- [ ] Create blog archive page
- [ ] Add pagination
- [ ] Improve SEO metadata

### Low Priority
- [ ] Add search functionality
- [ ] Category/tag filtering
- [ ] Content migration strategy

## Files to Create/Modify

### New Files
- `src/templates/blog-post.js`
- `src/pages/blog.js`

### Files to Modify
- `gatsby-node.js` (add blog page generation)
- `src/components/blog-feature.js` (fix links)
- `src/utils/graphql-fragments.js` (add blog fragments)

## Benefits of This Approach
1. **Better Performance** - Internal navigation, no external redirects
2. **Improved SEO** - All content on same domain
3. **Better UX** - Consistent navigation and theming
4. **Full Control** - Custom layouts and functionality

## Next Steps
1. Implement blog post template
2. Update gatsby-node.js
3. Fix blog-feature.js links
4. Test with existing WordPress content
