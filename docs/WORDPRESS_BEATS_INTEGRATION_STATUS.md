# WordPress Beats Integration Setup Guide

## ✅ Current Status Check

Your system already has:
- ✅ WordPress source plugin configured (`gatsby-source-wordpress`)
- ✅ Environment variables set up (WPGRAPHQL_URL, WP_USERNAME, WP_PASSWORD)
- ✅ Blog posts working (using `allWpPost`)
- ✅ Beat pages creation in `gatsby-node.js` (updated to use beat-page.js)
- ✅ Beat templates ready (beat-page.js with ThriveCart integration)

## 🔧 WordPress Setup Required

### Step 1: Add Custom Post Type to WordPress

Add this code to your WordPress site (`functions.php` or as a plugin):

```php
// Use the code from wordpress-beats-setup.php file
```

**File Location**: `/wordpress-beats-setup.php` (already created)

### Step 2: Install Required WordPress Plugins

1. **Advanced Custom Fields (ACF)** - For beat metadata
   - Install from WordPress admin
   - The code automatically creates the field groups

2. **WPGraphQL** - For Gatsby integration
   - Should already be installed (since blog posts work)

### Step 3: Create Sample Beat

1. Go to WordPress Admin → Beats → Add New
2. Fill in the fields:
   - **Title**: "Dark Trap Beat"
   - **Content**: "Hard-hitting trap beat with dark melodies"
   - **BPM**: 140
   - **Preview Audio**: Upload MP3 file
   - **Genre**: Select "Trap" 
   - **Key**: Select "C Minor"
   - **Tags**: "Dark, Heavy, Melodic"
   - **Featured Image**: Upload beat artwork

3. **Publish** the beat

## 🎯 ThriveCart Integration Status

### Current Configuration:
- ✅ Basic License: Product ID 18 (working)
- ⚠️ Premium License: Product ID 19 (needs creation)
- ⚠️ Exclusive License: Product ID 20 (needs creation)

### Next Steps for ThriveCart:

1. **Create Additional Products**:
   ```
   Premium Beat License - $150
   - Product ID: 19
   - Custom fields enabled
   
   Exclusive Beat License - $1000  
   - Product ID: 20
   - Custom fields enabled
   ```

2. **Update Environment Variables**:
   ```env
   GATSBY_THRIVECART_BEAT_PREMIUM_ID=19
   GATSBY_THRIVECART_BEAT_EXCLUSIVE_ID=20
   ```

## 🔄 Testing the Integration

### 1. Verify WordPress Connection
```bash
# Check if WordPress is responding
curl http://localhost:10008/graphql/ -H "Content-Type: application/json" -d '{"query": "{ __schema { types { name } } }"}'
```

### 2. Start Development Server
```bash
npm run develop
```

### 3. Check GraphQL Playground
- Visit: `http://localhost:8000/___graphql`
- Test query:
```graphql
{
  allWpBeat {
    nodes {
      title
      slug
      beatDetails {
        bpm
        previewAudio {
          mediaItemUrl
        }
      }
    }
  }
}
```

### 4. Visit Beat Pages
- Catalog: `http://localhost:8000/beats`
- Individual: `http://localhost:8000/beats/dark-trap-beat`

## 🐛 Troubleshooting

### If No Beats Show Up:

1. **Check WordPress Connection**:
   - Verify `WPGRAPHQL_URL` is correct
   - Ensure WPGraphQL plugin is active
   - Check WordPress credentials

2. **Verify Custom Post Type**:
   - Make sure beats post type is registered
   - Check "Show in GraphQL" is enabled
   - Verify taxonomies are created

3. **GraphQL Schema**:
   - Clear Gatsby cache: `gatsby clean`
   - Restart development server
   - Check for GraphQL errors in console

### If Audio Doesn't Play:

1. **File Permissions**:
   - Ensure audio files are accessible
   - Check CORS settings on WordPress

2. **File Formats**:
   - Use MP3 for preview files
   - Keep file sizes reasonable (< 5MB)

## 📁 File Structure

```
WordPress Integration:
├── gatsby-config.js ✅ (WordPress source configured)
├── gatsby-node.js ✅ (Beat page creation updated)
├── .env ✅ (WordPress credentials set)
├── src/
│   ├── pages/
│   │   └── beats.js ✅ (Updated with WordPress query)
│   └── templates/
│       └── beat-page.js ✅ (Updated with WordPress data)
└── wordpress-beats-setup.php ✅ (Ready to add to WordPress)
```

## 🚀 Benefits of This Setup

### For You (Admin):
- **Easy Beat Management**: Upload beats through familiar WordPress interface
- **Automatic Page Generation**: New beats automatically get their own pages
- **Rich Metadata**: BPM, key, genre, tags, pricing all managed in WordPress
- **File Management**: WordPress handles audio file storage and delivery

### For Customers:
- **Professional Experience**: Clean, fast beat browsing
- **Instant Previews**: Audio players on every beat
- **Smart Filtering**: Find beats by genre, key, BPM
- **Seamless Checkout**: ThriveCart integration with beat metadata

### For Scalability:
- **Unlimited Beats**: Add as many beats as needed
- **Custom Pricing**: Override prices per beat if needed
- **Featured Beats**: Highlight special releases
- **SEO Optimized**: Each beat gets its own URL and metadata

## 🔄 Workflow

### Adding New Beats:
1. **WordPress Admin** → Add new beat with metadata
2. **Publish** → Automatically available on site
3. **Webhook** (optional) → Triggers Gatsby rebuild
4. **Live Site** → New beat appears in catalog

### Managing Sales:
1. **Customer** browses beats → selects license → purchases
2. **ThriveCart** processes payment → receives beat metadata
3. **Delivery** → Customer gets files + contract
4. **Analytics** → Track sales per beat, license type, etc.

## ✅ Ready to Go!

Your WordPress beats integration is now configured and ready to use. The system will:

- ✅ Pull beat data from WordPress
- ✅ Generate individual beat pages automatically  
- ✅ Handle ThriveCart checkout with beat metadata
- ✅ Fallback to static data if WordPress is unavailable
- ✅ Scale to unlimited beats without code changes

**Next Action**: Add the `wordpress-beats-setup.php` code to your WordPress site and create your first beat!
