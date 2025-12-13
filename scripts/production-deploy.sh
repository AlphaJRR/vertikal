#!/bin/bash
# Production Deployment Script
# Phase 1 Canary Deployment

set -e  # Exit on error

echo "🚀 VERTIKAL — PHASE 1 PRODUCTION DEPLOYMENT"
echo "============================================"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Step 1: Verify Git Status
echo "📋 Step 1: Verifying Git Status..."
if [ -n "$(git status --porcelain)" ]; then
  echo -e "${RED}❌ Uncommitted changes detected${NC}"
  exit 1
fi
echo -e "${GREEN}✅ Git status clean${NC}"
echo ""

# Step 2: Verify Tag
echo "📋 Step 2: Verifying Release Tag..."
if git rev-parse v1.0.0-RELEASE >/dev/null 2>&1; then
  echo -e "${GREEN}✅ Tag v1.0.0-RELEASE exists${NC}"
else
  echo -e "${YELLOW}⚠️  Tag v1.0.0-RELEASE not found. Creating...${NC}"
  git tag -a v1.0.0-RELEASE -m "Production Release v1.0.0"
fi
echo ""

# Step 3: Database Migration
echo "📋 Step 3: Database Migration..."
cd backend
if [ -z "$DATABASE_URL" ]; then
  echo -e "${RED}❌ DATABASE_URL not set${NC}"
  exit 1
fi

echo "Running Prisma migration..."
npx prisma migrate deploy --schema=../prisma/schema.prisma
if [ $? -eq 0 ]; then
  echo -e "${GREEN}✅ Database migration successful${NC}"
else
  echo -e "${RED}❌ Database migration failed${NC}"
  exit 1
fi
cd ..
echo ""

# Step 4: Verify Storage Bucket
echo "📋 Step 4: Verifying Supabase Storage..."
echo -e "${YELLOW}⚠️  Manual verification required:${NC}"
echo "  1. Check Supabase Dashboard → Storage"
echo "  2. Verify 'avatars' bucket exists"
echo "  3. Verify bucket is public"
echo "  4. Verify storage policies allow uploads"
echo ""

# Step 5: Backend Health Check
echo "📋 Step 5: Backend Health Check..."
echo -e "${YELLOW}⚠️  Manual verification required:${NC}"
echo "  1. Start backend server: cd backend && npm run dev"
echo "  2. Check logs for: 'Connected to Supabase'"
echo "  3. Check logs for: 'Server listening on 4000'"
echo "  4. Test health endpoint: curl http://localhost:4000/health"
echo ""

# Step 6: Client Build
echo "📋 Step 6: Client Build Preparation..."
echo -e "${YELLOW}⚠️  Ready for EAS build:${NC}"
echo "  Run: eas build --profile production --platform all"
echo ""

echo -e "${GREEN}✅ Pre-deployment checks complete${NC}"
echo ""
echo "📊 Next Steps:"
echo "  1. Verify Supabase Storage bucket"
echo "  2. Start backend server"
echo "  3. Run health checks"
echo "  4. Build client binaries"
echo "  5. Monitor deployment health"
echo ""

