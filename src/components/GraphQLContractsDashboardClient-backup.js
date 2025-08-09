import React, { useState, useEffect } from 'react';
import { 
  useContracts, 
  useUserPermissions, 
  useUserContentAccess, 
  useContractSubscriptions,
  usePermissionCheck 
} from '../hooks/useContractGraphQL';

/**
 * Client-side GraphQL Contracts Dashboard
 * This component only runs on the client side to avoid SSR issues
 */
const GraphQLContractsDashboardClient = ({ currentUserId }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [filter, setFilter] = useState({});

  // GraphQL hooks - safe to use here since this only runs on client
  const { contracts, loading: contractsLoading, createContract } = useContracts(filter);
  const { permissions, hasPermission } = useUserPermissions(currentUserId);
  const { contentAccess } = useUserContentAccess(currentUserId);
  const { notifications, dismissNotification } = useContractSubscriptions(currentUserId);
  const permissionCheck = usePermissionCheck(currentUserId);

  const [formData, setFormData] = useState({
    name: '',
    type: 'EXCLUSIVE_LICENSING',
    partnerEmail: '',
    partnerName: '',
    businessName: '',
    description: '',
    revenueShare: {
      mainProduct: 70,
      upsells: 60,
      downsells: 60,
      recurring: 50
    },
    paymentTerms: {
      frequency: 'MONTHLY',
      minimumThreshold: 100,
      currency: 'USD'
    },
    duration: 'PERPETUAL',
    territory: 'WORLDWIDE',
    exclusivity: false,
    autoRenewal: true,
    terms: '',
    attachments: []
  });

  // Contract type configurations
  const contractTypes = {
    'EXCLUSIVE_LICENSING': {
      name: 'Exclusive Music Licensing',
      defaultRevenue: { mainProduct: 80, upsells: 70, downsells: 70, recurring: 60 },
      description: 'Exclusive licensing rights with ongoing revenue sharing',
      permissions: ['CONTENT_EXCLUSIVE_ACCESS', 'REVENUE_SHARE']
    },
    'COLLABORATION': {
      name: 'Music Collaboration Agreement',
      defaultRevenue: { mainProduct: 50, upsells: 50, downsells: 50, recurring: 50 },
      description: 'Joint collaboration with shared ownership and credits',
      permissions: ['CONTENT_COLLABORATIVE_ACCESS', 'SHARED_CREDITS']
    },
    'PRODUCER_DEAL': {
      name: 'Producer Partnership Deal',
      defaultRevenue: { mainProduct: 30, upsells: 25, downsells: 25, recurring: 20 },
      description: 'Producer services with ongoing revenue participation',
      permissions: ['CONTENT_PRODUCER_ACCESS', 'REVENUE_PARTICIPATION']
    },
    'DISTRIBUTION_DEAL': {
      name: 'Distribution Partnership',
      defaultRevenue: { mainProduct: 20, upsells: 15, downsells: 15, recurring: 15 },
      description: 'Distribution services with revenue sharing from sales',
      permissions: ['CONTENT_DISTRIBUTION_ACCESS', 'SALES_REPORTING']
    }
  };

  // Update form data when contract type changes
  useEffect(() => {
    if (contractTypes[formData.type]) {
      setFormData(prev => ({
        ...prev,
        revenueShare: contractTypes[formData.type].defaultRevenue,
        description: contractTypes[formData.type].description
      }));
    }
  }, [formData.type]);

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createContract({
        variables: {
          input: {
            ...formData,
            ownerId: currentUserId,
            status: 'PENDING'
          }
        }
      });
      
      // Reset form
      setFormData({
        name: '',
        type: 'EXCLUSIVE_LICENSING',
        partnerEmail: '',
        partnerName: '',
        businessName: '',
        description: '',
        revenueShare: {
          mainProduct: 70,
          upsells: 60,
          downsells: 60,
          recurring: 50
        },
        paymentTerms: {
          frequency: 'MONTHLY',
          minimumThreshold: 100,
          currency: 'USD'
        },
        duration: 'PERPETUAL',
        territory: 'WORLDWIDE',
        exclusivity: false,
        autoRenewal: true,
        terms: '',
        attachments: []
      });
      
      setActiveTab('overview');
    } catch (error) {
      console.error('Error creating contract:', error);
    }
  };

  if (contractsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-center items-center h-64">
            <div className="text-lg text-gray-600">Loading contracts...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header with Notifications */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              GraphQL Contracts Dashboard
            </h1>
            <p className="text-gray-600">
              Manage your music contracts and partnerships with advanced GraphQL integration
            </p>
          </div>
          
          {/* Notifications */}
          {notifications.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md">
              <h3 className="font-semibold text-blue-900 mb-2">Recent Updates</h3>
              {notifications.slice(0, 3).map(notification => (
                <div key={notification.id} className="flex justify-between items-center mb-2">
                  <span className="text-sm text-blue-800">{notification.message}</span>
                  <button 
                    onClick={() => dismissNotification(notification.id)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Permission Check */}
        {!permissionCheck.canManageContracts && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">
              You don't have permission to manage contracts. Please contact an administrator.
            </p>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex space-x-8">
            {['overview', 'create', 'analytics'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab 
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Contracts</h3>
                <p className="text-3xl font-bold text-blue-600">{contracts.length}</p>
                <p className="text-sm text-gray-500">Active partnerships</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Revenue Share</h3>
                <p className="text-3xl font-bold text-green-600">
                  ${contracts.reduce((sum, contract) => sum + (contract.totalRevenue || 0), 0).toFixed(2)}
                </p>
                <p className="text-sm text-gray-500">This month</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Permissions</h3>
                <p className="text-3xl font-bold text-purple-600">{permissions.length}</p>
                <p className="text-sm text-gray-500">Access rights</p>
              </div>
            </div>

            {/* Contracts Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Recent Contracts</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contract
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Partner
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Revenue
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {contracts.map(contract => (
                      <tr key={contract.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{contract.name}</div>
                          <div className="text-sm text-gray-500">{contract.id}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{contract.partner?.name}</div>
                          <div className="text-sm text-gray-500">{contract.partner?.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                            {contract.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            contract.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                            contract.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {contract.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ${(contract.totalRevenue || 0).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'create' && permissionCheck.canManageContracts && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Create New Contract</h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contract Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter contract name"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contract Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => handleInputChange('type', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {Object.entries(contractTypes).map(([key, type]) => (
                      <option key={key} value={key}>{type.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Partner Name
                  </label>
                  <input
                    type="text"
                    value={formData.partnerName}
                    onChange={(e) => handleInputChange('partnerName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Partner name"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Partner Email
                  </label>
                  <input
                    type="email"
                    value={formData.partnerEmail}
                    onChange={(e) => handleInputChange('partnerEmail', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="partner@example.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Revenue Share Settings
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Main Product (%)</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={formData.revenueShare.mainProduct}
                      onChange={(e) => handleInputChange('revenueShare.mainProduct', parseInt(e.target.value))}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Upsells (%)</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={formData.revenueShare.upsells}
                      onChange={(e) => handleInputChange('revenueShare.upsells', parseInt(e.target.value))}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Downsells (%)</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={formData.revenueShare.downsells}
                      onChange={(e) => handleInputChange('revenueShare.downsells', parseInt(e.target.value))}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Recurring (%)</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={formData.revenueShare.recurring}
                      onChange={(e) => handleInputChange('revenueShare.recurring', parseInt(e.target.value))}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contract Terms
                </label>
                <textarea
                  value={formData.terms}
                  onChange={(e) => handleInputChange('terms', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="4"
                  placeholder="Enter specific terms and conditions..."
                />
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setActiveTab('overview')}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Create Contract
                </button>
              </div>
            </form>
          </div>
        )}

        {activeTab === 'analytics' && permissionCheck.canViewAnalytics && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contract Analytics</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{contracts.length}</p>
                  <p className="text-sm text-gray-500">Total Contracts</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">
                    ${contracts.reduce((sum, contract) => sum + (contract.totalRevenue || 0), 0).toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-500">Total Revenue</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">{contentAccess.length}</p>
                  <p className="text-sm text-gray-500">Content Access Rights</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GraphQLContractsDashboardClient;
