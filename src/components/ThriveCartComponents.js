import React, { useState, useEffect } from 'react';
import ThriveCartService from '../services/thrivecart';

/**
 * ThriveCart Buy Button Component
 * Handles product purchases through ThriveCart integration
 */
const ThriveCartBuyButton = ({ 
  productKey, 
  variant = 'primary',
  size = 'medium',
  customFields = {},
  onSuccess = () => {},
  onError = () => {},
  className = '',
}) => {
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState(null);

  useEffect(() => {
    // Get product pricing from service
    const pricing = ThriveCartService.getProductPricing();
    if (pricing[productKey]) {
      setProduct(pricing[productKey]);
    }
  }, [productKey]);

  const handlePurchase = async () => {
    if (!product) return;

    setLoading(true);
    try {
      // Create checkout session
      const checkoutSession = await ThriveCartService.createCheckoutSession(
        product.id,
        {
          customFields,
          successUrl: typeof window !== 'undefined' ? `${window.location.origin}/purchase-success` : '/purchase-success',
          cancelUrl: typeof window !== 'undefined' ? `${window.location.origin}/purchase-cancelled` : '/purchase-cancelled',
        }
      );

      // Redirect to ThriveCart checkout
      if (checkoutSession.checkout_url && typeof window !== 'undefined') {
        window.location.href = checkoutSession.checkout_url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error) {
      console.error('Purchase failed:', error);
      onError(error);
      setLoading(false);
    }
  };

  if (!product) {
    return (
      <div className="animate-pulse">
        <div className="h-4 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 bg-gray-200 rounded mb-2"></div>
        <div className="h-10 bg-gray-200 rounded"></div>
      </div>
    );
  }

  const buttonStyles = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-gray-600 hover:bg-gray-700 text-white',
    success: 'bg-green-600 hover:bg-green-700 text-white',
    exclusive: 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white',
  };

  const sizeStyles = {
    small: 'px-3 py-2 text-sm',
    medium: 'px-4 py-2 text-base',
    large: 'px-6 py-3 text-lg',
  };

  const baseStyles = 'font-semibold rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed';

  return (
    <div className={`thrivecart-buy-button ${className}`}>
      <div className="mb-4">
        <h3 className="text-xl font-bold">{product.name}</h3>
        <p className="text-gray-600 mb-2">{product.description}</p>
        <div className="flex items-center gap-3 mb-3">
          <span className="text-2xl font-bold text-green-600">${product.price}</span>
          {product.originalPrice && (
            <span className="text-lg text-gray-500 line-through">${product.originalPrice}</span>
          )}
        </div>
        <ul className="space-y-1 text-sm text-gray-700">
          {product.features.map((feature, index) => (
            <li key={index} className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              {feature}
            </li>
          ))}
        </ul>
      </div>
      
      <button
        onClick={handlePurchase}
        disabled={loading}
        className={`
          ${baseStyles}
          ${buttonStyles[variant]}
          ${sizeStyles[size]}
          w-full
        `}
      >
        {loading ? 'Processing...' : `Buy Now - $${product.price}`}
      </button>
    </div>
  );
};

/**
 * ThriveCart Product Grid Component
 * Displays all available products in a grid layout
 */
const ThriveCartProductGrid = ({ 
  excludeProducts = [],
  className = '',
}) => {
  const [products, setProducts] = useState({});

  useEffect(() => {
    const pricing = ThriveCartService.getProductPricing();
    // Filter out excluded products
    const filteredProducts = Object.keys(pricing)
      .filter(key => !excludeProducts.includes(key))
      .reduce((obj, key) => {
        obj[key] = pricing[key];
        return obj;
      }, {});
    
    setProducts(filteredProducts);
  }, [excludeProducts]);

  return (
    <div className={`thrivecart-product-grid grid gap-6 md:grid-cols-2 lg:grid-cols-3 ${className}`}>
      {Object.entries(products).map(([key, product]) => (
        <div key={key} className="border rounded-lg p-6 shadow-lg">
          <ThriveCartBuyButton
            productKey={key}
            variant={key === 'beatExclusive' ? 'exclusive' : 'primary'}
          />
        </div>
      ))}
    </div>
  );
};

/**
 * ThriveCart Pricing Slider Component
 * Interactive pricing component with license options
 */
const ThriveCartPricingSlider = ({ 
  onLicenseChange = () => {},
  className = '',
}) => {
  const [selectedLicense, setSelectedLicense] = useState('beatBasic');
  const [products, setProducts] = useState({});

  useEffect(() => {
    const pricing = ThriveCartService.getProductPricing();
    setProducts(pricing);
  }, []);

  useEffect(() => {
    if (products[selectedLicense]) {
      onLicenseChange(products[selectedLicense]);
    }
  }, [selectedLicense, products, onLicenseChange]);

  const licenseOptions = [
    { key: 'beatBasic', label: 'Basic License', icon: '🎵' },
    { key: 'beatPremium', label: 'Premium License', icon: '🎼' },
    { key: 'beatExclusive', label: 'Exclusive + Copyright', icon: '👑' },
  ];

  return (
    <div className={`thrivecart-pricing-slider ${className}`}>
      <div className="mb-6">
        <h3 className="text-xl font-bold mb-4">Choose Your License</h3>
        <div className="flex flex-col md:flex-row gap-4">
          {licenseOptions.map(({ key, label, icon }) => (
            <button
              key={key}
              onClick={() => setSelectedLicense(key)}
              className={`
                flex-1 p-4 rounded-lg border-2 transition-colors duration-200
                ${selectedLicense === key
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
                }
              `}
            >
              <div className="text-2xl mb-2">{icon}</div>
              <div className="font-semibold">{label}</div>
              {products[key] && (
                <div className="text-lg font-bold text-green-600 mt-2">
                  ${products[key].price}
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {products[selectedLicense] && (
        <ThriveCartBuyButton
          productKey={selectedLicense}
          variant={selectedLicense === 'beatExclusive' ? 'exclusive' : 'primary'}
          size="large"
        />
      )}
    </div>
  );
};

export { ThriveCartBuyButton, ThriveCartProductGrid, ThriveCartPricingSlider };
