# WordPress Environment Setup & Content Integration Guide

**Date:** June 18, 2025  
**Phase:** Content Integration & Testing  
**Prerequisites:** Mobile image fixes completed ✅

## 🎯 Current Status

✅ **Mobile image loading issues resolved**  
✅ **Blog integration functional**  
✅ **Build system stable**  
🔄 **Ready for WordPress content integration**

## 📋 Step-by-Step WordPress Setup

### Step 1: Start Local WordPress Environment

#### Option A: Using Local by Flywheel (Recommended)
1. **Open Local by Flywheel application**
2. **Start the "w-jeldonmusic" site** (if it exists)
3. **Verify it's running on localhost:10008**

#### Option B: Alternative Local Setup
If Local by Flywheel isn't available:
```bash
# Using Docker Compose (create if needed)
docker-compose up -d wordpress
```

#### Option C: Update Environment Variables
If WordPress is running on a different port:
```bash
# Edit .env.development
# Change WPGRAPHQL_URL to match your WordPress GraphQL endpoint
WPGRAPHQL_URL='http://localhost:[YOUR_PORT]/graphql'
```

### Step 2: Verify WordPress Connection

```bash
cd /Volumes/PRO-BLADE/Github/jeldonmusic_com/site1
node ./scripts/test-wp-connection.js
```

**Expected Output:**
```
✅ WordPress GraphQL connection successful
✅ WP GraphQL plugin detected
✅ ACF to WPGraphQL plugin detected
```

### Step 3: Import ACF Field Groups

```bash
# Run the automated import script
yarn wp:import-acf
```

**Manual Alternative** (if script fails):
1. Open WordPress Admin: `http://localhost:10008/wp-admin`
2. Go to Custom Fields → Tools → Import Field Groups
3. Import files from `./scripts/` directory:
   - `acf-beats-fields.json`
   - `acf-tutorial-fields.json`
   - `acf-mix-fields.json`

### Step 4: Create Sample Content

#### Blog Posts (Test Mobile Image Fix)
1. **Create 3-5 blog posts** with featured images
2. **Add various image sizes** to test responsiveness
3. **Test on mobile device** or browser dev tools

#### Custom Post Types
1. **Create 2-3 Beats** with:
   - Featured images
   - BPM, key, genre
   - Audio file links
   - Pricing information

2. **Create 2-3 Tutorials** with:
   - Featured images/thumbnails
   - Video URLs (YouTube embeds)
   - Difficulty levels
   - Equipment lists

3. **Create 1-2 Mixes** with:
   - Featured images
   - Tracklists
   - Audio files
   - Genre classifications

## 🧪 Testing Checklist

### Mobile Image Testing
- [ ] Blog posts load images without refresh on mobile
- [ ] Images fade in smoothly when loaded
- [ ] No layout shifts during image loading
- [ ] Error handling works for broken images
- [ ] Related posts images load correctly

### WordPress Integration Testing
- [ ] ACF fields import successfully
- [ ] All custom post types create pages
- [ ] GraphQL queries return data
- [ ] Featured images display correctly
- [ ] Content renders without GraphQL errors

### Cross-Device Testing
- [ ] Test on iOS Safari
- [ ] Test on Android Chrome
- [ ] Test on desktop browsers
- [ ] Test with slow network connection
- [ ] Verify responsive design

## 🛠 Available Commands

```bash
# Development & Testing
yarn develop                 # Start development server
yarn build                  # Test production build
yarn clean                  # Clear Gatsby cache

# WordPress Integration
yarn wp:test-connection     # Test WordPress connection
yarn wp:import-acf         # Import ACF field groups
yarn wp:sync               # Sync WordPress content

# Status Checks
yarn status                # Overall build status
yarn blog:test             # Blog integration test
yarn warnings:check        # Development warnings check
```

## 🚨 Troubleshooting

### WordPress Not Running
```bash
# Check if WordPress is running
curl http://localhost:10008/graphql

# If not running, start Local by Flywheel or Docker
```

### GraphQL Connection Issues
1. **Verify WP GraphQL plugin is active**
2. **Check WPGRAPHQL_URL in .env.development**
3. **Ensure WordPress is accessible**

### ACF Import Failures
1. **Use manual import via WordPress admin**
2. **Check ACF Pro plugin is active**
3. **Verify WP GraphQL for ACF plugin is installed**

### Mobile Image Issues
1. **Clear browser cache**
2. **Test in incognito/private mode**
3. **Check browser developer console for errors**

## 📈 Success Metrics

### Phase 2.5 Mobile Optimization ✅
- [x] Images load on first visit (no refresh needed)
- [x] Smooth loading transitions implemented
- [x] Mobile-specific CSS optimizations
- [x] Loading state management

### Phase 3 Content Integration (Current)
- [ ] WordPress environment running locally
- [ ] ACF field groups imported successfully
- [ ] Sample content created for all post types
- [ ] Mobile image fixes verified with real content
- [ ] All GraphQL queries working

## 🎯 Next Phase Preview

Once content integration is complete, we'll move to:

### Phase 4: Advanced Features
- **E-commerce integration** (ThriveCart for beat sales)
- **Enhanced search and filtering**
- **Social media integration**
- **SEO optimization**
- **Performance improvements**

### Phase 5: Production Preparation
- **SSL certificate renewal** (remove temporary bypasses)
- **Production deployment optimization**
- **Analytics and tracking setup**
- **Content migration strategy**

## 🚀 Ready to Continue?

1. **Start WordPress environment** (Local by Flywheel recommended)
2. **Run connection test**: `node ./scripts/test-wp-connection.js`
3. **Import ACF fields**: `yarn wp:import-acf`
4. **Start development server**: `yarn develop`
5. **Test mobile image fixes** with real content

The platform is ready for robust content testing and the next development phase!
