# 🎯 COPY-PASTE MASTER PROMPT FOR CLAUDE

**Copy everything below this line into Claude's master prompt:**

---

## 🔴 CRITICAL SIGNUP IMPLEMENTATION REQUIREMENTS

### **MANDATORY: Frontend Supabase Auth Signup**

**Current State:** Landing pages only have waitlist forms (insert to `waitlist` table).  
**Required:** Actual `supabase.auth.signUp()` implementation.

**Implementation:**

```javascript
// Replace waitlist-only forms with actual signup
async function handleSignup(email, password, username) {
  const role = determineRoleByDomain(); // See below
  
  const { data, error } = await supabase.auth.signUp({
    email: email,
    password: password,
    options: {
      data: {
        role: role, // ← CRITICAL: Pass role in metadata
        source: window.location.hostname,
        username: username
      }
    }
  });
  
  if (error) {
    // Show user-friendly error
    showStatus('signup', `❌ ${getErrorMessage(error)}`, true);
    return;
  }
  
  // Success - trigger will auto-create profile
  if (data.user && !data.user.email_confirmed_at) {
    showStatus('signup', '✅ Account created! Check your email.', false);
  } else {
    showStatus('signup', '✅ Account created! Redirecting...', false);
    setTimeout(() => window.location.href = '/dashboard', 2000);
  }
}
```

**Files:** `public/index.html`, `files (7)/creators/index.html`, `files (7)/investors/index.html`

---

### **MANDATORY: Domain-Based Role Assignment**

**Required Function:**

```javascript
function determineRoleByDomain() {
  const hostname = window.location.hostname.toLowerCase();
  if (hostname.includes('creators.')) return 'creator';
  if (hostname.includes('investors.')) return 'investor';
  if (hostname.includes('networks.')) return 'network';
  return 'viewer'; // Default for vertikalapp.com
}
```

**Mapping:**
- `vertikalapp.com` → `viewer`
- `creators.vertikalapp.com` → `creator`
- `investors.vertikalapp.com` → `investor`
- `networks.vertikalapp.com` → `network`

**Critical:** Role MUST be passed in `options.data.role` for trigger to read it.

---

### **MANDATORY: Supabase Client Initialization**

**Fix Placeholder Values:**

```javascript
// File: public/index.html, public/supabase-client.js
// Replace: 'YOUR_SUPABASE_URL_HERE' with actual values

const SUPABASE_URL = 'https://vuwawtzhhcarckybdgbd.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_r52TGUTyJr0uU9dPFi6V8g_va7Iab3Y';

// OR use Netlify env vars (recommended for production)
// const SUPABASE_URL = '<!-- SUPABASE_URL -->'; // Replace at build time
```

**Critical:** Client must initialize BEFORE any signup calls.

---

### **MANDATORY: Error Handling**

**All errors must be surfaced:**

```javascript
function getErrorMessage(error) {
  if (error.message.includes('already registered')) {
    return 'This email is already registered. Try logging in instead.';
  }
  if (error.message.includes('password')) {
    return 'Password must be at least 8 characters.';
  }
  if (error.message.includes('email')) {
    return 'Please enter a valid email address.';
  }
  return 'Signup failed. Please try again.';
}
```

**Critical:** No silent failures. User must see what went wrong.

---

### **REQUIRED: Redirect URLs**

**Add to Supabase Dashboard → Auth → URL Configuration:**

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

**Action:** Manual configuration (cannot be automated).

---

### **DECISION REQUIRED: Email Confirmation**

**Option A (Recommended):** Keep OFF
- Users can use app immediately
- No confirmation UI needed
- Set in Supabase Dashboard → Auth → Settings

**Option B:** Enable and build UI
- Show "check your email" message
- Handle confirmation redirect (`?token=...&type=signup`)
- Verify token and redirect

**Document decision in `BRAND_GUIDELINES.md`.**

---

## ✅ VERIFICATION CHECKLIST

**Before marking complete:**

- [ ] `supabase.auth.signUp()` implemented (not waitlist only)
- [ ] `determineRoleByDomain()` function created
- [ ] Role passed in signup metadata
- [ ] Supabase client initialized (not placeholders)
- [ ] Error handling for all cases
- [ ] Success/error messages shown
- [ ] Redirect URLs added (all domains)
- [ ] Email confirmation decision made
- [ ] Test signup on each domain
- [ ] Verify profile auto-created
- [ ] Verify role matches domain
- [ ] Verify no orphaned users

---

## 🎯 SUCCESS CRITERIA

**Signup is "complete" when:**

- ✅ User can sign up on any domain
- ✅ Profile auto-created with correct role
- ✅ Role matches domain
- ✅ No silent failures
- ✅ All errors surfaced to users

**If ANY criteria fails, signup is NOT complete.**

---

**Priority:** P0 — Blocks launch  
**Status:** Ready for implementation

