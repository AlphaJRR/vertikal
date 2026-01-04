# Cloudflare Iframe Integration - Complete Guide

## ✅ APP INTEGRATION (React) - COMPLETE

The React app (`src/components/features/VideoHero.tsx`) is now configured to:
- ✅ Use Cloudflare iframe when `FEATURED_VIDEO.cloudflare.readyToStream === true`
- ✅ Fallback to standard video player until ready
- ✅ VIBE comments with preset for "ARGUEably the Best Burgers"
- ✅ VIBE™ LIVE badge visible
- ✅ Featured video appears first in feed

**Status Check Command:**
```bash
# Check Cloudflare video status (when ready, set readyToStream: true in demoSeed.ts)
# Or check via API: https://api.cloudflare.com/client/v4/accounts/{account-id}/stream/{video-id}
```

---

## 🌐 WEBSITE INTEGRATION (Static HTML)

### File Location Question:
**Where is your website hero video currently?**

The React app hero is in: `src/components/features/VideoHero.tsx`

For a **separate website** (static HTML), use this:

### Option 1: If you have `public/index.html` or similar:

**Replace the hero video section with:**

```html
<!-- FEATURED HERO: ARGUEably the Best Burgers (Joshua Argue) -->
<section class="hero-video-wrap">
  <div
    class="hero-video"
    data-vibe="true"
    data-vibe-thread="vibe_argueably_best_burgers_v1"
  >
    <iframe
      src="https://customer-fyh68ijrcuys7ag8.cloudflarestream.com/9d3d0efed36b71e5f75c7b5e218809d7/iframe"
      style="border:0;width:100%;aspect-ratio:9/16;border-radius:18px;overflow:hidden;"
      allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
      allowfullscreen
    ></iframe>
  </div>
</section>

<!-- Load VIBE danmaku script -->
<script src="/vibe-danmu.js"></script>
```

### Option 2: Reference File Created

I've created:
- `public/hero-video-iframe.html` - Complete example
- `public/vibe-danmu.js` - VIBE comments script

**Copy the iframe section from `public/hero-video-iframe.html`**

---

## 📝 VIBE PRESET COMMENTS

The preset comments are configured in:
- **App**: `src/components/features/DanmakuOverlay.tsx`
- **Website**: `public/vibe-danmu.js`

**Preset ID**: `vibe_argueably_best_burgers_v1`

**Comments** (timed to video):
- 2.5s: "AVA_Member: This intro is CRAZY 🔥"
- 6.0s: "Founder50: Vertical cinema is rotating. Not dying."
- 9.2s: "BlackAwe: Argue don't miss 🎬"
- 13.0s: "KelFan: That pacing is clean 😮‍💨"
- 18.5s: "Showrunner: This looks premium."
- 25.0s: "Network: We need Episode 1 ASAP."
- 33.0s: "Creator: The vibe overlay is the sauce."
- 45.0s: "Viewer: Okay… I'm locked in."

---

## 🔧 APP FILES UPDATED

1. ✅ `src/data/demoSeed.ts` - Added `FEATURED_VIDEO` object
2. ✅ `src/components/features/VideoHero.tsx` - Iframe support + VIBE preset
3. ✅ `src/components/features/DanmakuOverlay.tsx` - Preset support
4. ✅ `src/pages/FeedPage.tsx` - Featured video first in feed
5. ✅ `src/utils/constants.ts` - Cloudflare URL placeholder

---

## 🚀 NEXT STEPS

### 1. Enable Cloudflare Video in App

When Cloudflare video is ready, update `src/data/demoSeed.ts`:

```typescript
cloudflare: {
  // ... other fields
  readyToStream: true, // ← Change this to true
}
```

### 2. Website Integration

**Tell me the path to your website hero HTML file** and I'll give you the exact replacement.

Common locations:
- `public/index.html`
- `public/demo/index.html`
- `public/beta/index.html`
- `docs/prototype_reference.html`
- Or a separate website repo?

### 3. Form Submission Fix

**Where is your application form?**
- Is it in the React app?
- Or a separate website?
- What's the file path?

Once you tell me, I'll add:
- Success message: "Application received — check your email"
- Keep form data visible (don't clear)
- Show loading state
- Error handling

---

## ✅ VERIFICATION

**App Verification:**
```bash
# Check if FEATURED_VIDEO is loaded
npm run dev
# Go to Home tab → Should see Cloudflare iframe (when readyToStream: true)
# VIBE comments should scroll with preset messages
```

**Website Verification:**
```javascript
// In browser console:
document.querySelectorAll('[data-vibe="true"]').length
// Should return: 1 (only the featured hero)
```

---

## 📋 SUMMARY

**APP (React):**
- ✅ Cloudflare iframe integration ready
- ✅ VIBE preset comments configured
- ✅ Featured video in feed
- ⏳ Waiting for `readyToStream: true`

**WEBSITE (Static HTML):**
- ✅ Iframe snippet ready (`public/hero-video-iframe.html`)
- ✅ VIBE script ready (`public/vibe-danmu.js`)
- ❓ Need path to your website HTML file

**FORM:**
- ❓ Need path to application form file

---

**Reply with:**
1. Path to website hero HTML file
2. Path to application form file

Then I'll complete the integration!

