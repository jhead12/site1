// Create a simple Node.js script to check localStorage accessibility

// Mock the window object like Gatsby does for SSR
global.window = {}; // this will trigger the error

// Try to use localStorage
try {
  console.log("Attempting to access localStorage...");
  // This will fail since localStorage doesn't exist in Node.js
  const localStorage = window.localStorage;
  localStorage.getItem('test');
} catch (error) {
  console.error("Error accessing localStorage:", error.message);
  
  // This is the recommended fix:
  console.log("\nRecommended fix:");
  console.log("const isBrowser = typeof window !== 'undefined' && window.localStorage");
  console.log("if (isBrowser) {\n  // Use localStorage safely here\n}");
}
