import React from 'react';
import { navigate } from 'gatsby';
import Layout from '../components/layout';
import SEOHead from '../components/head';

const PurchaseCancelledPage = () => {
  return (
    <Layout>
      <SEOHead 
        title="Purchase Cancelled" 
        description="Your purchase was cancelled. You can try again anytime."
      />
      
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-red-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-xl p-8 text-center">
            <div className="mb-6">
              <div className="text-6xl text-gray-400 mb-4">❌</div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Purchase Cancelled
              </h1>
              <p className="text-lg text-gray-600">
                No worries! Your purchase was cancelled and no charges were made.
              </p>
            </div>

            <div className="bg-yellow-50 rounded-lg p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4 text-yellow-900">What Happened?</h2>
              <div className="space-y-3 text-left">
                <div className="flex items-start">
                  <span className="text-yellow-500 mr-3 mt-1">⏰</span>
                  <p>You may have closed the checkout window or taken too long to complete the purchase</p>
                </div>
                <div className="flex items-start">
                  <span className="text-yellow-500 mr-3 mt-1">🔒</span>
                  <p>Payment processing was interrupted or cancelled</p>
                </div>
                <div className="flex items-start">
                  <span className="text-yellow-500 mr-3 mt-1">🛒</span>
                  <p>You decided to review your options before purchasing</p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4 text-blue-900">Ready to Try Again?</h2>
              <p className="text-gray-700 mb-4">
                Your items are still available! You can complete your purchase anytime.
              </p>
              <div className="space-y-3 text-left">
                <div className="flex items-start">
                  <span className="text-blue-500 mr-3 mt-1">🎵</span>
                  <p>All beats and licenses are still in stock</p>
                </div>
                <div className="flex items-start">
                  <span className="text-blue-500 mr-3 mt-1">💳</span>
                  <p>Secure payment processing with multiple payment options</p>
                </div>
                <div className="flex items-start">
                  <span className="text-blue-500 mr-3 mt-1">⚡</span>
                  <p>Instant download after successful payment</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => navigate('/beats')}
                className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
              >
                Browse Beats & Licenses
              </button>
              
              <div className="flex flex-col md:flex-row gap-4 justify-center">
                <button
                  onClick={() => navigate('/')}
                  className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
                >
                  Return to Homepage
                </button>
                <button
                  onClick={() => navigate('/contact')}
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
                >
                  Need Help?
                </button>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold mb-3">Have Questions?</h3>
              <p className="text-gray-600 mb-4">
                If you experienced any issues during checkout or need assistance, 
                we're here to help make your purchase smooth and easy.
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

            <div className="mt-6 p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-green-800">
                <strong>💡 Pro Tip:</strong> Save your favorite beats to revisit later! 
                All our content is available 24/7 for your convenience.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PurchaseCancelledPage;
