#!/bin/bash
set -e

echo "=== Deploying Updated Lambda Function ==="
echo ""

FUNCTION_NAME="jeldon-presign-lambda"
REGION="us-west-2"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Create deployment package
echo "Step 1: Creating deployment package..."
cd "$SCRIPT_DIR"
cp presign_lambda_updated.py presign_lambda.py
zip -q lambda-deployment.zip presign_lambda.py
echo "✓ Package created: lambda-deployment.zip"
echo ""

# Backup current function code
echo "Step 2: Backing up current Lambda code..."
aws lambda get-function \
  --function-name "$FUNCTION_NAME" \
  --region "$REGION" \
  --query 'Code.Location' \
  --output text > lambda-backup-url.txt
echo "✓ Backup URL saved to: lambda-backup-url.txt"
echo ""

# Deploy updated code
echo "Step 3: Deploying updated Lambda code..."
aws lambda update-function-code \
  --function-name "$FUNCTION_NAME" \
  --region "$REGION" \
  --zip-file fileb://lambda-deployment.zip \
  --query '[FunctionName,Runtime,LastModified]' \
  --output text
echo "✓ Lambda function updated"
echo ""

# Wait for update to complete
echo "Step 4: Waiting for deployment to stabilize..."
sleep 3
echo "✓ Deployment complete"
echo ""

# Test the updated function
echo "Step 5: Testing updated Lambda function..."
cat > test-payload.json << 'EOF'
{
  "headers": {},
  "queryStringParameters": {
    "product_id": "free-mpc-kit"
  }
}
EOF

echo "Testing with product_id='free-mpc-kit'..."
aws lambda invoke \
  --function-name "$FUNCTION_NAME" \
  --region "$REGION" \
  --cli-binary-format raw-in-base64-out \
  --payload file://test-payload.json \
  lambda-test-response.json > /dev/null

echo ""
echo "Lambda Response:"
cat lambda-test-response.json | python3 -m json.tool
echo ""

# Check if presigned URL was generated
if grep -q '"url":' lambda-test-response.json; then
    echo "✅ SUCCESS: Lambda generated presigned URL"
    echo ""
    echo "Next steps:"
    echo "1. Create ThriveCart free product with ID 'free-mpc-kit'"
    echo "2. Configure webhook to: https://2lan4ghtlylexojben5lmpc22a0hraqo.lambda-url.us-west-2.on.aws/"
    echo "3. Update Contentful button to: https://nomoneyblanks.thrivecart.com/free-mpc-kit/"
    echo ""
    echo "See docs/THRIVECART_INTEGRATION_COMPLETE_GUIDE.md for details"
else
    echo "⚠️  WARNING: Lambda did not return presigned URL"
    echo "Check lambda-test-response.json for errors"
fi

# Cleanup
rm -f presign_lambda.py test-payload.json

echo ""
echo "=== Deployment Complete ==="
