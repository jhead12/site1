#!/usr/bin/env node

const fetch = require('node-fetch');

async function checkAboutPage() {
  console.log('🔍 Checking WordPress About Page Status');
  console.log('=====================================');
  
  const wpGraphQLUrl = process.env.WPGRAPHQL_URL || 'http://localhost:10008/graphql';
  
  try {
    // Check if About page exists
    const aboutQuery = {
      query: `
        query {
          wpPage(slug: {eq: "about"}) {
            id
            title
            content
            slug
            status
            featuredImage {
              node {
                sourceUrl
                altText
              }
            }
          }
        }
      `
    };

    console.log(`📡 Querying: ${wpGraphQLUrl}`);
    
    const response = await fetch(wpGraphQLUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(aboutQuery)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.errors) {
      console.error('❌ GraphQL Errors:', data.errors);
      return;
    }

    const aboutPage = data.data?.wpPage;
    
    if (aboutPage) {
      console.log('✅ About page found in WordPress!');
      console.log(`📄 Title: ${aboutPage.title}`);
      console.log(`🔗 Slug: ${aboutPage.slug}`);
      console.log(`📊 Status: ${aboutPage.status}`);
      console.log(`📝 Content length: ${aboutPage.content ? aboutPage.content.length : 0} characters`);
      
      if (aboutPage.featuredImage?.node) {
        console.log(`🖼️  Featured image: ${aboutPage.featuredImage.node.sourceUrl}`);
      }
      
      console.log('\n✅ The About page will load from WordPress successfully!');
    } else {
      console.log('❌ No About page found in WordPress');
      console.log('\n📝 Next Steps:');
      console.log('1. Log into WordPress admin');
      console.log('2. Go to Pages > Add New');
      console.log('3. Create a page with slug "about"');
      console.log('4. Publish the page');
      console.log('5. Restart Gatsby development server');
    }

  } catch (error) {
    console.error('❌ Error checking About page:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Make sure WordPress is running');
    console.log('2. Check WPGRAPHQL_URL in .env.development');
    console.log('3. Verify WP GraphQL plugin is active');
  }
}

// Run the check
checkAboutPage().catch(console.error);
