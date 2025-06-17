# ACF Field Groups Manual Import Guide

Since the automated script requires Local by Flywheel to be running, here's how to manually import the ACF field groups:

## Prerequisites
1. **Start Local by Flywheel**
   - Open Local by Flywheel application
   - Start the "w-jeldonmusic" site
   - Verify it's accessible at: http://w-jeldonmusic.local

2. **Verify Required Plugins**
   - Advanced Custom Fields Pro
   - WP GraphQL
   - WP GraphQL for ACF

## Manual Import Steps

### Method 1: WordPress Admin Interface
1. **Access WordPress Admin**
   - Go to http://w-jeldonmusic.local/wp-admin
   - Login with your credentials

2. **Navigate to ACF Import Tool**
   - Go to **Custom Fields** → **Tools**
   - Click on **Import Field Groups**

3. **Import Each Field Group**
   Import these files one by one:
   - `scripts/acf-beats-fields.json` → Beat Information fields
   - `scripts/acf-tutorials-fields.json` → Tutorial Information fields  
   - `scripts/acf-mixes-fields.json` → Mix Information fields

4. **Verify Import**
   - Go to **Custom Fields** → **Field Groups**
   - You should see:
     - Beat Information
     - Tutorial Information
     - Mix Information

### Method 2: WP-CLI (if WordPress is running)
```bash
# Navigate to WordPress directory
cd "/Users/jeldonmusic/Local Sites/w-jeldonmusic/app/public"

# Import each field group
wp acf import /path/to/scripts/acf-beats-fields.json
wp acf import /path/to/scripts/acf-tutorials-fields.json  
wp acf import /path/to/scripts/acf-mixes-fields.json

# Verify import
wp acf list
```

### Method 3: Automated Script
Once WordPress is running, use our automated script:
```bash
cd /Volumes/PRO-BLADE/Github/jeldonmusic_com/site1
yarn wp:import-acf
```

## Field Group Assignment
After import, verify that field groups are assigned to the correct post types:

1. **Beat Information** → `beats` post type
2. **Tutorial Information** → `tutorials` post type  
3. **Mix Information** → `mixes` post type

## Testing GraphQL Integration
After successful import, test the GraphQL integration:

1. **Visit GraphQL IDE**
   - Go to: http://w-jeldonmusic.local/graphql

2. **Test Query**
   ```graphql
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
   ```

## Next Steps After Import
1. Create sample content for each post type
2. Test GraphQL queries with real data
3. Build Gatsby templates and components
4. Implement frontend display logic

## Troubleshooting
- **Field groups not showing**: Check plugin activation
- **GraphQL fields missing**: Verify WP GraphQL for ACF is active
- **Import fails**: Check JSON file formatting
- **Assignment issues**: Manually assign in field group settings
