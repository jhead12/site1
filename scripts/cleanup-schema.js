const fs = require('fs')
const path = require('path')

/**
 * GraphQL Schema Cleanup Script
 * This script fixes the duplicate and conflicting type definitions
 */

async function cleanupSchema() {
  console.log('🔧 Starting GraphQL Schema Cleanup')
  console.log('=' * 40)
  
  const gatsbyNodePath = path.join(__dirname, '..', 'gatsby-node.js')
  let content = fs.readFileSync(gatsbyNodePath, 'utf8')
  
  console.log('📋 Current issues found:')
  console.log('   - Multiple NavItem interface definitions')
  console.log('   - Multiple ContentfulNavItem type definitions')
  console.log('   - Type inconsistencies with submenu field')
  
  // Create backup
  const backupPath = `${gatsbyNodePath}.backup-${Date.now()}`
  fs.writeFileSync(backupPath, content)
  console.log(`💾 Backup created: ${backupPath}`)
  
  // Define the problems and solutions
  const fixes = [
    {
      name: 'Remove duplicate NavItem interface in bypass mode',
      search: /\s+# Make ContentfulNavItem implement both interfaces[\s\S]*?type ContentfulNavItem implements NavItem & NavItemGroup \{[\s\S]*?\}/g,
      replace: ''
    },
    {
      name: 'Ensure consistent submenu field type',
      search: /submenu:\s*\[NavItem\]/g,
      replace: 'submenu: [HeaderNavItem]'
    },
    {
      name: 'Remove duplicate type definitions in bypass mode section',
      search: /\s+# Define interfaces for navigation items[\s\S]*?type ContentfulNavItem implements NavItem & NavItemGroup \{[\s\S]*?\}/g,
      replace: ''
    }
  ]
  
  console.log('\n🔨 Applying fixes:')
  
  fixes.forEach((fix, index) => {
    const beforeMatches = content.match(fix.search)
    if (beforeMatches) {
      content = content.replace(fix.search, fix.replace)
      console.log(`   ✅ ${index + 1}. ${fix.name} - Fixed ${beforeMatches.length} occurrence(s)`)
    } else {
      console.log(`   ⏭️  ${index + 1}. ${fix.name} - No matches found`)
    }
  })
  
  // Write the cleaned content
  fs.writeFileSync(gatsbyNodePath, content)
  console.log('\n✅ Schema cleanup completed!')
  
  // Verify the cleanup
  console.log('\n🔍 Verifying cleanup...')
  const cleanedContent = fs.readFileSync(gatsbyNodePath, 'utf8')
  
  const interfaceMatches = cleanedContent.match(/interface\s+NavItem/g) || []
  const typeMatches = cleanedContent.match(/type\s+ContentfulNavItem/g) || []
  const submenuMatches = cleanedContent.match(/submenu:\s*\[(\w+)\]/g) || []
  
  console.log(`   - NavItem interfaces: ${interfaceMatches.length}`)
  console.log(`   - ContentfulNavItem types: ${typeMatches.length}`)
  console.log(`   - Submenu field types: ${submenuMatches.join(', ')}`)
  
  if (interfaceMatches.length <= 1 && typeMatches.length <= 1) {
    console.log('✅ Cleanup verification passed!')
    return true
  } else {
    console.log('❌ Cleanup verification failed - manual review needed')
    return false
  }
}

// Run the cleanup
cleanupSchema().then(success => {
  if (success) {
    console.log('\n🚀 Ready to restart development server!')
    console.log('Run: gatsby clean && npm run develop')
  } else {
    console.log('\n⚠️  Manual review of gatsby-node.js recommended')
  }
}).catch(error => {
  console.error('❌ Error during cleanup:', error.message)
})
