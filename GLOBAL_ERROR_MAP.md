# 🧨 VERTIKAL GLOBAL ERROR MAP

**Status:** PREVENTIVE ERROR PREVENTION SYSTEM  
**Effective Date:** December 13, 2024  
**Purpose:** Prevent mistakes BEFORE they happen

---

## 🎯 PURPOSE

This map identifies **ALL recurring failures** that the AI team MUST eliminate permanently. Every AI agent must memorize this map and check against it BEFORE every output.

---

## 🔥 CATEGORY 1 — SYSTEM BREAKERS

### **If any of these occur, the AI MUST STOP and correct itself:**

---

### **1️⃣ UNALIGNED TYPES**

#### **Error Pattern:**
- Backend returns `username`, frontend expects `name`
- Backend returns `coverImage`, frontend expects `img`
- Backend returns `coinBalance`, frontend expects `coins`

#### **Prevention:**
- ✅ Always use transformers from `types/index.ts`
- ✅ Check Prisma schema before writing
- ✅ Verify field mappings in transformers
- ✅ Test transformation output

#### **Fix:**
```typescript
// ❌ WRONG
const creator = { name: user.username }; // Direct mapping

// ✅ CORRECT
import { transformUserDTO } from '../types';
const creator = transformUserDTO(user); // Use transformer
```

---

### **2️⃣ UNUSED OR WRONG IMPORTS**

#### **Error Pattern:**
- Importing from wrong path
- Missing imports
- Circular dependencies
- Wrong package imports

#### **Prevention:**
- ✅ Verify all imports before writing
- ✅ Check import paths against file structure
- ✅ Use only approved packages
- ✅ Remove unused imports

#### **Fix:**
```typescript
// ❌ WRONG
import { Creator } from './data'; // Wrong path

// ✅ CORRECT
import { Creator } from '../types'; // Correct path
```

---

### **3️⃣ WRITING CODE TO WRONG FILE PATH**

#### **Error Pattern:**
- Creating file in wrong directory
- Modifying wrong file
- Wrong file name
- Wrong directory structure

#### **Prevention:**
- ✅ Confirm file path before writing
- ✅ Verify directory structure
- ✅ Check file naming conventions
- ✅ Review `GLOBAL_ARCHITECTURE_MAP.md`

#### **Fix:**
```bash
# ❌ WRONG
backend/src/users.ts

# ✅ CORRECT
backend/src/routes/users.ts
```

---

### **4️⃣ MISSING FIELDS IN TRANSFORMATION**

#### **Error Pattern:**
- UI expects `img`, backend returns `coverImage`
- UI expects `name`, backend returns `username`
- UI expects `subTitle`, backend returns `description`
- Missing nested fields

#### **Prevention:**
- ✅ Use transformer functions
- ✅ Verify all fields mapped
- ✅ Check UI component requirements
- ✅ Test transformation output

#### **Fix:**
```typescript
// ❌ WRONG
const project = { img: show.coverImage }; // Missing fields

// ✅ CORRECT
import { transformProjectDTO } from '../types';
const project = transformProjectDTO(show); // All fields mapped
```

---

### **5️⃣ BREAKING REACT QUERY SHAPE**

#### **Error Pattern:**
- `data?.creators` vs `data`
- Wrong query key structure
- Missing error handling
- Wrong return shape

#### **Prevention:**
- ✅ Follow React Query hook patterns
- ✅ Use consistent query keys
- ✅ Verify return shape
- ✅ Check existing hooks

#### **Fix:**
```typescript
// ❌ WRONG
const { data } = useQuery({ queryKey: ['creators'] });
const creators = data?.creators; // Wrong shape

// ✅ CORRECT
const { data: creators } = useCreators(); // Correct hook
```

---

### **6️⃣ SECURITY VIOLATIONS**

#### **Error Pattern:**
- Using `AsyncStorage` for tokens
- Logging sensitive data
- Leaking errors with sensitive info
- Weak validation

#### **Prevention:**
- ✅ Always use `expo-secure-store` for tokens
- ✅ Remove `console.log` in production
- ✅ Sanitize error messages
- ✅ Validate all inputs

#### **Fix:**
```typescript
// ❌ WRONG
await AsyncStorage.setItem('auth_token', token);

// ✅ CORRECT
import * as SecureStore from 'expo-secure-store';
await SecureStore.setItemAsync('auth_token', token);
```

---

### **7️⃣ INCOMPLETE SOLUTIONS**

#### **Error Pattern:**
- Missing imports
- Missing returns
- Missing error handlers
- Missing retry logic
- Missing types
- TODO comments

#### **Prevention:**
- ✅ Complete compliance checklist
- ✅ Verify all imports
- ✅ Add error handling
- ✅ Add retry logic
- ✅ Remove all TODOs

#### **Fix:**
```typescript
// ❌ WRONG
async function fetchUsers() {
  // TODO: Add error handling
  return users;
}

// ✅ CORRECT
async function fetchUsers() {
  try {
    const users = await apiClient.getUsers();
    return users;
  } catch (error) {
    errorTracking.captureException(error);
    throw error;
  }
}
```

---

## 🟡 CATEGORY 2 — HIGH PRIORITY ERRORS

### **These cause issues but don't break the system:**

---

### **8️⃣ MISSING ERROR HANDLING**

#### **Error Pattern:**
- No try-catch blocks
- No error boundaries
- No error logging
- Generic error messages

#### **Prevention:**
- ✅ Add try-catch to all async functions
- ✅ Add error boundaries to components
- ✅ Log errors to Sentry
- ✅ Provide user-friendly messages

---

### **9️⃣ MISSING VALIDATION**

#### **Error Pattern:**
- No input validation
- No email format check
- No password strength check
- No null checks

#### **Prevention:**
- ✅ Validate all inputs
- ✅ Check email format
- ✅ Enforce password strength
- ✅ Handle null/undefined

---

### **🔟 INCONSISTENT NAMING**

#### **Error Pattern:**
- Mixing `camelCase` and `snake_case`
- Inconsistent variable names
- Wrong naming conventions

#### **Prevention:**
- ✅ Use `camelCase` consistently
- ✅ Follow naming conventions
- ✅ Check existing code patterns

---

## 🟢 CATEGORY 3 — MINOR ISSUES

### **These are quality issues but don't break functionality:**

---

### **1️⃣1️⃣ MISSING DOCUMENTATION**

#### **Error Pattern:**
- No JSDoc comments
- No function descriptions
- No parameter documentation

#### **Prevention:**
- ✅ Add JSDoc comments
- ✅ Document all functions
- ✅ Explain complex logic

---

### **1️⃣2️⃣ CODE DUPLICATION**

#### **Error Pattern:**
- Repeated code blocks
- Duplicate functions
- Copy-paste code

#### **Prevention:**
- ✅ Extract common functions
- ✅ Use utilities
- ✅ Follow DRY principle

---

## 🚨 ERROR PREVENTION PROTOCOL

### **Before Every Output:**

1. ✅ **Check Error Map**
   - Review all error categories
   - Identify potential errors
   - Prevent before writing

2. ✅ **Self-Diagnosis**
   - Ask: "What errors could this cause?"
   - List 10 potential errors
   - Eliminate all of them

3. ✅ **Validation**
   - Run compliance checklist
   - Run consistency audit
   - Verify no errors

4. ✅ **Confirmation**
   - Confirm no system breakers
   - Confirm no high priority errors
   - Then proceed

---

## ✅ ERROR MAP CONFIRMATION

**All AI agents must:**

- [ ] Memorize all error categories
- [ ] Check against error map before output
- [ ] Prevent errors before they happen
- [ ] Self-diagnose potential errors
- [ ] Eliminate all errors before delivery

**Status:** ⚠️ **ERROR PREVENTION ACTIVE**

