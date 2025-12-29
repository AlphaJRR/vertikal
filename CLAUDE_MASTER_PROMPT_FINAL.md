# 🎯 CLAUDE MASTER PROMPT — FINAL INTEGRATION

**Author:** CURSOR — Senior Engineer  
**Date:** December 15, 2024  
**Purpose:** Complete master prompt additions for Claude to implement signup system  
**Status:** Ready for Integration

---

## 📋 EXECUTIVE SUMMARY

**Current State:**
- ✅ Database schema: Complete (`SUPABASE-SCHEMA.sql` with trigger)
- ✅ Profile creation trigger: Implemented (auto-creates profile on signup)
- ✅ Logo compliance: Fixed (100% compliant)
- ❌ Frontend signup: NOT IMPLEMENTED (critical blocker)
- ❌ Domain-based role assignment: NOT IMPLEMENTED (critical blocker)
- ❌ Supabase client initialization: BROKEN (placeholder values)

**Required:** Implement frontend signup flows for all 4 domains with domain-based role assignment.

---

## 🔴 CRITICAL IMPLEMENTATION REQUIREMENTS

### **1. SUPABASE AUTH SIGNUP (MANDATORY)**

**Current State:** Landing page only has waitlist form (inserts to `waitlist` table).  
**Required:** Actual Supabase Auth signup with `supabase.auth.signUp()`.

**Implementation Required:**

```javascript
// File: public/index.html (and subdomain variants)
// Replace waitlist-only forms with actual signup

async function handleSignup(email, password, username, role) {
  const { data, error } = await supabase.auth.signUp({
    email: email,
    password: password,
    options: {
      data: {
        role: role, // From domain detection
        source: window.location.hostname,
        username: username,
        handle: username // If provided
      }
    }
  });
  
  if (error) {
    // Show error to user
    showStatus('signup', `❌ ${error.message}`, true);
    return;
  }
  
  // Success - trigger will auto-create profile
  showStatus('signup', '✅ Account created! Check your email.', false);
  
  // Redirect based on email confirmation setting
  if (data.user && !data.user.email_confirmed_at) {
    // Show "check your email" message
  } else {
    // Redirect to app/dashboard
  }
}
```

**Files to Modify:**
- `public/index.html` (main site)
- `files (7)/creators/index.html` (creators site)
- `files (7)/investors/index.html` (investors site)
- `files (7)/networks/index.html` (if exists)

**Critical:** Must call `supabase.auth.signUp()`, not just insert to waitlist.

---

### **2. DOMAIN-BASED ROLE ASSIGNMENT (MANDATORY)**

**Current State:** No role detection logic exists.  
**Required:** Function to determine role from domain, pass in signup metadata.

**Implementation Required:**

```javascript
// File: public/js/signup.js (create new file) OR inline in HTML

/**
 * Determine user role based on current domain
 * @returns {string} 'viewer' | 'creator' | 'investor' | 'network'
 */
function determineRoleByDomain() {
  const hostname = window.location.hostname.toLowerCase();
  
  if (hostname.includes('creators.')) return 'creator';
  if (hostname.includes('investors.')) return 'investor';
  if (hostname.includes('networks.')) return 'network';
  
  // Default for vertikalapp.com
  return 'viewer';
}

// Usage in signup:
const role = determineRoleByDomain();
const { data, error } = await supabase.auth.signUp({
  email: email,
  password: password,
  options: {
    data: {
      role: role, // ← Pass role in metadata
      source: window.location.hostname,
      username: username
    }
  }
});
```

**Domain Mapping:**
- `vertikalapp.com` → `viewer`
- `creators.vertikalapp.com` → `creator`
- `investors.vertikalapp.com` → `investor`
- `networks.vertikalapp.com` → `network`

**Critical:** Role MUST be passed in `options.data.role` for trigger to read it.

---

### **3. SUPABASE CLIENT INITIALIZATION (MANDATORY)**

**Current State:** Placeholder values (`YOUR_SUPABASE_URL_HERE`).  
**Required:** Actual credentials or Netlify env vars.

**Implementation Required:**

```javascript
// Option 1: Netlify Environment Variables (Recommended)
// File: netlify.toml or build script
const SUPABASE_URL = '<!-- SUPABASE_URL -->'; // Replace at build time
const SUPABASE_ANON_KEY = '<!-- SUPABASE_ANON_KEY -->'; // Replace at build time

// Option 2: Direct Values (For Testing Only)
const SUPABASE_URL = 'https://vuwawtzhhcarckybdgbd.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_r52TGUTyJr0uU9dPFi6V8g_va7Iab3Y';

// Initialize client
let supabaseClient = null;

function initSupabase() {
  if (typeof supabase !== 'undefined') {
    supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log('✅ Supabase client initialized');
  } else {
    console.error('❌ Supabase CDN failed to load');
  }
}

// Call on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSupabase);
} else {
  initSupabase();
}
```

**Files to Fix:**
- `public/index.html:705-706`
- `public/supabase-client.js:9`
- All subdomain HTML files

**Critical:** Client must initialize BEFORE any signup calls.

---

### **4. ERROR HANDLING (MANDATORY)**

**Required:** All signup errors must be surfaced to users.

**Implementation Required:**

```javascript
async function handleSignup(email, password, username) {
  try {
    const role = determineRoleByDomain();
    
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          role: role,
          source: window.location.hostname,
          username: username
        }
      }
    });
    
    if (error) {
      // Map Supabase errors to user-friendly messages
      let userMessage = 'Signup failed. Please try again.';
      
      if (error.message.includes('already registered')) {
        userMessage = 'This email is already registered. Try logging in instead.';
      } else if (error.message.includes('password')) {
        userMessage = 'Password must be at least 8 characters.';
      } else if (error.message.includes('email')) {
        userMessage = 'Please enter a valid email address.';
      }
      
      showStatus('signup', `❌ ${userMessage}`, true);
      return;
    }
    
    // Success
    if (data.user && !data.user.email_confirmed_at) {
      showStatus('signup', '✅ Account created! Please check your email to confirm.', false);
    } else {
      showStatus('signup', '✅ Account created! Redirecting...', false);
      setTimeout(() => {
        window.location.href = '/dashboard'; // Or appropriate redirect
      }, 2000);
    }
    
  } catch (err) {
    console.error('Signup error:', err);
    showStatus('signup', '❌ Network error. Please check your connection.', true);
  }
}
```

**Critical:** No silent failures. User must see what went wrong.

---

### **5. EMAIL CONFIRMATION HANDLING (DECISION REQUIRED)**

**Current Recommendation:** Keep email confirmation OFF for launch.

**If Email Confirmation OFF:**
- Set in Supabase Dashboard → Auth → Settings
- Users can use app immediately after signup
- No confirmation UI needed

**If Email Confirmation ON:**
- Must handle confirmation redirect (`?token=...&type=signup`)
- Show "check your email" message after signup
- Verify token and update user state
- Redirect to appropriate domain after confirmation

**Implementation (if confirmation ON):**

```javascript
// Check for confirmation token in URL
const urlParams = new URLSearchParams(window.location.search);
const token = urlParams.get('token');
const type = urlParams.get('type');

if (token && type === 'signup') {
  // Verify token
  const { data, error } = await supabase.auth.verifyOtp({
    token_hash: token,
    type: 'signup'
  });
  
  if (error) {
    showStatus('confirmation', '❌ Invalid or expired confirmation link.', true);
  } else {
    showStatus('confirmation', '✅ Email confirmed! Redirecting...', false);
    setTimeout(() => {
      window.location.href = '/dashboard';
    }, 2000);
  }
}
```

**Decision:** Document choice in `BRAND_GUIDELINES.md`.

---

### **6. REDIRECT URLS (REQUIRED)**

**Required:** Add all subdomain redirect URLs to Supabase Auth config.

**Supabase Dashboard → Auth → URL Configuration:**

**Site URL:**
```
https://vertikalapp.com
```

**Additional Redirect URLs (add all):**
```
https://vertikalapp.com/*
https://www.vertikalapp.com/*
https://creators.vertikalapp.com/*
https://investors.vertikalapp.com/*
https://networks.vertikalapp.com/*
https://demo.vertikalapp.com/*
http://localhost:3000/*
http://localhost:19006/*
exp://localhost:19000/*
exp://127.0.0.1:19000/*
```

**Action:** Manual configuration in Supabase Dashboard (cannot be automated).

---

### **7. POST-SIGNUP VERIFICATION (TESTING)**

**Required:** Verify signup works end-to-end.

**SQL Verification Queries:**

```sql
-- After test signup, verify:
SELECT 
  u.id,
  u.email,
  u.email_confirmed_at,
  u.raw_user_meta_data->>'role' as role_from_metadata,
  p.role as role_in_profile,
  p.source,
  p.username,
  p.created_at
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE u.email = 'test@example.com';

-- Expected Result:
-- ✅ User exists in auth.users
-- ✅ Profile exists in public.profiles
-- ✅ role_in_profile matches role_from_metadata
-- ✅ role matches domain (viewer/creator/investor/network)
-- ✅ source matches hostname
```

**Manual Test Steps:**
1. Go to `https://vertikalapp.com` (or subdomain)
2. Fill signup form
3. Submit form
4. Check email (if confirmation enabled)
5. Click confirmation link (if confirmation enabled)
6. Verify profile created in `public.profiles`
7. Verify role matches domain

**Critical:** Run these tests after EVERY implementation change.

---

## 📋 IMPLEMENTATION CHECKLIST

**Before marking signup as "complete":**

- [ ] Supabase Auth signup implemented (`supabase.auth.signUp()`)
- [ ] Domain-based role detection function created
- [ ] Role passed in signup metadata (`options.data.role`)
- [ ] Supabase client initialized (not placeholders)
- [ ] Error handling for all failure cases
- [ ] Success/error messages shown to users
- [ ] Redirect URLs added for all domains (Supabase Dashboard)
- [ ] Email confirmation decision made (ON/OFF)
- [ ] Test signup on each domain (viewer/creator/investor/network)
- [ ] Verify profile auto-created in database
- [ ] Verify role matches domain
- [ ] Verify no orphaned users (all have profiles)
- [ ] Document any schema changes
- [ ] Update frontend code if schema changed

---

## 🎯 PRIORITY ORDER

**Implement in this order:**

1. **P0:** Supabase client initialization (blocks everything)
2. **P0:** Domain-based role detection function
3. **P0:** Actual Supabase Auth signup implementation
4. **P0:** Error handling and user feedback
5. **P1:** Email confirmation decision + implementation
6. **P1:** Redirect URLs for all domains (manual)
7. **P2:** Post-signup verification queries

---

## 🔍 SCHEMA ALIGNMENT

**Claude's Schema (`SUPABASE-SCHEMA.sql`):**
- Uses `username` field (TEXT UNIQUE)
- Uses `role` field (TEXT, default 'viewer')
- Uses `source` field (TEXT) for domain tracking
- Trigger reads role from `raw_user_meta_data->>'role'`

**Action Required:**
- Verify frontend passes role in metadata
- Verify trigger function reads from correct metadata field
- Test that profile is created with correct role

**Critical:** Schema mismatch will break profile creation.

---

## ⚠️ CRITICAL NOTES

1. **Profile Auto-Creation:** Trigger function (`handle_new_user()`) reads role from `NEW.raw_user_meta_data->>'role'`. Must pass role in signup metadata.

2. **Role Assignment:** Role MUST be determined at signup time (from domain), not after. Cannot change role later without admin action.

3. **No Duplicate Profiles:** Trigger uses `ON CONFLICT DO NOTHING` to prevent duplicates. Safe for retries.

4. **Email Confirmation:** If enabled, users cannot complete signup until they click confirmation link. Must handle this in UI.

5. **Supabase Client:** Must initialize BEFORE any signup calls. Check `supabaseClient !== null` before use.

---

## 🧭 TESTING REQUIREMENTS

**After Implementation:**

1. **Test Each Domain:**
   - Sign up on `vertikalapp.com` → Verify role = `viewer`
   - Sign up on `creators.vertikalapp.com` → Verify role = `creator`
   - Sign up on `investors.vertikalapp.com` → Verify role = `investor`
   - Sign up on `networks.vertikalapp.com` → Verify role = `network`

2. **Verify Database:**
   - User exists in `auth.users`
   - Profile exists in `public.profiles`
   - Role matches domain
   - Source matches hostname
   - No orphaned users (all have profiles)

3. **Verify Error Handling:**
   - Duplicate email → Shows error
   - Weak password → Shows error
   - Invalid email → Shows error
   - Network error → Shows error

4. **Verify Email Confirmation (if enabled):**
   - Email sent
   - Confirmation link works
   - User status updates after confirmation

---

## 📊 SUCCESS CRITERIA

**Signup is "complete" when:**

- ✅ User can sign up on any domain
- ✅ Profile is auto-created with correct role
- ✅ Role matches domain
- ✅ No silent failures
- ✅ All errors surfaced to users
- ✅ Email confirmation handled (if enabled)
- ✅ Redirect URLs configured for all domains

**If ANY criteria fails, signup is NOT complete.**

---

**Status:** Ready for Claude to implement  
**Next:** Integrate this prompt into Claude's master prompt  
**Priority:** P0 — Blocks launch

