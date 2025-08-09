/**
 * ThriveCart API Service
 * Handles all ThriveCart API interactions for e-commerce functionality
 */

const THRIVECART_CONFIG = {
  get apiKey() {
    return typeof process !== 'undefined' ? process.env.THRIVECART_API_KEY : null;
  },
  get baseUrl() {
    return typeof process !== 'undefined' ? (process.env.THRIVECART_BASE_URL || 'https://api.thrivecart.com/v1') : 'https://api.thrivecart.com/v1';
  },
  get productIds() {
    if (typeof process === 'undefined') {
      return {
        beatBasic: 'tc_beat_basic_50',
        beatPremium: 'tc_beat_premium_150',
        beatExclusive: 'tc_beat_exclusive_1000',
        beatPack: 'tc_beat_pack_200',
        masterclass: 'tc_masterclass_600',
      };
    }
    return {
      beatBasic: process.env.THRIVECART_BEAT_BASIC_ID,
      beatPremium: process.env.THRIVECART_BEAT_PREMIUM_ID,
      beatExclusive: process.env.THRIVECART_BEAT_EXCLUSIVE_ID,
      beatPack: process.env.THRIVECART_BEAT_PACK_ID,
      masterclass: process.env.THRIVECART_MASTERCLASS_ID,
    };
  },
};

class ThriveCartService {
  constructor() {
    this.apiKey = THRIVECART_CONFIG.apiKey;
    this.baseUrl = THRIVECART_CONFIG.baseUrl;
  }

  /**
   * Make authenticated API request to ThriveCart
   */
  async makeRequest(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
      ...options.headers,
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        throw new Error(`ThriveCart API error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('ThriveCart API request failed:', error);
      throw error;
    }
  }

  /**
   * Get product information by ID
   */
  async getProduct(productId) {
    try {
      return await this.makeRequest(`/products/${productId}`);
    } catch (error) {
      console.error(`Failed to fetch product ${productId}:`, error);
      return null;
    }
  }

  /**
   * Get all products
   */
  async getProducts() {
    try {
      return await this.makeRequest('/products');
    } catch (error) {
      console.error('Failed to fetch products:', error);
      return [];
    }
  }

  /**
   * Create a checkout session
   */
  async createCheckoutSession(productId, options = {}) {
    const payload = {
      product_id: productId,
      success_url: options.successUrl || `${process.env.GATSBY_SITE_URL}/success`,
      cancel_url: options.cancelUrl || `${process.env.GATSBY_SITE_URL}/cancel`,
      customer_email: options.customerEmail,
      custom_fields: options.customFields || {},
      ...options,
    };

    try {
      return await this.makeRequest('/checkout/create', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    } catch (error) {
      console.error('Failed to create checkout session:', error);
      throw error;
    }
  }

  /**
   * Get customer information
   */
  async getCustomer(customerId) {
    try {
      return await this.makeRequest(`/customers/${customerId}`);
    } catch (error) {
      console.error(`Failed to fetch customer ${customerId}:`, error);
      return null;
    }
  }

  /**
   * Get order information
   */
  async getOrder(orderId) {
    try {
      return await this.makeRequest(`/orders/${orderId}`);
    } catch (error) {
      console.error(`Failed to fetch order ${orderId}:`, error);
      return null;
    }
  }

  /**
   * Get analytics data
   */
  async getAnalytics(startDate, endDate) {
    try {
      const params = new URLSearchParams({
        start_date: startDate,
        end_date: endDate,
      });
      return await this.makeRequest(`/analytics?${params}`);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
      return null;
    }
  }

  /**
   * Validate webhook signature (server-side only)
   * Note: This method is only available on the server-side (webhook endpoint)
   * Client-side validation is not needed for security
   */
  validateWebhookSignature(payload, signature, secret) {
    // This method should only be called from server-side code (webhook handler)
    console.warn('Webhook signature validation should be handled server-side in the webhook endpoint');
    return false;
  }

  /**
   * Get product pricing with current configuration
   */
  getProductPricing() {
    return {
      beatBasic: {
        id: THRIVECART_CONFIG.productIds.beatBasic,
        name: 'Basic Beat License',
        price: 50, // 2x pricing
        originalPrice: 25,
        description: 'Standard licensing for personal and commercial use',
        features: [
          'High-quality WAV and MP3 files',
          'Basic commercial rights',
          'Email support',
          'Instant download',
        ],
      },
      beatPremium: {
        id: THRIVECART_CONFIG.productIds.beatPremium,
        name: 'Premium Beat License',
        price: 150, // 2x pricing
        originalPrice: 75,
        description: 'Enhanced licensing with additional rights and stems',
        features: [
          'Everything in Basic',
          'Tracked-out stems',
          'Extended commercial rights',
          'Priority support',
          'Future variations included',
        ],
      },
      beatExclusive: {
        id: THRIVECART_CONFIG.productIds.beatExclusive,
        name: 'Exclusive Beat License + Copyright',
        price: 1000, // 2x pricing
        originalPrice: 500,
        description: 'Full ownership with copyright transfer',
        features: [
          'Everything in Premium',
          'Full copyright ownership',
          'Exclusive usage rights',
          'Master recording rights',
          'Publishing rights included',
          'Custom contract documentation',
        ],
      },
      beatPack: {
        id: THRIVECART_CONFIG.productIds.beatPack,
        name: 'Beat Pack Bundle',
        price: 200, // 2x pricing
        originalPrice: 100,
        description: 'Collection of 10 premium beats',
        features: [
          '10 high-quality beats',
          'Premium licensing for all',
          'Bulk discount pricing',
          'Tracked-out stems included',
        ],
      },
      masterclass: {
        id: THRIVECART_CONFIG.productIds.masterclass,
        name: 'Producer Masterclass',
        price: 600, // 2x pricing
        originalPrice: 300,
        description: 'Complete music production course',
        features: [
          '20+ hours of video content',
          'Project files included',
          'One-on-one mentoring session',
          'Private Discord community',
          'Lifetime access',
        ],
      },
    };
  }
}

// Export singleton instance
const thriveCartService = new ThriveCartService();
export default thriveCartService;

// Export class for testing
export { ThriveCartService, THRIVECART_CONFIG };
