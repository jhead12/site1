const webpackConfig = require("./webpack.config")

// Import webpack configuration to handle CSS chunk ordering issues
exports.onCreateWebpackConfig = webpackConfig.onCreateWebpackConfig

// Modularized Gatsby lifecycle hooks — each hook lives in its own file
// under src/gatsby/ for maintainability.
exports.createSchemaCustomization = require("./src/gatsby/schema").createSchemaCustomization
exports.createResolvers = require("./src/gatsby/resolvers").createResolvers
exports.createPages = require("./src/gatsby/pages").createPages
exports.onCreatePage = require("./src/gatsby/on-create-page").onCreatePage
exports.onCreateNode = require("./src/gatsby/on-create-node").onCreateNode
exports.onPostBuild = require("./src/gatsby/bypass-mocks").onPostBuild
