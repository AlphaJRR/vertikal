# Slide Deck Schema

Canonical JSON shape for AVA Creator Toolkit HTML presentation decks. Types live in `data/toolkitSlideTypes.ts`.

## SlideDeck template

```json
{
  "id": "slides_xxx",
  "lessonId": "xxx",
  "title": "Title",
  "slides": [
    { "type": "title", "heading": "...", "subheading": "..." },
    { "type": "concept", "heading": "...", "bullets": ["...", "..."] },
    { "type": "diagram", "heading": "...", "image": "ava/<category>/<file>.png", "caption": "..." },
    { "type": "steps", "heading": "...", "steps": ["...", "..."] },
    { "type": "callout", "heading": "Pro Tip", "text": "..." },
    { "type": "warning", "heading": "Common Mistake", "text": "..." }
  ]
}
```

## Slide types

| type | fields |
|------|--------|
| `title` | `heading`, `subheading?` |
| `concept` | `heading`, `bullets[]` |
| `diagram` | `heading`, `image`, `caption?` |
| `steps` | `heading`, `steps[]` |
| `callout` | `heading`, `text` |
| `warning` | `heading`, `text` |

## Diagram image convention

Diagram slides reference PNG assets with the `ava/` prefix:

```
ava/<category>/<file>.png
```

Example: `ava/lighting/three_point_layout.png`

- **Brand source:** `alpha-visual-artists-brand/creators-toolkit/assets/ava/<category>/<file>.png`
- **App bundle:** `assets/ava/<category>/<file>.png`
- **Resolver:** `resolveAvaDiagramPath()` in `data/toolkitSlideLinking.ts`

Categories: `camera`, `lighting`, `framing`, `editing`, `strategy`.

## LINKING_MAP (27 core entries)

Snake_case lesson id → slide ref. Camera BLOCK_1 entries are appended separately in `LINKING_MAP` (31 total).

| Category | lessonId | slideRef |
|----------|----------|----------|
| **lighting (6)** | | |
| | `lighting_three_point_lighting` | `slides_three_point_lighting` |
| | `lighting_hard_soft_light` | `slides_hard_soft_light` |
| | `lighting_color_temperature` | `slides_color_temperature` |
| | `lighting_cinematic_setup` | `slides_cinematic_setup` |
| | `lighting_rembrandt_lighting` | `slides_rembrandt_lighting` |
| | `lighting_practical_motivated` | `slides_practical_motivated` |
| **framing (4)** | | |
| | `framing_rule_of_thirds` | `slides_rule_of_thirds` |
| | `framing_leading_lines` | `slides_leading_lines` |
| | `framing_headroom_lookroom` | `slides_headroom_lookroom` |
| | `framing_vertical_composition` | `slides_vertical_composition` |
| **editing (9)** | | |
| | `editing_interface_overview` | `slides_interface_overview` |
| | `editing_color_wheels` | `slides_color_wheels` |
| | `editing_curves` | `slides_curves` |
| | `editing_skin_tone_correction` | `slides_skin_tone_correction` |
| | `editing_reading_scopes` | `slides_scopes` |
| | `editing_node_structure` | `slides_node_structure` |
| | `editing_whip_pan_transition` | `slides_whip_pan` |
| | `editing_fairlight_basics` | `slides_fairlight_basics` |
| | `editing_dialogue_cleanup` | `slides_dialogue_cleanup` |
| **strategy (8)** | | |
| | `strategy_instagram_reels` | `slides_instagram_reels` |
| | `strategy_tiktok_native` | `slides_tiktok_native` |
| | `strategy_youtube_titles_thumbs` | `slides_youtube_titles_thumbs` |
| | `strategy_hook_formula` | `slides_hook_formula` |
| | `strategy_hooks_that_convert` | `slides_hooks_convert` |
| | `strategy_batch_shooting` | `slides_batch_shooting` |
| | `strategy_repurposing_content` | `slides_repurposing` |
| | `strategy_content_pillars` | `slides_content_pillars` |

Camera BLOCK_1 (4 additional entries in `LINKING_MAP`): `camera_exposure_triangle`, `camera_aperture_depth`, `camera_shutter_motion`, `camera_iso_noise`.

## Related files

- `data/toolkitSlideTypes.ts` — `Slide`, `SlideDeck`, `SLIDE_BLOCKS`, `LINKING_MAP`
- `data/toolkitSlideLinking.ts` — lesson id resolution helpers
- `SLIDE_QA_CHECKLIST.md` — manual QA steps
