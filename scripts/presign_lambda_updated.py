import os
import json
import hmac
import hashlib
import logging
import boto3

logger = logging.getLogger()
logger.setLevel(logging.INFO)

S3_BUCKET = os.environ.get("S3_BUCKET")
EXPIRATION = int(os.environ.get("PRESIGN_EXPIRATION", "900"))
THRIVECART_SECRET = os.environ.get("THRIVECART_SECRET")

# Map ThriveCart product IDs to S3 keys
PRODUCT_FILE_MAP = {
    "free-mpc-kit": "Previews/MPC Starter Kit.zip",
    "free_mpc_kit": "Previews/MPC Starter Kit.zip",
    "mpc-starter-kit": "Previews/MPC Starter Kit.zip",
    # Add more products as needed:
    # "beat-basic-50": "Beats/Basic_Bundle.zip",
    # "beat-premium-150": "Beats/Premium_Bundle.zip",
}

s3 = boto3.client("s3")


def verify_thrivecart_signature(body_bytes: bytes, signature_header: str) -> bool:
    if not THRIVECART_SECRET:
        return True
    if not signature_header:
        return False
    mac = hmac.new(THRIVECART_SECRET.encode(), body_bytes, hashlib.sha256).hexdigest()
    return hmac.compare_digest(mac, signature_header)


def handler(event, context):
    try:
        headers = event.get("headers") or {}
        signature = headers.get("X-Thrivecart-Signature") or headers.get("x-thrivecart-signature")
        body_raw = event.get("body", "")

        if isinstance(body_raw, str):
            body_bytes = body_raw.encode("utf-8")
            try:
                body = json.loads(body_raw)
            except Exception:
                body = {}
        else:
            body_bytes = json.dumps(body_raw).encode("utf-8")
            body = body_raw

        if not verify_thrivecart_signature(body_bytes, signature):
            logger.warning("Invalid signature")
            return {
                "statusCode": 403,
                "headers": {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*"
                },
                "body": json.dumps({"message": "Invalid signature"})
            }

        # Get product ID from ThriveCart webhook or query params
        product_id = None
        s3_key = None
        
        if isinstance(body, dict):
            # ThriveCart sends product info in various fields
            product_id = (
                body.get("product_id") 
                or body.get("product") 
                or body.get("sku")
                or body.get("product_name", "").lower().replace(" ", "-")
            )
            # Also check for custom s3_key override
            s3_key = body.get("s3_key")
            
            logger.info(f"Received webhook: product_id={product_id}, s3_key={s3_key}")
        
        # Check query string parameters as fallback
        if not product_id and event.get("queryStringParameters"):
            product_id = event["queryStringParameters"].get("product_id")
            s3_key = event["queryStringParameters"].get("s3_key")
        
        # Check path parameters as another fallback
        if not product_id and event.get("pathParameters"):
            product_id = event["pathParameters"].get("product_id")
            s3_key = event["pathParameters"].get("s3_key")

        # Map product ID to S3 key if not explicitly provided
        if not s3_key:
            if product_id:
                # Normalize product ID (lowercase, hyphens)
                product_id_normalized = product_id.lower().strip()
                if product_id_normalized in PRODUCT_FILE_MAP:
                    s3_key = PRODUCT_FILE_MAP[product_id_normalized]
                    logger.info(f"Mapped product '{product_id}' to s3_key '{s3_key}'")
                else:
                    logger.error(f"Unknown product_id: {product_id}")
                    return {
                        "statusCode": 400,
                        "headers": {
                            "Content-Type": "application/json",
                            "Access-Control-Allow-Origin": "*"
                        },
                        "body": json.dumps({
                            "message": f"Unknown product: {product_id}",
                            "available_products": list(PRODUCT_FILE_MAP.keys())
                        })
                    }
            else:
                # Return 200 for webhook validation tests (ThriveCart initial check)
                logger.warning("No product_id or s3_key provided - webhook validation test")
                return {
                    "statusCode": 200,
                    "headers": {
                        "Content-Type": "application/json",
                        "Access-Control-Allow-Origin": "*"
                    },
                    "body": json.dumps({
                        "status": "ok",
                        "message": "Webhook endpoint ready",
                        "available_products": list(PRODUCT_FILE_MAP.keys())
                    })
                }

        # Get bucket (allow override from webhook, default to env)
        bucket = (body.get("bucket") if isinstance(body, dict) else None) or S3_BUCKET
        if not bucket:
            logger.error("S3 bucket not configured")
            return {"statusCode": 500, "body": json.dumps({"message": "S3 bucket not configured"})}

        # Generate presigned URL
        logger.info(f"Generating presigned URL: bucket={bucket}, key={s3_key}, expiration={EXPIRATION}s")
        url = s3.generate_presigned_url(
            "get_object",
            Params={"Bucket": bucket, "Key": s3_key},
            ExpiresIn=EXPIRATION,
            HttpMethod="GET",
        )

        logger.info("Presigned URL generated successfully")
        return {
            "statusCode": 200,
            "headers": {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type"
            },
            "body": json.dumps({
                "url": url,
                "expires_in": EXPIRATION,
                "product_id": product_id,
                "file": s3_key
            })
        }

    except Exception as e:
        logger.exception("presign error")
        return {
            "statusCode": 500,
            "headers": {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            },
            "body": json.dumps({"message": "internal error", "error": str(e)})
        }
