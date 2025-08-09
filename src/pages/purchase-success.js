import React, { useEffect, useState } from 'react';
import { navigate } from 'gatsby';
import Layout from '../components/layout';
import SEOHead from '../components/head';

const PurchaseSuccessPage = ({ location }) => {
  const [orderDetails, setOrderDetails] = useState(null);

  useEffect(() => {
    // Parse URL parameters from ThriveCart redirect
    const urlParams = new URLSearchParams(location.search);
    const orderId = urlParams.get('order_id');
    const customerEmail = urlParams.get('customer_email');
    const productName = urlParams.get('product_name');
    const amount = urlParams.get('amount');

    if (orderId) {
      setOrderDetails({
        orderId,
        customerEmail,
        productName,
        amount,
      });

      // Track successful purchase for analytics
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'purchase', {
          transaction_id: orderId,
          value: parseFloat(amount),
          currency: 'USD',
          items: [{
            item_id: productName,
            item_name: productName,
            category: 'Music License',
            quantity: 1,
            price: parseFloat(amount),
          }],
        });
      }

      // Track Facebook Pixel if available
      if (typeof window !== 'undefined' && window.fbq) {
        window.fbq('track', 'Purchase', {
          value: parseFloat(amount),
          currency: 'USD',
        });
      }
    }
  }, [location.search]);

  return (
    <Layout>
      <SEOHead 
        title="Purchase Successful" 
        description="Thank you for your purchase! Your order has been processed successfully."
      />
      
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-xl p-8 text-center">
            <div className="mb-6">
              <div className="text-6xl text-green-500 mb-4">✅</div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Purchase Successful!
              </h1>
              <p className="text-lg text-gray-600">
                Thank you for your purchase. Your order has been processed successfully.
              </p>
            </div>

            {orderDetails && (
              <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
                <h2 className="text-xl font-semibold mb-4">Order Details</h2>
                <div className="space-y-2">
                  <p><strong>Order ID:</strong> {orderDetails.orderId}</p>
                  <p><strong>Product:</strong> {orderDetails.productName}</p>
                  <p><strong>Amount:</strong> ${orderDetails.amount}</p>
                  <p><strong>Email:</strong> {orderDetails.customerEmail}</p>
                </div>
              </div>
            )}

            <div className="bg-blue-50 rounded-lg p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4 text-blue-900">What's Next?</h2>
              <div className="space-y-3 text-left">
                <div className="flex items-start">
                  <span className="text-blue-500 mr-3 mt-1">📧</span>
                  <p>Check your email for download links and license documentation</p>
                </div>
                <div className="flex items-start">
                  <span className="text-blue-500 mr-3 mt-1">📁</span>
                  <p>Download your files immediately - links are active for 30 days</p>
                </div>
                <div className="flex items-start">
                  <span className="text-blue-500 mr-3 mt-1">📄</span>
                  <p>Save your license agreement for your records</p>
                </div>
                <div className="flex items-start">
                  <span className="text-blue-500 mr-3 mt-1">🎵</span>
                  <p>Start creating with your new music assets!</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => navigate('/')}
                className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
              >
                Return to Homepage
              </button>
              
              <div className="flex flex-col md:flex-row gap-4 justify-center">
                <button
                  onClick={() => navigate('/beats')}
                  className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
                >
                  Browse More Beats
                </button>
                <button
                  onClick={() => navigate('/contact')}
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
                >
                  Contact Support
                </button>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold mb-3">Need Help?</h3>
              <p className="text-gray-600 mb-4">
                If you have any questions about your purchase or need assistance with downloads, 
                we're here to help!
              </p>
              <div className="flex flex-col md:flex-row gap-4 justify-center text-sm">
                <a 
                  href="mailto:support@jeldonmusic.com"
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  support@jeldonmusic.com
                </a>
                <span className="hidden md:inline text-gray-400">|</span>
                <a 
                  href="/faq"
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  FAQ & Help Center
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PurchaseSuccessPage;
