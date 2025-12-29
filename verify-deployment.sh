#!/bin/bash
set -euo pipefail

echo "🔒 PRE-DEPLOYMENT VERIFICATION"
echo "================================"

# Check secrets
if [ -z "${CLOUDFLARE_API_TOKEN:-}" ]; then
  echo "❌ CLOUDFLARE_API_TOKEN not set"
  exit 1
fi
echo "✅ CLOUDFLARE_API_TOKEN set"

if [ -z "${CLOUDFLARE_ACCOUNT_ID:-}" ]; then
  echo "❌ CLOUDFLARE_ACCOUNT_ID not set"
  exit 1
fi
echo "✅ CLOUDFLARE_ACCOUNT_ID set"

# Check build output
if [ ! -d "dist" ]; then
  echo "❌ dist/ not found. Run 'npm run build' first."
  exit 1
fi
echo "✅ dist/ exists"

# Check wrangler
if ! command -v wrangler &> /dev/null; then
  echo "⚠️  Wrangler not installed. Will use npx wrangler."
else
  echo "✅ Wrangler installed"
fi

# Verify project names exist
PROJECTS=("vertikalapp" "investors-vertikalapp" "creators-vertikalapp" "networks-vertikalapp" "demo-vertikal")
for project in "${PROJECTS[@]}"; do
  if curl -s -X GET \
    "https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/pages/projects/${project}" \
    -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" | jq -e '.success' > /dev/null 2>&1; then
    echo "✅ Project exists: $project"
  else
    echo "❌ Project missing: $project"
    exit 1
  fi
done

echo ""
echo "✅ ALL VERIFICATIONS PASSED"
echo "Ready to deploy"
