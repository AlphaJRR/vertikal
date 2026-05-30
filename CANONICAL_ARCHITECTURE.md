# AVA Creator Toolkit — Canonical Data Architecture

Joshua's canonical layout for the **AVA app** (repo folder: `Vertikal-App`, legacy name). **`data/lessons/*.json` and `data/slides/*.json` are the source of truth going forward.** `data/toolkitCurriculum.ts` remains for runtime compatibility until the app fully consumes JSON loaders.

## Folder structure

```
assets/ava/
  camera/      — diagram assets
  framing/
  lighting/
  editing/
  strategy/
  common/      — placeholder.svg + placeholder.png (800×450, #111111)

data/lessons/  — one JSON per lesson (snake_case id)
data/slides/   — one JSON per slide deck (slides_* id)
```

## Schemas

### Lesson — `data/lessons/<lesson_id>.json`

| Field | Type | Notes |
|-------|------|-------|
| `id` | string | snake_case, e.g. `lighting_three_point_lighting` |
| `tab` | string | `camera` \| `framing` \| `lighting` \| `editing` \| `strategy` |
| `type` | string | `STATIC` \| `HTML_PRESENTATION` |
| `title` | string | |
| `description` | string | |
| `guide` | string | THE GUIDE |
| `keyRule` | string | |
| `howTo` | string[] | steps |
| `proTip` | string | |
| `commonMistake` | string | |
| `slideRef` | string? | required when `type` is `HTML_PRESENTATION` |

Kebab curriculum ids map via `KNOWN_LESSON_ID_MISMATCHES` in `data/toolkitSlideLinking.ts`.

### Slide deck — `data/slides/<slide_id>.json`

```json
{ "id": "slides_exposure_triangle", "lessonId": "camera_exposure_triangle", "title": "...", "slides": [] }
```

**Six slide types only:** `title`, `concept`, `diagram`, `steps`, `callout`, `warning`.

Diagram `image` format: `ava/<category>/<file>.png` (schema). Bundled SVGs resolve via `AVA_DIAGRAM_PNG_TO_BUNDLE` in `data/toolkitSlideLinking.ts` until PNGs ship. Missing assets → `ava/common/placeholder.png`.

## Five rules

1. **One lesson = one JSON file** — snake_case id, no duplicates across tabs.
2. **HTML_PRESENTATION must have `slideRef`** — points to `data/slides/slides_*.json`.
3. **Slide decks use six types only** — no custom slide types in JSON.
4. **Diagram paths use `ava/<category>/…`** — PNG in schema; SVG alias via manifest; placeholder fallback.
5. **LINKING_MAP is authoritative** — 31 lesson → slide deck chains; extend only with manifest + audit.

## Linking chain

```
lesson.slideRef  →  data/slides/slides_*.json  →  diagram.image: ava/<category>/<file>
```

`LINKING_MAP` (31 entries) in `data/toolkitSlideTypes.ts`. Id mismatches in `KNOWN_LESSON_ID_MISMATCHES`.

## Loaders

| Module | Purpose |
|--------|---------|
| `data/lessons/index.ts` | `getLessonById`, `getAllLessons` — 97 canonical lessons |
| `data/slides/index.ts` | `getSlideDeck`, `getAllSlideDecks` — 31 slide decks |
| `data/toolkitCurriculum.ts` | Legacy runtime curriculum (unchanged) |

Regenerate JSON: `npx tsx scripts/migrate-canonical-architecture.ts`

## Image naming

- **Target:** `<topic>_diagram.png` under `ava/<category>/`
- **Current:** kebab-case `.svg` on disk (e.g. `exposure-triangle.svg`)
- **Mapping:** `avaDiagramManifest.ts` + `AVA_DIAGRAM_PNG_TO_BUNDLE` maps `*.png` schema paths → bundled SVG
- **Fallback:** `assets/ava/common/placeholder.png`

## Audit gaps (known)

| Gap | Notes |
|-----|-------|
| `depth`, `camera-angles` | HTML presentations not in LINKING_MAP (31 core decks only) |
| `lighting-interview-setup` | HTML presentation missing `htmlSlideId` / slide deck |

## Related files

- `data/toolkitSlideTypes.ts` — types, `LINKING_MAP`, `SLIDE_BLOCKS`
- `data/toolkitSlideLinking.ts` — id resolution, PNG→SVG map
- `data/avaDiagramManifest.ts` — SVG inventory + slideRef bindings
- `SLIDE_SCHEMA.md` — slide type reference
