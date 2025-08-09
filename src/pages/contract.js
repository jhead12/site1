import React, { useState, useEffect } from 'react';
import { navigate } from 'gatsby';
import Layout from '../components/layout';
import {
  Container,
  Section,
  Box,
  Heading,
  Text,
  Flex,
  Button,
  Space
} from '../components/ui';
import SEOHead from '../components/head';

/**
 * Contract Generation Page
 * Generates personalized contracts based on beat purchase and license type
 */
const ContractPage = () => {
  const [contractData, setContractData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Get contract parameters from URL
    const urlParams = new URLSearchParams(window.location.search);
    const beatName = urlParams.get('beat_name');
    const licenseType = urlParams.get('license_type');
    const beatId = urlParams.get('beat_id');
    const purchaseId = urlParams.get('purchase_id');

    if (!beatName || !licenseType) {
      setError('Missing contract parameters. Please complete a purchase first.');
      setLoading(false);
      return;
    }

    // Generate contract data
    generateContract(beatName, licenseType, beatId, purchaseId);
  }, []);

  const generateContract = async (beatName, licenseType, beatId, purchaseId) => {
    try {
      setLoading(true);
      
      // Contract templates based on license type
      const contractTemplates = {
        basic: {
          title: 'Non-Exclusive Beat License Agreement',
          type: 'Non-Exclusive License',
          terms: [
            'This is a non-exclusive license agreement',
            'You may use this beat for commercial purposes',
            'Up to 10,000 streams/sales permitted',
            'Producer credit must be included as "Produced by J. Eldon"',
            'Beat may be licensed to other artists',
            'No resale or redistribution of the beat allowed'
          ],
          usage: 'Commercial use permitted with credit',
          distribution: 'Up to 10,000 copies',
          exclusivity: 'Non-exclusive',
          creditRequired: true
        },
        premium: {
          title: 'Premium License Agreement',
          type: 'Exclusive Licensing',
          terms: [
            'This is an exclusive licensing agreement for enhanced usage',
            'Extended commercial rights included',
            'Up to 100,000 streams/sales permitted',
            'Radio and TV sync rights included',
            'Producer credit must be included as "Produced by J. Eldon"',
            'Beat may be licensed to limited additional artists',
            'Priority support and mixing consultation included'
          ],
          usage: 'Extended commercial use with sync rights',
          distribution: 'Up to 100,000 copies',
          exclusivity: 'Limited exclusive',
          creditRequired: true
        },
        exclusive: {
          title: 'Exclusive Beat Ownership Agreement',
          type: 'Complete Buyout',
          terms: [
            'This is a complete exclusive buyout agreement',
            'Full ownership rights transferred to purchaser',
            'Unlimited commercial use and distribution',
            'Beat will be removed from all stores',
            'All stems, trackouts, and MIDI files included',
            'Producer credit is optional',
            'Custom mixing and mastering consultation included',
            'Beat cannot be sold or licensed to any other party'
          ],
          usage: 'Unlimited commercial use',
          distribution: 'Unlimited',
          exclusivity: 'Completely exclusive',
          creditRequired: false
        }
      };

      const template = contractTemplates[licenseType] || contractTemplates.basic;
      
      const contract = {
        id: purchaseId || `CONTRACT-${Date.now()}`,
        beatName,
        licenseType,
        beatId,
        purchaseDate: new Date().toLocaleDateString(),
        template,
        downloadUrl: `/api/generate-contract?id=${purchaseId || beatId}&type=${licenseType}`
      };

      setContractData(contract);
      setLoading(false);
    } catch (err) {
      setError('Failed to generate contract');
      setLoading(false);
    }
  };

  const downloadContract = () => {
    if (contractData) {
      // Generate downloadable contract
      const contractText = generateContractText(contractData);
      const blob = new Blob([contractText], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${contractData.beatName}-${contractData.licenseType}-contract.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const generateContractText = (data) => {
    return `
${data.template.title}
${'='.repeat(50)}

Beat: ${data.beatName}
License Type: ${data.template.type}
Purchase Date: ${data.purchaseDate}
Contract ID: ${data.id}

TERMS AND CONDITIONS:
${data.template.terms.map((term, index) => `${index + 1}. ${term}`).join('\n')}

LICENSE DETAILS:
- Usage Rights: ${data.template.usage}
- Distribution Limit: ${data.template.distribution}
- Exclusivity: ${data.template.exclusivity}
- Producer Credit Required: ${data.template.creditRequired ? 'Yes' : 'No'}

This contract is valid from the date of purchase and constitutes a legal agreement between the purchaser and J. Eldon Music.

Producer: J. Eldon
Website: https://jeldonmusic.com
Email: contact@jeldonmusic.com

Generated on: ${new Date().toLocaleString()}
    `.trim();
  };

  if (loading) {
    return (
      <Layout>
        <Section paddingY={5}>
          <Container>
            <Box textAlign="center" padding={6}>
              <Text fontSize={4}>Generating your contract...</Text>
            </Box>
          </Container>
        </Section>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <Section paddingY={5}>
          <Container>
            <Box textAlign="center" padding={6}>
              <Heading as="h1" variant="display" marginBottom={4} style={{ color: '#dc2626' }}>
                Contract Error
              </Heading>
              <Text fontSize={3} marginBottom={4} style={{ color: '#6b7280' }}>
                {error}
              </Text>
              <Button
                onClick={() => navigate('/beats')}
                style={{
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Browse Beats
              </Button>
            </Box>
          </Container>
        </Section>
      </Layout>
    );
  }

  return (
    <Layout>
      <Section paddingY={5} style={{ backgroundColor: '#f9fafb', minHeight: '100vh' }}>
        <Container>
          {/* Contract Header */}
          <Box marginBottom={6} padding={5} backgroundColor="white" borderRadius={3} boxShadow="medium">
            <Heading as="h1" variant="display" marginBottom={4} style={{ color: '#111827' }}>
              Your Beat License Contract
            </Heading>
            
            <Flex gap={4} marginBottom={4}>
              <Box>
                <Text fontSize={1} style={{ color: '#9ca3af' }}>Beat</Text>
                <Text fontWeight="bold" style={{ color: '#374151' }}>
                  {contractData.beatName}
                </Text>
              </Box>
              <Box>
                <Text fontSize={1} style={{ color: '#9ca3af' }}>License Type</Text>
                <Text fontWeight="bold" style={{ color: '#374151' }}>
                  {contractData.template.type}
                </Text>
              </Box>
              <Box>
                <Text fontSize={1} style={{ color: '#9ca3af' }}>Purchase Date</Text>
                <Text fontWeight="bold" style={{ color: '#374151' }}>
                  {contractData.purchaseDate}
                </Text>
              </Box>
              <Box>
                <Text fontSize={1} style={{ color: '#9ca3af' }}>Contract ID</Text>
                <Text fontWeight="bold" style={{ color: '#374151' }}>
                  {contractData.id}
                </Text>
              </Box>
            </Flex>
          </Box>

          {/* Contract Terms */}
          <Box marginBottom={6} padding={5} backgroundColor="white" borderRadius={3} boxShadow="medium">
            <Heading as="h2" variant="subheadLarge" marginBottom={4} style={{ color: '#111827' }}>
              License Terms & Conditions
            </Heading>
            
            <Box as="ol" style={{ paddingLeft: '20px' }}>
              {contractData.template.terms.map((term, index) => (
                <Box as="li" key={index} marginBottom={2}>
                  <Text style={{ color: '#374151', lineHeight: '1.6' }}>{term}</Text>
                </Box>
              ))}
            </Box>
          </Box>

          {/* License Details */}
          <Box marginBottom={6} padding={5} backgroundColor="white" borderRadius={3} boxShadow="medium">
            <Heading as="h2" variant="subheadLarge" marginBottom={4} style={{ color: '#111827' }}>
              License Details
            </Heading>
            
            <Box
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1.5rem'
              }}
            >
              <Box>
                <Text fontSize={1} style={{ color: '#9ca3af', marginBottom: '4px' }}>Usage Rights</Text>
                <Text fontWeight="bold" style={{ color: '#374151' }}>
                  {contractData.template.usage}
                </Text>
              </Box>
              <Box>
                <Text fontSize={1} style={{ color: '#9ca3af', marginBottom: '4px' }}>Distribution Limit</Text>
                <Text fontWeight="bold" style={{ color: '#374151' }}>
                  {contractData.template.distribution}
                </Text>
              </Box>
              <Box>
                <Text fontSize={1} style={{ color: '#9ca3af', marginBottom: '4px' }}>Exclusivity</Text>
                <Text fontWeight="bold" style={{ color: '#374151' }}>
                  {contractData.template.exclusivity}
                </Text>
              </Box>
              <Box>
                <Text fontSize={1} style={{ color: '#9ca3af', marginBottom: '4px' }}>Producer Credit</Text>
                <Text fontWeight="bold" style={{ color: '#374151' }}>
                  {contractData.template.creditRequired ? 'Required' : 'Optional'}
                </Text>
              </Box>
            </Box>
          </Box>

          {/* Download Section */}
          <Box padding={5} backgroundColor="white" borderRadius={3} boxShadow="medium">
            <Flex justifyContent="space-between" alignItems="center">
              <Box>
                <Text fontSize={4} fontWeight="bold" style={{ color: '#111827', marginBottom: '8px' }}>
                  Download Your Contract
                </Text>
                <Text style={{ color: '#6b7280' }}>
                  Save this contract for your records and legal protection
                </Text>
              </Box>
              
              <Button
                onClick={downloadContract}
                style={{
                  backgroundColor: '#059669',
                  color: 'white',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                Download Contract
              </Button>
            </Flex>
          </Box>

          {/* Footer */}
          <Box marginTop={6} textAlign="center">
            <Text fontSize={2} style={{ color: '#6b7280' }}>
              Questions about your contract? Contact us at{' '}
              <a href="mailto:contact@jeldonmusic.com" style={{ color: '#3b82f6' }}>
                contact@jeldonmusic.com
              </a>
            </Text>
          </Box>
        </Container>
      </Section>
    </Layout>
  );
};

export default ContractPage;

export const Head = () => (
  <SEOHead 
    title="Beat License Contract - J. Eldon Music"
    description="Download your personalized beat license contract with full terms and conditions."
  />
);
