# VERTIKAL — Notification System Specification

## Phase 1: Mock Local Notifications

Supported events:
- New follower
- New comment
- New tip
- New episode released

---

# Notification Object

{
  "id": "notif_001",
  "type": "comment",
  "message": "Ava.r commented on your show",
  "target_show": "show_101",
  "timestamp": ISO
}

---

# Phase 2: Real-Time Delivery
Using:
- WebSockets OR
- Firebase Cloud Messaging

---

# Notification Center Page
- Group by day
- Icons for each type
- Swipe to clear
- Tap to view associated show/creator
