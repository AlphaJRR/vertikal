# 🎯 MASTER PROMPT ADDITIONS — CRITICAL ITEMS FOR CLAUDE

**Author:** CURSOR — Senior Engineer  
**Date:** December 15, 2024  
**Purpose:** Additions to Claude's master prompt based on launch engineering findings

---

## ✅ WHAT CLAUDE GOT RIGHT

1. **Trigger Function:** ✅ Properly implemented in `SUPABASE-SCHEMA.sql`
2. **Schema Design:** ✅ Comprehensive profiles table with role field
3. **RLS Policies:** ✅ Correctly configured
4. **Error Handling:** ✅ Exception handling in trigger function

---

## 🔴 CRITICAL ADDITIONS NEEDED

### **1. FRONTEND SIGNUP IMPLEMENTATION (MISSING)**

**Add to Master Prompt:**

```
## FRONTEND SIGNUP REQUIREMENT

You MUST implement actual Supabase Auth signup on the landing page.

Current state: Only waitlist form exists (inserts to waitlist table)
Required: Actual `supabase.auth.signUp()` implementation

Required Implementation:
- Replace waitlist-only forms with actual signup forms
- Call `supabase.auth.signUp()` with email + password
- Pass role in metadata: `options.data.role = determineRoleByDomain()`
- Pass source domain in metadata: `options.data.source = window.location.hostname`
- Handle signup errors (email exists, weak password, etc.)
- Show success/error messages to user
- Redirect after successful signup

Files to modify:
- `public/index.html` (landing page forms)
- Create `public/js/signup.js` (signup logic)

Critical: This is NOT optional. Signup must work end-to-end.
```

---

### **2. DOMAIN-BASED ROLE DETECTION (MISSING)**

**Add to Master Prompt:**

```
## DOMAIN-BASED ROLE ASSIGNMENT (MANDATORY)

Role assignment MUST be determined by domain at signup time.

Mapping:
- `vertikalapp.com` → `viewer`
- `creators.vertikalapp.com` → `creator`
- `investors.vertikalapp.com` → `investor`
- `networks.vertikalapp.com` → `network`

Required Implementation:
```javascript
function determineRoleByDomain() {
  const hostname = window.location.hostname;
  if (hostname.includes('creators.')) return 'creator';
  if (hostname.includes('investors.')) return 'investor';
  if (hostname.includes('networks.')) return 'network';
  return 'viewer'; // Default for vertikalapp.com
}
```

Pass role in signup metadata:
```javascript
const { data, error } = await supabase.auth.signUp({
  email: email,
  password: password,
  options: {
    data: {
      role: determineRoleByDomain(),
      source: window.location.hostname,
      username: username // if provided
    }
  }
});
```

Critical: Role MUST be set at signup. Trigger reads from `raw_user_meta_data->>'role'`.
```

---

### **3. SUPABASE CLIENT INITIALIZATION (BROKEN)**

**Add to Master Prompt:**

```
## SUPABASE CLIENT INITIALIZATION (CRITICAL)

Current state: Placeholder values in `public/index.html`
```javascript
const SUPABASE_URL = 'YOUR_SUPABASE_URL_HERE';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY_HERE';
```

Required Fix:
- Use Netlify environment variables (build-time injection)
- OR use actual credentials (not recommended for production)
- Ensure client initializes BEFORE any signup calls

Implementation:
```javascript
// Option 1: Netlify env vars (recommended)
const SUPABASE_URL = '<!-- SUPABASE_URL -->';
const SUPABASE_ANON_KEY = '<!-- SUPABASE_ANON_KEY -->';

// Option 2: Direct (for testing only)
const SUPABASE_URL = 'https://vuwawtzhhcarckybdgbd.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_r52TGUTyJr0uU9dPFi6V8g_va7Iab3Y';
```

Critical: Signup will fail silently if client not initialized.
```

---

### **4. EMAIL CONFIRMATION HANDLING (MISSING)**

**Add to Master Prompt:**

```
## EMAIL CONFIRMATION STATE HANDLING

Decision Required:
- Option A: Keep email confirmation OFF (recommended for launch)
- Option B: Build email confirmation UI

If Option B (confirmation enabled):
- Show "Check your email" message after signup
- Handle confirmation redirect (`?token=...&type=signup`)
- Verify token and update user state
- Redirect to appropriate domain after confirmation

If Option A (confirmation OFF):
- Document this decision
- Ensure Supabase Auth → Settings → Email confirmation is OFF
- Users can use app immediately after signup

Current recommendation: Option A (faster launch, simpler UX)
```

---

### **5. REDIRECT URLS FOR ALL DOMAINS (MISSING)**

**Add to Master Prompt:**

```
## SUPABASE AUTH REDIRECT URLS (REQUIRED)

Current documentation only lists `vertikalapp.com` redirects.

Required: Add redirect URLs for ALL domains:
```
https://vertikalapp.com/*
https://www.vertikalapp.com/*
https://creators.vertikalapp.com/*
https://investors.vertikalapp.com/*
https://networks.vertikalapp.com/*
https://demo.vertikalapp.com/*
http://localhost:3000/*
http://localhost:19006/*
```

Action: Update Supabase Dashboard → Auth → URL Configuration
```

---

### **6. PROFILE CREATION VERIFICATION (TESTING)**

**Add to Master Prompt:**

```
## POST-SIGNUP VERIFICATION (MANDATORY TESTING)

After implementing signup, verify:

1. User created in `auth.users`:
```sql
SELECT id, email, created_at, email_confirmed_at 
FROM auth.users 
ORDER BY created_at DESC 
LIMIT 1;
```

2. Profile auto-created in `public.profiles`:
```sql
SELECT id, email, role, source, created_at 
FROM public.profiles 
ORDER BY created_at DESC 
LIMIT 1;
```

3. Role matches domain:
- Sign up on `vertikalapp.com` → role should be `viewer`
- Sign up on `creators.vertikalapp.com` → role should be `creator`
- Sign up on `investors.vertikalapp.com` → role should be `investor`
- Sign up on `networks.vertikalapp.com` → role should be `network`

4. No orphaned users (users without profiles):
```sql
SELECT u.id, u.email, u.created_at
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE p.id IS NULL;
```
Expected: 0 rows (all users should have profiles)

Critical: Run these queries after EVERY signup test.
```

---

### **7. ERROR HANDLING REQUIREMENTS**

**Add to Master Prompt:**

```
## SIGNUP ERROR HANDLING (MANDATORY)

All signup errors MUST be surfaced to users:

1. Email already exists:
   - Show: "This email is already registered. Try logging in instead."
   - Provide link to login page

2. Weak password:
   - Show: "Password must be at least 8 characters."
   - Highlight password field

3. Invalid email format:
   - Show: "Please enter a valid email address."
   - Highlight email field

4. Network error:
   - Show: "Connection error. Please check your internet and try again."
   - Allow retry

5. Profile creation fails (rare):
   - Log error to console
   - Show: "Account created but profile setup failed. Please contact support."
   - Provide support email

Critical: No silent failures. User must know what went wrong.
```

---

### **8. SCHEMA ALIGNMENT CHECK**

**Add to Master Prompt:**

```
## SCHEMA ALIGNMENT VERIFICATION

Claude's schema (`SUPABASE-SCHEMA.sql`) uses:
- `username` field (TEXT UNIQUE)
- `role` field (TEXT, default 'viewer')
- `source` field (TEXT) for domain tracking

Existing codebase uses:
- `handle` field (in old schema)
- Different role values

Action Required:
- Verify Claude's schema matches frontend expectations
- Update frontend code if schema changed
- OR update schema to match existing frontend code

Critical: Schema mismatch will break profile creation.
```

---

## 📋 CHECKLIST FOR CLAUDE

Add this checklist to master prompt:

```
## IMPLEMENTATION CHECKLIST

Before marking signup as "complete":

- [ ] Supabase Auth signup implemented (`supabase.auth.signUp()`)
- [ ] Domain-based role detection implemented
- [ ] Role passed in signup metadata
- [ ] Supabase client initialized (not placeholders)
- [ ] Error handling for all failure cases
- [ ] Success/error messages shown to users
- [ ] Redirect URLs added for all domains
- [ ] Email confirmation decision made (ON/OFF)
- [ ] Test signup on each domain (viewer/creator/investor/network)
- [ ] Verify profile auto-created in database
- [ ] Verify role matches domain
- [ ] Verify no orphaned users (all have profiles)
- [ ] Document any schema changes
- [ ] Update frontend code if schema changed
```

---

## 🎯 PRIORITY ORDER

Claude should implement in this order:

1. **P0:** Supabase client initialization (blocks everything)
2. **P0:** Domain-based role detection function
3. **P0:** Actual Supabase Auth signup implementation
4. **P0:** Error handling and user feedback
5. **P1:** Email confirmation decision + implementation
6. **P1:** Redirect URLs for all domains
7. **P2:** Post-signup verification queries

---

**Status:** Ready for Claude to integrate into master prompt  
**Next:** Claude should add these sections to ensure complete signup implementation

