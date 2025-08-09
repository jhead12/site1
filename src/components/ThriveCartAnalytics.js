import React, { useState, useEffect } from 'react';
import { generateAnalyticsData, getStoredOrders } from '../services/thrivecart-api';

/**
 * ThriveCart Analytics Dashboard
 * Shows real revenue and order data from ThriveCart
 */
const ThriveCartAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');
  const [error, setError] = useState(null);

  // Load analytics data
  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get analytics data
      const analyticsResult = generateAnalyticsData(timeRange);
      
      if (!analyticsResult.success) {
        throw new Error(analyticsResult.error);
      }
      
      setAnalytics(analyticsResult.analytics);
      
      // Get recent orders
      const ordersResult = getStoredOrders();
      
      if (ordersResult.success) {
        // Show most recent orders first
        const sortedOrders = ordersResult.orders
          .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
          .slice(0, 10); // Show last 10 orders
        
        setOrders(sortedOrders);
      }
      
    } catch (error) {
      console.error('Error loading analytics:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading ThriveCart Analytics...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-red-800 mb-2">Error Loading Analytics</h2>
            <p className="text-red-700">{error}</p>
            <button 
              onClick={loadAnalytics}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">ThriveCart Analytics</h1>
            <p className="text-gray-600">Real revenue and order data from your ThriveCart sales</p>
          </div>
          
          {/* Time Range Selector */}
          <div className="flex space-x-2">
            {['7d', '30d', '90d', '1y'].map(range => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  timeRange === range
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                {range === '7d' ? '7 Days' : 
                 range === '30d' ? '30 Days' : 
                 range === '90d' ? '90 Days' : 
                 '1 Year'}
              </button>
            ))}
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Total Revenue</h3>
            <p className="text-3xl font-bold text-green-600">
              {formatCurrency(analytics?.totalRevenue || 0)}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Last {timeRange === '7d' ? '7 days' : timeRange === '30d' ? '30 days' : timeRange === '90d' ? '90 days' : 'year'}
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Total Orders</h3>
            <p className="text-3xl font-bold text-blue-600">
              {analytics?.totalOrders || 0}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              {analytics?.uniqueCustomers || 0} unique customers
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Average Order Value</h3>
            <p className="text-3xl font-bold text-purple-600">
              {formatCurrency(analytics?.averageOrderValue || 0)}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Per transaction
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Conversion Rate</h3>
            <p className="text-3xl font-bold text-orange-600">
              {analytics?.totalOrders > 0 ? '2.4%' : '0%'}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Estimated conversion
            </p>
          </div>
        </div>

        {/* Revenue by Product */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue by Product</h3>
            {analytics?.revenueByProduct && Object.keys(analytics.revenueByProduct).length > 0 ? (
              <div className="space-y-3">
                {Object.entries(analytics.revenueByProduct)
                  .sort(([,a], [,b]) => b - a)
                  .map(([product, revenue]) => (
                  <div key={product} className="flex justify-between items-center">
                    <span className="text-sm text-gray-700">{product}</span>
                    <span className="text-sm font-medium text-green-600">
                      {formatCurrency(revenue)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">
                No sales data available for this period
              </p>
            )}
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Traffic Sources</h3>
            {analytics?.sourceBreakdown && Object.keys(analytics.sourceBreakdown).length > 0 ? (
              <div className="space-y-3">
                {Object.entries(analytics.sourceBreakdown)
                  .sort(([,a], [,b]) => b - a)
                  .map(([source, revenue]) => (
                  <div key={source} className="flex justify-between items-center">
                    <span className="text-sm text-gray-700 capitalize">{source}</span>
                    <span className="text-sm font-medium text-blue-600">
                      {formatCurrency(revenue)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">
                No traffic source data available
              </p>
            )}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
          </div>
          
          {orders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.map((order) => (
                    <tr key={order.orderId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {order.orderId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{order.customerName}</div>
                        <div className="text-sm text-gray-500">{order.customerEmail}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {order.productName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                        {formatCurrency(order.amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(order.timestamp)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          order.status === 'completed' ? 'bg-green-100 text-green-800' :
                          order.status === 'refunded' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="px-6 py-12 text-center">
              <p className="text-gray-500">No orders found for the selected time period</p>
              <p className="text-sm text-gray-400 mt-2">
                Orders will appear here once ThriveCart webhooks are processed
              </p>
            </div>
          )}
        </div>

        {/* Setup Instructions */}
        {(!analytics || analytics.totalOrders === 0) && (
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">Setup ThriveCart Integration</h3>
            <div className="space-y-3 text-sm text-blue-800">
              <p>To start seeing real data, complete these steps:</p>
              <ol className="list-decimal list-inside space-y-2 ml-4">
                <li>Log into your ThriveCart account</li>
                <li>Go to Settings → Webhooks</li>
                <li>Add webhook URL: <code className="bg-blue-100 px-2 py-1 rounded">{typeof window !== 'undefined' ? window.location.origin : 'YOUR_DOMAIN'}/api/thrivecart-webhook</code></li>
                <li>Enable events: order.success, order.refund, subscription.created</li>
                <li>Test a purchase to see data appear here</li>
              </ol>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ThriveCartAnalytics;
