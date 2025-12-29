#!/bin/bash

# =====================================================
# VERTIKAL MASTER FIX - RUN THIS ENTIRE SCRIPT
# =====================================================

set -e

cd /Users/alphavisualartists/Vertikal-App

echo "═══════════════════════════════════════════════════════════"
echo "        🔧 VERTIKAL MASTER FIX SCRIPT 🔧"
echo "═══════════════════════════════════════════════════════════"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}STEP 1: CHECKING CURRENT STATUS${NC}"
echo "======================================"
echo ""

# Check HTTP status
check_site() {
    local URL=$1
    local STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$URL" 2>/dev/null || echo "000")
    if [ "$STATUS" = "200" ]; then
        echo -e "${GREEN}✅ $URL - HTTP $STATUS${NC}"
        return 0
    elif [ "$STATUS" = "404" ]; then
        echo -e "${RED}❌ $URL - HTTP $STATUS (Missing)${NC}"
        return 1
    else
        echo -e "${YELLOW}⚠️  $URL - HTTP $STATUS (Unreachable)${NC}"
        return 1
    fi
}

echo "Checking site status..."
check_site "https://vertikalapp.com"
check_site "https://creators.vertikalapp.com"
check_site "https://networks.vertikalapp.com"
check_site "https://investors.vertikalapp.com"
check_site "https://beta.vertikalapp.com"

echo ""
echo -e "${BLUE}STEP 2: VERIFYING LOCAL FILES${NC}"
echo "======================================"
echo ""

# Check if required files exist
check_file() {
    local FILE=$1
    if [ -f "$FILE" ]; then
        echo -e "${GREEN}✅ $FILE exists${NC}"
        return 0
    else
        echo -e "${RED}❌ $FILE missing${NC}"
        return 1
    fi
}

check_file "public/index.html"
check_file "public/investors/index.html"
check_file "public/networks/index.html"
check_file "public/creators/index.html"
check_file "public/beta/index.html"

echo ""
echo -e "${BLUE}STEP 3: VERIFYING GIT STATUS${NC}"
echo "======================================"
echo ""

if git diff --quiet && git diff --cached --quiet; then
    echo -e "${GREEN}✅ Working tree clean${NC}"
else
    echo -e "${YELLOW}⚠️  Uncommitted changes detected${NC}"
    git status --short
fi

echo ""
echo -e "${BLUE}STEP 4: DEPLOYMENT INSTRUCTIONS${NC}"
echo "======================================"
echo ""
echo "Open Cloudflare Dashboard: https://dash.cloudflare.com"
echo ""
echo "For EACH project below, verify:"
echo "1. Click the project name"
echo "2. Go to 'Custom domains' tab"
echo "3. Verify domain shows 'Active'"
echo "4. If missing, click 'Set up a custom domain' and add it"
echo ""
echo -e "${YELLOW}REQUIRED MAPPINGS:${NC}"
echo "  vertikalapp          → vertikalapp.com (Active)"
echo "  investors-vertikalapp → investors.vertikalapp.com (Active)"
echo "  networks-vertikalapp  → networks.vertikalapp.com (Active)"
echo "  creators-vertikalapp  → creators.vertikalapp.com (Active)"
echo "  beta-vertikalapp      → beta.vertikalapp.com (Active)"
echo ""

echo -e "${BLUE}STEP 5: MANUAL UPLOAD (IF NEEDED)${NC}"
echo "======================================"
echo ""
echo "If sites still show 404, manually upload files:"
echo ""
echo "For vertikalapp.com:"
echo "  1. Cloudflare → vertikalapp → New deployment → Upload assets"
echo "  2. Select: public/index.html, public/terms.html, public/privacy.html, public/assets/"
echo "  3. Drag into upload area"
echo "  4. Click 'Save and deploy'"
echo ""
echo "For investors.vertikalapp.com:"
echo "  1. Cloudflare → investors-vertikalapp → New deployment → Upload assets"
echo "  2. Select: public/investors/index.html and all files in that folder"
echo "  3. Drag into upload area"
echo "  4. Click 'Save and deploy'"
echo ""
echo "For networks.vertikalapp.com:"
echo "  1. Cloudflare → networks-vertikalapp → New deployment → Upload assets"
echo "  2. Select: public/networks/index.html and all files in that folder"
echo "  3. Drag into upload area"
echo "  4. Click 'Save and deploy'"
echo ""

echo -e "${BLUE}STEP 6: TRIGGER GITHUB ACTIONS DEPLOYMENT${NC}"
echo "======================================"
echo ""

read -p "Trigger GitHub Actions deployment now? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Triggering deployment..."
    git add -A
    git commit -m "Master fix: Trigger deployment for all sites" --allow-empty
    git push origin main
    echo ""
    echo -e "${GREEN}✅ Deployment triggered${NC}"
    echo "Monitor: https://github.com/AlphaJRR/vertikal/actions"
else
    echo "Skipping deployment trigger"
fi

echo ""
echo -e "${BLUE}STEP 7: VERIFICATION${NC}"
echo "======================================"
echo ""
echo "After deployment completes (2-5 minutes), verify in incognito:"
echo ""
echo "Expected results:"
echo "  vertikalapp.com → 'CINEMA ISN'T DYING. IT'S ROTATING.'"
echo "  investors.vertikalapp.com → 'CAPITALIZING ON THE ROTATION'"
echo "  networks.vertikalapp.com → 'STUDIOS REBUILT FOR THE VERTICAL ERA'"
echo "  creators.vertikalapp.com → 'BUILD FRANCHISES. NOT JUST FOLLOWERS.'"
echo "  beta.vertikalapp.com → 'INSIDE THE ENGINE'"
echo ""

read -p "Open sites in incognito browser now? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Opening sites in incognito..."
    open -na "Google Chrome" --args --incognito "https://vertikalapp.com" 2>/dev/null || open -a "Google Chrome" --args --incognito "https://vertikalapp.com" 2>/dev/null || echo "Could not open Chrome"
    sleep 2
    open -na "Google Chrome" --args --incognito "https://investors.vertikalapp.com" 2>/dev/null || open -a "Google Chrome" --args --incognito "https://investors.vertikalapp.com" 2>/dev/null || echo "Could not open Chrome"
    sleep 2
    open -na "Google Chrome" --args --incognito "https://networks.vertikalapp.com" 2>/dev/null || open -a "Google Chrome" --args --incognito "https://networks.vertikalapp.com" 2>/dev/null || echo "Could not open Chrome"
    sleep 2
    open -na "Google Chrome" --args --incognito "https://creators.vertikalapp.com" 2>/dev/null || open -a "Google Chrome" --args --incognito "https://creators.vertikalapp.com" 2>/dev/null || echo "Could not open Chrome"
    sleep 2
    open -na "Google Chrome" --args --incognito "https://beta.vertikalapp.com" 2>/dev/null || open -a "Google Chrome" --args --incognito "https://beta.vertikalapp.com" 2>/dev/null || echo "Could not open Chrome"
fi

echo ""
echo "═══════════════════════════════════════════════════════════"
echo -e "${GREEN}        ✅ MASTER FIX SCRIPT COMPLETE ✅${NC}"
echo "═══════════════════════════════════════════════════════════"
echo ""
echo "Next steps:"
echo "1. Check Cloudflare Dashboard → Custom domains for each project"
echo "2. Wait 2-5 minutes for deployment"
echo "3. Test all sites in incognito mode"
echo "4. If 404 persists, manually upload files as described above"
echo ""

