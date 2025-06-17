# SSL Certificate Fix - IMPORTANT

This is a temporary fix for the expired SSL certificate on `blog.jeldonmusic.com`.

## Current Workarounds Applied:
1. Disabled SSL certificate validation in gatsby-config.js
2. Disabled SSL certificate validation in gatsby-node.js with `process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"`
3. Disabled SSL certificate validation in gatsby-config-dev.js

## IMPORTANT: Security Implications
Disabling SSL certificate validation is a security risk and should only be used as a temporary solution.

## Permanent Fix:
Please renew the SSL certificate for `blog.jeldonmusic.com` as soon as possible. Once the certificate is renewed, remove the workarounds from:
1. gatsby-config.js
2. gatsby-node.js
3. gatsby-config-dev.js

## How to Renew the SSL Certificate:
1. Contact your hosting provider to renew the SSL certificate
2. If using Let's Encrypt, run the certificate renewal process
3. If using a paid SSL provider, renew through their portal
4. Verify certificate renewal by checking the expiration date with a browser or SSL checker

## Date This Fix Was Applied:
June 17, 2025
