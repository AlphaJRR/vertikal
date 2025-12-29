#!/bin/bash
# Complete Go Live Execution Script
# Replace all placeholders (YOUR_*) with actual values before running

set -e  # Exit on error

echo "🚀 GO LIVE EXECUTION STARTING..."
echo ""

# ===== STEP 1: SET CREDENTIALS =====
export GITHUB_USERNAME="AlphaJRR"
export GITHUB_REPO="AlphaJRR/vertikal"
export BRANCH="main"
export GITHUB_PAT="YOUR_GITHUB_PAT"
export CLOUDFLARE_API_TOKEN="YOUR_CLOUDFLARE_API_TOKEN"
export ZONE_ID="YOUR_ZONE_ID"
export LB_ID="YOUR_LB_ID"
export POOL_ID_PROD="YOUR_POOL_ID_PROD"
export POOL_ID_CANARY="YOUR_POOL_ID_CANARY"
export POOL_ID_GREEN="YOUR_POOL_ID_GREEN"

# ===== STEP 2: PUSH COMMITS =====
echo "📤 Pushing commits..."
cd /Users/alphavisualartists/Vertikal-App
git push https://${GITHUB_USERNAME}:${GITHUB_PAT}@github.com/${GITHUB_REPO}.git ${BRANCH}
echo "✅ Push complete"
echo ""

# ===== STEP 3: DEPLOY CANARY =====
echo "🎯 Deploying to canary..."
curl -X POST \
  -H "Accept: application/vnd.github+json" \
  -H "Authorization: Bearer ${GITHUB_PAT}" \
  -H "X-GitHub-Api-Version: 2022-11-28" \
  https://api.github.com/repos/${GITHUB_REPO}/actions/workflows/cloudflare-advanced-deploy.yml/dispatches \
  -d '{"ref":"main","inputs":{"target":"all","mode":"canary","branch":"main"}}'
echo "✅ Canary deployment triggered"
echo "Waiting 60 seconds for workflow to start..."
sleep 60

# ===== STEP 4: SHIFT TRAFFIC TO CANARY (10%) =====
echo "🔄 Shifting 10% traffic to canary..."
curl -X PATCH "https://api.cloudflare.com/client/v4/zones/${ZONE_ID}/load_balancers/${LB_ID}" \
  -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "default_pools": ["'${POOL_ID_PROD}'", "'${POOL_ID_CANARY}'"],
    "fallback_pool": "'${POOL_ID_PROD}'",
    "proxied": true,
    "default_pools_weights": [
      {"pool_id":"'${POOL_ID_PROD}'","weight":90},
      {"pool_id":"'${POOL_ID_CANARY}'","weight":10}
    ]
  }'
echo "✅ Traffic shifted: Prod 90%, Canary 10%"
echo "Monitor canary for 5-15 minutes, then continue..."
echo ""

# ===== STEP 5: DEPLOY GREEN =====
echo "🟢 Deploying to green..."
curl -X POST \
  -H "Accept: application/vnd.github+json" \
  -H "Authorization: Bearer ${GITHUB_PAT}" \
  -H "X-GitHub-Api-Version: 2022-11-28" \
  https://api.github.com/repos/${GITHUB_REPO}/actions/workflows/cloudflare-advanced-deploy.yml/dispatches \
  -d '{"ref":"main","inputs":{"target":"all","mode":"green","branch":"main"}}'
echo "✅ Green deployment triggered"
echo "Waiting 60 seconds for workflow to start..."
sleep 60

# ===== STEP 6: FLIP TO GREEN (100%) =====
echo "🔄 Flipping traffic to green (100%)..."
curl -X PATCH "https://api.cloudflare.com/client/v4/zones/${ZONE_ID}/load_balancers/${LB_ID}" \
  -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "default_pools": ["'${POOL_ID_GREEN}'"],
    "fallback_pool": "'${POOL_ID_GREEN}'",
    "proxied": true
  }'
echo "✅ Traffic flipped to Green (100%)"
echo ""

# ===== STEP 7: VERIFY =====
echo "✅ Verifying sites..."
sites=(
  "https://vertikalapp.com"
  "https://investors.vertikalapp.com"
  "https://creators.vertikalapp.com"
  "https://networks.vertikalapp.com"
)

for site in "${sites[@]}"; do
  status=$(curl -s -o /dev/null -w "%{http_code}" "$site")
  if [ "$status" = "200" ]; then
    echo "  ✅ $site - HTTP 200"
  else
    echo "  ❌ $site - HTTP $status"
  fi
done

echo ""
echo "🎉 GO LIVE COMPLETE!"
echo "Monitor sites and verify functionality."

