#!/bin/bash

echo "🛍️ Shopify Integration Setup for Jeldon Music"
echo "=============================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Please run this script from the project root directory"
    exit 1
fi

echo "📝 Setting up Shopify environment variables..."

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "Creating .env file..."
    touch .env
fi

# Add Shopify environment variables template
if ! grep -q "GATSBY_MYSHOPIFY_URL" .env; then
    echo "" >> .env
    echo "# Shopify Configuration" >> .env
    echo "GATSBY_MYSHOPIFY_URL=your-store.myshopify.com" >> .env
    echo "SHOPIFY_ADMIN_ACCESS_TOKEN=your_admin_api_token_here" >> .env
    echo "# Get these from: https://your-store.myshopify.com/admin/apps/private" >> .env
fi

echo "📦 Installing Shopify dependencies..."

# Install Shopify Buy SDK and related packages
yarn add shopify-buy gatsby-source-shopify

echo "✅ Shopify setup template completed!"
echo ""
echo "🔧 Next steps to complete Shopify integration:"
echo "1. Create a Shopify store at https://shopify.com"
echo "2. Go to your store admin: https://your-store.myshopify.com/admin"
echo "3. Navigate to Apps > Private apps (or Custom apps)"
echo "4. Create a new private app with Storefront API access"
echo "5. Copy the Storefront access token"
echo "6. Update the .env file with your actual store URL and token:"
echo "   GATSBY_MYSHOPIFY_URL=your-actual-store.myshopify.com"
echo "   SHOPIFY_ADMIN_ACCESS_TOKEN=your_actual_token_here"
echo "7. Restart your Gatsby development server"
echo "8. Uncomment the Shopify queries in:"
echo "   - src/pages/shop.js"
echo "   - src/templates/product.js" 
echo "   - gatsby-node.js (createPages function)"
echo ""
echo "📚 For detailed setup instructions, see:"
echo "   docs/SHOPIFY_INTEGRATION_PLAN.md"
