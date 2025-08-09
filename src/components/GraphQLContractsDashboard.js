import React from 'react';

/**
 * GraphQL Contracts Dashboard (Placeholder)
 * This component requires Apollo Client setup to function properly.
 * Currently disabled to prevent runtime errors.
 */
const GraphQLContractsDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            GraphQL Contracts Dashboard
          </h1>
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-6">
            <strong>⚠️ Apollo Client Setup Required</strong>
            <p className="text-sm mt-2">
              This feature requires Apollo Client configuration. Please use the standard 
              <a href="/contracts" className="underline ml-1">Contract Management</a> page instead.
            </p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Alternative Options:</h2>
          <div className="space-y-3">
            <a 
              href="/contracts" 
              className="block p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <h3 className="font-medium text-blue-900">Standard Contract Management</h3>
              <p className="text-blue-700 text-sm">Fully functional contract creation and management system</p>
            </a>
            
            <a 
              href="/thrivecart-demo" 
              className="block p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
            >
              <h3 className="font-medium text-green-900">ThriveCart Demo</h3>
              <p className="text-green-700 text-sm">Test analytics and contract integration</p>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GraphQLContractsDashboard;
