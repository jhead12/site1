/**
 * Shopify integration utilities
 * Functions to help with Shopify-related operations
 */

/**
 * Format a Shopify price with currency
 * @param {Object} priceV2 - Shopify price object with amount and currencyCode
 * @returns {String} - Formatted price string
 */
export function formatPrice(priceV2) {
  if (!priceV2) return ""
  
  // Get the price and currency
  const amount = priceV2.amount || "0"
  const currencyCode = priceV2.currencyCode || "USD"
  
  // Format with locale
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
  }).format(amount)
}

/**
 * Generate a URL for a Shopify product
 * @param {String} handle - The product handle
 * @returns {String} - Product URL
 */
export function getProductUrl(handle) {
  if (!handle) return "/shop"
  return `/products/${handle}/`
}

/**
 * Generate a URL for a Shopify collection
 * @param {String} handle - The collection handle
 * @returns {String} - Collection URL
 */
export function getCollectionUrl(handle) {
  if (!handle) return "/shop"
  return `/collections/${handle}/`
}

/**
 * Check if Shopify integration is configured
 * @returns {Boolean} - True if Shopify environment variables are set
 */
export function isShopifyConfigured() {
  return !!(
    process.env.GATSBY_MYSHOPIFY_URL &&
    process.env.GATSBY_SHOPIFY_ACCESS_TOKEN &&
    process.env.GATSBY_MYSHOPIFY_URL !== "your-store-name.myshopify.com" &&
    process.env.GATSBY_SHOPIFY_ACCESS_TOKEN !== "your-access-token"
  )
}

/**
 * Get product availability status
 * @param {Object} product - Shopify product
 * @returns {Boolean} - True if product is available
 */
export function isProductAvailable(product) {
  if (!product) return false
  
  // Check if at least one variant is available
  if (product.variants && product.variants.length > 0) {
    return product.variants.some(v => v.availableForSale)
  }
  
  return product.availableForSale || false
}

/**
 * Get a demo product for when Shopify is not configured
 * @returns {Object} - Mock product object
 */
export function getDemoProduct() {
  return {
    id: "demo-product-1",
    title: "Demo Beat Package",
    handle: "demo-beat-package",
    description: "This is a sample beat package that would normally come from your Shopify store.",
    productType: "Beat Package",
    tags: ["Hip Hop", "Demo", "Premium"],
    priceRange: {
      minVariantPrice: {
        amount: "29.99",
        currencyCode: "USD"
      }
    },
    variants: [
      {
        id: "demo-variant-1",
        title: "Basic License",
        priceV2: {
          amount: "29.99",
          currencyCode: "USD"
        },
        availableForSale: true
      },
      {
        id: "demo-variant-2",
        title: "Premium License",
        priceV2: {
          amount: "49.99",
          currencyCode: "USD"
        },
        availableForSale: true
      }
    ]
  }
}

/**
 * Get demo products for when Shopify is not configured
 * @param {Number} count - Number of demo products to generate
 * @returns {Array} - Array of mock product objects
 */
export function getDemoProducts(count = 6) {
  const demoProducts = []
  const types = ["Beat Package", "Sample Pack", "Sound Kit", "Mixing Service"]
  const genres = ["Hip Hop", "R&B", "Trap", "Pop", "Lo-Fi", "Drill"]
  
  for (let i = 1; i <= count; i++) {
    const productType = types[Math.floor(Math.random() * types.length)]
    const tag = genres[Math.floor(Math.random() * genres.length)]
    const price = (19.99 + (Math.floor(Math.random() * 8) * 10)).toFixed(2)
    const premiumPrice = (parseFloat(price) + 20).toFixed(2)
    
    demoProducts.push({
      id: `demo-product-${i}`,
      title: `Demo ${productType} ${i}`,
      handle: `demo-${productType.toLowerCase().replace(/\s/g, "-")}-${i}`,
      description: `This is a sample ${productType.toLowerCase()} that would normally come from your Shopify store.`,
      productType,
      tags: [tag, "Demo"],
      priceRange: {
        minVariantPrice: {
          amount: price,
          currencyCode: "USD"
        }
      },
      variants: [
        {
          id: `demo-variant-basic-${i}`,
          title: "Basic License",
          priceV2: {
            amount: price,
            currencyCode: "USD"
          },
          availableForSale: true
        },
        {
          id: `demo-variant-premium-${i}`,
          title: "Premium License",
          priceV2: {
            amount: premiumPrice,
            currencyCode: "USD"
          },
          availableForSale: true
        }
      ]
    })
  }
  
  return demoProducts
}
