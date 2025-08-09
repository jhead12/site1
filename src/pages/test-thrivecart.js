import React from 'react';
import Layout from '../components/layout';
import SEOHead from '../components/head';

// Simple test component first
const TestThriveCartButton = () => {
  return (
    <div className="border p-4 rounded">
      <h3>Test ThriveCart Button</h3>
      <button className="bg-blue-500 text-white px-4 py-2 rounded">
        Test Buy Now - $50
      </button>
    </div>
  );
};

const TestThriveCartPage = () => {
  return (
    <Layout>
      <SEOHead 
        title="Test ThriveCart" 
        description="Testing ThriveCart components"
      />
      
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-4xl font-bold text-center mb-8">
            Test ThriveCart Integration
          </h1>
          
          <TestThriveCartButton />
        </div>
      </div>
    </Layout>
  );
};

export default TestThriveCartPage;
