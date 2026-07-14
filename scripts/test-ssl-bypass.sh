#!/bin/bash

echo "🔧 Testing build with WordPress bypass..."

# Set environment variable to bypass WordPress
export BYPASS_WORDPRESS=true

echo "📦 Building site without WordPress source..."
yarn build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build successful with WordPress bypass!"
    echo "🎯 Site built without WordPress content (using mock data)."
else
    echo "❌ Build failed"
    exit 1
fi