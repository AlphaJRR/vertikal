# Slide Deck QA Checklist

Manual QA steps for all canonical HTML presentation lessons (BLOCK_1–BLOCK_5).

Reference: `SLIDE_SCHEMA.md`, `data/toolkitSlideTypes.ts` (`QA_STEPS`, `SLIDE_BLOCKS`, `LINKING_MAP`)

## QA Steps

1. Open every HTML lesson
2. Verify slide deck loads
3. Swipe through all slides
4. Check diagram images load
5. Check callout + warning styling
6. Check deep linking
7. Check no console errors
8. Check no red screens
9. Check performance on low-end device
10. Check back navigation
11. Check scroll behavior
12. Check slideRef matches lessonId

## Scope

31 linked lessons across 5 blocks:

- **BLOCK_1 (Camera):** 4 decks
- **BLOCK_2 (Framing):** 4 decks
- **BLOCK_3 (Lighting):** 6 decks
- **BLOCK_4 (Editing):** 9 decks
- **BLOCK_5 (Strategy):** 8 decks

Use `getHtmlSlideIdForLesson()` from `data/toolkitSlideLinking.ts` to verify each lesson's `htmlSlideId` matches its toolkit-content.json entry.

---

## Device QA — Camera Slides + Production 101 (May 2026)

**Commits:** `8907b3e` (10 camera slide deck JSON), `3f24638` (Contracts & Kill Fees), `12e9d66` (Joshua paste alignment)

**Automated:** `npx tsx scripts/verify-slide-qa.ts` (105 checks)

### Camera tab — 10 lessons

| Lesson | Slide ref | htmlSlideId |
|--------|-----------|-------------|
| Manual Mode | `slides_manual_mode` | `manual-mode` |
| Aperture Priority | `slides_aperture_priority` | `aperture-priority` |
| Shutter Priority | `slides_shutter_priority` | `shutter-priority` |
| Picture Profiles | `slides_picture_profiles` | `picture-profiles` |
| RAW vs Compressed | `slides_raw_vs_compressed` | `raw-vs-compressed` |
| Handheld | `slides_handheld` | `handheld` |
| Gimbal | `slides_gimbal` | `gimbal` |
| Static / Locked-Off | `slides_static_locked` | `static-locked` |
| Dolly / Slider | `slides_dolly_slider` | `dolly-slider` |
| Whip Pan | `slides_camera_whip_pan` | `whip-pan` |

1. Launch app on physical device (iOS + Android).
2. Open each lesson above; verify slide deck loads.
3. Swipe through all 6 slides (title → concept → diagram → steps → callout → warning).
4. Confirm diagram images resolve (`ava/camera/*.png`).
5. Confirm callout + warning styles render correctly.
6. Confirm no console errors.

### Production 101 tab

1. Open **Contracts & Kill Fees** (`production-contracts-kill-fees`, Pro).
2. Verify v2 fields: description, guide, keyRule, steps, proTip, commonMistake.
3. Confirm no layout issues.

### Navigation QA

- Tab → Lesson → Slides → Back
- Search → Lesson → Slides
- Continue Learning → Slides

### Performance QA

- No dropped frames or stutters on low-end device
- Memory stable

### Regression QA

- Other tabs unchanged
- No missing assets in other lessons

### Sign-off

- [ ] Camera 10/10 pass
- [ ] Production lesson pass
- [ ] Navigation pass
- [ ] Performance pass
- [ ] Regression pass
- [ ] Build stable — approve for release
