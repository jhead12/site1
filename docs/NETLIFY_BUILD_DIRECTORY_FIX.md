# Netlify Build Error Fix: Missing Directory

## Problem

Netlify builds were failing with an error related to a missing directory:
```
ENOENT: no such file or directory, scandir '/opt/build/repo/static/audio'
```

This error occurs because `gatsby-source-filesystem` is configured to use the `/static/audio` directory, but this directory doesn't exist by default in the Netlify build environment.

## Solution

We've implemented a robust solution to prevent this error:

1. Enhanced the `ensure-directories.js` script which now:
   - Creates the `static/audio` directory if it doesn't exist
   - Uses absolute paths resolved from the project root to ensure consistent behavior across environments
   - Adds placeholder files (`placeholder.js` and `.gitkeep`) in the directory to ensure it's valid for gatsby-source-filesystem
   - Runs automatically before every build via package.json script hooks

2. Added the directory and placeholder files to the git repository to ensure they persist

## Implementation Details

1. Updated the `ensure-directories.js` script in the `scripts` folder with improved path handling
2. Added placeholder files to prevent issues with empty directories
3. Ensured the script creates both directories and placeholder files consistently
4. Used absolute paths to fix the issue with relative paths in the Netlify environment

## How to Test

- Run `yarn ensure-dirs` locally to manually test the script
- Run `yarn build` or `yarn build:netlify` locally, which will include the directory check
- Check that the `/static/audio` directory contains the placeholder files

## Note for Future Development

When adding real audio files to the site:

1. Place them in the `/static/audio/` directory
2. Reference them in components using the path `/static/audio/your-file.mp3`
3. The placeholder files can be safely deleted once real audio files are added

## Future Improvements

If additional directories need to be ensured in the build environment, simply add them to the `requiredDirs` array in `scripts/ensure-directories.js`.
