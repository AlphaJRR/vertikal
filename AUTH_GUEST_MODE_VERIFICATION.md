# AUTH + PROFILEGATE + GUEST MODE — VERIFICATION CHECKLIST

## ✅ IMPLEMENTATION COMPLETE

### Files Modified:
1. **hooks/useGuestMode.ts** (NEW) - Guest mode state management
2. **hooks/useRequireAuth.ts** (NEW) - Auth requirement checks
3. **screens/auth/LoginScreen.tsx** - Added "Continue as Guest" button
4. **components/auth/ProfileGate.tsx** - Root app gate logic
5. **hooks/useAuth.ts** - Updated logout to clear Supabase session
6. **screens/JobsScreen.tsx** - Added guest restrictions

### Guest Mode Storage:
- **Location:** `AsyncStorage` key `@vertikal:isGuest`
- **Persistence:** Survives app restarts
- **Storage:** `hooks/useGuestMode.ts` manages read/write

### Session Source:
- **Primary:** Supabase auth listener in `ProfileGate.tsx`
- **Method:** `supabase.auth.onAuthStateChange()` callback
- **Initial:** `supabase.auth.getSession()` on mount
- **Auto-clear guest:** When user logs in, guest mode is disabled

---

## 📋 6-STEP MANUAL TEST CHECKLIST

### STEP 1: App Boot
**Test:** Launch app fresh (clear app data if needed)
**Expected:**
- ✅ Loading screen shows "Loading VERTIKAL..."
- ✅ Then LoginScreen renders (no red screen)
- ✅ Login form visible with email/password fields
- ✅ "Continue as Guest" button visible at bottom

**Status:** ⬜ PASS / ⬜ FAIL
**Notes:**

---

### STEP 2: Continue as Guest
**Test:** Tap "Continue as Guest" button
**Expected:**
- ✅ App navigates to main tabs (Home/Series/Jobs/Shorts/Profile)
- ✅ No login prompt
- ✅ Can browse content
- ✅ Guest mode persists after app restart

**Status:** ⬜ PASS / ⬜ FAIL
**Notes:**

---

### STEP 3: Signup
**Test:** From LoginScreen, create new account
**Expected:**
- ✅ Signup form accessible (if signup screen exists)
- ✅ After signup, session is set
- ✅ ProfileGate checks for profile
- ✅ If no profile → SetupProfileScreen shows
- ✅ After profile creation → Main app shows
- ✅ Guest mode is cleared automatically

**Status:** ⬜ PASS / ⬜ FAIL
**Notes:**

---

### STEP 4: Login
**Test:** Login with existing credentials
**Expected:**
- ✅ Enter email/password
- ✅ Tap LOGIN button
- ✅ Loading indicator shows
- ✅ On success: session set → profile fetched → main app shows
- ✅ On error: error message displays (does NOT auto-set guest)
- ✅ Guest mode cleared on successful login

**Status:** ⬜ PASS / ⬜ FAIL
**Notes:**

---

### STEP 5: Logout
**Test:** Logout from ProfileScreen or settings
**Expected:**
- ✅ Logout clears session
- ✅ Logout clears Supabase auth
- ✅ Logout clears guest mode
- ✅ App returns to LoginScreen
- ✅ Can login again or continue as guest

**Status:** ⬜ PASS / ⬜ FAIL
**Notes:**

---

### STEP 6: Login Again After Restart
**Test:** Close app completely, reopen, login
**Expected:**
- ✅ App boots → LoginScreen shows
- ✅ Login with credentials
- ✅ Session persists (Supabase handles this)
- ✅ Profile loads correctly
- ✅ Main app shows
- ✅ No guest mode active

**Status:** ⬜ PASS / ⬜ FAIL
**Notes:**

---

## 🔒 GUEST RESTRICTIONS VERIFICATION

### Actions That Require Auth:
- ✅ Post job (JobsScreen → Post button)
- ✅ Apply for job (JobsScreen → Job card tap)
- ⬜ Post video (when implemented)
- ⬜ Follow creator (when implemented)
- ⬜ Comment (when implemented)

**Test:** As guest, attempt each action
**Expected:** Alert shows "Create Account / Log In" modal with Cancel/Log In options

**Status:** ⬜ PASS / ⬜ FAIL
**Notes:**

---

## 🐛 KNOWN ISSUES / EDGE CASES

1. **Navigation reset:** `useRequireAuth` uses `window.location.reload()` as fallback. In production, should use React Navigation reset.
2. **ProfileGate session check:** Currently checks Supabase session. If backend API uses different auth, may need adjustment.
3. **Guest mode persistence:** Uses AsyncStorage. If user clears app data, guest mode is lost (expected behavior).

---

## ✅ FINAL STATUS

**Implementation:** ✅ COMPLETE
**Testing:** ⬜ PENDING MANUAL VERIFICATION
**Ready for:** ⬜ PRODUCTION / ⬜ STAGING TESTING

---

**Last Updated:** $(date)
**Commit:** $(git log -1 --oneline)

