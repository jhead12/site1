#!/usr/bin/env node

/**
 * Shopify Data Test Script
 * Tests Shopify integration and GraphQL schema availability
 */

const path = require('path')
const fs = require('fs')

console.log('🛍️ Shopify Data Test')
console.log('===================')

// Check environment variables
console.log('\n📋 Environment Variables:')
console.log('GATSBY_MYSHOPIFY_URL:', process.env.GATSBY_MYSHOPIFY_URL || 'Not set')
console.log('SHOPIFY_STOREFRONT_ACCESS_TOKEN:', process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN ? 'Set' : 'Not set')
console.log('SHOPIFY_ADMIN_ACCESS_TOKEN:', process.env.SHOPIFY_ADMIN_ACCESS_TOKEN ? 'Set' : 'Not set')

// Check if .env file exists and contains Shopify vars
const envPath = path.join(process.cwd(), '.env')
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8')
  console.log('\n📄 .env file Shopify configuration:')
  
  const shopifyVars = envContent.split('\n').filter(line => 
    line.includes('SHOPIFY') || line.includes('MYSHOPIFY')
  )
  
  if (shopifyVars.length > 0) {
    shopifyVars.forEach(line => {
      if (line.trim() && !line.startsWith('#')) {
        const [key, value] = line.split('=')
        console.log(`${key}: ${value ? 'Set' : 'Empty'}`)
      }
    })
  } else {
    console.log('No Shopify variables found in .env')
  }
} else {
  console.log('\n❌ .env file not found')
}

// Check package.json for Shopify dependencies
const packagePath = path.join(process.cwd(), 'package.json')
if (fs.existsSync(packagePath)) {
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'))
  const deps = { ...packageJson.dependencies, ...packageJson.devDependencies }
  
  console.log('\n📦 Shopify Dependencies:')
  const shopifyDeps = Object.keys(deps).filter(dep => 
    dep.includes('shopify') || dep.includes('gatsby-source-shopify')
  )
  
  if (shopifyDeps.length > 0) {
    shopifyDeps.forEach(dep => {
      console.log(`${dep}: ${deps[dep]}`)
    })
  } else {
    console.log('No Shopify dependencies found')
  }
}

// Check gatsby-config.js for Shopify plugin
const gatsbyConfigPath = path.join(process.cwd(), 'gatsby-config.js')
if (fs.existsSync(gatsbyConfigPath)) {
  const configContent = fs.readFileSync(gatsbyConfigPath, 'utf8')
  console.log('\n⚙️ Gatsby Config Shopify Plugin:')
  
  if (configContent.includes('gatsby-source-shopify')) {
    console.log('✅ gatsby-source-shopify plugin found')
    
    // Extract plugin configuration
    const lines = configContent.split('\n')
    let inShopifyConfig = false
    let configLines = []
    
    lines.forEach(line => {
      if (line.includes('gatsby-source-shopify')) {
        inShopifyConfig = true
      }
      if (inShopifyConfig) {
        configLines.push(line.trim())
        if (line.includes('},') || line.includes('}')) {
          inShopifyConfig = false
        }
      }
    })
    
    if (configLines.length > 0) {
      console.log('Configuration:')
      configLines.forEach(line => console.log(`  ${line}`))
    }
  } else {
    console.log('❌ gatsby-source-shopify plugin not found')
  }
} else {
  console.log('\n❌ gatsby-config.js not found')
}

// Check files that might be querying Shopify data
console.log('\n🔍 Checking for Shopify GraphQL queries:')

const filesToCheck = [
  'src/pages/shop.js',
  'src/templates/product.js',
  'src/components/shopify-product-grid.js',
  'gatsby-node.js'
]

filesToCheck.forEach(filePath => {
  const fullPath = path.join(process.cwd(), filePath)
  if (fs.existsSync(fullPath)) {
    const content = fs.readFileSync(fullPath, 'utf8')
    
    // Check for active (uncommented) Shopify queries
    const lines = content.split('\n')
    let hasActiveShopifyQuery = false
    let hasCommentedShopifyQuery = false
    
    lines.forEach((line, index) => {
      if (line.includes('allShopifyProduct') || line.includes('shopifyProduct')) {
        if (line.trim().startsWith('//') || line.trim().startsWith('*') || line.trim().startsWith('#')) {
          hasCommentedShopifyQuery = true
        } else {
          hasActiveShopifyQuery = true
          console.log(`  ⚠️  Active Shopify query in ${filePath}:${index + 1}`)
          console.log(`     ${line.trim()}`)
        }
      }
    })
    
    if (hasActiveShopifyQuery) {
      console.log(`❌ ${filePath}: Has active Shopify queries`)
    } else if (hasCommentedShopifyQuery) {
      console.log(`✅ ${filePath}: Shopify queries are commented out`)
    } else {
      console.log(`✅ ${filePath}: No Shopify queries found`)
    }
  } else {
    console.log(`❌ ${filePath}: File not found`)
  }
})

// Test Shopify connection if credentials are available
if (process.env.GATSBY_MYSHOPIFY_URL && process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN) {
  console.log('\n🔗 Testing Shopify connection...')
  
  const shopDomain = process.env.GATSBY_MYSHOPIFY_URL
  const accessToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN
  
  // Simple test query to Shopify Storefront API
  const testShopifyConnection = async () => {
    try {
      const query = `
        query {
          shop {
            name
            description
          }
        }
      `
      
      const response = await fetch(`https://${shopDomain}/api/2023-10/graphql.json`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Storefront-Access-Token': accessToken,
        },
        body: JSON.stringify({ query }),
      })
      
      if (response.ok) {
        const data = await response.json()
        if (data.data && data.data.shop) {
          console.log('✅ Shopify connection successful')
          console.log(`   Shop: ${data.data.shop.name}`)
          console.log(`   Description: ${data.data.shop.description || 'No description'}`)
        } else {
          console.log('❌ Shopify connection failed: Invalid response')
          console.log(JSON.stringify(data, null, 2))
        }
      } else {
        console.log(`❌ Shopify connection failed: ${response.status} ${response.statusText}`)
      }
    } catch (error) {
      console.log(`❌ Shopify connection error: ${error.message}`)
    }
  }
  
  testShopifyConnection()
} else {
  console.log('\n⚠️  Cannot test Shopify connection: Missing credentials')
  console.log('   Required: GATSBY_MYSHOPIFY_URL and SHOPIFY_STOREFRONT_ACCESS_TOKEN')
}

console.log('\n📋 Summary:')
console.log('1. If you see active Shopify queries, comment them out to fix build errors')
console.log('2. To enable Shopify, run: npm run setup:shopify')
console.log('3. Configure your .env file with proper Shopify credentials')
console.log('4. Uncomment Shopify queries only after proper setup')
