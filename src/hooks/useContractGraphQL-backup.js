/**
 * React Hooks for ThriveCart Contracts GraphQL Integration
 * Provides easy-to-use hooks for contract management and user permissions
 */

import { useState } from 'react';
import { useMutation, useQuery, useSubscription } from '@apollo/client';
import { gql } from '@apollo/client';

// GraphQL Queries
const GET_CONTRACTS = gql`
  query GetContracts($filter: ContractFilterInput) {
    contracts(filter: $filter) {
      id
      name
      type
      status
      partner {
        id
        name
        email
        businessName
      }
      owner {
        id
        name
        email
      }
      revenueShare {
        mainProduct
        upsells
        recurring
      }
      paymentMethod
      startDate
      endDate
      createdAt
      signedAt
    }
  }
`;

const GET_CONTRACT = gql`
  query GetContract($id: ID!) {
    contract(id: $id) {
      id
      name
      type
      status
      partner {
        id
        name
        email
        businessName
      }
      owner {
        id
        name
        email
      }
      products {
        id
        productId
        productName
        revenuePercentage
      }
      revenueShare {
        mainProduct
        upsells
        downsells
        recurring
      }
      paymentMethod
      startDate
      endDate
      terms {
        jurisdiction
        currency
        ownership
        usageRights
        credits
        exclusivity
      }
      permissions {
        id
        user {
          id
          name
        }
        permission {
          id
          name
          action
        }
        grantedAt
      }
      createdAt
      signedAt
    }
  }
`;

const GET_USER_CONTRACTS = gql`
  query GetUserContracts($userId: ID!) {
    contractsByUser(userId: $userId) {
      id
      name
      type
      status
      userRole
      partner {
        id
        name
        email
      }
      owner {
        id
        name
        email
      }
      revenueShare {
        mainProduct
      }
      createdAt
      signedAt
    }
  }
`;

const GET_USER_PERMISSIONS = gql`
  query GetUserPermissions($userId: ID!) {
    userPermissions(userId: $userId) {
      id
      name
      resource
      action
      level
    }
  }
`;

const GET_USER_CONTENT_ACCESS = gql`
  query GetUserContentAccess($userId: ID!) {
    userContentAccess(userId: $userId) {
      id
      contentType
      contentId
      accessLevel
      grantedBy {
        id
        name
        type
      }
      expiresAt
      createdAt
    }
  }
`;

const GET_AVAILABLE_BEATS = gql`
  query GetAvailableBeats($userId: ID!) {
    availableBeats(userId: $userId) {
      id
      title
      artist
      price
      exclusivePrice
      licenseType
      audioUrl
      contractsCount
      availableForLicensing
    }
  }
`;

// GraphQL Mutations
const CREATE_CONTRACT = gql`
  mutation CreateContract($input: CreateContractInput!) {
    createContract(input: $input) {
      id
      name
      type
      status
      partner {
        id
        name
        email
      }
      createdAt
    }
  }
`;

const SIGN_CONTRACT = gql`
  mutation SignContract($id: ID!) {
    signContract(id: $id) {
      id
      status
      signedAt
    }
  }
`;

const CANCEL_CONTRACT = gql`
  mutation CancelContract($id: ID!, $reason: String) {
    cancelContract(id: $id, reason: $reason) {
      id
      status
    }
  }
`;

const GRANT_CONTENT_ACCESS = gql`
  mutation GrantContentAccess($userId: ID!, $contentId: String!, $contentType: String!, $accessLevel: PermissionLevel!, $contractId: ID) {
    grantContentAccess(userId: $userId, contentId: $contentId, contentType: $contentType, accessLevel: $accessLevel, contractId: $contractId) {
      id
      contentType
      contentId
      accessLevel
      createdAt
    }
  }
`;

// GraphQL Subscriptions
const CONTRACT_CREATED_SUBSCRIPTION = gql`
  subscription ContractCreated {
    contractCreated {
      id
      name
      type
      partner {
        name
        email
      }
      owner {
        name
        email
      }
      createdAt
    }
  }
`;

const CONTRACT_SIGNED_SUBSCRIPTION = gql`
  subscription ContractSigned($userId: ID!) {
    contractSigned(userId: $userId) {
      id
      name
      status
      signedAt
    }
  }
`;

// Custom Hooks

/**
 * Hook for managing contracts
 */
export const useContracts = (filter = {}) => {
  const { data, loading, error, refetch } = useQuery(GET_CONTRACTS, {
    variables: { filter },
    errorPolicy: 'all'
  });

  const [createContract] = useMutation(CREATE_CONTRACT, {
    refetchQueries: [{ query: GET_CONTRACTS, variables: { filter } }]
  });

  const [signContract] = useMutation(SIGN_CONTRACT);
  const [cancelContract] = useMutation(CANCEL_CONTRACT);

  const handleCreateContract = async (input) => {
    try {
      const result = await createContract({ variables: { input } });
      return { success: true, contract: result.data.createContract };
    } catch (error) {
      console.error('Error creating contract:', error);
      return { success: false, error: error.message };
    }
  };

  const handleSignContract = async (contractId) => {
    try {
      const result = await signContract({ variables: { id: contractId } });
      return { success: true, contract: result.data.signContract };
    } catch (error) {
      console.error('Error signing contract:', error);
      return { success: false, error: error.message };
    }
  };

  const handleCancelContract = async (contractId, reason) => {
    try {
      const result = await cancelContract({ variables: { id: contractId, reason } });
      return { success: true, contract: result.data.cancelContract };
    } catch (error) {
      console.error('Error cancelling contract:', error);
      return { success: false, error: error.message };
    }
  };

  return {
    contracts: data?.contracts || [],
    loading,
    error,
    refetch,
    createContract: handleCreateContract,
    signContract: handleSignContract,
    cancelContract: handleCancelContract
  };
};

/**
 * Hook for getting a single contract
 */
export const useContract = (contractId) => {
  const { data, loading, error, refetch } = useQuery(GET_CONTRACT, {
    variables: { id: contractId },
    skip: !contractId,
    errorPolicy: 'all'
  });

  return {
    contract: data?.contract,
    loading,
    error,
    refetch
  };
};

/**
 * Hook for user-specific contracts
 */
export const useUserContracts = (userId) => {
  const { data, loading, error, refetch } = useQuery(GET_USER_CONTRACTS, {
    variables: { userId },
    skip: !userId,
    errorPolicy: 'all'
  });

  return {
    contracts: data?.contractsByUser || [],
    loading,
    error,
    refetch
  };
};

/**
 * Hook for user permissions
 */
export const useUserPermissions = (userId) => {
  const { data, loading, error } = useQuery(GET_USER_PERMISSIONS, {
    variables: { userId },
    skip: !userId,
    errorPolicy: 'all'
  });

  const hasPermission = (permissionName) => {
    return data?.userPermissions?.some(permission => 
      permission.name === permissionName || permission.action === permissionName
    ) || false;
  };

  const hasAccessLevel = (resource, level) => {
    return data?.userPermissions?.some(permission => 
      permission.resource === resource && permission.level === level
    ) || false;
  };

  return {
    permissions: data?.userPermissions || [],
    loading,
    error,
    hasPermission,
    hasAccessLevel
  };
};

/**
 * Hook for user content access
 */
export const useUserContentAccess = (userId) => {
  const { data, loading, error, refetch } = useQuery(GET_USER_CONTENT_ACCESS, {
    variables: { userId },
    skip: !userId,
    errorPolicy: 'all'
  });

  const [grantAccess] = useMutation(GRANT_CONTENT_ACCESS, {
    refetchQueries: [{ query: GET_USER_CONTENT_ACCESS, variables: { userId } }]
  });

  const hasContentAccess = (contentId, contentType, requiredLevel = 'VIEWER') => {
    const access = data?.userContentAccess?.find(access => 
      access.contentId === contentId && access.contentType === contentType
    );
    
    if (!access) return false;
    
    const levelHierarchy = ['VIEWER', 'COLLABORATOR', 'PARTNER', 'OWNER'];
    const userLevel = levelHierarchy.indexOf(access.accessLevel);
    const requiredLevelIndex = levelHierarchy.indexOf(requiredLevel);
    
    return userLevel >= requiredLevelIndex;
  };

  const handleGrantAccess = async (contentId, contentType, accessLevel, contractId) => {
    try {
      const result = await grantAccess({
        variables: { userId, contentId, contentType, accessLevel, contractId }
      });
      return { success: true, access: result.data.grantContentAccess };
    } catch (error) {
      console.error('Error granting content access:', error);
      return { success: false, error: error.message };
    }
  };

  return {
    contentAccess: data?.userContentAccess || [],
    loading,
    error,
    refetch,
    hasContentAccess,
    grantAccess: handleGrantAccess
  };
};

/**
 * Hook for available beats based on user permissions
 */
export const useAvailableBeats = (userId) => {
  const { data, loading, error, refetch } = useQuery(GET_AVAILABLE_BEATS, {
    variables: { userId },
    skip: !userId,
    errorPolicy: 'all'
  });

  return {
    beats: data?.availableBeats || [],
    loading,
    error,
    refetch
  };
};

/**
 * Hook for contract subscriptions
 */
export const useContractSubscriptions = (userId) => {
  const [notifications, setNotifications] = useState([]);

  // Subscribe to new contracts
  useSubscription(CONTRACT_CREATED_SUBSCRIPTION, {
    onSubscriptionData: ({ subscriptionData }) => {
      if (subscriptionData.data) {
        const newContract = subscriptionData.data.contractCreated;
        setNotifications(prev => [...prev, {
          id: Date.now(),
          type: 'CONTRACT_CREATED',
          message: `New contract "${newContract.name}" created`,
          contract: newContract,
          timestamp: new Date().toISOString()
        }]);
      }
    }
  });

  // Subscribe to contract signatures
  useSubscription(CONTRACT_SIGNED_SUBSCRIPTION, {
    variables: { userId },
    skip: !userId,
    onSubscriptionData: ({ subscriptionData }) => {
      if (subscriptionData.data) {
        const signedContract = subscriptionData.data.contractSigned;
        setNotifications(prev => [...prev, {
          id: Date.now(),
          type: 'CONTRACT_SIGNED',
          message: `Contract "${signedContract.name}" has been signed`,
          contract: signedContract,
          timestamp: new Date().toISOString()
        }]);
      }
    }
  });

  const dismissNotification = (notificationId) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  return {
    notifications,
    dismissNotification
  };
};

/**
 * Hook for checking if user can perform actions based on permissions
 */
export const usePermissionCheck = (userId) => {
  const { permissions, hasPermission, hasAccessLevel } = useUserPermissions(userId);

  const canCreateContract = () => hasPermission('CREATE_CONTRACT') || hasAccessLevel('CONTRACTS', 'OWNER');
  const canSignContract = (contract) => contract.partnerId === userId;
  const canCancelContract = (contract) => contract.ownerId === userId || contract.partnerId === userId;
  const canViewContract = (contract) => contract.ownerId === userId || contract.partnerId === userId || hasPermission('VIEW_ALL_CONTRACTS');
  const canManageUsers = () => hasPermission('MANAGE_USERS') || hasAccessLevel('USERS', 'ADMIN');
  const canGrantAccess = () => hasPermission('GRANT_ACCESS') || hasAccessLevel('CONTENT', 'ADMIN');

  return {
    permissions,
    canCreateContract,
    canSignContract,
    canCancelContract,
    canViewContract,
    canManageUsers,
    canGrantAccess
  };
};

const contractHooks = {
  useContracts,
  useContract,
  useUserContracts,
  useUserPermissions,
  useUserContentAccess,
  useAvailableBeats,
  useContractSubscriptions,
  usePermissionCheck
};

export default contractHooks;
