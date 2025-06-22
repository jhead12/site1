# Audio Directory Fix - June 21, 2025

## Issue

The Netlify build was failing with the error:
```
error The path passed to gatsby-source-filesystem does not exist on your file system:
/opt/build/repo/static/audio
Please pick a path to an existing directory.
```

This happens because Gatsby's source-filesystem plugin requires the directories to exist at build time, but the `/static/audio` directory wasn't being included in the repository or created during the build process.

## Solution

We implemented a comprehensive solution:

1. **Enhanced Directory Creation Script**:
   - Updated `scripts/ensure-directories.js` to use absolute paths resolved from the project root
   - Added creation of both directories and necessary placeholder files
   - Ensured the script handles `/static/audio` and `/static/images` directories

2. **Added Placeholder Files**:
   - Created `.gitkeep` to ensure the directory is tracked in git
   - Added `placeholder.js` as a minimal file for the filesystem source
   - Created placeholder demo MP3 files for the audio player:
     - `/static/audio/demo-track-1.mp3`
     - `/static/audio/demo-track-2.mp3`
   - Added placeholder cover images:
     - `/static/images/demo-cover-1.jpg`
     - `/static/images/demo-cover-2.jpg`

3. **Updated Persistent Player Component**:
   - Added detection of placeholder audio files
   - Implemented simulated playback for placeholder files
   - Enhanced error handling for audio playback issues

4. **Updated Build Configuration**:
   - Ensured `yarn ensure-dirs` runs before every build
   - Added clarifying comments in `netlify.toml`
   - Updated documentation

## Testing

To ensure the fix works:

1. **Local Testing**:
   - Run `yarn ensure-dirs` to manually verify directory creation
   - Run `yarn build:netlify` to simulate a Netlify build locally

2. **Netlify Deployment**:
   - Push changes to repository to trigger a Netlify build
   - Verify that the build succeeds without the directory error

## Implementation Notes

- The enhanced script now reliably creates directories with absolute paths, working consistently in both local and Netlify environments
- Placeholder files ensure that even an empty directory will be treated as valid by gatsby-source-filesystem
- The player component gracefully handles placeholder files without errors, allowing for testing even without real audio files

## Future Recommendations

- When adding real audio files, place them in the `/static/audio/` directory
- You can safely replace the placeholder files with actual content when available
- Consider adding more robust file existence checks throughout the application
