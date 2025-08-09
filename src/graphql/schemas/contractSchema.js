/**
 * GraphQL Schema for ThriveCart Contracts and User Management
 * Integrates contracts with user permissions and content access
 */

const { gql } = require('apollo-server-express');

const contractTypeDefs = gql`
  # Contract Types
  enum ContractType {
    COPYRIGHT_TRANSFER
    EXCLUSIVE_LICENSING
    COLLABORATION
    PRODUCER_DEAL
    PRODUCER_AGREEMENT
    DISTRIBUTION_DEAL
  }

  enum ContractStatus {
    PENDING
    ACTIVE
    CANCELLED
    EXPIRED
  }

  enum PaymentMethod {
    AUTOMATIC
    MANUAL
  }

  enum PermissionLevel {
    VIEWER
    COLLABORATOR
    PARTNER
    OWNER
    ADMIN
  }

  # User and Permission Types
  type User {
    id: ID!
    email: String!
    name: String!
    businessName: String
    role: UserRole!
    permissions: [Permission!]!
    contracts: [Contract!]!
    createdAt: String!
    updatedAt: String!
  }

  type UserRole {
    id: ID!
    name: String!
    permissions: [Permission!]!
  }

  type Permission {
    id: ID!
    name: String!
    resource: String!
    action: String!
    level: PermissionLevel!
  }

  # Contract Types
  type Contract {
    id: ID!
    name: String!
    type: ContractType!
    status: ContractStatus!
    partner: User!
    owner: User!
    products: [ContractProduct!]!
    revenueShare: RevenueShare!
    paymentMethod: PaymentMethod!
    startDate: String
    endDate: String
    terms: ContractTerms!
    permissions: [ContractPermission!]!
    createdAt: String!
    updatedAt: String!
    signedAt: String
  }

  type ContractProduct {
    id: ID!
    productId: String!
    productName: String!
    revenuePercentage: Float!
    upsellPercentage: Float!
    recurringPercentage: Float!
  }

  type RevenueShare {
    mainProduct: Float!
    upsells: Float!
    downsells: Float!
    recurring: Float!
  }

  type ContractTerms {
    jurisdiction: String!
    currency: String!
    paymentTerms: String!
    disputeResolution: String!
    ownership: String!
    usageRights: String!
    credits: String!
    exclusivity: String!
    # Producer Agreement specific fields
    artistName: String
    trackTitle: String
    governingState: String
    county: String
    musicOwnership: String
    lyricsOwnership: String
    producerAddress: String
    paymentAmountWords: String
  }

  type ContractPermission {
    id: ID!
    contract: Contract!
    user: User!
    permission: Permission!
    grantedAt: String!
    expiresAt: String
  }

  # Content Access Types
  type ContentAccess {
    id: ID!
    user: User!
    contentType: String!
    contentId: String!
    accessLevel: PermissionLevel!
    grantedBy: Contract
    expiresAt: String
    createdAt: String!
  }

  type Beat {
    id: ID!
    title: String!
    artist: String!
    price: Float!
    exclusivePrice: Float!
    licenseType: String!
    audioUrl: String
    contractsCount: Int!
    availableForLicensing: Boolean!
    permissions: [ContentAccess!]!
  }

  # Input Types
  input CreateContractInput {
    name: String!
    type: ContractType!
    partnerEmail: String!
    partnerName: String!
    businessName: String
    productIds: [String!]!
    revenueShare: RevenueShareInput!
    paymentMethod: PaymentMethod!
    startDate: String
    endDate: String
    autoApprove: Boolean = false
    # Producer Agreement specific fields
    artistName: String
    trackTitle: String
    governingState: String
    county: String
    musicOwnership: String
    lyricsOwnership: String
    producerAddress: String
    paymentAmountWords: String
  }

  input RevenueShareInput {
    mainProduct: Float!
    upsells: Float!
    downsells: Float!
    recurring: Float!
  }

  input UpdateContractInput {
    name: String
    revenueShare: RevenueShareInput
    paymentMethod: PaymentMethod
    endDate: String
  }

  input GrantPermissionInput {
    userId: ID!
    permissionId: ID!
    contractId: ID
    expiresAt: String
  }

  input CreateUserInput {
    email: String!
    name: String!
    businessName: String
    roleId: ID!
  }

  # Query Types
  type Query {
    # Contract Queries
    contracts(filter: ContractFilterInput): [Contract!]!
    contract(id: ID!): Contract
    contractsByUser(userId: ID!): [Contract!]!
    contractsByProduct(productId: String!): [Contract!]!
    
    # User Queries
    users(filter: UserFilterInput): [User!]!
    user(id: ID!): User
    userByEmail(email: String!): User
    currentUser: User
    
    # Permission Queries
    permissions: [Permission!]!
    userPermissions(userId: ID!): [Permission!]!
    contractPermissions(contractId: ID!): [ContractPermission!]!
    
    # Content Access Queries
    userContentAccess(userId: ID!): [ContentAccess!]!
    contentAccessByType(contentType: String!): [ContentAccess!]!
    
    # Beat/Product Queries
    beats(filter: BeatFilterInput): [Beat!]!
    beat(id: ID!): Beat
    availableBeats(userId: ID!): [Beat!]!
  }

  # Mutation Types
  type Mutation {
    # Contract Mutations
    createContract(input: CreateContractInput!): Contract!
    updateContract(id: ID!, input: UpdateContractInput!): Contract!
    signContract(id: ID!): Contract!
    cancelContract(id: ID!, reason: String): Contract!
    
    # User Mutations
    createUser(input: CreateUserInput!): User!
    updateUser(id: ID!, input: UpdateUserInput!): User!
    deleteUser(id: ID!): Boolean!
    
    # Permission Mutations
    grantPermission(input: GrantPermissionInput!): ContractPermission!
    revokePermission(userId: ID!, permissionId: ID!): Boolean!
    
    # Content Access Mutations
    grantContentAccess(userId: ID!, contentId: String!, contentType: String!, accessLevel: PermissionLevel!, contractId: ID): ContentAccess!
    revokeContentAccess(userId: ID!, contentId: String!): Boolean!
    
    # Beat/Product Mutations
    createBeat(input: CreateBeatInput!): Beat!
    updateBeat(id: ID!, input: UpdateBeatInput!): Beat!
    transferBeatOwnership(beatId: ID!, newOwnerId: ID!, contractId: ID!): Beat!
  }

  # Subscription Types
  type Subscription {
    contractCreated: Contract!
    contractSigned(userId: ID!): Contract!
    contractCancelled: Contract!
    permissionGranted(userId: ID!): ContractPermission!
    contentAccessGranted(userId: ID!): ContentAccess!
  }

  # Filter Input Types
  input ContractFilterInput {
    status: ContractStatus
    type: ContractType
    partnerId: ID
    ownerId: ID
    productId: String
  }

  input UserFilterInput {
    role: String
    businessName: String
    hasContracts: Boolean
  }

  input BeatFilterInput {
    artist: String
    priceRange: PriceRangeInput
    licenseType: String
    availableOnly: Boolean
  }

  input PriceRangeInput {
    min: Float
    max: Float
  }

  input UpdateUserInput {
    name: String
    businessName: String
    roleId: ID
  }

  input CreateBeatInput {
    title: String!
    artist: String!
    price: Float!
    exclusivePrice: Float!
    licenseType: String!
    audioUrl: String
  }

  input UpdateBeatInput {
    title: String
    artist: String
    price: Float
    exclusivePrice: Float
    licenseType: String
    audioUrl: String
    availableForLicensing: Boolean
  }
`;

module.exports = contractTypeDefs;
