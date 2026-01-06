#!/bin/bash

echo "╔══════════════════════════════════════════════════════════════╗"
echo "║                                                              ║"
echo "║    🎵  ThriveCart Integration Status - jeldonmusic.com       ║"
echo "║                                                              ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""
echo "📊 INFRASTRUCTURE STATUS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check AWS credentials
echo -n "AWS Credentials: "
if aws sts get-caller-identity --region us-west-2 &>/dev/null; then
    ACCOUNT=$(aws sts get-caller-identity --query 'Account' --output text 2>/dev/null)
    echo "✅ Authenticated (Account: $ACCOUNT)"
else
    echo "❌ Not authenticated"
    exit 1
fi

# Check Lambda function
echo -n "Lambda Function: "
LAMBDA_STATUS=$(aws lambda get-function --function-name jeldon-presign-lambda --region us-west-2 --query 'Configuration.[FunctionName,Runtime,State]' --output text 2>/dev/null)
if [ $? -eq 0 ]; then
    RUNTIME=$(echo "$LAMBDA_STATUS" | awk '{print $2}')
    STATE=$(echo "$LAMBDA_STATUS" | awk '{print $3}')
    echo "✅ jeldon-presign-lambda ($RUNTIME, $STATE)"
else
    echo "❌ Function not found"
    exit 1
fi

# Check S3 bucket
echo -n "S3 Bucket: "
if aws s3 ls s3://jeldonmusic-s3-bucket --region us-west-2 &>/dev/null; then
    echo "✅ jeldonmusic-s3-bucket (accessible)"
else
    echo "❌ Not accessible"
    exit 1
fi

# Check MPC kit file
echo -n "MPC Starter Kit: "
FILE_SIZE=$(aws s3 ls s3://jeldonmusic-s3-bucket/Previews/ --region us-west-2 2>/dev/null | grep "MPC Starter Kit.zip" | awk '{print $3}')
if [ -n "$FILE_SIZE" ]; then
    SIZE_MB=$((FILE_SIZE / 1024 / 1024))
    echo "✅ Previews/MPC Starter Kit.zip (${SIZE_MB} MB)"
else
    echo "❌ File not found"
fi

# Check bucket public access
echo -n "Bucket Security: "
PUBLIC_BLOCK=$(aws s3api get-public-access-block --bucket jeldonmusic-s3-bucket --region us-west-2 --query 'PublicAccessBlockConfiguration.BlockPublicAcls' --output text 2>/dev/null)
if [ "$PUBLIC_BLOCK" == "True" ]; then
    echo "✅ Private (public access blocked)"
else
    echo "⚠️  Public access not fully blocked"
fi

# Check environment variables
echo -n "Lambda Config: "
ENV_VARS=$(aws lambda get-function-configuration --function-name jeldon-presign-lambda --region us-west-2 --query 'Environment.Variables' 2>/dev/null)
if echo "$ENV_VARS" | grep -q "S3_BUCKET"; then
    echo "✅ Environment variables configured"
else
    echo "❌ Missing environment variables"
fi

echo ""
echo "🔗 INTEGRATION ENDPOINTS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Lambda Function URL:"
echo "  https://2lan4ghtlylexojben5lmpc22a0hraqo.lambda-url.us-west-2.on.aws/"
echo ""
echo "ThriveCart Account:"
echo "  https://thrivecart.com/login (nomoneyblanks)"
echo ""
echo "Contentful Space:"
echo "  https://app.contentful.com/spaces/esrzm688xldd/"
echo ""

echo "📋 REMAINING TASKS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "☐ 1. Create ThriveCart Product"
echo "     • Name: Free MPC Starter Kit"
echo "     • Price: \$0.00"
echo "     • Product ID: free-mpc-kit"
echo "     • Get checkout URL"
echo ""
echo "☐ 2. Configure ThriveCart Webhook"
echo "     • Event: Purchase Complete"
echo "     • URL: Lambda Function URL (above)"
echo "     • Ensure product_id is sent"
echo ""
echo "☐ 3. Update Contentful Button"
echo "     • Entry ID: 7LsDVMfKSMx4bvLvDfyqkW"
echo "     • Change href to ThriveCart checkout URL"
echo ""

echo "🧪 TESTING"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Test Lambda directly:"
echo "  curl -X POST 'https://2lan4ghtlylexojben5lmpc22a0hraqo.lambda-url.us-west-2.on.aws/?product_id=free-mpc-kit'"
echo ""
echo "View Lambda logs:"
echo "  aws logs tail /aws/lambda/jeldon-presign-lambda --region us-west-2 --follow"
echo ""

echo "📚 DOCUMENTATION"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Quick Start (3 steps):"
echo "  docs/THRIVECART_QUICK_START.md"
echo ""
echo "Complete Guide:"
echo "  docs/THRIVECART_INTEGRATION_COMPLETE_GUIDE.md"
echo ""
echo "Summary & Testing:"
echo "  docs/INTEGRATION_COMPLETE_SUMMARY.md"
echo ""

echo "═══════════════════════════════════════════════════════════════"
echo ""
echo "🎉 Infrastructure: COMPLETE"
echo "⏳ ThriveCart Setup: 15 minutes remaining"
echo "📍 Next: Open docs/THRIVECART_QUICK_START.md"
echo ""
echo "═══════════════════════════════════════════════════════════════"
