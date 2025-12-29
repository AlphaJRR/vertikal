#!/bin/bash
# Complete Deployment Script
# Usage: export GITHUB_PAT="your_token" && ./deploy-complete.sh

set -e

echo "🚀 COMPLETE DEPLOYMENT SCRIPT"
echo "=============================="
echo ""

# Check for PAT
if [ -z "$GITHUB_PAT" ]; then
    echo "❌ ERROR: GITHUB_PAT environment variable not set"
    echo ""
    echo "Set it with:"
    echo "  export GITHUB_PAT=\"your_personal_access_token\""
    echo ""
    echo "Get PAT from: https://github.com/settings/tokens"
    echo "Required scopes: repo, workflow"
    exit 1
fi

REPO="AlphaJRR/vertikal"
WORKFLOW_FILE="cloudflare-advanced-deploy.yml"
BRANCH="main"

echo "✅ PAT found"
echo ""

# Step 1: Push commits
echo "📤 STEP 1: Pushing commits..."
cd /Users/alphavisualartists/Vertikal-App

COMMITS_READY=$(git log origin/main..HEAD --oneline | wc -l | tr -d ' ')
echo "  Commits ready: $COMMITS_READY"

git push https://AlphaJRR:${GITHUB_PAT}@github.com/${REPO}.git ${BRANCH}

if [ $? -eq 0 ]; then
    echo "  ✅ Push successful"
else
    echo "  ❌ Push failed"
    exit 1
fi

echo ""
sleep 2

# Step 2: Trigger workflow
echo "🎯 STEP 2: Triggering deployment workflow..."
curl -X POST \
  -H "Accept: application/vnd.github+json" \
  -H "Authorization: Bearer ${GITHUB_PAT}" \
  -H "X-GitHub-Api-Version: 2022-11-28" \
  https://api.github.com/repos/${REPO}/actions/workflows/${WORKFLOW_FILE}/dispatches \
  -d "{\"ref\":\"${BRANCH}\",\"inputs\":{\"target\":\"all\",\"mode\":\"production\",\"branch\":\"${BRANCH}\"}}" \
  -w "\nHTTP Status: %{http_code}\n" \
  -o /dev/null -s

if [ $? -eq 0 ]; then
    echo "  ✅ Workflow triggered"
    echo "  Monitor: https://github.com/${REPO}/actions"
else
    echo "  ❌ Workflow trigger failed"
    exit 1
fi

echo ""
echo "⏳ Waiting 30 seconds for workflow to start..."
sleep 30

# Step 3: Verification checks
echo ""
echo "✅ STEP 3: Running verification checks..."
echo ""

SITES=(
    "https://vertikalapp.com"
    "https://investors.vertikalapp.com"
    "https://creators.vertikalapp.com"
    "https://networks.vertikalapp.com"
)

for site in "${SITES[@]}"; do
    echo "Checking: $site"
    
    # HTTP status check
    STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$site" || echo "000")
    
    if [ "$STATUS" = "200" ]; then
        echo "  ✅ HTTP $STATUS OK"
    else
        echo "  ⚠️  HTTP $STATUS (may still be deploying)"
    fi
done

echo ""
echo "📋 Content checks:"
echo ""

# Main site content check
if curl -s https://vertikalapp.com | grep -qi "STOP ROTATING YOUR PHONE"; then
    echo "  ✅ Main site: Hero text found"
else
    echo "  ⚠️  Main site: Hero text check (may still be deploying)"
fi

# Investors content check
if curl -s https://investors.vertikalapp.com | grep -qi "Founding Participant"; then
    echo "  ✅ Investors: Tiers found"
else
    echo "  ⚠️  Investors: Tiers check (may still be deploying)"
fi

# Networks content check
if curl -s https://networks.vertikalapp.com | grep -qi "FOUNDING 50 NETWORKS"; then
    echo "  ✅ Networks: Headline found"
else
    echo "  ⚠️  Networks: Headline check (may still be deploying)"
fi

echo ""
echo "🎉 DEPLOYMENT INITIATED"
echo "======================="
echo ""
echo "✅ Push completed"
echo "✅ Workflow triggered"
echo "⏳ Deployment in progress (~10-15 minutes)"
echo ""
echo "Monitor: https://github.com/${REPO}/actions"
echo ""
echo "After deployment completes, verify:"
echo "  • All 4 sites load correctly"
echo "  • SSL certificates active"
echo "  • Forms submit correctly"
echo "  • Links route correctly"
echo ""
echo "✅ COMPLETE!"

