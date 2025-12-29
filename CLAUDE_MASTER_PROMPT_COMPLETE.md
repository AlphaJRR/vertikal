# 🎯 CLAUDE MASTER PROMPT — COMPLETE INTEGRATION

**Copy everything below this line into Claude's master prompt:**

---

# VERTIKAL — CRITICAL IMPLEMENTATION REQUIREMENTS

## 🔴 SECTION 1: SUPABASE AUTH SIGNUP (MANDATORY)

### **Current State:** Landing pages only have waitlist forms.  
### **Required:** Actual `supabase.auth.signUp()` implementation.

**Implementation:**

```javascript
// Replace waitlist-only forms with actual signup
async function handleSignup(email, password, username) {
  const role = determineRoleByDomain(); // See Section 2
  
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

## 🔴 SECTION 2: DOMAIN-BASED ROLE ASSIGNMENT (MANDATORY)

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

## 🔴 SECTION 3: SUPABASE CLIENT INITIALIZATION (MANDATORY)

**Fix Placeholder Values:**

```javascript
// Replace: 'YOUR_SUPABASE_URL_HERE' with actual values
const SUPABASE_URL = 'https://vuwawtzhhcarckybdgbd.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_r52TGUTyJr0uU9dPFi6V8g_va7Iab3Y';
```

**Critical:** Client must initialize BEFORE any signup calls.

---

## 🔴 SECTION 4: ERROR HANDLING (MANDATORY)

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

## 🔴 SECTION 5: REDIRECT URLS (REQUIRED)

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

## 🏆 SECTION 6: FOUNDING 50 BADGE GOVERNANCE (MANDATORY)

### **OFFICIAL BADGE IDENTIFIER**

**Asset Name:** `VERTIKAL_BADGE_CREATOR_FOUNDING50_GOLD_TITANIUM`

This is the **only approved Founding 50 badge**. All references must use this identifier.

---

### **APPROVED SURFACES (WHERE BADGE MAY APPEAR)**

The Founding 50 badge may appear **only** on:

- ✅ Creator dashboard
- ✅ Creator public profile
- ✅ Internal creator listings
- ✅ Official Vertikal-issued merchandise
- ✅ Official Vertikal-issued certificates or cards

---

### **PROHIBITED USAGE (WHERE BADGE MAY NOT APPEAR)**

The badge may **never** be used:

- ❌ As the Vertikal brand logo
- ❌ In headers or navigation
- ❌ On marketing hero sections
- ❌ On investor or network materials
- ❌ In paid ads without Founder approval
- ❌ On third-party merchandise
- ❌ As a favicon or app icon

**Critical:** If badge text appears in headers/navigation, remove it immediately.

---

### **VISUAL RULES (MANDATORY)**

- **Badge color:** Gold Titanium only (`#FFD700`)
- **No recoloring:** Never modify badge colors
- **No gradients added:** Badge must use solid Gold Titanium
- **No text embedded inside badge:** Text must be overlaid externally
- **Numbers must be overlaid externally:** Format: "Founding 50 · #01 – #50"
- **Minimum digital size:** 24px
- **Clear space:** ½ badge height on all sides

---

### **NUMBERING SYSTEM (REQUIRED)**

Each Founding 50 badge must display a unique number:

- **Format:** `Founding 50 · #01` through `Founding 50 · #50`
- **Assignment:** Automatic, chronological, immutable
- **Never reused:** Numbers are permanent once assigned
- **Database field:** `profiles.founding50Number` (1-50, unique, immutable)

**Implementation:**
```typescript
// Display logic
{isFounding50 && (
  <View style={styles.badge}>
    <Text style={styles.badgeText}>
      FOUNDING 50 · #{String(founding50Number).padStart(2, '0')}
    </Text>
  </View>
)}
```

---

## 🎨 SECTION 7: LOGO COMPLIANCE RULES (MANDATORY)

### **LOGO COLORS**

- **Main Logo:** Purple-blue gradient (`var(--vertikal-blue)` to `var(--vertikal-purple)`)
- **Investor Logo:** Black (`var(--vertikal-black)`)
- **Gold:** **ONLY** for Founding 50 badges, **NEVER** for logos

**Critical:** Gold (`#FFD700`, `#D4AF37`) must **never** be used in logo CSS. Gold is exclusively for badges.

---

### **LOGO ASSET PATHS**

**Canonical Logo Assets:**
1. **Main Logo:** Inline SVG in HTML files (purple-blue gradient)
2. **Investor Logo:** Inline SVG (black)
3. **Founding 50 Badge:** `VERTIKAL_BADGE_CREATOR_FOUNDING50_GOLD_TITANIUM.png` (badge only, not logo)

**Never use:** Gold logos, hardcoded gold in logo CSS, or gold gradients for logos.

---

## ✅ VERIFICATION CHECKLIST

**Before deploying any changes:**

### **Signup System:**
- [ ] `supabase.auth.signUp()` implemented (not waitlist only)
- [ ] `determineRoleByDomain()` function created
- [ ] Role passed in signup metadata
- [ ] Supabase client initialized (not placeholders)
- [ ] Error handling for all cases
- [ ] Success/error messages shown
- [ ] Redirect URLs added (all domains)
- [ ] Test signup on each domain
- [ ] Verify profile auto-created
- [ ] Verify role matches domain

### **Badge Governance:**
- [ ] Badge appears only on approved surfaces (profile, dashboard, listings)
- [ ] Badge NOT in headers/navigation
- [ ] Badge NOT in marketing hero sections
- [ ] Badge uses Gold Titanium color (`#FFD700`) only
- [ ] No recoloring or gradients added to badge
- [ ] Official badge identifier used (`VERTIKAL_BADGE_CREATOR_FOUNDING50_GOLD_TITANIUM`)
- [ ] Numbering system implemented (if applicable)

### **Logo Compliance:**
- [ ] Logo uses purple-blue gradient (not gold)
- [ ] Gold ONLY used for badges (never logos)
- [ ] No hardcoded gold logos in CSS

---

## 🎯 SUCCESS CRITERIA

**Signup is "complete" when:**

- ✅ User can sign up on any domain
- ✅ Profile auto-created with correct role
- ✅ Role matches domain
- ✅ No silent failures
- ✅ All errors surfaced to users

**Badge is "compliant" when:**

- ✅ Badge appears only on approved surfaces
- ✅ Badge NOT in prohibited locations
- ✅ Badge uses correct colors and identifier
- ✅ Numbering system implemented (if applicable)

**If ANY criteria fails, the feature is NOT complete.**

---

**Priority:** P0 — Blocks launch  
**Status:** Mandatory compliance required

