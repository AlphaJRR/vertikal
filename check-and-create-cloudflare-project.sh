#!/usr/bin/env bash
set -euo pipefail

# Check for required env vars
if [ -z "${CLOUDFLARE_ACCOUNT_ID:-}" ] || [ -z "${CLOUDFLARE_API_TOKEN:-}" ]; then
  echo "❌ ERROR: CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_API_TOKEN must be set"
  echo ""
  echo "Set them:"
  echo "  export CLOUDFLARE_ACCOUNT_ID=\"your_account_id\""
  echo "  export CLOUDFLARE_API_TOKEN=\"your_api_token\""
  exit 1
fi

ACCOUNT_ID="$CLOUDFLARE_ACCOUNT_ID"
API_TOKEN="$CLOUDFLARE_API_TOKEN"
PROJECT_NAME="vertikalapp"

echo "🔍 Checking existing Cloudflare Pages projects..."
echo ""

# List all Pages projects
PROJECTS=$(curl -sS -X GET \
  "https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/pages/projects" \
  -H "Authorization: Bearer ${API_TOKEN}" \
  -H "Content-Type: application/json")

# Check if project exists
PROJECT_EXISTS=$(echo "$PROJECTS" | jq -r ".result[] | select(.name == \"${PROJECT_NAME}\") | .name" || echo "")

if [ -n "$PROJECT_EXISTS" ]; then
  echo "✅ Project '${PROJECT_NAME}' already exists!"
  echo ""
  echo "Project details:"
  echo "$PROJECTS" | jq -r ".result[] | select(.name == \"${PROJECT_NAME}\") | \"  Name: \(.name)\n  ID: \(.id)\n  Domains: \(.domains | join(\", \"))\""
  echo ""
  echo "✅ Ready to deploy! Run: ./deploy-and-verify.sh"
else
  echo "❌ Project '${PROJECT_NAME}' not found"
  echo ""
  echo "Creating project..."
  
  # Create the project
  CREATE_RESPONSE=$(curl -sS -X POST \
    "https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/pages/projects" \
    -H "Authorization: Bearer ${API_TOKEN}" \
    -H "Content-Type: application/json" \
    -d "{
      \"name\": \"${PROJECT_NAME}\",
      \"production_branch\": \"main\"
    }")
  
  SUCCESS=$(echo "$CREATE_RESPONSE" | jq -r '.success')
  
  if [ "$SUCCESS" = "true" ]; then
    echo "✅ Project '${PROJECT_NAME}' created successfully!"
    echo ""
    echo "Next steps:"
    echo "1. Go to Cloudflare Dashboard → Pages → ${PROJECT_NAME}"
    echo "2. Upload the public/ folder (or connect to Git)"
    echo "3. Attach custom domain: vertikalapp.com"
    echo "4. Run: ./deploy-and-verify.sh"
  else
    ERROR=$(echo "$CREATE_RESPONSE" | jq -r '.errors[0].message // "Unknown error"')
    echo "❌ Failed to create project: $ERROR"
    echo ""
    echo "Manual creation required:"
    echo "1. Go to: https://dash.cloudflare.com → Pages"
    echo "2. Click 'Create a project'"
    echo "3. Project name: ${PROJECT_NAME}"
    echo "4. Upload public/ folder"
    exit 1
  fi
fi
