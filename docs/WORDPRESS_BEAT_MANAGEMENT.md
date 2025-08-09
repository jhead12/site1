# WordPress Beat Management Setup

## Overview
Use WordPress as your beat content management system while keeping the Gatsby frontend for performance and user experience.

## WordPress Setup for Beats

### 1. Custom Post Type: "Beats"
Create a custom post type in WordPress:

```php
// Add to functions.php or create a plugin
function create_beats_post_type() {
    register_post_type('beats', [
        'public' => true,
        'label' => 'Beats',
        'supports' => ['title', 'editor', 'thumbnail', 'custom-fields'],
        'show_in_rest' => true, // Enable for Gatsby integration
        'rest_base' => 'beats',
        'menu_icon' => 'dashicons-format-audio'
    ]);
}
add_action('init', 'create_beats_post_type');
```

### 2. Custom Fields with ACF (Advanced Custom Fields)
Install ACF plugin and create fields for beats:

```
Beat Details:
- BPM (Number)
- Key (Select: C, C#, D, D#, E, F, F#, G, G#, A, A#, B)
- Mode (Select: Major, Minor)
- Genre (Select: Trap, Drill, Hip Hop, Afrobeat, Rage, etc.)
- Tags (Text - comma separated)
- Preview Audio (File Upload - MP3)
- Full Audio Files (Repeater):
  - File Type (MP3, WAV, Stems)
  - File (File Upload)
- Duration (Text)
- Release Date (Date)
- Featured Beat (True/False)
```

### 3. WordPress Beat Upload Workflow

#### Admin Interface:
1. **Add New Beat** in WordPress admin
2. **Upload preview audio** (30-60 seconds, 128kbps MP3)
3. **Upload full files** (High-quality WAV, MP3, Stems)
4. **Set metadata** (BPM, Key, Genre, Tags)
5. **Add cover art** as featured image
6. **Publish** to make available in store

#### File Organization:
```
wp-content/uploads/beats/
├── previews/
│   ├── beat-001-preview.mp3
│   └── beat-002-preview.mp3
├── full-tracks/
│   ├── beat-001/
│   │   ├── beat-001-mp3.mp3
│   │   ├── beat-001-wav.wav
│   │   └── stems/
│   └── beat-002/
└── artwork/
    ├── beat-001-cover.jpg
    └── beat-002-cover.jpg
```

## Gatsby Integration

### 1. Install WordPress Source Plugin
```bash
npm install gatsby-source-wordpress
```

### 2. Configure gatsby-config.js
```javascript
module.exports = {
  plugins: [
    {
      resolve: `gatsby-source-wordpress`,
      options: {
        url: `https://your-wordpress-site.com/graphql`,
        schema: {
          perPage: 20,
          requestConcurrency: 5,
        },
        type: {
          Post: {
            limit: 0, // Don't sync regular posts if not needed
          },
          Beats: {
            limit: 100, // Sync all beats
          }
        }
      },
    },
  ],
}
```

### 3. Update Beat Page Generation
Replace static data with WordPress data:

```javascript
// gatsby-node.js
exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions;

  // Query beats from WordPress
  const result = await graphql(`
    query {
      allWpBeats {
        nodes {
          id
          slug
          title
          content
          beatDetails {
            bpm
            key
            mode
            genre
            tags
            previewAudio {
              mediaItemUrl
            }
            duration
            releaseDate
          }
          featuredImage {
            node {
              gatsbyImage(width: 400, height: 400)
              altText
            }
          }
        }
      }
    }
  `);

  // Create beat pages
  result.data.allWpBeats.nodes.forEach((beat) => {
    createPage({
      path: `/beats/${beat.slug}`,
      component: require.resolve('./src/templates/beat-page.js'),
      context: {
        beat: {
          id: beat.slug,
          title: beat.title,
          description: beat.content,
          bpm: beat.beatDetails.bpm,
          key: `${beat.beatDetails.key} ${beat.beatDetails.mode}`,
          genre: beat.beatDetails.genre,
          tags: beat.beatDetails.tags?.split(',').map(tag => tag.trim()) || [],
          preview: beat.beatDetails.previewAudio?.mediaItemUrl,
          artwork: beat.featuredImage?.node?.gatsbyImage,
          duration: beat.beatDetails.duration,
          releaseDate: beat.beatDetails.releaseDate
        }
      },
    });
  });
};
```

### 4. Update Beats Catalog Page
```javascript
// src/pages/beats.js - use GraphQL to get beats
export const query = graphql`
  query BeatsQuery {
    allWpBeats(sort: {releaseDate: DESC}) {
      nodes {
        id
        slug
        title
        content
        beatDetails {
          bpm
          key
          mode
          genre
          tags
          previewAudio {
            mediaItemUrl
          }
        }
        featuredImage {
          node {
            gatsbyImage(width: 300, height: 300)
            altText
          }
        }
      }
    }
  }
`;

const BeatsPage = ({ data }) => {
  const beats = data.allWpBeats.nodes.map(node => ({
    id: node.slug,
    title: node.title,
    // ... map other fields
  }));
  
  // Rest of component...
};
```

## Alternative Options

### Option 2: Contentful CMS
- More developer-friendly
- Better asset management for audio files
- Built-in CDN for fast audio delivery
- GraphQL API

### Option 3: File-based CMS (Forestry/Netlify CMS)
- Git-based workflow
- Markdown + frontmatter for metadata
- Simple for developers
- Version controlled

### Option 4: Airtable
- Spreadsheet-like interface
- Easy for non-technical users
- Good API integration
- Can handle file uploads

## Recommended Workflow

### For Regular Beat Uploads:

1. **WordPress Admin Dashboard**:
   - Upload beat files and artwork
   - Fill in metadata (BPM, key, genre, etc.)
   - Set preview audio
   - Publish

2. **Automatic Gatsby Build**:
   - Webhook triggers Gatsby rebuild
   - New beat pages generated automatically
   - Updated catalog with new beats

3. **ThriveCart Integration**:
   - Same license system works
   - Beat metadata passed to checkout
   - Custom fields populated from WordPress data

### Benefits of WordPress Approach:
- ✅ Familiar interface for content management
- ✅ Existing WordPress skills transfer
- ✅ Robust file management
- ✅ User roles and permissions
- ✅ Preview functionality before publishing
- ✅ SEO fields and metadata
- ✅ Scheduled publishing
- ✅ Bulk operations

### Setup Priority:
1. Install and configure WordPress with ACF
2. Create custom post type and fields
3. Add gatsby-source-wordpress
4. Update Gatsby build process
5. Test with a few sample beats
6. Set up webhook for automatic rebuilds

Would you like me to help you set up the WordPress custom post type and fields, or would you prefer to explore one of the other CMS options?
