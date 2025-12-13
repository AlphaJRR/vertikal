# ✅ VERTIKAL AI TEAM COMPLIANCE CHECKLIST

**Status:** MANDATORY FOR EVERY TASK  
**Effective Date:** December 13, 2024  
**Compliance:** REQUIRED BEFORE ANY OUTPUT

---

## 🚨 MANDATORY PRE-OUTPUT CHECKLIST

**Every AI (Claude, Gemini, Cursor, Copilot, ChatGPT) MUST complete this BEFORE producing ANY output.**

### **STEP 0: TEAM ANNOUNCEMENT (MANDATORY)**

- [ ] **Announced myself using correct format** (See `TEAM_ANNOUNCEMENT_PROTOCOL.md`)
- [ ] **Stated my role and status**
- [ ] **Confirmed I understand my responsibilities**

**If announcement is missing → OUTPUT IS INVALID**

---

## ✔ ARCHITECTURE ALIGNMENT

- [ ] **Am I using the correct file names?**
  - Verify against `GLOBAL_ARCHITECTURE_MAP.md`
  - Check existing file structure

- [ ] **Am I using the correct folder structure?**
  - `services/` for API clients
  - `hooks/` for React Query hooks
  - `components/` for UI components
  - `types/` for type definitions
  - `backend/src/routes/` for API routes

- [ ] **Am I respecting the React Native + Expo stack?**
  - Using Expo SDK 54 compatible APIs
  - Using React Navigation for navigation
  - Using React Query for data fetching
  - Using TypeScript for type safety

- [ ] **Am I using the correct backend endpoints?**
  - Verify against `config/api.config.ts`
  - Check `backend/src/index.ts` for registered routes
  - Ensure endpoints match frontend expectations

- [ ] **Am I using the type definitions from `types/index.ts`?**
  - Import types from `types/index.ts` only
  - Use `UserDTO`, `ProjectDTO` for backend
  - Use `Creator`, `Project` for frontend
  - Use transformers: `transformUserDTO`, `transformProjectDTO`

- [ ] **Am I following the React Query architecture?**
  - Using `useQuery` for data fetching
  - Using `useMutation` for mutations
  - Proper query keys structure
  - Error handling with `onError`
  - Loading states with `isLoading`

---

## ✔ DATA & TYPES

- [ ] **Do my types match the backend DTOs?**
  - Check Prisma schema (`prisma/schema.prisma`)
  - Verify field names match exactly
  - Ensure no field mismatches

- [ ] **Did I check Prisma schema for field names?**
  - `User` model fields: `id`, `email`, `username`, `role`, `coinBalance`
  - `Profile` model fields: `bio`, `avatarUrl`, `isFounding50`, `followerCount`
  - `Show` model fields: `id`, `title`, `description`, `coverImage`, `genre`, `trailerUrl`

- [ ] **Did I ensure no undefined fields appear in transformers?**
  - All fields have fallback values
  - No `undefined` in required fields
  - Proper null handling

- [ ] **Did I maintain naming consistency?**
  - `creatorId` (camelCase) not `creator_id` (snake_case)
  - `isFounding50` not `is_founding_50`
  - `coinBalance` not `coins` (backend uses `coinBalance`)

- [ ] **Did I validate that my data transformations preserve UI shape?**
  - `username` → `name` (via transformer)
  - `coverImage` → `img` (via transformer)
  - `description` → `subTitle` (via transformer)
  - `genre` → `type` (via transformer)

---

## ✔ SECURITY

- [ ] **Am I using SecureStore, NOT AsyncStorage, for tokens?**
  - Import: `import * as SecureStore from 'expo-secure-store'`
  - Use: `SecureStore.setItemAsync('auth_token', token)`
  - Never use: `AsyncStorage.setItem('auth_token', token)`

- [ ] **Did I remove console.logs?**
  - Only use `console.log` in `__DEV__` blocks
  - Remove all production console.logs
  - Use Sentry for error logging

- [ ] **Did I avoid leaking sensitive errors?**
  - No password hashes in error messages
  - No tokens in error responses
  - Generic error messages for users
  - Detailed errors only in dev mode

---

## ✔ FUNCTIONALITY

- [ ] **Will this break any existing hook?**
  - Check `hooks/useCreators.ts`
  - Check `hooks/useProjects.ts`
  - Check `hooks/useAuth.ts`
  - Verify query keys don't conflict

- [ ] **Will this break navigation?**
  - Check `App.tsx` navigation structure
  - Verify React Navigation setup
  - Ensure no route conflicts

- [ ] **Will this break the API client?**
  - Check `services/api.ts`
  - Verify interceptors
  - Ensure no endpoint conflicts

- [ ] **Will this break the Prisma schema?**
  - Check `prisma/schema.prisma`
  - Verify no field conflicts
  - Ensure relations are correct

- [ ] **Did I test success AND failure cases?**
  - Success path tested
  - Error path tested
  - Edge cases considered
  - Null/undefined handling verified

---

## ✔ COMPLETENESS

- [ ] **Are ALL imports included?**
  - Check all imports at top of file
  - Verify no missing dependencies
  - Ensure correct import paths

- [ ] **Did I include ALL required files?**
  - All referenced files exist
  - All dependencies installed
  - All types defined

- [ ] **Is NOTHING left as a TODO?**
  - No TODO comments
  - No FIXME comments
  - No placeholder code
  - No incomplete implementations

- [ ] **Is this production-ready?**
  - Error handling complete
  - Loading states implemented
  - Type safety verified
  - Security compliant

- [ ] **Would JR approve this on the first try?**
  - Meets all standards
  - Zero errors
  - Complete solution
  - Production-ready

---

## ✔ SELF-TEST

- [ ] **Did I predict and avoid all failure modes?**
  - Type mismatches prevented
  - Null pointer errors prevented
  - Missing field errors prevented
  - API contract violations prevented

- [ ] **Did I test the transformations logically?**
  - Backend DTO → Frontend UI shape verified
  - All fields mapped correctly
  - No data loss in transformation

- [ ] **Did I test compatibility with existing code?**
  - No breaking changes
  - Backward compatible
  - No regressions

- [ ] **Did I ensure zero regressions?**
  - Existing functionality intact
  - No side effects
  - No breaking changes

---

## 🚨 ENFORCEMENT

**If ANY item fails → DO NOT SEND THE OUTPUT. FIX IT FIRST.**

**Status:** ⚠️ **MANDATORY COMPLIANCE ACTIVE**

---

## ✅ COMPLIANCE CONFIRMATION

**Before submitting any output, confirm:**

- [ ] All architecture alignment checks passed
- [ ] All data & types checks passed
- [ ] All security checks passed
- [ ] All functionality checks passed
- [ ] All completeness checks passed
- [ ] All self-test checks passed

**Only then proceed with output.**

