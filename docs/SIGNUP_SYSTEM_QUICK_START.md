# 🚀 SIGNUP SYSTEM - QUICK START (TONIGHT)

**Priority:** 🟥 P0 CRITICAL  
**Timeline:** TONIGHT  
**Status:** ⏳ READY TO EXECUTE

---

## ⚡ 5-MINUTE SETUP CHECKLIST

### ✅ STEP 1: Supabase Auth Config (2 min)
- [ ] Site URL: `https://vertikalapp.com`
- [ ] Redirect URLs added (see full list in `SIGNUP_SYSTEM_COMPLETE.md`)
- [ ] Email provider enabled
- [ ] Email confirmation OFF

### ✅ STEP 2: Run SQL Script (1 min)
- [ ] Open Supabase SQL Editor
- [ ] Copy `scripts/signup_system_complete.sql`
- [ ] Paste and Run
- [ ] Verify "Success" message

### ✅ STEP 3: Verify Tables (1 min)
- [ ] Check Table Editor → See 4 tables:
  - `profiles`
  - `creator_applications`
  - `badges`
  - `profile_badges`
- [ ] Check `badges` table → See FOUNDING_50 badge

### ✅ STEP 4: Test Signup (1 min)
- [ ] Use new email
- [ ] Sign up → Should work
- [ ] Create profile → Should work
- [ ] Log out/in → Profile persists

---

## 🔧 IF SIGNUP FAILS

### Error: "Profile creation failed"
**Fix:** Check RLS policies - run verification query:
```sql
SELECT policyname FROM pg_policies WHERE tablename = 'profiles';
```
Should see: `profiles_insert_own`, `profiles_select_own`, `profiles_update_own`

### Error: "Handle already taken"
**Fix:** Try different handle - uniqueness enforced

### Error: "Auth redirect failed"
**Fix:** Check Supabase Auth → URL Configuration → Redirect URLs

---

## 📞 NEED HELP?

**Full Guide:** `docs/SIGNUP_SYSTEM_COMPLETE.md`  
**SQL Script:** `scripts/signup_system_complete.sql`  
**Admin Approval:** See manual SQL in complete guide

---

**Status:** Ready for TONIGHT execution

