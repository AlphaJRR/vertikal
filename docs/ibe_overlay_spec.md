# VERTIKAL — VIBE Overlay Specification

## Purpose
A lightweight live-comment overlay inspired by TikTok “Live Comments” + Netflix subtitles.

---

# 1. FEATURES

- Messages float upward on video
- Max 3–5 messages visible at once
- Opacity fades out after 2 seconds
- Randomized left/right position
- Colors mapped to user id for consistency

---

# 2. DATA STRUCTURE

{
  "id": "vibe_201",
  "user": "ava.r",
  "text": "OMG this shot 😭🔥",
  "timestamp": 3000   // ms after playback start
}

---

# 3. BEHAVIOR

- Sync messages to video playback time
- Pause overlay when video is paused
- Skip future messages on scrub

---

# 4. FUTURE BACKEND INTEGRATION

- WebSocket stream
- Rate limiting
- Moderation before rendering
