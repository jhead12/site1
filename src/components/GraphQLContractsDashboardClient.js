import React from 'react';

/**
 * GraphQL Contracts Dashboard Client (Disabled)
 * This component requires Apollo Client setup and has been temporarily disabled
 * to prevent runtime errors related to missing Apollo Client configuration.
 */
const GraphQLContractsDashboardClient = ({ currentUserId }) => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            GraphQL Dashboard (Disabled)
          </h1>
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            <strong>🚫 Apollo Client Required</strong>
            <p className="text-sm mt-2">
              This component has been disabled to prevent runtime errors. 
              Apollo Client needs to be properly configured to use GraphQL features.
            </p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Working Alternatives:</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <a 
              href="/contracts" 
              className="block p-6 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <h3 className="font-medium text-blue-900 mb-2">✅ Contract Management</h3>
              <p className="text-blue-700 text-sm">Full-featured contract creation system with download capabilities</p>
            </a>
            
            <a 
              href="/thrivecart-demo" 
              className="block p-6 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
            >
              <h3 className="font-medium text-green-900 mb-2">✅ ThriveCart Integration</h3>
              <p className="text-green-700 text-sm">Analytics dashboard and store management</p>
            </a>
          </div>
          
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">To Enable GraphQL Features:</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Install and configure Apollo Client</li>
              <li>• Set up GraphQL endpoint</li>
              <li>• Configure Apollo Provider in root component</li>
              <li>• Enable GraphQL hooks</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GraphQLContractsDashboardClient;
