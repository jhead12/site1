/**
 * Demo ThriveCart Contracts Service
 * Provides mock data for local development and testing
 */

class DemoThriveCartContractsService {
  constructor() {
    this.mockContracts = [
      {
        id: 'contract_1',
        name: 'Exclusive Beat License - Producer X',
        type: 'copyright_transfer',
        status: 'active',
        partner: {
          id: 'partner_1',
          name: 'Producer X',
          email: 'producerx@example.com',
          businessName: 'X Productions'
        },
        owner: {
          id: 'owner_1',
          name: 'JeldonMusic',
          email: 'contact@jeldonmusic.com'
        },
        products: [
          {
            id: 'product_1',
            productId: 'tc_beat_exclusive_1000',
            productName: 'Exclusive Beat License',
            revenuePercentage: 100
          }
        ],
        revenueShare: {
          main: 100,
          upsells: 100,
          recurring: 0
        },
        paymentMethod: 'automatic',
        startDate: null,
        endDate: null,
        createdAt: '2025-01-15T10:00:00Z',
        signedAt: '2025-01-16T14:30:00Z'
      },
      {
        id: 'contract_2',
        name: 'Music Collaboration - Artist Y',
        type: 'collaboration',
        status: 'pending',
        partner: {
          id: 'partner_2',
          name: 'Artist Y',
          email: 'artisty@example.com',
          businessName: 'Y Music Group'
        },
        owner: {
          id: 'owner_1',
          name: 'JeldonMusic',
          email: 'contact@jeldonmusic.com'
        },
        products: [
          {
            id: 'product_2',
            productId: 'tc_beat_premium_150',
            productName: 'Premium Beat License',
            revenuePercentage: 50
          }
        ],
        revenueShare: {
          main: 50,
          upsells: 50,
          recurring: 50
        },
        paymentMethod: 'manual',
        startDate: null,
        endDate: null,
        createdAt: '2025-01-17T09:15:00Z',
        signedAt: null
      },
      {
        id: 'contract_3',
        name: 'Producer Partnership - Studio Z',
        type: 'producer_deal',
        status: 'active',
        partner: {
          id: 'partner_3',
          name: 'Studio Z',
          email: 'contact@studioz.com',
          businessName: 'Studio Z Productions'
        },
        owner: {
          id: 'owner_1',
          name: 'JeldonMusic',
          email: 'contact@jeldonmusic.com'
        },
        products: [
          {
            id: 'product_3',
            productId: 'tc_masterclass_600',
            productName: 'Producer Masterclass',
            revenuePercentage: 30
          }
        ],
        revenueShare: {
          main: 30,
          upsells: 25,
          recurring: 20
        },
        paymentMethod: 'automatic',
        startDate: '2025-01-01T00:00:00Z',
        endDate: '2025-12-31T23:59:59Z',
        createdAt: '2024-12-15T16:45:00Z',
        signedAt: '2024-12-20T11:20:00Z'
      }
    ];
  }

  /**
   * Create a new contract (demo version)
   */
  async createMusicIndustryContract(type, partnerData, terms) {
    // Simulate API delay
    await this.delay(1000);

    const newContract = {
      id: `contract_${Date.now()}`,
      name: `${this.getContractTypeName(type)} - ${partnerData.partnerName}`,
      type: type,
      status: 'pending',
      partner: {
        id: `partner_${Date.now()}`,
        name: partnerData.partnerName,
        email: partnerData.partnerEmail,
        businessName: partnerData.businessName || ''
      },
      owner: {
        id: 'owner_1',
        name: 'JeldonMusic',
        email: 'contact@jeldonmusic.com'
      },
      products: partnerData.productIds.map((productId, index) => ({
        id: `product_${Date.now()}_${index}`,
        productId: productId,
        productName: this.getProductName(productId),
        revenuePercentage: terms.revenueShare.main || terms.revenueShare
      })),
      revenueShare: {
        main: terms.revenueShare.main || terms.revenueShare,
        upsells: terms.revenueShare.upsells || terms.revenueShare,
        recurring: terms.revenueShare.recurring || 0
      },
      paymentMethod: terms.paymentMethod || 'automatic',
      startDate: terms.startDate,
      endDate: terms.endDate,
      createdAt: new Date().toISOString(),
      signedAt: null
    };

    this.mockContracts.push(newContract);
    
    console.log('Demo contract created:', newContract);
    return { id: newContract.id, ...newContract };
  }

  /**
   * List contracts with optional filtering
   */
  async listContracts(filters = {}) {
    // Simulate API delay
    await this.delay(500);

    let contracts = [...this.mockContracts];

    if (filters.status) {
      contracts = contracts.filter(c => c.status === filters.status);
    }
    if (filters.type) {
      contracts = contracts.filter(c => c.type === filters.type);
    }
    if (filters.partnerId) {
      contracts = contracts.filter(c => c.partner.id === filters.partnerId);
    }

    return { contracts };
  }

  /**
   * Get a single contract
   */
  async getContract(contractId) {
    await this.delay(300);
    
    const contract = this.mockContracts.find(c => c.id === contractId);
    if (!contract) {
      throw new Error('Contract not found');
    }
    
    return contract;
  }

  /**
   * Cancel a contract
   */
  async cancelContract(contractId, reason = '') {
    await this.delay(500);
    
    const contractIndex = this.mockContracts.findIndex(c => c.id === contractId);
    if (contractIndex === -1) {
      throw new Error('Contract not found');
    }

    this.mockContracts[contractIndex].status = 'cancelled';
    this.mockContracts[contractIndex].cancellationReason = reason;
    
    console.log('Demo contract cancelled:', contractId, reason);
    return this.mockContracts[contractIndex];
  }

  /**
   * Helper methods
   */
  getContractTypeName(type) {
    const names = {
      'copyright_transfer': 'Copyright Ownership Transfer',
      'exclusive_licensing': 'Exclusive Licensing Agreement',
      'collaboration': 'Music Collaboration Agreement',
      'producer_deal': 'Producer Partnership Deal',
      'distribution_deal': 'Distribution Partnership'
    };
    return names[type] || type;
  }

  getProductName(productId) {
    const names = {
      'tc_beat_basic_50': 'Basic Beat License ($50)',
      'tc_beat_premium_150': 'Premium Beat License ($150)',
      'tc_beat_exclusive_1000': 'Exclusive Beat License ($1000)',
      'tc_beat_pack_200': 'Beat Pack Bundle ($200)',
      'tc_masterclass_600': 'Producer Masterclass ($600)'
    };
    return names[productId] || 'Unknown Product';
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Mock API request method (doesn't actually make HTTP requests)
   */
  async makeApiRequest(endpoint, method = 'GET', data = null) {
    console.log(`Demo API Request: ${method} ${endpoint}`, data);
    
    // Simulate successful API response
    return {
      success: true,
      endpoint,
      method,
      data
    };
  }
}

export default DemoThriveCartContractsService;
