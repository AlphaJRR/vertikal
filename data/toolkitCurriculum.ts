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
        "category": "CAMERA BASICS",
        "title": "ISO & Noise",
        "type": "html_presentation",
        "description": "ISO increases sensor sensitivity but adds noise.",
        "guide": "Use the lowest ISO possible. Noise appears first in shadows.",
        "keyRule": "ISO is your last resort.",
        "steps": [
          "Set aperture + shutter first.",
          "Raise ISO only when needed.",
          "Expose slightly brighter.",
          "Fix noise in post."
        ],
        "proTip": "Expose to the right (ETTR).",
        "commonMistake": "Using ISO as the main exposure tool.",
        "htmlSlidePath": "slides/camera-basics/iso-noise.html",
        "htmlSlideId": "iso-noise",
        "images": []
      },
      {
        "id": "camera-aperture",
        "number": "02",
        "tab": "camera",
        "category": "CAMERA BASICS",
        "title": "Aperture & Depth of Field",
        "type": "html_presentation",
        "description": "Aperture controls background blur and light.",
        "guide": "Lower f‑stops blur backgrounds; higher f‑stops keep more in focus.",
        "keyRule": "Lower f‑stop = shallower depth.",
        "steps": [
          "Choose f‑stop based on subject.",
          "Adjust shutter to maintain exposure.",
          "Raise ISO last.",
          "Check focus."
        ],
        "proTip": "Use f/2.8 or lower for cinematic separation.",
        "commonMistake": "Shooting wide open without checking focus.",
        "htmlSlidePath": "slides/camera-motion/aperture-depth.html",
        "htmlSlideId": "aperture-depth",
        "images": []
      },
      {
        "id": "camera-shutter",
        "number": "03",
        "tab": "camera",
        "category": "CAMERA BASICS",
        "title": "Shutter Speed & Motion",
        "type": "html_presentation",
        "description": "Shutter speed controls motion blur.",
        "guide": "Match shutter to frame rate for natural motion. Faster = crisp. Slower = blur.",
        "keyRule": "Shutter ≈ 2× frame rate.",
        "steps": [
          "Set shutter for motion style.",
          "Increase for action.",
          "Lower for blur.",
          "Rebalance exposure."
        ],
        "proTip": "Use high shutter for sports.",
        "commonMistake": "Fast shutter indoors causing underexposure.",
        "htmlSlidePath": "slides/camera-basics/shutter-motion.html",
        "htmlSlideId": "shutter-motion",
        "images": []
      },
      {
        "id": "camera-frame-rates",
        "number": "04",
        "tab": "camera",
        "category": "CAMERA BASICS",
        "title": "Frame Rate",
        "type": "static",
        "description": "Frame rate affects motion style.",
        "guide": "24fps = cinematic\n30fps = clean\n60fps = smooth / slow motion",
        "keyRule": "Choose frame rate intentionally.",
        "steps": [
          "Pick frame rate for mood.",
          "Match shutter.",
          "Adjust lighting.",
          "Keep consistent."
        ],
        "proTip": "Shoot 60fps only when needed.",
        "commonMistake": "Mixing frame rates randomly.",
        "images": []
      },
      {
        "id": "camera-white-balance",
        "number": "05",
        "tab": "camera",
        "category": "CAMERA BASICS",
        "title": "White Balance",
        "type": "static",
        "description": "White balance controls color temperature and skin tone accuracy.",
        "guide": "Match Kelvin to your lighting. Avoid auto WB.",
        "keyRule": "Match WB to the dominant light source.",
        "steps": [
          "Identify lighting temperature.",
          "Set Kelvin manually.",
          "Avoid mixed lighting.",
          "Check skin tones."
        ],
        "proTip": "Use a gray card.",
        "commonMistake": "Leaving WB on auto.",
        "images": []
      },
      {
        "id": "camera-exposure-triangle",
        "number": "06",
        "tab": "camera",
        "category": "CAMERA BASICS",
        "title": "Exposure Triangle",
        "type": "html_presentation",
        "description": "The exposure triangle controls brightness and creative style.",
        "guide": "Aperture affects depth, shutter affects motion, ISO affects noise. They must be balanced together.",
        "keyRule": "Balance all three — never adjust one in isolation.",
        "steps": [
          "Set aperture for depth.",
          "Set shutter for motion.",
          "Raise ISO only when needed.",
          "Rebalance exposure."
        ],
        "proTip": "Lock two settings and adjust the third.",
        "commonMistake": "Using ISO as the main exposure tool.",
        "htmlSlidePath": "slides/camera-basics/exposure-triangle.html",
        "htmlSlideId": "exposure-triangle",
        "images": []
      },
      {
        "id": "camera-histogram-zebras",
        "number": "07",
        "tab": "camera",
        "category": "CAMERA BASICS",
        "title": "Histogram & Zebras",
        "type": "static",
        "description": "Histograms and zebras help you expose accurately. They matter because screens lie.",
        "guide": "Histogram shows tonal distribution. Zebras show overexposure. Use both to protect highlights and maintain detail. Trust tools over your eyes.",
        "keyRule": "Expose to protect highlights.",
        "steps": [
          "Enable histogram.",
          "Watch for clipping.",
          "Use zebras for skin tones.",
          "Adjust exposure."
        ],
        "proTip": "Set zebras to 70% for skin.",
        "commonMistake": "Ignoring exposure tools.",
        "images": []
      },
      {
        "id": "camera-nd-filters",
        "number": "08",
        "tab": "camera",
        "category": "CAMERA BASICS",
        "title": "ND Filters",
        "type": "static",
        "description": "ND filters reduce light so you can keep cinematic settings outdoors.",
        "guide": "Use ND to maintain wide apertures and correct shutter speeds.",
        "keyRule": "Use ND — not shutter — to control exposure.",
        "steps": [
          "Set aperture + shutter.",
          "Add ND to reduce light.",
          "Adjust ISO last.",
          "Recheck WB."
        ],
        "proTip": "Use fixed NDs for color accuracy.",
        "commonMistake": "Raising shutter instead of using ND.",
        "images": []
      },
      {
        "id": "camera-focal-length",
        "number": "09",
        "tab": "camera",
        "category": "CAMERA BASICS",
        "title": "Focal Length",
        "type": "static",
        "description": "Focal length affects field of view and perspective.",
        "guide": "Wide = exaggerated space / Telephoto = compression / Mid-range = natural",
        "keyRule": "Choose focal length for perspective, not convenience.",
        "steps": [
          "Pick lens for emotion.",
          "Adjust distance.",
          "Reframe.",
          "Maintain continuity."
        ],
        "proTip": "35mm is the most natural storytelling lens.",
        "commonMistake": "Zooming instead of moving.",
        "images": []
      },
      {
        "id": "camera-prime-vs-zoom",
        "number": "10",
        "tab": "camera",
        "category": "CAMERA BASICS",
        "title": "Prime vs Zoom Lenses",
        "type": "static",
        "description": "Primes are sharp and fast; zooms are flexible.",
        "guide": "Use primes for controlled shoots; zooms for run‑and‑gun.",
        "keyRule": "Use primes for quality, zooms for speed.",
        "steps": [
          "Choose based on workflow.",
          "Use primes for low light.",
          "Use zooms for events.",
          "Match lenses for consistency."
        ],
        "proTip": "A 24–70mm covers most needs.",
        "commonMistake": "Using primes when speed matters more.",
        "images": []
      },
      {
        "id": "camera-sensor-size",
        "number": "11",
        "tab": "camera",
        "category": "CAMERA BASICS",
        "title": "Sensor Size",
        "type": "static",
        "description": "Sensor size affects depth and field of view.",
        "guide": "Full-frame = shallow depth / APS‑C = crop / MFT = deeper depth",
        "keyRule": "Know your crop factor.",
        "steps": [
          "Identify sensor size.",
          "Multiply focal length by crop factor.",
          "Adjust lens choice.",
          "Reframe."
        ],
        "proTip": "Full-frame gives the most flexibility.",
        "commonMistake": "Ignoring crop factor when switching cameras.",
        "images": []
      },
      {
        "id": "camera-log-standard-profiles",
        "number": "12",
        "tab": "camera",
        "category": "CAMERA BASICS",
        "title": "Log vs Standard Profiles",
        "type": "static",
        "description": "Log profiles capture more dynamic range. It matters because Log gives you more control in grading.",
        "guide": "Log looks flat but holds detail. Standard profiles look finished but limit flexibility. Use Log for cinematic work and standard for fast turnaround. Expose Log brighter to avoid noise.",
        "keyRule": "Use Log when you plan to grade heavily.",
        "steps": [
          "Enable Log profile.",
          "Expose brighter than normal.",
          "Use monitoring LUT.",
          "Grade in post."
        ],
        "proTip": "ETTR helps Log footage shine.",
        "commonMistake": "Underexposing Log and getting noise.",
        "images": []
      },
      {
        "id": "camera-bitrate-codecs",
        "number": "13",
        "tab": "camera",
        "category": "CAMERA BASICS",
        "title": "Bitrate & Codecs",
        "type": "static",
        "description": "Bitrate and codecs determine file quality and size. They matter because compression affects detail and color.",
        "guide": "Higher bitrates preserve more information. Codecs like ProRes and DNx are easier to edit. H.264 and H.265 are efficient but harder on computers. Choose based on workflow and storage.",
        "keyRule": "Use higher bitrates for heavy grading.",
        "steps": [
          "Choose codec based on workflow.",
          "Set bitrate high for action.",
          "Use ProRes for editing.",
          "Archive masters in high quality."
        ],
        "proTip": "Use ProRes LT for balance of quality and size.",
        "commonMistake": "Shooting low bitrate for fast motion.",
        "images": []
      },
      {
        "id": "camera-file-formats-resolutions",
        "number": "14",
        "tab": "camera",
        "category": "CAMERA BASICS",
        "title": "File Formats & Resolutions",
        "type": "static",
        "description": "File format and resolution determine detail and flexibility. They matter because delivery requirements vary.",
        "guide": "Shoot 4K for flexibility. Use 1080p for speed. RAW offers maximum control but large files. Choose format based on project needs and storage.",
        "keyRule": "Shoot higher resolution when reframing is needed.",
        "steps": [
          "Choose resolution based on delivery.",
          "Use RAW for heavy grading.",
          "Use 4K for flexibility.",
          "Use 1080p for speed."
        ],
        "proTip": "Shoot 4K even for 1080p delivery.",
        "commonMistake": "Overshooting RAW without storage.",
        "images": []
      },
      {
        "id": "camera-stabilization",
        "number": "15",
        "tab": "camera",
        "category": "CAMERA BASICS",
        "title": "Stabilization (IBIS, Gimbal, Tripod)",
        "type": "static",
        "description": "Stabilization keeps footage smooth. It matters because shaky footage looks amateur.",
        "guide": "IBIS stabilizes small movements. Gimbals stabilize walking shots. Tripods stabilize static shots. Choose stabilization based on movement and style.",
        "keyRule": "Match stabilization tool to the shot.",
        "steps": [
          "Use tripod for static shots.",
          "Use gimbal for movement.",
          "Use IBIS for handheld.",
          "Avoid over‑stabilizing."
        ],
        "proTip": "Use warp stabilizer sparingly in post.",
        "commonMistake": "Using gimbals for shots that should be locked off.",
        "images": []
      },
      {
        "id": "camera-autofocus-manual",
        "number": "16",
        "tab": "camera",
        "category": "CAMERA BASICS",
        "title": "Autofocus vs Manual Focus",
        "type": "static",
        "description": "Autofocus is fast; manual focus is precise. It matters because focus determines clarity and professionalism.",
        "guide": "Use autofocus for movement and run‑and‑gun. Use manual focus for controlled scenes. Focus peaking helps nail manual focus. Choose based on reliability and style.",
        "keyRule": "Use manual focus when precision matters.",
        "steps": [
          "Enable focus peaking.",
          "Pull focus manually.",
          "Use autofocus for tracking.",
          "Recheck focus often."
        ],
        "proTip": "Use back‑button focus for control.",
        "commonMistake": "Relying on autofocus in low light.",
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
        "number": "17",
        "tab": "camera",
        "category": "Shooting Modes",
        "title": "Manual Mode",
        "type": "static",
        "description": "Manual Mode gives you full control over exposure. It matters because nothing shifts automatically — your creative intent stays locked.",
        "guide": "You set aperture, shutter speed, and ISO yourself. This removes unpredictability and ensures consistent results across shots.",
        "keyRule": "You control all three exposure variables — nothing changes unless you change it.",
        "steps": [
          "Set aperture for depth of field.",
          "Set shutter for motion.",
          "Raise ISO only as needed.",
          "Rebalance exposure until histogram is centered."
        ],
        "proTip": "Lock two settings for your style and adjust the third for exposure.",
        "commonMistake": "Forgetting ISO is still part of the triangle and letting it drift too high.",
        "images": []
      },
      {
        "id": "camera-aperture-priority",
        "number": "18",
        "tab": "camera",
        "category": "Shooting Modes",
        "title": "Aperture Priority",
        "type": "static",
        "description": "Aperture Priority lets you control depth of field while the camera sets shutter speed automatically.",
        "guide": "You choose the f‑stop; the camera adjusts shutter to maintain exposure. Great for portraits, interviews, and controlled depth.",
        "keyRule": "You control depth — the camera controls motion.",
        "steps": [
          "Set your desired f‑stop.",
          "Watch shutter speed to avoid motion blur.",
          "Adjust exposure compensation if needed.",
          "Keep ISO low for clean images."
        ],
        "proTip": "Use Aperture Priority when lighting changes quickly but depth must stay consistent.",
        "commonMistake": "Letting shutter drop too low and introducing motion blur.",
        "images": []
      },
      {
        "id": "camera-shutter-priority",
        "number": "19",
        "tab": "camera",
        "category": "Shooting Modes",
        "title": "Shutter Priority",
        "type": "static",
        "description": "Shutter Priority locks motion style while the camera adjusts aperture.",
        "guide": "You choose shutter speed; the camera sets aperture. Ideal for sports, action, or stylized motion blur.",
        "keyRule": "You control motion — the camera controls depth.",
        "steps": [
          "Set shutter based on motion needs.",
          "Monitor aperture to avoid underexposure.",
          "Raise ISO if aperture maxes out.",
          "Use exposure compensation to fine‑tune."
        ],
        "proTip": "Use Shutter Priority for fast-moving subjects outdoors.",
        "commonMistake": "Forgetting aperture may hit its limit and cause underexposure.",
        "images": []
      },
      {
        "id": "camera-picture-profiles",
        "number": "20",
        "tab": "camera",
        "category": "Shooting Modes",
        "title": "Picture Profiles",
        "type": "static",
        "description": "Picture profiles define the look of your footage in‑camera. They matter because they affect contrast, color, and dynamic range.",
        "guide": "Standard profiles look finished but limit grading. Log profiles look flat but preserve detail. Choose based on workflow and turnaround time.",
        "keyRule": "Choose profiles based on grading needs — not habit.",
        "steps": [
          "Pick Standard for fast delivery.",
          "Pick Log for cinematic grading.",
          "Use monitoring LUTs for Log.",
          "Expose Log brighter to avoid noise."
        ],
        "proTip": "Use Log only when you plan to grade intentionally.",
        "commonMistake": "Underexposing Log and creating noisy shadows.",
        "images": []
      },
      {
        "id": "camera-raw-vs-compressed",
        "number": "21",
        "tab": "camera",
        "category": "Shooting Modes",
        "title": "RAW vs Compressed",
        "type": "static",
        "description": "RAW captures maximum sensor data; compressed formats save space. It matters because workflow and storage change dramatically.",
        "guide": "RAW gives flexibility but requires heavy processing. Compressed formats are efficient but limit recovery in post.",
        "keyRule": "Use RAW for maximum control — compressed for speed.",
        "steps": [
          "Use RAW for high-end or cinematic work.",
          "Use compressed for social content or fast edits.",
          "Ensure storage can handle RAW.",
          "Match codec to your editing machine."
        ],
        "proTip": "ProRes RAW or BRAW offer a strong balance of flexibility and workflow.",
        "commonMistake": "Overshooting RAW without enough storage or processing power.",
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
        "number": "22",
        "tab": "camera",
        "category": "Camera Movement",
        "title": "Handheld",
        "type": "static",
        "description": "Handheld shooting adds energy and realism. It matters because it creates an immersive, human feel.",
        "guide": "Use controlled micro-movements, stable posture, and intentional motion. Handheld should feel organic, not sloppy.",
        "keyRule": "Stability first — movement second.",
        "steps": [
          "Tuck elbows in.",
          "Use your body as a shock absorber.",
          "Move intentionally, not randomly.",
          "Add subtle motion to avoid static shake."
        ],
        "proTip": "Use a wider lens to hide micro‑shake.",
        "commonMistake": "Over‑shaking the camera and calling it \"handheld style.\"",
        "images": []
      },
      {
        "id": "camera-gimbal",
        "number": "23",
        "tab": "camera",
        "category": "Camera Movement",
        "title": "Gimbal",
        "type": "static",
        "description": "Gimbals create smooth, floating movement. They matter because they add polish and cinematic motion.",
        "guide": "Balance the camera, walk heel‑to‑toe, and keep movements slow and intentional. Let the gimbal do the stabilization — not your arms.",
        "keyRule": "Smooth steps = smooth footage.",
        "steps": [
          "Balance the gimbal perfectly.",
          "Use slow, controlled movements.",
          "Keep horizon level.",
          "Avoid sudden pans or tilts."
        ],
        "proTip": "Use \"follow\" mode for natural movement and \"lock\" mode for precision.",
        "commonMistake": "Running with a gimbal and creating bounce.",
        "images": []
      },
      {
        "id": "camera-static",
        "number": "24",
        "tab": "camera",
        "category": "Camera Movement",
        "title": "Static",
        "type": "static",
        "description": "Locked-off shots create stability and focus. They matter because they feel intentional and professional.",
        "guide": "Use a tripod or solid surface. Frame precisely. Let the subject or scene provide the motion.",
        "keyRule": "If the camera doesn't move, the composition must be perfect.",
        "steps": [
          "Level the tripod.",
          "Frame with purpose.",
          "Lock all adjustments.",
          "Avoid touching the camera during takes."
        ],
        "proTip": "Use static shots to contrast dynamic sequences.",
        "commonMistake": "Crooked horizons or sloppy framing.",
        "images": []
      },
      {
        "id": "camera-dolly-slider",
        "number": "25",
        "tab": "camera",
        "category": "Camera Movement",
        "title": "Dolly / Slider",
        "type": "static",
        "description": "Dolly and slider moves add controlled, cinematic motion. They matter because they feel intentional and smooth.",
        "guide": "Use slow, consistent movement. Dolly reveals space; sliders add subtle parallax.",
        "keyRule": "Movement must serve the story — not distract.",
        "steps": [
          "Set a slow, steady pace.",
          "Keep subject distance consistent.",
          "Use foreground elements for parallax.",
          "Avoid speed changes mid‑move."
        ],
        "proTip": "Use sliders for micro‑moves that elevate simple shots.",
        "commonMistake": "Moving too fast and losing cinematic feel.",
        "images": []
      },
      {
        "id": "camera-whip-pan",
        "number": "26",
        "tab": "camera",
        "category": "Camera Movement",
        "title": "Whip Pan",
        "type": "static",
        "description": "Whip pans create fast, energetic transitions. They matter because they add momentum and hide cuts.",
        "guide": "Start and end with a fast horizontal motion. Match direction and speed between shots for seamless transitions.",
        "keyRule": "Motion blur hides the cut.",
        "steps": [
          "Start with a clean frame.",
          "Whip quickly left or right.",
          "Match the direction on the next shot.",
          "Cut at peak blur."
        ],
        "proTip": "Shoot at a higher shutter speed to keep the blur clean.",
        "commonMistake": "Whipping too slowly and revealing the cut.",
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
        "number": "27",
        "tab": "framing",
        "category": "FOUNDATIONAL RULES",
        "title": "Rule of Thirds",
        "type": "html_presentation",
        "description": "The rule of thirds divides your frame into a 3x3 grid. It matters because placing subjects on these lines creates natural balance.",
        "guide": "Humans read images in patterns, and the thirds grid aligns with those patterns. Placing eyes, horizons, or key objects on the intersections creates tension and interest. Centering works too, but thirds give you a reliable starting point. Use it to guide the viewer's eye without shouting for attention.",
        "keyRule": "Place your subject on a third, not the center, unless you have a reason.",
        "steps": [
          "Turn on your camera's grid.",
          "Place the subject on a vertical third.",
          "Place eyes on a horizontal third.",
          "Break the rule only with intention."
        ],
        "proTip": "Use the opposite third for negative space to create direction.",
        "commonMistake": "Centering everything out of habit.",
        "htmlSlidePath": "slides/photography-composition/rule-of-thirds.html",
        "htmlSlideId": "rule-of-thirds",
        "images": []
      },
      {
        "id": "framing-leading-lines",
        "number": "28",
        "tab": "framing",
        "category": "FOUNDATIONAL RULES",
        "title": "Leading Lines",
        "type": "html_presentation",
        "description": "Leading lines guide the viewer's eye through the frame. They matter because they create depth and visual flow.",
        "guide": "Roads, rails, hallways, shadows—anything can be a leading line. Use them to point toward your subject or pull the viewer deeper into the scene. Strong lines add structure and intention. They're especially powerful in wide shots.",
        "keyRule": "Use lines to direct attention, not distract from it.",
        "steps": [
          "Look for natural lines in the environment.",
          "Position your subject at the end of the line.",
          "Adjust angle to strengthen the line.",
          "Keep lines clean—avoid clutter."
        ],
        "proTip": "Diagonal lines add more energy than horizontal ones.",
        "commonMistake": "Letting lines lead out of the frame instead of toward the subject.",
        "htmlSlidePath": "slides/photography-composition/leading-lines.html",
        "htmlSlideId": "leading-lines",
        "images": []
      },
      {
        "id": "framing-symmetry",
        "number": "29",
        "tab": "framing",
        "category": "FOUNDATIONAL RULES",
        "title": "Symmetry",
        "type": "static",
        "description": "Symmetry creates balance and calm. It matters because it makes a frame feel intentional and controlled.",
        "guide": "Perfect symmetry is rare in real life, which makes it visually striking. Center your subject and align the environment around them. Works well for architecture, portraits, and dramatic reveals. Symmetry is strongest when everything in the frame supports it.",
        "keyRule": "If you choose symmetry, commit fully.",
        "steps": [
          "Center your subject.",
          "Align vertical and horizontal lines.",
          "Remove distracting elements.",
          "Hold the frame steady."
        ],
        "proTip": "Use symmetry to reset the viewer before a chaotic sequence.",
        "commonMistake": "Calling a shot \"symmetrical\" when the lines don't actually match.",
        "images": []
      },
      {
        "id": "framing-framing-within-frame",
        "number": "30",
        "tab": "framing",
        "category": "FOUNDATIONAL RULES",
        "title": "Framing Within a Frame",
        "type": "static",
        "description": "Framing within a frame uses objects to surround your subject. It matters because it adds depth and directs attention.",
        "guide": "Doorways, windows, mirrors, foliage—anything can frame your subject. It creates layers and makes the viewer feel like they're peeking into a moment. Use it to isolate your subject or add storytelling context. It's a simple trick that elevates any shot.",
        "keyRule": "Use frames to guide focus, not hide the subject.",
        "steps": [
          "Look for natural frames in the environment.",
          "Position your subject inside the frame.",
          "Adjust depth of field to control emphasis.",
          "Keep the frame edges clean."
        ],
        "proTip": "Out‑of‑focus foreground frames add cinematic depth.",
        "commonMistake": "Letting the frame overpower the subject.",
        "images": []
      },
      {
        "id": "framing-negative-space",
        "number": "31",
        "tab": "framing",
        "category": "FOUNDATIONAL RULES",
        "title": "Negative Space",
        "type": "static",
        "description": "Negative space is the empty area around your subject. It matters because it creates mood and breathing room.",
        "guide": "Use negative space to emphasize isolation, calm, or scale. It shifts attention to the subject by contrast. Works well in minimal environments or wide shots. Negative space is a storytelling tool, not just empty background.",
        "keyRule": "Let the empty space say something.",
        "steps": [
          "Place your subject on one side.",
          "Leave intentional empty space.",
          "Use simple backgrounds.",
          "Balance the frame visually."
        ],
        "proTip": "Negative space makes titles and graphics easier to place.",
        "commonMistake": "Confusing empty space with dead space that adds nothing.",
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
        "number": "32",
        "tab": "framing",
        "category": "ADVANCED COMPOSITION",
        "title": "Depth Layers (Foreground, Mid, Background)",
        "type": "html_presentation",
        "description": "Depth layers create dimensionality. They matter because flat images feel cheap and lifeless.",
        "guide": "Foreground adds texture, midground holds the subject, background sets context. Use all three to create cinematic depth. Move your camera, not just your zoom, to build layers. Depth makes even simple scenes feel intentional and expensive.",
        "keyRule": "Always build at least three layers in your frame.",
        "steps": [
          "Add a foreground element.",
          "Place your subject in the midground.",
          "Use background to set context.",
          "Adjust aperture to control separation."
        ],
        "proTip": "Foreground blur instantly adds production value.",
        "commonMistake": "Shooting everything from eye level with no layers.",
        "htmlSlidePath": "slides/photography-composition/depth.html",
        "htmlSlideId": "depth",
        "slideRef": "slides_depth_layers",
        "images": []
      },
      {
        "id": "framing-dutch-angle",
        "number": "33",
        "tab": "framing",
        "category": "ADVANCED COMPOSITION",
        "title": "Dutch Angle",
        "type": "static",
        "description": "A Dutch angle tilts the horizon. It matters because it creates tension or unease.",
        "guide": "Use Dutch angles sparingly—they're powerful but easy to overdo. Tilt the camera to show imbalance, chaos, or psychological tension. Works well in action, thrillers, or moments of emotional instability. Keep the tilt consistent within a sequence.",
        "keyRule": "Tilt only when the story calls for it.",
        "steps": [
          "Level your shot first.",
          "Tilt slightly—10–20 degrees is enough.",
          "Keep vertical lines intentional.",
          "Match tilt direction across shots."
        ],
        "proTip": "A small tilt is more unsettling than an extreme one.",
        "commonMistake": "Using Dutch angles as a stylistic crutch.",
        "images": []
      },
      {
        "id": "framing-high-low-angle",
        "number": "34",
        "tab": "framing",
        "category": "ADVANCED COMPOSITION",
        "title": "High Angle vs Low Angle",
        "type": "html_presentation",
        "description": "High angles diminish subjects; low angles empower them. It matters because angle changes meaning.",
        "guide": "A high angle makes a subject look small, vulnerable, or overwhelmed. A low angle makes them look strong, dominant, or heroic. Use angle to reinforce character emotion or power dynamics. Even subtle shifts change the story.",
        "keyRule": "Choose angle based on the character's emotional state.",
        "steps": [
          "Decide what the scene says about the subject.",
          "Raise or lower the camera accordingly.",
          "Keep vertical lines straight.",
          "Rebalance composition after changing angle."
        ],
        "proTip": "Low angles with wide lenses exaggerate power.",
        "commonMistake": "Using eye level for every shot.",
        "htmlSlidePath": "slides/framing-shots/camera-angles.html",
        "htmlSlideId": "camera-angles",
        "slideRef": "slides_high_low_angle",
        "images": []
      },
      {
        "id": "framing-wide-vs-tight",
        "number": "35",
        "tab": "framing",
        "category": "ADVANCED COMPOSITION",
        "title": "Wide vs Tight — When to Use Each",
        "type": "static",
        "description": "Wide shots show context; tight shots show emotion. It matters because choosing the wrong one weakens the scene.",
        "guide": "Use wide shots to establish space, relationships, and movement. Use tight shots to capture detail, intensity, or intimacy. Switching between wide and tight creates rhythm. Let the story dictate how close you should be.",
        "keyRule": "Choose focal length based on story, not habit.",
        "steps": [
          "Ask what the viewer needs to feel.",
          "Pick wide for context.",
          "Pick tight for emotion.",
          "Mix both for visual rhythm."
        ],
        "proTip": "Tight shots hide messy locations.",
        "commonMistake": "Shooting everything at one focal length.",
        "images": []
      },
      {
        "id": "framing-headroom-nose-room",
        "number": "36",
        "tab": "framing",
        "category": "ADVANCED COMPOSITION",
        "title": "Headroom & Nose Room",
        "type": "html_presentation",
        "description": "Headroom and nose room control breathing space around a subject. They matter because they affect comfort and direction.",
        "guide": "Too much headroom feels amateur; too little feels cramped. Nose room gives space in the direction the subject faces. Use these to guide viewer attention and maintain balance. Small adjustments make big differences.",
        "keyRule": "Give subjects space in the direction they're looking.",
        "steps": [
          "Place eyes on the upper third.",
          "Leave space in front of the face.",
          "Adjust headroom based on emotion.",
          "Reframe after movement."
        ],
        "proTip": "Less nose room creates tension—use intentionally.",
        "commonMistake": "Centering the head vertically.",
        "htmlSlidePath": "slides/framing-shots/headroom-lookroom.html",
        "htmlSlideId": "headroom-lookroom",
        "images": []
      },
      {
        "id": "framing-vertical-composition",
        "number": "36B",
        "tab": "framing",
        "category": "ADVANCED COMPOSITION",
        "title": "Vertical Composition (9:16)",
        "type": "html_presentation",
        "description": "Vertical composition plans for 9:16 delivery. It matters because cropping horizontal footage destroys framing and resolution.",
        "guide": "Shooting 16:9 but delivering 9:16? Compose with the vertical safe area in mind from day one. Place subjects on the center third—never the edges. Keep faces and titles inside the safe zone so mobile crops do not clip your story.",
        "keyRule": "Native vertical beats stretched horizontal.",
        "steps": [
          "Enable vertical safe-area guides on monitor or app.",
          "Place subject on center third for 9:16 crop.",
          "Keep faces and titles inside the safe zone.",
          "Shoot native vertical when the platform is vertical-first."
        ],
        "proTip": "Frame for the crop before you roll—fixing in post costs resolution.",
        "commonMistake": "Placing subjects on the edge of a horizontal frame you plan to crop.",
        "htmlSlidePath": "slides/framing-shots/vertical-composition.html",
        "htmlSlideId": "vertical-composition",
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
        "number": "37",
        "tab": "framing",
        "category": "SHOT TYPES",
        "title": "Extreme Wide Shot",
        "type": "static",
        "description": "Extreme wide shots show scale and environment. They matter because they establish world and mood.",
        "guide": "Use them to open scenes, show isolation, or reveal geography. Subjects are small, so composition must be strong. Weather, light, and landscape do the storytelling. Great for transitions and emotional resets.",
        "keyRule": "Use extreme wides to show the world, not the person.",
        "steps": [
          "Find a strong landscape or structure.",
          "Place subject small in frame.",
          "Use leading lines or symmetry.",
          "Hold long enough for impact."
        ],
        "proTip": "Shoot extreme wides during golden hour for maximum drama.",
        "commonMistake": "Putting the subject dead center with no environmental interest.",
        "images": []
      },
      {
        "id": "framing-ws",
        "number": "38",
        "tab": "framing",
        "category": "SHOT TYPES",
        "title": "Wide Shot",
        "type": "static",
        "description": "Wide shots show the subject and their environment. They matter because they establish context.",
        "guide": "Use wide shots to show relationships, movement, or setting. They're the backbone of visual storytelling. Keep the frame clean and intentional. Use depth layers to avoid flatness.",
        "keyRule": "Use wides to answer \"where are we?\"",
        "steps": [
          "Place subject clearly in the environment.",
          "Use foreground for depth.",
          "Keep horizon level.",
          "Let the subject move through the space."
        ],
        "proTip": "Wides look best with strong lighting direction.",
        "commonMistake": "Letting backgrounds get cluttered.",
        "images": []
      },
      {
        "id": "framing-ms",
        "number": "39",
        "tab": "framing",
        "category": "SHOT TYPES",
        "title": "Medium Shot",
        "type": "static",
        "description": "Medium shots balance subject and environment. They matter because they're the most versatile framing.",
        "guide": "A medium shot usually frames from waist to head. It's great for dialogue, interviews, and natural movement. Use it when you need emotion and context together. It's the workhorse of filmmaking.",
        "keyRule": "Use mediums when you need both story and emotion.",
        "steps": [
          "Frame from waist or mid‑torso.",
          "Keep background simple.",
          "Maintain clean headroom.",
          "Use subtle camera movement if needed."
        ],
        "proTip": "Medium shots hide minor location flaws.",
        "commonMistake": "Framing too loose and drifting into wide‑shot territory.",
        "images": []
      },
      {
        "id": "framing-cu",
        "number": "40",
        "tab": "framing",
        "category": "SHOT TYPES",
        "title": "Close Up",
        "type": "static",
        "description": "Close ups capture emotion and detail. They matter because they show what the character feels.",
        "guide": "Frame from shoulders up or tighter. Use shallow depth to isolate the subject. Close ups are powerful—use them for key emotional beats. They slow the viewer down and force attention.",
        "keyRule": "Use close ups when emotion peaks.",
        "steps": [
          "Move physically closer, don't just zoom.",
          "Use soft light for flattering skin.",
          "Focus on the eyes.",
          "Keep background minimal."
        ],
        "proTip": "A close up with hard light creates intensity.",
        "commonMistake": "Overusing close ups and losing emotional pacing.",
        "images": []
      },
      {
        "id": "framing-ecu",
        "number": "41",
        "tab": "framing",
        "category": "SHOT TYPES",
        "title": "Extreme Close Up",
        "type": "static",
        "description": "Extreme close ups isolate a single detail. They matter because they amplify tension or symbolism.",
        "guide": "Use them for eyes, hands, objects, or textures. They create intimacy or discomfort depending on context. Extreme close ups break normal framing rules to highlight something critical. Use sparingly for maximum impact.",
        "keyRule": "Use extreme close ups only when the detail matters.",
        "steps": [
          "Get physically close.",
          "Use macro or tight lenses.",
          "Control lighting carefully.",
          "Keep the frame simple."
        ],
        "proTip": "Extreme close ups make great transitions.",
        "commonMistake": "Using them without narrative purpose.",
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
        "number": "42",
        "tab": "lighting",
        "category": "LIGHTING BASICS",
        "title": "Three-Point Lighting",
        "type": "html_presentation",
        "description": "Three-point lighting is the foundation of controlled lighting setups. It matters because it shapes depth, separation, and subject clarity.",
        "guide": "The key light defines the subject. The fill light softens shadows. The backlight separates the subject from the background. This setup works for interviews, portraits, and narrative scenes. Mastering it gives you predictable, professional results.",
        "keyRule": "Balance the three lights to control contrast, not eliminate it.",
        "steps": [
          "Place key light at a 45° angle.",
          "Add fill on the opposite side.",
          "Add backlight behind the subject.",
          "Adjust intensity for mood."
        ],
        "proTip": "Use negative fill instead of adding more lights when you want drama.",
        "commonMistake": "Over-filling and flattening the face.",
        "htmlSlidePath": "slides/lighting-exposure/three-point-lighting.html",
        "htmlSlideId": "three-point-lighting",
        "images": []
      },
      {
        "id": "lighting-natural-light",
        "number": "43",
        "tab": "lighting",
        "category": "LIGHTING BASICS",
        "title": "Natural Light",
        "type": "static",
        "description": "Natural light is sunlight and ambient outdoor light. It matters because it's free, beautiful, and constantly changing.",
        "guide": "Use the sun as your key light and shape it with reflectors or diffusion. Golden hour gives soft, directional light; midday sun is harsh and contrasty. Clouds act as giant diffusers. Learn to read the sky like a lighting setup.",
        "keyRule": "Work with the sun's direction, not against it.",
        "steps": [
          "Position subject with sun at 45°.",
          "Use diffusion to soften harsh light.",
          "Use reflectors to fill shadows.",
          "Move quickly—light changes fast."
        ],
        "proTip": "Backlit subjects with a reflector create cinematic skin tones.",
        "commonMistake": "Shooting at noon without diffusion.",
        "images": []
      },
      {
        "id": "lighting-hard-vs-soft",
        "number": "44",
        "tab": "lighting",
        "category": "LIGHTING BASICS",
        "title": "Hard vs Soft Light",
        "type": "html_presentation",
        "description": "Hard light creates sharp shadows; soft light creates smooth transitions. It matters because shadow quality defines mood.",
        "guide": "Hard light comes from small, direct sources. Soft light comes from large, diffused sources. Hard light adds drama and texture; soft light flatters faces. Control hardness by changing source size or distance. Light quality matters more than brightness.",
        "keyRule": "Bigger source = softer light.",
        "steps": [
          "Move light closer for softness.",
          "Add diffusion for smoother shadows.",
          "Use bare bulbs or fresnels for hard light.",
          "Shape shadows with flags."
        ],
        "proTip": "Soft light still needs direction—don't flatten it.",
        "commonMistake": "Confusing soft light with low‑contrast lighting.",
        "htmlSlidePath": "slides/lighting-exposure/hard-soft-light.html",
        "htmlSlideId": "hard-soft-light",
        "images": []
      },
      {
        "id": "lighting-color-temp",
        "number": "45",
        "tab": "lighting",
        "category": "LIGHTING BASICS",
        "title": "Color Temperature",
        "type": "html_presentation",
        "description": "Color temperature defines the warmth or coolness of light. It matters because mixed temperatures ruin skin tones.",
        "guide": "Daylight is around 5600K; tungsten is around 3200K. Match your lights to the dominant source. Use gels or camera white balance to correct mismatches. Consistent color temperature makes grading easier and cleaner.",
        "keyRule": "Match all lights to one color temperature.",
        "steps": [
          "Identify the dominant light source.",
          "Set camera white balance to match.",
          "Gel lights to match the environment.",
          "Avoid mixing warm and cool sources."
        ],
        "proTip": "Use warm light for intimacy and cool light for tension.",
        "commonMistake": "Ignoring practical lights that contaminate the scene.",
        "htmlSlidePath": "slides/lighting-exposure/color-temperature.html",
        "htmlSlideId": "color-temperature",
        "images": []
      },
      {
        "id": "lighting-practical-lights",
        "number": "46",
        "tab": "lighting",
        "category": "LIGHTING BASICS",
        "title": "Practical Lights",
        "type": "static",
        "description": "Practical lights are visible light sources in the frame. They matter because they add realism and depth.",
        "guide": "Lamps, neon signs, candles—anything visible counts. Use them to motivate your lighting direction. Practical lights add color contrast and visual interest. They help hide lighting transitions and anchor your scene.",
        "keyRule": "Let practicals motivate your key light direction.",
        "steps": [
          "Place practicals where they make sense.",
          "Dim or gel them for exposure.",
          "Match your key light direction to the practical.",
          "Use multiple practicals for depth."
        ],
        "proTip": "Warm practicals against cool ambient light create cinematic contrast.",
        "commonMistake": "Letting practicals blow out highlights.",
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
        "number": "47",
        "tab": "lighting",
        "category": "LIGHTING SETUPS",
        "title": "Interview Setup",
        "type": "html_presentation",
        "description": "Interview lighting prioritizes clarity and flattering skin. It matters because interviews are unforgiving.",
        "guide": "Use a soft key at 45°, a gentle fill, and a subtle backlight. Keep the background slightly darker than the subject. Add practicals for depth. This setup works for corporate, documentary, and creator content.",
        "keyRule": "Light the subject brighter than the background.",
        "steps": [
          "Place soft key at 45°.",
          "Add fill to taste.",
          "Add backlight for separation.",
          "Shape background with practicals."
        ],
        "proTip": "Use negative fill on the far side for dimension.",
        "commonMistake": "Lighting the background brighter than the subject.",
        "htmlSlidePath": "slides/lighting-exposure/interview-setup.html",
        "htmlSlideId": "interview-setup",
        "slideRef": "slides_interview_setup",
        "images": []
      },
      {
        "id": "lighting-portrait-setup",
        "number": "48",
        "tab": "lighting",
        "category": "LIGHTING SETUPS",
        "title": "Portrait Setup",
        "type": "static",
        "description": "Portrait lighting highlights facial structure. It matters because small changes dramatically affect the look.",
        "guide": "Use a soft, directional key to sculpt the face. Add a subtle backlight for separation. Keep the background simple. Portrait lighting is about shaping, not blasting.",
        "keyRule": "Use directional soft light for flattering portraits.",
        "steps": [
          "Place key slightly above eye level.",
          "Add backlight for separation.",
          "Use minimal fill.",
          "Keep background clean."
        ],
        "proTip": "Feather the key light to avoid hotspots.",
        "commonMistake": "Placing the key too low and flattening the face.",
        "images": []
      },
      {
        "id": "lighting-cinematic-setup",
        "number": "49",
        "tab": "lighting",
        "category": "LIGHTING SETUPS",
        "title": "Cinematic Setup",
        "type": "html_presentation",
        "description": "Cinematic lighting uses contrast, direction, and color to create mood. It matters because it elevates simple scenes.",
        "guide": "Use motivated light sources—windows, lamps, screens. Add negative fill for depth. Use color contrast (warm vs cool) to separate elements. Cinematic lighting is about intention, not brightness.",
        "keyRule": "Light with motivation, not symmetry.",
        "steps": [
          "Choose a motivated key source.",
          "Add negative fill for contrast.",
          "Add backlight or edge light.",
          "Add color contrast subtly."
        ],
        "proTip": "Turn off overheads—they kill cinematic mood.",
        "commonMistake": "Over‑lighting and losing direction.",
        "htmlSlidePath": "slides/lighting-exposure/cinematic-setup.html",
        "htmlSlideId": "cinematic-setup",
        "images": []
      },
      {
        "id": "lighting-low-budget-setup",
        "number": "50",
        "tab": "lighting",
        "category": "LIGHTING SETUPS",
        "title": "Low Budget Setup",
        "type": "static",
        "description": "Low‑budget lighting uses minimal gear to create professional results. It matters because constraints force creativity.",
        "guide": "Use windows as key lights. Use cheap reflectors or foam boards as fill. Use practicals for background interest. Small LED panels can shape the scene. Good lighting is about control, not gear.",
        "keyRule": "Use natural and practical light as your foundation.",
        "steps": [
          "Place subject near a window.",
          "Add reflector for fill.",
          "Add practicals for depth.",
          "Use one LED for shaping."
        ],
        "proTip": "White shower curtains make great diffusion.",
        "commonMistake": "Pointing lights directly at the subject without shaping.",
        "images": []
      },
      {
        "id": "lighting-outdoor-setup",
        "number": "51",
        "tab": "lighting",
        "category": "LIGHTING SETUPS",
        "title": "Outdoor Setup",
        "type": "static",
        "description": "Outdoor lighting relies on sun control. It matters because the sun is powerful and unpredictable.",
        "guide": "Use the sun as backlight for flattering skin. Use reflectors or diffusion to shape the key. Avoid shooting at noon unless diffused. Outdoor lighting is about positioning, not equipment.",
        "keyRule": "Backlight with the sun and shape the front.",
        "steps": [
          "Place sun behind subject.",
          "Add reflector for key.",
          "Add diffusion for harsh light.",
          "Adjust angle as sun moves."
        ],
        "proTip": "Cloudy days are nature's softbox.",
        "commonMistake": "Facing subjects directly into the sun.",
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
        "number": "52",
        "tab": "lighting",
        "category": "ADVANCED LIGHTING",
        "title": "Rembrandt Lighting",
        "type": "html_presentation",
        "description": "Rembrandt lighting creates a triangle of light under the eye. It matters because it adds depth and drama.",
        "guide": "Place the key at 45° and slightly above eye level. The shadow from the nose should connect with the cheek shadow, leaving a small lit triangle. It's flattering and cinematic. Works well for portraits and interviews.",
        "keyRule": "Aim for the signature triangle under the eye.",
        "steps": [
          "Place key at 45°.",
          "Raise it slightly above eye level.",
          "Adjust angle until triangle forms.",
          "Add fill sparingly."
        ],
        "proTip": "Use negative fill to deepen the shadow side.",
        "commonMistake": "Letting the triangle get too large or too bright.",
        "htmlSlidePath": "slides/lighting-exposure/rembrandt-lighting.html",
        "htmlSlideId": "rembrandt-lighting",
        "images": []
      },
      {
        "id": "lighting-butterfly",
        "number": "53",
        "tab": "lighting",
        "category": "ADVANCED LIGHTING",
        "title": "Butterfly/Paramount Lighting",
        "type": "static",
        "description": "Butterfly lighting creates a shadow under the nose. It matters because it flatters symmetrical faces.",
        "guide": "Place the key directly in front and above the subject. The shadow forms a butterfly shape under the nose. Great for beauty, fashion, and classic Hollywood looks. Works best with soft light.",
        "keyRule": "Keep the key centered and elevated.",
        "steps": [
          "Place key directly in front.",
          "Raise it above eye level.",
          "Add fill below if needed.",
          "Keep background simple."
        ],
        "proTip": "Use a reflector under the chin for glamour.",
        "commonMistake": "Placing the key too low and losing the butterfly shape.",
        "images": []
      },
      {
        "id": "lighting-split-light",
        "number": "54",
        "tab": "lighting",
        "category": "ADVANCED LIGHTING",
        "title": "Split Lighting",
        "type": "static",
        "description": "Split lighting divides the face into light and shadow. It matters because it creates intensity and mystery.",
        "guide": "Place the key 90° to the side of the subject. One half of the face is lit; the other is dark. Great for dramatic or villainous looks. Works best with hard or semi‑hard light.",
        "keyRule": "Keep the light exactly to the side.",
        "steps": [
          "Place key at 90°.",
          "Adjust height for clean split.",
          "Add minimal fill if needed.",
          "Control spill with flags."
        ],
        "proTip": "Split lighting works well with textured backgrounds.",
        "commonMistake": "Letting light wrap too far around the face.",
        "images": []
      },
      {
        "id": "lighting-backlight-silhouette",
        "number": "55",
        "tab": "lighting",
        "category": "ADVANCED LIGHTING",
        "title": "Backlighting & Silhouette",
        "type": "static",
        "description": "Backlighting separates subjects or creates silhouettes. It matters because it adds depth and drama.",
        "guide": "Place a strong light behind the subject. For silhouettes, expose for the background. For separation, add minimal fill. Backlighting creates shape and atmosphere.",
        "keyRule": "Expose for the background when creating silhouettes.",
        "steps": [
          "Place light behind subject.",
          "Decide silhouette or separation.",
          "Adjust exposure accordingly.",
          "Add haze for atmosphere."
        ],
        "proTip": "Backlight plus haze creates instant cinematic depth.",
        "commonMistake": "Letting backlight flare the lens unintentionally.",
        "images": []
      },
      {
        "id": "lighting-practical-motivated",
        "number": "56",
        "tab": "lighting",
        "category": "ADVANCED LIGHTING",
        "title": "Practical Motivated Light",
        "type": "html_presentation",
        "description": "Motivated lighting uses practicals as the source of your key. It matters because it grounds your lighting in reality.",
        "guide": "If a lamp is in the frame, your key should feel like it comes from that lamp. Use hidden lights to boost the practical's effect. Motivated lighting blends realism with control. It's the backbone of cinematic lighting.",
        "keyRule": "Let practicals dictate your lighting direction.",
        "steps": [
          "Identify the practical source.",
          "Place key in the same direction.",
          "Boost practical with hidden lights.",
          "Match color temperature."
        ],
        "proTip": "Dim practicals to avoid clipping while keeping ambiance.",
        "commonMistake": "Lighting from a direction that contradicts the practical.",
        "htmlSlidePath": "slides/lighting-exposure/practical-motivated.html",
        "htmlSlideId": "practical-motivated",
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
        "number": "57",
        "tab": "editing",
        "category": "GETTING STARTED",
        "title": "Interface Overview",
        "type": "html_presentation",
        "description": "DaVinci Resolve is divided into specialized pages. It matters because each page handles a different part of the workflow.",
        "guide": "Cut is for fast edits. Edit is for detailed timeline work. Fusion handles VFX. Color is for grading. Fairlight is for audio. Deliver exports your final project. Knowing where tasks live speeds up your workflow.",
        "keyRule": "Use each page for its intended purpose.",
        "steps": [
          "Open project and navigate pages.",
          "Use Cut for quick assembly.",
          "Use Edit for precision.",
          "Use Color and Fairlight for finishing."
        ],
        "proTip": "Keyboard shortcuts differ by page—learn them.",
        "commonMistake": "Trying to do everything on the Edit page.",
        "htmlSlidePath": "slides/davinci-resolve/interface-overview.html",
        "htmlSlideId": "interface-overview",
        "images": []
      },
      {
        "id": "editing-project-setup",
        "number": "58",
        "tab": "editing",
        "category": "GETTING STARTED",
        "title": "Project Setup (Resolution, Frame Rate, Proxy Workflow)",
        "type": "static",
        "description": "Project setup defines your entire workflow. It matters because wrong settings cause major problems later.",
        "guide": "Set resolution and frame rate before importing footage. Use proxies for heavy files. Match project settings to delivery requirements. Good setup prevents rework and timeline issues.",
        "keyRule": "Set frame rate before importing anything.",
        "steps": [
          "Create new project.",
          "Set resolution and frame rate.",
          "Enable proxy generation.",
          "Import footage."
        ],
        "proTip": "Use 1080p proxies for smooth editing.",
        "commonMistake": "Changing frame rate mid‑project.",
        "images": []
      },
      {
        "id": "editing-importing",
        "number": "59",
        "tab": "editing",
        "category": "GETTING STARTED",
        "title": "Importing & Organizing Footage",
        "type": "static",
        "description": "Organization saves hours in post. It matters because messy timelines slow everything down.",
        "guide": "Use bins for scenes, cameras, and audio. Rename clips clearly. Add markers and notes. Good organization makes editing faster and more creative.",
        "keyRule": "Organize before you edit.",
        "steps": [
          "Create bins by category.",
          "Rename clips.",
          "Add markers for key moments.",
          "Sync audio early."
        ],
        "proTip": "Color‑code clips by camera.",
        "commonMistake": "Dumping everything into one bin.",
        "images": []
      },
      {
        "id": "editing-basic-cut",
        "number": "60",
        "tab": "editing",
        "category": "GETTING STARTED",
        "title": "Basic Cut (Razor Tool, Trim, Ripple Edit)",
        "type": "static",
        "description": "Basic cutting shapes your story. It matters because editing is rhythm.",
        "guide": "Use the razor tool to split clips. Trim to tighten pacing. Ripple edits close gaps automatically. Mastering these basics makes your timeline clean and intentional.",
        "keyRule": "Cut with purpose, not habit.",
        "steps": [
          "Use razor to split.",
          "Trim excess.",
          "Ripple to close gaps.",
          "Rewatch for pacing."
        ],
        "proTip": "Cut on action for smoother transitions.",
        "commonMistake": "Leaving unnecessary handles.",
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
        "number": "61",
        "tab": "editing",
        "category": "COLOR GRADING",
        "title": "Color Wheels (Lift, Gamma, Gain)",
        "type": "html_presentation",
        "description": "Lift, Gamma, and Gain control shadows, midtones, and highlights. They matter because they shape the entire tonal balance.",
        "guide": "Lift adjusts shadows. Gamma adjusts midtones. Gain adjusts highlights. Use small adjustments to avoid breaking the image. Color wheels are the foundation of grading.",
        "keyRule": "Adjust wheels gently—small moves go far.",
        "steps": [
          "Balance exposure with Lift/Gamma/Gain.",
          "Adjust color balance.",
          "Add contrast.",
          "Refine skin tones."
        ],
        "proTip": "Use scopes, not your eyes alone.",
        "commonMistake": "Crushing shadows too early.",
        "htmlSlidePath": "slides/davinci-resolve/color-wheels.html",
        "htmlSlideId": "color-wheels",
        "images": []
      },
      {
        "id": "editing-curves",
        "number": "62",
        "tab": "editing",
        "category": "COLOR GRADING",
        "title": "Curves (RGB and Luma)",
        "type": "html_presentation",
        "description": "Curves give precise control over contrast and color. They matter because they allow fine‑tuning.",
        "guide": "Use the luma curve for contrast. Use RGB curves for color shifts. Anchor points control specific tonal ranges. Curves are powerful but easy to overdo—use restraint.",
        "keyRule": "Use curves to refine, not replace, basic grading.",
        "steps": [
          "Add anchor points.",
          "Adjust luma for contrast.",
          "Use RGB for color shifts.",
          "Check scopes."
        ],
        "proTip": "S‑curves add cinematic contrast.",
        "commonMistake": "Over‑bending curves and creating artifacts.",
        "htmlSlidePath": "slides/davinci-resolve/curves.html",
        "htmlSlideId": "curves",
        "images": []
      },
      {
        "id": "editing-log-workflow",
        "number": "63",
        "tab": "editing",
        "category": "COLOR GRADING",
        "title": "Shooting Log Footage — Why and How",
        "type": "static",
        "description": "Log footage captures more dynamic range. It matters because it gives you more control in grading.",
        "guide": "Log looks flat but holds detail. Expose slightly brighter to protect shadows. Use LUTs to preview the final look. Log is ideal for cinematic work.",
        "keyRule": "Expose Log brighter than standard profiles.",
        "steps": [
          "Enable Log profile.",
          "Expose to protect shadows.",
          "Use monitoring LUT.",
          "Grade in Color page."
        ],
        "proTip": "ETTR (Expose To The Right) helps Log footage shine.",
        "commonMistake": "Underexposing Log and getting noise.",
        "images": []
      },
      {
        "id": "editing-luts",
        "number": "64",
        "tab": "editing",
        "category": "COLOR GRADING",
        "title": "LUTs — What They Are and How to Use Them",
        "type": "static",
        "description": "LUTs apply preset color transformations. They matter because they speed up grading.",
        "guide": "Use technical LUTs to convert Log to Rec.709. Use creative LUTs for style. Apply LUTs early in the node tree. Adjust intensity to avoid over‑processing.",
        "keyRule": "Use LUTs as a starting point, not the final grade.",
        "steps": [
          "Add LUT in first node.",
          "Adjust exposure.",
          "Adjust contrast.",
          "Refine color."
        ],
        "proTip": "Lower LUT opacity for subtlety.",
        "commonMistake": "Relying on LUTs without adjusting anything else.",
        "images": []
      },
      {
        "id": "editing-skin-tone",
        "number": "65",
        "tab": "editing",
        "category": "COLOR GRADING",
        "title": "Skin Tone Correction",
        "type": "html_presentation",
        "description": "Skin tones must look natural and consistent. They matter because viewers judge skin instantly and unforgivingly.",
        "guide": "Use the vectorscope to keep skin aligned with the skin‑tone line. Adjust hue and saturation in small increments to avoid plastic or alien tones. Qualify skin only when necessary—broad adjustments usually look more natural. Always balance exposure before touching color. Skin tone correction is subtle work, not heavy lifting.",
        "keyRule": "Keep skin on the skin‑tone line—never chase \"perfect,\" chase natural.",
        "steps": [
          "Open vectorscope and isolate skin region.",
          "Adjust hue/sat until skin sits on the line.",
          "Balance exposure before refining color.",
          "Use qualifiers only when global adjustments fail."
        ],
        "proTip": "Check skin under multiple lighting conditions—grading for one angle can break another.",
        "commonMistake": "Oversaturating skin to \"make it pop.\"",
        "htmlSlidePath": "slides/davinci-resolve/skin-tone-correction.html",
        "htmlSlideId": "skin-tone-correction",
        "images": []
      },
      {
        "id": "editing-scopes",
        "number": "66",
        "tab": "editing",
        "category": "COLOR GRADING",
        "title": "Reading Waveforms & Scopes",
        "type": "html_presentation",
        "description": "Waveforms and scopes show the truth about your image. They matter because monitors lie.",
        "guide": "The waveform reads luminance. The RGB parade shows color balance. The vectorscope shows hue and saturation—especially the skin tone line on the yellow-red axis. Trust scopes over your eyes, especially on LOG footage and uncalibrated displays.",
        "keyRule": "Grade with scopes, not the monitor.",
        "steps": [
          "Read the waveform for exposure—skin sits ~50–70 IRE on Rec.709.",
          "Check the parade for RGB balance on neutrals.",
          "Use the vectorscope—keep skin on the skin tone line.",
          "Calibrate your monitor annually—scopes do not lie."
        ],
        "proTip": "Histogram alone lies on LOG—use the waveform for exposure.",
        "commonMistake": "Grading by eye on an uncalibrated display.",
        "htmlSlidePath": "slides/davinci-resolve/scopes.html",
        "htmlSlideId": "scopes",
        "images": []
      },
      {
        "id": "editing-nodes",
        "number": "67",
        "tab": "editing",
        "category": "COLOR GRADING",
        "title": "Node Structure (Serial, Parallel, Layer)",
        "type": "html_presentation",
        "description": "Node structure organizes your grade into repeatable steps. It matters because messy node trees break consistency.",
        "guide": "Serial nodes stack in order. Parallel nodes split the image. Layer nodes combine passes. Build prep → look → skin → background so changes stay isolated and match cuts stay easier.",
        "keyRule": "Structure nodes before you chase a look.",
        "steps": [
          "Input transform and exposure normalize.",
          "Spatial NR and exposure zones if needed.",
          "Creative look node.",
          "Dedicated skin and background nodes."
        ],
        "proTip": "Export node stills for match reference on long projects.",
        "commonMistake": "One giant node that does everything.",
        "htmlSlidePath": "slides/davinci-resolve/node-structure.html",
        "htmlSlideId": "node-structure",
        "images": []
      },
      {
        "id": "editing-match-cut-grade",
        "number": "68",
        "tab": "editing",
        "category": "COLOR GRADING",
        "title": "Matching Shots in a Sequence",
        "type": "static",
        "description": "Matching shots keeps cuts invisible. It matters because viewers notice color shifts before story gaps.",
        "guide": "Match luminance first, then color balance, then saturation. Match skin before background—the eye reads faces first. Use Color Trace or manual wheel matching on shared neutral gray. Grade B-shots to your hero A-shot, not to a middle ground.",
        "keyRule": "Match skin before you match the environment.",
        "steps": [
          "Split-screen stills of both shots in the gallery.",
          "Match luminance, then color balance, then saturation.",
          "Use Color Trace or wheels on shared neutral gray.",
          "Export a reference still from the hero shot."
        ],
        "proTip": "Fix exposure before you chase hue.",
        "commonMistake": "Averaging two looks instead of matching to the hero.",
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
        "number": "69",
        "tab": "editing",
        "category": "TRANSITIONS & EFFECTS",
        "title": "Hard Cut",
        "type": "static",
        "description": "The hard cut is the most powerful transition. It matters because it stays invisible when performance and composition align.",
        "guide": "A hard cut is the default—no effect, just the next shot. Cut on movement so the edit hides in motion blur. Match eyeline and screen direction so geography makes sense. Let audio lead with J-cuts when dialogue needs to breathe. Hard cut to music downbeats so rhythm drives the story.",
        "keyRule": "Cut with intention—on action, beat, or story reason.",
        "steps": [
          "Cut on movement—not mid-blink unless intentional.",
          "Match eyeline and screen direction.",
          "Use audio lead-ins when video feels abrupt.",
          "Sync major cuts to music downbeats when scoring."
        ],
        "proTip": "Audio hides harder video cuts than another transition.",
        "commonMistake": "Cutting without rhythm—every line gets a cut.",
        "images": []
      },
      {
        "id": "editing-match-cut-transition",
        "number": "70",
        "tab": "editing",
        "category": "TRANSITIONS & EFFECTS",
        "title": "Match Cut",
        "type": "static",
        "description": "A match cut links two scenes through shape, color, or motion. It matters because continuity through form feels intentional.",
        "guide": "Find similar geometry between shots—circle to circle, line to line. Pre-plan on set so size and position match in frame. Color-match unrelated scenes in grade before the cut. Motion match: subject exits frame right, new subject enters frame right. Hold the cut long enough for the audience to catch the link.",
        "keyRule": "Match shape or motion—not just proximity in the timeline.",
        "steps": [
          "Find similar geometry between shots.",
          "Pre-plan size and position on set.",
          "Color-match scenes before the cut.",
          "Hold the match 12–24 frames so the link reads."
        ],
        "proTip": "Object match cuts need rehearsal—do not wing them in post.",
        "commonMistake": "Cutting too fast—the audience misses the connection.",
        "images": []
      },
      {
        "id": "editing-dissolve",
        "number": "71",
        "tab": "editing",
        "category": "TRANSITIONS & EFFECTS",
        "title": "Dissolve",
        "type": "static",
        "description": "A dissolve blends one shot into the next. It matters because it signals time passing or a dreamlike shift.",
        "guide": "Standard dissolves run 12–24 frames—longer feels dated unless intentional. Dissolve over black for act breaks and time jumps. Cross-dissolve dialogue only when the space is the same but time changes. Avoid dissolves when hard-cut energy is needed. Sound bridges under dissolves sell the transition.",
        "keyRule": "Use dissolves for time or tone—not as a default.",
        "steps": [
          "Set dissolve length—12–24 frames for most work.",
          "Dissolve over black for act breaks.",
          "Cross-dissolve dialogue only in same space.",
          "Bridge audio under the dissolve."
        ],
        "proTip": "One dissolve per act feels cinematic—more feels like a montage.",
        "commonMistake": "Dissolving action sequences that need hard-cut energy.",
        "images": []
      },
      {
        "id": "editing-whip-pan-transition",
        "number": "72",
        "tab": "editing",
        "category": "TRANSITIONS & EFFECTS",
        "title": "Whip Pan Transition",
        "type": "html_presentation",
        "description": "A whip pan transition connects scenes with blur and energy. It matters because motion hides the cut.",
        "guide": "Shoot whip out and whip in at the same speed and direction on set. Cut at peak blur—neither frame should be sharp at the edit point. In post, directional blur 2–4 frames each side can fake the move. Sync to a whoosh SFX or music transient. Cap at two or three per minute—overuse feels like a template.",
        "keyRule": "Match direction and speed—or the cut feels accidental.",
        "steps": [
          "Shoot whip out and whip in on set.",
          "Cut at peak blur on both sides.",
          "Add directional blur in post if needed.",
          "Sync to whoosh SFX or a music hit."
        ],
        "proTip": "Plan the exit and entry framing before the first whip.",
        "commonMistake": "Mixing whip directions in the same sequence.",
        "htmlSlidePath": "slides/camera-motion/whip-pan.html",
        "htmlSlideId": "whip-pan",
        "images": []
      },
      {
        "id": "editing-jl-cut",
        "number": "73",
        "tab": "editing",
        "category": "TRANSITIONS & EFFECTS",
        "title": "J-Cut & L-Cut",
        "type": "static",
        "description": "J-cuts and L-cuts offset audio and video edits. They matter because dialogue scenes feel natural instead of choppy.",
        "guide": "In an L-cut, you hear the next scene before you see it—it builds anticipation. In a J-cut, you see the next scene while the previous audio finishes—it smooths the exit. Unlink audio and extend under B-roll for interviews. Do not J/L every line—the pattern becomes noticeable.",
        "keyRule": "Let audio lead or trail video when it serves the story.",
        "steps": [
          "L-cut: audio from next scene leads the picture.",
          "J-cut: picture changes while audio continues.",
          "Unlink audio and extend under B-roll.",
          "Use sparingly—pattern every line feels edited."
        ],
        "proTip": "Question on camera, answer over B-roll—classic interview L-cut.",
        "commonMistake": "J/L-cutting every line in a dialogue scene.",
        "images": []
      },
      {
        "id": "editing-hand-draw-overlay",
        "number": "74",
        "tab": "editing",
        "category": "TRANSITIONS & EFFECTS",
        "title": "Hand-Draw Overlay Transition",
        "type": "static",
        "description": "Hand-draw overlays add sketch-style emphasis between or over shots. They matter because they signal tutorial or explainer energy.",
        "guide": "Build strokes in Fusion with slight wobble—avoid perfect vector lines for a hand-drawn feel. Animate draw-on with stroke reveal or write-on. Use for tutorials and explainers, not every corporate frame. Match line weight to platform—thicker for mobile 9:16. Export with alpha for flexibility on the Cut page.",
        "keyRule": "Hand-draw should clarify—not decorate every frame.",
        "steps": [
          "Create wobbly white strokes in Fusion.",
          "Animate draw-on or write-on.",
          "Use for tutorial moments only.",
          "Export with alpha for reuse."
        ],
        "proTip": "Thicker strokes read on phone screens at arm's length.",
        "commonMistake": "Perfect vector lines that read as motion graphics, not sketch.",
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
        "number": "75",
        "tab": "editing",
        "category": "AUDIO",
        "title": "Fairlight Basics (EQ, Compression, Levels)",
        "type": "html_presentation",
        "description": "Fairlight is Resolve's audio page for mix and delivery. It matters because bad audio kills good footage.",
        "guide": "Normalize dialogue to -18 to -14 LUFS integrated for web. High-pass at 80–100Hz on lavs to remove rumble. Light compression at 3:1 on dialogue—2–3dB gain reduction max. Duck music 6–10dB under dialogue with sidechain when needed. Finish with a limiter on the master bus—true peak -1dB for streaming.",
        "keyRule": "Dialogue clarity beats loud music every time.",
        "steps": [
          "Normalize dialogue to web LUFS targets.",
          "High-pass lavs at 80–100Hz.",
          "Apply light compression on dialogue.",
          "Limit the master bus to -1dB true peak."
        ],
        "proTip": "Mix with monitors at conversation level—not blasted.",
        "commonMistake": "Over-compressing dialogue until it sounds robotic.",
        "htmlSlidePath": "slides/davinci-resolve/fairlight-basics.html",
        "htmlSlideId": "fairlight-basics",
        "images": []
      },
      {
        "id": "editing-music-licensing",
        "number": "76",
        "tab": "editing",
        "category": "AUDIO",
        "title": "Music Licensing — Where to Get It Legally",
        "type": "static",
        "description": "Music licensing clears you to publish and invoice clients. It matters because strikes and lawsuits are expensive.",
        "guide": "Stock libraries spell out broadcast vs social scope in each tier. Save license PDFs per track in the project folder—Artlist, Epidemic, Musicbed, and similar. Commercial Top 40 needs a sync license—platforms will strike without it. Custom score needs a work-for-hire agreement in writing before delivery. Add credits to descriptions when the license requires it.",
        "keyRule": "No license on file means no publish.",
        "steps": [
          "Check license tier for your delivery scope.",
          "Save license PDF per track in the project folder.",
          "Get sync licenses for commercial tracks.",
          "Put required credits in the description."
        ],
        "proTip": "Name tracks in the timeline the same as the license file.",
        "commonMistake": "Assuming a subscription covers client broadcast use.",
        "images": []
      },
      {
        "id": "editing-sound-design",
        "number": "77",
        "tab": "editing",
        "category": "AUDIO",
        "title": "Sound Design (Ambience, Foley, SFX)",
        "type": "static",
        "description": "Sound design layers ambience, foley, and SFX under picture. It matters because edits feel empty without it.",
        "guide": "Build a library—whoosh, impact, riser, room tone. One subtle whoosh per whip pan or logo reveal, not every cut. Layer two or three impacts for trailer hits: low thump, mid crack, high transient. Room tone under every scene—thirty seconds recorded on set fills gaps. Mix SFX 3–6dB under dialogue so they are felt, not heard.",
        "keyRule": "Sound supports the story—it does not compete with dialogue.",
        "steps": [
          "Organize SFX by category in a library.",
          "Add one whoosh per major motion transition.",
          "Layer impacts for trailer-style hits.",
          "Bed room tone under every scene."
        ],
        "proTip": "Record thirty seconds of room tone on every location.",
        "commonMistake": "Whoosh on every cut—viewers tune it out.",
        "images": []
      },
      {
        "id": "editing-dialogue-cleanup",
        "number": "78",
        "tab": "editing",
        "category": "AUDIO",
        "title": "Dialogue Cleanup (Noise Reduction)",
        "type": "html_presentation",
        "description": "Dialogue cleanup fixes location audio before anyone else hears it. It matters because noise reduction is not optional on client work.",
        "guide": "Learn a noise profile from a room-tone snippet in RX or Fairlight. De-plosive and de-ess lightly—over-processing sounds robotic. Cut distracting breaths manually; do not remove all breath or speech feels uncanny. Align multicam audio to a single master lav. Keep original tracks muted but unprocessed as backup.",
        "keyRule": "Fix dialogue before you mix music.",
        "steps": [
          "Learn noise profile from room tone.",
          "De-plosive and de-ess lightly.",
          "Cut distracting breaths by hand.",
          "Keep unprocessed backups on muted tracks."
        ],
        "proTip": "Process a short section first—ears fatigue on long passes.",
        "commonMistake": "Heavy NR that turns voices into underwater radio.",
        "htmlSlidePath": "slides/davinci-resolve/dialogue-cleanup.html",
        "htmlSlideId": "dialogue-cleanup",
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
        "number": "79",
        "tab": "editing",
        "category": "EXPORT & DELIVERY",
        "title": "Instagram & TikTok Export Settings",
        "type": "static",
        "description": "Social exports target 9:16 vertical delivery. They matter because wrong specs get crushed on upload.",
        "guide": "Build a 1080×1920 timeline—reframe in a separate timeline, do not stretch 16:9. Export H.264 or H.265 at 10–15 Mbps for 1080×1920. Target -14 LUFS with -1dB true peak—phones normalize loud anyway. Keep text and faces inside the center 80% safe zone. Version every upload in the filename.",
        "keyRule": "Native vertical beats stretched horizontal.",
        "steps": [
          "Create a 1080×1920 delivery timeline.",
          "Export H.264 or H.265 at 10–15 Mbps.",
          "Mix audio to -14 LUFS, -1dB true peak.",
          "Keep faces and text inside the safe zone."
        ],
        "proTip": "Client_Platform_Date_v01—version every upload.",
        "commonMistake": "Stretching 16:9 into 9:16 instead of reframing.",
        "images": []
      },
      {
        "id": "editing-export-youtube",
        "number": "80",
        "tab": "editing",
        "category": "EXPORT & DELIVERY",
        "title": "YouTube Export Settings",
        "type": "static",
        "description": "YouTube exports favor high bitrate 16:9 masters. They matter because the platform re-encodes everything you send.",
        "guide": "Upload 4K when your source is 4K—YouTube re-encodes more generously at the 4K tier. Use H.264 high profile or H.265 for smaller files at similar quality. Target 35–45 Mbps for 4K30 and 50–68 for 4K60. Tag Rec.709 on export—untagged files shift color. Export a 1280×720 thumbnail still from the grade-final timeline.",
        "keyRule": "Upload the highest quality master your timeline supports.",
        "steps": [
          "Export 4K when source is 4K.",
          "Use H.264 high or H.265 at recommended bitrates.",
          "Tag Rec.709 on export.",
          "Pull a 1280×720 thumbnail still."
        ],
        "proTip": "Add chapters in the description for 8+ minute videos.",
        "commonMistake": "Untagged color—playback shifts on other devices.",
        "images": []
      },
      {
        "id": "editing-export-client",
        "number": "81",
        "tab": "editing",
        "category": "EXPORT & DELIVERY",
        "title": "Client Delivery (ProRes, File Naming, Handoff)",
        "type": "static",
        "description": "Client delivery packages masters, proxies, and paperwork. It matters because unclear handoffs create revision loops.",
        "guide": "Ask deliverable specs upfront—codec, resolution, fps, aspect ratios. Deliver ProRes 422 HQ for archive and re-export. Include an H.264 review file with optional timecode burn-in. Split stems—dialogue, music, SFX—when the contract requires it. Confirm frame counts or checksums on long-form delivery.",
        "keyRule": "Written spec before edit beats guessing at delivery.",
        "steps": [
          "Confirm codec, resolution, fps, and aspects in writing.",
          "Export ProRes 422 HQ master.",
          "Deliver H.264 review with optional timecode.",
          "Include stems and delivery confirmation when required."
        ],
        "proTip": "One delivery letter per version—what changed and what to review.",
        "commonMistake": "Delivering only H.264 when the contract asked for ProRes.",
        "images": []
      },
      {
        "id": "editing-export-archive",
        "number": "82",
        "tab": "editing",
        "category": "EXPORT & DELIVERY",
        "title": "Archive & Backup Strategy",
        "type": "static",
        "description": "Archiving preserves projects for years. It matters because future-you needs to reopen the job in two years.",
        "guide": "Archive flat video, separate audio, and the XML or DRP project. Use folders: Project, Media, Exports, Licenses, Documents. Export grade stills and node stills for match reference. Document LUTs, fonts, and plugins with version numbers. Keep a cold-storage copy on a second drive—one drive is not backup.",
        "keyRule": "Archive the project file—not just the export.",
        "steps": [
          "Save flat video, audio, and project file.",
          "Use a consistent folder structure.",
          "Export grade and node stills.",
          "Mirror to cold storage on a second drive."
        ],
        "proTip": "Note Resolve version in the archive readme.",
        "commonMistake": "Only keeping the H.264 export and deleting media.",
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
        "number": "83",
        "tab": "strategy",
        "category": "PLATFORM MASTERY",
        "title": "Instagram Reels — Hook, Pacing, Caption Strategy",
        "type": "html_presentation",
        "description": "Instagram Reels reward hooks, pacing, and captions in the first seconds. They matter because the scroll decision happens instantly.",
        "guide": "Hook in frame one—face, action, or bold text before the swipe. Shoot native 9:16 in camera, not stretched in post. Burn captions on-screen—most viewers watch muted. Keep most reels in the 15–30 second sweet spot for completion. Post when your audience is active according to insights, not generic best-time lists.",
        "keyRule": "Win the first 1.5 seconds or lose the viewer.",
        "steps": [
          "Open with a visual hook in frame one.",
          "Shoot native 9:16 vertical.",
          "Add on-screen captions for muted viewing.",
          "Post when insights show your audience is active."
        ],
        "proTip": "Motion in the opening frame beats a static title card.",
        "commonMistake": "Stretching 16:9 into vertical instead of reframing.",
        "htmlSlidePath": "slides/strategy/instagram-reels.html",
        "htmlSlideId": "instagram-reels",
        "images": []
      },
      {
        "id": "strategy-tiktok",
        "number": "84",
        "tab": "strategy",
        "category": "PLATFORM MASTERY",
        "title": "TikTok — Native Feel, Trending Audio, Retention",
        "type": "html_presentation",
        "description": "TikTok rewards native, lo-fi content and retention loops. It matters because over-produced ads get skipped.",
        "guide": "Shoot lo-fi when the brand allows—polished reads as an ad. Match the end frame to the start for seamless loops—the algorithm rewards rewatches. Use trending audio inside your niche quickly—stale trends hurt reach. Reply to comments with video to double content and boost engagement. Put hook text in the first half-second and state the payoff immediately.",
        "keyRule": "Native feel beats polished unless the brand demands polish.",
        "steps": [
          "Match end frame to start for loops.",
          "Use trending audio while it is still fresh.",
          "Reply to comments with video.",
          "State the payoff in the first 0.5 seconds."
        ],
        "proTip": "Lo-fi BTS often outperforms glossy hero edits on TikTok.",
        "commonMistake": "Recycling Instagram polish without adapting pacing.",
        "htmlSlidePath": "slides/strategy/tiktok-native.html",
        "htmlSlideId": "tiktok-native",
        "images": []
      },
      {
        "id": "strategy-youtube",
        "number": "85",
        "tab": "strategy",
        "category": "PLATFORM MASTERY",
        "title": "YouTube — Titles, Thumbnails, Retention Arc",
        "type": "html_presentation",
        "description": "YouTube is won in the thumbnail, title, and retention graph. They matter because click-through and watch time drive distribution.",
        "guide": "Deliver the title promise in the first thirty seconds. Pattern interrupt every thirty to forty-five seconds—B-roll, graphics, angle changes. Add chapters on videos over eight minutes for session time and snippets. One clear end-screen CTA in the last twenty seconds—not three competing links. A/B test thumbnails—swap if CTR stays under 4% after forty-eight hours.",
        "keyRule": "Thumbnail and title must promise what the video delivers.",
        "steps": [
          "Deliver the title promise in the first 30 seconds.",
          "Pattern interrupt every 30–45 seconds.",
          "Add chapters on 8+ minute videos.",
          "A/B test thumbnails before a wide push."
        ],
        "proTip": "Design the thumbnail before you write the script.",
        "commonMistake": "Clickbait titles with slow payoffs—retention collapses.",
        "htmlSlidePath": "slides/strategy/youtube-titles-thumbs.html",
        "htmlSlideId": "youtube-titles-thumbs",
        "images": []
      },
      {
        "id": "strategy-linkedin",
        "number": "86",
        "tab": "strategy",
        "category": "PLATFORM MASTERY",
        "title": "LinkedIn — Authority Content for B2B Creatives",
        "type": "static",
        "description": "LinkedIn rewards authority and insight for B2B creatives. It matters because professional context changes what performs.",
        "guide": "Make the first line the hook—it sits above the fold before see more. Native video autoplays muted—burn captions. Square and vertical both work—test with your audience. Document carousels carry frameworks—export PDF slides from your toolkit content. Comment in your niche within thirty minutes of publishing—early engagement lifts reach.",
        "keyRule": "Lead with insight, not gear flex.",
        "steps": [
          "Write the hook in the first line.",
          "Burn captions on native video.",
          "Test square vs vertical with your audience.",
          "Engage in your niche within 30 minutes of posting."
        ],
        "proTip": "Carousels teach—short video proves you can execute.",
        "commonMistake": "Posting Instagram reels unchanged—tone feels off.",
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
        "number": "87",
        "tab": "strategy",
        "category": "CREATOR BUSINESS",
        "title": "Pricing Your Work — Day Rates, Project Rates, Packages",
        "type": "static",
        "description": "Pricing determines your sustainability and positioning. It matters because undercharging destroys margins and attracts the wrong clients.",
        "guide": "Day rates work when you're selling time. Project rates work when you're selling outcomes. Packages work when you want recurring revenue and predictable scope. Anchor high, define deliverables clearly, and remove ambiguity. Pricing is not about what you're \"worth\"—it's about the value and clarity you deliver.",
        "keyRule": "Price the outcome, not the hours.",
        "steps": [
          "Define deliverables with absolute clarity.",
          "Choose day rate, project rate, or package based on scope.",
          "Anchor with your highest package first.",
          "Set revision limits and payment terms upfront."
        ],
        "proTip": "Clients trust you more when your pricing is structured, not improvised.",
        "commonMistake": "Charging hourly for creative work and losing leverage.",
        "images": []
      },
      {
        "id": "strategy-client-communication",
        "number": "88",
        "tab": "strategy",
        "category": "CREATOR BUSINESS",
        "title": "Client Communication — Briefs, Contracts, Revisions",
        "type": "static",
        "description": "Clear communication prevents scope creep. It matters because misunderstandings cost time and money.",
        "guide": "Use briefs to define expectations. Use contracts to lock scope, payment, and timelines. Limit revisions and state them upfront. Good communication builds trust and repeat business.",
        "keyRule": "Document everything before you start.",
        "steps": [
          "Send a clear brief.",
          "Sign a contract.",
          "Define revision limits.",
          "Update clients proactively."
        ],
        "proTip": "Use templates to speed up onboarding.",
        "commonMistake": "Starting work without a signed agreement.",
        "images": []
      },
      {
        "id": "strategy-portfolio",
        "number": "89",
        "tab": "strategy",
        "category": "CREATOR BUSINESS",
        "title": "Building a Portfolio — What to Show and How to Frame It",
        "type": "static",
        "description": "Your portfolio is your proof of skill. It matters because clients judge you by what they see, not what you say.",
        "guide": "Show only your best work, not all your work. Curate by style or industry. Add context—what problem you solved and what outcome you delivered. A strong portfolio tells a story about your capabilities.",
        "keyRule": "Curate ruthlessly—quality beats quantity.",
        "steps": [
          "Pick 6–12 strong pieces.",
          "Add short project descriptions.",
          "Organize by category.",
          "Update quarterly."
        ],
        "proTip": "Lead with the work you want more of.",
        "commonMistake": "Including outdated or off‑brand projects.",
        "images": []
      },
      {
        "id": "strategy-niche-vs-identity",
        "number": "90",
        "tab": "strategy",
        "category": "CREATOR BUSINESS",
        "title": "Niche vs Identity — The 2026 Creator Positioning Shift",
        "type": "static",
        "description": "Creators are shifting from narrow niches to broader identities. It matters because audiences follow people, not categories.",
        "guide": "A niche gives clarity, but an identity gives longevity. Build around your worldview, values, and creative style. Let your niche be a doorway, not a cage. Identity‑driven creators adapt as platforms evolve.",
        "keyRule": "Lead with identity, support with niche.",
        "steps": [
          "Define your creative identity.",
          "Choose a niche as your entry point.",
          "Expand into adjacent topics.",
          "Build a brand around your voice."
        ],
        "proTip": "Identity scales; niches expire.",
        "commonMistake": "Locking into a niche you outgrow.",
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
        "number": "91",
        "tab": "strategy",
        "category": "CONTENT SYSTEMS",
        "title": "Batch Shooting — One Day, 30 Days of Content",
        "type": "html_presentation",
        "description": "Batch shooting compresses production into focused sessions. It matters because consistency beats intensity.",
        "guide": "Plan 10–15 scripts or outlines ahead of time. Shoot all A‑roll in one block. Capture B‑roll in another. Edit in batches. This system removes daily friction and keeps output steady.",
        "keyRule": "Separate planning, shooting, and editing into distinct phases.",
        "steps": [
          "Write 10–15 scripts.",
          "Shoot all A‑roll in one session.",
          "Capture B‑roll in bulk.",
          "Edit in batches."
        ],
        "proTip": "Use consistent lighting and framing to speed up shooting.",
        "commonMistake": "Trying to plan and shoot on the same day.",
        "htmlSlidePath": "slides/strategy/batch-shooting.html",
        "htmlSlideId": "batch-shooting",
        "images": []
      },
      {
        "id": "strategy-hook-formula",
        "number": "92",
        "tab": "strategy",
        "category": "CONTENT SYSTEMS",
        "title": "The Hook Formula — First 3 Seconds",
        "type": "html_presentation",
        "description": "The hook formula stops the scroll in the first three seconds. It matters because viewers decide before they hear your story.",
        "guide": "Use problem plus promise in two seconds—the viewer must know why to keep watching. Show the result first, then rewind to how with a visual hook. Controversy hooks work sparingly only when you deliver real value. Write ten hooks per idea and shoot the best two. The first frame needs a face or motion—static wide opens die.",
        "keyRule": "State the payoff before you ask for attention.",
        "steps": [
          "Write problem + promise in text and voice.",
          "Show the result first, then rewind.",
          "Draft ten hooks—shoot the best two.",
          "Open with a face or moving object."
        ],
        "proTip": "Read the hook out loud—if it sounds like an ad, rewrite it.",
        "commonMistake": "Slow intros that bury the promise after three seconds.",
        "htmlSlidePath": "slides/strategy/hook-formula.html",
        "htmlSlideId": "hook-formula",
        "images": []
      },
      {
        "id": "strategy-repurposing",
        "number": "93",
        "tab": "strategy",
        "category": "CONTENT SYSTEMS",
        "title": "Repurposing Content — One Video, Five Platforms",
        "type": "html_presentation",
        "description": "Repurposing multiplies your reach without multiplying your workload. It matters because every platform rewards different formats.",
        "guide": "Turn long‑form YouTube videos into shorts, carousels, tweets, and LinkedIn posts. Extract key insights and repackage them. Keep platform tone and pacing in mind. Repurposing is about reframing, not recycling.",
        "keyRule": "Adapt the message to the platform, not the other way around.",
        "steps": [
          "Start with a long‑form anchor video.",
          "Pull 5–10 short clips.",
          "Convert insights into text posts.",
          "Reformat visuals for each platform."
        ],
        "proTip": "Your best short‑form ideas usually come from long‑form content.",
        "commonMistake": "Posting the same edit everywhere without adapting it.",
        "htmlSlidePath": "slides/strategy/repurposing.html",
        "htmlSlideId": "repurposing",
        "images": []
      },
      {
        "id": "strategy-content-pillars",
        "number": "94",
        "tab": "strategy",
        "category": "CONTENT SYSTEMS",
        "title": "Content Pillars — The System That Makes You Consistent",
        "type": "html_presentation",
        "description": "Content pillars give your brand structure. They matter because consistency builds trust and accelerates growth.",
        "guide": "Choose 3–5 pillars that represent your identity, expertise, and audience needs. Every piece of content should map to one pillar. Pillars prevent burnout, eliminate decision fatigue, and keep your message coherent across platforms.",
        "keyRule": "Every post must serve a pillar.",
        "steps": [
          "Define 3–5 core pillars.",
          "Map ideas to pillars.",
          "Build weekly themes around them.",
          "Review and refine monthly."
        ],
        "proTip": "Your strongest pillar should produce 50% of your content.",
        "commonMistake": "Posting randomly without a strategic framework.",
        "htmlSlidePath": "slides/strategy/content-pillars.html",
        "htmlSlideId": "content-pillars",
        "images": []
      },
      {
        "id": "strategy-content-calendar",
        "number": "95",
        "tab": "strategy",
        "category": "CONTENT SYSTEMS",
        "title": "Content Calendar — Planning Without Losing Spontaneity",
        "type": "static",
        "description": "A content calendar keeps you consistent. It matters because consistency compounds.",
        "guide": "Plan themes weekly, not daily. Leave space for spontaneous posts. Use pillars to guide ideas. A good calendar gives structure without killing creativity.",
        "keyRule": "Plan the framework, not every post.",
        "steps": [
          "Define 3–5 content pillars.",
          "Assign themes to each week.",
          "Leave open slots for spontaneous ideas.",
          "Review performance monthly."
        ],
        "proTip": "Use recurring weekly formats to reduce decision fatigue.",
        "commonMistake": "Over‑planning and losing flexibility.",
        "images": []
      },
      {
        "id": "strategy-hooks-that-convert",
        "number": "96",
        "tab": "strategy",
        "category": "CONTENT SYSTEMS",
        "type": "html_presentation",
        "title": "Hooks That Convert — Specific Hook Types That Drive Action",
        "description": "Hooks that convert push viewers toward action, not just attention. They matter because retention without action is wasted effort.",
        "guide": "Use problem‑solution hooks to target pain points. Use \"myth‑busting\" hooks to challenge assumptions. Use \"here's what nobody tells you\" hooks to trigger curiosity. Use transformation hooks to show before/after value. Each hook type primes the viewer for a specific outcome.",
        "keyRule": "Choose hook type based on the action you want the viewer to take.",
        "steps": [
          "Identify the desired action.",
          "Pick a hook type that aligns with it.",
          "Write the hook before filming.",
          "Deliver the payoff quickly."
        ],
        "proTip": "Myth‑busting hooks have the highest share rate.",
        "commonMistake": "Using hooks that don't match the video's actual value.",
        "htmlSlidePath": "slides/strategy/hooks-convert.html",
        "htmlSlideId": "hooks-convert",
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
  "camera": 25,
  "framing": 16,
  "lighting": 15,
  "editing": 26,
  "strategy": 14
};
