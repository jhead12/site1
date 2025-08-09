// webpack.config.js
// Used to manually adjust webpack configuration and suppress CSS chunk order warnings
// This file is imported by gatsby-node.js

exports.onCreateWebpackConfig = ({ stage, actions, getConfig }) => {
  const config = getConfig();
  
  // Add crypto polyfill fallback for browser compatibility
  config.resolve = config.resolve || {};
  config.resolve.fallback = config.resolve.fallback || {};
  config.resolve.fallback.crypto = require.resolve('crypto-browserify');
  
  // Only apply CSS warnings suppression in development mode
  if (stage === 'develop') {
    // Find the mini-css-extract-plugin
    const miniCssExtractPlugin = config.plugins.find(
      plugin => plugin.constructor && plugin.constructor.name === 'MiniCssExtractPlugin'
    );
    
    if (miniCssExtractPlugin) {
      // Disable the order warnings
      miniCssExtractPlugin.options.ignoreOrder = true;
    }
  }
  
  // Update the configuration
  actions.replaceWebpackConfig(config);
};
