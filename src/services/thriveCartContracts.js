/**
 * ThriveCart Contracts Service
 * Handles contract creation and management for exclusive release deals
 * and copyright ownership transfers in the music business
 */

class ThriveCartContractsService {
  constructor() {
    this.baseUrl = process.env.THRIVECART_BASE_URL || 'https://api.thrivecart.com/v1';
    this.apiKey = process.env.THRIVECART_API_KEY;
  }

  /**
   * Create a new contract for exclusive release deals
   * @param {Object} contractData - Contract configuration
   * @returns {Promise<Object>} Created contract details
   */
  async createExclusiveReleaseContract(contractData) {
    const {
      partnerName,
      partnerEmail,
      businessName,
      productIds,
      revenueShare,
      contractType = 'exclusive_release',
      startDate = null, // null = immediate
      endDate = null, // null = indefinite
      paymentMethod = 'automatic' // 'automatic' or 'manual'
    } = contractData;

    try {
      const contractPayload = {
        partner: {
          name: partnerName,
          email: partnerEmail,
          business_name: businessName
        },
        products: this.formatProductsForContract(productIds, revenueShare),
        contract_details: {
          name: `Exclusive Release Deal - ${partnerName}`,
          type: contractType,
          start_date: startDate,
          end_date: endDate,
          payment_method: paymentMethod,
          auto_approve: false // Require manual approval for exclusive deals
        },
        revenue_sharing: this.setupRevenueSharing(revenueShare, contractType),
        terms: this.generateContractTerms(contractType, revenueShare)
      };

      const response = await this.makeApiRequest('/contracts', 'POST', contractPayload);
      
      console.log('Contract created successfully:', {
        contract_id: response.id,
        partner: partnerName,
        type: contractType
      });

      return response;
    } catch (error) {
      console.error('Error creating contract:', error);
      throw error;
    }
  }

  /**
   * Create different types of music industry contracts
   */
  async createMusicIndustryContract(type, partnerData, terms) {
    const contractTypes = {
      'copyright_transfer': {
        name: 'Copyright Ownership Transfer',
        revenue_share: 100, // Full ownership transfer
        terms: 'Complete copyright ownership transfer upon payment completion'
      },
      'exclusive_licensing': {
        name: 'Exclusive Licensing Agreement',
        revenue_share: terms.revenueShare || 70,
        terms: 'Exclusive licensing rights with revenue sharing'
      },
      'collaboration': {
        name: 'Music Collaboration Agreement',
        revenue_share: terms.revenueShare || 50,
        terms: 'Joint collaboration with shared revenue and credits'
      },
      'producer_deal': {
        name: 'Producer Partnership Deal',
        revenue_share: terms.revenueShare || 30,
        terms: 'Producer services with ongoing revenue participation'
      },
      'distribution_deal': {
        name: 'Distribution Partnership',
        revenue_share: terms.revenueShare || 20,
        terms: 'Distribution services with revenue sharing'
      }
    };

    const contractConfig = contractTypes[type];
    if (!contractConfig) {
      throw new Error(`Unknown contract type: ${type}`);
    }

    return this.createExclusiveReleaseContract({
      ...partnerData,
      revenueShare: contractConfig.revenue_share,
      contractType: type,
      ...terms
    });
  }

  /**
   * Format products for contract creation
   */
  formatProductsForContract(productIds, revenueShare) {
    return productIds.map(productId => ({
      product_id: productId,
      revenue_percentage: revenueShare.main || revenueShare,
      upsell_percentage: revenueShare.upsells || revenueShare,
      recurring_percentage: revenueShare.recurring || (revenueShare * 0.5) // Lower for recurring
    }));
  }

  /**
   * Setup detailed revenue sharing configuration
   */
  setupRevenueSharing(revenueShare, contractType) {
    const baseConfig = {
      main_product: revenueShare.main || revenueShare,
      upsells: revenueShare.upsells || revenueShare,
      downsells: revenueShare.downsells || revenueShare,
      recurring: revenueShare.recurring || 0
    };

    // Special configurations for different contract types
    switch (contractType) {
      case 'copyright_transfer':
        return {
          ...baseConfig,
          main_product: 100, // Full ownership
          recurring: 0 // No ongoing payments
        };
      
      case 'exclusive_licensing':
        return {
          ...baseConfig,
          recurring: baseConfig.main_product * 0.8 // Slightly lower for ongoing
        };
      
      case 'collaboration':
        return {
          ...baseConfig,
          recurring: baseConfig.main_product // Same rate for ongoing
        };
      
      default:
        return baseConfig;
    }
  }

  /**
   * Generate contract terms based on type
   */
  generateContractTerms(contractType, revenueShare) {
    const baseTerms = {
      jurisdiction: 'United States',
      currency: 'USD',
      payment_terms: '30 days',
      dispute_resolution: 'Arbitration'
    };

    const typeSpecificTerms = {
      'copyright_transfer': {
        ...baseTerms,
        ownership: 'Full copyright ownership transfers upon payment completion',
        usage_rights: 'Unrestricted usage rights for purchaser',
        credits: 'Original producer credit required',
        exclusivity: 'Exclusive worldwide rights'
      },
      'exclusive_licensing': {
        ...baseTerms,
        ownership: 'Exclusive licensing rights with revenue sharing',
        usage_rights: 'Exclusive usage for specified territory/duration',
        credits: 'Shared credits as agreed',
        exclusivity: 'Exclusive within agreed parameters'
      },
      'collaboration': {
        ...baseTerms,
        ownership: 'Joint ownership of collaborative work',
        usage_rights: 'Mutual usage rights for both parties',
        credits: 'Equal credits unless otherwise specified',
        exclusivity: 'Non-exclusive unless specified'
      }
    };

    return typeSpecificTerms[contractType] || baseTerms;
  }

  /**
   * Get contract status and details
   */
  async getContract(contractId) {
    try {
      return await this.makeApiRequest(`/contracts/${contractId}`, 'GET');
    } catch (error) {
      console.error('Error fetching contract:', error);
      throw error;
    }
  }

  /**
   * List all contracts with filtering
   */
  async listContracts(filters = {}) {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const endpoint = `/contracts${queryParams ? `?${queryParams}` : ''}`;
      return await this.makeApiRequest(endpoint, 'GET');
    } catch (error) {
      console.error('Error listing contracts:', error);
      throw error;
    }
  }

  /**
   * Update contract (only for pending contracts)
   */
  async updateContract(contractId, updates) {
    try {
      return await this.makeApiRequest(`/contracts/${contractId}`, 'PUT', updates);
    } catch (error) {
      console.error('Error updating contract:', error);
      throw error;
    }
  }

  /**
   * Cancel a contract
   */
  async cancelContract(contractId, reason = '') {
    try {
      return await this.makeApiRequest(`/contracts/${contractId}/cancel`, 'POST', {
        cancellation_reason: reason
      });
    } catch (error) {
      console.error('Error cancelling contract:', error);
      throw error;
    }
  }

  /**
   * Make API request to ThriveCart
   */
  async makeApiRequest(endpoint, method = 'GET', data = null) {
    const url = `${this.baseUrl}${endpoint}`;
    
    const options = {
      method,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    };

    if (data && (method === 'POST' || method === 'PUT')) {
      options.body = JSON.stringify(data);
    }

    const response = await fetch(url, options);
    
    if (!response.ok) {
      throw new Error(`ThriveCart API error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  }

  /**
   * Helper method to create quick contract templates
   */
  getContractTemplate(type) {
    const templates = {
      'exclusive_beat_sale': {
        contractType: 'copyright_transfer',
        revenueShare: {
          main: 100,
          recurring: 0
        },
        productIds: [process.env.THRIVECART_BEAT_EXCLUSIVE_ID],
        terms: {
          paymentMethod: 'automatic',
          startDate: null,
          endDate: null
        }
      },
      'producer_collaboration': {
        contractType: 'collaboration',
        revenueShare: {
          main: 50,
          recurring: 50
        },
        terms: {
          paymentMethod: 'manual',
          startDate: null,
          endDate: null
        }
      },
      'label_partnership': {
        contractType: 'distribution_deal',
        revenueShare: {
          main: 30,
          recurring: 20
        },
        terms: {
          paymentMethod: 'automatic',
          startDate: null,
          endDate: '2026-12-31' // 1 year partnership
        }
      }
    };

    return templates[type];
  }
}

export default ThriveCartContractsService;
