#!/usr/bin/env node

/**
 * Content Backup & Provision Update Script
 * Updates provision data with current Contentful content as backup
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

// Configuration
const BACKUP_DIR = './scripts/backups';
const DATA_FILE = './scripts/data.json';
const CURRENT_BACKUP = `${BACKUP_DIR}/data-backup-${new Date().toISOString().split('T')[0]}.json`;

// Ensure backup directory exists
if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

console.log('🚀 Starting content backup and provision update...\n');

// Step 1: Backup current data.json
function backupCurrentData() {
    return new Promise((resolve, reject) => {
        console.log('📦 Backing up current data.json...');
        
        if (fs.existsSync(DATA_FILE)) {
            try {
                fs.copyFileSync(DATA_FILE, CURRENT_BACKUP);
                console.log(`✅ Current data backed up to: ${CURRENT_BACKUP}`);
                resolve();
            } catch (error) {
                console.error('❌ Failed to backup current data:', error.message);
                reject(error);
            }
        } else {
            console.log('⚠️  No existing data.json found, skipping backup');
            resolve();
        }
    });
}

// Step 2: Export current Contentful content
function exportContentfulData() {
    return new Promise((resolve, reject) => {
        console.log('\n📥 Exporting current Contentful content...');
        
        const spaceId = process.env.CONTENTFUL_SPACE_ID || process.env.SPACE_ID;
        const managementToken = process.env.CONTENTFUL_MANAGEMENT_TOKEN || process.env.MANAGEMENT_TOKEN;
        
        if (!spaceId || !managementToken) {
            console.error('❌ Missing Contentful credentials in environment variables');
            console.log('Required: CONTENTFUL_SPACE_ID, CONTENTFUL_MANAGEMENT_TOKEN');
            reject(new Error('Missing Contentful credentials'));
            return;
        }
        
        const exportProcess = spawn('npx', [
            'contentful',
            'space',
            'export',
            '--space-id', spaceId,
            '--management-token', managementToken,
            '--export-dir', 'scripts',
            '--content-file', 'data.json'
        ], {
            stdio: 'inherit',
            env: { ...process.env }
        });
        
        exportProcess.on('close', (code) => {
            if (code === 0) {
                console.log('✅ Contentful export completed successfully');
                resolve();
            } else {
                console.error(`❌ Contentful export failed with code ${code}`);
                reject(new Error(`Export failed with code ${code}`));
            }
        });
        
        exportProcess.on('error', (error) => {
            console.error('❌ Failed to start export process:', error.message);
            reject(error);
        });
    });
}

// Step 3: Validate exported data
function validateExportedData() {
    return new Promise((resolve, reject) => {
        console.log('\n🔍 Validating exported data...');
        
        if (!fs.existsSync(DATA_FILE)) {
            reject(new Error('Export failed - data.json not found'));
            return;
        }
        
        try {
            const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
            const contentTypes = data.contentTypes?.length || 0;
            const entries = data.entries?.length || 0;
            const assets = data.assets?.length || 0;
            
            console.log(`✅ Export validation successful:`);
            console.log(`   📄 Content Types: ${contentTypes}`);
            console.log(`   📝 Entries: ${entries}`);
            console.log(`   🖼️  Assets: ${assets}`);
            
            if (contentTypes === 0 && entries === 0) {
                console.warn('⚠️  Warning: Export appears to be empty');
            }
            
            resolve({ contentTypes, entries, assets });
        } catch (error) {
            console.error('❌ Failed to validate exported data:', error.message);
            reject(error);
        }
    });
}

// Step 4: Create timestamped backup of new export
function createTimestampedBackup() {
    return new Promise((resolve, reject) => {
        console.log('\n💾 Creating timestamped backup...');
        
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const timestampedBackup = `${BACKUP_DIR}/contentful-export-${timestamp}.json`;
        
        try {
            fs.copyFileSync(DATA_FILE, timestampedBackup);
            console.log(`✅ Timestamped backup created: ${timestampedBackup}`);
            resolve(timestampedBackup);
        } catch (error) {
            console.error('❌ Failed to create timestamped backup:', error.message);
            reject(error);
        }
    });
}

// Step 5: Update package.json scripts with new backup info
function updatePackageJsonInfo() {
    return new Promise((resolve, reject) => {
        console.log('\n📦 Updating package.json backup info...');
        
        try {
            const packagePath = './package.json';
            const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
            
            // Add backup metadata
            if (!packageJson.backup) {
                packageJson.backup = {};
            }
            
            packageJson.backup.lastExport = new Date().toISOString();
            packageJson.backup.dataFile = DATA_FILE;
            packageJson.backup.backupDir = BACKUP_DIR;
            
            fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2));
            console.log('✅ Package.json updated with backup metadata');
            resolve();
        } catch (error) {
            console.error('❌ Failed to update package.json:', error.message);
            reject(error);
        }
    });
}

// Main execution
async function main() {
    try {
        await backupCurrentData();
        await exportContentfulData();
        const stats = await validateExportedData();
        const timestampedBackup = await createTimestampedBackup();
        await updatePackageJsonInfo();
        
        console.log('\n🎉 Content backup and provision update completed successfully!');
        console.log('\n📊 Summary:');
        console.log(`   📄 Content Types: ${stats.contentTypes}`);
        console.log(`   📝 Entries: ${stats.entries}`);
        console.log(`   🖼️  Assets: ${stats.assets}`);
        console.log(`   💾 Latest backup: ${timestampedBackup}`);
        console.log(`   📦 Provision data: ${DATA_FILE}`);
        
        console.log('\n💡 Next steps:');
        console.log('   • Your provision data (data.json) is now updated');
        console.log('   • Previous version backed up for safety');
        console.log('   • Run "npm run gatsby-provision" to apply to new environment');
        
    } catch (error) {
        console.error('\n💥 Backup process failed:', error.message);
        process.exit(1);
    }
}

// Handle script arguments
const args = process.argv.slice(2);
if (args.includes('--help') || args.includes('-h')) {
    console.log(`
📦 Content Backup & Provision Update Script

Usage: node backup-and-provision.js [options]

Options:
  --help, -h     Show this help message
  --dry-run      Simulate the process without making changes
  
Environment Variables:
  CONTENTFUL_SPACE_ID          Your Contentful space ID
  CONTENTFUL_MANAGEMENT_TOKEN  Your Contentful management token

This script will:
1. Backup your current data.json file
2. Export fresh content from Contentful
3. Validate the exported data
4. Create timestamped backups
5. Update provision data for deployment
`);
    process.exit(0);
}

if (args.includes('--dry-run')) {
    console.log('🧪 Dry run mode - simulating process...');
    console.log('In dry run mode, no files would be modified');
    process.exit(0);
}

main();
