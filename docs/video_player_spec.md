# VERTIKAL Video Player Specification

## Overview
This spec defines the exact behavior, UI states, analytics, and controls of the VERTIKAL ShowPlayer.

---

# 1. PLAYER BEHAVIOR (MUST MATCH TIKTOK)

### Autoplay
- Autoplay on page load
- Must be **muted by default**
- Must not autoplay again after manual pause

### Tap Controls
- Single Tap → Pause / Play
- Mute Button → Toggle sound ON/OFF

### Loop Behavior
- Loop = ON for micro-shows (<90 sec)
- Loop = OFF for long-form shows unless user turns on

---

# 2. UI COMPONENTS

### Visible Controls
- Play/Pause overlay icon (fade out after 1.2s)
- Mute/Unmute bottom-right button
- Loop toggle (hidden in overflow menu)
- Progress Bar:
  - Draggable scrub
  - Current time / duration

---

# 3. ANALYTICS EVENTS

### Emit at:
- Start: `show_play`
- Pause: `show_pause`
- Complete: `show_complete`
- Scrub: `show_scrub` (include {from, to})
- Percentiles:
  - 25%
  - 50%
  - 75%
  - 90%

Payload:
{
  event,
  user_id,
  show_id,
  position,
  duration
}

---

# 4. PERFORMANCE REQUIREMENTS

- Preload first 4 seconds only  
- Lazy load full video on tap  
- Preload *next* show in related feed  
- Use GPU-accelerated CSS transforms  
