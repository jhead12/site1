#!/bin/bash

echo "🔧 Testing build with SSL bypass for WordPress..."

# Set environment variable to bypass WordPress
export BYPASS_WORDPRESS=true

# Backup original config
cp gatsby-config.js gatsby-config-original.js

# Use the SSL bypass config
cp gatsby-config-ssl-bypass.js gatsby-config.js

echo "📦 Building site without WordPress source..."
yarn build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build successful with SSL bypass!"
    echo "🎯 Site built without WordPress content due to SSL certificate issue."
    echo "📝 Next steps:"
    echo "   1. Renew SSL certificate for blog.jeldonmusic.com"
    echo "   2. Restore WordPress integration"
    echo "   3. Consider Shopify integration for e-commerce"
else
    echo "❌ Build failed even with SSL bypass"
fi

# Restore original config
mv gatsby-config-original.js gatsby-config.js

echo "🔄 Original gatsby-config.js restored"
