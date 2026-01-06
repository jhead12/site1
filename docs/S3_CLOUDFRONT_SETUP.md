# S3 + CloudFront + ThriveCart Integration Setup

## Current Problem

- Using public S3 URL: `https://jeldonmusic-s3-bucket.s3.us-west-2.amazonaws.com/Previews/mpc_quickstart_kit.zip`
- No email capture, no tracking, no security

## Solution Architecture

```
User → ThriveCart Checkout ($0) → Webhook → Lambda → S3 Presigned URL → Email
```

---

## Step 1: Secure Your S3 Bucket

### 1.1 Block Public Access

```bash
# Remove public access
aws s3api put-public-access-block \
  --bucket jeldonmusic-s3-bucket \
  --public-access-block-configuration \
    "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true"
```

### 1.2 Create Proper Folder Structure

```bash
# Move file to correct location
aws s3 mv \
  s3://jeldonmusic-s3-bucket/Previews/mpc_quickstart_kit.zip \
  s3://jeldonmusic-s3-bucket/free/mpc_quickstart_kit.zip

# Create folder structure
aws s3api put-object --bucket jeldonmusic-s3-bucket --key free/
aws s3api put-object --bucket jeldonmusic-s3-bucket --key paid/
aws s3api put-object --bucket jeldonmusic-s3-bucket --key previews/
```

---

## Step 2: Create CloudFront Distribution

### 2.1 Create Origin Access Control (OAC)

```bash
aws cloudfront create-origin-access-control \
  --origin-access-control-config \
    "Name=jeldon-s3-oac,
     Description=OAC for jeldonmusic S3 bucket,
     SigningProtocol=sigv4,
     SigningBehavior=always,
     OriginAccessControlOriginType=s3"

# Note the ID from response
```

### 2.2 Create Distribution (save to cloudfront-config.json first)

```json
{
  "CallerReference": "jeldon-music-2026-01-05",
  "Comment": "Jeldon Music Asset Delivery",
  "Origins": {
    "Quantity": 1,
    "Items": [
      {
        "Id": "jeldon-s3-bucket",
        "DomainName": "jeldonmusic-s3-bucket.s3.us-west-2.amazonaws.com",
        "S3OriginConfig": {
          "OriginAccessIdentity": ""
        },
        "OriginAccessControlId": "YOUR_OAC_ID_FROM_STEP_2.1"
      }
    ]
  },
  "DefaultCacheBehavior": {
    "TargetOriginId": "jeldon-s3-bucket",
    "ViewerProtocolPolicy": "redirect-to-https",
    "AllowedMethods": {
      "Quantity": 2,
      "Items": ["GET", "HEAD"]
    },
    "CachedMethods": {
      "Quantity": 2,
      "Items": ["GET", "HEAD"]
    },
    "Compress": true,
    "MinTTL": 0,
    "DefaultTTL": 86400,
    "MaxTTL": 31536000
  },
  "Enabled": true,
  "PriceClass": "PriceClass_100"
}
```

```bash
aws cloudfront create-distribution \
  --distribution-config file://cloudfront-config.json

# Note the Distribution ID and Domain Name from response
```

### 2.3 Update S3 Bucket Policy

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowCloudFrontServicePrincipal",
      "Effect": "Allow",
      "Principal": {
        "Service": "cloudfront.amazonaws.com"
      },
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::jeldonmusic-s3-bucket/*",
      "Condition": {
        "StringEquals": {
          "AWS:SourceArn": "arn:aws:cloudfront::YOUR_ACCOUNT_ID:distribution/YOUR_DISTRIBUTION_ID"
        }
      }
    }
  ]
}
```

```bash
# Apply policy
aws s3api put-bucket-policy \
  --bucket jeldonmusic-s3-bucket \
  --policy file://bucket-policy.json
```

---

## Step 3: Lambda Function for Presigned URLs

### 3.1 Create Lambda Function

**File: `lambda/thrivecart-webhook/index.js`**

```javascript
const AWS = require("aws-sdk")
const crypto = require("crypto")

const s3 = new AWS.S3()
const ses = new AWS.SES({ region: "us-east-1" })

// Product mapping
const PRODUCT_FILES = {
  free_mpc_kit: "free/mpc_quickstart_kit.zip",
  premium_kit: "paid/premium_drum_kit.zip",
  exclusive_kit: "paid/exclusive_samples.zip",
}

exports.handler = async (event) => {
  try {
    // Parse webhook payload
    const body = JSON.parse(event.body)

    // Verify ThriveCart signature
    const isValid = verifyThriveCartSignature(
      body,
      event.headers["x-thrivecart-signature"],
      process.env.THRIVECART_WEBHOOK_SECRET
    )

    if (!isValid) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: "Invalid signature" }),
      }
    }

    // Extract order details
    const { customer, order, event: eventType } = body

    // Only process successful orders
    if (eventType !== "order.success") {
      return {
        statusCode: 200,
        body: JSON.stringify({ message: "Event ignored" }),
      }
    }

    // Get file path based on product
    const productId = order.product_id
    const fileKey = PRODUCT_FILES[productId]

    if (!fileKey) {
      throw new Error(`Unknown product: ${productId}`)
    }

    // Generate presigned URL (15 minutes)
    const downloadUrl = s3.getSignedUrl("getObject", {
      Bucket: process.env.S3_BUCKET,
      Key: fileKey,
      Expires: 900,
      ResponseContentDisposition: "attachment",
    })

    // Send email with download link
    await sendDownloadEmail(customer, order, downloadUrl)

    // Log to CloudWatch
    console.log("Download email sent:", {
      email: customer.email,
      product: productId,
      orderId: order.id,
    })

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Download link sent",
        orderId: order.id,
      }),
    }
  } catch (error) {
    console.error("Error:", error)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    }
  }
}

function verifyThriveCartSignature(body, signature, secret) {
  const hmac = crypto.createHmac("sha256", secret)
  const payload = JSON.stringify(body)
  const calculatedSignature = hmac.update(payload).digest("hex")
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(calculatedSignature)
  )
}

async function sendDownloadEmail(customer, order, downloadUrl) {
  const params = {
    Source: "downloads@jeldonmusic.com",
    Destination: {
      ToAddresses: [customer.email],
    },
    Message: {
      Subject: {
        Data: `Your ${order.product_name} is Ready!`,
      },
      Body: {
        Html: {
          Data: `
            <!DOCTYPE html>
            <html>
            <head>
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .button { 
                  display: inline-block;
                  padding: 12px 24px;
                  background: #8B5CF6;
                  color: white;
                  text-decoration: none;
                  border-radius: 6px;
                  font-weight: bold;
                }
                .footer { margin-top: 30px; font-size: 12px; color: #666; }
              </style>
            </head>
            <body>
              <div class="container">
                <h1>Thanks for your order, ${customer.first_name}!</h1>
                <p>Your download is ready. Click the button below to get your ${order.product_name}:</p>
                
                <p style="text-align: center; margin: 30px 0;">
                  <a href="${downloadUrl}" class="button">Download Now</a>
                </p>
                
                <p><strong>Important:</strong> This link expires in 15 minutes for security.</p>
                
                <p>If you have any issues, reply to this email or contact support@jeldonmusic.com</p>
                
                <div class="footer">
                  <p>Order ID: ${order.id}</p>
                  <p>&copy; 2026 Jeldon Music. All rights reserved.</p>
                </div>
              </div>
            </body>
            </html>
          `,
        },
      },
    },
  }

  return ses.sendEmail(params).promise()
}
```

### 3.2 Create Lambda Deployment Package

```bash
# Create directory
mkdir -p lambda/thrivecart-webhook
cd lambda/thrivecart-webhook

# Initialize npm and install dependencies
npm init -y
npm install aws-sdk

# Create deployment package
zip -r function.zip index.js node_modules/

# Upload to Lambda
aws lambda create-function \
  --function-name thrivecart-download-webhook \
  --runtime nodejs18.x \
  --role arn:aws:iam::YOUR_ACCOUNT_ID:role/lambda-execution-role \
  --handler index.handler \
  --zip-file fileb://function.zip \
  --environment Variables="{
    S3_BUCKET=jeldonmusic-s3-bucket,
    THRIVECART_WEBHOOK_SECRET=your_webhook_secret
  }" \
  --timeout 30 \
  --memory-size 256
```

### 3.3 Create API Gateway

```bash
# Create REST API
aws apigatewayv2 create-api \
  --name thrivecart-webhook \
  --protocol-type HTTP \
  --target arn:aws:lambda:us-west-2:YOUR_ACCOUNT_ID:function:thrivecart-download-webhook

# Note the API endpoint URL
```

---

## Step 4: Configure ThriveCart

### 4.1 Create Free Product

1. Login to ThriveCart
2. Products → Add Product
3. Settings:
   - **Name:** Free MPC Quickstart Kit
   - **Price:** $0.00
   - **Product ID:** `free_mpc_kit`
   - **Require Email:** YES

### 4.2 Set Up Webhook

1. Products → Your Product → Integrations
2. Add Webhook:
   - **URL:** Your API Gateway endpoint
   - **Events:** Order Success
   - **Secret:** Generate strong secret and save to Lambda env vars

### 4.3 Test Webhook

```bash
# Test Lambda directly
aws lambda invoke \
  --function-name thrivecart-download-webhook \
  --payload file://test-event.json \
  response.json

cat response.json
```

---

## Step 5: Update Contentful

Update the download button in Contentful (Entry ID: `7LsDVMfKSMx4bvLvDfyqkW`):

**Old URL:**

```
https://jeldonmusic-s3-bucket.s3.us-west-2.amazonaws.com/Previews/mpc_quickstart_kit.zip
```

**New URL:**

```
https://nomoneyblanks.thrivecart.com/free-mpc-kit/
```

---

## Step 6: Testing Checklist

- [ ] Public S3 access blocked
- [ ] File accessible via CloudFront (internal testing only)
- [ ] Lambda function deploys successfully
- [ ] API Gateway returns 200 for test webhook
- [ ] ThriveCart product created and published
- [ ] Webhook configured with correct endpoint
- [ ] Test purchase completes
- [ ] Email arrives with download link
- [ ] Download link works and expires after 15 minutes
- [ ] Contentful button updated
- [ ] Homepage button redirects to ThriveCart

---

## Monitoring & Maintenance

### CloudWatch Logs

```bash
# View Lambda logs
aws logs tail /aws/lambda/thrivecart-download-webhook --follow

# View errors only
aws logs filter-log-events \
  --log-group-name /aws/lambda/thrivecart-download-webhook \
  --filter-pattern "ERROR"
```

### Cost Monitoring

```bash
# Check S3 usage
aws cloudwatch get-metric-statistics \
  --namespace AWS/S3 \
  --metric-name BucketSizeBytes \
  --dimensions Name=BucketName,Value=jeldonmusic-s3-bucket \
  --start-time 2026-01-01T00:00:00Z \
  --end-time 2026-01-31T23:59:59Z \
  --period 86400 \
  --statistics Average
```

---

## Troubleshooting

### Issue: Download link not working

1. Check Lambda logs for errors
2. Verify S3 bucket policy allows CloudFront OAC
3. Test presigned URL generation manually

### Issue: Email not arriving

1. Verify SES sending limit (sandbox vs production)
2. Check SES bounce/complaint rates
3. Verify email address is verified in SES (if in sandbox)

### Issue: ThriveCart webhook failing

1. Check webhook logs in ThriveCart dashboard
2. Verify API Gateway is accessible
3. Test Lambda function directly with sample payload

---

## Security Best Practices

1. **Rotate webhook secret** every 90 days
2. **Monitor CloudWatch** for unusual activity
3. **Set S3 lifecycle policies** to archive old files
4. **Enable MFA** on AWS account
5. **Use least-privilege IAM roles** for Lambda
6. **Keep presigned URL TTL short** (15 minutes max)
7. **Log all download attempts** for audit trail

---

## Cost Estimate (Monthly)

- **S3 Storage:** ~$0.50 (assuming 20GB)
- **CloudFront:** ~$2-5 (1000 downloads)
- **Lambda:** ~$0.20 (included in free tier)
- **API Gateway:** ~$0.10 (included in free tier)
- **SES:** $0.10 per 1000 emails
- **Total:** ~$3-6/month for 1000 downloads

---

## Next Steps

Once working:

1. Add custom domain: downloads.jeldonmusic.com
2. Create paid products with similar flow
3. Set up email automation sequence
4. Add analytics tracking
5. A/B test checkout pages
