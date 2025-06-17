#!/bin/bash

# This script disables WordPress integration by using the alternate config
# Run this script if SSL certificate issues can't be resolved

echo "Disabling WordPress integration due to SSL certificate issues..."
cp gatsby-config-no-wp.js gatsby-config.js
echo "WordPress integration disabled. You can now run 'yarn build'."
