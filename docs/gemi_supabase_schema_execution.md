# 🗄️ GEMI — Supabase Schema Execution Guide

**Author:** GEMI — VP Data & Infrastructure  
**Priority:** 🟥 P0  
**Date:** Tuesday, December 16, 2024  
**Status:** ✅ READY TO EXECUTE

---

## 🎯 OBJECTIVE

Execute SQL script to create core database schema for Jan 1 Creator Funnel:
- Profiles table
- Creator applications table
- Badges system
- Videos table
- Seed data (Founding 50 badge)

---

## 📋 EXECUTION STEPS

### Step 1: Access Supabase Dashboard
1. Go to: https://supabase.com/dashboard
2. Log in with your credentials
3. Select project: **Vertikal** (or your project name)

### Step 2: Open SQL Editor
1. Click **SQL Editor** in the left sidebar
2. Click **New query** button (top right)

### Step 3: Load SQL Script
1. Open file: `scripts/gemi_supabase_schema.sql`
2. Copy entire contents
3. Paste into SQL Editor

### Step 4: Execute Script
1. Review SQL for any project-specific adjustments
2. Click **Run** button (or press Cmd/Ctrl + Enter)
3. Wait for execution to complete (usually < 5 seconds)

### Step 5: Verify Tables Created
1. Go to **Table Editor** in left sidebar
2. Verify these tables exist:
   - ✅ `profiles`
   - ✅ `creator_applications`
   - ✅ `badges`
   - ✅ `profile_badges`
   - ✅ `videos`

### Step 6: Verify Badges Seeded
1. Click on `badges` table
2. Verify 3 badges present:
   - ✅ `FOUNDING_50` - Label: "Founding 50"
   - ✅ `FOUNDING_200` - Label: "Founding 200"
   - ✅ `VERIFIED_CREATOR` - Label: "Verified Creator"

---

## ✅ VERIFICATION QUERIES

### Query 1: Verify Tables Exist
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('profiles', 'creator_applications', 'badges', 'profile_badges', 'videos')
ORDER BY table_name;
```

**Expected Result:** 5 rows returned

### Query 2: Verify Badges Seeded
```sql
SELECT code, label 
FROM public.badges 
ORDER BY code;
```

**Expected Result:**
```
code              | label
------------------|------------------
FOUNDING_50       | Founding 50
FOUNDING_200      | Founding 200
VERIFIED_CREATOR  | Verified Creator
```

### Query 3: Verify RLS Enabled
```sql
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('profiles', 'creator_applications', 'badges', 'profile_badges', 'videos');
```

**Expected Result:** All tables show `rowsecurity = true`

### Query 4: Verify Trigger Created
```sql
SELECT trigger_name, event_manipulation, event_object_table
FROM information_schema.triggers
WHERE trigger_schema = 'public'
AND trigger_name = 'profiles_set_updated_at';
```

**Expected Result:** 1 row returned

---

## 📸 PROOF DELIVERABLE

**Required Screenshots:**

1. **Table List Screenshot:**
   - Supabase Dashboard → Table Editor
   - Show all 5 tables visible in the list

2. **Badges Table Screenshot:**
   - Open `badges` table
   - Show all 3 badges with their codes and labels

3. **SQL Execution Result:**
   - SQL Editor showing "Success. No rows returned" or similar success message

---

## 🔍 TROUBLESHOOTING

### Error: "relation already exists"
- **Issue:** Table already exists from previous run
- **Fix:** Script uses `CREATE TABLE IF NOT EXISTS`, so this is safe. If you need to recreate, drop tables first:
  ```sql
  DROP TABLE IF EXISTS public.profile_badges CASCADE;
  DROP TABLE IF EXISTS public.videos CASCADE;
  DROP TABLE IF EXISTS public.creator_applications CASCADE;
  DROP TABLE IF EXISTS public.badges CASCADE;
  DROP TABLE IF EXISTS public.profiles CASCADE;
  ```

### Error: "permission denied"
- **Issue:** Insufficient permissions
- **Fix:** Ensure you're logged in as project owner or have admin access

### Error: "function already exists"
- **Issue:** Trigger function already exists
- **Fix:** Script uses `CREATE OR REPLACE FUNCTION`, so this is safe

### Badges Not Seeded
- **Issue:** INSERT statement didn't run
- **Fix:** Run this query manually:
  ```sql
  INSERT INTO public.badges (code, label)
  VALUES
    ('FOUNDING_50', 'Founding 50'),
    ('FOUNDING_200', 'Founding 200'),
    ('VERIFIED_CREATOR', 'Verified Creator')
  ON CONFLICT (code) DO NOTHING;
  ```

---

## 📊 SCHEMA OVERVIEW

### Tables Created

1. **profiles**
   - Stores user profile information
   - Links to `auth.users` via `id`
   - Fields: handle, display_name, avatar_url, role

2. **creator_applications**
   - Tracks creator application submissions
   - Status: submitted | approved | rejected

3. **badges**
   - Badge definitions (FOUNDING_50, etc.)

4. **profile_badges**
   - Badge assignments to profiles
   - Many-to-many relationship

5. **videos**
   - Video content (ready for Cloudflare Stream)
   - Links to creator profiles

### Security
- ✅ Row Level Security (RLS) enabled on all tables
- ✅ Policies created for public read, own write
- ✅ Admin policies for application approval

### Performance
- ✅ Indexes created on key fields (handle, role, status)
- ✅ Foreign key constraints for data integrity

---

**Generated:** December 15, 2024  
**Status:** Ready for Execution

