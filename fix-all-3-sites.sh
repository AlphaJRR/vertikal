#!/bin/bash

# Fix All 3 Sites - One Script
# Fixes: creators, investors, beta (all deployed with wrong artifacts)

set -e

echo "═══════════════════════════════════════════════════════════"
echo "        ⚔️  FIXING ALL 3 BROKEN SITES ⚔️"
echo "═══════════════════════════════════════════════════════════"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check credentials
if [ -z "$CLOUDFLARE_API_TOKEN" ] || [ -z "$CLOUDFLARE_ACCOUNT_ID" ]; then
    echo -e "${RED}❌ ERROR: Credentials not set${NC}"
    echo ""
    echo "Set:"
    echo "  export CLOUDFLARE_API_TOKEN=\"your_token\""
    echo "  export CLOUDFLARE_ACCOUNT_ID=\"your_account_id\""
    exit 1
fi

echo -e "${GREEN}✅ Credentials found${NC}"
echo ""

# Function to deploy a site
deploy_site() {
    local SITE_NAME=$1
    local SOURCE_DIR=$2
    local PROJECT_NAME=$3
    local DIST_DIR="dist-${SITE_NAME}"
    
    echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
    echo -e "${BLUE}        FIXING: ${SITE_NAME}${NC}"
    echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
    echo ""
    
    # Verify source
    if [ ! -d "$SOURCE_DIR" ]; then
        echo -e "${RED}❌ ERROR: $SOURCE_DIR does not exist${NC}"
        return 1
    fi
    
    # Prepare dist
    echo -e "${BLUE}📦 Preparing dist directory...${NC}"
    rm -rf "$DIST_DIR"
    mkdir -p "$DIST_DIR"
    
    # Copy all content
    cp -r "$SOURCE_DIR"/* "$DIST_DIR"/ 2>/dev/null || cp -r "$SOURCE_DIR"/. "$DIST_DIR"/ 2>/dev/null
    
    # Handle colon filenames
    if [ -f "${SOURCE_DIR}/${SITE_NAME}:index.html" ]; then
        echo -e "${YELLOW}⚠️  Found ${SITE_NAME}:index.html, creating index.html...${NC}"
        cp "${SOURCE_DIR}/${SITE_NAME}:index.html" "${DIST_DIR}/index.html"
    fi
    
    # Verify index.html exists
    if [ ! -f "${DIST_DIR}/index.html" ]; then
        echo -e "${RED}❌ ERROR: index.html not found${NC}"
        return 1
    fi
    
    # Count files
    FILE_COUNT=$(find "$DIST_DIR" -type f | wc -l | tr -d ' ')
    echo -e "${GREEN}✅ Prepared $DIST_DIR ($FILE_COUNT files)${NC}"
    
    if [ "$FILE_COUNT" -lt 3 ]; then
        echo -e "${RED}❌ ERROR: Too few files ($FILE_COUNT). Expected 3+ files.${NC}"
        return 1
    fi
    
    # Deploy
    echo ""
    echo -e "${BLUE}🚀 Deploying to $PROJECT_NAME...${NC}"
    npx wrangler pages deploy "$DIST_DIR" \
      --project-name="$PROJECT_NAME" \
      --branch=production \
      --compatibility-date=2024-01-01
    
    if [ $? -eq 0 ]; then
        echo ""
        echo -e "${GREEN}✅ $SITE_NAME deployed successfully!${NC}"
        echo -e "${GREEN}✅ Deployed $FILE_COUNT files${NC}"
        echo ""
        echo -e "${YELLOW}⚠️  VERIFY in Cloudflare Dashboard:${NC}"
        echo -e "${YELLOW}   Project: $PROJECT_NAME${NC}"
        echo -e "${YELLOW}   Assets uploaded should show: $FILE_COUNT+ files${NC}"
        echo -e "${YELLOW}   If it shows 1 file, deployment failed.${NC}"
        echo ""
    else
        echo -e "${RED}❌ Deployment failed for $SITE_NAME${NC}"
        return 1
    fi
}

# Fix Creators
deploy_site "creators" "public/creators" "creators-vertikalapp"

# Fix Investors
deploy_site "investors" "public/investors" "investors-vertikalapp"

# Fix Beta
deploy_site "beta" "public/beta" "beta-vertikalapp"

echo ""
echo "═══════════════════════════════════════════════════════════"
echo -e "${GREEN}        ✅ ALL 3 SITES FIXED ✅${NC}"
echo "═══════════════════════════════════════════════════════════"
echo ""
echo -e "${YELLOW}NEXT STEPS:${NC}"
echo "1. Go to Cloudflare Dashboard"
echo "2. Check each deployment: Assets uploaded should show 3+ files (NOT 1)"
echo "3. Purge cache for all 3 sites"
echo "4. Test in incognito mode"
echo ""
echo -e "${YELLOW}Sites to verify:${NC}"
echo "  • https://creators.vertikalapp.com"
echo "  • https://investors.vertikalapp.com"
echo "  • https://beta.vertikalapp.com"
echo ""

