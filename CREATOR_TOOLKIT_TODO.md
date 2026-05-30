# Creator Toolkit — Joshua reminder

**Due: June 5, 2026 (next week)**

- [ ] Paste **SHOOTING MODES (5)** + **CAMERA MOVEMENT (5)** camera lessons in v2 format
  - **2026-05-30 audit:** All 10 have `description` + `steps` only — missing `guide`, `keyRule`, `proTip`, `commonMistake`. Joshua paste required (no invented content). Also note: `editing-skin-tone` missing steps/keyRule/proTip/commonMistake (separate from camera block).
- [x] Test Expo app (all 5 tabs, HTML slide WebViews) — see `SLIDE_QA_CHECKLIST.md`
  - **2026-05-30:** Toolkit data files typecheck clean (`toolkitCurriculum.ts`, `toolkitSlideAssets.ts`, `toolkitSlideLinking.ts`, `toolkitSlideTypes.ts`). All 33 HTML lesson paths resolve in `toolkitSlideAssets.ts` (0 missing). Full-project `npm run typecheck` has pre-existing unrelated errors (missing deps, hooks). **Joshua manual QA on device still required** — all 12 steps in `SLIDE_QA_CHECKLIST.md` (open every HTML lesson, swipe slides, diagram images, callout/warning styling, deep linking, console errors, red screens, low-end perf, back nav, scroll, slideRef↔lessonId).
- [x] Commit any post-push camera additions if still uncommitted
  - **2026-05-30:** `git status` clean — nothing to commit on `main`.
- [x] Export full `lessons.ts` from `toolkitCurriculum.ts`
  - **2026-05-30:** Exported **85 lessons** with full v2 fields to `/Users/alphavisualartists/Downloads/lessons.ts` (TypeScript-valid, self-contained types). Excludes 11 partial lessons (10 camera + `editing-skin-tone`).
- [x] Build/link Joshua canonical `html_presentation` slides (31 lessons — see mapping below)
- [ ] Optional: bundle remaining brand slides
  - **2026-05-30 status (not blocking):** 6 extra HTML decks on disk and registered in `toolkitSlideAssets.ts` but outside canonical BLOCK_1–5: `depth`, `camera-angles`, `skin-tones`, `node-workflow`, `vectorscope`, `custom-curves`. Bundled and linked to other lessons; no action taken this pass.

## Slide architecture (canonical)

Source of truth: `data/toolkitSlideTypes.ts`

| Block | Topic | Deck count |
|---|---|---|
| BLOCK_1 | Camera | 4 |
| BLOCK_2 | Framing | 4 |
| BLOCK_3 | Lighting | 6 |
| BLOCK_4 | Editing | 9 |
| BLOCK_5 | Strategy | 8 |

- **Types:** `Slide`, `SlideDeck` (title / concept / diagram / steps / callout / warning)
- **Blocks:** `SLIDE_BLOCKS` — const arrays of slide refs (`slides_*`)
- **Linking:** `LINKING_MAP` — snake_case lesson id → slide ref (31 entries, includes camera BLOCK_1)
- **Helpers:** `data/toolkitSlideLinking.ts` — `getSlideIdForLesson()`, `getCurriculumLessonId()`, `slideRefToHtmlSlideId()`
- **QA:** `SLIDE_QA_CHECKLIST.md` (12 manual steps)

### Audit summary (BLOCK_1–BLOCK_5)

All 31 canonical decks wired end-to-end as of this audit. Columns: **L** = lesson in curriculum, **H** = HTML file on disk, **A** = registered in `toolkitSlideAssets.ts`, **J** = entry in `toolkit-content.json` (id = kebab `htmlSlideId`).

| Block | Slide ref | Curriculum lesson | L | H | A | J | Notes |
|---|---|---|---|---|---|---|---|
| 1 | `slides_exposure_triangle` | `camera-exposure-triangle` | ✓ | ✓ | ✓ | ✓ | Camera linking added to `LINKING_MAP` |
| 1 | `slides_aperture_depth` | `camera-aperture` | ✓ | ✓ | ✓ | ✓ | Camera linking added |
| 1 | `slides_shutter_motion` | `camera-shutter` | ✓ | ✓ | ✓ | ✓ | Camera linking added |
| 1 | `slides_iso_noise` | `camera-iso` | ✓ | ✓ | ✓ | ✓ | Camera linking added |
| 2 | `slides_rule_of_thirds` | `framing-rule-of-thirds` | ✓ | ✓ | ✓ | ✓ | |
| 2 | `slides_leading_lines` | `framing-leading-lines` | ✓ | ✓ | ✓ | ✓ | |
| 2 | `slides_headroom_lookroom` | `framing-headroom-nose-room` | ✓ | ✓ | ✓ | ✓ | Id mismatch — see linking helper |
| 2 | `slides_vertical_composition` | `framing-vertical-composition` | ✓ | ✓ | ✓ | ✓ | Lesson exists (35B); no stub needed |
| 3 | `slides_three_point_lighting` | `lighting-three-point` | ✓ | ✓ | ✓ | ✓ | |
| 3 | `slides_hard_soft_light` | `lighting-hard-vs-soft` | ✓ | ✓ | ✓ | ✓ | |
| 3 | `slides_color_temperature` | `lighting-color-temp` | ✓ | ✓ | ✓ | ✓ | |
| 3 | `slides_cinematic_setup` | `lighting-cinematic-setup` | ✓ | ✓ | ✓ | ✓ | |
| 3 | `slides_rembrandt_lighting` | `lighting-rembrandt` | ✓ | ✓ | ✓ | ✓ | |
| 3 | `slides_practical_motivated` | `lighting-practical-motivated` | ✓ | ✓ | ✓ | ✓ | |
| 4 | `slides_interface_overview` | `editing-resolve-interface` | ✓ | ✓ | ✓ | ✓ | |
| 4 | `slides_color_wheels` | `editing-color-wheels` | ✓ | ✓ | ✓ | ✓ | |
| 4 | `slides_curves` | `editing-curves` | ✓ | ✓ | ✓ | ✓ | |
| 4 | `slides_skin_tone_correction` | `editing-skin-tone` | ✓ | ✓ | ✓ | ✓ | |
| 4 | `slides_scopes` | `editing-scopes` | ✓ | ✓ | ✓ | ✓ | |
| 4 | `slides_node_structure` | `editing-nodes` | ✓ | ✓ | ✓ | ✓ | |
| 4 | `slides_whip_pan` | `editing-whip-pan-transition` | ✓ | ✓ | ✓ | ✓ | Editing lesson, not `camera-whip-pan` |
| 4 | `slides_fairlight_basics` | `editing-fairlight` | ✓ | ✓ | ✓ | ✓ | |
| 4 | `slides_dialogue_cleanup` | `editing-dialogue-cleanup` | ✓ | ✓ | ✓ | ✓ | |
| 5 | `slides_instagram_reels` | `strategy-reels` | ✓ | ✓ | ✓ | ✓ | Fixed JSON id `slides_*` → kebab |
| 5 | `slides_tiktok_native` | `strategy-tiktok` | ✓ | ✓ | ✓ | ✓ | Fixed JSON id |
| 5 | `slides_youtube_titles_thumbs` | `strategy-youtube` | ✓ | ✓ | ✓ | ✓ | Fixed JSON id |
| 5 | `slides_hook_formula` | `strategy-hook-formula` | ✓ | ✓ | ✓ | ✓ | Fixed JSON id |
| 5 | `slides_hooks_convert` | `strategy-hooks-that-convert` | ✓ | ✓ | ✓ | ✓ | Fixed JSON id |
| 5 | `slides_batch_shooting` | `strategy-batch-shooting` | ✓ | ✓ | ✓ | ✓ | Fixed JSON id |
| 5 | `slides_repurposing` | `strategy-repurposing` | ✓ | ✓ | ✓ | ✓ | Fixed JSON id |
| 5 | `slides_content_pillars` | `strategy-content-pillars` | ✓ | ✓ | ✓ | ✓ | Fixed JSON id |

**Gaps fixed this pass:** BLOCK_5 strategy slides used `slides_*` ids in `toolkit-content.json` while curriculum routes to kebab `htmlSlideId` — ids aligned to kebab so `/slide/[id]` resolves.

**Outstanding (not in BLOCK_1–5):** Extra bundled slides (`depth`, `camera-angles`, `skin-tones`, `node-workflow`, `vectorscope`, `custom-curves`) remain linked to other lessons outside the canonical 31.

## Canonical lessonId → slideRef mapping (Joshua)

Snake_case keys are the source IDs in AVA Creator Toolkit content. In Vertikal-App, each maps to a **kebab-case lesson `id`** in `data/toolkitCurriculum.ts` and a **kebab `htmlSlideId`** (strip `slides_` prefix from slide ref).

| snake_case (source) | slide ref | htmlSlideId | Vertikal lesson id |
|---|---|---|---|
| `camera_exposure_triangle` | `slides_exposure_triangle` | `exposure-triangle` | `camera-exposure-triangle` |
| `camera_aperture_depth` | `slides_aperture_depth` | `aperture-depth` | `camera-aperture` |
| `camera_shutter_motion` | `slides_shutter_motion` | `shutter-motion` | `camera-shutter` |
| `camera_iso_noise` | `slides_iso_noise` | `iso-noise` | `camera-iso` |
| `lighting_three_point_lighting` | `slides_three_point_lighting` | `three-point-lighting` | `lighting-three-point` |
| `lighting_hard_soft_light` | `slides_hard_soft_light` | `hard-soft-light` | `lighting-hard-vs-soft` |
| `lighting_color_temperature` | `slides_color_temperature` | `color-temperature` | `lighting-color-temp` |
| `lighting_cinematic_setup` | `slides_cinematic_setup` | `cinematic-setup` | `lighting-cinematic-setup` |
| `lighting_rembrandt_lighting` | `slides_rembrandt_lighting` | `rembrandt-lighting` | `lighting-rembrandt` |
| `lighting_practical_motivated` | `slides_practical_motivated` | `practical-motivated` | `lighting-practical-motivated` |
| `framing_rule_of_thirds` | `slides_rule_of_thirds` | `rule-of-thirds` | `framing-rule-of-thirds` |
| `framing_leading_lines` | `slides_leading_lines` | `leading-lines` | `framing-leading-lines` |
| `framing_headroom_lookroom` | `slides_headroom_lookroom` | `headroom-lookroom` | `framing-headroom-nose-room` |
| `framing_vertical_composition` | `slides_vertical_composition` | `vertical-composition` | `framing-vertical-composition` |
| `editing_interface_overview` | `slides_interface_overview` | `interface-overview` | `editing-resolve-interface` |
| `editing_color_wheels` | `slides_color_wheels` | `color-wheels` | `editing-color-wheels` |
| `editing_curves` | `slides_curves` | `curves` | `editing-curves` |
| `editing_skin_tone_correction` | `slides_skin_tone_correction` | `skin-tone-correction` | `editing-skin-tone` |
| `editing_reading_scopes` | `slides_scopes` | `scopes` | `editing-scopes` |
| `editing_node_structure` | `slides_node_structure` | `node-structure` | `editing-nodes` |
| `editing_whip_pan_transition` | `slides_whip_pan` | `whip-pan` | `editing-whip-pan-transition` *(editing, not `camera-whip-pan`)* |
| `editing_fairlight_basics` | `slides_fairlight_basics` | `fairlight-basics` | `editing-fairlight` |
| `editing_dialogue_cleanup` | `slides_dialogue_cleanup` | `dialogue-cleanup` | `editing-dialogue-cleanup` |
| `strategy_instagram_reels` | `slides_instagram_reels` | `instagram-reels` | `strategy-reels` |
| `strategy_tiktok_native` | `slides_tiktok_native` | `tiktok-native` | `strategy-tiktok` |
| `strategy_youtube_titles_thumbs` | `slides_youtube_titles_thumbs` | `youtube-titles-thumbs` | `strategy-youtube` |
| `strategy_hook_formula` | `slides_hook_formula` | `hook-formula` | `strategy-hook-formula` |
| `strategy_hooks_that_convert` | `slides_hooks_convert` | `hooks-convert` | `strategy-hooks-that-convert` |
| `strategy_batch_shooting` | `slides_batch_shooting` | `batch-shooting` | `strategy-batch-shooting` |
| `strategy_repurposing_content` | `slides_repurposing` | `repurposing` | `strategy-repurposing` |
| `strategy_content_pillars` | `slides_content_pillars` | `content-pillars` | `strategy-content-pillars` |

**Wiring pattern (per lesson):**

- `type: "html_presentation"`
- `htmlSlideId` = kebab id above
- `htmlSlidePath` = `slides/<category>/…html` under `assets/creators-toolkit/`
- Register path in `data/toolkitSlideAssets.ts`
- Add slide entry in `data/toolkit-content.json` (same `id` as `htmlSlideId`)
- Register snake_case key in `LINKING_MAP` (`data/toolkitSlideTypes.ts`)
