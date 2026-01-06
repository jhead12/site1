# Multi-Product Setup Guide

## Overview

One thank-you page (`static/thank-you-download.html`) serves all products. Each product uses a different `product_id` parameter in the redirect URL.

## How It Works

```
ThriveCart Product → Redirect URL with product_id → Lambda maps product_id to S3 file → Download link
```

Example:

- Free MPC Kit: `?product_id=free-mpc-kit` → `Previews/MPC Starter Kit.zip`
- Beat Basic: `?product_id=beat-basic-50` → `Beats/Basic_Bundle.zip`

## Adding a New Product

### 1. Upload File to S3

```bash
# Upload your product file to S3
aws s3 cp /path/to/your-product.zip s3://jeldonmusic-s3-bucket/Products/your-product.zip --region us-west-2
```

### 2. Add Product Mapping to Lambda

Edit `scripts/presign_lambda_updated.py` and add your product to `PRODUCT_FILE_MAP`:

```python
PRODUCT_FILE_MAP = {
    "free-mpc-kit": "Previews/MPC Starter Kit.zip",
    "beat-basic-50": "Beats/Basic_Bundle.zip",        # New product
    "beat-premium-150": "Beats/Premium_Bundle.zip",   # Another product
    "your-product-id": "Products/your-product.zip",   # Your new product
}
```

**Product ID rules:**

- Use lowercase with hyphens: `my-product-name`
- No spaces or special characters
- Must match the ThriveCart redirect URL parameter

### 3. Deploy Updated Lambda

```bash
cd /Volumes/PRO-BLADE/Github/jeldonmusic_com/site1
./scripts/deploy-lambda.sh
```

Expected output:

```
✅ Lambda deployed with CORS headers
✅ SUCCESS: Lambda generated presigned URL
```

### 4. Configure ThriveCart Product

1. Open ThriveCart → Products → Create/Edit Product
2. Set product details (name, price, etc.)
3. Under **Thank You Page** settings:
   - Select "Redirect to URL"
   - Enter: `https://jeldonmusic.com/thank-you-download.html?product_id=your-product-id`
   - Replace `your-product-id` with the ID you added to the Lambda mapping
4. Save product

### 5. Test the Product

**Test URL directly:**

```
https://jeldonmusic.com/thank-you-download.html?product_id=your-product-id
```

**Complete checkout flow:**

1. Go to ThriveCart checkout page
2. Enter email, complete purchase
3. Should redirect to thank-you page
4. Download button appears with your product file

## Example Product Configurations

### Free Product ($0.00)

```
Product: Free MPC Starter Kit
Product ID: free-mpc-kit
Redirect URL: https://jeldonmusic.com/thank-you-download.html?product_id=free-mpc-kit
S3 File: Previews/MPC Starter Kit.zip
```

### Paid Product ($50.00)

```
Product: Beat Making Basic Bundle
Product ID: beat-basic-50
Redirect URL: https://jeldonmusic.com/thank-you-download.html?product_id=beat-basic-50
S3 File: Beats/Basic_Bundle.zip
```

### Premium Product ($150.00)

```
Product: Beat Making Premium Bundle
Product ID: beat-premium-150
Redirect URL: https://jeldonmusic.com/thank-you-download.html?product_id=beat-premium-150
S3 File: Beats/Premium_Bundle.zip
```

## Updating Existing Products

### Change Product File

1. Upload new file to S3
2. Update `PRODUCT_FILE_MAP` in Lambda
3. Redeploy Lambda: `./scripts/deploy-lambda.sh`

### Change Product ID

1. Update `PRODUCT_FILE_MAP` key in Lambda
2. Update ThriveCart redirect URL
3. Redeploy Lambda

## Troubleshooting

### "Unable to generate download link"

**Check Lambda logs:**

```bash
aws logs tail /aws/lambda/jeldon-presign-lambda --region us-west-2 --follow
```

**Common causes:**

- Product ID mismatch between ThriveCart URL and Lambda mapping
- File doesn't exist in S3 bucket
- S3 permissions issue

**Fix:**

```bash
# Verify file exists
aws s3 ls s3://jeldonmusic-s3-bucket/Products/ --region us-west-2

# Check Lambda mapping
cat scripts/presign_lambda_updated.py | grep -A 5 "PRODUCT_FILE_MAP"
```

### "Unknown product" error

The `product_id` in the URL doesn't match any key in `PRODUCT_FILE_MAP`.

**Fix:**

1. Check ThriveCart redirect URL parameter
2. Check Lambda `PRODUCT_FILE_MAP` keys
3. Ensure they match exactly (case-sensitive)

### Download link works but file not found

The S3 file path in `PRODUCT_FILE_MAP` is incorrect.

**Fix:**

1. Verify exact S3 path:
   ```bash
   aws s3 ls s3://jeldonmusic-s3-bucket/ --recursive --region us-west-2
   ```
2. Update `PRODUCT_FILE_MAP` with correct path
3. Redeploy Lambda

## Current Product List

View all configured products:

```bash
cat scripts/presign_lambda_updated.py | grep -A 10 "PRODUCT_FILE_MAP"
```

Current mappings:

- `free-mpc-kit` → `Previews/MPC Starter Kit.zip`
- `free_mpc_kit` → `Previews/MPC Starter Kit.zip` (alternate)
- `mpc-starter-kit` → `Previews/MPC Starter Kit.zip` (alternate)

## Security Notes

- Presigned URLs expire after 15 minutes (configurable via `PRESIGN_EXPIRATION`)
- S3 bucket is private - only accessible via presigned URLs
- CORS enabled for browser requests
- No ThriveCart signature required for thank-you page (intentional for UX)

## Maintenance

### Adding 10+ Products

If you have many products, consider organizing S3 files by category:

```
s3://jeldonmusic-s3-bucket/
  ├── Free/
  │   ├── mpc-starter-kit.zip
  │   └── free-samples.zip
  ├── Basic/
  │   ├── beat-bundle-1.zip
  │   └── drum-kit-basic.zip
  └── Premium/
      ├── master-bundle.zip
      └── exclusive-pack.zip
```

Update Lambda mapping to reflect structure:

```python
PRODUCT_FILE_MAP = {
    "free-mpc-kit": "Free/mpc-starter-kit.zip",
    "beat-basic-50": "Basic/beat-bundle-1.zip",
    "premium-bundle": "Premium/master-bundle.zip",
}
```

### Monitoring Downloads

Check Lambda invocations (download attempts):

```bash
aws cloudwatch get-metric-statistics \
  --namespace AWS/Lambda \
  --metric-name Invocations \
  --dimensions Name=FunctionName,Value=jeldon-presign-lambda \
  --start-time $(date -u -d '7 days ago' +%Y-%m-%dT%H:%M:%S) \
  --end-time $(date -u +%Y-%m-%dT%H:%M:%S) \
  --period 86400 \
  --statistics Sum \
  --region us-west-2
```

## Quick Reference

### Add Product Checklist

- [ ] Upload file to S3
- [ ] Add to `PRODUCT_FILE_MAP` in Lambda
- [ ] Deploy Lambda: `./scripts/deploy-lambda.sh`
- [ ] Create/edit ThriveCart product
- [ ] Set redirect URL with `product_id` parameter
- [ ] Test: visit redirect URL directly
- [ ] Test: complete checkout flow

### Files to Edit

- `scripts/presign_lambda_updated.py` - Product mappings
- ThriveCart dashboard - Redirect URLs

### Commands

```bash
# Deploy Lambda after changes
./scripts/deploy-lambda.sh

# Test product mapping
curl -X POST 'https://2lan4ghtlylexojben5lmpc22a0hraqo.lambda-url.us-west-2.on.aws/?product_id=YOUR_PRODUCT_ID'

# View Lambda logs
aws logs tail /aws/lambda/jeldon-presign-lambda --region us-west-2 --follow
```

---

**Status**: Production ready  
**Last Updated**: 2026-01-06  
**Thank You Page**: `static/thank-you-download.html`  
**Lambda Function**: `jeldon-presign-lambda`
