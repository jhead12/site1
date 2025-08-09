/**
 * ThriveCart Test Data Generator
 * Creates sample order data to demonstrate the analytics system
 */

import { 
  generateAnalyticsData, 
  getStoredOrders,
  processThriveCartWebhook
} from '../services/thrivecart-api';

// Define storeOrderData locally since we need to import it differently
const storeOrderData = (orderData) => {
  try {
    // For now, store in localStorage (browser) or file (Node.js)
    if (typeof window !== 'undefined') {
      // Browser environment
      const existingOrders = JSON.parse(localStorage.getItem('thrivecart_orders') || '[]');
      existingOrders.push(orderData);
      localStorage.setItem('thrivecart_orders', JSON.stringify(existingOrders));
    } else {
      // Server environment - just log for now
      console.log('Order data would be stored server-side:', orderData);
    }

    console.log('Order stored successfully:', orderData.orderId);
    
    return {
      success: true,
      orderId: orderData.orderId,
      message: 'Order processed and stored successfully'
    };
  } catch (error) {
    console.error('Error storing order data:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Generate sample ThriveCart orders for testing
 */
export const generateSampleOrders = () => {
  const sampleOrders = [
    {
      orderId: 'TC_001_' + Date.now(),
      customerEmail: 'john.doe@example.com',
      customerName: 'John Doe',
      productId: process.env.GATSBY_THRIVECART_BEAT_BASIC_ID,
      productName: 'Basic Beat License',
      amount: 50.00,
      currency: 'USD',
      timestamp: new Date(Date.now() - 86400000 * 2), // 2 days ago
      status: 'completed',
      affiliateId: null,
      customFields: {
        contract_type: 'non_exclusive',
        usage_rights: 'basic'
      },
      analytics: {
        source: 'instagram',
        medium: 'social',
        campaign: 'beat_promotion',
        referrer: 'https://instagram.com',
        ip: '192.168.1.1',
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X)'
      }
    },
    {
      orderId: 'TC_002_' + Date.now(),
      customerEmail: 'jane.smith@example.com',
      customerName: 'Jane Smith',
      productId: process.env.GATSBY_THRIVECART_BEAT_PREMIUM_ID,
      productName: 'Premium Beat License',
      amount: 150.00,
      currency: 'USD',
      timestamp: new Date(Date.now() - 86400000 * 1), // 1 day ago
      status: 'completed',
      affiliateId: null,
      customFields: {
        contract_type: 'exclusive',
        usage_rights: 'premium'
      },
      analytics: {
        source: 'google',
        medium: 'organic',
        campaign: null,
        referrer: 'https://google.com',
        ip: '192.168.1.2',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    },
    {
      orderId: 'TC_003_' + Date.now(),
      customerEmail: 'mike.johnson@example.com',
      customerName: 'Mike Johnson',
      productId: process.env.GATSBY_THRIVECART_BEAT_EXCLUSIVE_ID,
      productName: 'Exclusive Beat License',
      amount: 1000.00,
      currency: 'USD',
      timestamp: new Date(Date.now() - 3600000 * 6), // 6 hours ago
      status: 'completed',
      affiliateId: 'AFF_001',
      customFields: {
        contract_type: 'buyout',
        usage_rights: 'exclusive'
      },
      analytics: {
        source: 'youtube',
        medium: 'referral',
        campaign: 'producer_showcase',
        referrer: 'https://youtube.com',
        ip: '192.168.1.3',
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
      }
    },
    {
      orderId: 'TC_004_' + Date.now(),
      customerEmail: 'sarah.wilson@example.com',
      customerName: 'Sarah Wilson',
      productId: process.env.GATSBY_THRIVECART_BEAT_PACK_ID,
      productName: 'Beat Pack Bundle',
      amount: 200.00,
      currency: 'USD',
      timestamp: new Date(Date.now() - 3600000 * 2), // 2 hours ago
      status: 'completed',
      affiliateId: null,
      customFields: {
        contract_type: 'non_exclusive',
        usage_rights: 'basic',
        pack_size: '5_beats'
      },
      analytics: {
        source: 'direct',
        medium: 'none',
        campaign: null,
        referrer: null,
        ip: '192.168.1.4',
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)'
      }
    },
    {
      orderId: 'TC_005_' + Date.now(),
      customerEmail: 'alex.brown@example.com',
      customerName: 'Alex Brown',
      productId: process.env.GATSBY_THRIVECART_MASTERCLASS_ID,
      productName: 'Producer Masterclass',
      amount: 600.00,
      currency: 'USD',
      timestamp: new Date(Date.now() - 3600000), // 1 hour ago
      status: 'completed',
      affiliateId: 'AFF_002',
      customFields: {
        course_type: 'masterclass',
        access_level: 'premium'
      },
      analytics: {
        source: 'facebook',
        medium: 'social',
        campaign: 'masterclass_launch',
        referrer: 'https://facebook.com',
        ip: '192.168.1.5',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    },
    {
      orderId: 'TC_006_' + Date.now(),
      customerEmail: 'chris.davis@example.com',
      customerName: 'Chris Davis',
      productId: process.env.GATSBY_THRIVECART_BEAT_BASIC_ID,
      productName: 'Basic Beat License',
      amount: 50.00,
      currency: 'USD',
      timestamp: new Date(Date.now() - 86400000 * 7), // 1 week ago
      status: 'completed',
      affiliateId: null,
      customFields: {
        contract_type: 'non_exclusive',
        usage_rights: 'basic'
      },
      analytics: {
        source: 'tiktok',
        medium: 'social',
        campaign: 'viral_beat',
        referrer: 'https://tiktok.com',
        ip: '192.168.1.6',
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_8 like Mac OS X)'
      }
    }
  ];

  return sampleOrders;
};

/**
 * Load sample data into the system
 */
export const loadSampleData = () => {
  try {
    const sampleOrders = generateSampleOrders();
    
    // Clear existing data first (for testing)
    if (typeof window !== 'undefined') {
      localStorage.removeItem('thrivecart_orders');
      localStorage.removeItem('thrivecart_refunds');
    }
    
    // Store each sample order
    sampleOrders.forEach(order => {
      // Simulate the webhook processing
      const result = storeOrderData(order);
      if (result.success) {
        console.log(`Sample order stored: ${order.orderId}`);
      } else {
        console.error(`Failed to store order: ${order.orderId}`, result.error);
      }
    });
    
    console.log(`Loaded ${sampleOrders.length} sample orders`);
    
    // Generate and display analytics
    const analytics = generateAnalyticsData('30d');
    if (analytics.success) {
      console.log('Sample Analytics Generated:', analytics.analytics);
    }
    
    return {
      success: true,
      ordersLoaded: sampleOrders.length,
      message: 'Sample data loaded successfully'
    };
    
  } catch (error) {
    console.error('Error loading sample data:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Clear all stored data
 */
export const clearStoredData = () => {
  try {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('thrivecart_orders');
      localStorage.removeItem('thrivecart_refunds');
    } else {
      // Server environment - just log for now
      console.log('Data would be cleared server-side');
    }
    
    return {
      success: true,
      message: 'All data cleared successfully'
    };
  } catch (error) {
    console.error('Error clearing data:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Get current data summary
 */
export const getDataSummary = () => {
  try {
    const ordersResult = getStoredOrders();
    const analyticsResult = generateAnalyticsData('30d');
    
    return {
      success: true,
      summary: {
        totalOrders: ordersResult.total || 0,
        totalRevenue: analyticsResult.analytics?.totalRevenue || 0,
        averageOrderValue: analyticsResult.analytics?.averageOrderValue || 0,
        uniqueCustomers: analyticsResult.analytics?.uniqueCustomers || 0,
        dateRange: analyticsResult.analytics?.dateRange,
        topProducts: analyticsResult.analytics?.revenueByProduct || {},
        trafficSources: analyticsResult.analytics?.sourceBreakdown || {}
      }
    };
  } catch (error) {
    console.error('Error getting data summary:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Simulate a webhook for testing
 */
export const simulateWebhook = (orderData = null) => {
  const sampleWebhookData = orderData || {
    event: 'order.success',
    data: {
      order_id: 'TC_TEST_' + Date.now(),
      customer: {
        email: 'test@example.com',
        name: 'Test Customer',
        ip: '192.168.1.100',
        user_agent: 'Mozilla/5.0 Test Browser'
      },
      product: {
        id: process.env.GATSBY_THRIVECART_BEAT_BASIC_ID,
        name: 'Test Beat License'
      },
      order: {
        total: 75.00,
        currency: 'USD',
        created_at: new Date().toISOString()
      },
      affiliate: null,
      custom_fields: {
        test_order: 'true'
      },
      tracking: {
        source: 'test',
        medium: 'api',
        campaign: 'test_campaign'
      }
    }
  };
  
  // Process the simulated webhook
  const result = processThriveCartWebhook(sampleWebhookData, null);
  
  console.log('Simulated webhook result:', result);
  
  return result;
};
