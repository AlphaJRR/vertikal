import type { ToolkitCategory, ToolkitLesson, ToolkitTab } from "./toolkitCurriculumTypes";
export type { ToolkitCategory, ToolkitLesson, ToolkitTab } from "./toolkitCurriculumTypes";
export { TOOLKIT_TABS, SAVED_LESSONS_KEY } from "./toolkitCurriculumTypes";

export const toolkitCategories: ToolkitCategory[] = [
  {
    "id": "camera-camera-basics",
    "tab": "camera",
    "eyebrow": "CAMERA BASICS",
    "title": "Camera Basics",
    "lessons": [
      {
        "id": "camera-iso",
        "number": "01",
        "tab": "camera",
        "category": "Camera Basics",
        "title": "ISO",
        "description": "Control sensor sensitivity. Lower ISO = cleaner image. Higher ISO = more noise but brighter in dark rooms.",
        "steps": [
          "Start at base ISO (100–400 on most bodies, 800 on low-light cinema cameras)",
          "Only raise ISO when you cannot add light or open aperture further",
          "Enable zebras at 70% to protect highlights before they clip",
          "Test your camera's noise floor — know your max usable ISO before the shoot",
          "Match ISO across A-cam and B-cam when cutting between angles"
        ],
        "images": []
      },
      {
        "id": "camera-aperture",
        "number": "02",
        "tab": "camera",
        "category": "Camera Basics",
        "title": "Aperture",
        "description": "The f-stop controls depth of field and light intake. Lower number = wider opening = more blur.",
        "steps": [
          "Wide apertures (f/1.4–f/2.8) isolate subjects — use for interviews and portraits",
          "Mid apertures (f/4–f/5.6) balance sharpness and separation for run-and-gun",
          "Stop down to f/8–f/11 for landscapes and group shots where everyone must be sharp",
          "Watch exposure when changing aperture — adjust shutter or ISO to compensate",
          "Manual iris on set — avoid auto aperture hunting during dialogue"
        ],
        "images": []
      },
      {
        "id": "camera-shutter",
        "number": "03",
        "tab": "camera",
        "category": "Camera Basics",
        "title": "Shutter Speed",
        "description": "Shutter controls motion blur and exposure. For video, think in shutter angle, not just speed.",
        "steps": [
          "At 24fps, set 1/48 or 1/50 for natural motion blur (180° shutter angle)",
          "Double your frame rate for shutter speed as a quick rule (30fps → 1/60)",
          "High shutter (1/120+) for crisp action; low shutter (1/30) for dreamy motion",
          "Use ND filters in daylight to keep aperture and shutter where you want them",
          "Never let shutter drift in auto — locked shutter keeps skin texture consistent"
        ],
        "images": []
      },
      {
        "id": "camera-white-balance",
        "number": "04",
        "tab": "camera",
        "category": "Camera Basics",
        "title": "White Balance",
        "description": "Set Kelvin to match your light source. Wrong WB costs you in post.",
        "steps": [
          "3200K for tungsten, 5600K for daylight, 4500K for mixed office fluorescents",
          "Custom WB off a gray card at the subject position — not off the wall behind you",
          "Lock WB on set — auto WB shifts between shots and breaks match cuts",
          "Shoot LOG or RAW when possible so you have room to nudge in grade",
          "Note your lighting setup in the slate or notes app for the colorist"
        ],
        "images": []
      },
      {
        "id": "camera-exposure-triangle",
        "number": "05",
        "tab": "camera",
        "category": "Camera Basics",
        "title": "Exposure Triangle",
        "description": "ISO, aperture, and shutter work together. Change one, adjust another.",
        "steps": [
          "Pick your creative priority first — depth, motion, or clean shadows",
          "Use false color or zebras to confirm exposure — histogram alone lies on LOG",
          "Expose LOG 1–1.5 stops under to protect highlights; lift in grade",
          "When adding ND, compensate with ISO or aperture — do not just darken the image",
          "Bracket one stop over/under on critical hero shots if time allows"
        ],
        "images": []
      }
    ]
  },
  {
    "id": "camera-shooting-modes",
    "tab": "camera",
    "eyebrow": "SHOOTING MODES",
    "title": "Shooting Modes",
    "lessons": [
      {
        "id": "camera-manual-mode",
        "number": "06",
        "tab": "camera",
        "category": "Shooting Modes",
        "title": "Manual Mode",
        "description": "Full control over ISO, aperture, and shutter. The standard for consistent cinematic work.",
        "steps": [
          "Dial in shutter first (180° rule), then aperture for depth, then ISO for exposure",
          "Use manual for interviews, narrative, and any multi-cam matching scenario",
          "Assign custom buttons for quick ISO and WB access on Sony bodies",
          "Review every setup on a calibrated monitor — phone screens lie",
          "Manual does not mean slow — build a muscle-memory starting recipe per location type"
        ],
        "images": []
      },
      {
        "id": "camera-aperture-priority",
        "number": "07",
        "tab": "camera",
        "category": "Shooting Modes",
        "title": "Aperture Priority",
        "description": "You set f-stop, camera picks shutter. Useful for fast-changing light when depth matters most.",
        "steps": [
          "Set minimum shutter limit in menu (e.g. 1/50 at 24fps) to prevent stutter",
          "Use for events and documentary when subjects move between sun and shade",
          "Watch for shutter dropping too low in dim corners — add light or bump ISO",
          "Not ideal for high-frame-rate slow motion — switch to manual",
          "Pair with auto ISO cap so the camera cannot climb into noisy territory"
        ],
        "images": []
      },
      {
        "id": "camera-shutter-priority",
        "number": "08",
        "tab": "camera",
        "category": "Shooting Modes",
        "title": "Shutter Priority",
        "description": "You set shutter, camera picks aperture. Best when motion look is non-negotiable.",
        "steps": [
          "Lock 1/48 at 24fps for filmic motion on the move",
          "Use for sports and stage when action sharpness beats background blur",
          "Monitor aperture — camera may pin wide open and overexpose in bright scenes",
          "Add ND when aperture hits minimum and image still blows out",
          "Match shutter-priority settings across B-roll operators for consistent feel"
        ],
        "images": []
      },
      {
        "id": "camera-picture-profiles",
        "number": "09",
        "tab": "camera",
        "category": "Shooting Modes",
        "title": "Picture Profiles",
        "description": "In-camera color and gamma curves. Choose based on how much grade work you want.",
        "steps": [
          "S-Log3 / V-Log / C-Log for maximum dynamic range — expose carefully",
          "HLG for fast turnaround HDR delivery without heavy grading",
          "Standard/rec709 for same-day social clips with minimal post",
          "Set black level, knee, and saturation once — save as a custom profile",
          "Never change picture profile mid-interview — match across all angles"
        ],
        "images": []
      },
      {
        "id": "camera-raw-vs-compressed",
        "number": "10",
        "tab": "camera",
        "category": "Shooting Modes",
        "title": "RAW vs Compressed",
        "description": "RAW preserves sensor data. Compressed codecs save space and edit faster.",
        "steps": [
          "RAW / ProRes RAW when client grade budget exists and storage is planned",
          "ProRes 422 HQ for most commercial and doc work — sweet spot of quality and size",
          "H.264/H.265 for long runtimes, livestreams, and backup cams",
          "Calculate card needs before roll — 4K ProRes fills drives fast",
          "Match codec across cams when syncing multicam in Resolve or Premiere"
        ],
        "images": []
      }
    ]
  },
  {
    "id": "camera-camera-movement",
    "tab": "camera",
    "eyebrow": "CAMERA MOVEMENT",
    "title": "Camera Movement",
    "lessons": [
      {
        "id": "camera-handheld",
        "number": "11",
        "tab": "camera",
        "category": "Camera Movement",
        "title": "Handheld",
        "description": "Organic energy. Works for doc, vérité, and grounded narrative.",
        "steps": [
          "Breathe and tuck elbows — become a human steadicam, not a shaky phone",
          "Use wider lenses (24–35mm) — micro-jitter reads less than on telephoto",
          "Enable IBIS or lens OSS; add electronic stabilization only as last resort",
          "Walk heel-to-toe for smoother push-ins — do not bounce on toes",
          "Match handheld energy across the scene — one floaty B-cam breaks immersion"
        ],
        "images": []
      },
      {
        "id": "camera-gimbal",
        "number": "12",
        "tab": "camera",
        "category": "Camera Movement",
        "title": "Gimbal",
        "description": "Smooth floating moves for reveals, walk-and-talk, and product orbit.",
        "steps": [
          "Balance on stand first — save 10 minutes of fighting mid-shoot",
          "Use underslung mode for low hero angles on products and footwear",
          "Walk backward with a spotter — forward-facing gimbal moves read cinematic",
          "Combine slow push with slight parallax — do not just float randomly",
          "Disable in-camera stabilization when on gimbal — let the gimbal do the work"
        ],
        "images": []
      },
      {
        "id": "camera-static",
        "number": "13",
        "tab": "camera",
        "category": "Camera Movement",
        "title": "Static",
        "description": "Locked-off frames signal confidence. Let performance and lighting carry the shot.",
        "steps": [
          "Heavy tripod or c-stand sandbagged — no drift on long interview takes",
          "Use static for dialogue masters and product beauty — cut movement with purpose",
          "Frame for the edit — leave headroom and look space consistent across takes",
          "Record 30 seconds of static room tone and empty frame for transitions",
          "Static does not mean boring — light for depth and let subjects move within frame"
        ],
        "images": []
      },
      {
        "id": "camera-dolly-slider",
        "number": "14",
        "tab": "camera",
        "category": "Camera Movement",
        "title": "Dolly / Slider",
        "description": "Controlled linear motion for reveals, product pushes, and slow tension.",
        "steps": [
          "Level the slider — uneven rails add accidental Dutch and drift",
          "Mark start and end points with tape for repeatable takes",
          "Move slow — 15–30 second pushes feel premium; fast slides feel like B-roll filler",
          "Parallax foreground objects (plants, columns) to sell depth on slider moves",
          "Motorized slider for interviews — consistent speed beats hand-crank wobble"
        ],
        "images": []
      },
      {
        "id": "camera-whip-pan",
        "number": "15",
        "tab": "camera",
        "category": "Camera Movement",
        "title": "Whip Pan",
        "description": "Fast pan blur to hide a cut or jump time. Rhythm tool for montage and music video.",
        "steps": [
          "Start and end on blurred motion — cut on the blur, not on a sharp frame",
          "Use 1/30–1/60 shutter for longer motion streaks during the whip",
          "Match direction and speed in the edit — whip out of scene A, whip into scene B",
          "Practice the same arc three times — pick the cleanest whip for the cut point",
          "Pair with sound whoosh or music hit — audio sells what the eye barely sees"
        ],
        "images": []
      }
    ]
  },
  {
    "id": "framing-foundational-rules",
    "tab": "framing",
    "eyebrow": "FOUNDATIONAL RULES",
    "title": "Foundational Rules",
    "lessons": [
      {
        "id": "framing-rule-of-thirds",
        "number": "16",
        "tab": "framing",
        "category": "Foundational Rules",
        "title": "Rule of Thirds",
        "description": "Place subjects on grid intersections for balance. The default starting point for most frames.",
        "steps": [
          "Enable 3×3 grid on monitor or remote app for live composition",
          "Land eyes on the upper third line for portraits and interviews",
          "Put horizons on upper or lower third — never dead center unless intentional",
          "Off-center subjects create look room — leave space in the direction they face",
          "Break the rule only when symmetry or center-weight demands it"
        ],
        "images": []
      },
      {
        "id": "framing-leading-lines",
        "number": "17",
        "tab": "framing",
        "category": "Foundational Rules",
        "title": "Leading Lines",
        "description": "Use lines in the environment to guide the eye toward your subject.",
        "steps": [
          "Find roads, rails, architecture, and shadows that point to the hero",
          "Lines from bottom corners lead the eye up — strongest entry points",
          "Vanishing points behind the subject add depth and focus",
          "Avoid lines that slice through the head — they compete with the face",
          "Walk the location first — lines change dramatically with a few steps left or right"
        ],
        "images": []
      },
      {
        "id": "framing-symmetry",
        "number": "18",
        "tab": "framing",
        "category": "Foundational Rules",
        "title": "Symmetry",
        "description": "Center your subject for powerful, balanced frames. Formal and intentional.",
        "steps": [
          "Stand on the true centerline — half a step off reads sloppy",
          "Use symmetry for establishing shots, architecture, and brand hero frames",
          "Reflections in water, glass, and mirrors double the impact",
          "Keep verticals straight — enable level indicator on gimbal or hotshoe level",
          "Symmetry plus slow push = high-production feel on minimal budget"
        ],
        "images": []
      },
      {
        "id": "framing-framing-within-frame",
        "number": "19",
        "tab": "framing",
        "category": "Foundational Rules",
        "title": "Framing Within Frame",
        "description": "Use doorways, windows, and arches to focus attention on the subject.",
        "steps": [
          "Shoot through foreground shapes to add depth and context",
          "Partial frames (half a doorway) feel less staged than full box frames",
          "Expose for the subject inside the frame — watch for blown windows behind",
          "Move slightly to align foreground frame with background geometry",
          "Use for transitions — push through the frame into the next scene"
        ],
        "images": []
      },
      {
        "id": "framing-negative-space",
        "number": "20",
        "tab": "framing",
        "category": "Foundational Rules",
        "title": "Negative Space",
        "description": "Empty area around the subject creates mood and breathing room.",
        "steps": [
          "Leave empty sky, wall, or blur behind a small subject for isolation",
          "Negative space works for title cards and end slates in post",
          "Minimalism — remove clutter from frame edges before rolling",
          "Pair with slow movement — static wide with negative space feels art-directed",
          "Social crops: leave center third clean for platform text overlays"
        ],
        "images": []
      }
    ]
  },
  {
    "id": "framing-advanced-composition",
    "tab": "framing",
    "eyebrow": "ADVANCED COMPOSITION",
    "title": "Advanced Composition",
    "lessons": [
      {
        "id": "framing-depth-layers",
        "number": "21",
        "tab": "framing",
        "category": "Advanced Composition",
        "title": "Depth Layers",
        "description": "Foreground, midground, and background create dimension. Focus on layers.",
        "steps": [
          "Place an object in the near foreground — plant, shoulder, bokeh lights",
          "Separate subject from background with distance and shallow depth of field",
          "Rack focus between layers to reveal story beats in sequence",
          "Wide lenses exaggerate foreground — use for immersive environmental portraits",
          "Avoid flat walls directly behind subject — step them forward 3–6 feet minimum"
        ],
        "images": []
      },
      {
        "id": "framing-dutch-angle",
        "number": "22",
        "tab": "framing",
        "category": "Advanced Composition",
        "title": "Dutch Angle",
        "description": "Tilted horizon for tension, unease, or stylized energy.",
        "steps": [
          "Use sparingly — sustained Dutch fatigues the viewer",
          "Match tilt direction to story — clockwise vs counter reads subtly different",
          "Keep faces readable — extreme Dutch on dialogue feels gimmicky",
          "Pair with hard shadows or high contrast for thriller and music video",
          "Return to level horizon before the scene resolves — tilt release signals calm"
        ],
        "images": []
      },
      {
        "id": "framing-high-low-angle",
        "number": "23",
        "tab": "framing",
        "category": "Advanced Composition",
        "title": "High / Low Angle",
        "description": "Camera height changes power dynamics. Eye-level is neutral; above and below shift status.",
        "steps": [
          "Low angle — subject feels powerful, heroic, or imposing",
          "High angle — vulnerability, overview, or diminishment",
          "Eye-level — documentary neutrality and trust for interviews",
          "Change height between coverage — wide low master, eye-level singles",
          "Watch for unflattering chin and nostril angles on low shots — adjust slightly"
        ],
        "images": []
      },
      {
        "id": "framing-wide-vs-tight",
        "number": "24",
        "tab": "framing",
        "category": "Advanced Composition",
        "title": "Wide vs Tight",
        "description": "Lens choice shapes emotion. Wide includes context; tight isolates detail.",
        "steps": [
          "Wide (14–24mm) for environment, action, and establishing geography",
          "Normal (35–50mm) for natural perspective and walk-and-talk",
          "Tight (85–135mm) for intimacy, compression, and face-driven emotion",
          "Cut wide and tight in pairs — context shot then emotion shot",
          "Do not only shoot tight — editors need wide to build sequences"
        ],
        "images": []
      },
      {
        "id": "framing-headroom-nose-room",
        "number": "25",
        "tab": "framing",
        "category": "Advanced Composition",
        "title": "Headroom & Nose Room",
        "description": "Space above the head and in front of the nose. Wrong spacing screams amateur.",
        "steps": [
          "Headroom: small gap above head — more for wide, less for tight",
          "Nose room: space in the direction the subject looks — never clip the look line",
          "Center framing needs equal nose room unless subject looks off-camera",
          "Mark floor tape for interview positions so reframes stay consistent",
          "Reframe for vertical delivery — headroom rules change in 9:16"
        ],
        "images": []
      }
    ]
  },
  {
    "id": "framing-shot-types",
    "tab": "framing",
    "eyebrow": "SHOT TYPES",
    "title": "Shot Types",
    "lessons": [
      {
        "id": "framing-ews",
        "number": "26",
        "tab": "framing",
        "category": "Shot Types",
        "title": "Extreme Wide Shot (EWS)",
        "description": "Subject small in vast environment. Sets scale and isolation.",
        "steps": [
          "Use as scene opener or emotional beat — character lost in the world",
          "Keep subject identifiable — silhouette or wardrobe color against landscape",
          "Lock exposure for sky and land — graduated ND helps at golden hour",
          "Hold 5–8 seconds minimum — editors need trim room",
          "Shoot one EWS per location even if script does not call for it — saves the edit"
        ],
        "images": []
      },
      {
        "id": "framing-ws",
        "number": "27",
        "tab": "framing",
        "category": "Shot Types",
        "title": "Wide Shot (WS)",
        "description": "Full body plus environment. Shows geography and blocking.",
        "steps": [
          "Frame head to toe with room above and below for title safe",
          "Wide masters anchor dialogue scenes — cut to tighter coverage from here",
          "Keep verticals straight on architectural wides",
          "Record blocking rehearsals on wide — unexpected moments happen here",
          "Match lens and height across takes for continuity"
        ],
        "images": []
      },
      {
        "id": "framing-ms",
        "number": "28",
        "tab": "framing",
        "category": "Shot Types",
        "title": "Medium Shot (MS)",
        "description": "Waist up or knees up. Workhorse for dialogue and presentation.",
        "steps": [
          "Standard interview frame — mid-chest to top of head with look room",
          "Hands visible when subject gestures — do not crop at joints",
          "MS coverage cuts cleanly with CU and WS — shoot all three per setup",
          "Leave space for lower-thirds if client uses graphics",
          "Two-shot MS for conversations — both faces readable, one plane of focus"
        ],
        "images": []
      },
      {
        "id": "framing-cu",
        "number": "29",
        "tab": "framing",
        "category": "Shot Types",
        "title": "Close-Up (CU)",
        "description": "Face fills frame. Emotion and connection land here.",
        "steps": [
          "Eyes on upper third — sharpest focus on nearest eye",
          "85–135mm equivalent flatters facial proportions vs wide distortion",
          "Watch for nose breaking the cheek line — slight turn fixes profile",
          "CU after WS gives editors an emotional punctuation mark",
          "Shoot CU on every interview subject even if they only appear once"
        ],
        "images": []
      },
      {
        "id": "framing-ecu",
        "number": "30",
        "tab": "framing",
        "category": "Shot Types",
        "title": "Extreme Close-Up (ECU)",
        "description": "Eyes, hands, product detail. High impact in montage and ads.",
        "steps": [
          "Macro or minimum focus distance — tripod mandatory",
          "ECU of hands sells craft, cooking, and product interaction",
          "Eye ECU for tension — hold focus on iris, let lashes go soft",
          "Use for hook shots in the first 2 seconds of social content",
          "Light flat for detail — one soft source at 45° reduces harsh pores on skin ECU"
        ],
        "images": []
      }
    ]
  },
  {
    "id": "lighting-lighting-basics",
    "tab": "lighting",
    "eyebrow": "LIGHTING BASICS",
    "title": "Lighting Basics",
    "lessons": [
      {
        "id": "lighting-three-point",
        "number": "31",
        "tab": "lighting",
        "category": "Lighting Basics",
        "title": "Three-Point Lighting",
        "description": "Key, fill, and rim. The foundation for interviews and portraits.",
        "steps": [
          "Key at 30–45° off camera, slightly above eye level",
          "Fill at 1/2 to 1/4 key intensity — soft source or bounce",
          "Rim/hair light separates subject from background — watch for lens flare",
          "Flag the key to control spill on background",
          "Meter face at consistent level — do not chase auto exposure between setups"
        ],
        "images": []
      },
      {
        "id": "lighting-natural-light",
        "number": "32",
        "tab": "lighting",
        "category": "Lighting Basics",
        "title": "Natural Light",
        "description": "Window light is free soft key. Time of day and direction matter.",
        "steps": [
          "North-facing windows give softest daylight through the day",
          "Hang diffusion on direct sun — 4×4 silk or even a white sheet",
          "Reflectors bounce fill into shadow side — silver for punch, white for soft",
          "Golden hour for warm rim; overcast for giant soft box outdoors",
          "Scout at the same time of day as your shoot — sun angle moves fast"
        ],
        "images": []
      },
      {
        "id": "lighting-hard-vs-soft",
        "number": "33",
        "tab": "lighting",
        "category": "Lighting Basics",
        "title": "Hard vs Soft Light",
        "description": "Source size relative to subject controls shadow edge.",
        "steps": [
          "Hard light — small source, defined shadows, drama and texture",
          "Soft light — large source close to subject, gradual shadow roll-off",
          "Bigger softbox closer = softer than small softbox far away",
          "Mix hard rim with soft key for commercial pop on dark backgrounds",
          "Hard light on textured surfaces (brick, skin stubble) — soft for beauty"
        ],
        "images": []
      },
      {
        "id": "lighting-color-temp",
        "number": "34",
        "tab": "lighting",
        "category": "Lighting Basics",
        "title": "Color Temperature",
        "description": "Match or contrast Kelvin for mood. Mixed light needs a plan.",
        "steps": [
          "Tungsten 3200K warm, daylight 5600K neutral, shade 7000K+ blue",
          "Gel windows to 3200K when shooting tungsten interior for clean grade",
          "Creative contrast: warm key + cool rim reads cinematic on skin",
          "White balance to your dominant source — fix minor mismatches in post",
          "Note gel and bulb types on call sheet for the colorist"
        ],
        "images": []
      },
      {
        "id": "lighting-practical-lights",
        "number": "35",
        "tab": "lighting",
        "category": "Lighting Basics",
        "title": "Practical Lights",
        "description": "Visible lamps in frame motivate your lighting and add depth.",
        "steps": [
          "Swap bulbs to matching Kelvin — avoid mixed LED and tungsten in one lamp",
          "Dim practicals on a dimmer or lower-wattage bulb so key still controls exposure",
          "Let practicals blow slightly for night interior realism",
          "Hide small LED panels behind practical shades to boost output",
          "Motivate every added light from something visible or implied in frame"
        ],
        "images": []
      }
    ]
  },
  {
    "id": "lighting-lighting-setups",
    "tab": "lighting",
    "eyebrow": "LIGHTING SETUPS",
    "title": "Lighting Setups",
    "lessons": [
      {
        "id": "lighting-interview-setup",
        "number": "36",
        "tab": "lighting",
        "category": "Lighting Setups",
        "title": "Interview Setup",
        "description": "Clean, flattering, fast to deploy. Standard for doc and corporate.",
        "steps": [
          "Key through 4×4 diffusion 45° camera-left or right of subject",
          "Fill via bounce card or second soft source at lower intensity",
          "Hair/rim from behind opposite the key — flag lens flare",
          "Background light one stop under key — separation without competition",
          "Subject 3–4 feet off wall minimum to drop background out of focus"
        ],
        "images": []
      },
      {
        "id": "lighting-portrait-setup",
        "number": "37",
        "tab": "lighting",
        "category": "Lighting Setups",
        "title": "Portrait Setup",
        "description": "Sculpt face with contrast. Hero stills and thumbnail frames.",
        "steps": [
          "One main light and one negative fill (black flag) for dramatic falloff",
          "Rembrandt or loop pattern depending on face shape — see Advanced Lighting",
          "V-flat black on shadow side deepens contrast without second light",
          "Catchlight in both eyes — adjust key height until you see it",
          "Shoot burst of expressions after lighting is locked — do not relight mid-session"
        ],
        "images": []
      },
      {
        "id": "lighting-cinematic-setup",
        "number": "38",
        "tab": "lighting",
        "category": "Lighting Setups",
        "title": "Cinematic Setup",
        "description": "Motivated, layered, contrasty. Narrative and brand film.",
        "steps": [
          "3200K key with 12000K cool rim for classic warm/cool separation",
          "Smoke or haze to catch rim beams — do not over-haze on 4K sensors",
          "Practicals in background at 20–30% of key level",
          "Ceiling bounce for soft ambient base, then shape with flags",
          "Shoot dark and protect highlights — lift shadows in grade"
        ],
        "images": []
      },
      {
        "id": "lighting-low-budget-setup",
        "number": "39",
        "tab": "lighting",
        "category": "Lighting Setups",
        "title": "Low Budget Setup",
        "description": "One light, one bounce, one flag. Still looks pro with placement.",
        "steps": [
          "Window or single LED through diffusion as key",
          "White foam core as fill opposite key",
          "Black cardboard as negative fill to add contrast when room is too flat",
          "Reposition subject not lights when possible — saves time",
          "Shoot during golden hour outdoors — sun is your free rim"
        ],
        "images": []
      },
      {
        "id": "lighting-outdoor-setup",
        "number": "40",
        "tab": "lighting",
        "category": "Lighting Setups",
        "title": "Outdoor Setup",
        "description": "Sun as key or rim. ND, diffusion, and reflectors are mandatory.",
        "steps": [
          "Backlight subject with sun, fill face with reflector or strobe",
          "Open shade for even corporate interviews — avoid dappled tree shadow",
          "ND filters to keep shutter and aperture in cinematic range",
          "Scrim overhead in harsh midday — sun directly on forehead is unflattering",
          "Monitor skin exposure with false color — sky lies to your eye"
        ],
        "images": []
      }
    ]
  },
  {
    "id": "lighting-advanced-lighting",
    "tab": "lighting",
    "eyebrow": "ADVANCED LIGHTING",
    "title": "Advanced Lighting",
    "lessons": [
      {
        "id": "lighting-rembrandt",
        "number": "41",
        "tab": "lighting",
        "category": "Advanced Lighting",
        "title": "Rembrandt",
        "description": "Triangle of light on shadow cheek. Classic portrait pattern.",
        "steps": [
          "Key 45° side and slightly above — triangle appears on far cheek",
          "Shadow nose line points toward cheek but does not cross it",
          "Works on most face shapes — adjust key height for deep-set eyes",
          "Add subtle fill to keep triangle visible but shadow side not dead black",
          "Flag key spill from background to keep contrast clean"
        ],
        "images": []
      },
      {
        "id": "lighting-butterfly",
        "number": "42",
        "tab": "lighting",
        "category": "Advanced Lighting",
        "title": "Butterfly",
        "description": "Key centered above camera. Symmetrical shadow under nose.",
        "steps": [
          "Place key directly above lens on boom or c-stand arm",
          "Butterfly shadow under nose — adjust height to shorten or lengthen shadow",
          "Fill from below bounce card to soften under-eye shadows",
          "Beauty and fashion standard — skin looks smooth and even",
          "Use on symmetrical faces and product beauty top-down shots"
        ],
        "images": []
      },
      {
        "id": "lighting-split-light",
        "number": "43",
        "tab": "lighting",
        "category": "Advanced Lighting",
        "title": "Split Light",
        "description": "Half face lit, half in shadow. Drama and duality.",
        "steps": [
          "Key at 90° to subject — light hits one side only",
          "No fill or minimal fill — commit to the shadow half",
          "Use for villain beats, music video, and high-contrast brand spots",
          "Meter lit side for exposure — let shadow side fall where it falls",
          "Eye closest to camera should usually be on lit side for connection"
        ],
        "images": []
      },
      {
        "id": "lighting-backlight-silhouette",
        "number": "44",
        "tab": "lighting",
        "category": "Advanced Lighting",
        "title": "Backlight / Silhouette",
        "description": "Expose for background, subject goes dark. Shape and mystery.",
        "steps": [
          "Meter sky or background — subject becomes silhouette",
          "Clean profile or full-body shape readable — wardrobe matters",
          "Haze or dust in backlight beams adds texture",
          "Rim-only variants: expose for skin edge, face slightly under",
          "Cut silhouette on action or music hit — pair with sound design"
        ],
        "images": []
      },
      {
        "id": "lighting-practical-motivated",
        "number": "45",
        "tab": "lighting",
        "category": "Advanced Lighting",
        "title": "Practical Motivated",
        "description": "Every light source has a reason in the scene. Believable interiors.",
        "steps": [
          "Place LED mats behind lampshades to boost practical output",
          "Color match bulb in frame to your hidden sources",
          "Dim room ambient, boost motivated pools — eyes go where light is",
          "Block stray ceiling light with flags — control spill",
          "Walk the set with lights off — if it does not make sense, re-motivate"
        ],
        "images": []
      }
    ]
  },
  {
    "id": "editing-getting-started",
    "tab": "editing",
    "eyebrow": "GETTING STARTED",
    "title": "Getting Started",
    "lessons": [
      {
        "id": "editing-resolve-interface",
        "number": "46",
        "tab": "editing",
        "category": "Getting Started",
        "title": "Interface",
        "description": "Pages: Media, Cut, Edit, Fusion, Color, Fairlight, Deliver. Learn the flow left to right.",
        "steps": [
          "Set Edit as default page for assembly — Color and Fairlight come later",
          "Workspace → Primary for single monitor; Post for dual-screen",
          "Media pool: create bins by scene, camera, or day — not one giant folder",
          "Use Ctrl/Cmd+S constantly — Resolve autosaves but projects corrupt less when you save",
          "Keyboard mapping: J-K-L playback, I/O in-out, V select — learn 10 shortcuts first week"
        ],
        "images": []
      },
      {
        "id": "editing-project-setup",
        "number": "47",
        "tab": "editing",
        "category": "Getting Started",
        "title": "Project Setup",
        "description": "Timeline frame rate and resolution locked at start. Wrong settings waste hours.",
        "steps": [
          "File → Project Settings → match delivery spec (24fps, 3840×2160, etc.)",
          "Color management: DaVinci YRGB Color Managed for LOG workflows",
          "Input LUT on LOG footage at source level — not baked on every clip individually",
          "Scratch disk on fast SSD — never edit 4K off a nearly full drive",
          "Name project Client_Job_Date — version exports, not project duplicates"
        ],
        "images": []
      },
      {
        "id": "editing-importing",
        "number": "48",
        "tab": "editing",
        "category": "Getting Started",
        "title": "Importing",
        "description": "Relinkable, organized media. Proxy for heavy 4K/6K on laptops.",
        "steps": [
          "Import via Media page — check Copy vs Leave in place based on backup plan",
          "Generate optimized media or proxies for 6K RAW on M-series MacBooks",
          "Sync audio by timecode or waveform — plural eyes saves multicam sync",
          "Label clips: Scene_Take_Camera in metadata for search",
          "Verify frame rate on every clip — mixed fps causes drift in long timelines"
        ],
        "images": []
      },
      {
        "id": "editing-basic-cut",
        "number": "49",
        "tab": "editing",
        "category": "Getting Started",
        "title": "Basic Cut",
        "description": "Assembly is about story flow, not polish. Rough cut fast, refine later.",
        "steps": [
          "String out selects on timeline in story order before fine trimming",
          "Blade tool (B) at playhead — trim with select tool (A) and roll (N)",
          "Cut on action — hand reaches, door opens, head turn hides the edit",
          "Remove ums in interview by cutting on B-roll or slight push-in duplicate",
          "Watch full pass without stopping — note pacing issues on paper, fix in pass two"
        ],
        "images": []
      }
    ]
  },
  {
    "id": "editing-color-grading",
    "tab": "editing",
    "eyebrow": "COLOR GRADING",
    "title": "Color Grading",
    "lessons": [
      {
        "id": "editing-color-wheels",
        "number": "50",
        "tab": "editing",
        "category": "Color Grading",
        "title": "Color Wheels",
        "description": "Lift, gamma, gain control shadows, mids, highlights separately.",
        "steps": [
          "Balance exposure first — wheels add color, not fix blown highlights",
          "Small moves — 2–3 points on wheel reads big on LOG footage",
          "Lift adds blue in shadows for cinematic cool — do not magenta skin",
          "Use log wheels on LOG; primary wheels after contrast stretch",
          "Reset node before chasing a grade — start clean each time"
        ],
        "images": []
      },
      {
        "id": "editing-curves",
        "number": "51",
        "tab": "editing",
        "category": "Color Grading",
        "title": "Curves",
        "description": "Precise tonal control. Custom curves separate midtones for film contrast.",
        "steps": [
          "Open Curves — Custom. Anchor black and white points first",
          "Pull shadow point below diagonal, lift highlight point above for S-curve",
          "4th point curves: separate midtones without crushing blacks",
          "Hue vs Hue for secondary fixes — orange skin drift, green foliage",
          "Compare still (Ctrl/Cmd+D) every few moves — eyes adapt fast"
        ],
        "images": []
      },
      {
        "id": "editing-log-workflow",
        "number": "52",
        "tab": "editing",
        "category": "Color Grading",
        "title": "LOG Grading",
        "description": "Flat LOG needs contrast and saturation in controlled steps.",
        "steps": [
          "Input transform: correct camera LOG to working space",
          "Exposure normalize node first — consistent starting point across clips",
          "Creative look on second node — never fix exposure on look node",
          "Saturation last — LOG oversaturates quickly on skin",
          "Match hero shot first, then match entire scene to hero"
        ],
        "images": []
      },
      {
        "id": "editing-luts",
        "number": "53",
        "tab": "editing",
        "category": "Color Grading",
        "title": "LUTs",
        "description": "Look-Up Tables for speed. Creative LUT after balance, not before.",
        "steps": [
          "Technical LUT converts LOG to rec709 — creative LUT adds style",
          "Apply LUT at 50–70% opacity when possible — full strength rarely flatters skin",
          "Build show LUT from hero grade — export .cube for series consistency",
          "Never LUT before white balance is correct — fixes get baked wrong",
          "Client preview LUT on set — align expectations before shoot wraps"
        ],
        "images": []
      },
      {
        "id": "editing-skin-tone",
        "number": "54",
        "tab": "editing",
        "category": "Color Grading",
        "title": "Skin Tone",
        "description": "Isolate skin then compress hue. Vectorscope skin line is your guide.",
        "steps": [
          "Qualifier node: isolate skin HSL — refine with blur and clean up",
          "Add Color Compressor downstream — align trace to skin tone line",
          "Subtle saturation — protect highlights on forehead and nose",
          "Fix red ears and hands in wide shots with power window tracked grade",
          "Match skin across cameras before matching environment"
        ],
        "images": []
      },
      {
        "id": "editing-scopes",
        "number": "55",
        "tab": "editing",
        "category": "Color Grading",
        "title": "Scopes",
        "description": "Waveform, parade, vectorscope — trust scopes over your monitor.",
        "steps": [
          "Waveform: skin sits ~50–70 IRE on rec709; lower on LOG before transform",
          "Parade: balanced RGB on neutrals — color cast shows as separation",
          "Vectorscope: skin tone line yellow-red axis — keep trace on the line",
          "Histogram alone lies on LOG — use waveform for exposure",
          "Calibrate monitor annually — scopes do not lie, panels do"
        ],
        "images": []
      },
      {
        "id": "editing-nodes",
        "number": "56",
        "tab": "editing",
        "category": "Color Grading",
        "title": "Nodes",
        "description": "Structured grades: prep → look → skin. Node tree beats one giant node.",
        "steps": [
          "Node 1: input transform and exposure normalize",
          "Node 2: spatial NR if needed — before creative grade",
          "Node 3: creative look — film contrast, palette",
          "Node 4: skin isolation and polish",
          "Node 5: power windows for background and sky — track when subject moves"
        ],
        "images": []
      },
      {
        "id": "editing-match-cut-grade",
        "number": "57",
        "tab": "editing",
        "category": "Color Grading",
        "title": "Match Cut Grade",
        "description": "Two shots same action/light — grade must match for invisible edit.",
        "steps": [
          "Split screen stills of both shots in gallery",
          "Match luminance first, then color balance, then saturation",
          "Use Color Trace or manual wheel matching on shared neutral gray",
          "Match skin before background — eye reads face first",
          "Export reference still from hero — grade B-shot to A-shot, not middle ground"
        ],
        "images": []
      }
    ]
  },
  {
    "id": "editing-transitions-effects",
    "tab": "editing",
    "eyebrow": "TRANSITIONS & EFFECTS",
    "title": "Transitions & Effects",
    "lessons": [
      {
        "id": "editing-hard-cut",
        "number": "58",
        "tab": "editing",
        "category": "Transitions & Effects",
        "title": "Hard Cut",
        "description": "Default transition. Invisible when performance and composition align.",
        "steps": [
          "Cut on movement — fastest edit hides in motion blur",
          "Match eyeline and screen direction across cut",
          "Audio lead-in (J-cut) smooths hard video cuts",
          "Avoid cutting mid-blink unless comedic — blink midpoints feel like mistakes",
          "Hard cut to music downbeat — video rhythm follows audio"
        ],
        "images": []
      },
      {
        "id": "editing-match-cut-transition",
        "number": "59",
        "tab": "editing",
        "category": "Transitions & Effects",
        "title": "Match Cut",
        "description": "Shape, color, or motion links two different scenes.",
        "steps": [
          "Find similar geometry between shots — circle to circle, line to line",
          "Pre-plan on set — match size and position in frame for object match cuts",
          "Color match two unrelated scenes by grade before the cut",
          "Motion match: subject exits frame right, new subject enters frame right",
          "Hold match cut 12–24 frames — too fast and audience misses the link"
        ],
        "images": []
      },
      {
        "id": "editing-dissolve",
        "number": "60",
        "tab": "editing",
        "category": "Transitions & Effects",
        "title": "Dissolve",
        "description": "Time passage, dream state, or gentle scene change.",
        "steps": [
          "Standard dissolve 12–24 frames — longer feels dated unless intentional",
          "Dissolve over black for act breaks and time jumps",
          "Cross-dissolve dialogue only when same space, different time",
          "Avoid dissolve when hard cut energy is needed — action sequences want cuts",
          "Sound bridge under dissolve sells the transition"
        ],
        "images": []
      },
      {
        "id": "editing-whip-pan-transition",
        "number": "61",
        "tab": "editing",
        "category": "Transitions & Effects",
        "title": "Whip Pan Transition",
        "description": "Blur connects two shots. Shoot whips on set or add directional blur in post.",
        "steps": [
          "Shoot whip out and whip in at same speed and direction on set",
          "Cut at peak blur — neither frame should be sharp at the edit point",
          "Post alternative: directional blur 2–4 frames each side of cut",
          "Sync to whoosh SFX or music transient",
          "Use max 2–3 per minute — overuse feels like a template"
        ],
        "images": []
      },
      {
        "id": "editing-jl-cut",
        "number": "62",
        "tab": "editing",
        "category": "Transitions & Effects",
        "title": "J / L Cut",
        "description": "Audio and video cut at different times. Dialogue scenes feel natural.",
        "steps": [
          "L-cut: hear next scene before you see it — builds anticipation",
          "J-cut: see next scene while previous audio finishes — smooth exit",
          "Unlink audio (Alt/Opt+Shift+K) and extend audio under B-roll",
          "Interview gold: question on camera, answer over B-roll of subject working",
          "Do not J/L every line — pattern becomes noticeable"
        ],
        "images": []
      },
      {
        "id": "editing-hand-draw-overlay",
        "number": "63",
        "tab": "editing",
        "category": "Transitions & Effects",
        "title": "Hand-Draw Overlay",
        "description": "Fusion or external graphics for arrows, circles, and sketch emphasis.",
        "steps": [
          "Fusion: white stroke with slight wobble — avoid perfect vector lines for hand-drawn feel",
          "Animate draw-on with stroke reveal or write-on effect",
          "Use for tutorial and explainer — not on every corporate frame",
          "Match line weight to platform — thicker for mobile 9:16",
          "Export with alpha for editor flexibility in Cut page"
        ],
        "images": []
      }
    ]
  },
  {
    "id": "editing-audio",
    "tab": "editing",
    "eyebrow": "AUDIO",
    "title": "Audio",
    "lessons": [
      {
        "id": "editing-fairlight",
        "number": "64",
        "tab": "editing",
        "category": "Audio",
        "title": "Fairlight",
        "description": "Resolve audio page. Levels, EQ, compression, and mix delivery.",
        "steps": [
          "Normalize dialogue to -18 to -14 LUFS integrated for web",
          "High-pass at 80–100Hz on lavs — remove rumble and handling noise",
          "Light compression 3:1 on dialogue — 2–3dB gain reduction max",
          "Music under dialogue — duck 6–10dB automatically with sidechain if needed",
          "Final limiter on master bus — true peak -1dB for streaming platforms"
        ],
        "images": []
      },
      {
        "id": "editing-music-licensing",
        "number": "65",
        "tab": "editing",
        "category": "Audio",
        "title": "Music Licensing",
        "description": "Cleartext rights before publish. Client projects need documented licenses.",
        "steps": [
          "Stock libraries: check broadcast vs social scope in license tier",
          "Artlist, Epidemic, Musicbed — save license PDF per track in project folder",
          "No commercial Top 40 without sync license — platforms will strike",
          "Custom score: work-for-hire agreement in writing before delivery",
          "Credit requirements in license — add to description if required"
        ],
        "images": []
      },
      {
        "id": "editing-sound-design",
        "number": "66",
        "tab": "editing",
        "category": "Audio",
        "title": "Sound Design",
        "description": "Layered whooshes, impacts, and ambience sell edits that footage alone cannot.",
        "steps": [
          "Build SFX library folder — whoosh, impact, riser, room tone categories",
          "One subtle whoosh per whip pan or logo reveal — not every cut",
          "Layer 2–3 impacts for trailer hits — low thump + mid crack + high transient",
          "Room tone under every scene — 30s minimum recorded on set fills gaps",
          "Mix SFX 3–6dB under dialogue — felt not heard"
        ],
        "images": []
      },
      {
        "id": "editing-dialogue-cleanup",
        "number": "67",
        "tab": "editing",
        "category": "Audio",
        "title": "Dialogue Cleanup",
        "description": "Fix location audio before client hears it. Noise reduction is not optional.",
        "steps": [
          "RX or Fairlight noise reduction — learn profile from room tone snippet",
          "De-plosive and de-ess lightly — over-processing sounds robotic",
          "Manual cut breaths if distracting — do not remove all breath (uncanny)",
          "Align multicam audio to single master lav in timeline",
          "Always keep original audio tracks muted but unprocessed for backup"
        ],
        "images": []
      }
    ]
  },
  {
    "id": "editing-export-delivery",
    "tab": "editing",
    "eyebrow": "EXPORT & DELIVERY",
    "title": "Export & Delivery",
    "lessons": [
      {
        "id": "editing-export-social",
        "number": "68",
        "tab": "editing",
        "category": "Export & Delivery",
        "title": "IG / TikTok Export",
        "description": "9:16, loud enough for phone speakers, captions burned or sidecar.",
        "steps": [
          "Timeline 1080×1920 — reframe in separate timeline, do not stretch 16:9",
          "H.264 or H.265, 10–15 Mbps for 1080×1920 — quality vs upload speed",
          "Audio -14 LUFS, true peak -1dB — phones normalize loud anyway",
          "Safe zone: keep text and faces inside center 80% — UI overlays edges",
          "Export filename: Client_Platform_Date_v01 — version every upload"
        ],
        "images": []
      },
      {
        "id": "editing-export-youtube",
        "number": "69",
        "tab": "editing",
        "category": "Export & Delivery",
        "title": "YouTube Export",
        "description": "16:9, high bitrate, chapter markers in description if long-form.",
        "steps": [
          "4K upload when source is 4K — YouTube re-encodes generously at 4K tier",
          "H.264 high profile or H.265 for smaller files at same quality",
          "Recommended 35–45 Mbps for 4K30, 50–68 for 4K60",
          "Rec709 color tag on export — avoid untagged files",
          "Thumbnail frame export at 1280×720 from grade-final timeline"
        ],
        "images": []
      },
      {
        "id": "editing-export-client",
        "number": "70",
        "tab": "editing",
        "category": "Export & Delivery",
        "title": "Client Delivery",
        "description": "ProRes master + H.264 proxy. Spec sheet in writing before edit starts.",
        "steps": [
          "Ask deliverable spec upfront — codec, resolution, fps, aspect ratios",
          "ProRes 422 HQ master for archive and re-export",
          "H.264 high review file with timecode burn-in optional",
          "Separate stems: dialogue, music, SFX if client requests",
          "Delivery letter with checksum or frame count confirmation for long-form"
        ],
        "images": []
      },
      {
        "id": "editing-export-archive",
        "number": "71",
        "tab": "editing",
        "category": "Export & Delivery",
        "title": "Archive",
        "description": "Project + media + grade stills. Future-you needs to reopen in 2 years.",
        "steps": [
          "Archive timeline: flat video + separate audio + XML/DRP project",
          "Folder structure: Project/Media/Exports/Licenses/Documents",
          "Export grade stills and node stills for match reference",
          "Document LUTs, fonts, and plugins used — note version numbers",
          "Cold storage copy on second drive — one drive is not backup"
        ],
        "images": []
      }
    ]
  },
  {
    "id": "strategy-platform-mastery",
    "tab": "strategy",
    "eyebrow": "PLATFORM MASTERY",
    "title": "Platform Mastery",
    "lessons": [
      {
        "id": "strategy-reels",
        "number": "72",
        "tab": "strategy",
        "category": "Platform Mastery",
        "title": "Reels",
        "description": "First 1.5 seconds decide the scroll. Motion beats static every time.",
        "steps": [
          "Hook in frame one — face, action, or bold text before user swipes",
          "Vertical native 9:16 — crop in camera, not in post stretch",
          "Captions on-screen — 85% watch muted",
          "15–30s sweet spot for completion rate on most accounts",
          "Post when audience is active — check insights, not generic best-time lists"
        ],
        "images": []
      },
      {
        "id": "strategy-tiktok",
        "number": "73",
        "tab": "strategy",
        "category": "Platform Mastery",
        "title": "TikTok",
        "description": "Native feel beats polished ads. Loop-friendly endings boost rewatches.",
        "steps": [
          "Shoot lo-fi aesthetic when brand allows — over-produced reads as ad",
          "End frame matches start for seamless loop — algorithm rewards rewatches",
          "Trending audio within niche — speed matters, stale trends hurt reach",
          "Reply to comments with video — doubles content and boosts engagement signals",
          "Hook text overlay in first 0.5s — state the payoff immediately"
        ],
        "images": []
      },
      {
        "id": "strategy-youtube",
        "number": "74",
        "tab": "strategy",
        "category": "Platform Mastery",
        "title": "YouTube",
        "description": "Thumbnail and title are half the job. Retention graph tells the truth.",
        "steps": [
          "Title promise must appear in first 30 seconds of video",
          "Pattern interrupt every 30–45s — B-roll, graphic, angle change",
          "Chapters for 8min+ — improves session time and search snippets",
          "End screen last 20s — one clear CTA, not three competing links",
          "A/B test thumbnails before wide push — swap if CTR under 4% after 48hr"
        ],
        "images": []
      },
      {
        "id": "strategy-linkedin",
        "number": "75",
        "tab": "strategy",
        "category": "Platform Mastery",
        "title": "LinkedIn",
        "description": "Professional context. Lead with insight, not flex.",
        "steps": [
          "First line is the hook — above the fold before see more",
          "Native video autoplays muted — burned captions required",
          "Square or vertical both work — test with your audience",
          "Document carousels for frameworks — export PDF slides from toolkit content",
          "Comment on posts in your niche within 30min of publish — early engagement lifts reach"
        ],
        "images": []
      }
    ]
  },
  {
    "id": "strategy-creator-business",
    "tab": "strategy",
    "eyebrow": "CREATOR BUSINESS",
    "title": "Creator Business",
    "lessons": [
      {
        "id": "strategy-pricing",
        "number": "76",
        "tab": "strategy",
        "category": "Creator Business",
        "title": "Pricing",
        "description": "Day rate + usage + rush. Never quote without scope written down.",
        "steps": [
          "Calculate day rate: expenses + desired salary ÷ billable shoot days",
          "License usage separately — web, broadcast, perpetuity tiers",
          "Rush under 48hr: +25%. Weekend/holiday: +50% minimum",
          "Deposit 50% before pre-pro — balance on delivery of rough cut",
          "Say no to unlimited revisions — cap at 2 rounds in contract"
        ],
        "images": []
      },
      {
        "id": "strategy-client-communication",
        "number": "77",
        "tab": "strategy",
        "category": "Creator Business",
        "title": "Client Communication",
        "description": "Over-communicate schedule and deliverables. Surprises kill relationships.",
        "steps": [
          "Send one-page scope: dates, deliverables, revision rounds, payment schedule",
          "Daily wrap email on multi-day shoots — what was got, what is next",
          "Show rough cut before polish — align story before color and mix",
          "Bad news early — delay on set day one, not on delivery day",
          "Document approval in writing — email OK on version X is your shield"
        ],
        "images": []
      },
      {
        "id": "strategy-portfolio",
        "number": "78",
        "tab": "strategy",
        "category": "Creator Business",
        "title": "Portfolio",
        "description": "Lead with the frame. Let quality earn the scroll-stop.",
        "steps": [
          "60–90 second reel max — best work only, no filler",
          "Open with strongest 3 seconds — logo stings waste hook real estate",
          "Case study pages: problem, approach, result metric if allowed",
          "Update quarterly — stale portfolio signals stale skills",
          "Host on fast CDN — hiring producers will not wait for slow loads"
        ],
        "images": []
      },
      {
        "id": "strategy-niche-vs-identity",
        "number": "79",
        "tab": "strategy",
        "category": "Creator Business",
        "title": "Niche vs Identity",
        "description": "Niche is what you shoot. Identity is how you see. Both matter.",
        "steps": [
          "Niche gets you found — weddings, doc, automotive, food",
          "Identity gets you remembered — color, pacing, sound, camera language",
          "Do not trap in niche so hard you cannot pivot — show range in BTS",
          "Tools change. Taste and intention stay — build identity on decisions not gear",
          "One sentence positioning: I help [who] tell [what] through [your lens]"
        ],
        "images": []
      }
    ]
  },
  {
    "id": "strategy-content-systems",
    "tab": "strategy",
    "eyebrow": "CONTENT SYSTEMS",
    "title": "Content Systems",
    "lessons": [
      {
        "id": "strategy-batch-shooting",
        "number": "80",
        "tab": "strategy",
        "category": "Content Systems",
        "title": "Batch Shooting",
        "description": "Multiple pieces of content in one session. Efficiency without quality drop.",
        "steps": [
          "Plan 4–6 hooks before shoot day — one setup, multiple openers",
          "Wardrobe change or jacket off = new video without new location",
          "Batch B-roll for month of posts during one golden-hour session",
          "Same lighting setup — swap subject or product between takes",
          "Log every take in notes app — hook A take 3, hook B take 1 for edit"
        ],
        "images": []
      },
      {
        "id": "strategy-hook-formula",
        "number": "81",
        "tab": "strategy",
        "category": "Content Systems",
        "title": "Hook Formula",
        "description": "Problem + promise in 2 seconds. Viewer must know why to keep watching.",
        "steps": [
          "Pattern: You are [problem]. Here is [promise]. — text and voice",
          "Visual hook parallel — show result first, then rewind to how",
          "Controversy hook sparingly — must deliver value or trust erodes",
          "Write 10 hooks per video idea — pick best 2 to shoot",
          "First frame has a face or moving object — static wide opens die"
        ],
        "images": []
      },
      {
        "id": "strategy-repurposing",
        "number": "82",
        "tab": "strategy",
        "category": "Content Systems",
        "title": "Repurposing",
        "description": "One shoot, many formats. Master vertical, derive horizontal and audio.",
        "steps": [
          "Master timeline 16:9 — punch-in reframes for 9:16 and 1:1",
          "Pull 30–60s vertical cuts for Reels/TikTok from long-form",
          "Audio-only clip for podcast feed from interview master",
          "Stills export at 4K for carousel and thumbnail bank",
          "Quote cards from strongest line — design template once, reuse"
        ],
        "images": []
      },
      {
        "id": "strategy-content-calendar",
        "number": "83",
        "tab": "strategy",
        "category": "Content Systems",
        "title": "Content Calendar",
        "description": "Planned beats beat random posting. Batch create, schedule release.",
        "steps": [
          "Monthly themes aligned to client campaigns or your funnel stage",
          "Tool: Notion, Airtable, or spreadsheet — platform, hook, status, post date",
          "Buffer 2 weeks of scheduled posts — never post day-of shoot only",
          "Review analytics monthly — double down on top 20% formats",
          "Leave 20% slots for timely trends — rigid calendar misses moments"
        ],
        "images": []
      }
    ]
  }
];

export const toolkitLessons: ToolkitLesson[] = toolkitCategories.flatMap((c) =>
  c.lessons.map((l) => ({ ...l, saved: false })),
);

export function getLessonsByTab(tab: ToolkitTab): ToolkitLesson[] {
  return toolkitLessons.filter((l) => l.tab === tab);
}

export function getCategoriesByTab(tab: ToolkitTab): ToolkitCategory[] {
  return toolkitCategories.filter((c) => c.tab === tab);
}

export function getLessonById(id: string): ToolkitLesson | undefined {
  return toolkitLessons.find((l) => l.id === id);
}

export const lessonCountByTab: Record<ToolkitTab, number> = {
  "camera": 15,
  "framing": 15,
  "lighting": 15,
  "editing": 26,
  "strategy": 12
};
