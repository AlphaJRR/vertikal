# VERTIKAL — Creator Profile Specification

## Purpose
This page represents the core identity of the creators on VERTIKAL. It must feel premium, cinematic, and reflect a director-driven ecosystem.

---

# 1. DATA MODEL

Creator object must contain:
{
  "id": "creator_001",
  "name": "Ava Roberts",
  "handle": "ava.r",
  "bio": "Director. Cinematographer. Storyteller.",
  "avatar": "/media/creators/ava.jpg",
  "tags": ["drama", "shorts", "experimental"],
  "followers": 12300,
  "profile_banner": "/media/banners/ava_banner.jpg",
  "shows": ["show_101", "show_109", "show_230"]
}

---

# 2. PAGE SECTIONS

## A. Banner
- Aspect ratio: 16:9
- Darkened gradient overlay
- Creator avatar overlaps bottom

## B. Identity Block
- Large avatar (120px)
- Name (XL, bold)
- Handle (muted gray)
- Bio (centered)
- Tag pills

## C. Stats
- Followers
- Shows posted
- Verified badge (if Founding 50)

## D. Actions
- Follow button
- Message button
- Tip button (gold)

---

# 3. SHOW GRID
- 3-column layout
- Auto-load more on scroll
- Each cell = vertical poster thumbnail
- Tap → /shows/:id

---

# 4. ANALYTICS
Emit:
- creator_profile_view
- creator_follow
- creator_message
- creator_tip
