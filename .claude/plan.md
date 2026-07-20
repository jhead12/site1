# Plan: Fix front-page image quality and add video page search

## Goals
1. Fix low-quality / over-compressed Gatsby images on the homepage (primarily the rotating hero banner and video/blog thumbnails).
2. Add a search input to `/videos` that filters the existing video grid.

## User preferences
- Image quality: balance quality and performance (quality 90, 1920 px hero width).
- Video search: include descriptions/excerpts. We will also search titles and category names for a usable search experience.

## Proposed changes

### 1. Improve homepage image quality
File: `src/components/hero/rotating-hero-banner.js`
- Increase `gatsbyImageData` resolution for featured images:
  - `allContentfulVideoPost` featuredImage: `width: 1920, height: 960, quality: 90, placeholder: BLURRED, formats: [AUTO, WEBP, AVIF]`.
  - `allContentfulBlogPost` featuredImage: same upgrade.
- `allContentfulAsset` hero background: keep 1920 width, add `quality: 90` and `formats: [AUTO, WEBP, AVIF]`.
- For YouTube thumbnail fallback, keep `maxresdefault.jpg` (already used) and add an `onError` fallback to `mqdefault.jpg` in case the high-res thumbnail is missing.
- Pass a `sizes` / `layout` hint so Gatsby generates larger sources for the full-width hero.

File: `src/pages/videos.js`
- Increase featured image resolution from `width: 300, height: 200` to `width: 600, height: 400, quality: 85, placeholder: BLURRED` for sharper grid thumbnails.
- For YouTube thumbnails in the grid, prefer `maxresdefault.jpg` with an `onError` fallback to `mqdefault.jpg`.

### 2. Add video page search
New file: `src/components/video/video-search.js`
- Reusable search component following the `BlogSearch` pattern.
- Accepts `videos` array and `onFilteredVideos` callback.
- Filters on `title`, `excerpt`, and `categories[].name` (case-insensitive, trimmed).
- Renders a rounded search input with a clear (×) button and a results count line.
- Uses `useMemo` for instant filtering.

File: `src/pages/videos.js`
- Import `<VideoSearch />`.
- Add `searchTerm` state.
- Combine category filter and search filter in the existing `filteredVideos` `useMemo`.
- Keep the existing category pill UI and results count, updating the message to reflect both active search and category.
- If both filters produce zero results, show the existing empty state.

### 3. Tests / verification
- Run `yarn test` to ensure existing tests still pass.
- The rotating hero banner test mocks `GatsbyImage` and `useStaticQuery`, so query changes shouldn't break it.
- Optionally add a small unit test for `VideoSearch` filtering logic.

## Tradeoffs
- Higher-quality images mean larger files; WebP/AVIF + `quality: 90` keeps the increase moderate while fixing visible compression.
- `maxresdefault.jpg` is 1280×720 but may not exist for every YouTube video; the `onError` fallback to `mqdefault.jpg` avoids broken images.

## Implementation order
1. Upgrade hero banner image query and YouTube fallback resolution.
2. Upgrade videos page thumbnail query and YouTube fallback resolution.
3. Create `VideoSearch` component and wire into `videos.js`.
4. Run tests and a build check.
