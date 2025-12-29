#!/bin/bash

# Fix Creators Pages Deployment
# Forces a clean redeploy of creators.vertikalapp.com with correct content

set -e

echo "═══════════════════════════════════════════════════════════"
echo "        🔧 FIXING CREATORS PAGES DEPLOYMENT 🔧"
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

# Step 1: Verify source directory
echo -e "${BLUE}📁 STEP 1: Verifying source directory...${NC}"
SOURCE_DIR="public/creators"

if [ ! -d "$SOURCE_DIR" ]; then
    echo -e "${RED}❌ ERROR: Directory $SOURCE_DIR does not exist${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Source directory exists: $SOURCE_DIR${NC}"

# Check for index.html (handle both naming conventions)
if [ -f "$SOURCE_DIR/creators:index.html" ]; then
    echo -e "${YELLOW}⚠️  Found creators:index.html (colon in filename)${NC}"
    echo -e "${BLUE}📝 Creating proper index.html...${NC}"
    cp "$SOURCE_DIR/creators:index.html" "$SOURCE_DIR/index.html"
    echo -e "${GREEN}✅ Created index.html${NC}"
elif [ -f "$SOURCE_DIR/index.html" ]; then
    echo -e "${GREEN}✅ Found index.html${NC}"
else
    echo -e "${RED}❌ ERROR: No index.html found in $SOURCE_DIR${NC}"
    exit 1
fi

# Step 2: Prepare dist directory
echo ""
echo -e "${BLUE}📦 STEP 2: Preparing dist directory...${NC}"
rm -rf dist-creators
mkdir -p dist-creators

# Copy all creators content to dist
echo -e "${BLUE}📋 Copying content from $SOURCE_DIR to dist-creators...${NC}"
cp -r "$SOURCE_DIR"/* dist-creators/

# Ensure index.html exists
if [ ! -f "dist-creators/index.html" ]; then
    echo -e "${RED}❌ ERROR: index.html not found in dist-creators${NC}"
    exit 1
fi

FILE_COUNT=$(find dist-creators -type f | wc -l | tr -d ' ')
echo -e "${GREEN}✅ Prepared dist-creators ($FILE_COUNT files)${NC}"

# Step 3: Deploy to Cloudflare Pages
echo ""
echo -e "${BLUE}🚀 STEP 3: Deploying to Cloudflare Pages...${NC}"
echo -e "${YELLOW}Project: creators-vertikalapp${NC}"
echo -e "${YELLOW}Directory: dist-creators${NC}"
echo ""

npx wrangler pages deploy dist-creators \
  --project-name=creators-vertikalapp \
  --branch=production \
  --compatibility-date=2024-01-01

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✅ Deployment successful!${NC}"
else
    echo ""
    echo -e "${RED}❌ Deployment failed${NC}"
    exit 1
fi

# Step 4: Instructions for cache purge
echo ""
echo -e "${BLUE}📋 STEP 4: Cache Purge Instructions${NC}"
echo -e "${YELLOW}⚠️  Manual step required:${NC}"
echo ""
echo "1. Go to Cloudflare Dashboard"
echo "2. Navigate to: Workers & Pages → creators-vertikalapp"
echo "3. Go to: Caching → Configuration"
echo "4. Click: Custom Purge"
echo "5. Enter URL: https://creators.vertikalapp.com/*"
echo "6. Click: Purge Everything"
echo ""

# Step 5: Verification instructions
echo -e "${BLUE}✅ STEP 5: Verification${NC}"
echo ""
echo "After purging cache, verify in incognito mode:"
echo "  https://creators.vertikalapp.com"
echo ""
echo "Check for:"
echo "  ✅ Correct logo"
echo "  ✅ Correct copy"
echo "  ✅ Correct layout"
echo "  ✅ No fallback branding"
echo ""

echo "═══════════════════════════════════════════════════════════"
echo -e "${GREEN}        ✅ CREATORS DEPLOYMENT FIXED ✅${NC}"
echo "═══════════════════════════════════════════════════════════"

