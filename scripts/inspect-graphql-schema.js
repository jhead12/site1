const fs = require('fs')
const path = require('path')

/**
 * GraphQL Schema Inspector
 * This script helps inspect the current GraphQL schema to understand
 * the relationships and type definitions before making changes.
 */

async function inspectSchema() {
  console.log('🔍 GraphQL Schema Inspector')
  console.log('=' * 50)
  
  try {
    // Check if Gatsby has generated schema files
    const publicDir = path.join(__dirname, '..', 'public')
    const pageDataDir = path.join(publicDir, 'page-data')
    
    console.log(`📁 Checking for schema files in: ${publicDir}`)
    
    if (fs.existsSync(pageDataDir)) {
      console.log('✅ Page data directory exists')
      
      // List available page data
      const pageDataContents = fs.readdirSync(pageDataDir)
      console.log('📄 Available page data:')
      pageDataContents.forEach(item => {
        console.log(`   - ${item}`)
      })
    } else {
      console.log('❌ Page data directory not found - development server may not be running')
    }
    
    // Check for GraphQL query files
    const srcDir = path.join(__dirname, '..', 'src')
    console.log('\n📋 Scanning for GraphQL queries in src/')
    
    const findGraphQLQueries = (dir, results = []) => {
      const files = fs.readdirSync(dir)
      
      files.forEach(file => {
        const fullPath = path.join(dir, file)
        const stat = fs.statSync(fullPath)
        
        if (stat.isDirectory()) {
          findGraphQLQueries(fullPath, results)
        } else if (file.endsWith('.js') || file.endsWith('.jsx') || file.endsWith('.ts') || file.endsWith('.tsx')) {
          const content = fs.readFileSync(fullPath, 'utf8')
          if (content.includes('graphql`') || content.includes('useStaticQuery')) {
            results.push({
              file: fullPath.replace(srcDir, ''),
              hasGraphQL: content.includes('graphql`'),
              hasStaticQuery: content.includes('useStaticQuery'),
              fragments: (content.match(/fragment\s+(\w+)/g) || []).map(f => f.replace('fragment ', ''))
            })
          }
        }
      })
      
      return results
    }
    
    const graphqlFiles = findGraphQLQueries(srcDir)
    
    console.log(`\n🔎 Found ${graphqlFiles.length} files with GraphQL queries:`)
    graphqlFiles.forEach(({ file, hasGraphQL, hasStaticQuery, fragments }) => {
      console.log(`\n📄 ${file}`)
      console.log(`   - Has page queries: ${hasGraphQL ? '✅' : '❌'}`)
      console.log(`   - Has static queries: ${hasStaticQuery ? '✅' : '❌'}`)
      if (fragments.length > 0) {
        console.log(`   - Fragments: ${fragments.join(', ')}`)
      }
    })
    
    // Check gatsby-node.js for schema definitions
    console.log('\n📋 Analyzing gatsby-node.js schema definitions...')
    const gatsbyNodePath = path.join(__dirname, '..', 'gatsby-node.js')
    const gatsbyNodeContent = fs.readFileSync(gatsbyNodePath, 'utf8')
    
    // Extract interface definitions
    const interfaceMatches = gatsbyNodeContent.match(/interface\s+(\w+)/g) || []
    const typeMatches = gatsbyNodeContent.match(/type\s+(\w+)/g) || []
    
    console.log(`\n🏗️  Schema Definitions Found:`)
    console.log(`   - Interfaces: ${interfaceMatches.length}`)
    interfaceMatches.forEach(match => {
      console.log(`     • ${match.replace('interface ', '')}`)
    })
    
    console.log(`   - Types: ${typeMatches.length}`)
    typeMatches.slice(0, 10).forEach(match => { // Show first 10 to avoid clutter
      console.log(`     • ${match.replace('type ', '')}`)
    })
    if (typeMatches.length > 10) {
      console.log(`     ... and ${typeMatches.length - 10} more`)
    }
    
    // Check for specific problematic types
    console.log('\n🚨 Checking for problematic type definitions...')
    const problemTypes = ['NavItem', 'HeaderNavItem', 'NavItemGroup', 'ContentfulNavItem', 'ContentfulNavItemGroup']
    
    problemTypes.forEach(type => {
      const regex = new RegExp(`(interface|type)\\s+${type}[^{]*{[^}]*}`, 'gs')
      const matches = gatsbyNodeContent.match(regex)
      
      if (matches) {
        console.log(`\n🔍 ${type} definitions found:`)
        matches.forEach((match, index) => {
          console.log(`   Definition ${index + 1}:`)
          // Extract just the field definitions
          const fields = match.match(/(\w+):\s*[^,}]+/g) || []
          fields.forEach(field => {
            console.log(`     - ${field.trim()}`)
          })
        })
      } else {
        console.log(`❌ No ${type} definition found`)
      }
    })
    
  } catch (error) {
    console.error('❌ Error inspecting schema:', error.message)
  }
}

// Run the inspection
inspectSchema()
