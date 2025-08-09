import React, { useState, useEffect } from 'react';
import { navigate } from 'gatsby';
import Layout from '../components/layout';
import {
  Container,
  Section,
  Box,
  Heading,
  Text,
  Flex,
  Button
} from '../components/ui';
import SEOHead from '../components/head';
import { useAuth } from '../hooks/useAuth';

/**
 * WordPress Admin Login Page
 * Redirects to WordPress login and checks auth status
 */
const AdminLoginPage = () => {
  const { isAuthenticated, isAdmin, checkAuth, loading, user } = useAuth();
  const [loginUrl, setLoginUrl] = useState('');

  useEffect(() => {
    const wpSiteUrl = process.env.GATSBY_WORDPRESS_URL || 'http://localhost:10008';
    const returnUrl = encodeURIComponent(`${window.location.origin}/admin-login`);
    setLoginUrl(`${wpSiteUrl}/wp-admin?redirect_to=${returnUrl}`);
  }, []);

  useEffect(() => {
    // If user is already admin, redirect to analytics
    if (isAdmin) {
      navigate('/auth/user/analytics');
    }
  }, [isAdmin]);

  // Check auth status when page loads (in case user just logged in)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('logged_in') === 'true') {
      checkAuth();
    }
  }, [checkAuth]);

  const handleLogin = () => {
    window.location.href = loginUrl;
  };

  const handleRefreshAuth = () => {
    checkAuth();
  };

  if (loading) {
    return (
      <Layout>
        <Section paddingY={5}>
          <Container>
            <Box textAlign="center" padding={6}>
              <Text fontSize={4}>Checking authentication...</Text>
            </Box>
          </Container>
        </Section>
      </Layout>
    );
  }

  return (
    <Layout>
      <Section paddingY={5} style={{ backgroundColor: '#f9fafb', minHeight: '100vh' }}>
        <Container>
          <Box textAlign="center" marginBottom={6} padding={5} backgroundColor="white" borderRadius={3} boxShadow="medium">
            <Heading as="h1" variant="display" marginBottom={4} style={{ color: '#111827' }}>
              WordPress Admin Access
            </Heading>
            
            {isAuthenticated ? (
              isAdmin ? (
                <Box>
                  <Text fontSize={3} marginBottom={4} style={{ color: '#059669' }}>
                    ✓ You are logged in as a WordPress administrator!
                  </Text>
                  <Text marginBottom={4} style={{ color: '#6b7280' }}>
                    Redirecting to Analytics Dashboard...
                  </Text>
                </Box>
              ) : (
                <Box>
                  <Text fontSize={3} marginBottom={4} style={{ color: '#dc2626' }}>
                    ⚠️ You are logged in but don't have administrator privileges
                  </Text>
                  <Text marginBottom={4} style={{ color: '#6b7280' }}>
                    Only WordPress administrators can access the Analytics Dashboard.
                  </Text>
                  <Text marginBottom={4} style={{ color: '#6b7280' }}>
                    Current user: {user?.name || 'Unknown'}
                  </Text>
                </Box>
              )
            ) : (
              <Box>
                <Text fontSize={3} marginBottom={4} style={{ color: '#6b7280' }}>
                  Please log in to your WordPress admin account to access the Analytics Dashboard.
                </Text>
                <Text marginBottom={4} style={{ color: '#9ca3af' }}>
                  You need administrator privileges to view site analytics.
                </Text>
              </Box>
            )}
          </Box>

          {/* Action Buttons */}
          <Box textAlign="center" padding={5} backgroundColor="white" borderRadius={3} boxShadow="medium">
            {!isAuthenticated ? (
              <Box>
                <Button
                  onClick={handleLogin}
                  style={{
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    border: 'none',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    marginRight: '12px'
                  }}
                >
                  Login to WordPress Admin
                </Button>
                
                <Button
                  onClick={handleRefreshAuth}
                  style={{
                    backgroundColor: '#6b7280',
                    color: 'white',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    border: 'none',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}
                >
                  Check Login Status
                </Button>
              </Box>
            ) : isAdmin ? (
              <Button
                onClick={() => navigate('/auth/user/analytics')}
                style={{
                  backgroundColor: '#059669',
                  color: 'white',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                Go to Analytics Dashboard
              </Button>
            ) : (
              <Flex gap={3} justifyContent="center">
                <Button
                  onClick={handleLogin}
                  style={{
                    backgroundColor: '#dc2626',
                    color: 'white',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    border: 'none',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}
                >
                  Login as Administrator
                </Button>
                
                <Button
                  onClick={() => navigate('/')}
                  style={{
                    backgroundColor: '#6b7280',
                    color: 'white',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    border: 'none',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}
                >
                  Back to Home
                </Button>
              </Flex>
            )}
          </Box>

          {/* Help Section */}
          <Box marginTop={6} textAlign="center">
            <Text fontSize={2} style={{ color: '#6b7280', marginBottom: '16px' }}>
              <strong>For Administrators:</strong>
            </Text>
            <Text fontSize={1} style={{ color: '#9ca3af', lineHeight: '1.6' }}>
              • Log in to your WordPress admin dashboard<br/>
              • Ensure you have administrator privileges<br/>
              • Return to this page to access analytics<br/>
              • The Analytics link will appear in the navigation once authenticated
            </Text>
          </Box>
        </Container>
      </Section>
    </Layout>
  );
};

export default AdminLoginPage;

export const Head = () => (
  <SEOHead 
    title="Admin Login - J. Eldon Music"
    description="WordPress administrator login required to access analytics dashboard."
  />
);
