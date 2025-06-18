# SSL Certificate Fix - IMPORTANT

This is a temporary fix for the expired SSL certificate on `blog.jeldonmusic.com`.

## Current Workarounds Applied:
1. Simplified the WordPress source plugin configuration in gatsby-config.js
2. Added `NODE_TLS_REJECT_UNAUTHORIZED=0` directly to the build command in netlify.toml
3. Added `NODE_TLS_REJECT_UNAUTHORIZED=0` to .env.production
4. Created fallback config (gatsby-config-no-wp.js) and script to disable WordPress if needed

## IMPORTANT: Security Implications
Disabling SSL certificate validation is a security risk and should only be used as a temporary solution.

## Permanent Fix:
Please renew the SSL certificate for `blog.jeldonmusic.com` as soon as possible. Once the certificate is renewed, remove the workarounds from:
1. package.json (remove `NODE_TLS_REJECT_UNAUTHORIZED=0` from build script)
2. netlify.toml (remove `NODE_TLS_REJECT_UNAUTHORIZED="0"` from build environment)
3. Remove the increased timeout settings in gatsby-config.js and gatsby-config-dev.js

## How to Renew the SSL Certificate:
1. Contact your hosting provider to renew the SSL certificate
2. If using Let's Encrypt, run the certificate renewal process
3. If using a paid SSL provider, renew through their portal
4. Verify certificate renewal by checking the expiration date with a browser or SSL checker

## Date This Fix Was Applied:
June 17, 2025
