# 🔐 COMPLETE SIGNUP SYSTEM - END-TO-END

**Author:** JACK — Program Lead / Ship-Now Mode  
**Priority:** 🟥 P0 CRITICAL  
**Status:** ⏳ READY TO EXECUTE  
**Timeline:** TONIGHT

---

## 🎯 DEFINITION OF "SIGNUP WORKS"

A real person can:

1. ✅ Create account
2. ✅ Log in
3. ✅ Land in the app
4. ✅ Create a profile (handle + display name + avatar optional)
5. ✅ If they want to be a creator: submit creator application
6. ✅ Admin can approve → "creator" role + badge appears

**If any one of these fails, signup is broken.**

---

## 📋 STEP-BY-STEP EXECUTION

### STEP 1: SUPABASE AUTH CONFIGURATION (10 minutes)

#### 1.1 URL Configuration
**Go to:** Supabase Dashboard → Auth → URL Configuration

**Set Site URL:**
```
https://vertikalapp.com
```

**Add to Additional Redirect URLs** (paste all):
```
https://vertikalapp.com/*
https://www.vertikalapp.com/*
https://demo.vertikalapp.com/*
http://localhost:3000/*
http://localhost:19006/*
exp://localhost:19000/*
exp://127.0.0.1:19000/*
```

#### 1.2 Enable Email Provider
**Go to:** Auth → Providers

**Turn on:**
- ✅ **Email** provider
- ✅ **Email + Password** (recommended for tonight - fastest)
- OR Magic link (if you prefer, but requires redirect handling)

#### 1.3 Email Settings
**Go to:** Auth → Settings

**For TONIGHT (fastest reliable):**
- ✅ **Email + Password** (no confirmation)
- ❌ Turn OFF email confirmation (or handle "check your email" UI)

**Why:** If email confirmation is ON and you're not handling it in UI, users will think signup "failed."

---

### STEP 2: RUN DATABASE SQL (5 minutes)

**File:** `scripts/signup_system_complete.sql`

**Steps:**
1. Open Supabase Dashboard → SQL Editor
2. Click "New query"
3. Copy entire contents of `scripts/signup_system_complete.sql`
4. Paste into SQL Editor
5. Click "Run" (or Cmd/Ctrl + Enter)
6. Wait for "Success" message

**What it creates:**
- ✅ `profiles` table
- ✅ `creator_applications` table
- ✅ `badges` table
- ✅ `profile_badges` table
- ✅ Seed data (FOUNDING_50 badge)
- ✅ RLS policies (critical!)
- ✅ Indexes
- ✅ Triggers

---

### STEP 3: VERIFY RLS POLICIES (2 minutes)

**Critical:** RLS is where signup usually dies. If RLS blocks inserts, users can auth but can't create profiles → app feels broken.

**Verify:**
1. Go to Supabase Dashboard → Table Editor
2. Click on `profiles` table
3. Check "RLS enabled" badge is visible
4. Go to SQL Editor and run:

```sql
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename IN ('profiles', 'creator_applications', 'badges', 'profile_badges');
```

**Expected:** Should see policies for:
- `profiles_select_own`
- `profiles_insert_own`
- `profiles_update_own`
- `profiles_select_public`
- `apps_insert_own`
- `apps_select_own`
- `badges_read_all`
- `badges_read_public`
- `profile_badges_read_all`
- `profile_badges_read_public`

---

### STEP 4: FRONTEND FLOW - AUTO-CREATE PROFILE

**Critical:** User signs up but you never create `profiles` row → broken.

**Required Flow:**

1. **On successful sign-in:**
   - Get `user.id` from auth
   - Check if profile exists: `SELECT * FROM profiles WHERE id = user.id`
   - If none → show "Create Profile" screen
   - On submit → `INSERT INTO profiles {id, handle, display_name, avatar_url, role:'user'}`

2. **Handle uniqueness:**
   - If insert fails (handle taken), show error
   - Suggest alternative handles
   - Retry with new handle

**Pseudo-code:**
```javascript
// After auth success
const { data: profile } = await supabase
  .from('profiles')
  .select('*')
  .eq('id', user.id)
  .single();

if (!profile) {
  // Show profile creation screen
  navigate('/setup-profile');
} else {
  // Continue to app
  navigate('/home');
}
```

---

### STEP 5: CREATOR APPLICATION SYSTEM

**Creator Path:**

1. User creates profile (role: 'user')
2. Click "Apply as Creator" button
3. Insert into `creator_applications`:
   ```sql
   INSERT INTO creator_applications (profile_id, status)
   VALUES (user.id, 'submitted');
   ```

**Admin Approval (Manual Tonight):**

Use Supabase Dashboard → Table Editor:

1. Find application in `creator_applications` table
2. Note the `profile_id` (UUID)
3. Run this SQL (replace `USER_UUID`):

```sql
-- Approve application
UPDATE public.creator_applications
SET status='approved'
WHERE profile_id='USER_UUID';

-- Set role to creator
UPDATE public.profiles
SET role='creator'
WHERE id='USER_UUID';

-- Assign FOUNDING_50 badge
INSERT INTO public.profile_badges (profile_id, badge_id, active)
SELECT 'USER_UUID', b.id, true
FROM public.badges b
WHERE b.code='FOUNDING_50'
ON CONFLICT (profile_id, badge_id) DO UPDATE SET active=true;
```

---

### STEP 6: VERIFY IT'S REAL (5-minute test)

**Test with brand new email:**

1. ✅ **Sign up** with new email
2. ✅ **Sign in** with credentials
3. ✅ **Create profile** (handle + display name)
4. ✅ **Log out/in again** (profile persists)
5. ✅ **Apply as creator** (row appears in `creator_applications`)
6. ✅ **Admin approves** (run SQL above)
7. ✅ **Check profile** (role = 'creator', badge visible)

**If any step fails, check:**

- ❌ **Auth redirect URLs** - Check Supabase Auth settings
- ❌ **RLS policies** - Check policies are correct
- ❌ **Profile auto-create** - Check frontend flow
- ❌ **Handle uniqueness** - Check error handling

---

## 🔍 TROUBLESHOOTING

### Signup Works But Profile Creation Fails

**Symptom:** User can sign up but can't create profile

**Fix:**
1. Check RLS policies: `profiles_insert_own` must exist
2. Verify user is authenticated: `auth.uid() = id`
3. Check handle uniqueness: Try different handle

### Profile Created But Can't Update

**Symptom:** Profile exists but updates fail

**Fix:**
1. Check RLS policy: `profiles_update_own` must exist
2. Verify `auth.uid() = id` in policy
3. Check if user is logged in

### Creator Application Fails

**Symptom:** Can't submit creator application

**Fix:**
1. Check RLS policy: `apps_insert_own` must exist
2. Verify `profile_id` matches `auth.uid()`
3. Check if profile exists first

### Badges Don't Show

**Symptom:** Badge assigned but not visible

**Fix:**
1. Check `profile_badges` table has row
2. Verify `active = true`
3. Check badge exists in `badges` table
4. Verify RLS allows public read

---

## ✅ VERIFICATION CHECKLIST

### Supabase Auth
- [ ] Site URL set to `https://vertikalapp.com`
- [ ] All redirect URLs added
- [ ] Email provider enabled
- [ ] Email confirmation OFF (or handled in UI)

### Database
- [ ] All tables created (`profiles`, `creator_applications`, `badges`, `profile_badges`)
- [ ] Badges seeded (FOUNDING_50 exists)
- [ ] RLS enabled on all tables
- [ ] Policies created and active

### Frontend
- [ ] Signup form works
- [ ] Login form works
- [ ] Profile creation screen exists
- [ ] Profile auto-creates after signup
- [ ] Creator application form works
- [ ] Handle uniqueness handled

### End-to-End Test
- [ ] New user can sign up
- [ ] New user can log in
- [ ] Profile created successfully
- [ ] Profile persists after logout/login
- [ ] Creator application submits
- [ ] Admin can approve (manual SQL works)
- [ ] Badge appears on profile

---

**Generated:** December 15, 2024  
**Status:** Ready for TONIGHT Execution

