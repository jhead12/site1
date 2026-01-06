# Lambda Function URL - Fixed

## Issue Identified ✅

**Problem**: Lambda Function URL was returning `403 AccessDeniedException`

**Root Causes**:

1. **Missing Resource Policy**: The Lambda function lacked a resource-based policy to allow public invocation via Function URL
2. **URL Typo in Documentation**: Documentation had incorrect URL (`2lan4ghtylexojben5lmpc22a0hraqo` instead of `2lan4ghtlylexojben5lmpc22a0hraqo`)

## Resolution ✅

### 1. Added Function URL Permission

```bash
aws lambda add-permission \
  --function-name jeldon-presign-lambda \
  --statement-id FunctionURLAllowPublicAccess \
  --action lambda:InvokeFunctionUrl \
  --principal "*" \
  --function-url-auth-type NONE
```

This grants public access to the Function URL endpoint.

### 2. Corrected URL in All Documentation

**Correct URL**: `https://2lan4ghtlylexojben5lmpc22a0hraqo.lambda-url.us-west-2.on.aws/`

Updated in:

- ✅ docs/THRIVECART_INTEGRATION_COMPLETE_GUIDE.md (3 occurrences)
- ✅ docs/THRIVECART_QUICK_START.md (4 occurrences)
- ✅ docs/INTEGRATION_COMPLETE_SUMMARY.md (5 occurrences)
- ✅ scripts/deploy-lambda.sh (1 occurrence)
- ✅ scripts/check-integration-status.sh (2 occurrences)

## Current Behavior ✅

### Expected Responses

**Without ThriveCart Signature**:

```bash
curl -X POST 'https://2lan4ghtlylexojben5lmpc22a0hraqo.lambda-url.us-west-2.on.aws/'
# Returns: HTTP/1.1 403 Forbidden
# Body: {"message": "Invalid signature"}
```

This is **correct behavior** - the Lambda is validating ThriveCart webhook signatures.

**With Valid product_id (no signature requirement when THRIVECART_SECRET is removed)**:

```bash
curl -X POST 'https://2lan4ghtlylexojben5lmpc22a0hraqo.lambda-url.us-west-2.on.aws/?product_id=free-mpc-kit'
# Returns: HTTP/1.1 200 OK
# Body: {"url": "https://...presigned-url...", "expires_in": 900, ...}
```

**With ThriveCart Webhook (production)**:

- ThriveCart sends webhook with signature header
- Lambda validates signature using `THRIVECART_SECRET`
- Lambda generates presigned URL
- Returns 200 OK with download URL

## Status Codes Explained

| Code                                     | Meaning     | Cause                                                       |
| ---------------------------------------- | ----------- | ----------------------------------------------------------- |
| **200 OK**                               | ✅ Success  | Lambda processed request and generated presigned URL        |
| **403 Forbidden** (from Lambda)          | ⚠️ Expected | Lambda rejected due to invalid/missing ThriveCart signature |
| **403 AccessDeniedException** (from AWS) | ❌ Fixed    | Was missing resource-based policy (now resolved)            |
| **400 Bad Request**                      | ⚠️ Expected | Missing product_id or invalid product mapping               |

## Testing

### Test 1: Verify Function URL is Accessible (AWS Level)

```bash
curl -i https://2lan4ghtlylexojben5lmpc22a0hraqo.lambda-url.us-west-2.on.aws/
```

**Expected**: `HTTP/1.1 403 Forbidden` with `{"message": "Invalid signature"}`  
**Not**: `AccessDeniedException` from AWS

✅ **Status**: PASS - Getting Lambda's 403, not AWS AccessDeniedException

### Test 2: Direct Lambda Invocation (Bypass Function URL)

```bash
aws lambda invoke \
  --function-name jeldon-presign-lambda \
  --region us-west-2 \
  --cli-binary-format raw-in-base64-out \
  --payload '{"queryStringParameters":{"product_id":"free-mpc-kit"}}' \
  response.json && cat response.json
```

**Expected**: 200 OK with presigned URL (when THRIVECART_SECRET is unset)

✅ **Status**: PASS - Lambda generates presigned URLs correctly

### Test 3: ThriveCart Webhook (After Setup)

1. Configure webhook in ThriveCart dashboard
2. Use "Test Webhook" feature
3. Check Lambda CloudWatch logs

**Expected**: 200 OK with presigned URL returned to ThriveCart

⏳ **Status**: Pending ThriveCart configuration

## Security Notes

The Lambda Function URL is **intentionally public** with these security measures:

1. **Signature Verification**: Validates ThriveCart webhook signature using HMAC-SHA256
2. **Time-Limited URLs**: Presigned URLs expire after 15 minutes
3. **Private S3 Bucket**: File is not publicly accessible except via presigned URLs
4. **Product Mapping**: Only configured products can be accessed
5. **CloudWatch Logging**: All requests are logged for audit

## Next Steps

1. ✅ **Infrastructure**: Complete (Lambda accessible, permissions configured)
2. ⏳ **ThriveCart Product**: Create free product with ID `free-mpc-kit`
3. ⏳ **ThriveCart Webhook**: Configure webhook to Lambda URL
4. ⏳ **Contentful Update**: Change button link to ThriveCart checkout

See [THRIVECART_QUICK_START.md](THRIVECART_QUICK_START.md) for remaining steps.

---

**Date Fixed**: 2026-01-06  
**Lambda Version**: Latest (includes product mapping)  
**Function URL**: https://2lan4ghtlylexojben5lmpc22a0hraqo.lambda-url.us-west-2.on.aws/  
**Status**: ✅ Ready for ThriveCart Integration
