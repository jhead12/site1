#!/usr/bin/env node

/**
 * Import ACF Field Groups into WordPress
 * This script imports the ACF field group definitions for beats, tutorials, and mixes
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const WORDPRESS_PATH = '/Users/jeldonmusic/Local Sites/w-jeldonmusic/app/public';
const SCRIPT_DIR = __dirname;

// ACF field group files to import
const fieldGroupFiles = [
  'acf-beats-fields.json',
  'acf-tutorials-fields.json',
  'acf-mixes-fields.json'
];

console.log('🎵 Starting ACF Field Groups Import Process...\n');

/**
 * Execute WP-CLI command
 */
function wpCli(command) {
  const fullCommand = `cd "${WORDPRESS_PATH}" && wp ${command}`;
  console.log(`Executing: ${command}`);
  try {
    const result = execSync(fullCommand, { encoding: 'utf8', stdio: 'pipe' });
    return result.trim();
  } catch (error) {
    console.error(`Error executing command: ${command}`);
    console.error(error.message);
    throw error;
  }
}

/**
 * Check if WordPress and required plugins are ready
 */
function checkPrerequisites() {
  console.log('📋 Checking prerequisites...');
  
  try {
    // Check if WordPress is accessible
    console.log('🔍 Checking WordPress database connection...');
    const siteUrl = wpCli('option get siteurl');
    console.log(`✅ WordPress accessible at: ${siteUrl}`);
    
    // Check if ACF Pro is active
    const plugins = wpCli('plugin list --status=active --format=json');
    const activePlugins = JSON.parse(plugins);
    
    const requiredPlugins = [
      'advanced-custom-fields-pro',
      'wp-graphql',
      'wp-graphql-acf'
    ];
    
    const missingPlugins = requiredPlugins.filter(plugin => 
      !activePlugins.some(p => p.name === plugin)
    );
    
    if (missingPlugins.length > 0) {
      console.error('❌ Missing required plugins:', missingPlugins);
      throw new Error('Required plugins not active');
    }
    
    console.log('✅ All required plugins are active');
    return true;
  } catch (error) {
    console.error('❌ Prerequisites check failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Make sure Local by Flywheel is running');
    console.log('2. Start the "w-jeldonmusic" site in Local');
    console.log('3. Verify the site is accessible at: http://w-jeldonmusic.local');
    console.log('4. Try running this script again');
    console.log('\n💡 Alternative: You can manually import the ACF field groups through WordPress admin:');
    console.log('   - Go to Custom Fields > Tools > Import Field Groups');
    console.log('   - Upload each JSON file from the scripts/ directory');
    return false;
  }
}

/**
 * Import a single ACF field group
 */
function importFieldGroup(filename) {
  console.log(`\n📦 Importing field group: ${filename}`);
  
  try {
    const filePath = path.join(SCRIPT_DIR, filename);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }
    
    // Read and validate JSON
    const fieldGroupData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    console.log(`   Field group title: ${fieldGroupData.title}`);
    console.log(`   Field group key: ${fieldGroupData.key}`);
    
    // Import using WP-CLI
    const result = wpCli(`acf import "${filePath}"`);
    console.log(`✅ Successfully imported: ${fieldGroupData.title}`);
    
    return true;
  } catch (error) {
    console.error(`❌ Failed to import ${filename}:`, error.message);
    return false;
  }
}

/**
 * Verify field groups are properly imported
 */
function verifyImport() {
  console.log('\n🔍 Verifying imported field groups...');
  
  try {
    // List all field groups
    const result = wpCli('acf list');
    console.log('📋 ACF Field Groups Status:');
    console.log(result);
    
    // Check specific field groups
    const expectedGroups = [
      'Beats Information',
      'Tutorial Information', 
      'Mix Information'
    ];
    
    expectedGroups.forEach(groupTitle => {
      if (result.includes(groupTitle)) {
        console.log(`✅ ${groupTitle} - Found`);
      } else {
        console.log(`❌ ${groupTitle} - Not Found`);
      }
    });
    
    return true;
  } catch (error) {
    console.error('❌ Verification failed:', error.message);
    return false;
  }
}

/**
 * Test GraphQL integration
 */
function testGraphQLIntegration() {
  console.log('\n🔗 Testing GraphQL integration...');
  
  try {
    // Test GraphQL schema includes our custom fields
    const query = `
      query TestCustomFields {
        beats {
          nodes {
            id
            title
            beatsFields {
              bpm
              musicalKey
              genre
            }
          }
        }
        tutorials {
          nodes {
            id
            title
            tutorialFields {
              difficulty
              duration
              category
            }
          }
        }
        mixes {
          nodes {
            id
            title
            mixFields {
              duration
              tracklist
              genre
            }
          }
        }
      }
    `;
    
    // Write test query to file for manual testing
    const queryFile = path.join(SCRIPT_DIR, 'test-graphql-query.gql');
    fs.writeFileSync(queryFile, query);
    console.log(`📝 Test GraphQL query written to: ${queryFile}`);
    console.log('💡 You can test this query at: http://w-jeldonmusic.local/graphql');
    
    return true;
  } catch (error) {
    console.error('❌ GraphQL test setup failed:', error.message);
    return false;
  }
}

/**
 * Main execution function
 */
async function main() {
  try {
    // Check prerequisites
    if (!checkPrerequisites()) {
      process.exit(1);
    }
    
    // Import field groups
    let successCount = 0;
    for (const filename of fieldGroupFiles) {
      if (importFieldGroup(filename)) {
        successCount++;
      }
    }
    
    console.log(`\n📊 Import Summary: ${successCount}/${fieldGroupFiles.length} field groups imported successfully`);
    
    if (successCount === 0) {
      console.log('❌ No field groups were imported. Please check the errors above.');
      process.exit(1);
    }
    
    // Verify import
    verifyImport();
    
    // Test GraphQL integration
    testGraphQLIntegration();
    
    console.log('\n🎉 ACF Field Groups import process completed!');
    console.log('\n📋 Next Steps:');
    console.log('1. Login to WordPress admin and verify field groups are visible');
    console.log('2. Create sample content for beats, tutorials, and mixes');
    console.log('3. Test GraphQL queries with the generated test query');
    console.log('4. Build Gatsby templates for the new content types');
    
  } catch (error) {
    console.error('\n💥 Import process failed:', error.message);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = { importFieldGroup, checkPrerequisites, verifyImport };
