#!/bin/bash

# Shopify Integration Setup Script
# Prepares Jeldon Music Platform for Shopify e-commerce integration

echo "🛒 Shopify Integration Setup for Jeldon Music Platform"
echo "===================================================="
echo "📅 Date: $(date)"
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Run this script from the project root directory"
    exit 1
fi

echo "🔍 Step 1: Pre-Integration Checklist"
echo "-----------------------------------"

# Check current project status
echo "✅ Checking project structure..."

if [ -f "src/components/blog-mobile-fix.css" ]; then
    echo "✅ Mobile image fixes applied"
else
    echo "⚠️  Mobile image fixes not found"
fi

if [ -f "gatsby-config.js" ]; then
    echo "✅ Gatsby configuration present"
else
    echo "❌ Gatsby configuration missing"
fi

echo ""
echo "📦 Step 2: Shopify Dependencies Check"
echo "------------------------------------"

# Check if Shopify dependencies are installed
if grep -q "shopify-buy" package.json; then
    echo "✅ shopify-buy already installed"
else
    echo "📦 shopify-buy needs to be installed"
    echo "   Run: yarn add shopify-buy"
fi

if grep -q "gatsby-source-shopify" package.json; then
    echo "✅ gatsby-source-shopify already installed"
else
    echo "📦 gatsby-source-shopify needs to be installed"
    echo "   Run: yarn add gatsby-source-shopify"
fi

echo ""
echo "🔧 Step 3: Environment Configuration"
echo "-----------------------------------"

# Check environment files
if [ -f ".env.development" ]; then
    echo "✅ .env.development exists"
    
    if grep -q "SHOPIFY_STORE_URL" .env.development; then
        echo "✅ Shopify environment variables configured"
    else
        echo "⚠️  Shopify environment variables need to be added"
        echo ""
        echo "Add these to .env.development and .env.production:"
        echo "SHOPIFY_STORE_URL=\"jeldon-music.myshopify.com\""
        echo "SHOPIFY_STOREFRONT_TOKEN=\"your-storefront-access-token\""
        echo "SHOPIFY_ADMIN_TOKEN=\"your-admin-token\""
    fi
else
    echo "❌ .env.development missing"
fi

echo ""
echo "🏗️  Step 4: Component Structure Planning"
echo "---------------------------------------"

# Check if Shopify component directories exist
SHOPIFY_COMPONENTS_DIR="src/components/shopify"
if [ -d "$SHOPIFY_COMPONENTS_DIR" ]; then
    echo "✅ Shopify components directory exists"
else
    echo "📁 Creating Shopify components directory structure..."
    mkdir -p "$SHOPIFY_COMPONENTS_DIR"
    echo "✅ Created: $SHOPIFY_COMPONENTS_DIR"
fi

# List planned components
echo ""
echo "📋 Planned Shopify Components:"
echo "   - src/components/shopify/product-card.js"
echo "   - src/components/shopify/add-to-cart.js"
echo "   - src/components/shopify/cart-drawer.js"
echo "   - src/components/shopify/checkout-button.js"
echo "   - src/components/shopify/license-selector.js"
echo "   - src/components/shopify/beat-preview.js"

echo ""
echo "🎵 Step 5: Music-Specific Integration Features"
echo "---------------------------------------------"

echo "🎧 Beat Sales Features:"
echo "   ✓ Multiple license tiers (Basic, Premium, Exclusive)"
echo "   ✓ Audio preview players"
echo "   ✓ Instant digital delivery"
echo "   ✓ License agreement management"
echo "   ✓ Producer collaboration tools"

echo ""
echo "🛍️  Merchandise Integration:"
echo "   ✓ Physical products (vinyl, CDs, apparel)"
echo "   ✓ Inventory management"
echo "   ✓ Shipping configuration"
echo "   ✓ Bundle deals and discounts"

echo ""
echo "📊 Step 6: Analytics & Tracking Setup"
echo "------------------------------------"

echo "📈 Planned tracking events:"
echo "   - Beat preview plays"
echo "   - License type selections"
echo "   - Cart additions"
echo "   - Purchase completions"
echo "   - Download access"

echo ""
echo "🎯 Step 7: Integration Roadmap"
echo "-----------------------------"

echo "Phase 1 - Shopify Store Setup (Week 1):"
echo "   📝 Create Shopify store account"
echo "   🎵 Configure beat products and licenses"
echo "   📦 Install digital delivery apps"
echo "   💳 Set up payment processing"

echo ""
echo "Phase 2 - Gatsby Integration (Week 2):"
echo "   📦 Install Shopify dependencies"
echo "   🔧 Configure gatsby-source-shopify"
echo "   🎨 Create product page templates"
echo "   🛒 Build shopping cart functionality"

echo ""
echo "Phase 3 - Advanced Features (Week 3-4):"
echo "   👥 Customer account management"
echo "   📧 Email marketing integration"
echo "   📱 Mobile optimization"
echo "   🔍 Search and filtering"

echo ""
echo "🚀 Ready to Start Integration?"
echo "=============================="

echo ""
echo "📋 Pre-requisites:"
echo "   1. ✅ Node.js version updated (20.19.0)"
echo "   2. ✅ Mobile image fixes applied"
echo "   3. 🔄 WordPress content integration (current phase)"
echo "   4. 🛒 Shopify store creation (next phase)"

echo ""
echo "🛠️  Next Commands to Run:"
echo "   yarn add shopify-buy gatsby-source-shopify    # Install dependencies"
echo "   yarn develop                                   # Test current build"
echo "   # Then create Shopify store at shopify.com"

echo ""
echo "📚 Documentation:"
echo "   docs/SHOPIFY_INTEGRATION_PLAN.md              # Complete integration guide"
echo "   docs/WORDPRESS_SETUP_PHASE_3.md               # Current phase documentation"

echo ""
echo "💡 Recommendation:"
echo "   Complete WordPress content integration first, then add Shopify"
echo "   This ensures a solid foundation before adding e-commerce features."

echo ""
echo "🎉 Shopify integration planning complete!"
echo "   Ready to transform Jeldon Music into a full e-commerce platform!"
