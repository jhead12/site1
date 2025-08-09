import React from 'react';
import Layout from '../components/layout';
import SEOHead from '../components/head';
import GraphQLContractsDashboard from '../components/GraphQLContractsDashboard';

const GraphQLContractsPage = () => {
  // In a real app, you'd get this from authentication context
  const currentUserId = "user_123"; // Demo user ID

  return (
    <Layout>
      <SEOHead 
        title="GraphQL Contracts - Advanced User Management" 
        description="Advanced contract management with GraphQL integration, user permissions, and content access control for your music business."
      />
      <GraphQLContractsDashboard currentUserId={currentUserId} />
    </Layout>
  );
};

export default GraphQLContractsPage;
