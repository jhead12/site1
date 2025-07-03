#!/bin/bash
echo "Starting build test..."
cd /Volumes/PRO-BLADE/Github/jeldonmusic_com/site1
yarn build 2>&1 | head -100
echo "Build test completed."
