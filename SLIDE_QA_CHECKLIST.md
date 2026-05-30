# Slide Deck QA Checklist

Manual QA steps for all canonical HTML presentation lessons (BLOCK_1–BLOCK_5).

Reference: `data/toolkitSlideTypes.ts` (`SLIDE_BLOCKS`, `LINKING_MAP`)

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
