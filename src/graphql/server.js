/**
 * GraphQL Server Setup for ThriveCart Contracts Integration
 * Apollo Server with contract management and user permissions
 */

const { ApolloServer } = require('apollo-server-express');
const { PubSub } = require('graphql-subscriptions');
const contractTypeDefs = require('./schemas/contractSchema');
const contractResolvers = require('./resolvers/contractResolvers');
const { 
  ContractDataSource, 
  UserDataSource, 
  PermissionDataSource, 
  ContentDataSource, 
  BeatDataSource 
} = require('./dataSources');

// Initialize PubSub for subscriptions
const pubsub = new PubSub();

// Mock database - in production, this would be your actual database
const mockDB = {
  collection: (name) => ({
    get: () => Promise.resolve({ docs: [] }),
    doc: (id) => ({
      get: () => Promise.resolve({ exists: false }),
      update: () => Promise.resolve(),
      delete: () => Promise.resolve()
    }),
    where: () => ({
      get: () => Promise.resolve({ docs: [], size: 0 }),
      where: function() { return this; },
      limit: function() { return this; }
    }),
    add: (data) => Promise.resolve({ id: `mock_${Date.now()}` })
  }),
  batch: () => ({
    update: () => {},
    commit: () => Promise.resolve()
  })
};

// Create Apollo Server
const createApolloServer = () => {
  const server = new ApolloServer({
    typeDefs: contractTypeDefs,
    resolvers: contractResolvers,
    
    // Data sources
    dataSources: () => ({
      contractDB: new ContractDataSource(mockDB),
      userDB: new UserDataSource(mockDB),
      permissionDB: new PermissionDataSource(mockDB),
      contentDB: new ContentDataSource(mockDB),
      beatDB: new BeatDataSource(mockDB)
    }),
    
    // Context function - authentication and user info
    context: ({ req, connection }) => {
      // For subscriptions
      if (connection) {
        return {
          ...connection.context,
          pubsub
        };
      }
      
      // For queries and mutations
      const token = req.headers.authorization?.replace('Bearer ', '');
      
      // Mock user authentication - in production, verify JWT token
      const user = token ? {
        id: 'user_123',
        email: 'user@example.com',
        name: 'Demo User',
        role: { name: 'ADMIN' },
        permissions: [
          { name: 'CREATE_CONTRACT', action: 'CREATE', resource: 'CONTRACTS' },
          { name: 'MANAGE_USERS', action: 'MANAGE', resource: 'USERS' },
          { name: 'GRANT_ACCESS', action: 'GRANT', resource: 'CONTENT' }
        ]
      } : null;
      
      return {
        user,
        pubsub
      };
    },
    
    // Subscriptions
    subscriptions: {
      path: '/graphql',
      onConnect: (connectionParams, webSocket, context) => {
        // Authentication for subscriptions
        const token = connectionParams.authorization?.replace('Bearer ', '');
        const user = token ? { id: 'user_123' } : null;
        
        return { user };
      }
    },
    
    // GraphQL Playground in development
    introspection: process.env.NODE_ENV !== 'production',
    playground: process.env.NODE_ENV !== 'production'
  });
  
  return server;
};

// GraphQL endpoint for Gatsby
const graphqlHandler = async (req, res) => {
  const server = createApolloServer();
  await server.start();
  
  const handler = server.createHandler({ path: '/api/graphql' });
  return handler(req, res);
};

// Initialize sample data
const initializeSampleData = async (dataSources) => {
  try {
    // Create sample permissions
    const permissions = [
      { name: 'CREATE_CONTRACT', resource: 'CONTRACTS', action: 'CREATE', level: 'ADMIN' },
      { name: 'VIEW_ALL_CONTRACTS', resource: 'CONTRACTS', action: 'VIEW', level: 'ADMIN' },
      { name: 'MANAGE_USERS', resource: 'USERS', action: 'MANAGE', level: 'ADMIN' },
      { name: 'GRANT_ACCESS', resource: 'CONTENT', action: 'GRANT', level: 'ADMIN' },
      { name: 'CONTENT_FULL_ACCESS', resource: 'CONTENT', action: 'FULL_ACCESS', level: 'OWNER' },
      { name: 'REVENUE_SHARE', resource: 'REVENUE', action: 'SHARE', level: 'PARTNER' }
    ];
    
    // Create sample roles
    const roles = [
      { name: 'ADMIN', permissions: ['CREATE_CONTRACT', 'VIEW_ALL_CONTRACTS', 'MANAGE_USERS', 'GRANT_ACCESS'] },
      { name: 'PARTNER', permissions: ['REVENUE_SHARE', 'CONTENT_COLLABORATIVE_ACCESS'] },
      { name: 'USER', permissions: [] }
    ];
    
    // Create sample beats
    const beats = [
      {
        title: 'Exclusive Hip-Hop Beat',
        artist: 'JeldonMusic',
        price: 50,
        exclusivePrice: 1000,
        licenseType: 'EXCLUSIVE',
        availableForLicensing: true
      },
      {
        title: 'Premium R&B Instrumental',
        artist: 'JeldonMusic',
        price: 150,
        exclusivePrice: 800,
        licenseType: 'PREMIUM',
        availableForLicensing: true
      }
    ];
    
    console.log('Sample data initialized for GraphQL contracts system');
  } catch (error) {
    console.error('Error initializing sample data:', error);
  }
};

module.exports = {
  createApolloServer,
  graphqlHandler,
  initializeSampleData,
  pubsub
};
