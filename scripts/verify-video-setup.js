#!/usr/bin/env node

/**
 * WordPress Video Setup Verification Script
 * Checks current setup status and guides next steps
 */

require('dotenv').config();
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

// Configuration
const WORDPRESS_URL = process.env.WPGRAPHQL_URL || 'http://w-jeldonmusic.local/graphql';
const CHECK_TIMEOUT = 5000; // 5 seconds

console.log('🔍 WordPress Video Setup Verification\n');
console.log('=' .repeat(50));

// Test WordPress Connection
async function testWordPressConnection() {
    console.log('📡 Testing WordPress connection...');
    
    try {
        const response = await fetch(WORDPRESS_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: `
                    query TestConnection {
                        generalSettings {
                            title
                            url
                        }
                    }
                `
            }),
            timeout: CHECK_TIMEOUT
        });

        if (response.ok) {
            const data = await response.json();
            console.log('✅ WordPress connection: SUCCESS');
            console.log(`   Site: ${data.data?.generalSettings?.title || 'Unknown'}`);
            console.log(`   URL: ${data.data?.generalSettings?.url || 'Unknown'}`);
            return true;
        } else {
            console.log('❌ WordPress connection: FAILED');
            console.log(`   Status: ${response.status} ${response.statusText}`);
            return false;
        }
    } catch (error) {
        console.log('❌ WordPress connection: FAILED');
        console.log(`   Error: ${error.message}`);
        console.log('   💡 Make sure Local by Flywheel is running');
        return false;
    }
}

// Check for Video Post Type
async function checkVideoPostType() {
    console.log('\n🎬 Checking for Video post type...');
    
    try {
        const response = await fetch(WORDPRESS_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: `
                    query CheckVideoPostType {
                        videos: allVideo(first: 1) {
                            nodes {
                                id
                                title
                            }
                        }
                    }
                `
            }),
            timeout: CHECK_TIMEOUT
        });

        const data = await response.json();
        
        if (data.errors) {
            console.log('❌ Video post type: NOT FOUND');
            console.log('   💡 Need to add video post type to functions.php');
            return false;
        } else {
            console.log('✅ Video post type: FOUND');
            const videoCount = data.data?.videos?.nodes?.length || 0;
            console.log(`   Videos in database: ${videoCount}`);
            return true;
        }
    } catch (error) {
        console.log('❌ Video post type check: FAILED');
        console.log(`   Error: ${error.message}`);
        return false;
    }
}

// Check for Video Categories
async function checkVideoCategories() {
    console.log('\n🏷️ Checking for Video categories...');
    
    try {
        const response = await fetch(WORDPRESS_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: `
                    query CheckVideoCategories {
                        videoCategories: allVideoCategory(first: 10) {
                            nodes {
                                id
                                name
                                slug
                                count
                            }
                        }
                    }
                `
            }),
            timeout: CHECK_TIMEOUT
        });

        const data = await response.json();
        
        if (data.errors) {
            console.log('❌ Video categories: NOT FOUND');
            console.log('   💡 Need to register video_category taxonomy');
            return false;
        } else {
            console.log('✅ Video categories: FOUND');
            const categories = data.data?.videoCategories?.nodes || [];
            console.log(`   Categories available: ${categories.length}`);
            if (categories.length > 0) {
                categories.forEach(cat => {
                    console.log(`   - ${cat.name} (${cat.count} videos)`);
                });
            }
            return true;
        }
    } catch (error) {
        console.log('❌ Video categories check: FAILED');
        console.log(`   Error: ${error.message}`);
        return false;
    }
}

// Check for ACF Video Fields
async function checkACFVideoFields() {
    console.log('\n🔧 Checking for ACF Video fields...');
    
    try {
        const response = await fetch(WORDPRESS_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: `
                    query CheckACFFields {
                        videos: allVideo(first: 1) {
                            nodes {
                                id
                                title
                                videoDetails {
                                    youtubeVideoId
                                    videoDuration
                                    videoViews
                                }
                            }
                        }
                    }
                `
            }),
            timeout: CHECK_TIMEOUT
        });

        const data = await response.json();
        
        if (data.errors) {
            const hasVideoDetailsError = data.errors.some(error => 
                error.message.includes('videoDetails') || 
                error.message.includes('youtubeVideoId')
            );
            
            if (hasVideoDetailsError) {
                console.log('❌ ACF Video fields: NOT FOUND');
                console.log('   💡 Need to create ACF field group for videos');
                return false;
            }
        }
        
        console.log('✅ ACF Video fields: FOUND');
        console.log('   Available fields: youtubeVideoId, videoDuration, videoViews');
        return true;
    } catch (error) {
        console.log('❌ ACF fields check: FAILED');
        console.log(`   Error: ${error.message}`);
        return false;
    }
}

// Check Gatsby Configuration
function checkGatsbyConfig() {
    console.log('\n⚙️ Checking Gatsby configuration...');
    
    const gatsbyNodePath = './gatsby-node.js';
    
    if (!fs.existsSync(gatsbyNodePath)) {
        console.log('❌ gatsby-node.js: NOT FOUND');
        return false;
    }
    
    const gatsbyNodeContent = fs.readFileSync(gatsbyNodePath, 'utf8');
    
    // Check if video types are commented out
    const hasVideoTypes = gatsbyNodeContent.includes('type WpVideo implements Node');
    const hasVideoQueries = gatsbyNodeContent.includes('allWpVideo');
    const hasVideoPageGeneration = gatsbyNodeContent.includes('videos.forEach');
    
    console.log('📝 Gatsby Node Configuration:');
    console.log(`   Video type definitions: ${hasVideoTypes ? '✅ Found' : '❌ Missing/Commented'}`);
    console.log(`   Video GraphQL queries: ${hasVideoQueries ? '✅ Found' : '❌ Missing/Commented'}`);
    console.log(`   Video page generation: ${hasVideoPageGeneration ? '✅ Found' : '❌ Missing/Commented'}`);
    
    return hasVideoTypes && hasVideoQueries && hasVideoPageGeneration;
}

// Check Video Template Files
function checkVideoTemplates() {
    console.log('\n📄 Checking video template files...');
    
    const videoTemplatePath = './src/templates/video.js';
    const videosPagePath = './src/pages/videos.js';
    
    const templates = [
        { path: videoTemplatePath, name: 'Video template' },
        { path: videosPagePath, name: 'Videos page' }
    ];
    
    let allFound = true;
    
    templates.forEach(template => {
        if (fs.existsSync(template.path)) {
            const content = fs.readFileSync(template.path, 'utf8');
            const hasPlaceholder = content.includes('placeholder') || content.includes('Coming Soon');
            const hasGraphQL = content.includes('export const query');
            
            console.log(`   ${template.name}: ✅ Found`);
            console.log(`     - Uses placeholder data: ${hasPlaceholder ? '⚠️ Yes' : '✅ No'}`);
            console.log(`     - Has GraphQL query: ${hasGraphQL ? '✅ Yes' : '❌ No'}`);
        } else {
            console.log(`   ${template.name}: ❌ Missing`);
            allFound = false;
        }
    });
    
    return allFound;
}

// Generate Setup Recommendations
function generateRecommendations(results) {
    console.log('\n' + '=' .repeat(50));
    console.log('📋 SETUP RECOMMENDATIONS\n');
    
    const { wordpress, videoPostType, videoCategories, acfFields, gatsbyConfig, templates } = results;
    
    if (!wordpress) {
        console.log('🚨 CRITICAL: Start WordPress First');
        console.log('   1. Open Local by Flywheel');
        console.log('   2. Start "w-jeldonmusic" site');
        console.log('   3. Verify site loads at http://w-jeldonmusic.local');
        console.log('');
        return;
    }
    
    if (!videoPostType || !videoCategories) {
        console.log('🔧 STEP 1: Add Video Post Type to WordPress');
        console.log('   1. Copy code from: scripts/wordpress-video-setup-complete.php');
        console.log('   2. WordPress Admin → Appearance → Theme Editor → functions.php');
        console.log('   3. Paste code at bottom and save');
        console.log('   4. Look for "Videos" menu in WordPress admin');
        console.log('');
    }
    
    if (!acfFields) {
        console.log('🏷️ STEP 2: Create ACF Video Fields');
        console.log('   1. WordPress Admin → Custom Fields → Field Groups → Add New');
        console.log('   2. Follow guide: docs/ACF_VIDEO_FIELDS_SETUP.md');
        console.log('   3. Add YouTube ID, Duration, Views, Tags fields');
        console.log('   4. Set location rule: Post Type = video');
        console.log('');
    }
    
    if (!gatsbyConfig) {
        console.log('⚙️ STEP 3: Enable Gatsby Video Queries');
        console.log('   1. Edit gatsby-node.js');
        console.log('   2. Uncomment video type definitions (around line 1109)');
        console.log('   3. Uncomment allWpVideo queries (around line 1205)');
        console.log('   4. Uncomment video page generation (around line 1314)');
        console.log('');
    }
    
    if (videoPostType && acfFields && gatsbyConfig) {
        console.log('🎉 READY FOR REAL CONTENT!');
        console.log('   1. Add test videos in WordPress');
        console.log('   2. Update video templates to use real data');
        console.log('   3. Run: gatsby clean && gatsby develop');
        console.log('   4. Visit /videos to see real content');
        console.log('');
    }
    
    console.log('📚 Full guides available in:');
    console.log('   - docs/YOUTUBE_INTEGRATION_CHECKLIST.md');
    console.log('   - docs/ACF_VIDEO_FIELDS_SETUP.md');
    console.log('   - docs/YOUTUBE_AUTO_SYNC_GUIDE.md');
}

// Main execution
async function main() {
    console.log(`🎯 Target WordPress URL: ${WORDPRESS_URL}\n`);
    
    const results = {
        wordpress: await testWordPressConnection(),
        videoPostType: false,
        videoCategories: false,
        acfFields: false,
        gatsbyConfig: false,
        templates: false
    };
    
    if (results.wordpress) {
        results.videoPostType = await checkVideoPostType();
        results.videoCategories = await checkVideoCategories();
        results.acfFields = await checkACFVideoFields();
    }
    
    results.gatsbyConfig = checkGatsbyConfig();
    results.templates = checkVideoTemplates();
    
    generateRecommendations(results);
    
    // Calculate completion percentage
    const totalChecks = Object.keys(results).length;
    const passedChecks = Object.values(results).filter(Boolean).length;
    const completionPercentage = Math.round((passedChecks / totalChecks) * 100);
    
    console.log(`\n🎯 Setup Completion: ${completionPercentage}% (${passedChecks}/${totalChecks} checks passed)`);
    
    if (completionPercentage === 100) {
        console.log('🚀 All checks passed! Ready to add real video content.');
    } else if (completionPercentage >= 50) {
        console.log('⚡ Good progress! A few more steps to complete setup.');
    } else {
        console.log('🔧 Setup needed. Follow the recommendations above.');
    }
}

main().catch(error => {
    console.error('💥 Verification script failed:', error.message);
    process.exit(1);
});
