#!/bin/bash

# Build script for Netlify to bypass WordPress connection issues
echo "Building site without WordPress connection..."
BYPASS_WORDPRESS=true gatsby build
