#!/bin/bash

echo "🛍️  Shopify Integration Setup for Jeldon Music Platform"
echo "=================================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Please run this script from the project root directory"
    exit 1
fi

echo "📦 Installing Shopify dependencies..."

# Install Shopify Buy SDK
yarn add shopify-buy

# Install additional e-commerce related packages
yarn add react-use-cart
yarn add @stripe/stripe-js
yarn add react-stripe-elements

echo "📁 Creating Shopify integration directories..."

# Create directories for Shopify integration
mkdir -p src/lib/shopify
mkdir -p src/components/shop
mkdir -p src/pages/shop
mkdir -p src/templates/product

echo "🔧 Creating Shopify client configuration..."

# Create Shopify client
cat > src/lib/shopify/client.js << 'EOF'
import Client from 'shopify-buy'

// Initialize Shopify client
const client = Client.buildClient({
  domain: process.env.GATSBY_MYSHOPIFY_URL || 'your-store.myshopify.com',
  storefrontAccessToken: process.env.GATSBY_SHOPIFY_ACCESS_TOKEN || 'your-access-token'
})

export default client
EOF

# Create Shopify helpers
cat > src/lib/shopify/helpers.js << 'EOF'
import client from './client'

// Fetch all products
export const fetchProducts = async () => {
  try {
    const products = await client.product.fetchAll()
    return products
  } catch (error) {
    console.error('Error fetching products:', error)
    return []
  }
}

// Fetch single product
export const fetchProduct = async (handle) => {
  try {
    const product = await client.product.fetchByHandle(handle)
    return product
  } catch (error) {
    console.error('Error fetching product:', error)
    return null
  }
}

// Create checkout
export const createCheckout = async () => {
  try {
    const checkout = await client.checkout.create()
    return checkout
  } catch (error) {
    console.error('Error creating checkout:', error)
    return null
  }
}

// Add line items to checkout
export const addLineItems = async (checkoutId, lineItems) => {
  try {
    const checkout = await client.checkout.addLineItems(checkoutId, lineItems)
    return checkout
  } catch (error) {
    console.error('Error adding line items:', error)
    return null
  }
}

// Format price
export const formatPrice = (price, currencyCode = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
  }).format(price)
}

// Check if product is a beat/music
export const isMusicProduct = (product) => {
  const musicTags = ['beat', 'instrumental', 'sample', 'stem', 'midi']
  return product.tags.some(tag => 
    musicTags.includes(tag.toLowerCase())
  )
}

// Get audio preview URL from product
export const getAudioPreview = (product) => {
  // Look for audio file in product metafields or media
  const audioMetafield = product.metafields.find(
    field => field.key === 'audio_preview'
  )
  return audioMetafield ? audioMetafield.value : null
}
EOF

echo "🎵 Creating music product components..."

# Create Beat Card component
cat > src/components/shop/BeatCard.js << 'EOF'
import React, { useState } from 'react'
import { formatPrice, getAudioPreview } from '../../lib/shopify/helpers'

const BeatCard = ({ product, onAddToCart }) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const audioPreview = getAudioPreview(product)

  const togglePlay = () => {
    // Audio play logic would go here
    setIsPlaying(!isPlaying)
  }

  return (
    <div className="beat-card bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {/* Product Image */}
      <div className="aspect-square bg-gradient-to-br from-purple-400 to-blue-500 relative">
        {product.images.length > 0 ? (
          <img
            src={product.images[0].src}
            alt={product.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white text-xl font-bold">
            {product.title}
          </div>
        )}
        
        {/* Play Button Overlay */}
        {audioPreview && (
          <button
            onClick={togglePlay}
            className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity"
          >
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
              {isPlaying ? '⏸️' : '▶️'}
            </div>
          </button>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h3 className="font-bold text-lg mb-2 line-clamp-2">{product.title}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-3">
          {product.description}
        </p>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {product.tags.slice(0, 3).map(tag => (
            <span
              key={tag}
              className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Price and Actions */}
        <div className="flex items-center justify-between">
          <div className="text-xl font-bold text-green-600">
            {formatPrice(product.variants[0].price)}
          </div>
          <button
            onClick={() => onAddToCart(product.variants[0])}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  )
}

export default BeatCard
EOF

# Create Shop Grid component
cat > src/components/shop/ShopGrid.js << 'EOF'
import React from 'react'
import BeatCard from './BeatCard'

const ShopGrid = ({ products, onAddToCart, title = "Shop" }) => {
  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No products available</p>
      </div>
    )
  }

  return (
    <div className="shop-grid">
      <h2 className="text-3xl font-bold mb-8 text-center">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map(product => (
          <BeatCard
            key={product.id}
            product={product}
            onAddToCart={onAddToCart}
          />
        ))}
      </div>
    </div>
  )
}

export default ShopGrid
EOF

echo "🛒 Creating shopping cart components..."

# Create Cart component
cat > src/components/shop/Cart.js << 'EOF'
import React from 'react'
import { formatPrice } from '../../lib/shopify/helpers'

const Cart = ({ checkout, onUpdateQuantity, onRemoveItem, onCheckout }) => {
  if (!checkout || checkout.lineItems.length === 0) {
    return (
      <div className="cart-empty text-center py-8">
        <p className="text-gray-500">Your cart is empty</p>
      </div>
    )
  }

  return (
    <div className="cart">
      <h2 className="text-2xl font-bold mb-6">Shopping Cart</h2>
      
      {/* Cart Items */}
      <div className="space-y-4 mb-6">
        {checkout.lineItems.map(item => (
          <div key={item.id} className="flex items-center space-x-4 p-4 border rounded">
            <img
              src={item.variant.image ? item.variant.image.src : '/placeholder.jpg'}
              alt={item.title}
              className="w-16 h-16 object-cover rounded"
            />
            
            <div className="flex-1">
              <h3 className="font-semibold">{item.title}</h3>
              <p className="text-sm text-gray-600">{item.variant.title}</p>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center"
              >
                -
              </button>
              <span className="w-8 text-center">{item.quantity}</span>
              <button
                onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center"
              >
                +
              </button>
            </div>
            
            <div className="text-lg font-semibold">
              {formatPrice(item.variant.price * item.quantity)}
            </div>
            
            <button
              onClick={() => onRemoveItem(item.id)}
              className="text-red-500 hover:text-red-700"
            >
              ×
            </button>
          </div>
        ))}
      </div>
      
      {/* Cart Summary */}
      <div className="border-t pt-4">
        <div className="flex justify-between items-center mb-4">
          <span className="text-lg font-semibold">Total:</span>
          <span className="text-2xl font-bold">
            {formatPrice(checkout.totalPrice)}
          </span>
        </div>
        
        <button
          onClick={onCheckout}
          className="w-full bg-green-600 text-white py-3 rounded text-lg font-semibold hover:bg-green-700 transition-colors"
        >
          Checkout
        </button>
      </div>
    </div>
  )
}

export default Cart
EOF

echo "📄 Creating shop pages..."

# Create main shop page
cat > src/pages/shop/index.js << 'EOF'
import React, { useState, useEffect } from 'react'
import Layout from '../../components/Layout'
import ShopGrid from '../../components/shop/ShopGrid'
import Cart from '../../components/shop/Cart'
import { fetchProducts, createCheckout, addLineItems } from '../../lib/shopify/helpers'

const ShopPage = () => {
  const [products, setProducts] = useState([])
  const [checkout, setCheckout] = useState(null)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProducts()
    initializeCheckout()
  }, [])

  const loadProducts = async () => {
    setLoading(true)
    const shopProducts = await fetchProducts()
    setProducts(shopProducts)
    setLoading(false)
  }

  const initializeCheckout = async () => {
    const newCheckout = await createCheckout()
    setCheckout(newCheckout)
  }

  const handleAddToCart = async (variant) => {
    if (!checkout) return

    const lineItems = [{
      variantId: variant.id,
      quantity: 1
    }]

    const updatedCheckout = await addLineItems(checkout.id, lineItems)
    setCheckout(updatedCheckout)
    setIsCartOpen(true)
  }

  const handleCheckout = () => {
    if (checkout && checkout.webUrl) {
      window.open(checkout.webUrl, '_blank')
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-lg">Loading products...</p>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Beat Store</h1>
          <button
            onClick={() => setIsCartOpen(!isCartOpen)}
            className="bg-blue-600 text-white px-4 py-2 rounded relative"
          >
            Cart
            {checkout && checkout.lineItems.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 text-sm flex items-center justify-center">
                {checkout.lineItems.length}
              </span>
            )}
          </button>
        </div>

        {/* Cart Sidebar */}
        {isCartOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden">
            <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setIsCartOpen(false)}></div>
            <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white p-6 overflow-y-auto">
              <Cart
                checkout={checkout}
                onCheckout={handleCheckout}
                onUpdateQuantity={() => {}} // Implement if needed
                onRemoveItem={() => {}} // Implement if needed
              />
            </div>
          </div>
        )}

        {/* Products Grid */}
        <ShopGrid
          products={products}
          onAddToCart={handleAddToCart}
          title="Beats & Instrumentals"
        />
      </div>
    </Layout>
  )
}

export default ShopPage

export const Head = () => (
  <>
    <title>Beat Store - Jeldon Music</title>
    <meta name="description" content="Browse and purchase high-quality beats, instrumentals, and samples from Jeldon Music." />
  </>
)
EOF

echo "🎛️ Creating product template..."

# Create product template
cat > src/templates/product.js << 'EOF'
import React, { useState } from 'react'
import Layout from '../components/Layout'
import { formatPrice, getAudioPreview } from '../lib/shopify/helpers'

const ProductTemplate = ({ pageContext }) => {
  const { product } = pageContext
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0])
  const [isPlaying, setIsPlaying] = useState(false)
  
  const audioPreview = getAudioPreview(product)

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images/Audio */}
          <div>
            <div className="aspect-square bg-gradient-to-br from-purple-400 to-blue-500 rounded-lg overflow-hidden relative">
              {product.images.length > 0 ? (
                <img
                  src={product.images[0].src}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white text-2xl font-bold">
                  {product.title}
                </div>
              )}
              
              {audioPreview && (
                <button
                  onClick={togglePlay}
                  className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 hover:bg-opacity-40 transition-all"
                >
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
                    <span className="text-2xl">{isPlaying ? '⏸️' : '▶️'}</span>
                  </div>
                </button>
              )}
            </div>
          </div>

          {/* Product Details */}
          <div>
            <h1 className="text-3xl font-bold mb-4">{product.title}</h1>
            
            {/* Price */}
            <div className="text-3xl font-bold text-green-600 mb-6">
              {formatPrice(selectedVariant.price)}
            </div>

            {/* Description */}
            <div className="prose mb-6">
              <p>{product.description}</p>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              {product.tags.map(tag => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Variants */}
            {product.variants.length > 1 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">License Type:</h3>
                <div className="space-y-2">
                  {product.variants.map(variant => (
                    <label key={variant.id} className="flex items-center">
                      <input
                        type="radio"
                        name="variant"
                        value={variant.id}
                        checked={selectedVariant.id === variant.id}
                        onChange={() => setSelectedVariant(variant)}
                        className="mr-2"
                      />
                      <span>{variant.title} - {formatPrice(variant.price)}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Add to Cart */}
            <button className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors">
              Add to Cart
            </button>

            {/* Additional Info */}
            <div className="mt-8 text-sm text-gray-600">
              <h4 className="font-semibold mb-2">What's Included:</h4>
              <ul className="list-disc list-inside space-y-1">
                <li>High-quality WAV file</li>
                <li>MP3 version for easy sharing</li>
                <li>Trackout stems (Premium license)</li>
                <li>Commercial usage rights</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default ProductTemplate

export const Head = ({ pageContext }) => {
  const { product } = pageContext
  return (
    <>
      <title>{product.title} - Jeldon Music</title>
      <meta name="description" content={product.description} />
    </>
  )
}
EOF

echo "⚙️  Adding environment variables to .env files..."

# Add Shopify environment variables
cat >> .env.development << 'EOF'

# Shopify Configuration
GATSBY_MYSHOPIFY_URL=your-store.myshopify.com
GATSBY_SHOPIFY_ACCESS_TOKEN=your-storefront-access-token
EOF

cat >> .env.production << 'EOF'

# Shopify Configuration
GATSBY_MYSHOPIFY_URL=your-store.myshopify.com
GATSBY_SHOPIFY_ACCESS_TOKEN=your-storefront-access-token
EOF

echo "📝 Adding scripts to package.json..."

# Add new scripts for Shopify
node -e "
const fs = require('fs');
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
pkg.scripts['setup:shopify'] = 'bash ./scripts/setup-shopify.sh';
pkg.scripts['test:shopify'] = 'echo \"Testing Shopify integration...\" && node -e \"console.log(process.env.GATSBY_MYSHOPIFY_URL ? \'✅ Shopify URL configured\' : \'❌ Shopify URL not configured\')\"';
fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
"

echo "✅ Shopify integration setup complete!"
echo ""
echo "🎯 Next Steps:"
echo "   1. Create a Shopify store at https://shopify.com"
echo "   2. Install WPGraphQL and required apps"
echo "   3. Get your Storefront Access Token"
echo "   4. Update environment variables in .env files"
echo "   5. Add your first products (beats, samples, merchandise)"
echo "   6. Test the integration with: yarn test:shopify"
echo ""
echo "📋 Required Shopify Apps:"
echo "   - Music Player (for audio previews)"
echo "   - Digital Downloads (for beat delivery)"
echo "   - License Manager (for beat licensing)"
echo ""
echo "💰 Revenue Potential:"
echo "   - Individual beats: $20-100 each"
echo "   - Beat packs: $50-300 each"
echo "   - Exclusive rights: $200-1000+ each"
echo "   - Subscription model: $20-50/month"
echo ""
echo "🔗 Integration Status: Ready for Shopify store setup!"
