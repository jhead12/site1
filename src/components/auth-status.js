import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { Text, Flex, Button } from './ui';

/**
 * WordPress Authentication Status Component
 * Shows login status and provides login/logout actions
 */
const AuthStatus = () => {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();

  if (!isAuthenticated) {
    return (
      <Flex alignItems="center" gap={2}>
        <Text fontSize={1} style={{ color: '#6b7280' }}>
          Not logged in
        </Text>
        <Button
          as="a"
          href="/admin-login"
          style={{
            backgroundColor: '#3b82f6',
            color: 'white',
            padding: '4px 12px',
            borderRadius: '4px',
            border: 'none',
            fontSize: '12px',
            fontWeight: 'bold',
            textDecoration: 'none',
            cursor: 'pointer'
          }}
        >
          Admin Login
        </Button>
      </Flex>
    );
  }

  return (
    <Flex alignItems="center" gap={2}>
      <Text fontSize={1} style={{ color: isAdmin ? '#059669' : '#f59e0b' }}>
        {isAdmin ? '✓ Admin' : '○ User'}: {user?.name}
      </Text>
      <Button
        onClick={logout}
        style={{
          backgroundColor: '#6b7280',
          color: 'white',
          padding: '4px 12px',
          borderRadius: '4px',
          border: 'none',
          fontSize: '12px',
          fontWeight: 'bold',
          cursor: 'pointer'
        }}
      >
        Logout
      </Button>
    </Flex>
  );
};

export default AuthStatus;
