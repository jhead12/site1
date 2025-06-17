#!/usr/bin/env node

/**
 * WordPress Plugin Verification Script
 * Check if required plugins are installed and active
 */

require('dotenv').config();
const https = require('https');
const http = require('http');

const WORDPRESS_URL = process.env.WPGRAPHQL_URL || 'http://localhost:10008/graphql/';
const ADMIN_URL = WORDPRESS_URL.replace('/graphql/', '/wp-admin/');

console.log('🔍 WordPress Plugin Verification\n');
console.log('==================================================');
console.log('🎯 Target WordPress:', WORDPRESS_URL);
console.log('🔧 Admin URL:', ADMIN_URL);

// Check if GraphQL endpoint is responding
function checkGraphQLEndpoint() {
    return new Promise((resolve) => {
        const url = new URL(WORDPRESS_URL);
        const options = {
            hostname: url.hostname,
            port: url.port,
            path: url.pathname,
            method: 'GET',
            timeout: 5000
        };

        const client = url.protocol === 'https:' ? https : http;
        
        const req = client.request(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                if (res.statusCode === 200 || res.statusCode === 400) {
                    // 400 is normal for GraphQL endpoint without query
                    resolve({ success: true, data });
                } else {
                    resolve({ success: false, error: `HTTP ${res.statusCode}` });
                }
            });
        });

        req.on('error', (error) => {
            resolve({ success: false, error: error.message });
        });

        req.on('timeout', () => {
            req.destroy();
            resolve({ success: false, error: 'Timeout' });
        });

        req.end();
    });
}

// Test GraphQL with a simple query
function testGraphQLQuery() {
    return new Promise((resolve) => {
        const query = {
            query: `
                query CheckPlugins {
                    __schema {
                        types {
                            name
                        }
                    }
                }
            `
        };

        const postData = JSON.stringify(query);
        const url = new URL(WORDPRESS_URL);
        
        const options = {
            hostname: url.hostname,
            port: url.port,
            path: url.pathname,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData)
            },
            timeout: 10000
        };

        const client = url.protocol === 'https:' ? https : http;
        
        const req = client.request(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const result = JSON.parse(data);
                    if (result.data && result.data.__schema) {
                        const types = result.data.__schema.types.map(t => t.name);
                        resolve({ 
                            success: true, 
                            types,
                            hasVideo: types.includes('Video'),
                            hasVideoCategory: types.includes('VideoCategory'),
                            wpGraphQLActive: types.includes('RootQuery')
                        });
                    } else {
                        resolve({ success: false, error: 'Invalid GraphQL response', data });
                    }
                } catch (e) {
                    resolve({ success: false, error: 'JSON parse error', raw: data });
                }
            });
        });

        req.on('error', (error) => {
            resolve({ success: false, error: error.message });
        });

        req.on('timeout', () => {
            req.destroy();
            resolve({ success: false, error: 'GraphQL query timeout' });
        });

        req.write(postData);
        req.end();
    });
}

async function main() {
    // Test 1: Basic endpoint check
    console.log('📡 Testing GraphQL endpoint...');
    const endpointCheck = await checkGraphQLEndpoint();
    
    if (endpointCheck.success) {
        console.log('✅ GraphQL endpoint: RESPONDING');
    } else {
        console.log('❌ GraphQL endpoint: ERROR');
        console.log('   Error:', endpointCheck.error);
        console.log('\n💡 Troubleshooting:');
        console.log('   1. Make sure Local by Flywheel site is running');
        console.log('   2. Check if WPGraphQL plugin is installed');
        console.log('   3. Verify the GraphQL URL is correct');
        return;
    }

    // Test 2: GraphQL schema check
    console.log('\n🔍 Testing GraphQL schema...');
    const schemaCheck = await testGraphQLQuery();
    
    if (schemaCheck.success) {
        console.log('✅ GraphQL schema: ACCESSIBLE');
        console.log('   WPGraphQL active:', schemaCheck.wpGraphQLActive ? '✅ YES' : '❌ NO');
        console.log('   Video type available:', schemaCheck.hasVideo ? '✅ YES' : '❌ NO');
        console.log('   VideoCategory available:', schemaCheck.hasVideoCategory ? '✅ YES' : '❌ NO');
        
        if (!schemaCheck.wpGraphQLActive) {
            console.log('\n⚠️  WPGraphQL plugin appears to be inactive or not installed');
            console.log('   Install from: https://wordpress.org/plugins/wp-graphql/');
        }
        
        if (!schemaCheck.hasVideo) {
            console.log('\n⚠️  Video post type not exposed to GraphQL');
            console.log('   Check functions.php for: show_in_graphql => true');
        }
    } else {
        console.log('❌ GraphQL schema: ERROR');
        console.log('   Error:', schemaCheck.error);
        if (schemaCheck.raw) {
            console.log('   Raw response:', schemaCheck.raw.substring(0, 200));
        }
    }

    console.log('\n==================================================');
    console.log('📋 NEXT STEPS:');
    console.log('');
    console.log('1. 🔧 Check WordPress Admin:');
    console.log('   - Visit:', ADMIN_URL);
    console.log('   - Look for "Videos" menu in sidebar');
    console.log('   - Check if WPGraphQL plugin is active');
    console.log('');
    console.log('2. 🔌 Required Plugins:');
    console.log('   - WPGraphQL (for API access)');
    console.log('   - Advanced Custom Fields (for video fields)');
    console.log('   - WPGraphQL for ACF (connects ACF to GraphQL)');
    console.log('');
    console.log('3. 📝 If Videos menu exists but GraphQL fails:');
    console.log('   - Check: show_in_graphql => true in functions.php');
    console.log('   - Flush permalinks: Settings → Permalinks → Save');
    console.log('   - Restart Local by Flywheel site');
}

main().catch(console.error);
