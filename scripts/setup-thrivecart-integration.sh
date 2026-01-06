#!/bin/bash
# ThriveCart + Lambda + S3 Integration Setup Script

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
LAMBDA_FUNCTION="jeldon-presign-lambda"
S3_BUCKET="jeldonmusic-s3-bucket"
REGION="us-west-2"

echo -e "${GREEN}=== ThriveCart + Lambda Setup ===${NC}\n"

# Step 1: Verify AWS credentials
echo -e "${YELLOW}Step 1: Verifying AWS credentials...${NC}"
if aws sts get-caller-identity > /dev/null 2>&1; then
    ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
    echo -e "${GREEN}✓ AWS credentials valid (Account: $ACCOUNT_ID)${NC}\n"
else
    echo -e "${RED}✗ AWS credentials invalid or expired${NC}"
    echo -e "Please update credentials:\n"
    echo "1. Go to AWS Console → IAM → Users → jhead26"
    echo "2. Security credentials → Create access key"
    echo "3. Download credentials and run: aws configure"
    exit 1
fi

# Step 2: Check Lambda function exists
echo -e "${YELLOW}Step 2: Checking Lambda function...${NC}"
if aws lambda get-function --function-name $LAMBDA_FUNCTION --region $REGION > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Lambda function found: $LAMBDA_FUNCTION${NC}"
    
    # Get current configuration
    LAMBDA_RUNTIME=$(aws lambda get-function-configuration \
        --function-name $LAMBDA_FUNCTION \
        --region $REGION \
        --query Runtime --output text)
    echo "  Runtime: $LAMBDA_RUNTIME"
    
    LAMBDA_URL=$(aws lambda get-function-url-config \
        --function-name $LAMBDA_FUNCTION \
        --region $REGION \
        --query FunctionUrl --output text 2>/dev/null || echo "Not configured")
    echo "  Function URL: $LAMBDA_URL"
    echo ""
else
    echo -e "${RED}✗ Lambda function not found${NC}"
    exit 1
fi

# Step 3: Check S3 bucket
echo -e "${YELLOW}Step 3: Checking S3 bucket...${NC}"
if aws s3 ls s3://$S3_BUCKET --region $REGION > /dev/null 2>&1; then
    echo -e "${GREEN}✓ S3 bucket accessible: $S3_BUCKET${NC}"
    
    # List files in Previews folder
    echo "  Files in bucket:"
    aws s3 ls s3://$S3_BUCKET/ --recursive | grep -E '\.(zip|mp3|wav)' | head -5 || echo "  No files found"
    echo ""
else
    echo -e "${RED}✗ Cannot access S3 bucket${NC}"
    exit 1
fi

# Step 4: Check if bucket is public
echo -e "${YELLOW}Step 4: Checking S3 bucket public access...${NC}"
PUBLIC_ACCESS=$(aws s3api get-public-access-block \
    --bucket $S3_BUCKET \
    --region $REGION \
    --query PublicAccessBlockConfiguration.BlockPublicAcls \
    --output text 2>/dev/null || echo "None")

if [ "$PUBLIC_ACCESS" = "True" ]; then
    echo -e "${GREEN}✓ Bucket is private (good for security)${NC}\n"
else
    echo -e "${YELLOW}⚠ WARNING: Bucket may be public${NC}"
    read -p "Would you like to make it private? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        aws s3api put-public-access-block \
            --bucket $S3_BUCKET \
            --region $REGION \
            --public-access-block-configuration \
                "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true"
        echo -e "${GREEN}✓ Bucket is now private${NC}\n"
    fi
fi

# Step 5: Update Lambda environment variables
echo -e "${YELLOW}Step 5: Configuring Lambda environment variables...${NC}"

# Get current env vars
CURRENT_ENV=$(aws lambda get-function-configuration \
    --function-name $LAMBDA_FUNCTION \
    --region $REGION \
    --query Environment.Variables --output json)

echo "Current environment variables:"
echo "$CURRENT_ENV" | jq -r 'to_entries[] | "  \(.key) = \(.value)"' || echo "$CURRENT_ENV"

read -p $'\nUpdate environment variables? (y/n): ' -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    read -p "Enter ThriveCart Webhook Secret (or press Enter to skip): " WEBHOOK_SECRET
    
    ENV_VARS="{\"S3_BUCKET\":\"$S3_BUCKET\",\"S3_REGION\":\"$REGION\""
    
    if [ ! -z "$WEBHOOK_SECRET" ]; then
        ENV_VARS="${ENV_VARS},\"THRIVECART_WEBHOOK_SECRET\":\"$WEBHOOK_SECRET\""
    fi
    
    ENV_VARS="${ENV_VARS}}"
    
    aws lambda update-function-configuration \
        --function-name $LAMBDA_FUNCTION \
        --region $REGION \
        --environment "Variables=$ENV_VARS"
    
    echo -e "${GREEN}✓ Environment variables updated${NC}\n"
fi

# Step 6: Test Lambda function
echo -e "${YELLOW}Step 6: Testing Lambda function...${NC}"
read -p "Would you like to test the Lambda with a sample event? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    # Create test event
    cat > /tmp/test-event.json <<EOF
{
  "body": "{\"customer\":{\"email\":\"test@example.com\",\"first_name\":\"Test\"},\"order\":{\"product_id\":\"free_mpc_kit\",\"id\":\"test123\"},\"event\":\"order.success\"}",
  "headers": {
    "content-type": "application/json"
  }
}
EOF
    
    echo "Invoking Lambda..."
    RESPONSE=$(aws lambda invoke \
        --function-name $LAMBDA_FUNCTION \
        --region $REGION \
        --payload file:///tmp/test-event.json \
        /tmp/lambda-response.json 2>&1)
    
    echo "$RESPONSE"
    echo -e "\nResponse:"
    cat /tmp/lambda-response.json | jq . || cat /tmp/lambda-response.json
    echo ""
fi

# Step 7: Summary
echo -e "${GREEN}=== Setup Summary ===${NC}\n"
echo "Lambda Function: $LAMBDA_FUNCTION"
echo "Lambda URL: $LAMBDA_URL"
echo "S3 Bucket: $S3_BUCKET"
echo "Region: $REGION"
echo ""
echo -e "${YELLOW}Next Steps:${NC}"
echo "1. Update Lambda code with ThriveCart webhook handler"
echo "2. Configure ThriveCart webhook to use: $LAMBDA_URL"
echo "3. Create ThriveCart product and set product_id"
echo "4. Update Contentful download button to ThriveCart checkout URL"
echo ""
echo -e "${GREEN}✓ Setup complete!${NC}"
