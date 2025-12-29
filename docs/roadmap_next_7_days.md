# VERTIKAL — 7-Day Engineering Roadmap (Dec 10 → Dec 17)

## Overview
This sprint focuses on completing the core “Watch” experience:
- Full Show Detail Page
- Video Player
- Comment System
- Episode Navigation
- Related Shows
- Creator Linking
- Stability + QA pass

---

# DAY 1 — DEC 10  
### Deliverables
- ShowDetail scaffolding created
- Player, Comments, EpisodeCarousel file structure created
- Routing: /shows/:id connected to detail view
- Data validation against more_shows.json

### AI Task Breakdown
- Cursor: Generate scaffolding & routes
- Copilot: Inline fixes, linting
- Gemini: Define UX edge cases
- ChatGPT: Risk + scaling review

---

# DAY 2 — DEC 11  
### Deliverables
- Player core implemented:
  - Autoplay (muted)
  - Mute toggle
  - Tap to pause/play
  - Loop toggle
  - Time updates
  - Progress bar with scrubbing

### QA Goals
- Works on iOS + Android (mobile browser)
- No layout shift during load

---

# DAY 3 — DEC 12  
### Deliverables
- Comments component complete (mock)
- Add-comment box UI implemented
- Creator attribution block
- Analytics events connected:
  - show_play
  - show_pause
  - show_complete
  - scrub
  - comment_post

### QA Goals
- Test comments scrolling
- Test long usernames, long comments

---

# DAY 4 — DEC 13  
### Deliverables
- Episode navigation carousel
- Prev/Next episode controls
- Episode deep-link navigation

### QA Goals
- Navigating episode preserves vertical feed context
- Video resets correctly on episode switch

---

# DAY 5 — DEC 14  
### Deliverables
- Related Shows component
  - Tag matching
  - Thumbnail grid
  - Tap → new ShowDetail

### QA Goals
- At least 6 related shows per show
- Works with 200+ items in JSON

---

# DAY 6 — DEC 15  
### Deliverables
- Full UX polish
  - Animation
  - Better transitions
  - Haptics (optional)
- Accessibility:
  - Role landmarking
  - Buttons labeled

---

# DAY 7 — DEC 16  
### Deliverables
- Regression QA sweep
- Performance pass:
  - Lazy-load video sources
  - Preload next episode
  - Preload related shows thumbnails
- Merge → Main

**VERTIKAL v0.5 Release Candidate.**
