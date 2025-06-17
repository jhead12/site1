#!/bin/bash

# Build Status Verification Script
# This script tests the current build status and reports any issues

echo "🔍 Jeldon Music Platform - Build Status Check"
echo "=============================================="
echo ""

# Check if we're in the right directory
if [ ! -f "gatsby-config.js" ]; then
    echo "❌ Error: This script must be run from the project root directory"
    exit 1
fi

echo "📁 Project directory: $(pwd)"
echo ""

# Check Node.js and npm/yarn versions
echo "🔧 Environment Check:"
echo "Node.js: $(node --version)"
echo "Yarn: $(yarn --version 2>/dev/null || echo 'Not installed')"
echo "npm: $(npm --version)"
echo ""

# Check for required dependencies
echo "📦 Dependency Check:"
if [ -d "node_modules" ]; then
    echo "✅ node_modules directory exists"
else
    echo "❌ node_modules directory missing - run 'yarn install'"
fi

# Check for .env files
echo ""
echo "🔐 Environment Configuration:"
if [ -f ".env.development" ]; then
    echo "✅ .env.development exists"
else
    echo "⚠️  .env.development missing"
fi

if [ -f ".env.production" ]; then
    echo "✅ .env.production exists"
else
    echo "ℹ️  .env.production not found (optional)"
fi

echo ""
echo "🏗️  Build Test:"
echo "Running clean build to test current status..."
echo ""

# Clean and build
if yarn clean && yarn build; then
    echo ""
    echo "🎉 BUILD SUCCESSFUL!"
    echo "✅ All systems operational"
    echo ""
    echo "📊 Quick Stats:"
    
    # Count generated pages if public directory exists
    if [ -d "public" ]; then
        page_count=$(find public -name "*.html" | wc -l | tr -d ' ')
        echo "   Pages generated: $page_count"
    fi
    
    # Check for common output files
    if [ -f "public/index.html" ]; then
        echo "   ✅ Homepage generated"
    fi
    
    if [ -f "public/beats/index.html" ]; then
        echo "   ✅ Beats page generated"
    fi
    
    if [ -f "public/tutorials/index.html" ]; then
        echo "   ✅ Tutorials page generated"
    fi
    
    if [ -f "public/mixes/index.html" ]; then
        echo "   ✅ Mixes page generated"
    fi
    
    echo ""
    echo "🚀 Ready for development or deployment!"
    
else
    echo ""
    echo "❌ BUILD FAILED!"
    echo "🔧 Check the error messages above and:"
    echo "   1. Ensure WordPress is running (if using WordPress content)"
    echo "   2. Check .env.development configuration"
    echo "   3. Verify all dependencies are installed"
    echo "   4. Review the troubleshooting guide in docs/"
    echo ""
    exit 1
fi

echo ""
echo "📚 Next Steps:"
echo "   • Import ACF field groups: yarn acf:import"
echo "   • Create sample content in WordPress"
echo "   • Enable taxonomies and SEO fields"
echo "   • Review docs/BUILD_SUCCESS_SUMMARY.md for details"
echo ""
