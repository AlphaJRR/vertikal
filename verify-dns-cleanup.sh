#!/bin/bash

# DNS Cleanup Verification Script
# Run this AFTER deleting the bad DNS records in Cloudflare Dashboard

echo "═══════════════════════════════════════════════════════════"
echo "        🔍 DNS CLEANUP VERIFICATION 🔍"
echo "═══════════════════════════════════════════════════════════"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if dig is available
if ! command -v dig &> /dev/null; then
    echo -e "${YELLOW}⚠️  'dig' not found. Installing via brew...${NC}"
    if command -v brew &> /dev/null; then
        brew install bind
    else
        echo -e "${RED}❌ Please install 'dig' manually or use online DNS checker${NC}"
        exit 1
    fi
fi

echo "Checking DNS records for vertikalapp.com..."
echo ""

# Records that SHOULD exist (production)
PROD_RECORDS=(
    "@:vertikalapp.pages.dev"
    "investors:investors-vertikalapp.pages.dev"
    "creators:creators-vertikalapp.pages.dev"
    "networks:networks-vertikalapp.pages.dev"
)

# Records that SHOULD NOT exist (bad records)
BAD_RECORDS=(
    "beta:beta-cfx.pages.dev"
    "cmo:cmo-strategy.pages.dev"
    "cto:cto-deck.pages.dev"
    "demo:demovertikalapp.netlify.app"
    "kelmitchell:kelmitchell-vertical.pages.dev"
)

echo "✅ CHECKING PRODUCTION RECORDS (Should exist):"
echo "───────────────────────────────────────────────────────────"
for record in "${PROD_RECORDS[@]}"; do
    IFS=':' read -r name target <<< "$record"
    if [ "$name" == "@" ]; then
        domain="vertikalapp.com"
        display_name="vertikalapp.com"
    else
        domain="${name}.vertikalapp.com"
        display_name="${name}.vertikalapp.com"
    fi
    
    result=$(dig +short "$domain" CNAME 2>/dev/null | head -1)
    if [[ "$result" == *"$target"* ]] || [[ "$result" == *"pages.dev"* ]]; then
        echo -e "${GREEN}✅ ${display_name} → ${result}${NC}"
    else
        echo -e "${YELLOW}⚠️  ${display_name} → ${result:-NOT FOUND}${NC}"
    fi
done

echo ""
echo "❌ CHECKING BAD RECORDS (Should NOT exist):"
echo "───────────────────────────────────────────────────────────"
BAD_FOUND=0
for record in "${BAD_RECORDS[@]}"; do
    IFS=':' read -r name target <<< "$record"
    domain="${name}.vertikalapp.com"
    
    result=$(dig +short "$domain" CNAME 2>/dev/null | head -1)
    if [ -n "$result" ]; then
        echo -e "${RED}❌ ${domain} → ${result} (STILL EXISTS - DELETE THIS!)${NC}"
        BAD_FOUND=1
    else
        echo -e "${GREEN}✅ ${domain} → NOT FOUND (Good - deleted)${NC}"
    fi
done

echo ""
echo "═══════════════════════════════════════════════════════════"
echo "        🌐 HTTP VERIFICATION"
echo "═══════════════════════════════════════════════════════════"
echo ""

SITES=(
    "https://vertikalapp.com"
    "https://investors.vertikalapp.com"
    "https://creators.vertikalapp.com"
    "https://networks.vertikalapp.com"
)

ALL_OK=1
for site in "${SITES[@]}"; do
    status=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 "$site" 2>/dev/null)
    if [ "$status" == "200" ]; then
        echo -e "${GREEN}✅ ${site} → HTTP ${status}${NC}"
    else
        echo -e "${RED}❌ ${site} → HTTP ${status}${NC}"
        ALL_OK=0
    fi
done

echo ""
echo "═══════════════════════════════════════════════════════════"

if [ $BAD_FOUND -eq 0 ] && [ $ALL_OK -eq 1 ]; then
    echo -e "${GREEN}        ✅ DNS CLEANUP VERIFIED ✅${NC}"
    echo ""
    echo "All bad records deleted."
    echo "All production sites responding correctly."
    echo "DNS cleanup successful!"
else
    echo -e "${YELLOW}        ⚠️  VERIFICATION INCOMPLETE ⚠️${NC}"
    echo ""
    if [ $BAD_FOUND -eq 1 ]; then
        echo -e "${RED}❌ Some bad DNS records still exist.${NC}"
        echo "   Please delete them in Cloudflare Dashboard."
    fi
    if [ $ALL_OK -eq 0 ]; then
        echo -e "${YELLOW}⚠️  Some sites not responding correctly.${NC}"
        echo "   Wait a few more minutes for DNS propagation."
    fi
fi

echo "═══════════════════════════════════════════════════════════"

