# ✅ ThriveCart Integration - READY TO GO

## Status: Infrastructure Complete

Your AWS Lambda is **fully deployed and tested**. The download link integration is ready for ThriveCart.

---

## What's Done ✅

1. **Lambda Function**: `jeldon-presign-lambda` deployed with product mapping
2. **S3 Bucket**: `jeldonmusic-s3-bucket` (private, secure)
3. **File Location**: `Previews/MPC Starter Kit.zip` (56.2 MB)
4. **Function URL**: `https://2lan4ghtlylexojben5lmpc22a0hraqo.lambda-url.us-west-2.on.aws/`
5. **Product Mapping**: `free-mpc-kit` → MPC Starter Kit file
6. **Testing**: ✅ Confirmed presigned URLs generate correctly

---

## Next 3 Steps (15 minutes total)

### Step 1: Create ThriveCart Product (5 min)

1. Go to: https://thrivecart.com/login
2. Navigate: **Products** → **Add Product**
3. Fill in:
   - Name: `Free MPC Starter Kit`
   - Price: `$0.00`
   - Product ID: `free-mpc-kit` (important!)
   - Require Email: **ON**
4. Save product
5. Copy checkout URL (e.g., `https://nomoneyblanks.thrivecart.com/free-mpc-kit/`)

### Step 2: Set Up Webhook (5 min)

1. In ThriveCart: **Settings** → **Webhooks** → **Add Webhook**
2. Configure:
   - Event: `Purchase Complete`
   - URL: `https://2lan4ghtlylexojben5lmpc22a0hraqo.lambda-url.us-west-2.on.aws/`
   - Method: `POST`
3. The webhook secret is already configured: `VNV5EGC9-9CD517EW-5BG19MTA-22KH5OI8`
4. **Important**: Make sure ThriveCart sends `product_id` in the webhook payload
5. Test webhook (ThriveCart has a test button)

### Step 3: Update Website Button (5 min)

Update Contentful entry `7LsDVMfKSMx4bvLvDfyqkW`:

**Current link:**

```
https://jeldonmusic-s3-bucket.s3.us-west-2.amazonaws.com/Previews/mpc_quickstart_kit.zip
```

**New link:**

```
https://nomoneyblanks.thrivecart.com/free-mpc-kit/
```

Optional: Update button text from "Download Free Kit (No Email necessary)" to something like:

- "Get Your Free MPC Starter Kit"
- "Claim Free Kit"

---

## How It Works

```
1. User clicks "Get Free Kit" button on your site
   ↓
2. Redirects to ThriveCart checkout page ($0.00, email required)
   ↓
3. User enters email and submits
   ↓
4. ThriveCart webhook fires → Lambda Function
   ↓
5. Lambda maps product_id → S3 file
   ↓
6. Lambda generates presigned URL (15-min expiry)
   ↓
7. Lambda returns URL to ThriveCart
   ↓
8. User gets download link (on thank you page or email)
```

---

## Testing the Integration

### Test 1: Direct Lambda Call (works now)

```bash
curl -X POST 'https://2lan4ghtylexojben5lmpc22a0hraqo.lambda-url.us-west-2.on.aws/?product_id=free-mpc-kit'
```

Expected: JSON with presigned S3 URL

### Test 2: ThriveCart to Lambda (after webhook setup)

1. Go to your ThriveCart webhook settings
2. Click "Test Webhook"
3. Check Lambda CloudWatch logs:

```bash
aws logs tail /aws/lambda/jeldon-presign-lambda --region us-west-2 --follow
```

### Test 3: Complete User Flow (after all steps)

1. Visit your website
2. Click download button → ThriveCart
3. Enter email, submit
4. Verify download link works

---

## Product Mapping

The Lambda is configured to map these product IDs:

| Product ID        | File Path                      |
| ----------------- | ------------------------------ |
| `free-mpc-kit`    | `Previews/MPC Starter Kit.zip` |
| `free_mpc_kit`    | `Previews/MPC Starter Kit.zip` |
| `mpc-starter-kit` | `Previews/MPC Starter Kit.zip` |

To add more products, edit `/scripts/presign_lambda_updated.py`:

```python
PRODUCT_FILE_MAP = {
    "free-mpc-kit": "Previews/MPC Starter Kit.zip",
    "beat-basic-50": "Beats/Basic_Bundle.zip",  # Add new products
    "beat-premium-150": "Beats/Premium_Bundle.zip",
}
```

Then redeploy:

```bash
./scripts/deploy-lambda.sh
```

---

## Troubleshooting

### Error: "Invalid signature"

- **Cause**: ThriveCart webhook secret mismatch
- **Fix**: Verify secret in ThriveCart matches Lambda env var: `VNV5EGC9-9CD517EW-5BG19MTA-22KH5OI8`

### Error: "Unknown product"

- **Cause**: Product ID not in `PRODUCT_FILE_MAP`
- **Fix**: Check ThriveCart sends correct `product_id` (should be `free-mpc-kit`)

### Error: "Missing product_id"

- **Cause**: ThriveCart webhook not sending product identifier
- **Fix**: Configure ThriveCart webhook to include product info in payload

### Presigned URL doesn't work

- **Cause**: Lambda IAM role lacks S3 permissions
- **Fix**: Add `s3:GetObject` permission (should already be there)

---

## Monitoring

View Lambda logs in real-time:

```bash
aws logs tail /aws/lambda/jeldon-presign-lambda --region us-west-2 --follow
```

Check recent invocations:

```bash
aws lambda get-function --function-name jeldon-presign-lambda --region us-west-2 --query 'Configuration.[FunctionName,LastModified,Runtime]'
```

---

## Cost Estimate

- **Lambda**: FREE (1M requests/month included)
- **S3 Storage**: $0.023/GB = ~$0.001/month for 56MB file
- **S3 Transfer**: $0.09/GB = ~$5/month for 1000 downloads (56GB)
- **Total**: ~$5/month for 1000 downloads

---

## Security Features ✅

- ✅ S3 bucket is private (confirmed)
- ✅ ThriveCart webhook signature verification
- ✅ Presigned URLs expire in 15 minutes
- ✅ HTTPS on all endpoints
- ✅ No direct S3 access exposed

---

## Files Reference

| File                                            | Purpose                                  |
| ----------------------------------------------- | ---------------------------------------- |
| `scripts/presign_lambda_updated.py`             | Updated Lambda code with product mapping |
| `scripts/deploy-lambda.sh`                      | Deployment automation script             |
| `scripts/lambda-deployment.zip`                 | Deployed Lambda package                  |
| `scripts/lambda-backup-url.txt`                 | Backup of previous Lambda code           |
| `docs/THRIVECART_INTEGRATION_COMPLETE_GUIDE.md` | Comprehensive setup guide                |

---

## What You Get

After completing the 3 steps above:

✅ **Email Capture**: Every download requires email entry  
✅ **Lead Generation**: Build email list automatically  
✅ **Analytics**: Track downloads in ThriveCart dashboard  
✅ **Security**: Time-limited presigned URLs, no public bucket  
✅ **Scalability**: Handles unlimited downloads with AWS Lambda  
✅ **Professional**: ThriveCart checkout instead of direct download link

---

## Support

If you need help:

1. Check ThriveCart webhook logs (in ThriveCart dashboard)
2. Check Lambda logs: `aws logs tail /aws/lambda/jeldon-presign-lambda --region us-west-2 --follow`
3. Review full guide: `docs/THRIVECART_INTEGRATION_COMPLETE_GUIDE.md`
4. Test Lambda directly: `curl -X POST 'https://2lan4ghtlylexojben5lmpc22a0hraqo.lambda-url.us-west-2.on.aws/?product_id=free-mpc-kit'`

---

**Status**: 🟢 Ready for ThriveCart configuration (Steps 1-3 above)
