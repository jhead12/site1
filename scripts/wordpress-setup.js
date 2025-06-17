const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🎵 Jeldon Music - WordPress Headless Setup');
console.log('==========================================\n');

// Check if .env file exists
const envPath = path.join(__dirname, '../.env.development');
if (!fs.existsSync(envPath)) {
  console.log('❌ .env.development file not found!');
  console.log('📝 Please copy .env.EXAMPLE to .env.development and configure your WordPress settings.\n');
  
  console.log('Required WordPress environment variables:');
  console.log('- WPGRAPHQL_URL: Your WordPress GraphQL endpoint');
  console.log('- WP_USERNAME: WordPress admin username');
  console.log('- WP_PASSWORD: WordPress admin password or app password');
  console.log('- WP_CONSUMER_KEY: WordPress API consumer key');
  console.log('- WP_CONSUMER_SECRET: WordPress API consumer secret\n');
  
  process.exit(1);
}

// Load environment variables
require('dotenv').config({ path: envPath });

// Check required environment variables
const requiredVars = [
  'WPGRAPHQL_URL',
  'WP_USERNAME',
  'WP_PASSWORD'
];

const missingVars = requiredVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.log('❌ Missing required environment variables:');
  missingVars.forEach(varName => console.log(`  - ${varName}`));
  console.log('\nPlease configure these in your .env.development file.\n');
  process.exit(1);
}

console.log('✅ Environment variables configured');

// WordPress Plugin Checklist
console.log('\n📋 WordPress Plugin Checklist');
console.log('==============================');
console.log('Please ensure these plugins are installed and activated on your WordPress site:\n');

const requiredPlugins = [
  { name: 'WP GraphQL', slug: 'wp-graphql', required: true },
  { name: 'Advanced Custom Fields Pro', slug: 'advanced-custom-fields-pro', required: true },
  { name: 'WP GraphQL for ACF', slug: 'wp-graphql-acf', required: true },
  { name: 'Custom Post Type UI', slug: 'custom-post-type-ui', required: false },
  { name: 'WP GraphQL Meta Query', slug: 'wp-graphql-meta-query', required: false },
  { name: 'Yoast SEO Premium', slug: 'wordpress-seo-premium', required: false },
  { name: 'WP GraphQL Yoast SEO', slug: 'wp-graphql-yoast-seo', required: false }
];

requiredPlugins.forEach(plugin => {
  const status = plugin.required ? '[REQUIRED]' : '[OPTIONAL]';
  console.log(`${status} ${plugin.name}`);
});

console.log('\n📚 Next Steps:');
console.log('1. Install and activate the required WordPress plugins');
console.log('2. Configure custom post types (Beats, Tutorials, Mixes)');
console.log('3. Set up ACF field groups for each content type');
console.log('4. Test your GraphQL endpoint');
console.log('5. Run: yarn wp:test-connection');

console.log('\n🔗 Useful Links:');
console.log(`WordPress Admin: ${process.env.WPGRAPHQL_URL.replace('/graphql', '/wp-admin')}`);
console.log(`GraphQL IDE: ${process.env.WPGRAPHQL_URL}?ide`);

console.log('\n✨ Setup complete! Ready for WordPress headless development.');
