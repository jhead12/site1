# Content Backups

This directory contains backups of your Contentful data exports.

## Backup Types

### Automatic Backups
- `data-backup-YYYY-MM-DD.json` - Daily backup of current data.json before export
- `contentful-export-YYYY-MM-DD-HH-MM-SS.json` - Timestamped fresh exports

### Manual Backups
- Created when you run backup scripts manually
- Includes full content export with metadata

## Usage

### Create New Backup
```bash
npm run backup:create
```

### Dry Run (Test)
```bash
npm run backup:dry-run
```

### Export Fresh Content
```bash
npm run export-content
```

### Update Provision Data
```bash
npm run backup-and-provision
```

## Backup Process

1. **Backup Current**: Saves existing data.json
2. **Export Fresh**: Downloads latest from Contentful
3. **Validate**: Checks export integrity
4. **Timestamp**: Creates dated backup copy
5. **Update**: Refreshes provision data

## Restore Process

To restore from backup:
1. Copy desired backup file to `scripts/data.json`
2. Run `npm run gatsby-provision` to apply

## Environment Variables

Required for backups:
- `CONTENTFUL_SPACE_ID` or `SPACE_ID`
- `CONTENTFUL_MANAGEMENT_TOKEN` or `MANAGEMENT_TOKEN`

## File Naming

- `data-backup-2025-06-16.json` - Current data backup
- `contentful-export-2025-06-16T14-30-00-000Z.json` - Fresh export

## Retention

Consider keeping:
- **Daily backups**: 7 days
- **Weekly backups**: 4 weeks  
- **Monthly backups**: 12 months
- **Major releases**: Indefinitely
