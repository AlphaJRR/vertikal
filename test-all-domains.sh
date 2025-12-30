#!/bin/bash
echo "═══════════════════════════════════════════════════════════"
echo "        🔍 DOMAIN RESOLUTION TEST 🔍"
echo "═══════════════════════════════════════════════════════════"
echo ""

DOMAINS=(
    "vertikalapp.com"
    "creators.vertikalapp.com"
    "investors.vertikalapp.com"
    "networks.vertikalapp.com"
    "beta.vertikalapp.com"
)

for domain in "${DOMAINS[@]}"; do
    echo "Testing: https://$domain"
    echo "----------------------------------------"
    
    # HTTP Status
    STATUS=$(curl -I -s -L "https://$domain" 2>&1 | grep -E "^HTTP" | head -1)
    echo "Status: $STATUS"
    
    # DNS CNAME (if subdomain)
    if [[ "$domain" != "vertikalapp.com" ]]; then
        CNAME=$(dig +short "$domain" CNAME 2>/dev/null | head -1)
        if [ -n "$CNAME" ]; then
            echo "DNS CNAME: $CNAME ✅"
        else
            echo "DNS CNAME: NOT FOUND ⚠️"
        fi
    fi
    
    # Content check
    CONTENT=$(curl -s -L "https://$domain" 2>&1 | head -5)
    if echo "$CONTENT" | grep -qi "vertikal\|html"; then
        echo "Content: Loading ✅"
    else
        echo "Content: May not be loading ⚠️"
    fi
    
    echo ""
done

