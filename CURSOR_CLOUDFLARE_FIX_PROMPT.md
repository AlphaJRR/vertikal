# CURSOR — CLOUDFLARE PAGES DEPLOYMENT FIX (AGENT MODE)

**ROLE:** Senior Frontend Engineer + DevOps  
**MISSION:** Fix vertikalapp.com Cloudflare Pages deployment so it serves the OLD PDF format layout (with preserved functionality), not the new signup-card layout currently live.

---

## 🔴 CRITICAL PROBLEM

**Current State:**
- ✅ investors.vertikalapp.com → Working correctly (tier cards)
- ✅ networks.vertikalapp.com → Working correctly (network form)
- ❌ vertikalapp.com → Showing NEW signup-card layout (wrong)

**Root Cause:**
The Cloudflare Pages project for vertikalapp.com is either:
1. Pulling from wrong Git branch/folder, OR
2. Has wrong "Root directory" / "Build output directory" settings

---

## ✅ REQUIRED FIXES

### 1. **Verify Cloudflare Pages Project Settings**

**For vertikalapp.com Pages project:**

Go to: Cloudflare Dashboard → Workers & Pages → vertikalapp (the one with vertikalapp.pages.dev)

**Settings → Builds & deployments:**

- **Root directory:** `public` (if your restored layout is in `public/index.html`)
- **Build command:** (leave blank / empty)
- **Build output directory:** `.` or `public` (depending on structure)

**If connected to Git:**
- Verify it's pulling from `main` branch
- Verify the `public/index.html` in Git contains the OLD format (HERO → ECOSYSTEM → VIBE ENGINE → ORIGINALS → CTA → FOOTER)

**If using Direct Upload:**
- Upload the folder where `index.html` is at the root (the restored old-format version)

---

### 2. **Fix Logo Violation (Badge-as-Logo)**

**Current Issue:** The uploaded `index.html` uses `assets/creator-badge.png` as header logo (brand violation).

**Required Fix:**
- Replace header logo with `assets/Vertikal_Logo_Master.png`
- Remove badge container from hero section (if present)
- Ensure favicon uses core logo (if controlled in HTML)

**File to edit:** `public/index.html`

**Find and replace:**
```html
<!-- OLD (WRONG): -->
<img src="assets/creator-badge.png" alt="VERTIKAL Founding 50">

<!-- NEW (CORRECT): -->
<img src="assets/Vertikal_Logo_Master.png" alt="VERTIKAL">
```

---

### 3. **Preserve All Functionality**

**DO NOT break:**
- Supabase auth integration (`supabase.auth.signUp()`)
- Form IDs (`#viewerForm`, `#creatorForm`)
- Zapier webhook logging (`logSignupToZapier()`)
- CTA destinations (creators/investors/networks/demo)
- Terms/Privacy links (`/terms`, `/privacy`)

**Only change:**
- Logo image source
- Layout structure (if restoring old format)

---

### 4. **Verify Terms/Privacy Routing**

**Current:** Links point to `/terms` and `/privacy`

**Ensure:**
- Files exist as `terms.html` and `privacy.html` at root, OR
- Folders exist as `/terms/index.html` and `/privacy/index.html`

**Cloudflare Pages routing:**
- If using folders: `/terms/index.html` and `/privacy/index.html` work automatically
- If using `.html` files: ensure `_redirects` file includes:
  ```
  /terms   /terms.html   200
  /privacy /privacy.html 200
  ```

---

## 📋 EXECUTION CHECKLIST

- [ ] Open Cloudflare Dashboard → vertikalapp Pages project
- [ ] Check Settings → Builds & deployments → Root directory
- [ ] Verify Git branch is `main` (if Git-connected)
- [ ] Verify `public/index.html` contains OLD format sections (HERO, ECOSYSTEM, VIBE ENGINE, etc.)
- [ ] Fix logo: Replace `creator-badge.png` with `Vertikal_Logo_Master.png` in header
- [ ] Remove badge container from hero (if present)
- [ ] Commit changes (if Git) OR upload corrected folder (if Direct Upload)
- [ ] Trigger redeploy
- [ ] Verify live: https://vertikalapp.com shows OLD format
- [ ] Verify logo: Header shows core Vertikal logo (not badge)
- [ ] Verify functionality: Signup forms still work
- [ ] Verify links: Terms/Privacy work, CTAs route correctly

---

## 🎯 SUCCESS CRITERIA

**After fix, vertikalapp.com must show:**

- ✅ OLD PDF format layout (HERO → ECOSYSTEM → VIBE ENGINE → ORIGINALS → CTA → FOOTER)
- ✅ Core Vertikal logo in header (purple-blue gradient, NOT badge)
- ✅ "CLAIM ACCESS" button scrolls to `#join` section
- ✅ Viewer/Creator signup forms work (Supabase auth)
- ✅ Zapier logging still fires on signup
- ✅ Terms/Privacy links work (`/terms`, `/privacy`)
- ✅ All CTAs route correctly (creators/investors/networks/demo)

---

## 🚨 IF STILL BROKEN AFTER FIX

**Debug steps:**

1. **Check what's actually deployed:**
   - Cloudflare → Deployments → Latest deployment → View files
   - Confirm `index.html` at root contains OLD format

2. **Check DNS:**
   - Cloudflare DNS → Records
   - Ensure `vertikalapp.com` CNAME points to Pages project (not Workers)

3. **Check custom domains:**
   - Pages project → Custom domains
   - Ensure `vertikalapp.com` is attached to correct project (not `vertikal`)

4. **Clear cache:**
   - Cloudflare → Caching → Purge Everything
   - Hard refresh browser (Cmd+Shift+R)

---

## 📝 OUTPUT REQUIRED

After executing, provide:

1. **What you changed:**
   - Root directory setting (before → after)
   - Logo fix (file + line numbers)
   - Any other changes

2. **Deployment confirmation:**
   - Deploy ID
   - Deploy URL (vertikalapp.pages.dev)
   - Production URL (vertikalapp.com)

3. **Verification results:**
   - Live site shows OLD format: YES/NO
   - Logo is core Vertikal: YES/NO
   - Signup forms work: YES/NO
   - Terms/Privacy work: YES/NO

---

**EXECUTE NOW. FIX THE ROOT DIRECTORY + LOGO, THEN REDEPLOY.**

