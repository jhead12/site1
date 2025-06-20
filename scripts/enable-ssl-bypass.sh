#!/bin/bash

# Enable WordPress SSL bypass for development
echo "Enabling WordPress SSL bypass for development..."

# Check if .env file exists
if [ ! -f .env.development ]; then
  echo "Creating .env.development file..."
  touch .env.development
fi

# Add or update BYPASS_WORDPRESS setting in .env.development file
if grep -q "BYPASS_WORDPRESS" .env.development; then
  sed -i '' 's/BYPASS_WORDPRESS=.*/BYPASS_WORDPRESS=true/' .env.development
else
  echo "BYPASS_WORDPRESS=true" >> .env.development
fi

# Print confirmation
echo "✅ WordPress SSL bypass enabled in .env.development"
echo "You can now run: yarn develop:ssl-bypass"

# Add mock data file to help with development
mkdir -p src/data/mock
cat > src/data/mock/hero-data.json << 'EOF'
{
  "hero": [
    {
      "id": "beat-1",
      "type": "beat",
      "title": "Summer Vibes Beat",
      "subtitle": "Latest Hip Hop Instrumental",
      "excerpt": "A smooth hip hop beat with summer vibes, perfect for your next track.",
      "image": "/images/beats/summer-vibes.jpg",
      "date": "2025-06-15",
      "slug": "summer-vibes",
      "metadata": {
        "price": "49.99",
        "bpm": "95",
        "key": "C Minor",
        "genre": "Hip Hop",
        "audioPreview": "/audio/summer-vibes-preview.mp3"
      },
      "cta": {
        "primary": "Buy Now",
        "secondary": "Preview Beat"
      }
    },
    {
      "id": "video-1",
      "type": "video",
      "title": "Creating Ambient Pads in Ableton",
      "subtitle": "Latest Tutorial Video",
      "excerpt": "Learn how to create beautiful ambient pads using simple synths and effects in Ableton Live.",
      "image": "/images/tutorials/ambient-pads.jpg",
      "date": "2025-06-17",
      "slug": "creating-ambient-pads",
      "metadata": {
        "duration": "18:45",
        "difficulty": "Intermediate",
        "youtubeId": "abc123xyz",
        "category": "Sound Design"
      },
      "cta": {
        "primary": "Watch Now",
        "secondary": "View Details"
      }
    },
    {
      "id": "blog-1",
      "type": "blog",
      "title": "5 Ways to Improve Your Mix Today",
      "subtitle": "Mixing Techniques",
      "excerpt": "Learn five powerful techniques that can immediately improve the quality of your mixes.",
      "image": "/images/blog/mixing-techniques.jpg",
      "date": "2025-06-16",
      "slug": "improve-your-mix",
      "metadata": {
        "category": "Audio Production",
        "readTime": "8 min read"
      },
      "cta": {
        "primary": "Read Article",
        "secondary": "Save for Later"
      }
    },
    {
      "id": "mix-1",
      "type": "mix",
      "title": "Summer House Sessions Vol. 3",
      "subtitle": "Latest DJ Mix",
      "excerpt": "A fresh house mix featuring the hottest summer tracks to keep your party going.",
      "image": "/images/mixes/summer-house.jpg",
      "date": "2025-06-18",
      "slug": "summer-house-sessions-3",
      "metadata": {
        "duration": "58:24",
        "genre": "House",
        "tracklist": "12 tracks"
      },
      "cta": {
        "primary": "Listen Now",
        "secondary": "View Tracklist"
      }
    },
    {
      "id": "album-1",
      "type": "album",
      "title": "Midnight Sessions",
      "subtitle": "Latest Album Release",
      "excerpt": "My latest album featuring 12 original tracks exploring deep electronic soundscapes.",
      "image": "/images/albums/midnight-sessions.jpg",
      "date": "2025-06-01",
      "slug": "midnight-sessions",
      "metadata": {
        "tracks": "12 tracks",
        "duration": "48 minutes",
        "genre": "Electronic"
      },
      "cta": {
        "primary": "Stream Now",
        "secondary": "View Tracks"
      }
    },
    {
      "id": "merch-1",
      "type": "merch",
      "title": "Studio Essentials T-Shirt",
      "subtitle": "Limited Edition Merch",
      "excerpt": "Premium quality t-shirt featuring the iconic 'Studio Essentials' design.",
      "image": "/images/merch/studio-essentials-tee.jpg",
      "date": "2025-05-30",
      "slug": "studio-essentials-tshirt",
      "metadata": {
        "price": "29.99",
        "sizes": "S, M, L, XL",
        "colors": "Black, White, Navy",
        "material": "100% Organic Cotton"
      },
      "cta": {
        "primary": "Shop Now",
        "secondary": "View Details"
      }
    }
  ]
}
EOF

echo "✅ Added mock hero data for development"
