# 🎵 ThriveCart API Integration for Gatsby UI

## 🚀 ThriveCart Setup with API Integration

### Step 1: Enable ThriveCart API Access

#### A. API Configuration in ThriveCart Dashboard
1. **Login to ThriveCart**
2. **Go to Settings → API**
3. **Generate API Key**: Save this securely
4. **Enable API endpoints**:
   - Products API ✅
   - Orders API ✅
   - Customers API ✅
   - Affiliates API ✅

#### B. Webhook Configuration
```javascript
// Webhook endpoints for real-time updates
const webhookEndpoints = {
  purchase: "https://your-site.com/api/thrivecart/purchase",
  refund: "https://your-site.com/api/thrivecart/refund", 
  affiliate: "https://your-site.com/api/thrivecart/affiliate",
  subscription: "https://your-site.com/api/thrivecart/subscription"
};
```

---

## 🎛️ Integration with Your Gatsby Sliders & UI

### ThriveCart API Service for Gatsby

#### A. Create ThriveCart Service
```javascript
// src/services/thriveCartApi.js
class ThriveCartAPI {
  constructor() {
    this.apiKey = process.env.THRIVECART_API_KEY;
    this.baseUrl = 'https://api.thrivecart.com/v1';
    this.headers = {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json'
    };
  }

  // Get all products for sliders
  async getProducts() {
    try {
      const response = await fetch(`${this.baseUrl}/products`, {
        headers: this.headers
      });
      return await response.json();
    } catch (error) {
      console.error('ThriveCart API Error:', error);
      return [];
    }
  }

  // Get specific product for beat player
  async getProduct(productId) {
    try {
      const response = await fetch(`${this.baseUrl}/products/${productId}`, {
        headers: this.headers
      });
      return await response.json();
    } catch (error) {
      console.error('Error fetching product:', error);
      return null;
    }
  }

  // Get product analytics for pricing optimization
  async getProductAnalytics(productId) {
    try {
      const response = await fetch(`${this.baseUrl}/analytics/products/${productId}`, {
        headers: this.headers
      });
      return await response.json();
    } catch (error) {
      console.error('Error fetching analytics:', error);
      return null;
    }
  }

  // Create checkout URL for purchase
  async createCheckout(productId, options = {}) {
    try {
      const payload = {
        product_id: productId,
        success_url: options.successUrl || `${window.location.origin}/success`,
        cancel_url: options.cancelUrl || `${window.location.origin}/cart`,
        affiliate_code: options.affiliateCode,
        coupon_code: options.couponCode
      };

      const response = await fetch(`${this.baseUrl}/checkout`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      return data.checkout_url;
    } catch (error) {
      console.error('Error creating checkout:', error);
      return null;
    }
  }
}

export default new ThriveCartAPI();
```

#### B. Beat Slider Component with ThriveCart Integration
```javascript
// src/components/BeatSlider.js
import React, { useState, useEffect } from 'react';
import ThriveCartAPI from '../services/thriveCartApi';

const BeatSlider = () => {
  const [beats, setBeats] = useState([]);
  const [currentBeat, setCurrentBeat] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBeats();
  }, []);

  const loadBeats = async () => {
    setLoading(true);
    const products = await ThriveCartAPI.getProducts();
    
    // Filter for beat products only
    const beatProducts = products.filter(product => 
      product.category === 'beats' || product.tags.includes('beat')
    );
    
    setBeats(beatProducts);
    setLoading(false);
  };

  const handlePurchase = async (beatId, licenseType = 'basic') => {
    // Find the product variant for the license type
    const beat = beats.find(b => b.id === beatId);
    const variant = beat.variants.find(v => v.license_type === licenseType);
    
    const checkoutUrl = await ThriveCartAPI.createCheckout(variant.id, {
      successUrl: `${window.location.origin}/purchase-success?beat=${beatId}`,
      cancelUrl: `${window.location.origin}/beats/${beat.slug}`
    });

    if (checkoutUrl) {
      window.open(checkoutUrl, '_blank');
    }
  };

  const renderPricingOptions = (beat) => (
    <div className="pricing-options">
      {beat.variants.map(variant => (
        <button
          key={variant.id}
          onClick={() => handlePurchase(beat.id, variant.license_type)}
          className={`price-btn ${variant.license_type}`}
        >
          {variant.license_type.toUpperCase()} - ${variant.price}
        </button>
      ))}
    </div>
  );

  if (loading) {
    return <div className="beat-slider-loading">Loading beats...</div>;
  }

  return (
    <div className="beat-slider">
      <div className="beat-display">
        <h3>{beats[currentBeat]?.name}</h3>
        <audio 
          controls 
          src={beats[currentBeat]?.preview_url}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />
        {renderPricingOptions(beats[currentBeat])}
      </div>
      
      <div className="beat-controls">
        <button onClick={() => setCurrentBeat(Math.max(0, currentBeat - 1))}>
          Previous
        </button>
        <button onClick={() => setCurrentBeat(Math.min(beats.length - 1, currentBeat + 1))}>
          Next
        </button>
      </div>
    </div>
  );
};

export default BeatSlider;
```

#### C. Product Grid with ThriveCart Data
```javascript
// src/components/ProductGrid.js
import React, { useState, useEffect } from 'react';
import ThriveCartAPI from '../services/thriveCartApi';

const ProductGrid = ({ category = 'all' }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, category]);

  const loadProducts = async () => {
    const data = await ThriveCartAPI.getProducts();
    setProducts(data);
  };

  const filterProducts = () => {
    if (category === 'all') {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter(p => 
        p.category === category || p.tags.includes(category)
      ));
    }
  };

  return (
    <div className="product-grid">
      {filteredProducts.map(product => (
        <ProductCard 
          key={product.id} 
          product={product}
          onPurchase={(variantId) => handlePurchase(variantId)}
        />
      ))}
    </div>
  );
};
```

---

## 🎛️ Real-Time UI Updates with Webhooks

### Webhook Handler for WordPress
```php
// WordPress webhook handler
function handle_thrivecart_webhook() {
    $payload = json_decode(file_get_contents('php://input'), true);
    
    switch($payload['event']) {
        case 'purchase':
            handle_purchase($payload['data']);
            break;
        case 'refund':
            handle_refund($payload['data']);
            break;
        case 'affiliate_signup':
            handle_affiliate_signup($payload['data']);
            break;
    }
    
    wp_send_json_success();
}

function handle_purchase($data) {
    // Update customer access
    // Trigger email notifications
    // Update analytics
    // Sync with Gatsby via GraphQL
}
```

### GraphQL Integration
```javascript
// gatsby-node.js - Create ThriveCart nodes
exports.sourceNodes = async ({ actions, createContentDigest }) => {
  const { createNode } = actions;
  
  // Fetch ThriveCart products
  const products = await ThriveCartAPI.getProducts();
  
  products.forEach(product => {
    createNode({
      ...product,
      id: `thrivecart-product-${product.id}`,
      parent: null,
      children: [],
      internal: {
        type: 'ThriveCartProduct',
        content: JSON.stringify(product),
        contentDigest: createContentDigest(product),
      },
    });
  });
};
```

---

## 📊 Analytics Integration for UI

### Dashboard Component with ThriveCart Analytics
```javascript
// src/components/AnalyticsDashboard.js
const AnalyticsDashboard = () => {
  const [analytics, setAnalytics] = useState({});
  
  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    const data = await ThriveCartAPI.getProductAnalytics();
    setAnalytics({
      topSellingBeats: data.top_products,
      conversionRates: data.conversion_rates,
      revenueMetrics: data.revenue,
      customerInsights: data.customers
    });
  };

  return (
    <div className="analytics-dashboard">
      <div className="metric-card">
        <h3>Top Selling Beats</h3>
        {analytics.topSellingBeats?.map(beat => (
          <div key={beat.id}>
            {beat.name} - ${beat.revenue} ({beat.sales} sales)
          </div>
        ))}
      </div>
      
      <div className="metric-card">
        <h3>Conversion Rates</h3>
        <p>Basic License: {analytics.conversionRates?.basic}%</p>
        <p>Premium License: {analytics.conversionRates?.premium}%</p>
        <p>Exclusive Rights: {analytics.conversionRates?.exclusive}%</p>
      </div>
    </div>
  );
};
```

---

## 🎵 Updated Pricing Structure (2x)

### Beat Licensing Tiers
```javascript
const pricingTiers = {
  basic: {
    price: 50,  // was $25
    features: ['MP3 download', 'Personal use', '2-year license'],
    thriveCartProductId: 'tc_beat_basic_001'
  },
  premium: {
    price: 150, // was $75
    features: ['WAV + stems', 'Commercial use', '5-year license'],
    thriveCartProductId: 'tc_beat_premium_001'
  },
  exclusive: {
    price: 1000, // was $500
    features: ['Full ownership', 'All formats', 'Unlimited usage'],
    thriveCartProductId: 'tc_beat_exclusive_001'
  }
};
```

### Revenue Projections (Updated)
```javascript
const revenueProjections = {
  weekly: {
    basicLicenses: 50 * 10, // $500/week
    premiumLicenses: 150 * 5, // $750/week
    exclusiveRights: 1000 * 1, // $1000/week
    beatPacks: 200 * 2, // $400/week
    courses: 600 * 1, // $600/week
    total: 3250 // $3,250/week
  },
  monthly: {
    total: 13000 // ~$13K/month potential
  }
};
```

---

## 🚀 Next Steps to Start ThriveCart Integration

### Today (30 minutes):
1. **Sign up for ThriveCart** - [thrivecart.com](https://thrivecart.com)
2. **Create first beat products** with 2x pricing
3. **Generate API key** and configure webhooks
4. **Test API connection** with a simple fetch

### Tomorrow (45 minutes):
1. **Install ThriveCart WordPress plugin**
2. **Create ThriveCart API service** in Gatsby
3. **Build basic product component** that fetches ThriveCart data
4. **Test purchase flow** end-to-end

**With ThriveCart's API, your sliders and UI will have real-time access to:**
- ✅ Product data and pricing
- ✅ Purchase analytics and trends  
- ✅ Customer behavior insights
- ✅ Affiliate performance metrics
- ✅ A/B testing results

This creates a dynamic, data-driven UI that adapts based on real sales performance!
