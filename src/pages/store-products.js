import React from 'react';
import Layout from '../components/layout';
import WordPressSEO from '../components/seo/wordpress-seo';

/**
 * Store Products Page
 * Displays all available products in the J. Eldon Music store
 */
const StoreProducts = () => {
  // Product catalog with detailed information
  const products = [
    {
      id: process.env.GATSBY_THRIVECART_BEAT_BASIC_ID,
      name: 'Basic Beat License',
      price: 50.00,
      category: 'Beat Licenses',
      description: 'Non-exclusive license for independent artists and content creators',
      features: [
        'MP3 and WAV files included',
        'Commercial use rights',
        'Up to 10,000 streams/plays',
        'Basic mixing stems available',
        'Producer credit required'
      ],
      contractType: 'non_exclusive',
      usageRights: 'Commercial use with limitations',
      delivery: 'Instant download',
      popular: false
    },
    {
      id: process.env.GATSBY_THRIVECART_BEAT_PREMIUM_ID,
      name: 'Premium Beat License',
      price: 150.00,
      category: 'Beat Licenses',
      description: 'Enhanced license with extended commercial rights',
      features: [
        'High-quality WAV and MP3 files',
        'Extended commercial use rights',
        'Up to 100,000 streams/plays',
        'Individual stems/tracks included',
        'Radio and TV sync rights',
        'Producer credit required'
      ],
      contractType: 'exclusive_licensing',
      usageRights: 'Extended commercial use',
      delivery: 'Instant download + email',
      popular: true
    },
    {
      id: process.env.GATSBY_THRIVECART_BEAT_EXCLUSIVE_ID,
      name: 'Exclusive Beat License',
      price: 1000.00,
      category: 'Beat Licenses',
      description: 'Complete exclusive rights with full commercial ownership',
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
      contractType: 'buyout',
      usageRights: 'Full exclusive ownership',
      delivery: 'Professional package + consultation',
      popular: false
    },
    {
      id: process.env.GATSBY_THRIVECART_BEAT_PACK_ID,
      name: 'Beat Pack Bundle',
      price: 200.00,
      category: 'Beat Packages',
      description: 'Curated collection of 5 premium beats',
      features: [
        '5 handpicked beats (MP3 + WAV)',
        'Non-exclusive commercial licenses',
        'Mixed and mastered quality',
        'Variety of styles and tempos',
        'Individual stems for each beat',
        'Bulk licensing discount',
        'Producer credit required'
      ],
      contractType: 'non_exclusive',
      usageRights: 'Commercial use per beat',
      delivery: 'ZIP download package',
      popular: true
    },
    {
      id: process.env.GATSBY_THRIVECART_MASTERCLASS_ID,
      name: 'Producer Masterclass',
      price: 600.00,
      category: 'Education',
      description: 'Comprehensive music production course with J. Eldon',
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
      contractType: 'course_access',
      usageRights: 'Educational license',
      delivery: 'Online course platform',
      popular: false
    }
  ];

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Beat Licenses': return '🎵';
      case 'Beat Packages': return '📦';
      case 'Education': return '🎓';
      default: return '🎶';
    }
  };

  const getContractTypeInfo = (contractType) => {
    const types = {
      'non_exclusive': { label: 'Non-Exclusive', color: 'bg-blue-100 text-blue-800' },
      'exclusive_licensing': { label: 'Enhanced Rights', color: 'bg-purple-100 text-purple-800' },
      'buyout': { label: 'Exclusive Buyout', color: 'bg-red-100 text-red-800' },
      'course_access': { label: 'Educational', color: 'bg-green-100 text-green-800' }
    };
    return types[contractType] || { label: 'Standard', color: 'bg-gray-100 text-gray-800' };
  };

  return (
    <Layout>
      <WordPressSEO 
        title="Store Products - J. Eldon Music" 
        description="Browse all available beats, licenses, and courses from J. Eldon Music"
      />
      
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              J. Eldon Music Store
            </h1>
            <p className="text-xl text-gray-600 mb-2">
              Professional beats, licenses, and production courses
            </p>
            <div className="text-sm text-gray-500">
              All purchases include instant download and contract documentation
            </div>
          </div>

          {/* Product Categories */}
          <div className="mb-8">
            <div className="flex flex-wrap justify-center gap-4">
              {['All Products', 'Beat Licenses', 'Beat Packages', 'Education'].map((category) => (
                <button
                  key={category}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8">
            {products.map((product) => {
              const contractInfo = getContractTypeInfo(product.contractType);
              
              return (
                <div key={product.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                  {/* Product Header */}
                  <div className="p-6 border-b">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl">{getCategoryIcon(product.category)}</span>
                      {product.popular && (
                        <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full">
                          Popular
                        </span>
                      )}
                    </div>
                    
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {product.name}
                    </h3>
                    
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-2xl font-bold text-green-600">
                        {formatPrice(product.price)}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full ${contractInfo.color}`}>
                        {contractInfo.label}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 text-sm">
                      {product.description}
                    </p>
                  </div>

                  {/* Features List */}
                  <div className="p-6">
                    <h4 className="font-medium text-gray-900 mb-3">What's Included:</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      {product.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-green-500 mr-2 mt-0.5">✓</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Product Details */}
                  <div className="p-6 border-t bg-gray-50">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="font-medium text-gray-900">Usage Rights</div>
                        <div className="text-gray-600">{product.usageRights}</div>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">Delivery</div>
                        <div className="text-gray-600">{product.delivery}</div>
                      </div>
                    </div>
                  </div>

                  {/* Purchase Button */}
                  <div className="p-6 border-t">
                    <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                      Purchase Now - {formatPrice(product.price)}
                    </button>
                    <div className="text-center mt-2">
                      <a 
                        href="/contracts" 
                        className="text-xs text-gray-500 hover:text-gray-700"
                      >
                        View contract details →
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Store Information */}
          <div className="mt-16 bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
              Store Information
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-3xl mb-3">⚡</div>
                <h3 className="font-medium text-gray-900 mb-2">Instant Download</h3>
                <p className="text-sm text-gray-600">
                  All digital products are delivered instantly after purchase
                </p>
              </div>
              
              <div className="text-center">
                <div className="text-3xl mb-3">📄</div>
                <h3 className="font-medium text-gray-900 mb-2">Legal Contracts</h3>
                <p className="text-sm text-gray-600">
                  Professional contracts provided with every license purchase
                </p>
              </div>
              
              <div className="text-center">
                <div className="text-3xl mb-3">🎧</div>
                <h3 className="font-medium text-gray-900 mb-2">High Quality</h3>
                <p className="text-sm text-gray-600">
                  Professional-grade beats mixed and mastered to industry standards
                </p>
              </div>
            </div>
          </div>

          {/* Product Summary Stats */}
          <div className="mt-8 bg-blue-50 rounded-lg p-6">
            <div className="grid md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {products.filter(p => p.category === 'Beat Licenses').length}
                </div>
                <div className="text-sm text-blue-800">Beat Licenses</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {products.filter(p => p.category === 'Beat Packages').length}
                </div>
                <div className="text-sm text-blue-800">Beat Packages</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {products.filter(p => p.category === 'Education').length}
                </div>
                <div className="text-sm text-blue-800">Courses</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {formatPrice(products.reduce((sum, p) => sum + p.price, 0) / products.length)}
                </div>
                <div className="text-sm text-blue-800">Average Price</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default StoreProducts;
