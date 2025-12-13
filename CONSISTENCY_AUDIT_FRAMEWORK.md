# 🔍 VERTIKAL SYSTEM-WIDE CONSISTENCY AUDIT FRAMEWORK

**Status:** CONTINUOUS AUDIT REQUIRED  
**Effective Date:** December 13, 2024  
**Compliance:** MANDATORY BACKGROUND PROCESS

---

## 🎯 PURPOSE

This framework ensures **continuous consistency** across the entire VERTIKAL codebase. Every AI must perform these audits in the background before every output.

---

## 🔍 A. TYPE CONSISTENCY AUDIT

### **Backend → API → Types → Hooks → UI MUST match exactly.**

#### **Audit Checklist:**

1. **Prisma Schema → DTO Mapping**
   - [ ] `User` model fields match `UserDTO` interface
   - [ ] `Show` model fields match `ProjectDTO` interface
   - [ ] `Profile` model fields included in `UserDTO`
   - [ ] All enum types match (`Role`, `ProjectType`)

2. **DTO → UI Type Transformation**
   - [ ] `UserDTO` → `Creator` transformation correct
   - [ ] `ProjectDTO` → `Project` transformation correct
   - [ ] All field mappings documented in `types/index.ts`
   - [ ] No field loss in transformation

3. **Naming Conventions**
   - [ ] Backend: `camelCase` (e.g., `coinBalance`, `isFounding50`)
   - [ ] Frontend: `camelCase` (e.g., `name`, `avatar`, `coins`)
   - [ ] No mixing of `snake_case` and `camelCase`
   - [ ] Consistent across all files

4. **Type Definitions**
   - [ ] All types defined in `types/index.ts`
   - [ ] No duplicate type definitions
   - [ ] No conflicting type names
   - [ ] All imports use `types/index.ts`

---

## 🔍 B. ENDPOINT CONSISTENCY AUDIT

### **Verify:**

#### **1. Route Existence**
- [ ] Route defined in `backend/src/routes/*.ts`
- [ ] Route registered in `backend/src/index.ts`
- [ ] Route matches frontend expectations

#### **2. Route Registration**
- [ ] `GET /api/users` → `usersRouter.get('/')`
- [ ] `GET /api/users/:id` → `usersRouter.get('/:id')`
- [ ] `GET /api/shows` → `showsRouter.get('/')`
- [ ] `GET /api/shows/:id` → `showsRouter.get('/:id')`
- [ ] `POST /api/auth/login` → `authRouter.post('/login')`
- [ ] `POST /api/auth/register` → `authRouter.post('/register')`

#### **3. Response Shape**
- [ ] Response matches `UserDTO` format
- [ ] Response matches `ProjectDTO` format
- [ ] Response includes all required fields
- [ ] Response excludes sensitive data (passwordHash)

#### **4. Error Handling**
- [ ] All routes have try-catch blocks
- [ ] Proper HTTP status codes (200, 201, 400, 401, 404, 500)
- [ ] Error messages are descriptive
- [ ] No 500s on malformed queries

#### **5. Field Completeness**
- [ ] No missing fields in responses
- [ ] All nested objects included
- [ ] All relations properly loaded
- [ ] All dates formatted as ISO strings

---

## 🔍 C. FILE SYSTEM INTEGRITY AUDIT

### **Every AI must know the file tree EXACTLY:**

```
Vertikal-App/
├── App.tsx                    # Main app entry point
├── services/
│   ├── api.ts                 # API client (axios)
│   ├── backendClient.ts      # Backend SDK wrapper
│   ├── analytics.ts           # Analytics service
│   └── errorTracking.ts       # Sentry integration
├── hooks/
│   ├── useApi.ts              # Unified exports
│   ├── useAuth.ts             # Auth hooks
│   ├── useCreators.ts          # Creator hooks
│   └── useProjects.ts          # Project hooks
├── components/
│   └── ui/
│       ├── ErrorBoundary.tsx   # Error boundary
│       ├── ErrorState.tsx      # Error UI
│       └── LoadingSpinner.tsx  # Loading UI
├── types/
│   ├── index.ts                # ALL type definitions
│   └── env.d.ts                # Environment types
├── utils/
│   ├── sentry.ts               # Sentry initialization
│   ├── cache.ts                # Caching utilities
│   └── dataTransform.ts        # Legacy transformers
├── backend/
│   └── src/
│       ├── index.ts             # Express server
│       ├── lib/
│       │   └── prisma.ts        # Prisma singleton
│       └── routes/
│           ├── auth.ts          # Auth routes
│           ├── users.ts         # User routes
│           ├── shows.ts         # Show routes
│           ├── comments.ts      # Comment routes
│           ├── subscriptions.ts # Subscription routes
│           └── transactions.ts  # Transaction routes
└── prisma/
    ├── schema.prisma            # Database schema
    └── seed.ts                  # Seed script
```

#### **Audit Checklist:**

- [ ] File path matches expected location
- [ ] File name matches convention
- [ ] Directory structure correct
- [ ] No files in wrong locations
- [ ] All referenced files exist

**If a file path does not match → REJECT OUTPUT.**

---

## 🔍 D. TRANSFORMATION PIPELINE AUDIT

### **Backend Data → transformDTO → UI Shape → React Query → UI Components**

**This must NEVER break.**

#### **Pipeline Flow:**

```
1. Backend (Prisma)
   ↓
   User { id, email, username, coinBalance, profile: { bio, avatarUrl, shows } }
   
2. API Response (UserDTO)
   ↓
   { id, email, username, avatar, role, isFounding50, bio, coins, projects }
   
3. Transformer (transformUserDTO)
   ↓
   Creator { id, name, avatar, role, bio, coins, stats, projects, type }
   
4. React Query Hook (useCreators)
   ↓
   { data: Creator[], isLoading, error, refetch }
   
5. UI Component
   ↓
   <CreatorCard creator={creator} />
```

#### **Audit Checklist:**

- [ ] Backend data structure matches Prisma schema
- [ ] API response matches DTO interface
- [ ] Transformer function exists and is correct
- [ ] UI type matches transformed data
- [ ] React Query hook returns correct shape
- [ ] UI component receives correct props
- [ ] No data loss at any stage
- [ ] All fields accessible in UI

---

## 🔍 E. SECURITY AUDIT

### **Continuous Security Checks:**

#### **1. Token Storage**
- [ ] No `AsyncStorage` for tokens
- [ ] All tokens use `expo-secure-store`
- [ ] Token cleanup on logout
- [ ] Token refresh logic implemented

#### **2. Error Logging**
- [ ] No `console.log` in production
- [ ] Sensitive data not logged
- [ ] Errors sent to Sentry
- [ ] User-friendly error messages

#### **3. Data Leakage**
- [ ] No password hashes in responses
- [ ] No tokens in error messages
- [ ] No sensitive data in logs
- [ ] Proper error sanitization

#### **4. Input Validation**
- [ ] Email format validated
- [ ] Password strength validated
- [ ] All inputs sanitized
- [ ] SQL injection prevented (Prisma handles)

---

## 🔍 F. API CONTRACT AUDIT

### **Backend ↔ Frontend Contract Verification:**

#### **Required Endpoints:**

| Endpoint | Method | Request | Response | Status |
|----------|--------|---------|----------|--------|
| `/api/users` | GET | - | `UserDTO[]` | ✅ |
| `/api/users/:id` | GET | - | `UserDTO` | ✅ |
| `/api/shows` | GET | - | `ProjectDTO[]` | ✅ |
| `/api/shows/:id` | GET | - | `ProjectDTO` | ✅ |
| `/api/auth/login` | POST | `{ email, password }` | `{ token, user }` | ✅ |
| `/api/auth/register` | POST | `{ email, password, name }` | `{ token, user }` | ✅ |
| `/api/subscriptions` | POST | `{ creatorId }` | `{ subscription }` | ✅ |

#### **Contract Verification:**

- [ ] Request shape matches frontend expectations
- [ ] Response shape matches frontend expectations
- [ ] All fields present in responses
- [ ] Error responses consistent
- [ ] Status codes correct

---

## 🔍 G. REACT QUERY AUDIT

### **Hook Consistency:**

#### **Required Hooks:**

- [ ] `useCreators()` → Returns `Creator[]`
- [ ] `useCreator(id)` → Returns `Creator`
- [ ] `useProjects()` → Returns `Project[]`
- [ ] `useProject(id)` → Returns `Project`
- [ ] `useLogin()` → Mutation for login
- [ ] `useRegister()` → Mutation for register
- [ ] `useLogout()` → Mutation for logout
- [ ] `useCurrentUser()` → Query for current user

#### **Hook Verification:**

- [ ] Query keys follow convention
- [ ] Error handling implemented
- [ ] Loading states handled
- [ ] Retry logic configured
- [ ] Cache invalidation correct
- [ ] Sentry integration present

---

## 🚨 ENFORCEMENT

**This audit must run BEFORE every output.**

**If ANY audit fails → FIX BEFORE OUTPUT.**

**Status:** ⚠️ **CONTINUOUS AUDIT ACTIVE**

---

## ✅ AUDIT CONFIRMATION

**Before submitting any output, confirm:**

- [ ] Type consistency audit passed
- [ ] Endpoint consistency audit passed
- [ ] File system integrity audit passed
- [ ] Transformation pipeline audit passed
- [ ] Security audit passed
- [ ] API contract audit passed
- [ ] React Query audit passed

**Only then proceed with output.**

