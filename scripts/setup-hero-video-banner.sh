#!/bin/bash
# setup-hero-video-banner.sh - Configure the rotating hero banner with latest video prioritization

echo "🎬 Setting up rotating hero banner with latest video prioritization..."

# Ensure the YouTube integration script is executable
chmod +x scripts/setup-youtube-integration.js

# Define paths
CONFIG_DIR="src/components/hero"
HERO_CONFIG="${CONFIG_DIR}/rotating-hero-banner-config.js"

# Create necessary directories
mkdir -p "${CONFIG_DIR}"

# Check if the hero config already exists
if [ -f "${HERO_CONFIG}" ]; then
  echo "✅ Hero banner configuration already exists."
  echo "ℹ️  Edit ${HERO_CONFIG} to customize the hero banner behavior."
else
  echo "📝 Creating hero banner configuration..."
  # Create the hero banner configuration file with video prioritization enabled
  cat > "${HERO_CONFIG}" << 'EOF'
/**
 * Configuration for the rotating hero banner
 * Controls content sources, display options, and video prioritization
 */

const heroConfig = {
  // Content sources to include in the rotation
  contentSources: {
    // WordPress content types
    wordpress: {
      // Blog posts
      posts: {
        enabled: true,
        query: `
          heroPosts: allWpPost(
            filter: { 
              status: { eq: "publish" }
              categories: { nodes: { elemMatch: { slug: { ne: "videos" } } } }
            }
            sort: { date: DESC }
            limit: 5
          ) {
            nodes {
              id
              title
              excerpt
              slug
              date(formatString: "MMMM DD, YYYY")
              featuredImage {
                node {
                  localFile {
                    childImageSharp {
                      gatsbyImageData(width: 1920, height: 600)
                    }
                  }
                  altText
                }
              }
              categories {
                nodes {
                  name
                  slug
                }
              }
            }
          }
        `,
      },
      
      // Video posts (from WordPress)
      videos: {
        enabled: true,
        query: `
          wpVideos: allWpPost(
            filter: {
              categories: {
                nodes: { elemMatch: { slug: { eq: "videos" } } }
              }
              status: { eq: "publish" }
            }
            sort: { date: DESC }
            limit: 3
          ) {
            nodes {
              id
              title
              excerpt
              slug
              date(formatString: "MMMM DD, YYYY")
              featuredImage {
                node {
                  localFile {
                    childImageSharp {
                      gatsbyImageData(width: 1920, height: 600)
                    }
                  }
                  altText
                }
              }
              categories {
                nodes {
                  name
                  slug
                }
              }
            }
          }
        `,
      }
    },
    
    // Latest YouTube videos
    youtube: {
      enabled: true,
      query: `
        youtubeVideos: allYoutubeVideo(
          sort: { publishedAt: DESC }
          limit: 3
        ) {
          nodes {
            id
            title
            description
            videoId
            publishedAt(formatString: "MMMM DD, YYYY")
            localThumbnail {
              childImageSharp {
                gatsbyImageData(width: 1920, height: 600)
              }
            }
          }
        }
      `,
    }
  },
  
  // Hero banner display settings
  display: {
    // Rotation settings
    autoRotate: true,
    interval: 6000, // 6 seconds
    pauseOnHover: true,
    
    // Video prioritization
    videoSettings: {
      // ALWAYS ensure the latest video is included in the rotation
      alwaysIncludeLatestVideo: true,
      
      // Prioritize video sources in this order
      priority: ['youtube', 'wordpress'],
      
      // Position of the latest video in the rotation (0 = first)
      latestVideoPosition: 0
    }
  }
};

export default heroConfig;
EOF

  echo "✅ Created hero banner configuration at ${HERO_CONFIG}"
fi

# Install required dependencies
echo "📦 Installing required dependencies..."
yarn add -D gatsby-source-youtube-v3

# Set up YouTube integration
echo "🔄 Setting up YouTube integration..."
node scripts/setup-youtube-integration.js

# Add the setup script to package.json
if ! grep -q "\"hero:setup\":" package.json; then
  echo "📝 Adding setup script to package.json..."
  # Use temporary file since in-place editing with sed can be inconsistent across platforms
  sed -i.bak 's/"scripts": {/"scripts": {\n    "hero:setup": "bash scripts\/setup-hero-video-banner.sh",/' package.json
  rm package.json.bak
fi

echo "🎉 Hero banner setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Get a YouTube API key from Google Cloud Console"
echo "2. Add your API key to .env.development and .env.production"
echo "3. Update your YouTube channel ID in gatsby-config.js"
echo "4. Create video posts in WordPress with category 'videos'"
echo "5. Run 'gatsby develop' to test the hero banner"
echo ""
echo "Your hero banner will now always include the latest video in the rotation!"
