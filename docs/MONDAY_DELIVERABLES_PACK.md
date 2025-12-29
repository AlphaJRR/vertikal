# 📋 MONDAY DELIVERABLES PACK (2025-12-15)

**Author:** JACK — Program Lead / Exec Ops  
**Status:** 🟢 READY TO PASTE/APPLY  
**Authority:** JR (CEO)  
**Milestone:** Jan 1 Creator-Ready Funnel

---

## ✅ JACK — Master Execution Board

**Notion Database Structure:** `VERTIKAL — EXECUTION BOARD (90/180/365)`

### Database 1: Tasks
- Task (Title)
- Owner (Person/Select)
- Division (Select: Exec/Integrity/Tech/Data/Growth/Marketing/Ops/Product/Design)
- Priority (Select: 🟥 P0 / 🟧 P1 / 🟩 P2)
- Status (Select: Not Started / In Progress / Blocked / Shipped)
- Start Date (Date)
- Due Date (Date)
- Proof Link (URL)
- Dependencies (Text)
- Milestone (Select: Jan 1 / Jan 31 / Feb / Phase 2)

### Database 2: Gates
- Gate Item (Title)
- Milestone (Select)
- Owner
- Pass? (Checkbox)
- Proof
- Notes

### Database 3: Decisions
- Decision (Title)
- Date
- Owner
- Why
- Impact
- Link

### Views
- **Today (Mon):** filter Start Date = 2025-12-15
- **P0 This Week:** Priority = 🟥
- **Blocked:** Status = Blocked
- **Shipped:** Status = Shipped (sorted by date desc)

---

## ✅ JIM — Compliance Dashboard Template

**Notion Database:** `Compliance Scoreboard`

### Properties
- Agent (Title)
- Division (Select)
- This Week Objective (Text)
- Last Deliverable (Text)
- Proof Link (URL)
- Checklist Attached? (Checkbox)
- Scope Creep? (Select: No / Risk / Yes)
- Security OK? (Select: Pass / Needs Fix)
- Quality OK? (Select: Pass / Needs Fix)
- Compliance Status (Select: ✅ Pass / ⚠️ Warn / 🛑 Block)
- Next Due (Date)
- Notes (Text)

### Compliance Rules
- Missing checklist = **🛑 Block**
- Any redesign/scope change without JR approval = **🛑 Block**
- Must include proof links = **⚠️ Warn → Block**

---

## ✅ COCO — Landing Scroll Fix Patch

```css
html, body {
  height: auto !important;
  min-height: 100%;
  overflow-y: auto !important;
  overflow-x: hidden !important;
}

body {
  position: relative;
  touch-action: pan-y;
}

#root, .app, .page, main {
  height: auto !important;
  min-height: 100vh;
  overflow: visible !important;
}

/* kill common offenders */
.fullscreen, .slide, .screen {
  height: auto !important;
  min-height: 100vh;
  overflow: visible !important;
}
```

**Remove/Override:**
- `body { overflow: hidden; }`
- `.container { height: 100vh; overflow: hidden; }`

---

## ✅ EVAN — Netlify Deploy + Rollback SOP

### Deploy
1. Netlify → Site → **Deploys**
2. Confirm latest deploy has expected commit + build logs clean
3. Test: home scroll + video embeds + CTA buttons

### Rollback (Instant)
1. Netlify → **Deploys**
2. Find last "known good" deploy
3. Click **"Publish deploy"** (reverts instantly)
4. Retest scroll + videos

### Emergency Freeze
- Turn off auto-publish: **Site settings → Build & deploy → Stop auto publishing**

---

## ✅ GEMI — Supabase Schema

```sql
-- PROFILES
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  handle text unique not null,
  display_name text,
  avatar_url text,
  role text not null default 'user', -- user | creator
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- CREATOR APPLICATIONS
create table if not exists public.creator_applications (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  status text not null default 'submitted', -- submitted | approved | rejected
  notes text,
  created_at timestamptz not null default now()
);

-- BADGES
create table if not exists public.badges (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  label text not null
);

create table if not exists public.profile_badges (
  profile_id uuid not null references public.profiles(id) on delete cascade,
  badge_id uuid not null references public.badges(id) on delete cascade,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  primary key (profile_id, badge_id)
);

-- VIDEOS (stores Cloudflare Stream IDs later)
create table if not exists public.videos (
  id uuid primary key default gen_random_uuid(),
  creator_profile_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  description text,
  stream_video_id text,
  thumbnail_url text,
  visibility text not null default 'public',
  created_at timestamptz not null default now()
);

-- SEED BADGES
insert into public.badges (code, label)
values
  ('FOUNDING_50', 'Founding 50'),
  ('FOUNDING_200', 'Founding 200'),
  ('VERIFIED_CREATOR', 'Verified Creator')
on conflict (code) do nothing;

-- UPDATED_AT
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();
```

---

## ✅ CLAUDE — Jan 1 Creator Funnel Spec

### User Flow (Jan 1)
1. Visit landing → watch **About**
2. Watch **Founding 50 Monetization**
3. Click **Apply / Sign Up**
4. Create account → set:
   - `handle` (unique)
   - `display_name`
   - `avatar_url`
   - `role` ("creator" if applying; else "user")
5. Submit creator application → status `submitted`
6. Admin approves → status `approved` + badge `FOUNDING_50` applied
7. Profile renders badge **under name**

### Badge Rule
- If a user has an active badge in `profile_badges` joined to `badges` where `code=FOUNDING_50`, display label.

### Admin Requirements
- Admin list view: applications (submitted/approved/rejected)
- Approve button:
  - set application status
  - insert/update badge assignment

---

## ✅ APOLLO — 90-Day Creator Blitz KPI Skeleton

### Weekly Targets (starting Jan 1)
- 50 creators onboarded by end of Jan
- 200 creators in pipeline by end of Feb
- KPI tracking: **views → clicks → applies → approved → activated**

### Cadence
- 4 short videos/week
- 2 carousels/week
- 1 live/week
- daily stories
- 10–20 targeted DMs/day (VERA)

---

## ✅ VERA — Creator Pipeline Tracker (CSV)

```csv
CreatorName,IGHandle,Email/Phone,Category (Series/Docs/Reality/Shorts/Longform),City,Tier (A/B/C),Warm Intro Path,Stage,Next Action,Owner,Notes
```

**Stages (drop-down):**
- Prospecting
- Contacted
- Interested
- Call Scheduled
- Applied
- Approved
- Onboarded
- Activated

---

## ✅ SABLE — Landing Copy Blocks

### HERO
**VERTIKAL**
*Cinematic stories. Creator-first. Built for series, docs, reality, and shorts.*

**CTA:** Apply as a Creator → /apply
**CTA2:** Join as a Viewer → /signup

### SECTION: WHAT IS VERTIKAL
Vertikal is a creator-first platform built for **real storytelling**—series, documentaries, reality, shorts, and longform. We're building a premium catalog with real creators, not noise.

### SECTION: FOUNDING 50
**Founding 50 Monetization Program**
Early creators receive priority placement, platform support, and Founding 50 status on profile.

### SECTION: HOW IT WORKS
1. Watch the "About Vertikal" video
2. Watch "Founding 50" details
3. Create your profile
4. Apply → get approved → Founding 50 badge appears

### FAQ (starter)
- **Do I need expensive gear?** No. Story > gear.
- **What content do you want?** Series, docs, reality, shorts, and longform.
- **How do I become Founding 50?** Apply, get approved, badge is applied.

---

## ✅ MERCURY — Community Hub Plan

**Platform:** Discord (Phase 1)

**Channels:**
- #welcome
- #announcements
- #creator-intros
- #founding-50
- #series-docs-reality
- #shorts-lab
- #feedback-bugs
- #wins-and-drops

**Rules:**
- Be constructive
- No spam links
- Post work + ask for notes

**Welcome Flow:**
- auto message → "Introduce yourself + category + what you're building"

---

## ✅ NOVA — Paid Test Plan (post-Jan 1, optional)

- Retarget landing visitors (7-day window)
- Objective: creator applications
- Creatives needed: 3 hooks (JR on camera) + 2 carousels (Founding 50 benefits)

---

## ✅ LEDGER — VC Tracker Fields + Email Templates

### VC Tracker Columns
Firm, Partner, Focus, Check Size, Stage Fit, Why Fit, Warm Intro Path, Status, Next Step, Notes

### Warm Intro Ask
**Subject:** Quick intro to a creator-first premium video platform

**Body:**
JR — quick one. I'm building Vertikal: a creator-first premium platform for series/docs/reality/shorts. We're onboarding our Founding 50 and launching creator signup Jan 1. Can you intro me to [Partner]? I'll send a 1-pager.

### Cold Outreach
**Subject:** Vertikal — premium creator-first platform (Founding 50)

**Body:**
Hi [Name], I'm JR, founder of Vertikal. We're building a premium catalog driven by vetted creators (series/docs/reality/shorts) with a creator-first model. Creator onboarding goes live Jan 1. If aligned, I'd love to share the 1-pager + early traction plan.

---

## ✅ PULSE — Jan 1 Launch Runbook v1

### Go/No-Go Gates (must pass)
- Landing scroll works on mobile/desktop ✅
- About video plays ✅
- Founding 50 video plays ✅
- Signup/profile works ✅
- Badge renders under name ✅
- Admin can approve ✅
- Rollback confirmed ✅
- QA pass report ✅

### Launch Day Steps
- 9am: final QA
- 11am: deploy/publish
- 1pm: first creator outreach wave begins

---

## ✅ CROWN — Founding 50 Onboarding Checklist

- Profile setup (handle, pic, bio)
- Content type selection (Series/Docs/Reality/Shorts/Longform)
- "First 7 days" posting plan
- Community invite + intro post
- Success definition: first post / first drop / first audience feedback

---

## ✅ SWITCH — QA Plan (mobile-first)

**Test Cases:**
- iPhone Safari: scroll, embeds, CTAs
- Android Chrome: scroll, embeds, CTAs
- Signup errors: duplicate handle, missing pic, weak network
- Badge visibility: approved vs not approved
- Admin approval works end-to-end

---

## ✅ ATLAS — KPI + Event Tracking Starter

**KPIs:**
- Landing views
- Video plays (About / Founding 50)
- Signup starts
- Signup completes
- Creator applications submitted
- Approved creators
- Activated creators (profile complete + first action)

---

## ✅ SAGE — MVP User Stories (Jan 1)

- As a visitor, I can watch About + Founding 50 videos
- As a user, I can sign up and create a profile
- As a creator, I can apply for creator status
- As an admin, I can approve applications and assign Founding 50 badge
- As a user, I can see Founding 50 badge under creator's name

**DoD:**
- works on mobile
- errors handled
- proof screenshots + test results

---

## ✅ PIXEL — Badge Visual Spec

- Text: **Founding 50**
- Placement: directly under display name
- Size: ~70–80% of name size
- Style: slightly muted opacity (premium), not cartoonish
- Optional icon: small dot/star (later)

---

## ✅ FORGE / BEACON — Monday Deliverables

- **FORGE:** mobile test matrix owner (ties into Switch QA)
- **BEACON:** creator tools v0 spec owner (ties into Cursor admin)

---

**Generated:** December 15, 2024  
**Status:** Ready for Implementation

