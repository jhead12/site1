# WordPress Schema Fix - June 21, 2025

## Issue

When running the build with `BYPASS_WORDPRESS=true`, we encountered an error:
```
error Type with name "WpMediaItem" does not exists
```

This was happening because when WordPress is bypassed, the WordPress GraphQL types aren't available, but our schema customization still referenced `WpMediaItem` in the `WpBeat_Beatfields` and `WpMix_Mixfields` types.

## Solution

We implemented two fixes:

1. **Changed field type references**:
   - Updated `audioFile` fields to reference the generic `File` type instead of `WpMediaItem`
   - This ensures that the fields can be resolved regardless of whether WordPress is available

2. **Added a fallback WpMediaItem type**:
   - Created a minimal `WpMediaItem` type definition that Gatsby can use when WordPress is bypassed
   - This ensures schema compatibility even when the WordPress source plugin isn't loaded

## Implementation Notes

- The type changes allow our schema to be valid in both WordPress and non-WordPress builds
- Referencing the generic `File` type means we can use the static audio files when WordPress is unavailable
- The mock `WpMediaItem` type includes enough fields to satisfy GraphQL queries that might reference it

## Testing

- Builds should now succeed with both `BYPASS_WORDPRESS=true` and with WordPress enabled
- Audio files should be properly referenced in both scenarios
- No schema errors should occur during build

## Related Changes

Previously, we fixed:
- Directory structure issues with `/static/audio`
- Added placeholder files for audio playback
- Enhanced error handling in the audio player component

This fix completes the WordPress bypassing solution, allowing builds to succeed reliably even when WordPress is unavailable.
