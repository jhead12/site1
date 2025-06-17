# SSL Certificate Fix - IMPORTANT

This is a temporary fix for the expired SSL certificate on `blog.jeldonmusic.com`.

## Current Workarounds Applied:
1. Simplified the WordPress source plugin configuration in gatsby-config.js
2. Added `NODE_TLS_REJECT_UNAUTHORIZED=0` directly to the build command in netlify.toml
3. Added `NODE_TLS_REJECT_UNAUTHORIZED=0` to .env.production
4. Created fallback config (gatsby-config-no-wp.js) and script to disable WordPress if needed

## IMPORTANT: Security Implications
Disabling SSL certificate validation is a security risk and should only be used as a temporary solution.

## Fallback Options If Build Still Fails:
1. Run `./scripts/disable-wordpress.sh` to completely disable WordPress integration
2. Use `yarn build:no-wp` to build without WordPress integration

## Permanent Fix:
Please renew the SSL certificate for `blog.jeldonmusic.com` as soon as possible. Once the certificate is renewed:
1. Remove `NODE_TLS_REJECT_UNAUTHORIZED=0` from netlify.toml build command
2. Remove `NODE_TLS_REJECT_UNAUTHORIZED=0` from .env.production
3. Restore proper WordPress configuration in gatsby-config.js
4. Remove the fallback configurations (gatsby-config-no-wp.js)

## How to Renew the SSL Certificate:
1. Contact your hosting provider to renew the SSL certificate
2. If using Let's Encrypt, run the certificate renewal process
3. If using a paid SSL provider, renew through their portal
4. Verify certificate renewal by checking the expiration date with a browser or SSL checker

## Date This Fix Was Applied:
June 17, 2025
