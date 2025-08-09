import React, { useState } from 'react';
import Layout from '../components/layout';
import WordPressSEO from '../components/seo/wordpress-seo';
import { 
  loadSampleData, 
  clearStoredData, 
  getDataSummary,
  simulateWebhook 
} from '../utils/thrivecart-test-data';

/**
 * ThriveCart Demo Page
 * Allows testing the analytics system with sample data
 */
const ThriveCartDemo = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [dataSummary, setDataSummary] = useState(null);

  const handleLoadSampleData = async () => {
    setLoading(true);
    setMessage(null);
    
    try {
      const result = loadSampleData();
      
      if (result.success) {
        setMessage({
          type: 'success',
          text: `Success! Loaded ${result.ordersLoaded} sample orders. Check the analytics page to see the data.`
        });
        
        // Update summary
        const summary = getDataSummary();
        if (summary.success) {
          setDataSummary(summary.summary);
        }
      } else {
        setMessage({
          type: 'error',
          text: `Error: ${result.error}`
        });
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: `Error: ${error.message}`
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClearData = async () => {
    setLoading(true);
    setMessage(null);
    
    try {
      const result = clearStoredData();
      
      if (result.success) {
        setMessage({
          type: 'success',
          text: 'All data cleared successfully!'
        });
        setDataSummary(null);
      } else {
        setMessage({
          type: 'error',
          text: `Error: ${result.error}`
        });
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: `Error: ${error.message}`
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSimulateWebhook = async () => {
    setLoading(true);
    setMessage(null);
    
    try {
      const result = simulateWebhook();
      
      if (result.success) {
        setMessage({
          type: 'success',
          text: `Webhook simulated successfully! Order ${result.orderId} processed.`
        });
        
        // Update summary
        const summary = getDataSummary();
        if (summary.success) {
          setDataSummary(summary.summary);
        }
      } else {
        setMessage({
          type: 'error',
          text: `Error: ${result.error}`
        });
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: `Error: ${error.message}`
      });
    } finally {
      setLoading(false);
    }
  };

  const loadCurrentSummary = () => {
    const summary = getDataSummary();
    if (summary.success) {
      setDataSummary(summary.summary);
    }
  };

  React.useEffect(() => {
    loadCurrentSummary();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };
  return (
    <Layout>
      <WordPressSEO 
        title="ThriveCart Demo & Test Data" 
        description="Demo page for testing ThriveCart integration with sample data"
      />
      
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              ThriveCart Integration Demo
            </h1>
            <p className="text-xl text-gray-600 mb-2">
              Test the analytics system with sample data
            </p>
          </div>
          
          {/* Message Display */}
          {message && (
            <div className={`mb-6 p-4 rounded-lg ${
              message.type === 'success' 
                ? 'bg-green-100 border border-green-400 text-green-700'
                : 'bg-red-100 border border-red-400 text-red-700'
            }`}>
              {message.text}
            </div>
          )}
          
          {/* Test Data Controls */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Test Data Management</h2>
            
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <button
                onClick={handleLoadSampleData}
                disabled={loading}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {loading ? 'Loading...' : 'Load Sample Data'}
              </button>
              
              <button
                onClick={handleSimulateWebhook}
                disabled={loading}
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
              >
                {loading ? 'Processing...' : 'Simulate Order'}
              </button>
              
              <button
                onClick={handleClearData}
                disabled={loading}
                className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
              >
                {loading ? 'Clearing...' : 'Clear All Data'}
              </button>
            </div>
            
            {/* Data Summary */}
            {dataSummary && (
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Current Data Summary</h3>
                <div className="grid md:grid-cols-4 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {dataSummary.totalOrders}
                    </div>
                    <div className="text-sm text-blue-800">Total Orders</div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {formatCurrency(dataSummary.totalRevenue)}
                    </div>
                    <div className="text-sm text-green-800">Total Revenue</div>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {dataSummary.uniqueCustomers}
                    </div>
                    <div className="text-sm text-purple-800">Customers</div>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">
                      {dataSummary.uniqueProducts}
                    </div>
                    <div className="text-sm text-orange-800">Products</div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Integration Status */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h3 className="text-2xl font-semibold text-gray-900 mb-6">Integration Status</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center text-green-600">
                  <span className="mr-2">✅</span>
                  <span>ThriveCart API integration ready</span>
                </div>
                <div className="flex items-center text-green-600">
                  <span className="mr-2">✅</span>
                  <span>Webhook endpoint configured</span>
                </div>
                <div className="flex items-center text-green-600">
                  <span className="mr-2">✅</span>
                  <span>Analytics dashboard available</span>
                </div>
                <div className="flex items-center text-green-600">
                  <span className="mr-2">✅</span>
                  <span>Test data utilities working</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center text-orange-600">
                  <span className="mr-2">🔧</span>
                  <span>Real ThriveCart products needed</span>
                </div>
                <div className="flex items-center text-yellow-600">
                  <span className="mr-2">⚠️</span>
                  <span>Environment variables needed</span>
                </div>
                <div className="flex items-center text-blue-600">
                  <span className="mr-2">📊</span>
                  <span>Real-time analytics ready</span>
                </div>
                <div className="flex items-center text-purple-600">
                  <span className="mr-2">🔗</span>
                  <span>Contract system integrated</span>
                </div>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="flex items-start">
                <span className="text-orange-500 mr-3 text-xl">⚠️</span>
                <div>
                  <h4 className="font-semibold text-orange-800 mb-2">Action Required: Connect Real Products</h4>
                  <p className="text-orange-700 text-sm mb-3">
                    The store currently displays placeholder products. To enable real purchases, you need to create products in your ThriveCart account.
                  </p>
                  <a 
                    href="/thrivecart-setup" 
                    className="inline-block bg-orange-600 text-white px-4 py-2 rounded text-sm hover:bg-orange-700 transition-colors"
                  >
                    View Setup Guide →
                  </a>
                </div>
              </div>
            </div>
          </div>
          
          {/* Navigation Links */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h3 className="text-2xl font-semibold text-gray-900 mb-6">Quick Links</h3>
            <div className="grid md:grid-cols-4 gap-4">
              <a
                href="/thrivecart-analytics"
                className="block p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <h4 className="text-lg font-medium text-blue-900 mb-2">Analytics Dashboard</h4>
                <p className="text-blue-700">View real-time sales data and performance metrics</p>
              </a>
              
              <a
                href="/shop"
                className="block p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
              >
                <h4 className="text-lg font-medium text-green-900 mb-2">ThriveCart Store</h4>
                <p className="text-green-700">Browse all available beats, licenses, and courses with integrated purchasing</p>
                <div className="text-xs text-green-600 mt-2">
                  🎵 <strong>5 Products:</strong> Basic License ($50) • Premium License ($150) • Exclusive License ($1000) • Beat Pack ($200) • Masterclass ($600)
                </div>
                <div className="text-xs text-orange-600 mt-1">
                  ⚠️ <strong>Note:</strong> Currently showing placeholder data - use setup guide to connect real products
                </div>
              </a>
              
              <a
                href="/thrivecart-setup"
                className="block p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors border-2 border-orange-200"
              >
                <h4 className="text-lg font-medium text-orange-900 mb-2">🚀 Setup Guide</h4>
                <p className="text-orange-700">Step-by-step guide to connect real ThriveCart products</p>
                <div className="text-xs text-orange-600 mt-2">
                  ✨ <strong>Required:</strong> Connect your ThriveCart account and products
                </div>
              </a>
              
              <a
                href="/contracts"
                className="block p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
              >
                <h4 className="text-lg font-medium text-purple-900 mb-2">Contract Management</h4>
                <p className="text-purple-700">Create and manage exclusive deals and agreements</p>
                <div className="text-xs text-purple-600 mt-2">
                  ✨ <strong>New:</strong> Download contracts as Text, HTML, or RTF documents
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ThriveCartDemo;
