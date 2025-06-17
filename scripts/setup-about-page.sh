#!/bin/bash

# WordPress About Page Setup Script
# This script helps create an About page in WordPress via REST API

echo "=== WordPress About Page Setup ==="
echo ""

# Check if WordPress is running
WPGRAPHQL_URL=${WPGRAPHQL_URL:-"http://localhost:10008/graphql"}
WP_URL=${WPGRAPHQL_URL%/graphql}
WP_REST_URL="$WP_URL/wp-json/wp/v2"

echo "🔌 Testing WordPress connection..."
echo "WordPress URL: $WP_URL"
echo "REST API URL: $WP_REST_URL"
echo ""

# Test connection
if curl -s "$WP_REST_URL" > /dev/null; then
    echo "✅ WordPress REST API is accessible"
else
    echo "❌ Cannot connect to WordPress REST API"
    echo "Please ensure WordPress is running at: $WP_URL"
    exit 1
fi

echo ""
echo "📄 Checking for existing About page..."

# Check if About page exists
ABOUT_PAGE=$(curl -s "$WP_REST_URL/pages?slug=about" | grep -o '"id":[0-9]*' | head -1 | cut -d: -f2)

if [ ! -z "$ABOUT_PAGE" ]; then
    echo "✅ About page already exists (ID: $ABOUT_PAGE)"
    echo "📝 You can edit it at: $WP_URL/wp-admin/post.php?post=$ABOUT_PAGE&action=edit"
else
    echo "⚠️  No About page found"
    echo ""
    echo "📋 To create an About page:"
    echo "1. Go to WordPress admin: $WP_URL/wp-admin/"
    echo "2. Navigate to Pages → Add New"
    echo "3. Set the title as 'About'"
    echo "4. Add your content"
    echo "5. Publish the page"
    echo ""
    echo "Or create it programmatically with curl:"
    echo ""
    echo "curl -X POST '$WP_REST_URL/pages' \\"
    echo "  -H 'Content-Type: application/json' \\"
    echo "  -d '{"
    echo "    \"title\": \"About\","
    echo "    \"content\": \"<h2>About Jeldon Music</h2><p>Welcome to our music platform...</p>\","
    echo "    \"status\": \"publish\""
    echo "  }'"
fi

echo ""
echo "🔄 After creating the About page:"
echo "1. Restart Gatsby development server"
echo "2. Visit: http://localhost:8000/about"
echo "3. The page should now load content from WordPress"
echo ""
echo "✨ Done!"
