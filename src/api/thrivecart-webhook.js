/**
 * ThriveCart Webhook Handler (Gatsby Function)
 * Processes incoming ThriveCart webhooks and stores order data
 */

import { processThriveCartWebhook } from '../services/thrivecart-api';

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed'
    });
  }

  try {
    console.log('ThriveCart webhook received:', req.body);
    
    // Get signature from headers
    const signature = req.headers['x-tc-signature'] || req.headers['x-thrivecart-signature'];
    
    // Process the webhook
    const result = processThriveCartWebhook(req.body, signature);
    
    if (!result.success) {
      console.error('Webhook processing failed:', result.error);
      return res.status(400).json(result);
    }

    console.log('Webhook processed successfully:', result.message);
    
    return res.status(200).json({
      success: true,
      message: 'Webhook processed successfully',
      data: result
    });
    
  } catch (error) {
    console.error('Webhook handler error:', error);
    
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
}
