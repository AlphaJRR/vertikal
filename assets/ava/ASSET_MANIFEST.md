# AVA diagram asset manifest (31 canonical BLOCK decks)

**Generated:** 2026-05-30  
**Format:** `ava/<category>/<file>.png` (16:9, dark bg, no text in image)  
**Mirrors:**

- `/Users/alphavisualartists/Vertikal-App/assets/ava/<category>/<file>.png`
- `/Users/alphavisualartists/alpha-visual-artists-brand/creators-toolkit/assets/ava/<category>/<file>.png`

**Code source of truth:** `data/avaDiagramManifest.ts`

> Release notes v1.0 cite **28** core diagram definitions (Joshua’s kebab SVG set). This manifest covers **31** PNGs for all `SLIDE_BLOCKS` decks (camera BLOCK_1 + full strategy). Extra Joshua-only assets (e.g. `white-balance`, `dutch-angle`) are not in this pass.

| Category | Filename | Diagram subject | Slide ref | HTML slide id |
|----------|----------|-----------------|-----------|---------------|
| camera | `exposure_triangle.png` | Exposure triangle — aperture, shutter, ISO | `slides_exposure_triangle` | exposure-triangle |
| camera | `depth_of_field.png` | Depth of field — shallow vs deep | `slides_aperture_depth` | aperture-depth |
| camera | `motion_blur.png` | Motion blur levels | `slides_shutter_motion` | shutter-motion |
| camera | `iso_noise.png` | ISO noise comparison | `slides_iso_noise` | iso-noise |
| framing | `rule_of_thirds.png` | Rule of thirds grid | `slides_rule_of_thirds` | rule-of-thirds |
| framing | `leading_lines.png` | Leading lines to subject | `slides_leading_lines` | leading-lines |
| framing | `headroom_lookroom.png` | Headroom and look room | `slides_headroom_lookroom` | headroom-lookroom |
| framing | `vertical_composition.png` | Vertical 9:16 composition | `slides_vertical_composition` | vertical-composition |
| lighting | `three_point_layout.png` | Three-point lighting layout | `slides_three_point_lighting` | three-point-lighting |
| lighting | `hard_soft_light.png` | Hard vs soft light | `slides_hard_soft_light` | hard-soft-light |
| lighting | `color_temperature.png` | Color temperature scale | `slides_color_temperature` | color-temperature |
| lighting | `cinematic_setup.png` | Cinematic lighting setup | `slides_cinematic_setup` | cinematic-setup |
| lighting | `rembrandt_lighting.png` | Rembrandt triangle | `slides_rembrandt_lighting` | rembrandt-lighting |
| lighting | `practical_motivated.png` | Practical motivated light | `slides_practical_motivated` | practical-motivated |
| editing | `interface_overview.png` | Resolve page workflow | `slides_interface_overview` | interface-overview |
| editing | `color_wheels.png` | Lift / gamma / gain wheels | `slides_color_wheels` | color-wheels |
| editing | `curves.png` | Luma and RGB curves | `slides_curves` | curves |
| editing | `vectorscope_skin_line.png` | Vectorscope skin line | `slides_skin_tone_correction` | skin-tone-correction |
| editing | `scopes.png` | Waveform + vectorscope | `slides_scopes` | scopes |
| editing | `node_structure.png` | Node tree workflow | `slides_node_structure` | node-structure |
| editing | `whip_pan.png` | Whip pan transition | `slides_whip_pan` | whip-pan |
| editing | `fairlight_basics.png` | Fairlight EQ / dynamics | `slides_fairlight_basics` | fairlight-basics |
| editing | `dialogue_cleanup.png` | Dialogue NR waveform | `slides_dialogue_cleanup` | dialogue-cleanup |
| strategy | `instagram_reels.png` | Reels safe zones | `slides_instagram_reels` | instagram-reels |
| strategy | `tiktok_native.png` | TikTok loop retention | `slides_tiktok_native` | tiktok-native |
| strategy | `youtube_titles_thumbs.png` | YouTube thumb layout | `slides_youtube_titles_thumbs` | youtube-titles-thumbs |
| strategy | `hook_formula.png` | Hook formula timeline | `slides_hook_formula` | hook-formula |
| strategy | `hooks_convert.png` | Conversion hook funnel | `slides_hooks_convert` | hooks-convert |
| strategy | `batch_shooting.png` | Batch shooting calendar | `slides_batch_shooting` | batch-shooting |
| strategy | `repurposing.png` | Repurposing hub | `slides_repurposing` | repurposing |
| strategy | `content_pillars.png` | Content pillars | `slides_content_pillars` | content-pillars |

## Joshua 28-kebab SVG set (on disk)

**Location:** `assets/ava/<category>/<name>.svg` (mirrored to brand repo)  
**Spec:** viewBox `0 0 800 450`, bg `#080808`, brand colors only, no text in SVG.

| Category | Files (28) |
|----------|------------|
| camera | `exposure-triangle`, `aperture-depth`, `shutter-motion`, `iso-noise`, `white-balance`, `frame-rates` |
| framing | `rule-of-thirds`, `leading-lines`, `headroom-noseroom`, `dutch-angle`, `high-low-angle`, `depth-layers` |
| lighting | `three-point-layout`, `hard-soft-light`, `rembrandt-triangle`, `butterfly-lighting`, `split-lighting`, `interview-setup`, `outdoor-fill-setup` |
| editing | `color-wheels-diagram`, `rgb-curves`, `node-workflow`, `vectorscope-skin-line`, `log-vs-graded`, `j-cut-l-cut` |
| strategy | `hook-formula`, `batch-shooting-calendar`, `content-pillars` |

Slide decks `slides_depth_layers`, `slides_high_low_angle`, and `slides_interview_setup` wire the framing/lighting kebab SVGs above into HTML presentation diagram slides.
