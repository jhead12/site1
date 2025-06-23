// webpack.config.js
// Used to manually adjust webpack configuration and suppress CSS chunk order warnings
// This file is imported by gatsby-node.js

exports.onCreateWebpackConfig = ({ stage, actions, getConfig }) => {
  // Only apply in development mode to suppress the warnings
  if (stage === 'develop') {
    const config = getConfig();
    
    // Find the mini-css-extract-plugin
    const miniCssExtractPlugin = config.plugins.find(
      plugin => plugin.constructor && plugin.constructor.name === 'MiniCssExtractPlugin'
    );
    
    if (miniCssExtractPlugin) {
      // Disable the order warnings
      miniCssExtractPlugin.options.ignoreOrder = true;
    }
    
    // Update the configuration
    actions.replaceWebpackConfig(config);
  }
};
