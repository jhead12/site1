# WordPress Bypass Mode: Final Implementation and Troubleshooting

This document outlines all the schema and resolver fixes implemented to make the site build successfully in WordPress bypass mode (BYPASS_WORDPRESS=true).

## Final Fixes (June 22, 2025)

### Schema and Resolver Fixes

1. **Fixed `context.nodeModel.runQuery` error**:
   - Replaced the `allPage` resolver that was using `context.nodeModel.runQuery` with a simple mock data resolver
   - Provided mock SitePage nodes with path and slug fields

2. **Fixed GraphQL Schema Fragment Issues**:
   - Extended `ContentfulNavItem` to implement appropriate interfaces (`Node` and `HeaderNavItem`)
   - Added missing fields to match fragment usage in header.js component
   - Added a custom proxy field extension to map `url` fields to `href` fields for compatibility

3. **Added Missing Input Type Fields**:
   - Added `count` field to `WpCategoryFilter` input type
   - Added `IntQueryOperatorInput` for integer filter operations

4. **Created Static Query Data Files**:
   - Added missing JSON files for static queries in `public/page-data/sq/d/`
   - Created `860043902.json` for header static query data
   - Created `3265857146.json` for rotating hero banner data

5. **Simplified Header GraphQL Query**:
   - Removed fragment spreads that caused incompatibility issues
   - Flattened the query structure to match our schema definitions

## Running in Bypass Mode

To run the site in WordPress bypass mode:

```bash
export BYPASS_WORDPRESS=true && gatsby develop
```

For a production build:

```bash
export BYPASS_WORDPRESS=true && gatsby build
```

## Troubleshooting Common Issues

### 1. Fragment Spread Errors

If you encounter errors like:
```
Fragment cannot be spread here as objects of type "X" can never be of type "Y"
```

This usually means one of two things:
- Type X doesn't implement interface Y
- The fragment is being spread in a context where it doesn't match

**Solution**: 
- Make sure your types implement all necessary interfaces
- Use direct field selection instead of fragments where possible
- Update fragment definitions to match the schema

### 2. Static Query JSON File Missing

If you encounter errors like:
```
Module not found: Error: Can't resolve '.../page-data/sq/d/1234567890.json'
```

**Solution**:
- Ensure `public/page-data/sq/d/` directory exists
- Create appropriate mock data JSON files that match the query structure
- Run `gatsby clean` before starting the development server

### 3. Filter/Sort Input Errors

If you see errors like:
```
Field "X" is not defined by type "YFilter"
```

**Solution**:
- Check all input type definitions and ensure they include all fields referenced in queries
- Add missing fields to the appropriate filter input types

## Implementation Details

### Custom Proxy Field Extension
```javascript
actions.createFieldExtension({
  name: "proxy",
  args: {
    from: {
      type: "String!",
    },
  },
  extend(options) {
    return {
      resolve(source) {
        if (source[options.from]) {
          return source[options.from];
        }
        return null;
      },
    };
  },
});
```

### Mock Page Resolver
```javascript
allPage: {
  type: "SitePageConnection",
  resolve() {
    // Return mock pages in bypass mode
    return {
      nodes: [
        { id: 'page-1', path: '/', slug: 'home', title: 'Home' },
        { id: 'page-2', path: '/about', slug: 'about', title: 'About' },
        { id: 'page-3', path: '/contact', slug: 'contact', title: 'Contact' }
      ]
    };
  },
},
```

### Extended ContentfulNavItem Type
```javascript
type ContentfulNavItem implements Node & HeaderNavItem {
  id: ID!
  navItemType: String
  text: String
  href: String @proxy(from: "url") 
  page: ContentfulPage
  submenu: [ContentfulNavItem]
  username: String
  service: String
  description: String
  icon: HomepageImage
  name: String
  navItems: [NavItem]
}
```

Remember that in bypass mode, all data is mocked and no actual WordPress or Contentful API calls are made.
