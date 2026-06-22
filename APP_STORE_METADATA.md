# Alpha Visual Artists (AVA) — App Store Metadata

**Version:** 1.0.4  
**Platform:** iOS (App Store)  
**Date:** June 2026

---

## iOS App Store

### App Name

**Alpha Visual Artists**

### Subtitle

**Creator Toolkit for Visual Storytellers**

### Category

- **Primary:** Photo & Video
- **Secondary:** Education

### Keywords

```
creators, filmmaking, video production, cinematography, editing,
color grading, lighting, shot list, invoice, rate calculator,
creator tools, production checklist, training
```

### Description

**Alpha Visual Artists — The Creator Toolkit**

AVA is the mobile home for visual storytellers: production checklists, rate calculator, invoice builder, and a full Creators Toolkit with 108 lessons across camera, framing, lighting, editing, strategy, and production.

**Features:**

**Creators Toolkit**

- 108 structured lessons with cheat sheets and HTML slides
- Camera, framing, lighting, editing, strategy, and production tracks
- Foundational lessons free; AVA Pro unlocks the full curriculum

**Production Tools**

- Shoot-day and post-production checklists
- Rate calculator with quote builder
- Invoice builder with logo options

**Creator Home**

- Featured work reels and production tips
- Wallpapers and brand assets
- Sign in to sync Pro access and saved progress

**Sign in with email and password in-app.** AVA Pro unlocks premium lessons and pro tools.

---

### Subscriptions (AVA Pro)

**Subscription group:** ALPHA CREATORS CREW

| Plan | Monthly | Annual | Product IDs |
|------|---------|--------|-------------|
| **AVA Pro** | $9.99 | $79.99 | `AvaCreatorPro`, `yearly` |

**Founding 50:** 7-day early access before public IAP launch.

**Free tier:** 12 toolkit lessons, rate calculator, and invoice builder — no subscription required.

**In-app purchase only** for digital content (Guideline 3.1.1). No web checkout for Pro in the iOS app.

---

### Promotional Text

**New in v1.0.4:**

- In-app email + password sign-in (Supabase)
- Full Creators Toolkit with pro gating
- Production checklists, rate calculator, and invoice builder
- Performance and stability improvements

---

### Screenshots (Required)

**iPhone 6.7" Display**

1. **Home** — Featured reels and Sign in
2. **Creators Toolkit** — Lesson library
3. **Production Checklist** — Shoot-day workflow
4. **Rate Calculator** — Quote builder
5. **Tools Tab** — Toolkit navigation

---

### App Icon

**Requirements:**

- 1024x1024px PNG
- No transparency
- AVA logo centered
- Dark background (#0a0a0a)
- Cyan accent (#00d4ff)

---

### Privacy Policy URL

**[https://alphavisualartists.com/privacy](https://alphavisualartists.com/privacy)**

### Support URL

**[https://give .com/support](https://alphavisualartists.com/support)**

### Marketing URL

**[https://alphavisualartists.com](https://alphavisualartists.com)**

---

## Content Ratings

### iOS

- **Age Rating:** 12+
- **Reasons:** Infrequent/Mild Profanity or Crude Humor

### Age Assurance (Guideline 2.3.6) — ASC only

Complete in **App Store Connect** before each resubmission when Apple flags 2.3.6:

1. **Apps** → Alpha Visual Artists → **App Information** / compliance sections.
2. Fill **Age Assurance** questionnaire to match the 12+ rating above.
3. Account creation: handled **in-app** via Supabase email + password at `/sign-in`.
4. No UGC feed requiring separate child-safety flow in the mobile binary for this release.

Step-by-step and Resolution Center copy: `docs/APP_STORE_REJECTION_JUNE_2026.md`.

---

## Privacy & Permissions

### Required Permissions (iOS)

- Photo Library — Save wallpapers; optional invoice logo upload
- No camera permission required for core flows

---

## Release Notes

### v1.0.4 (Build 10)

**Features:**

- In-app email + password sign-in for App Review and production users
- Creators Toolkit with AVA Pro gating
- Production checklists, rate calculator, invoice builder
- Featured reels on home screen

**App Review demo account:** Provide credentials in App Store Connect Review Notes only (not in metadata). Email: `appreview@alphavisualartists.com`; password set in Supabase dashboard.

---

## Metadata scrub checklist (Round 2 — June 2026)

Before resubmission, confirm **App Store Connect** fields contain **no** references to:

- "beta"
- "join the beta"
- "TestFlight" (unless in internal notes only)
- "coming soon" for sign-in or core features

Use **"Alpha Visual Artists"** or **"AVA"** — not legacy product names in user-facing copy.

---

**Generated:** June 2026  
**Version:** 1.0.4 / build 10