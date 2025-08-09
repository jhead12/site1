import React from 'react';
import Layout from '../components/layout';
import ThriveCartAnalytics from '../components/ThriveCartAnalytics';

/**
 * ThriveCart Analytics Page
 * Real-time revenue and order analytics from ThriveCart
 */
const ThriveCartAnalyticsPage = () => {
  return (
    <Layout>
      <ThriveCartAnalytics />
    </Layout>
  );
};

export default ThriveCartAnalyticsPage;

export const Head = () => (
  <>
    <title>ThriveCart Analytics - Real Revenue Data</title>
    <meta name="description" content="Real-time revenue and order analytics from ThriveCart sales" />
  </>
);
