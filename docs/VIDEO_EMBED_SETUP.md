# 📹 VIDEO EMBED SETUP

**Author:** JACK — Program Lead  
**Status:** 🟢 READY FOR DEPLOYMENT  
**Date:** December 14, 2024

---

## ✅ YOUTUBE EMBED URLs

1. `Bz_ibyq0ATs` → `https://www.youtube.com/embed/Bz_ibyq0ATs`
2. `_koZVzaT34A` → `https://www.youtube.com/embed/_koZVzaT34A`
3. `lfvnISlXknM` → `https://www.youtube.com/embed/lfvnISlXknM`
4. `UfMG8PPhoWo` → `https://www.youtube.com/embed/UfMG8PPhoWo`
5. `N75nD5Xk3Vw` → `https://www.youtube.com/embed/N75nD5Xk3Vw`

---

## 🔧 NETLIFY ENVIRONMENT VARIABLES

**EVAN Action Required:**

Set these two environment variables in Netlify:

1. **`ABOUT_VIDEO_EMBED_URL`** = `https://www.youtube.com/embed/Bz_ibyq0ATs`
2. **`FOUNDING50_VIDEO_EMBED_URL`** = `https://www.youtube.com/embed/_koZVzaT34A`

**Steps:**
1. Go to Netlify Dashboard → Site Settings → Environment Variables
2. Add the two variables above
3. Trigger a new deploy

**Note:** URLs can be swapped later without code changes.

---

## 📝 IMPLEMENTATION DETAILS

### Video Sections Added

1. **About Video Section** (`#about-video`)
   - Located after Manifesto section
   - Uses `ABOUT_VIDEO_EMBED_URL` env var
   - Responsive 16:9 aspect ratio

2. **Founding 50 Video Section** (`#founding50-video`)
   - Located before Apply section
   - Uses `FOUNDING50_VIDEO_EMBED_URL` env var
   - Responsive 16:9 aspect ratio

### Scroll Fix (P0)

**Changes Made:**
- Added `height: 100%` to `html` and `body`
- Added `position: relative` to `body`
- Added `overflow-x: hidden` to all sections
- Ensured video containers don't break layout
- Fixed iframe max-width constraints

### Environment Variable Handling

**Static HTML Approach:**
Since this is a static HTML file (not Next.js), Netlify will inject env vars at build time. The JavaScript code:
1. Checks for env vars in `window` object (Netlify injects these)
2. Falls back to default URLs if not found
3. Sets iframe `src` attributes on page load

**For Netlify Build:**
Netlify automatically replaces `%ABOUT_VIDEO_EMBED_URL%` and `%FOUNDING50_VIDEO_EMBED_URL%` during build if you use build-time replacement.

**Alternative:** Use Netlify's `_redirects` or build script to inject env vars.

---

## ✅ EXECUTION CHECKLIST

### EVAN (DevOps)
- [ ] Add `ABOUT_VIDEO_EMBED_URL` env var in Netlify
- [ ] Add `FOUNDING50_VIDEO_EMBED_URL` env var in Netlify
- [ ] Trigger new deploy
- [ ] Verify env vars are visible in deploy logs
- [ ] **Proof:** Screenshot of env vars list (values visible, keys safe)

### COCO (COPILOT - Frontend)
- [x] Added About video section
- [x] Added Founding 50 video section
- [x] Fixed scroll issues (P0)
- [x] Added responsive styling
- [x] Added JavaScript env var handling
- [ ] **Proof:** Screen recording showing scroll + both videos play

---

## 🎯 TESTING

### Manual Test Steps
1. Deploy to Netlify with env vars set
2. Navigate to landing page
3. Scroll through entire page
4. Verify About video plays
5. Verify Founding 50 video plays
6. Check mobile responsiveness
7. Verify no horizontal scroll

### Expected Results
- ✅ Smooth vertical scrolling
- ✅ No horizontal scroll
- ✅ Both videos load and play
- ✅ Videos are responsive (16:9 aspect ratio)
- ✅ Videos work on mobile devices

---

## 📋 PHASE 2 ROADMAP (LOGGED)

**AI EDITOR Features (Post-Launch):**
- Wide → vertical repurpose
- Highlight extraction
- Idea engine + packaging

**Status:** Logged for Phase 2, no action needed now.

---

**Generated:** December 14, 2024  
**Version:** v1.0  
**Status:** Ready for EVAN deployment

