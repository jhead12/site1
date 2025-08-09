import React, { useState } from 'react';

/**
 * Simple ThriveCart Buy Button Component
 */
const SimpleThriveCartBuyButton = ({ 
  productKey = 'beatBasic', 
  variant = 'primary',
  className = '',
}) => {
  const [loading, setLoading] = useState(false);

  // Static pricing data (no external service dependency)
  const products = {
    beatBasic: {
      name: 'Basic Beat License',
      price: 50,
      description: 'Standard licensing for personal and commercial use',
    },
    beatPremium: {
      name: 'Premium Beat License', 
      price: 150,
      description: 'Enhanced licensing with additional rights',
    },
    beatExclusive: {
      name: 'Exclusive Beat License + Copyright',
      price: 1000,
      description: 'Full ownership with copyright transfer',
    },
  };

  const product = products[productKey];

  const handlePurchase = () => {
    setLoading(true);
    console.log('Purchase clicked for:', product.name);
    // Simulate async operation
    setTimeout(() => {
      setLoading(false);
      alert(`Would purchase ${product.name} for $${product.price}`);
    }, 1000);
  };

  if (!product) {
    return <div>Product not found</div>;
  }

  const buttonStyles = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    exclusive: 'bg-purple-600 hover:bg-purple-700 text-white',
  };

  return (
    <div className={`simple-thrivecart-button ${className}`}>
      <div className="mb-4">
        <h3 className="text-xl font-bold">{product.name}</h3>
        <p className="text-gray-600 mb-2">{product.description}</p>
        <div className="text-2xl font-bold text-green-600">${product.price}</div>
      </div>
      
      <button
        onClick={handlePurchase}
        disabled={loading}
        className={`
          px-4 py-2 rounded font-semibold transition-colors duration-200 
          disabled:opacity-50 w-full
          ${buttonStyles[variant] || buttonStyles.primary}
        `}
      >
        {loading ? 'Processing...' : `Buy Now - $${product.price}`}
      </button>
    </div>
  );
};

/**
 * Simple Product Grid Component
 */
const SimpleThriveCartGrid = ({ className = '' }) => {
  const products = ['beatBasic', 'beatPremium', 'beatExclusive'];

  return (
    <div className={`simple-thrivecart-grid grid gap-6 md:grid-cols-3 ${className}`}>
      {products.map((productKey) => (
        <div key={productKey} className="border rounded-lg p-6 shadow-lg">
          <SimpleThriveCartBuyButton
            productKey={productKey}
            variant={productKey === 'beatExclusive' ? 'exclusive' : 'primary'}
          />
        </div>
      ))}
    </div>
  );
};

export { SimpleThriveCartBuyButton, SimpleThriveCartGrid };
