import React, { useState } from 'react';
import Layout from '../components/layout';
import WordPressSEO from '../components/seo/wordpress-seo';

/**
 * ThriveCart Setup Guide
 * Step-by-step guide to connect real ThriveCart products
 */
const ThriveCartSetup = () => {
  const [copiedText, setCopiedText] = useState('');

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(''), 2000);
  };

  const envTemplate = `# ThriveCart Product IDs
GATSBY_THRIVECART_BEAT_BASIC_ID=your_basic_product_id_here
GATSBY_THRIVECART_BEAT_PREMIUM_ID=your_premium_product_id_here
GATSBY_THRIVECART_BEAT_EXCLUSIVE_ID=your_exclusive_product_id_here
GATSBY_THRIVECART_BEAT_PACK_ID=your_beat_pack_product_id_here
GATSBY_THRIVECART_MASTERCLASS_ID=your_masterclass_product_id_here

# ThriveCart API (Optional - for advanced features)
GATSBY_THRIVECART_API_KEY=your_api_key_here
GATSBY_THRIVECART_VENDOR_ID=your_vendor_id_here`;

  const productsToCreate = [
    {
      name: 'Basic Beat License',
      price: '$50.00',
      description: 'Non-exclusive license for independent artists and content creators',
      type: 'Digital Product',
      features: [
        'MP3 and WAV files included',
        'Commercial use rights',
        'Up to 10,000 streams/plays',
        'Basic mixing stems available',
        'Producer credit required'
      ],
      envVar: 'GATSBY_THRIVECART_BEAT_BASIC_ID'
    },
    {
      name: 'Premium Beat License',
      price: '$150.00',
      description: 'Enhanced license with extended commercial rights',
      type: 'Digital Product',
      features: [
        'High-quality WAV and MP3 files',
        'Extended commercial use rights',
        'Up to 100,000 streams/plays',
        'Individual stems/tracks included',
        'Radio and TV sync rights',
        'Producer credit required'
      ],
      envVar: 'GATSBY_THRIVECART_BEAT_PREMIUM_ID'
    },
    {
      name: 'Exclusive Beat License',
      price: '$1,000.00',
      description: 'Complete exclusive rights with full commercial ownership',
      type: 'Digital Product',
      features: [
        'Master-quality files (WAV, MP3)',
        'Complete exclusive commercial rights',
        'Unlimited streams/distribution',
        'Full stem package included',
        'Trackouts and MIDI files',
        'Beat removed from marketplace',
        'Producer credit optional',
        'Custom mixing available'
      ],
      envVar: 'GATSBY_THRIVECART_BEAT_EXCLUSIVE_ID'
    },
    {
      name: 'Beat Pack Bundle',
      price: '$200.00',
      description: 'Curated collection of 5 premium beats',
      type: 'Digital Product',
      features: [
        '5 handpicked beats (MP3 + WAV)',
        'Non-exclusive commercial licenses',
        'Mixed and mastered quality',
        'Variety of styles and tempos',
        'Individual stems for each beat',
        'Bulk licensing discount',
        'Producer credit required'
      ],
      envVar: 'GATSBY_THRIVECART_BEAT_PACK_ID'
    },
    {
      name: 'Producer Masterclass',
      price: '$600.00',
      description: 'Comprehensive music production course with J. Eldon',
      type: 'Digital Course',
      features: [
        '8+ hours of video content',
        'Beat making from scratch tutorials',
        'Mixing and mastering techniques',
        'Industry insider knowledge',
        'Project files and samples included',
        '1-on-1 feedback session',
        'Certificate of completion',
        'Lifetime access'
      ],
      envVar: 'GATSBY_THRIVECART_MASTERCLASS_ID'
    }
  ];

  return (
    <Layout>
      <WordPressSEO 
        title="ThriveCart Setup Guide - J. Eldon Music" 
        description="Step-by-step guide to connect your ThriveCart products to the store"
      />
      
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              ThriveCart Setup Guide
            </h1>
            <p className="text-xl text-gray-600 mb-2">
              Connect your real ThriveCart products to the store
            </p>
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded-lg mt-4">
              <strong>Note:</strong> The store currently shows placeholder products. Follow this guide to connect real ThriveCart products.
            </div>
          </div>

          {/* Step 1: Create ThriveCart Account */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
              <span className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm font-bold">1</span>
              Create ThriveCart Account & Products
            </h2>
            
            <div className="space-y-4">
              <p className="text-gray-700">
                First, you need to create an account at <a href="https://thrivecart.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">ThriveCart.com</a> and set up your products.
              </p>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">Quick Start:</h3>
                <ol className="list-decimal list-inside text-blue-800 space-y-1">
                  <li>Sign up for ThriveCart (free account available)</li>
                  <li>Go to Products → Create Product</li>
                  <li>Create each product from the list below</li>
                  <li>Copy the Product IDs for the next step</li>
                </ol>
              </div>
            </div>
          </div>

          {/* Step 2: Products to Create */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
              <span className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm font-bold">2</span>
              Products to Create in ThriveCart
            </h2>
            
            <div className="space-y-6">
              {productsToCreate.map((product, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
                      <p className="text-2xl font-bold text-green-600">{product.price}</p>
                    </div>
                    <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
                      {product.type}
                    </span>
                  </div>
                  
                  <p className="text-gray-700 mb-4">{product.description}</p>
                  
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">Features to include:</h4>
                    <ul className="grid md:grid-cols-2 gap-1 text-sm text-gray-600">
                      {product.features.map((feature, fIndex) => (
                        <li key={fIndex} className="flex items-start">
                          <span className="text-green-500 mr-2">•</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded text-sm">
                    <strong>Environment Variable:</strong> <code className="bg-gray-200 px-1 rounded">{product.envVar}</code>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Step 3: Environment Variables */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
              <span className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm font-bold">3</span>
              Add Product IDs to Environment Variables
            </h2>
            
            <div className="space-y-4">
              <p className="text-gray-700">
                After creating products in ThriveCart, copy their Product IDs and add them to your <code className="bg-gray-200 px-1 rounded">.env</code> file:
              </p>
              
              <div className="relative">
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                  <code>{envTemplate}</code>
                </pre>
                <button
                  onClick={() => copyToClipboard(envTemplate, 'Environment variables')}
                  className="absolute top-2 right-2 bg-gray-700 text-gray-300 px-3 py-1 rounded text-xs hover:bg-gray-600"
                >
                  {copiedText === 'Environment variables' ? 'Copied!' : 'Copy'}
                </button>
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                <h4 className="font-semibold text-yellow-800 mb-2">📍 Where to find Product IDs:</h4>
                <ol className="text-yellow-700 text-sm space-y-1">
                  <li>1. In ThriveCart → Products → Click on a product</li>
                  <li>2. Look for "Product ID" or "Checkout URL"</li>
                  <li>3. The ID is usually at the end of the checkout URL</li>
                  <li>4. Example: <code>https://thrivecart.com/checkout/abc123</code> → ID is <code>abc123</code></li>
                </ol>
              </div>
            </div>
          </div>

          {/* Step 4: Test Integration */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
              <span className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm font-bold">4</span>
              Test the Integration
            </h2>
            
            <div className="space-y-4">
              <p className="text-gray-700">
                After adding the environment variables:
              </p>
              
              <ol className="list-decimal list-inside text-gray-700 space-y-2">
                <li>Restart your development server (<code className="bg-gray-200 px-1 rounded">npm run develop</code>)</li>
                <li>Visit the <a href="/shop" className="text-blue-600 underline">store page</a></li>
                <li>Click "Purchase Now" on any product</li>
                <li>You should be redirected to the real ThriveCart checkout</li>
              </ol>
              
              <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">✅ Success Indicators:</h4>
                <ul className="text-green-700 text-sm space-y-1">
                  <li>• Purchase buttons redirect to ThriveCart checkout pages</li>
                  <li>• Products show real pricing and descriptions</li>
                  <li>• Test purchases complete successfully</li>
                  <li>• Webhook data appears in analytics (if configured)</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Optional: Advanced Setup */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
              <span className="bg-gray-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm font-bold">5</span>
              Optional: Advanced Features
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Webhooks (Recommended)</h3>
                <p className="text-sm text-gray-600">
                  Set up webhooks to automatically track sales in your analytics dashboard.
                </p>
                <div className="bg-blue-50 p-3 rounded text-sm">
                  <strong>Webhook URL:</strong><br />
                  <code className="text-xs">https://yoursite.com/api/thrivecart-webhook</code>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">API Integration</h3>
                <p className="text-sm text-gray-600">
                  Connect ThriveCart API to pull real product data and customer information.
                </p>
                <div className="bg-purple-50 p-3 rounded text-sm">
                  <strong>Required:</strong> ThriveCart API Key and Vendor ID
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="mt-8 text-center">
            <div className="space-x-4">
              <a
                href="/shop"
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                View Store
              </a>
              <a
                href="/thrivecart-demo"
                className="inline-block bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Back to Demo
              </a>
              <a
                href="https://thrivecart.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
              >
                Open ThriveCart
              </a>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ThriveCartSetup;
