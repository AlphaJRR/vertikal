#!/bin/bash

# EXECUTE NOW - Complete All Remaining Steps
# This script guides you through completing all remaining tasks

set -e

echo "═══════════════════════════════════════════════════════════"
echo "        🚀 EXECUTE NOW — COMPLETE ALL STEPS 🚀"
echo "═══════════════════════════════════════════════════════════"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}This script will guide you through completing all remaining tasks.${NC}"
echo ""

# Step 1: Check credentials
echo -e "${BLUE}STEP 1: Checking Cloudflare credentials...${NC}"
if [ -z "$CLOUDFLARE_API_TOKEN" ] || [ -z "$CLOUDFLARE_ACCOUNT_ID" ]; then
    echo -e "${YELLOW}⚠️  Credentials not set.${NC}"
    echo ""
    echo "Please set:"
    echo "  export CLOUDFLARE_API_TOKEN=\"your_token\""
    echo "  export CLOUDFLARE_ACCOUNT_ID=\"your_account_id\""
    echo ""
    read -p "Press Enter after setting credentials, or Ctrl+C to exit..."
else
    echo -e "${GREEN}✅ Credentials found${NC}"
fi

# Step 2: Fix deployment artifacts
echo ""
echo -e "${BLUE}STEP 2: Fixing deployment artifacts...${NC}"
echo -e "${YELLOW}This will deploy correct artifacts to investors and creators.${NC}"
read -p "Press Enter to continue, or Ctrl+C to skip..."

if [ -n "$CLOUDFLARE_API_TOKEN" ] && [ -n "$CLOUDFLARE_ACCOUNT_ID" ]; then
    ./fix-deployment-artifacts.sh
    echo ""
    echo -e "${YELLOW}⚠️  IMPORTANT: Verify in Cloudflare Dashboard:${NC}"
    echo -e "${YELLOW}   Assets uploaded should show: 3+ files (NOT 1)${NC}"
    echo ""
    read -p "Press Enter after verifying file counts..."
else
    echo -e "${YELLOW}⚠️  Skipping - credentials not set${NC}"
fi

# Step 3: DNS cleanup reminder
echo ""
echo -e "${BLUE}STEP 3: DNS Cleanup Reminder${NC}"
echo -e "${YELLOW}Manual step required:${NC}"
echo ""
echo "1. Go to Cloudflare Dashboard → DNS → Records"
echo "2. Delete: kelmitchell record"
echo "3. Wait 2-3 minutes"
echo "4. Run: ./verify-dns-cleanup.sh"
echo ""
read -p "Press Enter after completing DNS cleanup, or Ctrl+C to skip..."

# Step 4: Verify DNS
echo ""
echo -e "${BLUE}STEP 4: Verifying DNS cleanup...${NC}"
./verify-dns-cleanup.sh

# Step 5: Verify sites
echo ""
echo -e "${BLUE}STEP 5: Verifying all sites...${NC}"
bash ./verify-sites.sh

# Final summary
echo ""
echo "═══════════════════════════════════════════════════════════"
echo -e "${GREEN}        ✅ EXECUTION COMPLETE ✅${NC}"
echo "═══════════════════════════════════════════════════════════"
echo ""
echo -e "${YELLOW}FINAL STEPS:${NC}"
echo "1. Verify file counts in Cloudflare Dashboard (3+ files)"
echo "2. Purge cache for all sites"
echo "3. Test all sites in incognito mode"
echo "4. Verify logos, content, layout are correct"
echo ""

