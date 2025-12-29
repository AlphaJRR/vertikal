# VERTIKAL Comment System Specification

## Short-Term Goal
Client-side comments using mock JSON until backend is ready.

## Long-Term Goal
Fully scalable comment system with:
- Anti-spam
- Ranking
- Shadowbans
- AI moderation

---

# 1. UI REQUIREMENTS

### Comment List
- Avatar (40px)
- Username (bold)
- Timestamp ("2h ago")
- Comment text (wraps naturally)
- Tap username → /creator/:id

### Add Comment UI
- Text input at bottom
- "Send" button
- Must clear after submit
- Must append comment to list instantly (UI only)

---

# 2. DATA STRUCTURE

Comment object:
{
  "id": "c_001",
  "user_id": "creator_001",
  "username": "ava.r",
  "avatar": "/media/creators/ava.jpg",
  "text": "This is 🔥",
  "timestamp": "2025-11-20T09:00:00Z"
}

---

# 3. FUTURE REAL BACKEND REQUIREMENTS

- Pre-moderation for flagged content (AI)
- Post-moderation for allowed-but-risky content
- Auto-hide for banned users
- Spam throttling: 1 comment per 3 seconds
- Profanity filter

---

# 4. ANALYTICS

Emit:
- comment_open
- comment_scroll
- comment_post
