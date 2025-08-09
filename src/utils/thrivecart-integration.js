/**
 * ThriveCart Integration for AI Contract Designer
 * This module handles the integration between the AI-generated contracts
 * and ThriveCart's payment processing system.
 */

// ThriveCart Product IDs based on contract types and pricing
const THRIVECART_PRODUCTS = {
  // Base service product IDs
  beat_licensing: {
    non_exclusive: process.env.GATSBY_THRIVECART_BEAT_BASIC_ID,
    exclusive: process.env.GATSBY_THRIVECART_BEAT_EXCLUSIVE_ID,
    buyout: process.env.GATSBY_THRIVECART_BEAT_EXCLUSIVE_ID, // Use premium for buyout
  },
  custom_production: {
    non_exclusive: process.env.GATSBY_THRIVECART_BEAT_PREMIUM_ID,
    exclusive: process.env.GATSBY_THRIVECART_BEAT_EXCLUSIVE_ID,
    buyout: process.env.GATSBY_THRIVECART_BEAT_EXCLUSIVE_ID,
  },
  // Add more mappings as needed
};

/**
 * Generate ThriveCart checkout URL based on contract details
 * @param {Object} contract - The AI-generated contract
 * @returns {String} - ThriveCart checkout URL
 */
export const generateThriveCartCheckoutUrl = (contract) => {
  const { clientInfo, terms, pricing } = contract;
  
  // Get base product ID
  const baseProductId = THRIVECART_PRODUCTS[clientInfo.projectType]?.[terms.copyrightOwnership];
  
  if (!baseProductId) {
    throw new Error(`No ThriveCart product found for ${clientInfo.projectType} with ${terms.copyrightOwnership} ownership`);
  }

  // Build ThriveCart URL with custom pricing
  const checkoutUrl = new URL(`https://thrivecart.com/checkout/${baseProductId}`);
  
  // Add custom parameters
  checkoutUrl.searchParams.append('price', pricing.finalPrice);
  checkoutUrl.searchParams.append('contract_id', contract.id);
  checkoutUrl.searchParams.append('project_type', clientInfo.projectType);
  checkoutUrl.searchParams.append('copyright_level', terms.copyrightOwnership);
  
  // Add deliverables as custom fields
  if (terms.deliverables.length > 0) {
    checkoutUrl.searchParams.append('deliverables', terms.deliverables.join(','));
  }
  
  // Add commercial use rights
  if (terms.commercialUse.length > 0) {
    checkoutUrl.searchParams.append('commercial_use', terms.commercialUse.join(','));
  }
  
  return checkoutUrl.toString();
};

/**
 * Create contract summary for ThriveCart order
 * @param {Object} contract - The AI-generated contract
 * @returns {Object} - Order summary object
 */
export const createOrderSummary = (contract) => {
  const { clientInfo, terms, pricing } = contract;
  
  return {
    orderId: contract.id,
    productName: `${clientInfo.projectType.replace('_', ' ').toUpperCase()} - ${terms.copyrightOwnership.replace('_', ' ').toUpperCase()}`,
    totalAmount: pricing.finalPrice,
    breakdown: pricing.breakdown,
    contractTerms: {
      copyrightOwnership: terms.copyrightOwnership,
      commercialUse: terms.commercialUse,
      deliverables: terms.deliverables,
      revisions: terms.revisions,
      timeline: clientInfo.timeline,
      additionalServices: terms.additionalServices
    },
    generatedAt: contract.generatedDate
  };
};

/**
 * Webhook handler for ThriveCart payment completion
 * This would typically be implemented as a serverless function
 * @param {Object} webhookData - ThriveCart webhook payload
 */
export const handlePaymentCompletion = async (webhookData) => {
  try {
    const { 
      order_id, 
      customer_email, 
      amount_paid, 
      contract_id,
      project_type,
      copyright_level 
    } = webhookData;

    // 1. Verify webhook signature (important for security)
    const isValid = verifyWebhookSignature(webhookData);
    if (!isValid) {
      throw new Error('Invalid webhook signature');
    }

    // 2. Create contract document
    const contractDocument = await generateContractDocument({
      contractId: contract_id,
      customerEmail: customer_email,
      amountPaid: amount_paid,
      projectType: project_type,
      copyrightLevel: copyright_level,
      orderId: order_id
    });

    // 3. Send contract to customer
    await sendContractToCustomer(customer_email, contractDocument);

    // 4. Update CRM/Database
    await updateCustomerRecord({
      email: customer_email,
      contractId: contract_id,
      orderAmount: amount_paid,
      contractType: `${project_type}_${copyright_level}`,
      status: 'contract_sent'
    });

    // 5. Trigger workflow automation
    await triggerWorkflowAutomation({
      contractId: contract_id,
      projectType: project_type,
      copyrightLevel: copyright_level,
      customerEmail: customer_email
    });

    return {
      success: true,
      message: 'Payment processed and contract sent successfully'
    };

  } catch (error) {
    console.error('Payment processing error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Generate contract document based on AI contract and payment details
 * @param {Object} params - Contract generation parameters
 * @returns {Object} - Generated contract document
 */
const generateContractDocument = async (params) => {
  const { 
    contractId, 
    customerEmail, 
    amountPaid, 
    projectType, 
    copyrightLevel, 
    orderId 
  } = params;

  // This would typically integrate with a document generation service
  // like PandaDoc, DocuSign, or a custom PDF generator
  const contractDocument = {
    id: contractId,
    orderId: orderId,
    customerEmail: customerEmail,
    amountPaid: amountPaid,
    projectType: projectType,
    copyrightLevel: copyrightLevel,
    createdAt: new Date().toISOString(),
    // Contract terms based on AI selections
    terms: generateContractTerms(projectType, copyrightLevel, amountPaid),
    // PDF document URL (would be generated by document service)
    documentUrl: `https://contracts.jeldonmusic.com/documents/${contractId}.pdf`,
    // Digital signature required
    requiresSignature: true,
    signatureUrl: `https://contracts.jeldonmusic.com/sign/${contractId}`
  };

  return contractDocument;
};

/**
 * Generate contract terms based on project type and copyright level
 * @param {String} projectType - Type of project
 * @param {String} copyrightLevel - Copyright ownership level
 * @param {Number} amountPaid - Amount paid for the contract
 * @returns {Object} - Contract terms
 */
const generateContractTerms = (projectType, copyrightLevel, amountPaid) => {
  const terms = {
    projectType: projectType,
    copyrightOwnership: copyrightLevel,
    paymentAmount: amountPaid,
    paymentDate: new Date().toISOString(),
    effectiveDate: new Date().toISOString(),
    // Base terms that apply to all contracts
    baseTerms: {
      territory: 'Worldwide',
      language: 'English',
      currency: 'USD',
      paymentMethod: 'Credit Card via ThriveCart',
      disputeResolution: 'Arbitration',
      governingLaw: 'State of California'
    }
  };

  // Add specific terms based on copyright level
  switch (copyrightLevel) {
    case 'non_exclusive':
      terms.licenseType = 'Non-Exclusive License';
      terms.exclusivity = false;
      terms.resaleRights = false;
      terms.creditRequired = true;
      terms.royaltyShare = 0; // No royalty share for non-exclusive
      break;
      
    case 'exclusive':
      terms.licenseType = 'Exclusive License';
      terms.exclusivity = true;
      terms.resaleRights = false;
      terms.creditRequired = true;
      terms.royaltyShare = 0; // No royalty share for exclusive license
      break;
      
    case 'buyout':
      terms.licenseType = 'Complete Rights Transfer';
      terms.exclusivity = true;
      terms.resaleRights = true;
      terms.creditRequired = false; // Credit optional for buyout
      terms.royaltyShare = 0; // No royalty share for buyout
      break;
      
    case 'co_ownership':
      terms.licenseType = 'Co-Ownership Agreement';
      terms.exclusivity = true;
      terms.resaleRights = true;
      terms.creditRequired = true;
      terms.royaltyShare = 50; // 50/50 split for co-ownership
      break;
  }

  // Add project-specific terms
  switch (projectType) {
    case 'beat_licensing':
      terms.deliverables = ['Mixed and Mastered Beat', 'Trackouts/Stems'];
      terms.timeline = '3-5 business days';
      terms.revisions = 2;
      break;
      
    case 'custom_production':
      terms.deliverables = ['Custom Produced Track', 'Mixed and Mastered', 'Stems'];
      terms.timeline = '1-2 weeks';
      terms.revisions = 3;
      break;
      
    case 'collaboration':
      terms.deliverables = ['Collaborative Track', 'Mixed and Mastered', 'Stems'];
      terms.timeline = '2-4 weeks';
      terms.revisions = 5;
      break;
  }

  return terms;
};

/**
 * Verify ThriveCart webhook signature for security
 * @param {Object} webhookData - Webhook payload
 * @returns {Boolean} - Whether signature is valid
 */
const verifyWebhookSignature = (webhookData) => {
  // This would implement actual signature verification
  // using your ThriveCart webhook secret
  const webhookSecret = process.env.THRIVECART_WEBHOOK_SECRET;
  
  if (!webhookSecret) {
    console.warn('ThriveCart webhook secret not configured');
    return false;
  }
  
  // Implement signature verification logic here
  // This is a placeholder - actual implementation depends on ThriveCart's signature method
  return true;
};

/**
 * Send contract document to customer
 * @param {String} customerEmail - Customer email address
 * @param {Object} contractDocument - Generated contract document
 */
const sendContractToCustomer = async (customerEmail, contractDocument) => {
  // This would integrate with your email service (SendGrid, Mailchimp, etc.)
  const emailData = {
    to: customerEmail,
    subject: `Your Music Contract - ${contractDocument.projectType.replace('_', ' ').toUpperCase()}`,
    template: 'contract_delivery',
    data: {
      contractId: contractDocument.id,
      projectType: contractDocument.projectType,
      copyrightLevel: contractDocument.copyrightLevel,
      amountPaid: contractDocument.amountPaid,
      documentUrl: contractDocument.documentUrl,
      signatureUrl: contractDocument.signatureUrl
    }
  };
  
  // Send email (placeholder)
  console.log('Sending contract email:', emailData);
};

/**
 * Update customer record in CRM/Database
 * @param {Object} customerData - Customer data to update
 */
const updateCustomerRecord = async (customerData) => {
  // This would integrate with your CRM (HubSpot, Salesforce, etc.)
  console.log('Updating customer record:', customerData);
};

/**
 * Trigger workflow automation after contract purchase
 * @param {Object} workflowData - Workflow trigger data
 */
const triggerWorkflowAutomation = async (workflowData) => {
  // This could trigger various automations:
  // - Add customer to specific email sequences
  // - Create project in project management system
  // - Schedule follow-up tasks
  // - Update inventory/availability
  
  console.log('Triggering workflow automation:', workflowData);
};

export default {
  generateThriveCartCheckoutUrl,
  createOrderSummary,
  handlePaymentCompletion
};
