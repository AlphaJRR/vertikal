# 📋 VERTIKAL PUBLIC LANDING — FUNCTIONAL INVENTORY

**File:** `public/index.html`  
**Date:** December 16, 2024  
**Purpose:** Complete inventory of functional layer before format restoration

---

## 🔗 CTA DESTINATIONS

### Header Navigation
- `href="/"` → Home (logo)
- `href="https://creators.vertikalapp.com"` → Creators landing
- `href="https://investors.vertikalapp.com"` → Investors landing
- `onclick="showLogin()"` → Redirects to `https://creators.vertikalapp.com`

### Hero Section CTAs
- `onclick="selectUserType('viewer')"` → Shows viewer signup form
- `onclick="selectUserType('creator')"` → Shows creator signup form

### Form Actions
- `onsubmit="handleViewerSignup(event)"` → Viewer signup handler
- `onsubmit="handleCreatorSignup(event)"` → Creator signup handler
- `onclick="goBack()"` → Returns to user type selection

### Success Screen CTAs
- `onclick="window.location.href='/'"` → Start watching (viewer)
- `onclick="window.location.href='https://creators.vertikalapp.com/dashboard'"` → Enter studio (creator)

### Support Section
- `onclick="donate(25|50|100|250|0)"` → Opens mailto for donations

---

## 📝 FORMS & INPUTS

### Viewer Signup Form (`#viewerForm`)
- **Form ID:** `viewerForm`
- **Submit Handler:** `handleViewerSignup(event)`
- **Submit Button ID:** `viewerSubmitBtn`
- **Fields:**
  - `name="firstName"` (text, required)
  - `name="lastName"` (text, required)
  - `name="email"` (email, required)
  - `name="password"` (password, required, minlength="8")
  - `name="terms"` (checkbox, id="viewerTerms", required)
- **Success Screen:** `#viewerSuccess`

### Creator Signup Form (`#creatorForm`)
- **Form ID:** `creatorForm`
- **Submit Handler:** `handleCreatorSignup(event)`
- **Submit Button ID:** `creatorSubmitBtn`
- **Fields:**
  - `name="firstName"` (text, required, class="creator-form")
  - `name="lastName"` (text, required, class="creator-form")
  - `name="email"` (email, required, class="creator-form")
  - `name="username"` (text, required, class="creator-form")
  - `name="password"` (password, required, minlength="8", class="creator-form")
  - `name="referralCode"` (text, optional, id="creatorRefCode", class="creator-form")
  - `name="terms"` (checkbox, id="creatorTerms", required)
- **Success Screen:** `#creatorSuccess`

---

## 🔐 SUPABASE INTEGRATION

### Client Initialization
- **URL:** `https://vuwawtzhhcarckybdgbd.supabase.co`
- **Anon Key:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ1d2F3dHpoaGNhcmNreWJkZ2JkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU1OTU5NDQsImV4cCI6MjA4MTE3MTk0NH0.FQS6GYae1iw-rbYgo4P5BCuG8dkY_XZpbo0XIcxk62g`
- **Client:** `window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)`

### Auth Functions
- `supabase.auth.signUp()` → Viewer/Creator signup
- `supabase.auth.getSession()` → Check auth on load
- **Redirect URLs:**
  - Viewer: `${window.location.origin}/`
  - Creator: `https://creators.vertikalapp.com/dashboard`

### User Metadata (Viewer)
```javascript
{
  first_name: formData.get('firstName'),
  last_name: formData.get('lastName'),
  full_name: `${firstName} ${lastName}`,
  role: 'viewer',
  user_type: 'viewer'
}
```

### User Metadata (Creator)
```javascript
{
  first_name: formData.get('firstName'),
  last_name: formData.get('lastName'),
  username: username (cleaned),
  full_name: `${firstName} ${lastName}`,
  role: 'creator',
  user_type: 'creator',
  referral_code: generatedCode,
  referred_by: formData.get('referralCode') || null
}
```

---

## 🎯 ELEMENT IDs & SELECTORS

### Critical IDs (Must Preserve)
- `toastContainer` → Toast notification container
- `userTypeSection` → User type selection cards
- `viewerForm` → Viewer signup form container
- `creatorForm` → Creator signup form container
- `viewerSuccess` → Viewer success screen
- `creatorSuccess` → Creator success screen
- `viewerSubmitBtn` → Viewer submit button
- `creatorSubmitBtn` → Creator submit button
- `creatorRefCode` → Referral code input field

### Classes (Must Preserve)
- `.signup-form-container` → Form container base class
- `.signup-form-container.active` → Active form display
- `.user-type-card` → User type card base
- `.user-type-card.creator` → Creator card variant
- `.submit-btn` → Submit button base
- `.submit-btn.creator-btn` → Creator submit button variant
- `.form-input.creator-form` → Creator form input styling

---

## 📊 TRACKING & ANALYTICS

### Current Implementation
- **No explicit analytics found** in current file
- **Potential tracking points:**
  - Form submissions
  - CTA clicks
  - User type selections

---

## 🎨 BUTTON SYSTEM

### Button Classes
- `.btn-header` → Header CTA button (purple-blue gradient)
- `.submit-btn` → Primary submit (purple-blue gradient)
- `.submit-btn.creator-btn` → Creator submit (gold gradient)
- `.support-btn` → Support/donation buttons
- `.back-btn` → Back navigation button

### Button Destinations
- Header "Sign In" → `showLogin()` → `https://creators.vertikalapp.com`
- "CLAIM YOUR SPOT" → Creator signup submission
- "CREATE ACCOUNT" → Viewer signup submission
- "START WATCHING" → `/`
- "ENTER STUDIO" → `https://creators.vertikalapp.com/dashboard`

---

## 🔄 JAVASCRIPT FUNCTIONS

### Core Functions (Must Preserve)
- `selectUserType(type)` → Shows appropriate signup form
- `goBack()` → Returns to user type selection
- `showLogin()` → Redirects to creators landing
- `showToast(message, type)` → Displays toast notification
- `handleViewerSignup(event)` → Processes viewer signup
- `handleCreatorSignup(event)` → Processes creator signup
- `checkAuth()` → Checks authentication on page load
- `donate(amount)` → Opens mailto for donations

### URL Parameter Handling
- `ref` parameter → Auto-fills `#creatorRefCode` if present

---

## ✅ PRESERVATION CHECKLIST

- [x] All CTA hrefs documented
- [x] All form IDs/names documented
- [x] All event handlers documented
- [x] All Supabase calls documented
- [x] All element IDs documented
- [x] All CSS classes documented
- [x] All JavaScript functions documented
- [x] All redirect URLs documented

---

**Status:** ✅ **COMPLETE**  
**Next:** Build old marketing format around this functional layer

