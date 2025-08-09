import crypto from 'crypto';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const webhookSecret = process.env.THRIVECART_WEBHOOK_SECRET;
    const signature = req.headers['x-thrivecart-signature'];
    const payload = JSON.stringify(req.body);

    // Verify webhook signature (when secret is available)
    if (webhookSecret && webhookSecret !== 'your_thrivecart_webhook_secret') {
      const expectedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(payload)
        .digest('hex');

      if (signature !== expectedSignature) {
        console.error('ThriveCart webhook signature verification failed');
        return res.status(401).json({ message: 'Unauthorized' });
      }
    }

    const { event_type, customer, product, order } = req.body;

    console.log('ThriveCart Webhook Event:', {
      event_type,
      customer_email: customer?.email,
      product_id: product?.id,
      order_id: order?.id,
    });

    // Handle different event types
    switch (event_type) {
      case 'order.success':
        await handleOrderSuccess(customer, product, order);
        break;
      case 'order.refund':
        await handleOrderRefund(customer, product, order);
        break;
      case 'subscription.created':
        await handleSubscriptionCreated(customer, product, order);
        break;
      case 'subscription.cancelled':
        await handleSubscriptionCancelled(customer, product, order);
        break;
      default:
        console.log('Unhandled event type:', event_type);
    }

    return res.status(200).json({ message: 'Webhook processed successfully' });
  } catch (error) {
    console.error('ThriveCart webhook error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

async function handleOrderSuccess(customer, product, order) {
  console.log('Processing successful order:', {
    customer: customer.email,
    product: product.name,
    amount: order.total,
  });

  // TODO: Implement order success logic
  // - Send confirmation email
  // - Grant access to digital products
  // - Update customer database
  // - Trigger fulfillment process
}

async function handleOrderRefund(customer, product, order) {
  console.log('Processing refund:', {
    customer: customer.email,
    product: product.name,
    refund_amount: order.refunded_amount,
  });

  // TODO: Implement refund logic
  // - Revoke access to digital products
  // - Update customer status
  // - Send refund notification
}

async function handleSubscriptionCreated(customer, product, order) {
  console.log('Processing new subscription:', {
    customer: customer.email,
    product: product.name,
    subscription_id: order.subscription_id,
  });

  // TODO: Implement subscription logic
  // - Set up recurring access
  // - Send welcome series
  // - Add to subscription management
}

async function handleSubscriptionCancelled(customer, product, order) {
  console.log('Processing subscription cancellation:', {
    customer: customer.email,
    product: product.name,
    subscription_id: order.subscription_id,
  });

  // TODO: Implement cancellation logic
  // - Schedule access revocation
  // - Send cancellation confirmation
  // - Update billing status
}
