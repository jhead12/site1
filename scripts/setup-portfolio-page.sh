#!/bin/bash

# WordPress Portfolio Page Setup Script
# This script helps create a Portfolio page in WordPress via REST API

echo "=== WordPress Portfolio Page Setup ==="
echo ""

# Load environment variables if .env exists
if [ -f .env ]; then
    export $(grep -v '^#' .env | xargs)
fi

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
echo "📄 Checking for existing Portfolio page..."

# Check if Portfolio page exists
PORTFOLIO_PAGE=$(curl -s "$WP_REST_URL/pages?slug=portfolio" | grep -o '"id":[0-9]*' | head -1 | cut -d: -f2)

if [ ! -z "$PORTFOLIO_PAGE" ]; then
    echo "✅ Portfolio page already exists (ID: $PORTFOLIO_PAGE)"
    echo "📝 You can edit it at: $WP_URL/wp-admin/post.php?post=$PORTFOLIO_PAGE&action=edit"
else
    echo "⚠️  No Portfolio page found"
    echo ""
    
    # Check if we have credentials to auto-create
    if [ ! -z "$WP_USERNAME" ] && [ ! -z "$WP_PASSWORD" ]; then
        echo "🔐 WordPress credentials found in .env"
        echo "📝 Creating Portfolio page automatically..."
        echo ""
        
        # Create the page
        RESPONSE=$(curl -s -X POST "$WP_REST_URL/pages" \
            -u "$WP_USERNAME:$WP_PASSWORD" \
            -H "Content-Type: application/json" \
            -d '{
                "title": "Portfolio",
                "content": "<h2>My Portfolio</h2><p>Showcase of my musical works, productions, and creative projects.</p><p>Edit this page in WordPress to add your portfolio items, images, and descriptions.</p>",
                "status": "publish",
                "slug": "portfolio"
            }')
        
        # Check if creation was successful
        NEW_PAGE_ID=$(echo $RESPONSE | grep -o '"id":[0-9]*' | head -1 | cut -d: -f2)
        
        if [ ! -z "$NEW_PAGE_ID" ]; then
            echo "✅ Portfolio page created successfully! (ID: $NEW_PAGE_ID)"
            echo "📝 Edit it at: $WP_URL/wp-admin/post.php?post=$NEW_PAGE_ID&action=edit"
        else
            echo "❌ Failed to create Portfolio page"
            echo "Response: $RESPONSE"
        fi
    else
        echo "📋 To create a Portfolio page manually:"
        echo "1. Go to WordPress admin: $WP_URL/wp-admin/"
        echo "2. Navigate to Pages → Add New"
        echo "3. Set the title as 'Portfolio'"
        echo "4. Add your content"
        echo "5. Publish the page"
        echo ""
        echo "Or create it programmatically with curl:"
        echo ""
        echo "curl -X POST '$WP_REST_URL/pages' \\"
        echo "  -u 'username:password' \\"
        echo "  -H 'Content-Type: application/json' \\"
        echo "  -d '{"
        echo "    \"title\": \"Portfolio\","
        echo "    \"content\": \"<h2>Portfolio</h2><p>Showcase of my work and projects...</p>\","
        echo "    \"status\": \"publish\""
        echo "  }'"
    fi
fi

echo ""
echo "🔄 Next steps:"
echo "1. Restart Gatsby development server: pnpm run develop:wp"
echo "2. Visit: http://localhost:8000/portfolio"
echo "3. The page should now load content from WordPress"
echo ""
echo "✨ Done!"
