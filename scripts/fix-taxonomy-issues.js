#!/usr/bin/env node

/**
 * WordPress Taxonomy Fix Script
 * This script helps diagnose and fix taxonomy-related GraphQL schema issues
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration
const WORDPRESS_PATH = '/Users/jeldonmusic/Local Sites/w-jeldonmusic/app/public';

console.log('🔧 WordPress Taxonomy Diagnostic Tool\n');

/**
 * Execute WP-CLI command safely
 */
function wpCli(command) {
  const fullCommand = `cd "${WORDPRESS_PATH}" && wp ${command}`;
  console.log(`Executing: ${command}`);
  try {
    const result = execSync(fullCommand, { encoding: 'utf8', stdio: 'pipe' });
    return result.trim();
  } catch (error) {
    console.error(`❌ Error executing: ${command}`);
    console.error(error.message);
    return null;
  }
}

/**
 * Check WordPress status
 */
function checkWordPressStatus() {
  console.log('📋 Checking WordPress status...');
  
  try {
    const siteUrl = wpCli('option get siteurl');
    if (siteUrl) {
      console.log(`✅ WordPress accessible at: ${siteUrl}`);
      return true;
    }
  } catch (error) {
    console.log('❌ WordPress not accessible. Please:');
    console.log('1. Start Local by Flywheel');
    console.log('2. Start the "w-jeldonmusic" site');
    console.log('3. Verify site loads at: http://w-jeldonmusic.local');
    return false;
  }
}

/**
 * Check taxonomy registration
 */
function checkTaxonomies() {
  console.log('\n🏷️  Checking taxonomy registration...');
  
  const result = wpCli('taxonomy list --format=json');
  if (!result) return false;
  
  try {
    const taxonomies = JSON.parse(result);
    const customTaxonomies = taxonomies.filter(tax => 
      ['music_genre', 'mood'].includes(tax.name)
    );
    
    console.log('📊 Custom Taxonomies Status:');
    ['music_genre', 'mood'].forEach(taxName => {
      const found = customTaxonomies.find(tax => tax.name === taxName);
      if (found) {
        console.log(`✅ ${taxName} - Registered`);
        console.log(`   Post Types: ${found.object_type.join(', ')}`);
      } else {
        console.log(`❌ ${taxName} - Not Found`);
      }
    });
    
    return customTaxonomies.length > 0;
  } catch (error) {
    console.error('❌ Failed to parse taxonomy list');
    return false;
  }
}

/**
 * Check GraphQL schema
 */
function checkGraphQLSchema() {
  console.log('\n🔗 Checking GraphQL schema...');
  
  // Try to query the GraphQL endpoint
  const testQuery = `{
    __schema {
      types {
        name
      }
    }
  }`;
  
  console.log('💡 GraphQL endpoint: http://w-jeldonmusic.local/graphql');
  console.log('📝 You can manually test the schema at the GraphQL IDE');
  
  return true;
}

/**
 * Fix taxonomy issues
 */
function fixTaxonomyIssues() {
  console.log('\n🔧 Applying taxonomy fixes...');
  
  // Flush rewrite rules
  const flushResult = wpCli('rewrite flush');
  if (flushResult !== null) {
    console.log('✅ Rewrite rules flushed');
  }
  
  // Check if custom functions are loaded
  const themeCheck = wpCli('eval "echo function_exists(\'register_beats_post_type\') ? \'YES\' : \'NO\';"');
  if (themeCheck === 'YES') {
    console.log('✅ Custom post type functions are loaded');
  } else {
    console.log('❌ Custom post type functions not found');
    console.log('💡 Check that functions-music.php is properly included in theme');
  }
}

/**
 * Generate Gatsby config fix
 */
function generateGatsbyFix() {
  console.log('\n⚛️  Generating Gatsby configuration fix...');
  
  const fixContent = `
// Temporary Gatsby configuration to handle missing taxonomies
// Add this to gatsby-config.js if you continue having taxonomy issues

module.exports = {
  plugins: [
    {
      resolve: "gatsby-source-wordpress",
      options: {
        url: process.env.WPGRAPHQL_URL || "http://w-jeldonmusic.local/graphql",
        schema: {
          perPage: 20,
          requestConcurrency: 5,
          previewRequestConcurrency: 2,
        },
        type: {
          // Skip problematic taxonomy if needed
          Mood: {
            exclude: true,
          },
          // Include only if taxonomy exists
          MusicGenre: {
            exclude: false,
          }
        }
      }
    }
  ]
};
`;
  
  const fixPath = path.join(__dirname, 'gatsby-config-taxonomy-fix.js');
  fs.writeFileSync(fixPath, fixContent);
  console.log(`📝 Gatsby fix written to: ${fixPath}`);
}

/**
 * Main execution
 */
async function main() {
  const wordpressOk = checkWordPressStatus();
  
  if (wordpressOk) {
    checkTaxonomies();
    checkGraphQLSchema();
    fixTaxonomyIssues();
  }
  
  generateGatsbyFix();
  
  console.log('\n📋 Summary & Next Steps:');
  if (!wordpressOk) {
    console.log('1. ⚠️  Start WordPress in Local by Flywheel');
    console.log('2. 🔄 Re-run this script to check taxonomy status');
  }
  console.log('3. 🧹 Run: gatsby clean && gatsby develop');
  console.log('4. 🔍 Check GraphQL at: http://localhost:8000/___graphql');
  console.log('5. ✅ If taxonomies still missing, consider removing mood references temporarily');
  
  console.log('\n💡 Mood taxonomy has been temporarily disabled in templates to fix build issues.');
  console.log('   Once WordPress is running and taxonomies are confirmed, you can re-enable mood fields.');
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = { checkWordPressStatus, checkTaxonomies, fixTaxonomyIssues };
