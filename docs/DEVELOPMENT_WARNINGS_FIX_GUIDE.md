# Development Warnings Fix Guide

## Overview
This guide addresses the warnings and errors appearing in the Gatsby development console.

## Issues Identified

### 1. CSS Order Conflicts (Mini CSS Extract Plugin)
**Issue**: Conflicting CSS order between font files and vanilla-extract styles
**Severity**: Low (cosmetic warning)
**Status**: Non-blocking but should be addressed

### 2. Missing Image Props in GatsbyImage Components
**Issue**: `GatsbyImage` components missing required `image` prop
**Severity**: Medium (affects functionality)
**Files Affected**: `src/components/ui.js` (Logo component), `src/components/logo-list.js`

### 3. Invalid DOM Properties
**Issue**: Using `frameborder` instead of `frameBorder` in iframe elements
**Severity**: Low (React warning)
**Files Affected**: Components with embedded iframes

### 4. External Links in Gatsby Link Components
**Issue**: Using Gatsby `Link` component for external URLs (blog.jeldonmusic.com)
**Severity**: Medium (performance impact)
**Files Affected**: `src/components/blog-feature.js`

### 5. Helmet iframe Rendering Issues
**Issue**: Attempting to render iframe elements through Helmet
**Severity**: Medium (functionality issue)
**Files Affected**: Header/EmbedPage components

### 6. Missing Page Data (404 Errors)
**Issue**: Missing page-data.json files for external domains
**Severity**: Low (expected behavior for external links)

## Fix Actions

### Priority 1: Fix Missing Image Props

1. **Logo Component in UI.js**
   - Add proper image validation
   - Provide fallback for missing images

2. **Logo List Component**
   - Add null checks for image data
   - Handle missing image gracefully

### Priority 2: Fix External Link Usage

1. **Blog Feature Component**
   - Replace Gatsby Link with regular anchor tags for external URLs
   - Keep Gatsby Link only for internal navigation

### Priority 3: Fix DOM Properties

1. **Iframe Components**
   - Replace `frameborder` with `frameBorder`
   - Update all iframe-related attributes to use camelCase

### Priority 4: CSS Order Optimization

1. **Webpack Configuration**
   - Optimize CSS chunk ordering
   - Consider CSS import order in components

## Implementation Status

- [ ] Fix missing image props in Logo components
- [ ] Replace external links with proper anchor tags
- [ ] Fix iframe DOM properties
- [ ] Address Helmet iframe issues
- [ ] Optimize CSS loading order

## Next Steps

1. Apply fixes in order of priority
2. Test each fix in development
3. Verify no new warnings are introduced
4. Document any breaking changes

## Related Files

- `src/components/ui.js`
- `src/components/logo-list.js`
- `src/components/blog-feature.js`
- `src/components/header.js`
- Any components with embedded iframes

## Notes

- Most warnings are non-blocking and don't affect site functionality
- CSS order warnings can be ignored in development but should be addressed for production
- External link warnings are performance suggestions, not errors
- Missing image props can cause blank spaces or broken layouts
