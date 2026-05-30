# AVA diagram assets (Vertikal-App)

Drop PNG diagrams here. The app and HTML slide decks resolve paths as:

```
ava/<category>/<filename>.png
```

## Folders

| Folder | Topics |
|--------|--------|
| `camera/` | Exposure triangle, aperture/DOF, shutter/motion, ISO/noise |
| `framing/` | Rule of thirds, leading lines, headroom/nose room, vertical composition |
| `lighting/` | Three-point, hard/soft, color temp, cinematic, Rembrandt, practical |
| `editing/` | Resolve UI, wheels, curves, skin line, scopes, nodes, whip pan, Fairlight, dialogue |
| `strategy/` | Reels, TikTok, YouTube, hooks, batch, repurposing, pillars |

## Expected filenames

See `ASSET_MANIFEST.md` in this folder (31 canonical BLOCK_1–5 decks).

## iCloud source folder

Joshua’s training screenshots live at:

`~/Library/Mobile Documents/com~apple~CloudDocs/2026 ALPHA | icloud/SCREENSHOTS FOR WEB:APP Davinci, Camera training /`

**How to drop:**

1. Rename each PNG to the manifest filename (snake_case).
2. Copy into the matching category folder above (and mirror to `alpha-visual-artists-brand/creators-toolkit/assets/ava/` if you edit in the brand repo).
3. Rebuild the Expo app so Metro picks up new `require()` entries in `data/toolkitSlideAssets.ts` (add one line per new PNG).

HTML decks use `<picture>` with PNG first and inline SVG fallback until files exist.

## Resolver

`resolveAvaDiagramPath()` in `data/toolkitSlideLinking.ts` — bundle root `assets/ava`.
