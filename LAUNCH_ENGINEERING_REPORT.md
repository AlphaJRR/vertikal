# 🚀 LAUNCH ENGINEERING REPORT — SIGNUP SYSTEM

**Author:** CURSOR — Senior Engineer / Launch Reliability  
**Date:** December 15, 2024  
**Status:** 🔴 **CRITICAL BLOCKERS IDENTIFIED**

---

## ✅ VERIFIED SAFE

### **1. Database Schema**
- **File:** `scripts/signup_system_complete.sql`
- **Status:** ✅ Schema is correct
- **Tables:** `profiles`, `creator_applications`, `badges`, `profile_badges` properly defined
- **RLS Policies:** Correctly configured for authenticated users
- **Indexes:** Performance indexes in place
- **Constraints:** Unique constraints on `handle` and foreign keys properly set

### **2. Profile Creation Logic (Backend)**
- **File:** `backend/src/routes/users.ts:192`
- **Status:** ✅ Uses Prisma `upsert()` — prevents duplicates
- **Safety:** Atomic operation, no race conditions
- **Validation:** Username sanitization and length checks in place

### **3. Error Handling**
- **Backend routes:** All endpoints have try/catch blocks
- **Error responses:** Proper HTTP status codes
- **User feedback:** Error messages are user-friendly

### **4. Waitlist Form (Landing Page)**
- **File:** `public/index.html:754-835`
- **Status:** ✅ Form submission works
- **Error handling:** Errors are surfaced to users
- **Note:** This is waitlist only, NOT actual signup

---

## ⚠️ ISSUES FOUND

### **🔴 CRITICAL: Supabase Auth Signup NOT IMPLEMENTED**

**Severity:** CRITICAL — BLOCKS LAUNCH  
**Location:** Missing implementation

**Problem:**
- Landing page (`public/index.html`) only inserts into `waitlist` table
- **NO actual Supabase Auth signup code exists**
- No `supabase.auth.signUp()` calls found
- Users cannot create accounts

**Impact:**
- **Signup flow is completely broken**
- Users can only join waitlist, not create accounts
- No email confirmation possible
- No authentication possible

**Required Implementation:**
```javascript
// Missing: Actual Supabase Auth signup
const { data, error } = await supabase.auth.signUp({
  email: email,
  password: password,
  options: {
    data: {
      role: determineRoleByDomain(), // See next issue
      handle: handle
    }
  }
});
```

**Fix Priority:** P0 — Must be implemented before launch

---

### **🔴 CRITICAL: Domain-Based Role Assignment NOT IMPLEMENTED**

**Severity:** CRITICAL — BLOCKS LAUNCH  
**Location:** Missing implementation

**Problem:**
- No code determines role by domain
- Expected mapping:
  - `vertikalapp.com` → `viewer`
  - `creators.vertikalapp.com` → `creator`
  - `investors.vertikalapp.com` → `investor`
  - `networks.vertikalapp.com` → `network`
- Role assignment logic does not exist

**Impact:**
- Users cannot be assigned correct roles
- All users would default to `'user'` (from SQL schema)
- Role-based features will not work

**Required Implementation:**
```javascript
// Missing: Domain-based role determination
function determineRoleByDomain() {
  const hostname = window.location.hostname;
  if (hostname.includes('creators.')) return 'creator';
  if (hostname.includes('investors.')) return 'investor';
  if (hostname.includes('networks.')) return 'network';
  return 'viewer'; // Default for vertikalapp.com
}
```

**Fix Priority:** P0 — Must be implemented before launch

---

### **🔴 CRITICAL: Auto-Profile Creation Trigger NOT IMPLEMENTED**

**Severity:** CRITICAL — BLOCKS LAUNCH  
**Location:** `scripts/signup_system_complete.sql:192-199`

**Problem:**
```sql
create or replace function public.handle_new_user()
returns trigger as $$
begin
  -- Profile will be created by frontend after signup
  -- This is here for reference - you can trigger it manually if needed
  return new;
end;
$$ language plpgsql security definer;
```

**The function is empty** — it does nothing. No trigger is attached to `auth.users`.

**Impact:**
- After Supabase Auth signup, no profile is created
- Users exist in `auth.users` but not in `profiles` table
- App will break when trying to fetch profile

**Required Implementation:**
```sql
-- Fix: Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  user_role TEXT;
BEGIN
  -- Extract role from metadata (set during signup)
  user_role := COALESCE(NEW.raw_user_meta_data->>'role', 'viewer');
  
  -- Create profile with role from metadata
  INSERT INTO public.profiles (id, handle, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'handle', 'user_' || substr(NEW.id::text, 1, 8)),
    user_role
  )
  ON CONFLICT (id) DO NOTHING; -- Prevent duplicates
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Attach trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

**Fix Priority:** P0 — Must be implemented before launch

---

### **🟡 MEDIUM: Supabase Client Not Initialized**

**Severity:** MEDIUM  
**Location:** `public/index.html:705-706`

**Problem:**
```javascript
const SUPABASE_URL = 'YOUR_SUPABASE_URL_HERE';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY_HERE';
```

**Impact:**
- Supabase client will not initialize
- Waitlist form will fail
- Signup (when implemented) will fail

**Fix:**
- Replace with actual credentials or Netlify env vars
- Use build-time injection

**Fix Priority:** P1 — Blocks waitlist functionality

---

### **🟡 MEDIUM: Email Confirmation Not Handled**

**Severity:** MEDIUM  
**Location:** Documentation says "Turn OFF email confirmation"

**Problem:**
- Documentation recommends turning OFF email confirmation
- No UI exists to handle "check your email" state
- If email confirmation is enabled, users will be stuck

**Impact:**
- Users may think signup failed
- No way to complete signup flow if confirmation required

**Fix:**
- **Option 1:** Keep email confirmation OFF (current recommendation)
- **Option 2:** Build email confirmation UI if needed

**Fix Priority:** P1 — UX issue

---

### **🟢 LOW: Missing Redirect URLs for All Domains**

**Severity:** LOW  
**Location:** Supabase Auth configuration

**Problem:**
- Documentation only lists `vertikalapp.com` redirect URLs
- Missing redirect URLs for:
  - `creators.vertikalapp.com`
  - `investors.vertikalapp.com`
  - `networks.vertikalapp.com`

**Impact:**
- Auth redirects may fail on subdomains
- Users may not complete signup flow

**Fix:**
- Add all subdomain redirect URLs to Supabase Auth config

**Fix Priority:** P2 — Should be fixed before launch

---

## 🔧 CHANGES MADE

### **None — Critical Issues Require Implementation**

**Reason:** The signup system is not implemented. Code changes are required to make it work.

**Required Actions:**
1. Implement Supabase Auth signup
2. Implement domain-based role assignment
3. Implement auto-profile creation trigger
4. Fix Supabase client initialization
5. Add redirect URLs for all domains

---

## 🧭 ENGINEER HANDOFF NOTES

### **Where Signups Appear in Supabase**

**After Supabase Auth signup:**
1. **`auth.users` table** — User account created
2. **`public.profiles` table** — Profile should be auto-created (currently broken)

**To verify signups:**
```sql
-- Check auth users
SELECT id, email, created_at, email_confirmed_at 
FROM auth.users 
ORDER BY created_at DESC;

-- Check profiles
SELECT id, handle, role, display_name, created_at 
FROM public.profiles 
ORDER BY created_at DESC;

-- Find users without profiles (BROKEN STATE)
SELECT u.id, u.email, u.created_at
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE p.id IS NULL;
```

### **How Admins Can Verify New Users**

**Supabase Dashboard:**
1. Go to **Authentication** → **Users**
2. See all registered users
3. Check `email_confirmed_at` to see if email confirmed

**Database:**
1. Go to **Table Editor** → `public.profiles`
2. Filter by `created_at` to see recent signups
3. Check `role` column to verify role assignment

### **What Logs to Check When Something Fails**

**Supabase Logs:**
1. **Auth Logs:** Supabase Dashboard → Logs → Auth
2. **Database Logs:** Supabase Dashboard → Logs → Postgres
3. **API Logs:** Supabase Dashboard → Logs → API

**Browser Console:**
1. Check for JavaScript errors
2. Check Supabase client initialization
3. Check network requests to Supabase

**Common Failure Points:**
- **Signup fails:** Check Supabase Auth logs, verify email provider enabled
- **Profile not created:** Check trigger exists, check RLS policies
- **Role wrong:** Check domain detection, check metadata passed to signup
- **Redirect fails:** Check redirect URLs in Supabase Auth config

### **Testing Signup Flow**

**Manual Test Steps:**
1. Go to `https://vertikalapp.com` (or subdomain)
2. Fill signup form (when implemented)
3. Submit form
4. Check email for confirmation (if enabled)
5. Click confirmation link
6. Verify profile created in `public.profiles`
7. Verify role matches domain

**SQL Verification:**
```sql
-- After test signup, verify:
SELECT 
  u.id,
  u.email,
  u.email_confirmed_at,
  p.handle,
  p.role,
  p.created_at
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE u.email = 'test@example.com';
```

**Expected Result:**
- User exists in `auth.users`
- Profile exists in `public.profiles`
- Role matches domain (viewer/creator/investor/network)
- `email_confirmed_at` is set (if confirmation enabled)

---

## 🚨 LAUNCH BLOCKERS SUMMARY

**Critical (P0) — Must Fix Before Launch:**
1. ❌ Implement Supabase Auth signup
2. ❌ Implement domain-based role assignment
3. ❌ Implement auto-profile creation trigger

**High (P1) — Should Fix Before Launch:**
4. ⚠️ Fix Supabase client initialization
5. ⚠️ Handle email confirmation state

**Medium (P2) — Nice to Have:**
6. ⚠️ Add redirect URLs for all domains

---

**Status:** 🔴 **NOT READY FOR LAUNCH**  
**Next Steps:** Implement critical fixes above, then re-run verification

