import React, { useState, useEffect } from 'react';

/**
 * Client-side wrapper for GraphQL Contracts Dashboard
 * Handles SSR by only rendering the actual dashboard on the client
 */
const GraphQLContractsDashboard = ({ currentUserId }) => {
  const [isClient, setIsClient] = useState(false);

  // Only run on client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Show loading state during SSR
  if (!isClient) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-center items-center h-64">
            <div className="text-lg text-gray-600">Loading Dashboard...</div>
          </div>
        </div>
      </div>
    );
  }

  // Only import and render on client side
  const ClientDashboard = React.lazy(() => import('./GraphQLContractsDashboardClient'));
  
  return (
    <React.Suspense fallback={
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-center items-center h-64">
            <div className="text-lg text-gray-600">Loading Dashboard...</div>
          </div>
        </div>
      </div>
    }>
      <ClientDashboard currentUserId={currentUserId} />
    </React.Suspense>
  );
};

export default GraphQLContractsDashboard;
