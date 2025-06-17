const fetch = require('node-fetch');
require('dotenv').config({ path: '.env.development' });

async function testWordPressConnection() {
  console.log('🔌 Testing WordPress GraphQL Connection');
  console.log('=====================================\n');

  const graphqlUrl = process.env.WPGRAPHQL_URL;
  
  if (!graphqlUrl) {
    console.log('❌ WPGRAPHQL_URL not found in environment variables');
    process.exit(1);
  }

  console.log(`📡 Testing connection to: ${graphqlUrl}\n`);

  // Test basic GraphQL query
  const basicQuery = `
    query TestConnection {
      generalSettings {
        title
        description
        url
      }
    }
  `;

  try {
    const response = await fetch(graphqlUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: basicQuery
      })
    });

    const data = await response.json();

    if (data.errors) {
      console.log('❌ GraphQL Errors:');
      data.errors.forEach(error => console.log(`  - ${error.message}`));
      return;
    }

    if (data.data && data.data.generalSettings) {
      console.log('✅ WordPress GraphQL connection successful!');
      console.log(`📰 Site Title: ${data.data.generalSettings.title}`);
      console.log(`📝 Description: ${data.data.generalSettings.description}`);
      console.log(`🌐 URL: ${data.data.generalSettings.url}\n`);
    }

    // Test custom post types
    const customPostTypesQuery = `
      query TestCustomPostTypes {
        contentTypes {
          nodes {
            name
            graphqlSingleName
            graphqlPluralName
          }
        }
      }
    `;

    const cptResponse = await fetch(graphqlUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: customPostTypesQuery
      })
    });

    const cptData = await cptResponse.json();

    if (cptData.data && cptData.data.contentTypes) {
      console.log('📋 Available Content Types:');
      cptData.data.contentTypes.nodes.forEach(type => {
        console.log(`  - ${type.name} (${type.graphqlSingleName}/${type.graphqlPluralName})`);
      });
      console.log('');
    }

    // Test for music-specific content types
    const musicContentQuery = `
      query TestMusicContent {
        beats: contentNodes(where: {contentTypes: ["beat"]}) {
          nodes {
            id
            ... on Beat {
              title
            }
          }
        }
        tutorials: contentNodes(where: {contentTypes: ["tutorial"]}) {
          nodes {
            id
            ... on Tutorial {
              title
            }
          }
        }
        mixes: contentNodes(where: {contentTypes: ["mix"]}) {
          nodes {
            id
            ... on Mix {
              title
            }
          }
        }
      }
    `;

    try {
      const musicResponse = await fetch(graphqlUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: musicContentQuery
        })
      });

      const musicData = await musicResponse.json();
      
      if (!musicData.errors) {
        console.log('🎵 Music Content Types Status:');
        console.log(`  - Beats: ${musicData.data.beats?.nodes?.length || 0} items`);
        console.log(`  - Tutorials: ${musicData.data.tutorials?.nodes?.length || 0} items`);
        console.log(`  - Mixes: ${musicData.data.mixes?.nodes?.length || 0} items`);
      } else {
        console.log('⚠️  Music content types not yet configured');
        console.log('   Please set up Beats, Tutorials, and Mixes custom post types');
      }
    } catch (error) {
      console.log('⚠️  Music content types not yet configured');
    }

    console.log('\n✅ Connection test completed successfully!');
    console.log('\n📝 Next Steps:');
    console.log('1. If music content types are missing, set them up in WordPress');
    console.log('2. Configure ACF field groups for each content type');
    console.log('3. Add some test content');
    console.log('4. Run: yarn develop:wp');

  } catch (error) {
    console.log('❌ Connection failed:');
    console.log(`   ${error.message}\n`);
    
    console.log('🔧 Troubleshooting Tips:');
    console.log('1. Ensure WP GraphQL plugin is installed and activated');
    console.log('2. Check that your WordPress site is accessible');
    console.log('3. Verify WPGRAPHQL_URL in your .env.development file');
    console.log('4. Test the GraphQL endpoint directly in your browser');
  }
}

testWordPressConnection();
