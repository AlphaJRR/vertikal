# AI TEAM ALIGNMENT UPDATE — SYSTEM STATE 12/10 — VERTIKAL PLATFORM

**FROM:** JR, Founder & CEO  
**TO:** Gemini (CPO), Cursor (Engineering Lead), Copilot (Senior Dev), ChatGPT (CSO)  
**DATE:** 12/10  
**VERSION:** 1.6

---

## ✅ 1. CURRENT SYSTEM STATE (AFTER LATEST BUILD)

App is now functional end-to-end:

- ✅ **Onboarding** → Email → Code → Profile
- ✅ Auto-redirect into main app after verification
- ✅ Feed loads 5 shows from `more_shows.json`
- ✅ Vertical scroll / snap works
- ✅ Show Detail Page exists as a stub
- ✅ Navigation is stable and consistent

### Recent Components Successfully Implemented:
- ✅ `OnboardingPage.tsx`
- ✅ Updated `App.tsx` routing logic
- ✅ Founding 50 logic scaffold
- ✅ Vertical feed engine
- ✅ Data pipeline folders (`/src/data/*`)
- ✅ AI Team Alignment docs

---

## 🔧 2. WHAT THE ENGINEERING TEAM SHOULD DO NEXT

### 🎯 Proceed with the Show Detail Page Implementation

This includes:

#### A. Full Video Player
- Auto-play
- Looping
- Sound toggle
- Tap to pause
- Progress bar

#### B. Comments Section
- Mock data
- Avatar + username + time
- Vertical scroll inside a nested container

#### C. Episode Navigation
- For future multi-episode shows
- Carousel at bottom ("Episode 1 / Episode 2…")

#### D. Related Shows
- Pull from `more_shows.json`
- Match by overlapping tags

#### E. Creator Attribution
- Tap creator name → navigates to `/creator/:id`

### Engineering Focus:
- No real backend yet → use mock JSON
- Use the same VERTIKAL visual identity (black / charcoal / white)
- Optimize mobile-first
- Keep interfaces modular

---

## 📡 3. DATA TEAM NEEDS

Add to each show object in `more_shows.json`:

- ✅ `video_url` - Video file URL
- ✅ `creator_avatar` - Creator profile picture
- ✅ `creator_handle` - Creator @handle
- ✅ `tags` - Array of tags (for related shows matching)
- ✅ `duration_seconds` - For player progress bar
- ✅ `published_at` - ISO timestamp

**Current Status:** Some fields exist, need to verify all shows have complete data.

---

## 🔐 4. RISK / LEGAL / SCALE (ChatGPT-Strategy)

ChatGPT is instructed to produce:

**File:** `/docs/scaling_and_risk_review.md`

Including:

### A. Founding 50 Verification Logic
- Identity fraud prevention
- Code transfer prevention
- Account security

### B. Stripe Connect KYC Risks
- Payment processing compliance
- Creator payout verification
- Tax implications

### C. Content Moderation Risk
- Copyright infringement
- Safety concerns
- Minors protection

### D. Cost Estimate for 100k DAU:
- Cloud storage
- Video streaming (CDN)
- Compute usage
- AI workload expansion

---

## 📨 5. FOUNDING 50 WELCOME EMAIL

Should be triggered after verification flow.

**Status:** Currently console.log in `mockVerification.ts` → `claimCode()`

**Next:** Gemini + Cursor should wire this in as a placeholder function.

**Location:** `/src/lib/sendFounding50Email.ts` (exists, needs integration)

---

## 🚀 6. NEXT DECISION POINTS FOR THE CEO (JR)

### Choose the order of next core features:

1. **Show Detail Page** (NOW — HIGH PRIORITY) ⚡
2. Creator Profile Polish
3. Upload Flow
4. Payment (Stripe Connect)
5. VIBE overlay (live comments)
6. Network Channels (creator subscriptions)

### Start preparing the investor narrative:

- TAM slide
- Unit economics (vertical video CPM, subscription cuts)
- Competitor map
- "Founding 50" exclusivity strategy

### Prepare 20–50 creator assets (images + show posters)
→ These will be uploaded once the UI is ready.

---

## 📌 7. COMMAND FOR CURSOR (NEXT STEP)

**"Proceed with Show Detail Page implementation."**

### Cursor should respond:

- ✅ New file scaffolds created
- ✅ Components added
- ✅ Video player integrated
- ✅ Routing updated

---

## 📋 IMPLEMENTATION CHECKLIST

### Show Detail Page Requirements:

- [ ] Full video player component
  - [ ] Auto-play on load
  - [ ] Loop functionality
  - [ ] Sound toggle (mute/unmute)
  - [ ] Tap to pause/play
  - [ ] Progress bar
  - [ ] Fullscreen support

- [ ] Comments section
  - [ ] Mock comment data structure
  - [ ] Avatar + username + timestamp
  - [ ] Vertical scroll container
  - [ ] Comment input (placeholder)

- [ ] Episode navigation
  - [ ] Carousel component
  - [ ] Episode selector
  - [ ] "Episode X / Y" indicator

- [ ] Related shows
  - [ ] Tag-based matching algorithm
  - [ ] Show cards grid
  - [ ] Navigation to related show

- [ ] Creator attribution
  - [ ] Creator name/avatar
  - [ ] Tap → navigate to creator profile
  - [ ] Follow button (mock)

- [ ] Show metadata
  - [ ] Title, series, description
  - [ ] Views, likes, comments count
  - [ ] Published date
  - [ ] Tags

---

## 🎨 DESIGN REQUIREMENTS

- **Colors:** Black / Charcoal / White (VERTIKAL identity)
- **Layout:** Mobile-first, vertical optimized
- **Animations:** Smooth transitions, Framer Motion
- **Typography:** Inter font family
- **Spacing:** Consistent padding/margins

---

## 📁 FILE STRUCTURE (TO BE CREATED)

```
src/
├── pages/
│   └── ShowDetailPage.tsx          (UPDATE - full implementation)
├── components/
│   ├── video/
│   │   └── FullVideoPlayer.tsx     (NEW)
│   ├── comments/
│   │   ├── CommentsSection.tsx     (NEW)
│   │   └── CommentItem.tsx         (NEW)
│   ├── episodes/
│   │   └── EpisodeCarousel.tsx     (NEW)
│   └── related/
│       └── RelatedShows.tsx        (NEW)
└── data/
    └── comments.json                (NEW - mock data)
```

---

## ✅ ACCEPTANCE CRITERIA

Show Detail Page is complete when:

1. ✅ Video plays automatically on page load
2. ✅ User can pause/play by tapping
3. ✅ Sound toggle works
4. ✅ Progress bar shows video position
5. ✅ Comments section displays mock comments
6. ✅ Comments scroll vertically
7. ✅ Episode carousel shows (if multi-episode)
8. ✅ Related shows display (tag-matched)
9. ✅ Creator name navigates to profile
10. ✅ All styling matches VERTIKAL brand
11. ✅ Mobile-optimized layout
12. ✅ No console errors

---

**📣 END OF TEAM UPDATE — VERSION 1.6**

**STATUS:** Ready for Show Detail Page implementation  
**NEXT COMMAND:** "Proceed with Show Detail Page implementation."

---

*This document should be referenced by all AI team members before proceeding with Show Detail Page build.*



