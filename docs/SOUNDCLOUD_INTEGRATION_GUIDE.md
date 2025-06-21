# SoundCloud Integration Guide

This guide explains how to complete the SoundCloud integration for beats and mixes in the Jeldon Music website.

## Overview

The music page is set up to display SoundCloud embeds for beats and mixes, but the ACF fields need to be imported into WordPress before the functionality works.

## Steps to Complete the Integration

1. **Import the SoundCloud ACF Fields**

   The SoundCloud fields definition file is already created at `scripts/acf-soundcloud-fields.json`. 
   
   Run the following command in the WordPress container:

   ```bash
   wp acf import /path/to/scripts/acf-soundcloud-fields.json
   ```

2. **Add Field Groups to Post Types**

   After importing, make sure the fields are assigned to the appropriate field groups:
   
   - The `soundcloudUrl` field should be added to the "Beat Information" field group
   - The `purchaseUrl` field should be added to the "Beat Information" field group
   - The `soundcloudUrl` field for mixes should be added to the "Mix Information" field group

3. **Update Content**

   For each beat or mix that should have a SoundCloud embed:
   
   - Edit the beat/mix in WordPress admin
   - Add the SoundCloud URL in the new field
   - Add purchase URLs for beats that are available for sale
   - Save the changes

4. **Restart Gatsby**

   To ensure the GraphQL schema is updated with the new fields:

   ```bash
   gatsby clean
   gatsby develop
   ```

## Schema Updates

The `gatsby-node.js` file has been updated with custom type definitions for the SoundCloud fields, but these will only take effect after the fields are properly imported into WordPress.

## Testing the Integration

After completing the above steps:

1. Visit the Music page on your development site
2. Verify that beats and mixes with SoundCloud URLs display the embedded player
3. Test that the "Listen on SoundCloud" and "Purchase" buttons work correctly

## Troubleshooting

If SoundCloud embeds are not appearing:

1. Check if the URLs are correctly entered in WordPress
2. Inspect GraphQL queries using GraphiQL explorer (http://localhost:8000/___graphql)
3. Verify that the URLs start with `https://soundcloud.com/`
4. Check browser console for any errors related to the SoundCloud iframe
