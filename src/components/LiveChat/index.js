/**
 * Live Chat & Communication Components
 * 
 * This module exports components for visitor communication:
 * - Tawk.to integration (handled in gatsby-ssr.js)
 * - Amazon Connect click-to-call button
 * - Callback request form
 */

export { default as AmazonConnectButton } from './AmazonConnectButton';

// Tawk.to API helpers
export const TawkToAPI = {
  // Maximize the chat widget
  maximize: () => {
    if (typeof window !== 'undefined' && window.Tawk_API) {
      window.Tawk_API.maximize();
    }
  },
  
  // Minimize the chat widget
  minimize: () => {
    if (typeof window !== 'undefined' && window.Tawk_API) {
      window.Tawk_API.minimize();
    }
  },
  
  // Toggle the widget
  toggle: () => {
    if (typeof window !== 'undefined' && window.Tawk_API) {
      window.Tawk_API.toggle();
    }
  },
  
  // Show the widget
  show: () => {
    if (typeof window !== 'undefined' && window.Tawk_API) {
      window.Tawk_API.showWidget();
    }
  },
  
  // Hide the widget
  hide: () => {
    if (typeof window !== 'undefined' && window.Tawk_API) {
      window.Tawk_API.hideWidget();
    }
  },
  
  // Set visitor attributes (useful for logged-in users)
  setAttributes: (attributes) => {
    if (typeof window !== 'undefined' && window.Tawk_API) {
      window.Tawk_API.setAttributes(attributes);
    }
  },
  
  // Add a custom event
  addEvent: (eventName, metadata) => {
    if (typeof window !== 'undefined' && window.Tawk_API) {
      window.Tawk_API.addEvent(eventName, metadata);
    }
  },
  
  // Check if chat is maximized
  isChatMaximized: () => {
    if (typeof window !== 'undefined' && window.Tawk_API) {
      return window.Tawk_API.isChatMaximized();
    }
    return false;
  },
  
  // On chat started callback
  onChatStarted: (callback) => {
    if (typeof window !== 'undefined') {
      window.Tawk_API = window.Tawk_API || {};
      window.Tawk_API.onChatStarted = callback;
    }
  },
  
  // On chat ended callback
  onChatEnded: (callback) => {
    if (typeof window !== 'undefined') {
      window.Tawk_API = window.Tawk_API || {};
      window.Tawk_API.onChatEnded = callback;
    }
  }
};
