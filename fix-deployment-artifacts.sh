#!/bin/bash

# Fix Deployment Artifacts - Ensure Correct File Count
# This script verifies and fixes the build output for Cloudflare Pages deployment

set -e

echo "═══════════════════════════════════════════════════════════"
echo "        🔧 FIXING DEPLOYMENT ARTIFACTS 🔧"
echo "═══════════════════════════════════════════════════════════"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check for required environment variables
if [ -z "$CLOUDFLARE_API_TOKEN" ]; then
    echo -e "${RED}❌ ERROR: CLOUDFLARE_API_TOKEN not set${NC}"
    echo "Set it: export CLOUDFLARE_API_TOKEN=\"your_token\""
    exit 1
fi

if [ -z "$CLOUDFLARE_ACCOUNT_ID" ]; then
    echo -e "${RED}❌ ERROR: CLOUDFLARE_ACCOUNT_ID not set${NC}"
    echo "Set it: export CLOUDFLARE_ACCOUNT_ID=\"your_account_id\""
    exit 1
fi

# Function to prepare and deploy a site
deploy_site() {
    local SITE_NAME=$1
    local SOURCE_DIR=$2
    local PROJECT_NAME=$3
    local DIST_DIR="dist-${SITE_NAME}"
    
    echo ""
    echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
    echo -e "${BLUE}        DEPLOYING: ${SITE_NAME}${NC}"
    echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
    echo ""
    
    # Step 1: Verify source directory
    echo -e "${BLUE}📁 STEP 1: Verifying source directory...${NC}"
    if [ ! -d "$SOURCE_DIR" ]; then
        echo -e "${RED}❌ ERROR: Directory $SOURCE_DIR does not exist${NC}"
        return 1
    fi
    
    FILE_COUNT=$(find "$SOURCE_DIR" -type f | wc -l | tr -d ' ')
    echo -e "${GREEN}✅ Source directory exists: $SOURCE_DIR${NC}"
    echo -e "${GREEN}✅ Source files: $FILE_COUNT${NC}"
    
    if [ "$FILE_COUNT" -lt 5 ]; then
        echo -e "${YELLOW}⚠️  WARNING: Source has very few files ($FILE_COUNT). This may indicate an issue.${NC}"
    fi
    
    # Step 2: Prepare dist directory
    echo ""
    echo -e "${BLUE}📦 STEP 2: Preparing dist directory...${NC}"
    rm -rf "$DIST_DIR"
    mkdir -p "$DIST_DIR"
    
    # Copy all content
    echo -e "${BLUE}📋 Copying content from $SOURCE_DIR to $DIST_DIR...${NC}"
    cp -r "$SOURCE_DIR"/* "$DIST_DIR"/ 2>/dev/null || cp -r "$SOURCE_DIR"/. "$DIST_DIR"/ 2>/dev/null
    
    # Handle special case: if source has colon in filename, create proper index.html
    if [ -f "${SOURCE_DIR}/${SITE_NAME}:index.html" ]; then
        echo -e "${YELLOW}⚠️  Found ${SITE_NAME}:index.html, creating proper index.html...${NC}"
        cp "${SOURCE_DIR}/${SITE_NAME}:index.html" "${DIST_DIR}/index.html"
    fi
    
    # Ensure index.html exists
    if [ ! -f "${DIST_DIR}/index.html" ]; then
        echo -e "${RED}❌ ERROR: index.html not found in $DIST_DIR${NC}"
        return 1
    fi
    
    DIST_FILE_COUNT=$(find "$DIST_DIR" -type f | wc -l | tr -d ' ')
    echo -e "${GREEN}✅ Prepared $DIST_DIR ($DIST_FILE_COUNT files)${NC}"
    
    if [ "$DIST_FILE_COUNT" -lt 5 ]; then
        echo -e "${RED}❌ ERROR: Dist directory has too few files ($DIST_FILE_COUNT). Expected many files.${NC}"
        echo -e "${YELLOW}⚠️  This indicates the build output is incorrect.${NC}"
        return 1
    fi
    
    # Step 3: Deploy to Cloudflare Pages
    echo ""
    echo -e "${BLUE}🚀 STEP 3: Deploying to Cloudflare Pages...${NC}"
    echo -e "${YELLOW}Project: $PROJECT_NAME${NC}"
    echo -e "${YELLOW}Directory: $DIST_DIR${NC}"
    echo -e "${YELLOW}Files: $DIST_FILE_COUNT${NC}"
    echo ""
    
    npx wrangler pages deploy "$DIST_DIR" \
      --project-name="$PROJECT_NAME" \
      --branch=production \
      --compatibility-date=2024-01-01
    
    if [ $? -eq 0 ]; then
        echo ""
        echo -e "${GREEN}✅ Deployment successful!${NC}"
        echo -e "${GREEN}✅ Deployed $DIST_FILE_COUNT files to $PROJECT_NAME${NC}"
        echo ""
        echo -e "${YELLOW}⚠️  IMPORTANT: Verify in Cloudflare Dashboard:${NC}"
        echo -e "${YELLOW}   Assets uploaded should show: $DIST_FILE_COUNT+ files${NC}"
        echo -e "${YELLOW}   If it shows 1 file, the deployment failed.${NC}"
    else
        echo ""
        echo -e "${RED}❌ Deployment failed${NC}"
        return 1
    fi
}

# Deploy Investors
deploy_site "investors" "public/investors" "investors-vertikalapp"

# Deploy Creators
deploy_site "creators" "public/creators" "creators-vertikalapp"

echo ""
echo "═══════════════════════════════════════════════════════════"
echo -e "${GREEN}        ✅ DEPLOYMENT COMPLETE ✅${NC}"
echo "═══════════════════════════════════════════════════════════"
echo ""
echo -e "${YELLOW}NEXT STEPS:${NC}"
echo "1. Go to Cloudflare Dashboard"
echo "2. Check each deployment: Assets uploaded should show MANY files (not 1)"
echo "3. If it shows 1 file, the deployment is wrong - check the dist folder"
echo "4. Purge cache after verifying file counts"
echo "5. Test sites in incognito mode"
echo ""

