# ✅ VERTIKAL — PRE-FLIGHT CHECKLIST

**Release:** v1.0.0-RC1  
**Date:** December 13, 2024  
**Status:** 🔒 Codebase Locked | 🚀 Build Authorized

---

## 0️⃣ PRE-FLIGHT CHECK (MANDATORY — 2 minutes)

Run these **before** committing to ensure no silent failures in RC1:

```bash
# 1. Confirm clean TypeScript
npm run typecheck
# OR
npx tsc --noEmit

# 2. Confirm backend builds
cd backend && npm run build && cd ..

# 3. Confirm Prisma schema is valid
npx prisma validate --schema=prisma/schema.prisma
```

**✅ All must pass with ZERO errors.**

---

## 1️⃣ VERSION CONTROL — LOCKDOWN (AUTHORITATIVE)

Execute exactly once:

```bash
git add .
git commit -m "feat(release): v1.0.0-RC1 - Daunt Effect, DM Roles, & Messaging System"
git push origin main
```

### 🔒 Rules After This Point

- ❌ **No force pushes**
- ❌ **No rebasing main**
- ❌ **Hotfixes only via patch branch** (`hotfix/*`)

---

## 2️⃣ DATABASE — PRODUCTION SYNC (SUPABASE)

**Non-negotiable.** If this fails, **STOP**.

```bash
# From project root
cd backend
npx prisma migrate deploy --schema=../prisma/schema.prisma
npx prisma generate --schema=../prisma/schema.prisma
```

### ✅ Verify Immediately (CRITICAL)

```bash
npx prisma studio --schema=../prisma/schema.prisma
```

**Confirm you see:**

- ✅ `UserRole` enum populated (USER, CREATOR, PRODUCTION, ADMIN, SUPER_ADMIN)
- ✅ `Message` table exists with columns:
  - `id`, `senderId`, `receiverId`, `content`, `isRead`, `createdAt`
- ✅ Foreign keys intact (`senderId` → `User.id`, `receiverId` → `User.id`)

**If ANY of these are missing → DO NOT proceed to build.**

---

## 3️⃣ BUILD — EAS / EXPO (PHYSICAL DEVICES)

```bash
eas build --profile production --platform all
```

### Expected Outputs

- **iOS:** `.ipa` queued for TestFlight
- **Android:** `.aab` ready for Play Console

**If build fails:**

- ❌ **Do NOT modify code**
- ✅ Capture build ID
- ✅ Hotfix only after diagnosis

---

## 4️⃣ LAUNCH_CODE.md — VERIFICATION

**Location:** Project root  
**Status:** ✅ Created and verified  
**Purpose:** Onboarding, recovery, investor confidence

**No edits required** — content is correct.

---

## 5️⃣ POST-BUILD VERIFICATION (MANDATORY)

Once build completes, verify:

### App Runtime Checklist

- [ ] Vertical feed loads without delay
- [ ] Daunt (Danmaku) overlays animate smoothly (60fps)
- [ ] Comments appear above video (z-index verified)
- [ ] Viewer → **cannot** DM (button shows "Leave Comment")
- [ ] Creator → **can** DM Creator/Production (button shows "Message")
- [ ] Role enforcement confirmed server-side (403 for Viewers)

### Backend Checklist

- [ ] `/api/users` returns payload
- [ ] `/api/shows` returns payload
- [ ] `/api/messages/send` rejects VIEWER role (403)
- [ ] `/api/messages/send` accepts CREATOR role (200)
- [ ] `/api/messages/send` accepts PRODUCTION role (200)
- [ ] No Sentry fatal errors on launch
- [ ] Health endpoint responds (`/health`)

---

## 🚨 HOTFIX RULES (DURING TESTING)

If something breaks **during TestFlight / internal testing**:

1. ❌ **Do NOT touch main**
2. ✅ Create hotfix branch:
   ```bash
   git checkout -b hotfix/<issue-name>
   ```
3. ✅ Patch **only the failing surface**
4. ✅ Merge via PR → tag `v1.0.1`

**Rules:**
- ❌ No feature work
- ❌ No refactors
- ✅ **Only critical fixes**

---

## 🟢 FINAL STATUS

- ✅ **Code:** Locked
- ✅ **Schema:** Synced
- ✅ **Build:** Authorized
- ✅ **Risk Level:** Low
- ✅ **Confidence:** High

---

**JIM — Chief Strategy Officer**

> "This is a real release candidate. You're no longer experimenting — you're validating. I'm on standby for hotfix triage only."

---

**Generated:** December 13, 2024  
**Version:** v1.0.0-RC1

