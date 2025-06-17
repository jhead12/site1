#!/bin/bash

# Blog Debug Script - Check WordPress Connection and Data

echo "=== Blog Debug Information ==="
echo ""

echo "1. Checking if WordPress is connected..."
echo "   Check gatsby develop output for WordPress connection status"
echo ""

echo "2. GraphQL Data Check:"
echo "   Visit: http://localhost:8000/___graphql"
echo "   Run this query to check WordPress posts:"
echo ""
echo "   query {"
echo "     allWpPost {"
echo "       nodes {"
echo "         id"
echo "         title"
echo "         slug"
echo "         uri"
echo "       }"
echo "     }"
echo "   }"
echo ""

echo "3. Expected Results:"
echo "   - If WordPress is connected: Should return blog posts"
echo "   - If WordPress is disconnected: Will return empty array"
echo "   - If no posts exist: Will return empty array"
echo ""

echo "4. Debug Steps:"
echo "   □ Check WPGRAPHQL_URL in .env.development"
echo "   □ Verify WordPress site is running"
echo "   □ Check WP GraphQL plugin is active"
echo "   □ Verify blog posts exist in WordPress"
echo ""

echo "5. Common Issues:"
echo "   - WordPress site not running locally"
echo "   - Incorrect WPGRAPHQL_URL in environment"
echo "   - WP GraphQL plugin not activated"
echo "   - No blog posts published in WordPress"
echo ""

echo "6. Quick Fix:"
echo "   If WordPress is not connected, blog posts won't generate pages"
echo "   The homepage will show empty recent posts or fallback content"
