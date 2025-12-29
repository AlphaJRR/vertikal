#!/bin/bash

echo "═══════════════════════════════════════════════════════════"
echo "        🔍 VERIFYING ALL DEPLOYMENTS 🔍"
echo "═══════════════════════════════════════════════════════════"
echo ""

SITES=(
  "vertikalapp.com"
  "creators.vertikalapp.com"
  "networks.vertikalapp.com"
  "investors.vertikalapp.com"
  "beta.vertikalapp.com"
)

echo "CHECKING LIVE SITES:"
echo "===================="
for site in "${SITES[@]}"; do
  STATUS=$(curl -s -o /dev/null -w "%{http_code}" "https://$site" 2>/dev/null || echo "000")
  if [ "$STATUS" = "200" ]; then
    echo "✅ $site - HTTP $STATUS"
  elif [ "$STATUS" = "000" ]; then
    echo "⏳ $site - Not responding (may be deploying)"
  else
    echo "⚠️  $site - HTTP $STATUS"
  fi
done

echo ""
echo "CHECKING LOCAL DIRECTORIES:"
echo "============================"
DIRS=("public" "public/creators" "public/networks" "public/investors" "public/beta")
for dir in "${DIRS[@]}"; do
  if [ -d "$dir" ]; then
    FILE_COUNT=$(find "$dir" -type f -name "*.html" | wc -l | tr -d ' ')
    echo "✅ $dir - $FILE_COUNT HTML file(s)"
  else
    echo "❌ $dir - MISSING"
  fi
done

echo ""
echo "GIT STATUS:"
echo "==========="
if git diff --quiet && git diff --cached --quiet; then
  echo "✅ Working tree clean"
else
  echo "⚠️  Uncommitted changes detected"
fi

echo ""
echo "LATEST COMMIT:"
echo "=============="
git log --oneline -1

echo ""
echo "═══════════════════════════════════════════════════════════"
echo "  📊 Monitor: https://github.com/AlphaJRR/vertikal/actions"
echo "═══════════════════════════════════════════════════════════"
