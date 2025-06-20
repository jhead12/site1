// scripts/setup-youtube-integration.js
/**
 * This script sets up the YouTube API integration for the Jeldon Music Platform.
 * This enables the rotating hero banner to always include the most recent YouTube videos.
 */

const fs = require('fs');
const path = require('path');

// Configuration
const config = {
  // Required plugins for YouTube integration
  plugins: [
    {
      name: "gatsby-source-youtube-v3",
      package: "gatsby-source-youtube-v3",
      config: {
        credentials: {
          // These will be read from environment variables
          // YOUTUBE_API_KEY is required in .env.development and .env.production
          apiKey: process.env.YOUTUBE_API_KEY,
        },
        channelId: "YOUR_YOUTUBE_CHANNEL_ID", // Replace with your actual channel ID
        maxVideos: 10, // Number of recent videos to fetch
        part: ["snippet", "id", "contentDetails"],
        showErrors: true,
      }
    }
  ],
  
  // Environment variables needed
  envVars: [
    {
      name: "YOUTUBE_API_KEY",
      description: "Google API Key with YouTube Data API v3 access",
      required: true
    }
  ],
  
  // Files to modify
  filesToUpdate: [
    {
      path: "gatsby-config.js",
      insertionPoint: "plugins: [",
      indent: 4,
      code: `
    // YouTube Data API integration - added by setup-youtube-integration.js
    {
      resolve: 'gatsby-source-youtube-v3',
      options: {
        credentials: {
          apiKey: process.env.YOUTUBE_API_KEY,
        },
        channelId: "YOUR_YOUTUBE_CHANNEL_ID", // Replace with your actual channel ID
        maxVideos: 10,
        part: ["snippet", "id", "contentDetails"],
        showErrors: true,
      }
    },`
    }
  ],
  
  // Sample .env variables
  envSample: `
# YouTube integration
YOUTUBE_API_KEY=your_google_api_key_here
`
};

/**
 * Check if package.json has required dependencies
 */
function checkDependencies() {
  console.log('Checking required dependencies...');
  
  const packageJsonPath = path.resolve(process.cwd(), 'package.json');
  
  if (!fs.existsSync(packageJsonPath)) {
    console.error('❌ package.json not found in the current directory');
    process.exit(1);
  }
  
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };
  
  const missingDeps = [];
  
  config.plugins.forEach(plugin => {
    if (!dependencies[plugin.package]) {
      missingDeps.push(plugin.package);
    }
  });
  
  if (missingDeps.length > 0) {
    console.log(`⚠️  Missing dependencies: ${missingDeps.join(', ')}`);
    console.log('Installing missing dependencies...');
    
    // You could run the installation here, but for safety we'll just show the command
    console.log(`\nRun this command to install missing dependencies:`);
    console.log(`yarn add ${missingDeps.join(' ')}`);
    
    return false;
  }
  
  console.log('✅ All required dependencies are installed');
  return true;
}

/**
 * Update gatsby-config.js to include YouTube plugin
 */
function updateGatsbyConfig() {
  console.log('Updating gatsby-config.js...');
  
  const configUpdate = config.filesToUpdate.find(f => f.path === 'gatsby-config.js');
  
  if (!configUpdate) {
    console.log('⚠️  No gatsby-config.js update defined in configuration');
    return;
  }
  
  const configPath = path.resolve(process.cwd(), configUpdate.path);
  
  if (!fs.existsSync(configPath)) {
    console.error('❌ gatsby-config.js not found');
    return;
  }
  
  let configContent = fs.readFileSync(configPath, 'utf8');
  
  // Check if the plugin is already installed
  if (configContent.includes('gatsby-source-youtube-v3')) {
    console.log('✅ gatsby-source-youtube-v3 already configured in gatsby-config.js');
    return;
  }
  
  // Find insertion point
  const insertionPoint = configContent.indexOf(configUpdate.insertionPoint);
  
  if (insertionPoint === -1) {
    console.error('❌ Could not find insertion point in gatsby-config.js');
    return;
  }
  
  // Insert the new plugin configuration
  const insertionOffset = insertionPoint + configUpdate.insertionPoint.length;
  const updatedContent = 
    configContent.substring(0, insertionOffset) + 
    configUpdate.code + 
    configContent.substring(insertionOffset);
  
  // Backup original file
  fs.writeFileSync(`${configPath}.backup`, configContent);
  
  // Write updated config
  fs.writeFileSync(configPath, updatedContent);
  
  console.log('✅ gatsby-config.js updated with YouTube API integration');
}

/**
 * Update .env.development and .env.example files
 */
function updateEnvFiles() {
  console.log('Updating environment files...');
  
  const envDevPath = path.resolve(process.cwd(), '.env.development');
  const envExamplePath = path.resolve(process.cwd(), '.env.example');
  
  // Update or create .env.development
  let envDevContent = '';
  if (fs.existsSync(envDevPath)) {
    envDevContent = fs.readFileSync(envDevPath, 'utf8');
  }
  
  if (!envDevContent.includes('YOUTUBE_API_KEY')) {
    envDevContent += config.envSample;
    fs.writeFileSync(envDevPath, envDevContent);
    console.log('✅ Added YouTube environment variables to .env.development');
  } else {
    console.log('ℹ️  YouTube environment variables already exist in .env.development');
  }
  
  // Update or create .env.example
  let envExampleContent = '';
  if (fs.existsSync(envExamplePath)) {
    envExampleContent = fs.readFileSync(envExamplePath, 'utf8');
  }
  
  if (!envExampleContent.includes('YOUTUBE_API_KEY')) {
    envExampleContent += config.envSample;
    fs.writeFileSync(envExamplePath, envExampleContent);
    console.log('✅ Added YouTube environment variables to .env.example');
  } else {
    console.log('ℹ️  YouTube environment variables already exist in .env.example');
  }
}

/**
 * Main function
 */
function main() {
  console.log('🎬 Setting up YouTube integration for the rotating hero banner...\n');
  
  const depsOk = checkDependencies();
  if (!depsOk) {
    console.log('\n⚠️  Please install the missing dependencies before continuing.');
    console.log('Run the setup script again after installing dependencies.');
    return;
  }
  
  updateGatsbyConfig();
  updateEnvFiles();
  
  console.log('\n🎉 YouTube integration setup complete!');
  console.log('\n📋 Next steps:');
  console.log('1. Get a Google API key with YouTube Data API v3 access');
  console.log('2. Add your API key to .env.development and .env.production');
  console.log('3. Replace YOUR_YOUTUBE_CHANNEL_ID in gatsby-config.js with your actual channel ID');
  console.log('4. Run `gatsby clean && gatsby develop` to test the integration');
  console.log('\n🔍 Your latest YouTube videos will now automatically appear in the hero banner rotation!');
}

// Run the main function
main();
