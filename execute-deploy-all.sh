#!/bin/bash

# EXECUTE DEPLOY ALL - Manual Deployment Script
# This script ensures all 5 surfaces are deployed

set -e

echo "═══════════════════════════════════════════════════════════"
echo "        🚀 EXECUTE: DEPLOY ALL SURFACES 🚀"
echo "═══════════════════════════════════════════════════════════"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Check if wrangler is available
if ! command -v wrangler &> /dev/null && ! command -v npx &> /dev/null; then
    echo -e "${YELLOW}⚠️  Wrangler not found. Installing...${NC}"
    npm install -g wrangler
fi

# Check credentials
if [ -z "$CLOUDFLARE_API_TOKEN" ] || [ -z "$CLOUDFLARE_ACCOUNT_ID" ]; then
    echo -e "${YELLOW}⚠️  Cloudflare credentials not set${NC}"
    echo ""
    echo "Set environment variables:"
    echo "  export CLOUDFLARE_API_TOKEN=\"your_token\""
    echo "  export CLOUDFLARE_ACCOUNT_ID=\"your_account_id\""
    echo ""
    echo "Or the GitHub Actions workflow will handle deployments automatically."
    echo ""
    echo -e "${BLUE}📊 Monitor GitHub Actions:${NC}"
    echo "   https://github.com/AlphaJRR/vertikal/actions"
    echo ""
    exit 0
fi

echo -e "${GREEN}✅ Credentials found${NC}"
echo ""

# Function to deploy a surface
deploy_surface() {
    local SURFACE=$1
    local DIR=$2
    local PROJECT=$3
    
    echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
    echo -e "${BLUE}        Deploying: ${SURFACE}${NC}"
    echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
    echo ""
    
    if [ ! -d "$DIR" ]; then
        echo -e "${YELLOW}⚠️  Directory $DIR not found. Skipping.${NC}"
        return 1
    fi
    
    # Prepare dist directory
    DIST_DIR="dist-${SURFACE}"
    rm -rf "$DIST_DIR"
    mkdir -p "$DIST_DIR"
    
    # Copy files
    cp -r "$DIR"/* "$DIST_DIR"/ 2>/dev/null || cp -r "$DIR"/. "$DIST_DIR"/ 2>/dev/null
    
    # Handle colon filenames
    if [ -f "${DIR}/${SURFACE}:index.html" ]; then
        cp "${DIR}/${SURFACE}:index.html" "${DIST_DIR}/index.html"
    fi
    
    FILE_COUNT=$(find "$DIST_DIR" -type f | wc -l | tr -d ' ')
    echo -e "${GREEN}✅ Prepared $FILE_COUNT files${NC}"
    
    # Deploy
    echo -e "${BLUE}🚀 Deploying to ${PROJECT}...${NC}"
    npx wrangler pages deploy "$DIST_DIR" \
      --project-name="$PROJECT" \
      --branch=production \
      --compatibility-date=2024-01-01
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ ${SURFACE} deployed successfully!${NC}"
        echo ""
    else
        echo -e "${YELLOW}⚠️  Deployment failed for ${SURFACE}${NC}"
        echo ""
    fi
}

# Deploy all surfaces
echo -e "${BLUE}Starting deployments...${NC}"
echo ""

deploy_surface "vertikalapp" "public" "vertikalapp"
deploy_surface "creators" "public/creators" "creators-vertikalapp"
deploy_surface "networks" "public/networks" "networks-vertikalapp"
deploy_surface "investors" "public/investors" "investors-vertikalapp"
deploy_surface "beta" "public/beta" "beta-vertikalapp"

echo ""
echo "═══════════════════════════════════════════════════════════"
echo -e "${GREEN}        ✅ ALL DEPLOYMENTS EXECUTED ✅${NC}"
echo "═══════════════════════════════════════════════════════════"
echo ""
echo -e "${YELLOW}VERIFICATION:${NC}"
echo "1. Check Cloudflare Dashboard → Pages → Each project"
echo "2. Verify 'Assets uploaded: 3+ files' (NOT 1)"
echo "3. Test URLs in incognito mode"
echo "4. Purge cache if needed"
echo ""
echo -e "${BLUE}Monitor:${NC} https://github.com/AlphaJRR/vertikal/actions"
echo ""

