import React from 'react';
import Layout from '../components/layout';
import SEOHead from '../components/head';
import ContractsDashboard from '../components/ContractsDashboard';

const ContractsPage = () => {
  return (
    <Layout>
      <SEOHead 
        title="ThriveCart Contracts - Exclusive Release Deals" 
        description="Manage exclusive release deals, copyright transfers, and revenue sharing agreements for your music business."
      />
      <ContractsDashboard />
    </Layout>
  );
};

export default ContractsPage;
