# Changelog

All notable changes to the Jeldon Music website will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Fixed

- Blog post images now display properly on homepage blog section
- Added missing `featuredImage` field to GraphQL query in homepage
- Implemented character limits to prevent layout breaks from long content

### Added

- Smart text truncation functions for blog titles and excerpts
- Character limits: 50 chars for titles, 120 chars for excerpts
- Word boundary preservation in text truncation
- Ellipsis indicators for truncated content

### Changed

- Updated `src/pages/index.js` GraphQL query to include featuredImage data
- Enhanced `src/components/blog-feature.js` with content length controls

## [1.0.0] - 2025-06-21

### Added

- Initial project setup with Gatsby, Contentful, and WordPress integration
- WordPress bypass mode for deployments when WP is unavailable
- Comprehensive GraphQL schema fixes for content management
- Audio player with persistent playback across pages
- Blog integration with categories and navigation
- Shopify integration for e-commerce functionality
- Social media integrations (Instagram, YouTube, SoundCloud)
- Mobile-responsive design with Tailwind CSS
- SEO optimization and meta tag management

### Fixed

- Duplicate GraphQL resolver conflicts
- WordPress connection timeout issues
- Missing audio directory structure
- Schema validation errors
- Build failures on Netlify deployments

### Security

- SSL certificate configuration
- Environment variable management
- Content security policies

---

## Documentation

For detailed information about specific fixes and features, see the `/docs` folder:

- `BUILD_FIX_SUMMARY_2025_06_21.md` - Comprehensive build fixes
- `DEVELOPMENT_STATUS.md` - Current development status
- `WORDPRESS_MASTER_GUIDE.md` - WordPress integration guide
- `CONTENTFUL_MASTER_GUIDE.md` - Contentful setup guide
