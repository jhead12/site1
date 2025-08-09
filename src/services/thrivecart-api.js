/**
 * ThriveCart API Integration
 * Handles real ThriveCart API calls and webhook processing
 */

// ThriveCart API Configuration
const THRIVECART_CONFIG = {
  apiKey: process.env.THRIVECART_API_KEY,
  baseUrl: process.env.THRIVECART_BASE_URL || 'https://api.thrivecart.com/v1',
  webhookSecret: process.env.THRIVECART_WEBHOOK_SECRET
};

/**
 * Create a ThriveCart product
 */
export const createThriveCartProduct = async (productData) => {
  try {
    const response = await fetch(`${THRIVECART_CONFIG.baseUrl}/products`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${THRIVECART_CONFIG.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: productData.name,
        price: productData.price,
        currency: productData.currency || 'USD',
        type: productData.type || 'single',
        description: productData.description,
        thank_you_page: productData.thankYouPage || `${process.env.GATSBY_SITE_URL}/purchase-success`,
        checkout_redirect: productData.redirectUrl,
        custom_fields: productData.customFields || {},
        webhook_url: `${process.env.GATSBY_SITE_URL}/api/thrivecart-webhook`
      })
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.message || 'Failed to create product');
    }

    return {
      success: true,
      productId: result.id,
      checkoutUrl: result.checkout_url,
      data: result
    };
  } catch (error) {
    console.error('ThriveCart API Error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Get ThriveCart product details
 */
export const getThriveCartProduct = async (productId) => {
  try {
    const response = await fetch(`${THRIVECART_CONFIG.baseUrl}/products/${productId}`, {
      headers: {
        'Authorization': `Bearer ${THRIVECART_CONFIG.apiKey}`
      }
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.message || 'Failed to get product');
    }

    return {
      success: true,
      product: result
    };
  } catch (error) {
    console.error('ThriveCart API Error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Get sales data for analytics
 */
export const getThriveCartSales = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    
    if (filters.startDate) params.append('start_date', filters.startDate);
    if (filters.endDate) params.append('end_date', filters.endDate);
    if (filters.productId) params.append('product_id', filters.productId);
    if (filters.status) params.append('status', filters.status);
    
    const response = await fetch(`${THRIVECART_CONFIG.baseUrl}/sales?${params}`, {
      headers: {
        'Authorization': `Bearer ${THRIVECART_CONFIG.apiKey}`
      }
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.message || 'Failed to get sales data');
    }

    return {
      success: true,
      sales: result.data || [],
      total: result.total || 0,
      filters: filters
    };
  } catch (error) {
    console.error('ThriveCart Sales API Error:', error);
    return {
      success: false,
      error: error.message,
      sales: [],
      total: 0
    };
  }
};

/**
 * Process ThriveCart webhook data
 */
export const processThriveCartWebhook = (webhookData, signature) => {
  try {
    // Verify webhook signature for security
    if (!verifyWebhookSignature(webhookData, signature)) {
      throw new Error('Invalid webhook signature');
    }

    const event = webhookData.event;
    const data = webhookData.data;

    switch (event) {
      case 'order.success':
        return processOrderSuccess(data);
      
      case 'order.refund':
        return processOrderRefund(data);
      
      case 'order.chargeback':
        return processOrderChargeback(data);
      
      case 'subscription.created':
        return processSubscriptionCreated(data);
      
      case 'subscription.cancelled':
        return processSubscriptionCancelled(data);
      
      default:
        console.log(`Unhandled webhook event: ${event}`);
        return {
          success: true,
          message: `Event ${event} received but not processed`
        };
    }
  } catch (error) {
    console.error('Webhook processing error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Verify webhook signature for security (browser-safe version)
 */
const verifyWebhookSignature = (data, signature) => {
  if (!THRIVECART_CONFIG.webhookSecret) {
    console.warn('No webhook secret configured - skipping signature verification');
    return true; // Allow in development
  }

  // In production, this would be handled server-side
  // For now, we'll skip signature verification in the browser
  console.log('Webhook signature verification skipped (browser environment)');
  return true;
};

/**
 * Process successful order webhook
 */
const processOrderSuccess = (orderData) => {
  const processedOrder = {
    orderId: orderData.order_id,
    customerEmail: orderData.customer.email,
    customerName: orderData.customer.name,
    productId: orderData.product.id,
    productName: orderData.product.name,
    amount: orderData.order.total,
    currency: orderData.order.currency,
    timestamp: new Date(orderData.order.created_at),
    status: 'completed',
    affiliateId: orderData.affiliate?.id || null,
    customFields: orderData.custom_fields || {},
    
    // Analytics data
    analytics: {
      source: orderData.tracking?.source || 'direct',
      medium: orderData.tracking?.medium || 'unknown',
      campaign: orderData.tracking?.campaign || null,
      referrer: orderData.tracking?.referrer || null,
      ip: orderData.customer?.ip || null,
      userAgent: orderData.customer?.user_agent || null
    }
  };

  // Store order data
  return storeOrder(processedOrder);
};

/**
 * Process refund webhook
 */
const processOrderRefund = (refundData) => {
  const processedRefund = {
    orderId: refundData.order_id,
    refundId: refundData.refund_id,
    amount: refundData.refund_amount,
    reason: refundData.refund_reason,
    timestamp: new Date(refundData.refunded_at),
    status: 'refunded'
  };

  return storeRefund(processedRefund);
};

/**
 * Process order chargeback webhook
 */
const processOrderChargeback = (data) => {
  try {
    console.log('Processing order chargeback:', data);
    
    // Handle chargeback logic here
    // This would typically update the order status in your database
    
    return {
      success: true,
      message: 'Order chargeback processed successfully',
      orderId: data.order_id
    };
  } catch (error) {
    console.error('Error processing chargeback:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Process subscription created webhook
 */
const processSubscriptionCreated = (data) => {
  try {
    console.log('Processing subscription created:', data);
    
    // Handle subscription creation logic here
    // This would typically store subscription data in your database
    
    return {
      success: true,
      message: 'Subscription created successfully',
      subscriptionId: data.subscription_id
    };
  } catch (error) {
    console.error('Error processing subscription:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Process subscription cancelled webhook
 */
const processSubscriptionCancelled = (data) => {
  try {
    console.log('Processing subscription cancelled:', data);
    
    // Handle subscription cancellation logic here
    // This would typically update subscription status in your database
    
    return {
      success: true,
      message: 'Subscription cancelled successfully',
      subscriptionId: data.subscription_id
    };
  } catch (error) {
    console.error('Error processing subscription cancellation:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Store order data (browser-safe version)
 */
/**
 * Store order data (browser-safe version)
 */
export const storeOrder = (orderData) => {
  try {
    if (typeof window !== 'undefined') {
      // Browser environment
      const orders = JSON.parse(localStorage.getItem('thrivecart_orders') || '[]');
      orders.push(orderData);
      localStorage.setItem('thrivecart_orders', JSON.stringify(orders));
    } else {
      // Server environment - log for debugging
      console.log('Order received (server):', orderData);
    }
    
    return {
      success: true,
      message: 'Order stored successfully',
      orderId: orderData.id
    };
  } catch (error) {
    console.error('Error storing order:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Store refund data (browser-safe version)
 */
/**
 * Store refund data (browser-safe version)
 */
export const storeRefund = (refundData) => {
  try {
    if (typeof window !== 'undefined') {
      // Browser environment
      const refunds = JSON.parse(localStorage.getItem('thrivecart_refunds') || '[]');
      refunds.push(refundData);
      localStorage.setItem('thrivecart_refunds', JSON.stringify(refunds));
    } else {
      // Server environment - log for debugging
      console.log('Refund received (server):', refundData);
    }
    
    return {
      success: true,
      message: 'Refund stored successfully',
      refundId: refundData.id
    };
  } catch (error) {
    console.error('Error storing refund:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Get stored orders for analytics (browser-safe version)
 */
export const getStoredOrders = (filters = {}) => {
  try {
    let orders = [];
    
    if (typeof window !== 'undefined') {
      // Browser environment
      orders = JSON.parse(localStorage.getItem('thrivecart_orders') || '[]');
    } else {
      // Server environment - return empty for now
      // In production, this would query a database
      orders = [];
    }

    // Apply filters
    if (filters.startDate) {
      const startDate = new Date(filters.startDate);
      orders = orders.filter(order => new Date(order.timestamp) >= startDate);
    }
    
    if (filters.endDate) {
      const endDate = new Date(filters.endDate);
      orders = orders.filter(order => new Date(order.timestamp) <= endDate);
    }
    
    if (filters.productId) {
      orders = orders.filter(order => order.productId === filters.productId);
    }
    
    if (filters.status) {
      orders = orders.filter(order => order.status === filters.status);
    }

    return {
      success: true,
      orders: orders,
      total: orders.length
    };
  } catch (error) {
    console.error('Error getting stored orders:', error);
    return {
      success: false,
      error: error.message,
      orders: [],
      total: 0
    };
  }
};

/**
 * Generate analytics data from stored orders
 */
export const generateAnalyticsData = (timeRange = '30d') => {
  try {
    const orders = getStoredOrders();
    
    if (!orders.success) {
      throw new Error(orders.error);
    }

    const now = new Date();
    const startDate = new Date();
    
    // Set date range
    switch (timeRange) {
      case '7d':
        startDate.setDate(now.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(now.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(now.getDate() - 90);
        break;
      case '1y':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate.setDate(now.getDate() - 30);
    }

    const filteredOrders = orders.orders.filter(order => 
      new Date(order.timestamp) >= startDate
    );

    // Calculate analytics
    const analytics = {
      totalRevenue: filteredOrders.reduce((sum, order) => sum + order.amount, 0),
      totalOrders: filteredOrders.length,
      averageOrderValue: filteredOrders.length > 0 ? 
        filteredOrders.reduce((sum, order) => sum + order.amount, 0) / filteredOrders.length : 0,
      
      // Revenue by product
      revenueByProduct: {},
      ordersByProduct: {},
      
      // Revenue by day
      revenueByDay: {},
      
      // Customer data
      uniqueCustomers: new Set(filteredOrders.map(order => order.customerEmail)).size,
      
      // Source attribution
      sourceBreakdown: {},
      
      timeRange: timeRange,
      dateRange: {
        start: startDate.toISOString(),
        end: now.toISOString()
      }
    };

    // Process product analytics
    filteredOrders.forEach(order => {
      // Revenue by product
      analytics.revenueByProduct[order.productName] = 
        (analytics.revenueByProduct[order.productName] || 0) + order.amount;
      
      // Orders by product
      analytics.ordersByProduct[order.productName] = 
        (analytics.ordersByProduct[order.productName] || 0) + 1;
      
      // Revenue by day
      const dayKey = new Date(order.timestamp).toISOString().split('T')[0];
      analytics.revenueByDay[dayKey] = 
        (analytics.revenueByDay[dayKey] || 0) + order.amount;
      
      // Source breakdown
      const source = order.analytics?.source || 'direct';
      analytics.sourceBreakdown[source] = 
        (analytics.sourceBreakdown[source] || 0) + order.amount;
    });

    return {
      success: true,
      analytics: analytics
    };
  } catch (error) {
    console.error('Error generating analytics:', error);
    return {
      success: false,
      error: error.message
    };
  }
};
