/**
 * GraphQL Resolvers for ThriveCart Contracts and User Management
 * Integrates with ThriveCart API and database operations
 */

const ThriveCartContractsService = require('../../services/thriveCartContracts');
const { UserInputError, AuthenticationError, ForbiddenError } = require('apollo-server-express');

class ContractResolvers {
  constructor() {
    this.thriveCartService = new ThriveCartContractsService();
  }

  // Query Resolvers
  getQueries() {
    return {
      contracts: async (_, { filter }, { user, dataSources }) => {
        if (!user) throw new AuthenticationError('Authentication required');
        
        try {
          const contracts = await dataSources.contractDB.getContracts(filter);
          return contracts;
        } catch (error) {
          console.error('Error fetching contracts:', error);
          throw error;
        }
      },

      contract: async (_, { id }, { user, dataSources }) => {
        if (!user) throw new AuthenticationError('Authentication required');
        
        const contract = await dataSources.contractDB.getContract(id);
        
        // Check if user has permission to view this contract
        if (!this.canViewContract(user, contract)) {
          throw new ForbiddenError('Insufficient permissions to view this contract');
        }
        
        return contract;
      },

      contractsByUser: async (_, { userId }, { user, dataSources }) => {
        if (!user) throw new AuthenticationError('Authentication required');
        
        // Users can view their own contracts, admins can view any
        if (user.id !== userId && !this.isAdmin(user)) {
          throw new ForbiddenError('Insufficient permissions');
        }
        
        return await dataSources.contractDB.getContractsByUser(userId);
      },

      contractsByProduct: async (_, { productId }, { user, dataSources }) => {
        if (!user || !this.isAdmin(user)) {
          throw new ForbiddenError('Admin access required');
        }
        
        return await dataSources.contractDB.getContractsByProduct(productId);
      },

      users: async (_, { filter }, { user, dataSources }) => {
        if (!user || !this.isAdmin(user)) {
          throw new ForbiddenError('Admin access required');
        }
        
        return await dataSources.userDB.getUsers(filter);
      },

      user: async (_, { id }, { user, dataSources }) => {
        if (!user) throw new AuthenticationError('Authentication required');
        
        // Users can view their own profile, admins can view any
        if (user.id !== id && !this.isAdmin(user)) {
          throw new ForbiddenError('Insufficient permissions');
        }
        
        return await dataSources.userDB.getUser(id);
      },

      userByEmail: async (_, { email }, { user, dataSources }) => {
        if (!user || !this.isAdmin(user)) {
          throw new ForbiddenError('Admin access required');
        }
        
        return await dataSources.userDB.getUserByEmail(email);
      },

      currentUser: async (_, __, { user }) => {
        if (!user) throw new AuthenticationError('Authentication required');
        return user;
      },

      userPermissions: async (_, { userId }, { user, dataSources }) => {
        if (!user) throw new AuthenticationError('Authentication required');
        
        if (user.id !== userId && !this.isAdmin(user)) {
          throw new ForbiddenError('Insufficient permissions');
        }
        
        return await dataSources.permissionDB.getUserPermissions(userId);
      },

      contractPermissions: async (_, { contractId }, { user, dataSources }) => {
        if (!user) throw new AuthenticationError('Authentication required');
        
        const contract = await dataSources.contractDB.getContract(contractId);
        if (!this.canViewContract(user, contract)) {
          throw new ForbiddenError('Insufficient permissions');
        }
        
        return await dataSources.permissionDB.getContractPermissions(contractId);
      },

      userContentAccess: async (_, { userId }, { user, dataSources }) => {
        if (!user) throw new AuthenticationError('Authentication required');
        
        if (user.id !== userId && !this.isAdmin(user)) {
          throw new ForbiddenError('Insufficient permissions');
        }
        
        return await dataSources.contentDB.getUserContentAccess(userId);
      },

      beats: async (_, { filter }, { dataSources }) => {
        return await dataSources.beatDB.getBeats(filter);
      },

      beat: async (_, { id }, { dataSources }) => {
        return await dataSources.beatDB.getBeat(id);
      },

      availableBeats: async (_, { userId }, { user, dataSources }) => {
        if (!user) throw new AuthenticationError('Authentication required');
        
        if (user.id !== userId && !this.isAdmin(user)) {
          throw new ForbiddenError('Insufficient permissions');
        }
        
        return await dataSources.beatDB.getAvailableBeats(userId);
      }
    };
  }

  // Mutation Resolvers
  getMutations() {
    return {
      createContract: async (_, { input }, { user, dataSources, pubsub }) => {
        if (!user) throw new AuthenticationError('Authentication required');
        
        try {
          // Validate input
          this.validateContractInput(input);
          
          // Create contract in ThriveCart
          const thriveCartContract = await this.thriveCartService.createMusicIndustryContract(
            input.type.toLowerCase(),
            {
              partnerName: input.partnerName,
              partnerEmail: input.partnerEmail,
              businessName: input.businessName,
              productIds: input.productIds
            },
            {
              revenueShare: input.revenueShare,
              startDate: input.startDate,
              endDate: input.endDate,
              paymentMethod: input.paymentMethod.toLowerCase()
            }
          );
          
          // Create partner user if they don't exist
          let partner = await dataSources.userDB.getUserByEmail(input.partnerEmail);
          if (!partner) {
            partner = await dataSources.userDB.createUser({
              email: input.partnerEmail,
              name: input.partnerName,
              businessName: input.businessName,
              roleId: await dataSources.userDB.getPartnerRoleId()
            });
          }
          
          // Save contract to database
          const contract = await dataSources.contractDB.createContract({
            ...input,
            ownerId: user.id,
            partnerId: partner.id,
            thriveCartId: thriveCartContract.id,
            status: 'PENDING'
          });
          
          // Set up initial permissions based on contract type
          await this.setupContractPermissions(contract, dataSources);
          
          // Publish subscription event
          pubsub.publish('CONTRACT_CREATED', { contractCreated: contract });
          
          return contract;
        } catch (error) {
          console.error('Error creating contract:', error);
          throw new UserInputError(`Failed to create contract: ${error.message}`);
        }
      },

      signContract: async (_, { id }, { user, dataSources, pubsub }) => {
        if (!user) throw new AuthenticationError('Authentication required');
        
        const contract = await dataSources.contractDB.getContract(id);
        
        // Only the partner can sign the contract
        if (contract.partnerId !== user.id) {
          throw new ForbiddenError('Only the contract partner can sign this contract');
        }
        
        if (contract.status !== 'PENDING') {
          throw new UserInputError('Contract is not in pending status');
        }
        
        try {
          // Update contract status
          const signedContract = await dataSources.contractDB.updateContract(id, {
            status: 'ACTIVE',
            signedAt: new Date().toISOString()
          });
          
          // Activate permissions and content access
          await this.activateContractPermissions(signedContract, dataSources);
          
          // Publish subscription events
          pubsub.publish('CONTRACT_SIGNED', { contractSigned: signedContract });
          
          return signedContract;
        } catch (error) {
          console.error('Error signing contract:', error);
          throw new UserInputError(`Failed to sign contract: ${error.message}`);
        }
      },

      cancelContract: async (_, { id, reason }, { user, dataSources }) => {
        if (!user) throw new AuthenticationError('Authentication required');
        
        const contract = await dataSources.contractDB.getContract(id);
        
        // Only contract owner or partner can cancel
        if (contract.ownerId !== user.id && contract.partnerId !== user.id) {
          throw new ForbiddenError('Insufficient permissions to cancel this contract');
        }
        
        try {
          // Cancel in ThriveCart
          if (contract.thriveCartId) {
            await this.thriveCartService.cancelContract(contract.thriveCartId, reason);
          }
          
          // Update contract status
          const cancelledContract = await dataSources.contractDB.updateContract(id, {
            status: 'CANCELLED',
            cancellationReason: reason
          });
          
          // Revoke permissions and content access
          await this.revokeContractPermissions(cancelledContract, dataSources);
          
          return cancelledContract;
        } catch (error) {
          console.error('Error cancelling contract:', error);
          throw new UserInputError(`Failed to cancel contract: ${error.message}`);
        }
      },

      grantContentAccess: async (_, { userId, contentId, contentType, accessLevel, contractId }, { user, dataSources }) => {
        if (!user || !this.isAdmin(user)) {
          throw new ForbiddenError('Admin access required');
        }
        
        const access = await dataSources.contentDB.grantContentAccess({
          userId,
          contentId,
          contentType,
          accessLevel,
          contractId,
          grantedBy: user.id
        });
        
        return access;
      },

      transferBeatOwnership: async (_, { beatId, newOwnerId, contractId }, { user, dataSources }) => {
        if (!user) throw new AuthenticationError('Authentication required');
        
        const beat = await dataSources.beatDB.getBeat(beatId);
        const contract = await dataSources.contractDB.getContract(contractId);
        
        // Verify contract allows ownership transfer
        if (contract.type !== 'COPYRIGHT_TRANSFER') {
          throw new UserInputError('Contract does not allow ownership transfer');
        }
        
        if (contract.status !== 'ACTIVE') {
          throw new UserInputError('Contract must be active for ownership transfer');
        }
        
        // Transfer ownership
        const updatedBeat = await dataSources.beatDB.updateBeat(beatId, {
          ownerId: newOwnerId,
          transferredVia: contractId,
          transferredAt: new Date().toISOString()
        });
        
        // Grant full content access to new owner
        await dataSources.contentDB.grantContentAccess({
          userId: newOwnerId,
          contentId: beatId,
          contentType: 'BEAT',
          accessLevel: 'OWNER',
          contractId
        });
        
        return updatedBeat;
      }
    };
  }

  // Subscription Resolvers
  getSubscriptions() {
    return {
      contractCreated: {
        subscribe: (_, __, { pubsub }) => pubsub.asyncIterator(['CONTRACT_CREATED'])
      },
      
      contractSigned: {
        subscribe: (_, { userId }, { pubsub }) => 
          pubsub.asyncIterator([`CONTRACT_SIGNED_${userId}`])
      },
      
      contractCancelled: {
        subscribe: (_, __, { pubsub }) => pubsub.asyncIterator(['CONTRACT_CANCELLED'])
      }
    };
  }

  // Helper Methods
  canViewContract(user, contract) {
    return this.isAdmin(user) || 
           contract.ownerId === user.id || 
           contract.partnerId === user.id;
  }

  isAdmin(user) {
    return user.role?.name === 'ADMIN' || user.permissions?.some(p => p.name === 'ADMIN_ACCESS');
  }

  validateContractInput(input) {
    if (!input.partnerEmail || !input.partnerName) {
      throw new UserInputError('Partner email and name are required');
    }
    
    if (!input.productIds || input.productIds.length === 0) {
      throw new UserInputError('At least one product must be included');
    }
    
    if (input.revenueShare.mainProduct < 0 || input.revenueShare.mainProduct > 100) {
      throw new UserInputError('Revenue share must be between 0 and 100');
    }
  }

  async setupContractPermissions(contract, dataSources) {
    const permissionMap = {
      'COPYRIGHT_TRANSFER': ['CONTENT_FULL_ACCESS', 'REVENUE_VIEW', 'OWNERSHIP_TRANSFER'],
      'EXCLUSIVE_LICENSING': ['CONTENT_EXCLUSIVE_ACCESS', 'REVENUE_SHARE', 'USAGE_RIGHTS'],
      'COLLABORATION': ['CONTENT_COLLABORATIVE_ACCESS', 'REVENUE_SHARE', 'CREDIT_RIGHTS'],
      'PRODUCER_DEAL': ['CONTENT_PRODUCER_ACCESS', 'REVENUE_PARTICIPATION'],
      'DISTRIBUTION_DEAL': ['CONTENT_DISTRIBUTION_ACCESS', 'REVENUE_DISTRIBUTION']
    };
    
    const permissions = permissionMap[contract.type] || [];
    
    for (const permissionName of permissions) {
      const permission = await dataSources.permissionDB.getPermissionByName(permissionName);
      if (permission) {
        await dataSources.permissionDB.grantContractPermission({
          contractId: contract.id,
          userId: contract.partnerId,
          permissionId: permission.id,
          grantedAt: new Date().toISOString()
        });
      }
    }
  }

  async activateContractPermissions(contract, dataSources) {
    // Activate all permissions for this contract
    await dataSources.permissionDB.activateContractPermissions(contract.id);
    
    // Grant content access based on contract type
    const products = await dataSources.contractDB.getContractProducts(contract.id);
    
    for (const product of products) {
      const accessLevel = this.getAccessLevelForContractType(contract.type);
      await dataSources.contentDB.grantContentAccess({
        userId: contract.partnerId,
        contentId: product.productId,
        contentType: 'PRODUCT',
        accessLevel,
        contractId: contract.id
      });
    }
  }

  async revokeContractPermissions(contract, dataSources) {
    // Revoke all permissions for this contract
    await dataSources.permissionDB.revokeContractPermissions(contract.id);
    
    // Revoke content access
    await dataSources.contentDB.revokeContractContentAccess(contract.id);
  }

  getAccessLevelForContractType(contractType) {
    const accessMap = {
      'COPYRIGHT_TRANSFER': 'OWNER',
      'EXCLUSIVE_LICENSING': 'PARTNER',
      'COLLABORATION': 'COLLABORATOR',
      'PRODUCER_DEAL': 'COLLABORATOR',
      'DISTRIBUTION_DEAL': 'PARTNER'
    };
    
    return accessMap[contractType] || 'VIEWER';
  }
}

// Export resolver functions
const contractResolvers = new ContractResolvers();

module.exports = {
  Query: contractResolvers.getQueries(),
  Mutation: contractResolvers.getMutations(),
  Subscription: contractResolvers.getSubscriptions(),
  
  // Type resolvers for nested fields
  Contract: {
    partner: async (contract, _, { dataSources }) => {
      return await dataSources.userDB.getUser(contract.partnerId);
    },
    owner: async (contract, _, { dataSources }) => {
      return await dataSources.userDB.getUser(contract.ownerId);
    },
    products: async (contract, _, { dataSources }) => {
      return await dataSources.contractDB.getContractProducts(contract.id);
    },
    permissions: async (contract, _, { dataSources }) => {
      return await dataSources.permissionDB.getContractPermissions(contract.id);
    }
  },
  
  User: {
    contracts: async (user, _, { dataSources }) => {
      return await dataSources.contractDB.getContractsByUser(user.id);
    },
    permissions: async (user, _, { dataSources }) => {
      return await dataSources.permissionDB.getUserPermissions(user.id);
    },
    role: async (user, _, { dataSources }) => {
      return await dataSources.userDB.getUserRole(user.roleId);
    }
  },
  
  Beat: {
    permissions: async (beat, _, { dataSources }) => {
      return await dataSources.contentDB.getContentAccess(beat.id, 'BEAT');
    },
    contractsCount: async (beat, _, { dataSources }) => {
      return await dataSources.contractDB.getContractCountByProduct(beat.id);
    }
  }
};
