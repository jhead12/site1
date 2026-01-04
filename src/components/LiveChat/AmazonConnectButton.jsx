import React, { useState, useCallback } from 'react';

/**
 * Amazon Connect Click-to-Call Button
 * 
 * This component provides a button that allows visitors to request a callback
 * or initiate a call through Amazon Connect.
 * 
 * Setup Requirements:
 * 1. Create an Amazon Connect instance in AWS Console
 * 2. Claim a phone number in Amazon Connect
 * 3. Create a contact flow for inbound/outbound calls
 * 4. Set up the environment variables in .env
 * 
 * For full WebRTC browser calling, you'll need:
 * - Amazon Connect Streams API
 * - A backend to generate Connect tokens
 * - SSL/HTTPS on your site
 */

const AmazonConnectButton = ({ 
  buttonText = "Call Us",
  callbackText = "Request Callback",
  phoneNumber = process.env.GATSBY_AMAZON_CONNECT_PHONE_NUMBER,
  showCallbackForm = true,
  className = "",
  style = {}
}) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  // Simple tel: link for direct calling (works on mobile)
  const handleDirectCall = useCallback(() => {
    if (phoneNumber) {
      window.location.href = `tel:${phoneNumber}`;
    }
  }, [phoneNumber]);

  // Handle callback form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Option 1: Send to your backend which calls Amazon Connect StartOutboundVoiceContact
      // Option 2: Send to a webhook (Zapier, n8n, etc.) that triggers the call
      // Option 3: Store in a database/email for manual callback
      
      // For now, we'll use a simple webhook approach
      // Replace with your actual endpoint
      const webhookUrl = process.env.GATSBY_CALLBACK_WEBHOOK_URL;
      
      if (webhookUrl) {
        await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'callback_request',
            name: formData.name,
            phone: formData.phone,
            message: formData.message,
            timestamp: new Date().toISOString(),
            source: window.location.href
          })
        });
      }

      // Also trigger Tawk.to notification if available
      if (typeof window !== 'undefined' && window.Tawk_API) {
        window.Tawk_API.addEvent('callback_requested', {
          name: formData.name,
          phone: formData.phone
        });
      }

      setSubmitted(true);
    } catch (error) {
      console.error('Callback request failed:', error);
      // Fallback: open email client
      const subject = encodeURIComponent('Callback Request');
      const body = encodeURIComponent(
        `Name: ${formData.name}\nPhone: ${formData.phone}\nMessage: ${formData.message}`
      );
      window.location.href = `mailto:?subject=${subject}&body=${body}`;
    } finally {
      setLoading(false);
    }
  };

  const defaultStyles = {
    container: {
      position: 'fixed',
      bottom: '100px',
      right: '20px',
      zIndex: 9998,
      fontFamily: 'system-ui, -apple-system, sans-serif',
    },
    button: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '12px 20px',
      backgroundColor: '#FF9900', // Amazon orange
      color: '#232F3E',
      border: 'none',
      borderRadius: '25px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      transition: 'transform 0.2s, box-shadow 0.2s',
    },
    buttonHover: {
      transform: 'scale(1.05)',
      boxShadow: '0 6px 16px rgba(0,0,0,0.2)',
    },
    form: {
      position: 'absolute',
      bottom: '60px',
      right: '0',
      width: '280px',
      backgroundColor: '#fff',
      borderRadius: '12px',
      boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
      padding: '20px',
    },
    input: {
      width: '100%',
      padding: '10px 12px',
      marginBottom: '12px',
      border: '1px solid #ddd',
      borderRadius: '6px',
      fontSize: '14px',
      boxSizing: 'border-box',
    },
    submitButton: {
      width: '100%',
      padding: '12px',
      backgroundColor: '#232F3E',
      color: '#fff',
      border: 'none',
      borderRadius: '6px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
    },
    successMessage: {
      textAlign: 'center',
      padding: '20px',
      color: '#2E7D32',
    },
    phoneIcon: {
      width: '18px',
      height: '18px',
    }
  };

  // Phone icon SVG
  const PhoneIcon = () => (
    <svg style={defaultStyles.phoneIcon} viewBox="0 0 24 24" fill="currentColor">
      <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
    </svg>
  );

  if (submitted) {
    return (
      <div style={{ ...defaultStyles.container, ...style }} className={className}>
        <div style={defaultStyles.form}>
          <div style={defaultStyles.successMessage}>
            <p style={{ fontSize: '24px', marginBottom: '10px' }}>✓</p>
            <p style={{ fontWeight: '600', marginBottom: '5px' }}>Thank you!</p>
            <p style={{ fontSize: '13px', color: '#666' }}>We'll call you back shortly.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ ...defaultStyles.container, ...style }} className={className}>
      {showForm && showCallbackForm && (
        <div style={defaultStyles.form}>
          <h4 style={{ margin: '0 0 15px 0', fontSize: '16px' }}>Request a Callback</h4>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Your Name"
              required
              style={defaultStyles.input}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <input
              type="tel"
              placeholder="Phone Number"
              required
              style={defaultStyles.input}
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
            <textarea
              placeholder="Message (optional)"
              style={{ ...defaultStyles.input, resize: 'vertical', minHeight: '60px' }}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            />
            <button 
              type="submit" 
              style={defaultStyles.submitButton}
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Request Callback'}
            </button>
          </form>
          <button
            onClick={() => setShowForm(false)}
            style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              background: 'none',
              border: 'none',
              fontSize: '18px',
              cursor: 'pointer',
              color: '#999'
            }}
          >
            ×
          </button>
        </div>
      )}

      <div style={{ display: 'flex', gap: '10px' }}>
        {phoneNumber && (
          <button
            onClick={handleDirectCall}
            style={defaultStyles.button}
            onMouseEnter={(e) => {
              e.target.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'scale(1)';
            }}
            aria-label="Call us directly"
          >
            <PhoneIcon />
            {buttonText}
          </button>
        )}

        {showCallbackForm && (
          <button
            onClick={() => setShowForm(!showForm)}
            style={{
              ...defaultStyles.button,
              backgroundColor: '#232F3E',
              color: '#fff'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'scale(1)';
            }}
            aria-label="Request a callback"
          >
            {callbackText}
          </button>
        )}
      </div>
    </div>
  );
};

export default AmazonConnectButton;
