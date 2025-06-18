#!/bin/bash

# WordPress Environment Setup & Content Integration
# Phase 3 Setup Script

echo "🚀 Jeldon Music Platform - Phase 3 Setup"
echo "========================================"
echo "📅 Date: $(date)"
echo "📦 Current Phase: Content Integration & Testing"
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Run this script from the project root directory"
    exit 1
fi

echo "🔍 Step 1: Environment Check"
echo "----------------------------"

# Check Node.js version
NODE_VERSION=$(node --version)
echo "✅ Node.js: $NODE_VERSION"

# Check Yarn version
YARN_VERSION=$(yarn --version)
echo "✅ Yarn: $YARN_VERSION"

# Check if environment files exist
if [ -f ".env.development" ]; then
    echo "✅ .env.development exists"
else
    echo "❌ .env.development missing"
fi

echo ""
echo "🔌 Step 2: WordPress Connection Test"
echo "-----------------------------------"

# Test WordPress connection
echo "📡 Testing WordPress GraphQL connection..."
node ./scripts/test-wp-connection.js

echo ""
echo "🧪 Step 3: Mobile Image Fix Verification"
echo "---------------------------------------"

# Check if mobile fix files exist
if [ -f "src/components/blog-mobile-fix.css" ]; then
    echo "✅ Mobile image fix CSS found"
else
    echo "❌ Mobile image fix CSS missing"
fi

# Count updated files
UPDATED_FILES=0
if grep -q "blog-mobile-fix.css" src/components/blog-feature.js; then
    echo "✅ blog-feature.js updated"
    UPDATED_FILES=$((UPDATED_FILES + 1))
fi

if grep -q "blog-mobile-fix.css" src/templates/blog-post.js; then
    echo "✅ blog-post.js updated"
    UPDATED_FILES=$((UPDATED_FILES + 1))
fi

if grep -q "blog-mobile-fix.css" src/pages/blog.js; then
    echo "✅ blog.js updated"
    UPDATED_FILES=$((UPDATED_FILES + 1))
fi

if grep -q "blog-mobile-fix.css" src/components/blog/related-posts.js; then
    echo "✅ related-posts.js updated"
    UPDATED_FILES=$((UPDATED_FILES + 1))
fi

echo "📊 Mobile fix applied to $UPDATED_FILES/4 components"

echo ""
echo "🎯 Step 4: Ready for Content Integration"
echo "--------------------------------------"

echo "📋 Next Actions:"
echo "1. Start WordPress environment (Local by Flywheel or Docker)"
echo "2. Run: yarn wp:import-acf (when WordPress is ready)"
echo "3. Create sample content for testing"
echo "4. Run: yarn develop (to test mobile image fixes)"
echo ""

echo "🛠 Available Commands:"
echo "   yarn develop              # Start development server"
echo "   yarn wp:test-connection   # Test WordPress connection"
echo "   yarn wp:import-acf       # Import ACF field groups"
echo "   yarn status              # Check build status"
echo "   yarn blog:test           # Test blog integration"
echo ""

echo "📚 Documentation:"
echo "   docs/WORDPRESS_SETUP_PHASE_3.md          # Complete setup guide"
echo "   docs/MOBILE_IMAGE_FIX_AND_DEVELOPMENT_PHASES.md  # Mobile fix details"
echo ""

echo "✨ Phase 2.5 (Mobile Optimization) COMPLETE"
echo "🚧 Phase 3 (Content Integration) READY TO START"
echo ""
echo "🎉 Run this when WordPress is ready:"
echo "   yarn wp:import-acf && yarn develop"
