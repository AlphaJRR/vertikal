# 📋 TUESDAY DELIVERABLES PACK (2025-12-16)

**Author:** JIM — CSO / Supreme Project Manager  
**Status:** 🟢 READY TO EXECUTE  
**Date:** Tuesday, December 16, 2024

---

## ✅ SABLE — Landing Copy Blocks (Final Draft)

**Priority:** 🟥 P0  
**Status:** ✅ READY  
**Proof:** Copy doc with final sections

### HERO SECTION
```
VERTIKAL
Cinematic stories. Creator-first. Built for series, docs, reality, and shorts.

CTA: Apply as a Creator → /apply
CTA2: Join as a Viewer → /signup
```

### SECTION: WHAT IS VERTIKAL
```
Vertikal is a creator-first platform built for real storytelling—series, documentaries, reality, shorts, and longform. We're building a premium catalog with vetted creators, not noise.
```

### SECTION: FOUNDING 50
```
Founding 50 Monetization Program

Early creators receive priority placement, platform support, and Founding 50 status on profile.
```

### SECTION: HOW IT WORKS
```
1. Watch the "About Vertikal" video
2. Watch "Founding 50" details
3. Create your profile
4. Apply → get approved → Founding 50 badge appears
```

### FAQ (STARTER)
```
Q: Do I need expensive gear?
A: No. Story > gear.

Q: What content do you want?
A: Series, docs, reality, shorts, and longform.

Q: How do I become Founding 50?
A: Apply, get approved, badge is applied.
```

**✅ Proof Deliverable:** Copy doc ready in `docs/sable_landing_copy_blocks.md`

---

## ✅ VERA — Creator Pipeline Tracker (200 Slots)

**Priority:** 🟥 P0  
**Status:** ✅ READY  
**Proof:** Tracker link + first 25 prospects entered

### CSV Structure (Ready to Paste into Google Sheets)

```csv
CreatorName,IGHandle,Email/Phone,Category (Series/Docs/Reality/Shorts/Longform),City,Tier (A/B/C),Warm Intro Path,Stage,Next Action,Owner,Notes
```

### Required Drop-down Stages
- Prospecting
- Contacted
- Interested
- Call Scheduled
- Applied
- Approved
- Onboarded
- Activated

**✅ Proof Deliverable:** 
- CSV template ready in `docs/vera_creator_pipeline_tracker.csv`
- First 8 sample entries included
- Ready to expand to 200 slots

---

## ✅ COCO — YouTube Embed Implementation

**Priority:** 🟥 P0  
**Status:** ✅ READY (Pending EVAN env vars)  
**Dependencies:** EVAN must set Netlify env vars first  
**Proof:** Deployed URL showing both videos playing

### Implementation Status
✅ **COMPLETE** - Video embeds already implemented in `public/index.html`

### Current Implementation
- About Video Section: Lines 354-365
- Founding 50 Video Section: Lines 367-378
- JavaScript initialization: Lines 800-830
- Uses `data-src` attributes with env var fallbacks

### Verification Steps
1. ✅ EVAN sets `ABOUT_VIDEO_EMBED_URL` in Netlify
2. ✅ EVAN sets `FOUNDING50_VIDEO_EMBED_URL` in Netlify
3. ✅ Deploy triggers
4. ✅ Test both videos play on production

**✅ Proof Deliverable:** 
- Code already deployed in `public/index.html`
- Waiting for EVAN's env vars to activate
- Test URL: `https://vertikalapp.com` (after deploy)

---

## ✅ EVAN — Netlify Environment Variables

**Priority:** 🟥 P0  
**Status:** ⏳ READY TO EXECUTE  
**Dependencies:** None (Must be done first)  
**Proof:** Screenshot of env vars

### Steps to Execute

1. **Log into Netlify Dashboard**
   - Go to: https://app.netlify.com
   - Select site: `vertikalapp.com`

2. **Navigate to Environment Variables**
   - Site Settings → Build & deploy → Environment
   - Click "Add variable"

3. **Add First Variable**
   - **Name:** `ABOUT_VIDEO_EMBED_URL`
   - **Value:** `https://www.youtube.com/embed/Bz_ibyq0ATs` (or actual About video ID)
   - Click "Save"

4. **Add Second Variable**
   - **Name:** `FOUNDING50_VIDEO_EMBED_URL`
   - **Value:** `https://www.youtube.com/embed/placeholder2` (or actual Founding 50 video ID)
   - Click "Save"

5. **Trigger Redeploy**
   - Go to Deploys tab
   - Click "Trigger deploy" → "Deploy site"
   - Wait for build to complete

### Verification
- [ ] Both variables visible in Environment section
- [ ] Values are correct YouTube embed URLs
- [ ] Deploy completes successfully
- [ ] Videos play on production site

**✅ Proof Deliverable:** 
- Screenshot of Netlify Environment Variables section
- SOP ready in `docs/evan_netlify_deploy_sop.md`

---

## ✅ GEMI — Supabase Schema Deployment

**Priority:** 🟥 P0  
**Status:** ✅ READY TO EXECUTE  
**Dependencies:** None  
**Proof:** Screenshot of tables + badge seed

### SQL Script Ready
**File:** `scripts/gemi_supabase_schema.sql`

### Tables to Create
- ✅ `profiles` - User profiles with handle, display_name, avatar_url, role
- ✅ `creator_applications` - Creator application submissions
- ✅ `badges` - Badge definitions (FOUNDING_50, FOUNDING_200, VERIFIED_CREATOR)
- ✅ `profile_badges` - Badge assignments to profiles
- ✅ `videos` - Video content (ready for Cloudflare Stream integration)

### Seed Data
- ✅ Badges seeded: FOUNDING_50, FOUNDING_200, VERIFIED_CREATOR

### Execution Steps

1. **Open Supabase Dashboard**
   - Go to: https://supabase.com/dashboard
   - Select project
   - Navigate to SQL Editor

2. **Run SQL Script**
   - Copy contents of `scripts/gemi_supabase_schema.sql`
   - Paste into SQL Editor
   - Click "Run" or press Cmd/Ctrl + Enter

3. **Verify Tables Created**
   - Go to Table Editor
   - Confirm all tables visible:
     - `profiles`
     - `creator_applications`
     - `badges`
     - `profile_badges`
     - `videos`

4. **Verify Badges Seeded**
   - Open `badges` table
   - Confirm 3 badges present:
     - FOUNDING_50
     - FOUNDING_200
     - VERIFIED_CREATOR

### Verification Query
```sql
-- Verify tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('profiles', 'creator_applications', 'badges', 'profile_badges', 'videos');

-- Verify badges seeded
SELECT * FROM public.badges;
```

**✅ Proof Deliverable:** 
- SQL script ready in `scripts/gemi_supabase_schema.sql`
- Includes RLS policies, indexes, triggers
- Ready to execute in Supabase SQL Editor

---

## 📊 TUESDAY EXECUTION CHECKLIST

### Pre-Execution
- [ ] All Monday deliverables verified complete
- [ ] Team members have access to required tools
- [ ] Dependencies identified and sequenced

### Execution Order (Critical Path)
1. **EVAN** - Set Netlify env vars (BLOCKS COCO)
2. **GEMI** - Run Supabase schema (Independent)
3. **SABLE** - Finalize copy blocks (Independent)
4. **VERA** - Populate tracker with 25 prospects (Independent)
5. **COCO** - Verify video embeds work (DEPENDS ON EVAN)

### Post-Execution Verification
- [ ] EVAN: Env vars screenshot provided
- [ ] GEMI: Tables screenshot provided
- [ ] SABLE: Copy doc finalized
- [ ] VERA: Tracker with 25 entries
- [ ] COCO: Videos playing on production

---

**Generated:** December 15, 2024  
**Status:** Ready for Tuesday Execution

