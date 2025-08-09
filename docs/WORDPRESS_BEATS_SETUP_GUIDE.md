# WordPress Beats Setup Guide

## Installation Steps

### 1. Install the WordPress Setup File

1. Upload `wordpress-beats-setup.php` to your WordPress site (via FTP or file manager)
2. Access the file in your browser: `https://yoursite.com/wordpress-beats-setup.php`
3. This will create:
   - Custom post type "Beats"
   - Beat Genres taxonomy
   - Beat Keys taxonomy
   - All Advanced Custom Fields for beat management

### 2. Verify Installation

After running the setup, check your WordPress admin:

1. **Dashboard** → **Beats** should now appear in the menu
2. **Custom Fields** → **Field Groups** should show "Beat Details" and "Custom License Configuration"
3. **Beats** → **Genres** and **Beats** → **Keys** should be available

### 3. Create Your First Beat

1. Go to **Beats** → **Add New**
2. Fill in the beat title and description
3. Set the featured image (beat artwork)
4. Configure the following fields:

#### Basic Beat Information:
- **BPM**: Beat tempo (e.g., 140)
- **Duration**: Track length (e.g., "3:45")
- **Tags**: Comma-separated tags (e.g., "dark, melodic, trap")
- **Featured Beat**: Check if this should be highlighted

#### Audio Files:
- **Preview Audio**: Upload MP3 preview file
- **Full Audio**: Upload high-quality WAV files

#### Custom Pricing (Optional):
- **Basic License Price**: Override default $50
- **Premium License Price**: Override default $150
- **Exclusive License Price**: Override default $1000

#### Custom License Configuration (Advanced):
For each license type (Basic, Premium, Exclusive):
- **Enable/Disable**: Turn license types on/off per beat
- **Custom Names**: Override default license names
- **Custom Descriptions**: Personalized marketing copy
- **Contract Types**: Choose from Non-Exclusive, Exclusive Licensing, Complete Buyout, Custom Terms
- **Features Override**: Custom bullet points for each license

### 4. Set Genres and Keys

1. **Beats** → **Genres**: Add genres like "Hip Hop", "Trap", "Drill", "R&B"
2. **Beats** → **Keys**: Add musical keys like "C Major", "A Minor", "F# Minor"

### 5. Test the Integration

1. Publish a few beats with all fields filled
2. Visit your Gatsby site's `/beats` page
3. Click on individual beats to see the licensing options
4. Verify custom pricing and license configurations work

## WordPress Field Structure

### Beat Details Group:
- `bpm` (Number)
- `duration` (Text)
- `tags` (Text)
- `featured` (True/False)
- `preview_audio` (File)
- `full_audio` (File)

### Custom Pricing Group:
- `basic_price` (Number)
- `premium_price` (Number)
- `exclusive_price` (Number)

### Custom Licenses Group:
For each license type (basic, premium, exclusive):
- `enabled` (True/False)
- `name` (Text)
- `description` (Text)
- `contract_type` (Select)
- `features` (Textarea)
- `popular` (True/False) - Premium only

## Troubleshooting

### GraphQL Errors
If you see GraphQL errors in Gatsby:
1. Make sure the WordPress setup file has been run
2. Restart your Gatsby development server
3. Check that Advanced Custom Fields plugin is active
4. Verify field groups are properly created

### Missing Fields
If custom fields don't appear:
1. Check that ACF plugin is installed and activated
2. Verify field groups are assigned to "Beats" post type
3. Re-run the setup file if needed

### No Beats Appearing
If beats don't show on the frontend:
1. Ensure beats are published (not drafts)
2. Check that gatsby-source-wordpress is configured correctly
3. Verify GraphQL queries are working in Gatsby's GraphQL explorer

## Next Steps

1. **Install WordPress Setup**: Run the setup file to create all necessary fields
2. **Add Content**: Create your first beats with full details
3. **Test Integration**: Verify everything works on the Gatsby frontend
4. **Customize**: Use the advanced licensing options for specific beats
5. **Scale**: Add more beats and organize with genres/keys

The system will fallback to static data if WordPress data isn't available, so your site will work during the transition period.
