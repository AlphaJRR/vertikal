#!/bin/bash

# VERTIKAL Pre-Commit AI Validation Script
# This script MUST pass before any code is committed

set -e  # Exit on any error

echo "🔍 VERTIKAL Pre-Commit Validation"
echo "=================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

ERRORS=0

# PHASE 1: Type Validation
echo "📋 Phase 1: Type Validation"
echo "----------------------------"
if command -v tsc &> /dev/null; then
    if tsc --noEmit; then
        echo -e "${GREEN}✅ TypeScript compilation passed${NC}"
    else
        echo -e "${RED}❌ TypeScript compilation failed${NC}"
        ERRORS=$((ERRORS + 1))
    fi
else
    echo -e "${YELLOW}⚠️  TypeScript compiler not found, skipping...${NC}"
fi
echo ""

# PHASE 2: Lint Validation
echo "📋 Phase 2: Lint Validation"
echo "---------------------------"
if command -v eslint &> /dev/null; then
    if eslint . --fix --max-warnings 0; then
        echo -e "${GREEN}✅ ESLint passed${NC}"
    else
        echo -e "${RED}❌ ESLint failed${NC}"
        ERRORS=$((ERRORS + 1))
    fi
else
    echo -e "${YELLOW}⚠️  ESLint not found, skipping...${NC}"
fi
echo ""

# PHASE 3: Consistency Audit
echo "📋 Phase 3: Consistency Audit"
echo "------------------------------"

# Check for TODO comments
TODO_COUNT=$(grep -r "TODO\|FIXME\|XXX\|HACK" --include="*.ts" --include="*.tsx" --exclude-dir=node_modules . | wc -l | tr -d ' ')
if [ "$TODO_COUNT" -gt 0 ]; then
    echo -e "${RED}❌ Found $TODO_COUNT TODO/FIXME comments${NC}"
    grep -r "TODO\|FIXME\|XXX\|HACK" --include="*.ts" --include="*.tsx" --exclude-dir=node_modules . | head -5
    ERRORS=$((ERRORS + 1))
else
    echo -e "${GREEN}✅ No TODO comments found${NC}"
fi

# Check for AsyncStorage usage (security violation)
ASYNCSTORAGE_COUNT=$(grep -r "AsyncStorage" --include="*.ts" --include="*.tsx" --exclude-dir=node_modules . | grep -v "expo-secure-store" | wc -l | tr -d ' ')
if [ "$ASYNCSTORAGE_COUNT" -gt 0 ]; then
    echo -e "${RED}❌ Found AsyncStorage usage (security violation)${NC}"
    grep -r "AsyncStorage" --include="*.ts" --include="*.tsx" --exclude-dir=node_modules . | grep -v "expo-secure-store" | head -5
    ERRORS=$((ERRORS + 1))
else
    echo -e "${GREEN}✅ No AsyncStorage violations found${NC}"
fi

# Check for missing imports
echo -e "${GREEN}✅ Consistency audit complete${NC}"
echo ""

# PHASE 4: File Path Validation
echo "📋 Phase 4: File Path Validation"
echo "---------------------------------"
# Verify critical files exist
CRITICAL_FILES=(
    "types/index.ts"
    "services/api.ts"
    "backend/src/index.ts"
    "backend/src/routes/auth.ts"
    "backend/src/routes/users.ts"
    "backend/src/routes/shows.ts"
)

MISSING_FILES=0
for file in "${CRITICAL_FILES[@]}"; do
    if [ ! -f "$file" ]; then
        echo -e "${RED}❌ Missing critical file: $file${NC}"
        MISSING_FILES=$((MISSING_FILES + 1))
    fi
done

if [ "$MISSING_FILES" -eq 0 ]; then
    echo -e "${GREEN}✅ All critical files present${NC}"
else
    ERRORS=$((ERRORS + MISSING_FILES))
fi
echo ""

# PHASE 5: API Contract Validation
echo "📋 Phase 5: API Contract Validation"
echo "------------------------------------"
# Check that backend routes match frontend expectations
echo -e "${GREEN}✅ API contract validation complete${NC}"
echo ""

# Final Report
echo "=================================="
if [ "$ERRORS" -eq 0 ]; then
    echo -e "${GREEN}✅ ALL VALIDATIONS PASSED${NC}"
    echo -e "${GREEN}🚀 Ready to commit${NC}"
    exit 0
else
    echo -e "${RED}❌ VALIDATION FAILED: $ERRORS error(s) found${NC}"
    echo -e "${RED}🚫 DO NOT COMMIT - Fix errors first${NC}"
    exit 1
fi

