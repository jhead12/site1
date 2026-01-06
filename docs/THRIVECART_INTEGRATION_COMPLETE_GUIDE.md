# ThriveCart Integration - Complete Setup Guide

## Current Status ✅

Your AWS infrastructure is **ready to go**:

- ✅ Lambda function: `jeldon-presign-lambda` (Python 3.11)
- ✅ S3 bucket: `jeldonmusic-s3-bucket` (private)
- ✅ Function URL: https://2lan4ghtlylexojben5lmpc22a0hraqo.lambda-url.us-west-2.on.aws/
- ✅ Environment variables configured
- ✅ File location: `Previews/MPC Starter Kit.zip` (56.2 MB)

## Architecture Overview

```
User clicks button → ThriveCart (email capture) → Webhook → Lambda → Presigned S3 URL → User downloads
```

## Step 1: Create ThriveCart Free Product

1. Log into ThriveCart: https://thrivecart.com/login (account: nomoneyblanks)
2. Go to **Products** → **Add Product**
3. Configure:

   - **Product Name**: Free MPC Starter Kit
   - **Price**: $0.00
   - **Product ID**: `free-mpc-kit` (will be in URL)
   - **Checkout Mode**: Standard
   - **Enable Product**: ON

4. Under **Checkout Settings**:

   - **Require Email**: ON (critical for lead capture)
   - **Custom Fields**: Optional (name, music style, etc.)
   - **Thank You Page**: Custom redirect or message with instructions

5. Save the product and note the checkout URL:
   ```
   https://nomoneyblanks.thrivecart.com/free-mpc-kit/
   ```

## Step 2: Configure ThriveCart Webhook

1. In ThriveCart, go to **Settings** → **Webhooks** or **Integrations**
2. Click **Add Webhook**
3. Configure:

   - **Event**: Purchase Complete (or Order Complete)
   - **URL**: `https://2lan4ghtlylexojben5lmpc22a0hraqo.lambda-url.us-west-2.on.aws/`
   - **Method**: POST
   - **Headers**: None needed (signature in body)
   - **Test Mode**: OFF (unless testing)

4. **Critical**: Add custom field in webhook payload:

   ```json
   {
     "s3_key": "Previews/MPC Starter Kit.zip"
   }
   ```

   Check ThriveCart docs on how to add custom data to webhooks. You may need to:

   - Use webhook bumps/custom fields
   - Or modify Lambda to map product IDs to files

5. Get the **Webhook Secret**:

   - ThriveCart generates this automatically
   - Copy it (looks like: `VNV5EGC9-EGLNFA59-BC4Y34MV-ZUW36AYS`)
   - Update Lambda if different from current: `VNV5EGC9-9CD517EW-5BG19MTA-22KH5OI8`

6. Test the webhook:
   - ThriveCart has a "Test Webhook" button
   - Should return 200 with presigned URL

## Step 3: Lambda Product Mapping (Recommended)

Instead of passing `s3_key` from ThriveCart, map product IDs to files in Lambda:

1. Update Lambda code to add product mapping:

```python
# Add after line 12 (after THRIVECART_SECRET)

# Map ThriveCart product IDs to S3 keys
PRODUCT_FILE_MAP = {
    "free-mpc-kit": "Previews/MPC Starter Kit.zip",
    "free_mpc_kit": "Previews/MPC Starter Kit.zip",  # alternate format
    # Add more products:
    # "beat-basic-50": "Beats/Basic_Bundle.zip",
    # "beat-premium-150": "Beats/Premium_Bundle.zip",
}
```

2. Update the handler to use product mapping:

```python
# Replace lines 42-51 with:

# Get product ID from ThriveCart webhook
product_id = None
if isinstance(body, dict):
    # ThriveCart sends product info in various fields
    product_id = body.get("product_id") or body.get("product") or body.get("sku")
    # Also check for custom s3_key override
    s3_key = body.get("s3_key")
elif event.get("queryStringParameters"):
    product_id = event["queryStringParameters"].get("product_id")
    s3_key = event["queryStringParameters"].get("s3_key")

# Map product ID to S3 key
if not s3_key:
    if product_id and product_id in PRODUCT_FILE_MAP:
        s3_key = PRODUCT_FILE_MAP[product_id]
    else:
        logger.error(f"Unknown product_id: {product_id}")
        return {
            "statusCode": 400,
            "body": json.dumps({
                "message": f"Unknown product: {product_id}",
                "available_products": list(PRODUCT_FILE_MAP.keys())
            })
        }

if not s3_key:
    return {"statusCode": 400, "body": json.dumps({"message": "missing s3_key"})}
```

3. Deploy updated Lambda:

```bash
cd /tmp
# Update presign_lambda.py with mapping code
zip lambda-code-updated.zip presign_lambda.py
aws lambda update-function-code \
  --function-name jeldon-presign-lambda \
  --region us-west-2 \
  --zip-file fileb://lambda-code-updated.zip
```

## Step 4: Update Contentful Download Button

1. Open Contentful: https://app.contentful.com/spaces/esrzm688xldd/
2. Find entry ID: `7LsDVMfKSMx4bvLvDfyqkW`
3. Update the button link:
   - **Current**: `https://jeldonmusic-s3-bucket.s3.us-west-2.amazonaws.com/Previews/mpc_quickstart_kit.zip`
   - **New**: `https://nomoneyblanks.thrivecart.com/free-mpc-kit/`
4. Update button text (optional):
   - **Current**: "Download Free Kit (No Email necessary)"
   - **Suggested**: "Get Your Free MPC Starter Kit" or "Claim Free Kit"
5. Save and publish

## Step 5: Test Complete Flow

### Manual Test:

1. Go to your website's download button
2. Click → Should redirect to ThriveCart
3. Enter email on ThriveCart checkout ($0.00)
4. Submit → ThriveCart webhook fires
5. Check AWS CloudWatch Logs for Lambda execution
6. ThriveCart should redirect to thank you page
7. User should receive download link (either from Lambda or ThriveCart)

### Lambda Direct Test (without ThriveCart):

```bash
# Test presigned URL generation directly
curl -X POST \
  'https://2lan4ghtlylexojben5lmpc22a0hraqo.lambda-url.us-west-2.on.aws/?product_id=free-mpc-kit' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

Expected response:

```json
{
  "url": "https://jeldonmusic-s3-bucket.s3.us-west-2.amazonaws.com/Previews/MPC%20Starter%20Kit.zip?X-Amz-..."
}
```

## Step 6: Email Delivery (Optional Enhancement)

Currently, Lambda only returns presigned URL to ThriveCart. To send email directly:

1. Set up AWS SES (Simple Email Service):

```bash
aws ses verify-email-identity --email-address support@jeldonmusic.com --region us-west-2
```

2. Add SES permissions to Lambda IAM role:

```json
{
  "Effect": "Allow",
  "Action": ["ses:SendEmail", "ses:SendRawEmail"],
  "Resource": "*"
}
```

3. Update Lambda to send email after presigned URL generation:

```python
import boto3
ses = boto3.client('ses', region_name='us-west-2')

# After generating presigned URL...
buyer_email = body.get("customer", {}).get("email")
if buyer_email:
    ses.send_email(
        Source='support@jeldonmusic.com',
        Destination={'ToAddresses': [buyer_email]},
        Message={
            'Subject': {'Data': 'Your Free MPC Starter Kit Download'},
            'Body': {
                'Html': {'Data': f'''
                    <h2>Thanks for grabbing the MPC Starter Kit!</h2>
                    <p>Click below to download (link expires in 15 minutes):</p>
                    <a href="{url}">Download MPC Starter Kit</a>
                '''}
            }
        }
    )
```

## Monitoring & Troubleshooting

### View Lambda Logs:

```bash
aws logs tail /aws/lambda/jeldon-presign-lambda --region us-west-2 --follow
```

### Check ThriveCart Webhook Logs:

- ThriveCart dashboard → Webhooks → View delivery logs
- Look for 200 responses (success) vs 403/500 (errors)

### Common Issues:

**403 Invalid Signature:**

- Webhook secret mismatch
- Fix: Update Lambda env var `THRIVECART_SECRET`

**400 Missing s3_key:**

- Product not mapped in Lambda
- Fix: Add product_id to PRODUCT_FILE_MAP

**S3 Access Denied:**

- Lambda IAM role lacks S3 permissions
- Fix: Add `s3:GetObject` permission for bucket

**Presigned URL Expired:**

- Default: 15 minutes (900 seconds)
- Increase: Update Lambda env `PRESIGN_EXPIRATION=3600` (1 hour)

## Next Steps After Integration

1. **Analytics**: Track conversions in ThriveCart dashboard
2. **Email Marketing**: Export leads to email platform
3. **A/B Testing**: Test button copy, form fields
4. **Upsells**: Offer paid kits on thank you page
5. **CloudFront**: Add CDN for faster downloads (optional)

## Cost Estimate

- **Lambda**: ~$0.0000002 per request (effectively free for first 1M requests/month)
- **S3**: ~$0.023/GB storage + $0.09/GB transfer out
  - 56MB file = 0.056GB
  - 1000 downloads = 56GB transfer = ~$5.04/month
- **ThriveCart**: $0 (already have account)
- **Total**: ~$5-10/month for 1000 downloads

## Security Checklist

- ✅ S3 bucket is private (no public access)
- ✅ Lambda uses presigned URLs (time-limited)
- ✅ ThriveCart webhook signature verification
- ✅ HTTPS on all endpoints
- ⏳ Consider CloudFront with OAC for additional security
- ⏳ Set up AWS CloudWatch alarms for errors

## Summary

Your infrastructure is **95% ready**. The only remaining tasks are:

1. Create ThriveCart free product (5 min)
2. Configure webhook to Lambda URL (5 min)
3. Update Contentful button link (2 min)
4. Test complete flow (5 min)

**Total time to complete: ~20 minutes**

Then you'll have:

- ✅ Email capture on every download
- ✅ Lead generation for marketing
- ✅ Secure, tracked file delivery
- ✅ Scalable infrastructure
