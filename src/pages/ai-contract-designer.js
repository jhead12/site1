import React from 'react';
import Layout from '../components/layout';
import SEOHead from '../components/head';
import AIContractDesigner from '../components/contracts/AIContractDesigner';

const AIContractPage = () => {
  const handleContractGenerated = (contract) => {
    console.log('Generated contract:', contract);
    // Here you could save the contract to a database, 
    // send it to a CRM, or integrate with your sales workflow
  };

  return (
    <Layout>
      <SEOHead 
        title="AI Contract Designer - Smart Music Contracts" 
        description="Create custom music contracts with AI assistance. Get optimal pricing based on copyright ownership levels and project requirements."
      />
      <AIContractDesigner onContractGenerated={handleContractGenerated} />
    </Layout>
  );
};

export default AIContractPage;
