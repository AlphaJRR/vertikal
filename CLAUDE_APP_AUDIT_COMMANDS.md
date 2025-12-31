# 🔍 CLAUDE APP AUDIT — TERMINAL COMMANDS

**Purpose:** Commands for Claude to audit the mobile app codebase  
**Target:** Achieve B+ (92/100) or higher  
**Date:** December 31, 2024

---

## 📋 COPY-PASTE THESE COMMANDS FOR CLAUDE

Run these commands in sequence to audit the Vertikal mobile app:

```bash
# Navigate to project root
cd ~/Vertikal-App

# ============================================
# 1. PROJECT STRUCTURE & FILES
# ============================================

# Show app structure
echo "=== APP STRUCTURE ===" && \
find . -type f -name "*.tsx" -o -name "*.ts" | grep -E "(App|screens|components|hooks|services)" | head -n 50

# Count files by type
echo "" && echo "=== FILE COUNTS ===" && \
echo "TypeScript files: $(find . -name "*.ts" -o -name "*.tsx" | wc -l)" && \
echo "Components: $(find components -name "*.tsx" 2>/dev/null | wc -l)" && \
echo "Screens: $(find screens -name "*.tsx" 2>/dev/null | wc -l)" && \
echo "Hooks: $(find hooks -name "*.ts" 2>/dev/null | wc -l)" && \
echo "Services: $(find services -name "*.ts" 2>/dev/null | wc -l)"

# ============================================
# 2. CORE APP FILES
# ============================================

# Show main App.tsx structure
echo "" && echo "=== APP.TSX STRUCTURE ===" && \
head -n 100 App.tsx | grep -E "(import|export|const|function|component)" | head -n 30

# Show package.json dependencies
echo "" && echo "=== DEPENDENCIES ===" && \
cat package.json | grep -A 50 '"dependencies"' | head -n 40

# ============================================
# 3. API INTEGRATION AUDIT
# ============================================

# Check API configuration
echo "" && echo "=== API CONFIGURATION ===" && \
cat config/api.config.ts | head -n 50 && \
echo "" && echo "=== API SERVICE ===" && \
head -n 50 services/api.ts

# Check backend client
echo "" && echo "=== BACKEND CLIENT ===" && \
head -n 100 services/backendClient.ts | grep -E "(export|async|function)" | head -n 30

# Check API hooks
echo "" && echo "=== API HOOKS ===" && \
head -n 50 hooks/useProjects.ts && \
head -n 50 hooks/useCreators.ts && \
head -n 50 hooks/useAuth.ts

# ============================================
# 4. ERROR HANDLING AUDIT
# ============================================

# Check error handling
echo "" && echo "=== ERROR HANDLING ===" && \
grep -r "ErrorBoundary\|errorTracking\|Sentry\|catch\|throw" components hooks services --include="*.ts" --include="*.tsx" | head -n 30

# Check error boundaries
echo "" && echo "=== ERROR BOUNDARIES ===" && \
find components -name "*Error*" -o -name "*Boundary*" 2>/dev/null && \
cat components/ui/ErrorBoundary.tsx 2>/dev/null | head -n 50

# ============================================
# 5. CODE QUALITY CHECKS
# ============================================

# Check TypeScript errors
echo "" && echo "=== TYPESCRIPT CHECK ===" && \
npx tsc --noEmit --skipLibCheck 2>&1 | head -n 50 || echo "TypeScript check completed"

# Check for console.log/console.error (should use error tracking)
echo "" && echo "=== CONSOLE USAGE ===" && \
grep -r "console\." hooks services components screens --include="*.ts" --include="*.tsx" | grep -v "console.error\|console.warn" | head -n 20 || echo "No console.log found (good)"

# Check for TODO/FIXME comments
echo "" && echo "=== TODO/FIXME COMMENTS ===" && \
grep -r "TODO\|FIXME\|XXX\|HACK" hooks services components screens --include="*.ts" --include="*.tsx" | head -n 20 || echo "No TODOs found"

# ============================================
# 6. COMPONENT STRUCTURE
# ============================================

# List all components
echo "" && echo "=== COMPONENTS LIST ===" && \
find components -name "*.tsx" -type f | sort

# List all screens
echo "" && echo "=== SCREENS LIST ===" && \
find screens -name "*.tsx" -type f | sort

# ============================================
# 7. HOOKS & SERVICES AUDIT
# ============================================

# Check hooks structure
echo "" && echo "=== HOOKS STRUCTURE ===" && \
ls -la hooks/ && \
echo "" && \
for file in hooks/*.ts; do echo "=== $file ===" && head -n 30 "$file" && echo ""; done

# Check services structure
echo "" && echo "=== SERVICES STRUCTURE ===" && \
ls -la services/ && \
echo "" && \
for file in services/*.ts; do echo "=== $file ===" && head -n 30 "$file" && echo ""; done

# ============================================
# 8. ENVIRONMENT & CONFIGURATION
# ============================================

# Check environment setup
echo "" && echo "=== ENVIRONMENT CHECK ===" && \
cat .env 2>/dev/null | sed 's/=.*/=***REDACTED***/' | head -n 20 || echo ".env file not found (check manually)" && \
echo "" && \
cat app.json | head -n 50 && \
echo "" && \
cat tsconfig.json | head -n 30

# ============================================
# 9. TESTING & QUALITY METRICS
# ============================================

# Check for test files
echo "" && echo "=== TEST FILES ===" && \
find . -name "*.test.ts" -o -name "*.test.tsx" -o -name "*.spec.ts" -o -name "*.spec.tsx" | head -n 20 || echo "No test files found"

# Check linting setup
echo "" && echo "=== LINTING SETUP ===" && \
cat package.json | grep -E "eslint|prettier|lint" || echo "No linting config found"

# ============================================
# 10. PERFORMANCE & OPTIMIZATION
# ============================================

# Check for React.memo, useMemo, useCallback usage
echo "" && echo "=== PERFORMANCE OPTIMIZATIONS ===" && \
grep -r "React.memo\|useMemo\|useCallback" components screens hooks --include="*.tsx" --include="*.ts" | wc -l && \
echo "performance optimizations found"

# Check for unnecessary re-renders
echo "" && echo "=== REACT QUERY USAGE ===" && \
grep -r "useQuery\|useMutation" hooks components screens --include="*.tsx" --include="*.ts" | wc -l && \
echo "React Query hooks found"

# ============================================
# 11. SECURITY AUDIT
# ============================================

# Check for secure storage usage
echo "" && echo "=== SECURITY CHECK ===" && \
grep -r "SecureStore\|expo-secure-store" hooks services components --include="*.ts" --include="*.tsx" | head -n 10 || echo "No SecureStore found"

# Check for token handling
echo "" && echo "=== TOKEN HANDLING ===" && \
grep -r "token\|Token\|auth_token\|refresh_token" hooks services --include="*.ts" --include="*.tsx" | grep -v "node_modules" | head -n 15

# ============================================
# 12. NAVIGATION & ROUTING
# ============================================

# Check navigation setup
echo "" && echo "=== NAVIGATION SETUP ===" && \
grep -r "@react-navigation\|NavigationContainer\|createBottomTabNavigator\|createStackNavigator" App.tsx components screens --include="*.tsx" --include="*.ts" | head -n 20

# ============================================
# 13. FINAL SUMMARY
# ============================================

# Generate summary
echo "" && echo "=== AUDIT SUMMARY ===" && \
echo "Total TypeScript files: $(find . -name "*.ts" -o -name "*.tsx" | wc -l)" && \
echo "Components: $(find components -name "*.tsx" 2>/dev/null | wc -l)" && \
echo "Screens: $(find screens -name "*.tsx" 2>/dev/null | wc -l)" && \
echo "Hooks: $(find hooks -name "*.ts" 2>/dev/null | wc -l)" && \
echo "Services: $(find services -name "*.ts" 2>/dev/null | wc -l)" && \
echo "Error boundaries: $(find components -name "*Error*" -o -name "*Boundary*" 2>/dev/null | wc -l)" && \
echo "API endpoints configured: $(grep -r "endpoints\." config services --include="*.ts" | wc -l)" && \
echo "" && \
echo "✅ Audit commands complete. Review output above."
```

---

## 🎯 QUICK AUDIT COMMAND (Single Line)

For a quick overview, run this single command:

```bash
cd ~/Vertikal-App && \
echo "=== QUICK AUDIT ===" && \
echo "Files: $(find . -name "*.ts" -o -name "*.tsx" | wc -l)" && \
echo "Components: $(find components -name "*.tsx" 2>/dev/null | wc -l)" && \
echo "Screens: $(find screens -name "*.tsx" 2>/dev/null | wc -l)" && \
echo "Hooks: $(find hooks -name "*.ts" 2>/dev/null | wc -l)" && \
echo "Services: $(find services -name "*.ts" 2>/dev/null | wc -l)" && \
echo "" && \
echo "=== KEY FILES ===" && \
ls -lh App.tsx hooks/useProjects.ts hooks/useAuth.ts services/api.ts services/backendClient.ts 2>/dev/null && \
echo "" && \
echo "=== ERROR HANDLING ===" && \
find components -name "*Error*" -o -name "*Boundary*" 2>/dev/null && \
echo "" && \
echo "=== API CONFIG ===" && \
head -n 20 config/api.config.ts 2>/dev/null
```

---

## 📊 GRADING CHECKLIST FOR CLAUDE

After running the commands above, Claude should evaluate:

### 1. Core Functionality (25 points)
- [ ] Authentication works
- [ ] Feed loads content
- [ ] Video playback works
- [ ] Profile creation works
- [ ] Upload functionality exists
- [ ] Comments/VIBE™ works
- [ ] Badge system displays
- [ ] Job posting works

### 2. API Integration (20 points)
- [ ] API client configured correctly
- [ ] Error handling implemented
- [ ] Loading states present
- [ ] Network errors handled
- [ ] Token management secure
- [ ] No 500 errors in code

### 3. User Experience (20 points)
- [ ] Navigation intuitive
- [ ] Loading indicators present
- [ ] Error messages clear
- [ ] Empty states handled
- [ ] Onboarding flow exists
- [ ] Profile setup works

### 4. Performance (15 points)
- [ ] React Query caching
- [ ] Memoization used
- [ ] Efficient data fetching
- [ ] No memory leaks
- [ ] Optimized rendering

### 5. Error Handling (10 points)
- [ ] Error boundaries present
- [ ] Network errors caught
- [ ] Validation errors handled
- [ ] Sentry integration works
- [ ] User-friendly messages

### 6. Code Quality (10 points)
- [ ] TypeScript types correct
- [ ] No console.log in production
- [ ] Code follows patterns
- [ ] Proper error tracking
- [ ] Clean structure

---

## 🚀 USAGE INSTRUCTIONS FOR CLAUDE

1. **Copy the full command block** above
2. **Paste into terminal** (or have user run it)
3. **Review output** for each section
4. **Grade each category** using the checklist
5. **Calculate final score** (target: 92+/100)
6. **Generate report** using the format in `APP_AUDIT_REPORT.md`

---

## 📝 EXPECTED OUTPUT

Claude should produce:
- File structure overview
- API configuration review
- Error handling assessment
- Code quality evaluation
- Performance optimization check
- Security audit
- Final grade (must be B+ or higher)

---

**READY FOR CLAUDE TO EXECUTE**

