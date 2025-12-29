# VERTIKAL — Feed Engine Specification

## Purpose
Create a vertical, swipe-driven cinematic feed that behaves like TikTok/Reels but optimized for short dramas and episodic micro-series.

---

# 1. ARCHITECTURE

The feed engine manages:
- Show preloading
- Video lifecycle (play, pause, unload)
- Scroll snapping
- Buffered content windows

---

# 2. BEHAVIOR

### Snap Scrolling
- Each card must fill screen height (100vh)
- Scrolling stops between cards
- Player autoplays when card snaps into view

### Preloading
- Preload next 1–2 videos automatically
- Unload videos that are 3+ items away

### Data Source
Load from:
- /src/data/more_shows.json

---

# 3. PLAYER LIFECYCLE RULES

When card becomes visible:
- Autoplay (muted)
- Show progress tracking starts

When card leaves viewport:
- Pause
- Reset buffer

---

# 4. ANALYTICS
Emit:
- feed_card_view
- feed_scroll_velocity
- feed_exit
