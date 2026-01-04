# Live Chat & Amazon Connect Setup Guide

This guide walks you through setting up live chat (Tawk.to) and Amazon Connect click-to-call on your Jeldon Music website.

---

## Quick Start

### 1. Tawk.to Live Chat (5 minutes)

1. **Create Account**: Go to [tawk.to](https://www.tawk.to) and sign up (free)

2. **Get Your Widget Code**: 
   - Dashboard → Administration → Chat Widget → Direct Chat Link
   - Your URL looks like: `https://tawk.to/chat/PROPERTY_ID/WIDGET_ID`
   - Copy the `PROPERTY_ID` and `WIDGET_ID`

3. **Add to Environment**:
   ```bash
   # In your .env.development or .env.production
   GATSBY_TAWKTO_PROPERTY_ID="your_property_id_here"
   GATSBY_TAWKTO_WIDGET_ID="default"  # or your widget ID
   ```

4. **Install Mobile App** (for instant alerts):
   - Download "Tawk.to" from App Store / Google Play
   - Login with your account
   - Enable push notifications

5. **Configure Notifications**:
   - Dashboard → Administration → Triggers → New Trigger
   - Add triggers for "New Chat Started", "Offline Messages"
   - Enable Email notifications in Settings

### 2. Amazon Connect Click-to-Call

#### Option A: Simple Phone Link (Recommended to start)

Just add your phone number to the environment:

```bash
GATSBY_AMAZON_CONNECT_PHONE_NUMBER="+1234567890"
```

Then add the button to any page:

```jsx
import { AmazonConnectButton } from '../components/LiveChat';

const ContactPage = () => (
  <div>
    <h1>Contact Us</h1>
    <AmazonConnectButton 
      phoneNumber="+1234567890"
      buttonText="Call Now"
    />
  </div>
);
```

#### Option B: Full Amazon Connect Setup

1. **Create Amazon Connect Instance**:
   - Go to [AWS Console → Amazon Connect](https://console.aws.amazon.com/connect)
   - Click "Add an instance"
   - Choose identity management (Amazon Connect or existing directory)
   - Set up admin account
   - Enable data streaming if needed

2. **Claim a Phone Number**:
   - In your Connect instance, go to Channels → Phone numbers
   - Claim a DID or toll-free number
   - Associate with a contact flow

3. **Create Contact Flow**:
   - Go to Routing → Contact flows
   - Create a new flow for inbound calls
   - Add greeting, queue, and disconnect blocks
   - Publish the flow

4. **Set Environment Variables**:
   ```bash
   GATSBY_AMAZON_CONNECT_INSTANCE_ID="your-instance-id"
   GATSBY_AMAZON_CONNECT_CONTACT_FLOW_ID="your-flow-id"
   GATSBY_AMAZON_CONNECT_PHONE_NUMBER="+1xxxxxxxxxx"
   GATSBY_AMAZON_CONNECT_REGION="us-east-1"
   ```

5. **For Outbound Calls (Callback)**:
   You'll need a backend endpoint that calls:
   ```javascript
   const AWS = require('aws-sdk');
   const connect = new AWS.Connect({ region: 'us-east-1' });

   await connect.startOutboundVoiceContact({
     DestinationPhoneNumber: customerPhone,
     ContactFlowId: process.env.CONTACT_FLOW_ID,
     InstanceId: process.env.CONNECT_INSTANCE_ID,
     SourcePhoneNumber: process.env.CONNECT_PHONE_NUMBER
   }).promise();
   ```

---

## Using the Components

### Tawk.to API (Programmatic Control)

```jsx
import { TawkToAPI } from '../components/LiveChat';

// Open chat programmatically
<button onClick={() => TawkToAPI.maximize()}>
  Chat with us
</button>

// Set visitor info (for logged-in users)
TawkToAPI.setAttributes({
  name: 'John Doe',
  email: 'john@example.com',
  userId: '12345'
});

// Track custom events
TawkToAPI.addEvent('viewed_product', {
  productId: 'beat-123',
  productName: 'Summer Vibes Beat'
});
```

### Amazon Connect Button

```jsx
import { AmazonConnectButton } from '../components/LiveChat';

// Basic usage
<AmazonConnectButton />

// With customization
<AmazonConnectButton 
  buttonText="Call Now"
  callbackText="Request Callback"
  showCallbackForm={true}
  style={{ bottom: '150px' }}  // Move above Tawk.to
/>

// Direct call only (no callback form)
<AmazonConnectButton 
  phoneNumber="+1234567890"
  showCallbackForm={false}
/>
```

---

## Notification Channels

### Email Alerts
- **Tawk.to**: Settings → Notifications → Enable email for offline messages
- **Callback Form**: Configure `GATSBY_CALLBACK_WEBHOOK_URL` to send to email service

### Slack Integration
1. Create a Slack webhook: https://api.slack.com/messaging/webhooks
2. In Tawk.to: Settings → Integrations → Slack
3. Or use Zapier: Tawk.to trigger → Slack action

### Mobile Push
- Install Tawk.to mobile app and enable push notifications
- All new chats will trigger instant alerts

---

## Troubleshooting

### Chat widget not appearing
1. Check browser console for errors
2. Verify `GATSBY_TAWKTO_PROPERTY_ID` is set correctly
3. Ensure the site is rebuilt after adding env vars: `gatsby clean && gatsby develop`

### Amazon Connect calls not working
1. Verify IAM permissions include `connect:StartOutboundVoiceContact`
2. Check that the phone number is claimed and associated with a flow
3. Ensure the contact flow is published

### Callback form not submitting
1. Set `GATSBY_CALLBACK_WEBHOOK_URL` in environment
2. Or the form will fall back to opening the email client

---

## Security Notes

⚠️ **Never commit credentials to git**

The `.gitignore` has been updated to exclude:
- `IAM User/` folder
- `*.credentials.csv` files
- All `.env*` files (except `.env.EXAMPLE`)

For production, use:
- AWS Secrets Manager or Parameter Store for Connect credentials
- Environment variables in Netlify/Vercel dashboard
- Tawk.to credentials via their dashboard (no sensitive keys needed client-side)

---

## Cost Estimates

| Service | Cost |
|---------|------|
| Tawk.to | Free (unlimited) |
| Tawk.to (remove branding) | $19/month |
| Amazon Connect | $0.018/min inbound, $0.018/min outbound + phone number fees |
| DID Number | ~$0.06/day |
| Toll-free Number | ~$0.06/day + $0.06/min |

---

## Next Steps

1. [ ] Sign up at [tawk.to](https://www.tawk.to) and get your Property ID
2. [ ] Add `GATSBY_TAWKTO_PROPERTY_ID` to `.env.development`
3. [ ] Install Tawk.to mobile app for instant alerts
4. [ ] (Optional) Set up Amazon Connect for phone calls
5. [ ] Add `<AmazonConnectButton />` to your layout or contact page
