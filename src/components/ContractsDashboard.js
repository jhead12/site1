import React, { useState, useEffect } from 'react';
import DemoThriveCartContractsService from '../services/demoThriveCartContracts';
import { generateContractFromTemplate, getAvailableTemplates } from '../utils/contract-templates';

/**
 * Contract Creation Component
 * Allows creation of different types of music industry contracts
 */
const ContractCreationForm = ({ onContractCreated }) => {
  const [formData, setFormData] = useState({
    contractType: 'exclusive_licensing',
    partnerName: '',
    partnerEmail: '',
    businessName: '',
    revenueShare: 50,
    productIds: [],
    startDate: '',
    endDate: '',
    paymentMethod: 'automatic',
    // Producer Agreement specific fields
    artistName: '',
    trackTitle: '',
    governingState: '',
    county: '',
    musicOwnership: '',
    lyricsOwnership: '',
    producerAddress: '',
    paymentAmountWords: ''
  });
  const [loading, setLoading] = useState(false);
  const [contractsService] = useState(new DemoThriveCartContractsService());
  const [showPreview, setShowPreview] = useState(false);
  const [previewContract, setPreviewContract] = useState(null);

  // Download helper functions
  const downloadAsText = (content, filename) => {
    const element = document.createElement('a');
    const file = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const downloadAsRTF = (content, filename) => {
    // Convert plain text to RTF format
    const rtfHeader = '{\\rtf1\\ansi\\deff0 {\\fonttbl {\\f0 Times New Roman;}}';
    const rtfFooter = '}';
    
    // Clean and format content for RTF
    const rtfContent = content
      .replace(/\n/g, '\\par ')
      .replace(/\t/g, '\\tab ')
      .replace(/[{}\\]/g, '\\$&');
    
    const rtfDocument = `${rtfHeader}\\f0\\fs24 ${rtfContent}${rtfFooter}`;
    
    const element = document.createElement('a');
    const file = new Blob([rtfDocument], { type: 'application/rtf' });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const downloadAsHTML = (content, title, filename) => {
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        body {
            font-family: 'Times New Roman', serif;
            font-size: 12pt;
            line-height: 1.6;
            max-width: 8.5in;
            margin: 1in auto;
            padding: 0.5in;
            background: white;
            color: black;
        }
        .header {
            text-align: center;
            font-weight: bold;
            font-size: 16pt;
            margin-bottom: 20px;
            text-transform: uppercase;
        }
        .section {
            margin-bottom: 15px;
        }
        .signature-line {
            border-bottom: 1px solid black;
            width: 200px;
            display: inline-block;
            margin: 20px 10px 5px 0;
        }
        @media print {
            body { margin: 0; }
            .no-print { display: none; }
        }
    </style>
</head>
<body>
    <div class="no-print" style="text-align: center; margin-bottom: 20px; padding: 10px; background: #f0f0f0; border: 1px solid #ccc;">
        <p><strong>Contract Document</strong> - Generated on ${new Date().toLocaleDateString()}</p>
        <button onclick="window.print()" style="padding: 8px 16px; background: #007cba; color: white; border: none; border-radius: 4px; cursor: pointer;">Print Contract</button>
    </div>
    
    <div class="contract-content">
        ${content.replace(/\n/g, '<br>').replace(/^([A-Z][A-Z\s]*:?\s*$)/gm, '<div class="section"><strong>$1</strong></div>')}
    </div>
</body>
</html>`;

    const element = document.createElement('a');
    const file = new Blob([htmlContent], { type: 'text/html' });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const generateFilename = (contractType, clientName, extension) => {
    const date = new Date().toISOString().split('T')[0];
    const sanitizedClient = (clientName || 'Client').replace(/[^a-zA-Z0-9]/g, '_');
    const sanitizedType = contractType.replace(/[^a-zA-Z0-9]/g, '_');
    return `${sanitizedType}_${sanitizedClient}_${date}.${extension}`;
  };

  // Map UI contract types to template keys
  const getTemplateKeyFromContractType = (contractType) => {
    const mapping = {
      'copyright_transfer': 'buyout',
      'exclusive_licensing': 'exclusive', 
      'collaboration': 'co_ownership',
      'producer_deal': 'non_exclusive',
      'producer_agreement': 'producer_agreement',
      'distribution_deal': 'exclusive'
    };
    return mapping[contractType] || 'non_exclusive';
  };

  const contractTypes = {
    'copyright_transfer': 'Copyright Ownership Transfer',
    'exclusive_licensing': 'Exclusive Licensing Agreement', 
    'collaboration': 'Music Collaboration Agreement',
    'producer_deal': 'Producer Partnership Deal',
    'producer_agreement': 'Producer Agreement (Work for Hire)',
    'distribution_deal': 'Distribution Partnership'
  };

  const productOptions = {
    [process.env.GATSBY_THRIVECART_BEAT_BASIC_ID]: 'Basic Beat License ($50)',
    [process.env.GATSBY_THRIVECART_BEAT_PREMIUM_ID]: 'Premium Beat License ($150)',
    [process.env.GATSBY_THRIVECART_BEAT_EXCLUSIVE_ID]: 'Exclusive Beat License ($1000)',
    [process.env.GATSBY_THRIVECART_BEAT_PACK_ID]: 'Beat Pack Bundle ($200)',
    [process.env.GATSBY_THRIVECART_MASTERCLASS_ID]: 'Producer Masterclass ($600)'
  };

  // Validation function for contract data
  const validateContractData = (data) => {
    const errors = [];

    if (!data.partnerName.trim()) errors.push('Partner name is required');
    if (!data.partnerEmail.trim()) errors.push('Partner email is required');
    if (!data.contractType) errors.push('Contract type is required');

    // Producer agreement specific validation
    if (data.contractType === 'producer_agreement') {
      if (!data.artistName?.trim()) errors.push('Artist name is required for producer agreements');
      if (!data.trackTitle?.trim()) errors.push('Track title is required for producer agreements');
      if (!data.governingState?.trim()) errors.push('Governing state is required for producer agreements');
      if (!data.county?.trim()) errors.push('County is required for producer agreements');
      if (!data.musicOwnership?.trim()) errors.push('Music ownership details are required');
      if (!data.lyricsOwnership?.trim()) errors.push('Lyrics ownership details are required');
      if (!data.producerAddress?.trim()) errors.push('Producer address is required');
      if (!data.paymentAmountWords?.trim()) errors.push('Payment amount in words is required');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  };

  const handlePreviewContract = async () => {
    try {
      // Map form contract type to template key
      const templateKey = getTemplateKeyFromContractType(formData.contractType);
      
      // Generate preview contract
      const generated = generateContractFromTemplate(templateKey, formData);
      
      setPreviewContract({
        type: contractTypes[formData.contractType] || formData.contractType,
        clientName: formData.partnerName || 'Client',
        content: generated.content,
        disclaimer: generated.disclaimer,
        title: generated.title
      });
      setShowPreview(true);
    } catch (error) {
      console.error('Preview error:', error);
      alert('Failed to generate contract preview');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate and generate final contract
      const validation = validateContractData(formData);
      if (!validation.isValid) {
        alert(`Validation Error: ${validation.errors.join(', ')}`);
        setLoading(false);
        return;
      }

      // Map contract type to template key
      const templateKey = getTemplateKeyFromContractType(formData.contractType);
      const contractResult = generateContractFromTemplate(templateKey, formData);
      if (!contractResult.success) {
        alert(`Contract Generation Error: ${contractResult.error}`);
        setLoading(false);
        return;
      }
      const contract = await contractsService.createMusicIndustryContract(
        formData.contractType,
        {
          partnerName: formData.partnerName,
          partnerEmail: formData.partnerEmail,
          businessName: formData.businessName,
          productIds: formData.productIds
        },
        {
          revenueShare: formData.revenueShare,
          startDate: formData.startDate || null,
          endDate: formData.endDate || null,
          paymentMethod: formData.paymentMethod
        }
      );

      onContractCreated && onContractCreated(contract);
      
      // Reset form
      setFormData({
        contractType: 'exclusive_licensing',
        partnerName: '',
        partnerEmail: '',
        businessName: '',
        revenueShare: 50,
        productIds: [],
        startDate: '',
        endDate: '',
        paymentMethod: 'automatic',
        // Producer Agreement specific fields
        artistName: '',
        trackTitle: '',
        governingState: '',
        county: '',
        musicOwnership: '',
        lyricsOwnership: '',
        producerAddress: '',
        paymentAmountWords: ''
      });

      alert('Contract created successfully! Your partner will receive an email to review and accept the contract.');
    } catch (error) {
      console.error('Error creating contract:', error);
      alert('Error creating contract. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleProductToggle = (productId) => {
    setFormData(prev => ({
      ...prev,
      productIds: prev.productIds.includes(productId)
        ? prev.productIds.filter(id => id !== productId)
        : [...prev.productIds, productId]
    }));
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Contract</h2>
      
      {/* Legal Disclaimer */}
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">
              Legal Disclaimer
            </h3>
            <div className="mt-2 text-sm text-yellow-700">
              <p>
                Users of these templates are advised to do their own due diligence when it comes to making business decisions. 
                All information, products or services should be independently verified by your own qualified professionals. 
                These contracts are governed by the laws of different states, provinces, and countries. 
                We recommend seeking out an attorney to make sure these contracts conform for your use.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Contract Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Contract Type
          </label>
          <select
            value={formData.contractType}
            onChange={(e) => setFormData(prev => ({ ...prev, contractType: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            {Object.entries(contractTypes).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>

        {/* Partner Information */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Partner Name
            </label>
            <input
              type="text"
              value={formData.partnerName}
              onChange={(e) => setFormData(prev => ({ ...prev, partnerName: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              onChange={(e) => setFormData(prev => ({ ...prev, partnerEmail: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Business Name (Optional)
          </label>
          <input
            type="text"
            value={formData.businessName}
            onChange={(e) => setFormData(prev => ({ ...prev, businessName: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Producer Agreement Specific Fields */}
        {formData.contractType === 'producer_agreement' && (
          <div className="bg-blue-50 p-6 rounded-lg space-y-4">
            <h3 className="text-lg font-medium text-blue-900 mb-4">Producer Agreement Details</h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Artist Name
                </label>
                <input
                  type="text"
                  value={formData.artistName || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, artistName: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Name of the recording artist"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Track/Song Title
                </label>
                <input
                  type="text"
                  value={formData.trackTitle || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, trackTitle: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Title of the track to be produced"
                  required
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Governing State/Province
                </label>
                <input
                  type="text"
                  value={formData.governingState || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, governingState: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., California, New York"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  County for Legal Jurisdiction
                </label>
                <input
                  type="text"
                  value={formData.county || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, county: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Los Angeles, Nassau"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Music Ownership Details
              </label>
              <input
                type="text"
                value={formData.musicOwnership || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, musicOwnership: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., J. Eldon Music (100%) or split ownership details"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lyrics Ownership Details
              </label>
              <input
                type="text"
                value={formData.lyricsOwnership || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, lyricsOwnership: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Client Name (100%) or To Be Determined"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Producer Address
              </label>
              <textarea
                value={formData.producerAddress || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, producerAddress: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
                placeholder="Full address of J. Eldon Music"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Amount (in words)
              </label>
              <input
                type="text"
                value={formData.paymentAmountWords || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, paymentAmountWords: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., One Thousand Five Hundred"
                required
              />
            </div>
          </div>
        )}

        {/* Product Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Products Included in Contract
          </label>
          <div className="space-y-2">
            {Object.entries(productOptions).map(([productId, label]) => (
              <label key={productId} className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.productIds.includes(productId)}
                  onChange={() => handleProductToggle(productId)}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">{label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Revenue Share */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Revenue Share Percentage
          </label>
          <div className="flex items-center space-x-4">
            <input
              type="range"
              min="0"
              max="100"
              value={formData.revenueShare}
              onChange={(e) => setFormData(prev => ({ ...prev, revenueShare: parseInt(e.target.value) }))}
              className="flex-1"
            />
            <span className="text-lg font-medium text-blue-600">
              {formData.revenueShare}%
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Percentage of revenue the partner will receive
          </p>
        </div>

        {/* Contract Duration */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Date (Optional)
            </label>
            <input
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              End Date (Optional)
            </label>
            <input
              type="date"
              value={formData.endDate}
              onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Payment Method */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Payment Method
          </label>
          <select
            value={formData.paymentMethod}
            onChange={(e) => setFormData(prev => ({ ...prev, paymentMethod: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="automatic">Automatic (PayPal)</option>
            <option value="manual">Manual Payment</option>
          </select>
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-4">
          <button
            type="button"
            onClick={handlePreviewContract}
            disabled={loading || formData.productIds.length === 0}
            className={`flex-1 py-3 px-4 rounded-md font-medium text-white ${
              loading || formData.productIds.length === 0
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
            }`}
          >
            Preview Contract
          </button>
          <button
            type="submit"
            disabled={loading || formData.productIds.length === 0}
            className={`flex-1 py-3 px-4 rounded-md font-medium text-white ${
              loading || formData.productIds.length === 0
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500'
            }`}
          >
            {loading ? 'Creating Contract...' : 'Create Contract'}
          </button>
        </div>
      </form>

      {/* Contract Type Information */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-medium text-gray-900 mb-2">Contract Type Information:</h3>
        <div className="text-sm text-gray-600">
          {formData.contractType === 'copyright_transfer' && (
            <p>Complete copyright ownership will transfer to the partner upon payment completion.</p>
          )}
          {formData.contractType === 'exclusive_licensing' && (
            <p>Exclusive licensing rights with ongoing revenue sharing arrangement.</p>
          )}
          {formData.contractType === 'collaboration' && (
            <p>Joint collaboration agreement with shared ownership and credits.</p>
          )}
          {formData.contractType === 'producer_deal' && (
            <p>Producer services partnership with revenue participation.</p>
          )}
          {formData.contractType === 'distribution_deal' && (
            <p>Distribution partnership with revenue sharing from sales.</p>
          )}
        </div>
      </div>

      {/* Contract Preview Modal */}
      {showPreview && previewContract && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] w-full overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-xl font-semibold text-gray-900">Contract Preview</h3>
              <button
                onClick={() => setShowPreview(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[70vh]">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Contract Details:</h4>
                <div className="text-sm text-gray-600 mb-4">
                  <p><strong>Type:</strong> {previewContract.type}</p>
                  <p><strong>Client:</strong> {previewContract.clientName}</p>
                  <p><strong>Generated:</strong> {new Date().toLocaleDateString()}</p>
                </div>
                <div className="text-xs text-blue-600 bg-blue-50 p-2 rounded border">
                  <strong>💡 Download Options:</strong> Text (.txt), HTML (.html with print styling), or RTF (.rtf for Word processing)
                </div>
              </div>
              <div className="mt-6">
                <h4 className="font-medium text-gray-900 mb-4">Contract Content:</h4>
                <div className="bg-white border rounded-lg p-6 text-sm leading-relaxed whitespace-pre-line">
                  {previewContract.content}
                </div>
                
                {/* Legal Disclaimer for Downloads */}
                {previewContract.disclaimer && (
                  <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <h5 className="font-medium text-yellow-800 mb-2">⚠️ Legal Disclaimer</h5>
                    <div className="text-xs text-yellow-700 leading-relaxed">
                      {previewContract.disclaimer}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-between items-start gap-4 p-6 border-t bg-gray-50">
              {/* Download Options */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => downloadAsText(
                    previewContract.content, 
                    generateFilename(previewContract.type, previewContract.clientName, 'txt')
                  )}
                  className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <span>📄</span> Download Text
                </button>
                <button
                  onClick={() => downloadAsHTML(
                    previewContract.content, 
                    previewContract.type,
                    generateFilename(previewContract.type, previewContract.clientName, 'html')
                  )}
                  className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                  <span>🌐</span> Download HTML
                </button>
                <button
                  onClick={() => downloadAsRTF(
                    previewContract.content, 
                    generateFilename(previewContract.type, previewContract.clientName, 'rtf')
                  )}
                  className="bg-purple-600 text-white px-4 py-2 rounded text-sm hover:bg-purple-700 transition-colors flex items-center gap-2"
                >
                  <span>📝</span> Download RTF
                </button>
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={() => setShowPreview(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Close Preview
                </button>
                <button
                  onClick={() => {
                    setShowPreview(false);
                    // Trigger the actual form submission
                    document.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
                  }}
                  className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition-colors"
                >
                  Create This Contract
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Contract List Component
 * Displays and manages existing contracts
 */
const ContractsList = () => {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [contractsService] = useState(new DemoThriveCartContractsService());

  useEffect(() => {
    loadContracts();
  }, [filter]);

  const loadContracts = async () => {
    try {
      setLoading(true);
      const filterParams = filter !== 'all' ? { status: filter } : {};
      const contractsData = await contractsService.listContracts(filterParams);
      setContracts(contractsData.contracts || []);
    } catch (error) {
      console.error('Error loading contracts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelContract = async (contractId) => {
    if (window.confirm('Are you sure you want to cancel this contract?')) {
      try {
        await contractsService.cancelContract(contractId, 'Cancelled by user');
        loadContracts(); // Reload contracts
        alert('Contract cancelled successfully');
      } catch (error) {
        console.error('Error cancelling contract:', error);
        alert('Error cancelling contract');
      }
    }
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'active': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800',
      'expired': 'bg-gray-100 text-gray-800'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyles[status] || statusStyles.pending}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Contracts</h2>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Contracts</option>
          <option value="pending">Pending</option>
          <option value="active">Active</option>
          <option value="cancelled">Cancelled</option>
          <option value="expired">Expired</option>
        </select>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="text-gray-500">Loading contracts...</div>
        </div>
      ) : contracts.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-gray-500">No contracts found</div>
        </div>
      ) : (
        <div className="space-y-4">
          {contracts.map((contract) => (
            <div key={contract.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-medium text-gray-900">{contract.name}</h3>
                  <p className="text-sm text-gray-600">Partner: {contract.partner.name}</p>
                </div>
                {getStatusBadge(contract.status)}
              </div>
              
              <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600 mb-3">
                <div>Revenue Share: {contract.revenue_share}%</div>
                <div>Products: {contract.products.length}</div>
                <div>Payment: {contract.payment_method}</div>
              </div>

              <div className="flex space-x-2">
                <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200">
                  View Details
                </button>
                {contract.status === 'pending' && (
                  <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200">
                    Edit
                  </button>
                )}
                {(contract.status === 'pending' || contract.status === 'active') && (
                  <button 
                    onClick={() => handleCancelContract(contract.id)}
                    className="px-3 py-1 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/**
 * Main Contracts Dashboard Component
 */
const ContractsDashboard = () => {
  const [activeTab, setActiveTab] = useState('list');

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            ThriveCart Contracts Dashboard
          </h1>
          <p className="text-gray-600">
            Manage exclusive release deals, copyright transfers, and revenue sharing agreements
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-4 mb-8">
          <button
            onClick={() => setActiveTab('list')}
            className={`px-4 py-2 rounded-lg font-medium ${
              activeTab === 'list'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Contracts
          </button>
          <button
            onClick={() => setActiveTab('create')}
            className={`px-4 py-2 rounded-lg font-medium ${
              activeTab === 'create'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Create Contract
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'list' && <ContractsList />}
        {activeTab === 'create' && (
          <ContractCreationForm 
            onContractCreated={() => setActiveTab('list')}
          />
        )}
      </div>
    </div>
  );
};

export { ContractCreationForm, ContractsList, ContractsDashboard };
export default ContractsDashboard;
