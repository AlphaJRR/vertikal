#!/bin/bash

# VERTIKAL DEPLOYMENT VERIFICATION SCRIPT
# Tests all 5 subdomains for correct deployment

echo "═══════════════════════════════════════════════════════════"
echo "        🔍 VERTIKAL DEPLOYMENT VERIFICATION 🔍"
echo "═══════════════════════════════════════════════════════════"
echo ""

DOMAINS=(
    "https://vertikalapp.com"
    "https://creators.vertikalapp.com"
    "https://investors.vertikalapp.com"
    "https://networks.vertikalapp.com"
    "https://beta.vertikalapp.com"
)

PASS=0
FAIL=0

for domain in "${DOMAINS[@]}"; do
    echo "Testing: $domain"
    echo "----------------------------------------"
    
    # Check HTTP status
    STATUS=$(curl -s -o /dev/null -w "%{http_code}" -I "$domain" 2>/dev/null)
    
    if [ "$STATUS" = "200" ]; then
        echo "✅ HTTP Status: $STATUS OK"
        PASS=$((PASS + 1))
    else
        echo "❌ HTTP Status: $STATUS (Expected 200)"
        FAIL=$((FAIL + 1))
    fi
    
    # Check if page loads (basic content check)
    CONTENT=$(curl -s -L "$domain" 2>/dev/null | head -20)
    if echo "$CONTENT" | grep -q "VERTIKAL\|vertikal"; then
        echo "✅ Content: Page loads correctly"
    else
        echo "⚠️  Content: May not be loading correctly"
    fi
    
    echo ""
done

echo "═══════════════════════════════════════════════════════════"
echo "RESULTS:"
echo "  ✅ Passed: $PASS/5"
echo "  ❌ Failed: $FAIL/5"
echo "═══════════════════════════════════════════════════════════"

if [ $FAIL -eq 0 ]; then
    echo "🎉 ALL DOMAINS RESOLVING CORRECTLY!"
    exit 0
else
    echo "⚠️  SOME DOMAINS NEED ATTENTION"
    exit 1
fi
