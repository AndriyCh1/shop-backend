#!/bin/sh

# Fetch secrets from AWS Systems Manager Parameter Store
# and write them to .env file

REGION="us-east-2"
SSM_PATH="/shop-dfh/backend"

PARAMETERS=$(aws ssm get-parameters-by-path \
  --region "$REGION" \
  --path "$SSM_PATH" \
  --recursive \
  --with-decryption \
  --query 'Parameters[].{Name:Name,Value:Value}' \
  --output json)

echo "Writing parameters to .env..."
SCRIPT_DIR=$(dirname "$(readlink -f "$0")")
echo "$PARAMETERS" | jq -c '.[]' | while read -r param; do
  NAME=$(echo "$param" | jq -r '.Name' | awk -F/ '{print toupper($NF)}')
  VALUE=$(echo "$param" | jq -r '.Value')
  echo "$NAME=$VALUE" >> "$SCRIPT_DIR/../.env"
done

echo ".env file created"
