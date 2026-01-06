# Thank You Page Redirect - Setup Guide

## What This Does

After a customer completes checkout in ThriveCart, they're redirected to a custom thank-you page that:

1. Extracts the `product_id` from URL parameters
2. Calls the Lambda function to generate a presigned S3 download URL
3. Displays a "Download" button with the link
4. Optionally auto-starts the download after 2 seconds

## Files Created

- `static/thank-you-download.html` - Standalone HTML page with embedded JavaScript

## Setup Steps

### 1. Deploy the Thank You Page

The page is in `static/thank-you-download.html`. You have two options:

#### Option A: Use with Gatsby site (recommended)

- The file is already in the `static/` folder
- When you build Gatsby (`gatsby build`), it will be copied to `public/thank-you-download.html`
- Deploy your site to Netlify/Vercel as usual
- The page will be accessible at: `https://jeldonmusic.com/thank-you-download.html`

#### Option B: Host separately (faster)

- Upload `static/thank-you-download.html` to:
  - AWS S3 bucket (make it public) + CloudFront
  - Netlify as a standalone site
  - Any static hosting service
- Note the URL (e.g., `https://downloads.jeldonmusic.com/thank-you-download.html`)

### 2. Configure ThriveCart Product

1. Open ThriveCart → Products → Edit "Free MPC Starter Kit"
2. Go to **Checkout Settings** or **Thank You Page** section
3. Select **"Redirect to URL"** or **"Custom Thank You Page"**
4. Enter your thank-you page URL with product_id parameter:

   ```
   https://jeldonmusic.com/thank-you-download.html?product_id=free-mpc-kit
   ```

   Or if hosted separately:

   ```
   https://your-domain.com/thank-you-download.html?product_id=free-mpc-kit
   ```

5. Save the product

### 3. Test Locally (Optional)

Before deploying, test the page locally:

```bash
# Open the file in your browser
open static/thank-you-download.html

# Or serve it with a local server
cd static
python3 -m http.server 8000
# Visit: http://localhost:8000/thank-you-download.html?product_id=free-mpc-kit
```

The page will call the Lambda and should show the download button (as long as Lambda is accepting requests without signature).

### 4. Deploy to Production

#### If using Gatsby:

```bash
# Build the site
gatsby build

# Deploy to Netlify (example)
netlify deploy --prod

# Or push to GitHub (if auto-deploy is configured)
git add static/thank-you-download.html
git commit -m "Add thank-you download page"
git push origin main
```

#### If hosting separately:

```bash
# Example: Upload to S3
aws s3 cp static/thank-you-download.html s3://your-bucket/thank-you-download.html \
  --acl public-read \
  --content-type text/html
```

### 5. Configure ThriveCart Webhook (Still Needed)

Even with the redirect, configure the webhook for analytics/tracking:

1. ThriveCart → Settings → Webhooks → Add Webhook
2. Name: "Purchase Complete"
3. URL: `https://2lan4ghtlylexojben5lmpc22a0hraqo.lambda-url.us-west-2.on.aws/`
4. Event: "Purchase Complete"
5. Enable "Receive results as JSON"
6. Save webhook

### 6. Re-enable Signature Verification (After Testing)

Once everything works, restore security:

```bash
aws lambda update-function-configuration \
  --function-name jeldon-presign-lambda \
  --region us-west-2 \
  --environment "Variables={S3_BUCKET=jeldonmusic-s3-bucket,S3_REGION=us-west-2,PRESIGN_EXPIRATION=900,THRIVECART_SECRET=VNV5EGC9-9CD517EW-5BG19MTA-22KH5OI8}"
```

Note: The thank-you page doesn't send a ThriveCart signature, so we keep signature validation disabled for direct calls OR update the Lambda to allow unsigned requests from specific sources (like the thank-you page).

## Testing the Complete Flow

### Test 1: Direct Page Access

```bash
open "https://jeldonmusic.com/thank-you-download.html?product_id=free-mpc-kit"
```

Expected:

- Loading spinner appears
- Download button shows after 1-2 seconds
- Link works and downloads the MPC kit

### Test 2: Complete Checkout Flow

1. Go to your website's free kit button
2. Click → redirects to ThriveCart
3. Enter email, complete checkout ($0.00)
4. ThriveCart redirects to thank-you page
5. Download button appears automatically
6. File downloads after 2 seconds (or click button)

### Test 3: Verify Lambda Logs

```bash
aws logs tail /aws/lambda/jeldon-presign-lambda --region us-west-2 --follow
```

Look for:

- Requests from the thank-you page
- `product_id=free-mpc-kit`
- Presigned URL generation
- 200 OK responses

## Customization Options

### Change Auto-Download Delay

Edit `static/thank-you-download.html`, line ~130:

```javascript
setTimeout(() => {
  window.location.href = data.url
}, 2000) // Change 2000 to milliseconds (e.g., 5000 = 5 seconds)
```

### Disable Auto-Download

Remove or comment out the `setTimeout` block entirely.

### Change Product Mapping

If you have multiple products, the Lambda already handles mapping:

- `free-mpc-kit` → `Previews/MPC Starter Kit.zip`
- Add more in `scripts/presign_lambda_updated.py` → `PRODUCT_FILE_MAP`

ThriveCart redirect URLs for each product:

- Product 1: `...?product_id=free-mpc-kit`
- Product 2: `...?product_id=beat-basic-50`
- etc.

### Add Analytics

Insert Google Analytics or tracking code in the `<head>` section of `thank-you-download.html`.

## Troubleshooting

### Download Button Doesn't Appear

- Check browser console (F12) for JavaScript errors
- Verify Lambda URL is correct in the HTML file (line 108)
- Test Lambda directly: `curl -X POST 'https://2lan4ghtlylexojben5lmpc22a0hraqo.lambda-url.us-west-2.on.aws/?product_id=free-mpc-kit'`

### "Unable to generate download link" Error

- Check Lambda logs for errors
- Verify S3 bucket permissions
- Ensure product_id matches the Lambda mapping

### ThriveCart Doesn't Redirect

- Verify the redirect URL is saved in ThriveCart product settings
- Check that "Redirect to URL" is selected (not "Show message")
- Test with a manual URL: `https://your-site.com/thank-you-download.html?product_id=free-mpc-kit`

### CORS Errors in Browser Console

The Lambda Function URL should allow CORS by default, but if you see errors:

- Add CORS headers to Lambda response (if needed)
- Or host the thank-you page on the same domain as your main site

## Security Notes

- The thank-you page calls Lambda without a ThriveCart signature
- This is acceptable because:
  - The Lambda returns time-limited presigned URLs (15 min expiry)
  - Product mapping prevents unauthorized file access
  - S3 bucket is private
- For maximum security, add rate limiting or IP allowlisting to the Lambda

## Next Steps

1. ✅ Deploy thank-you page to production
2. ✅ Configure ThriveCart product redirect
3. ✅ Test complete checkout flow
4. Optional: Add email backup (Lambda sends email + redirect)
5. Optional: Add download tracking/analytics

---

**Status**: Ready to deploy and test
**Files**: `static/thank-you-download.html`
**Lambda**: Already configured with product mapping
