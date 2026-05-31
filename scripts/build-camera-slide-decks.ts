/**
 * Generate data/slides JSON + assets/creators-toolkit HTML for 10 camera lessons.
 * Run: npx tsx scripts/build-camera-slide-decks.ts
 */
import * as fs from "fs";
import * as path from "path";
import { toolkitCategories } from "../data/toolkitCurriculum";
import type { Slide, SlideDeck } from "../data/toolkitSlideTypes";
import { resolveDiagramBundlePath } from "../data/toolkitSlideLinking";

const ROOT = path.resolve(__dirname, "..");
const SLIDES_DIR = path.join(ROOT, "data/slides");
const HTML_ROOT = path.join(ROOT, "assets/creators-toolkit");

interface CameraSlideSpec {
  curriculumId: string;
  lessonSnake: string;
  slideRef: string;
  htmlSlideId: string;
  htmlSubdir: string;
  topicLabel: string;
}

const SPECS: CameraSlideSpec[] = [
  {
    curriculumId: "camera-manual-mode",
    lessonSnake: "camera_manual_mode",
    slideRef: "slides_manual_mode",
    htmlSlideId: "manual-mode",
    htmlSubdir: "camera-shooting-modes",
    topicLabel: "SHOOTING MODES",
  },
  {
    curriculumId: "camera-aperture-priority",
    lessonSnake: "camera_aperture_priority",
    slideRef: "slides_aperture_priority",
    htmlSlideId: "aperture-priority",
    htmlSubdir: "camera-shooting-modes",
    topicLabel: "SHOOTING MODES",
  },
  {
    curriculumId: "camera-shutter-priority",
    lessonSnake: "camera_shutter_priority",
    slideRef: "slides_shutter_priority",
    htmlSlideId: "shutter-priority",
    htmlSubdir: "camera-shooting-modes",
    topicLabel: "SHOOTING MODES",
  },
  {
    curriculumId: "camera-picture-profiles",
    lessonSnake: "camera_picture_profiles",
    slideRef: "slides_picture_profiles",
    htmlSlideId: "picture-profiles",
    htmlSubdir: "camera-shooting-modes",
    topicLabel: "SHOOTING MODES",
  },
  {
    curriculumId: "camera-raw-vs-compressed",
    lessonSnake: "camera_raw_vs_compressed",
    slideRef: "slides_raw_vs_compressed",
    htmlSlideId: "raw-vs-compressed",
    htmlSubdir: "camera-shooting-modes",
    topicLabel: "SHOOTING MODES",
  },
  {
    curriculumId: "camera-handheld",
    lessonSnake: "camera_handheld",
    slideRef: "slides_handheld",
    htmlSlideId: "handheld",
    htmlSubdir: "camera-movement",
    topicLabel: "CAMERA MOVEMENT",
  },
  {
    curriculumId: "camera-gimbal",
    lessonSnake: "camera_gimbal",
    slideRef: "slides_gimbal",
    htmlSlideId: "gimbal",
    htmlSubdir: "camera-movement",
    topicLabel: "CAMERA MOVEMENT",
  },
  {
    curriculumId: "camera-static",
    lessonSnake: "camera_static",
    slideRef: "slides_static_locked",
    htmlSlideId: "static-locked",
    htmlSubdir: "camera-movement",
    topicLabel: "CAMERA MOVEMENT",
  },
  {
    curriculumId: "camera-dolly-slider",
    lessonSnake: "camera_dolly_slider",
    slideRef: "slides_dolly_slider",
    htmlSlideId: "dolly-slider",
    htmlSubdir: "camera-movement",
    topicLabel: "CAMERA MOVEMENT",
  },
  {
    curriculumId: "camera-whip-pan",
    lessonSnake: "camera_whip_pan",
    slideRef: "slides_camera_whip_pan",
    htmlSlideId: "camera-whip-pan",
    htmlSubdir: "camera-movement",
    topicLabel: "CAMERA MOVEMENT",
  },
];

function findLesson(curriculumId: string) {
  for (const cat of toolkitCategories) {
    const lesson = cat.lessons.find((l) => l.id === curriculumId);
    if (lesson) return lesson;
  }
  throw new Error(`Lesson not found: ${curriculumId}`);
}

function conceptBullets(description: string, guide: string, keyRule: string): string[] {
  const fromDesc = description
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
  const fromGuide = guide
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
  const bullets: string[] = [];
  if (fromDesc[0]) bullets.push(fromDesc[0]);
  if (fromDesc[1]) bullets.push(fromDesc[1]);
  else if (fromGuide[0]) bullets.push(fromGuide[0]);
  if (fromGuide[0] && !bullets.includes(fromGuide[0])) bullets.push(fromGuide[0]);
  if (keyRule && bullets.length < 3) bullets.push(keyRule);
  while (bullets.length < 2 && fromGuide.length) {
    const next = fromGuide.find((g) => !bullets.includes(g));
    if (next) bullets.push(next);
    else break;
  }
  return bullets.slice(0, 3);
}

function diagramPngPath(slideRef: string): string {
  const base = slideRef.replace(/^slides_/, "");
  return `ava/camera/${base}.png`;
}

function diagramHtmlSrc(image: string): string {
  const bundle = resolveDiagramBundlePath(image);
  return `../../../${bundle}`;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildDeck(spec: CameraSlideSpec): SlideDeck {
  const lesson = findLesson(spec.curriculumId);
  const steps = lesson.steps ?? [];
  const bullets = conceptBullets(
    lesson.description,
    lesson.guide ?? "",
    lesson.keyRule ?? "",
  );
  const diagramImage = diagramPngPath(spec.slideRef);
  const caption =
    lesson.guide?.split(/(?<=[.!?])\s+/)[0]?.trim() ?? lesson.description;

  const slides: Slide[] = [
    {
      type: "title",
      heading: lesson.title,
      subheading: lesson.keyRule,
    },
    {
      type: "concept",
      heading: "Why It Matters",
      bullets,
    },
    {
      type: "diagram",
      heading: "Visual Guide",
      image: diagramImage,
      caption,
    },
    {
      type: "steps",
      heading: "How To",
      steps,
    },
    {
      type: "callout",
      heading: "Pro Tip",
      text: lesson.proTip ?? "",
    },
    {
      type: "warning",
      heading: "Common Mistake",
      text: lesson.commonMistake ?? "",
    },
  ];

  return {
    id: spec.slideRef,
    lessonId: spec.lessonSnake,
    title: lesson.title,
    slides,
  };
}

function slideArticle(
  slide: Slide,
  htmlSlideId: string,
  topicLabel: string,
  index: number,
): string {
  const footer = `  <footer class="slide-footer">
    <span class="slide-tagline">CREATE WITHOUT LIMITS</span>
    <span class="slide-phrase">MADE FOR CREATORS BY CREATORS</span>
  </footer>`;

  const idAttr =
    slide.type === "title" ? ` id="${htmlSlideId}"` : "";

  switch (slide.type) {
    case "title":
      return `<!-- Slide ${index}: Title -->
<article class="slide format-carousel scale-preview"${idAttr} data-slide="title">
  <div class="presentation-slide">
    <span class="presentation-topic">AVA CREATORS TOOLKIT · CAMERA</span>
    <h1 class="presentation-heading">${escapeHtml(slide.heading)}</h1>
    ${slide.subheading ? `<p class="presentation-subheading">${escapeHtml(slide.subheading)}</p>` : ""}
  </div>
${footer}
</article>`;
    case "concept":
      return `<!-- Slide ${index}: Concept -->
<article class="slide format-carousel scale-preview" data-slide="concept">
  <div class="presentation-slide">
    <span class="presentation-topic">${topicLabel}</span>
    <h2 class="presentation-heading">${escapeHtml(slide.heading)}</h2>
    <div class="presentation-body">
      <ul class="presentation-bullets">
${slide.bullets.map((b) => `        <li>${escapeHtml(b)}</li>`).join("\n")}
      </ul>
    </div>
  </div>
${footer}
</article>`;
    case "diagram":
      return `<!-- Slide ${index}: Diagram -->
<article class="slide format-carousel scale-preview" data-slide="diagram">
  <div class="presentation-slide">
    <span class="presentation-topic">${topicLabel}</span>
    <h2 class="presentation-heading">${escapeHtml(slide.heading)}</h2>
    <div class="presentation-body">
      <div class="presentation-diagram-wrap">
        <img class="ava-diagram-img" src="${diagramHtmlSrc(slide.image)}" alt="" />
        ${slide.caption ? `<p class="presentation-caption">${escapeHtml(slide.caption)}</p>` : ""}
      </div>
    </div>
  </div>
${footer}
</article>`;
    case "steps":
      return `<!-- Slide ${index}: Steps -->
<article class="slide format-carousel scale-preview" data-slide="steps">
  <div class="presentation-slide">
    <span class="presentation-topic">${topicLabel}</span>
    <h2 class="presentation-heading">${escapeHtml(slide.heading)}</h2>
    <div class="presentation-body">
      <div class="presentation-steps">
${slide.steps
  .map(
    (s, i) => `        <div class="davinci-step">
          <span class="davinci-step-num">STEP ${i + 1}</span>
          <p>${escapeHtml(s)}</p>
        </div>`,
  )
  .join("\n")}
      </div>
    </div>
  </div>
${footer}
</article>`;
    case "callout":
      return `<!-- Slide ${index}: Callout -->
<article class="slide format-carousel scale-preview" data-slide="callout">
  <div class="presentation-slide">
    <span class="presentation-topic">${topicLabel}</span>
    <h2 class="presentation-heading">${escapeHtml(slide.heading)}</h2>
    <div class="presentation-body">
      <div class="presentation-callout">
        <span class="presentation-label">Pro Tip</span>
        <p>${escapeHtml(slide.text)}</p>
      </div>
    </div>
  </div>
${footer}
</article>`;
    case "warning":
      return `<!-- Slide ${index}: Warning -->
<article class="slide format-carousel scale-preview" data-slide="warning">
  <div class="presentation-slide">
    <span class="presentation-topic">${topicLabel}</span>
    <h2 class="presentation-heading">${escapeHtml(slide.heading)}</h2>
    <div class="presentation-body">
      <div class="presentation-warning">
        <span class="presentation-label">Watch Out</span>
        <p>${escapeHtml(slide.text)}</p>
      </div>
    </div>
  </div>
${footer}
</article>`;
    default:
      return "";
  }
}

function buildHtml(deck: SlideDeck, spec: CameraSlideSpec): string {
  const articles = deck.slides
    .map((s, i) => slideArticle(s, spec.htmlSlideId, spec.topicLabel, i + 1))
    .join("\n\n");
  const titleUpper = deck.title.toUpperCase();
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>AVA — ${titleUpper}</title>
  <link rel="stylesheet" href="../../css/ava-toolkit.css">
</head>
<body class="ava-preview">

${articles}

</body>
</html>
`;
}

function main() {
  fs.mkdirSync(SLIDES_DIR, { recursive: true });
  for (const spec of SPECS) {
    const deck = buildDeck(spec);
    const jsonPath = path.join(SLIDES_DIR, `${spec.slideRef}.json`);
    fs.writeFileSync(jsonPath, JSON.stringify(deck, null, 2) + "\n");

    const htmlDir = path.join(HTML_ROOT, "slides", spec.htmlSubdir);
    fs.mkdirSync(htmlDir, { recursive: true });
    const htmlPath = path.join(htmlDir, `${spec.htmlSlideId}.html`);
    fs.writeFileSync(htmlPath, buildHtml(deck, spec));
    console.log(`  ${spec.slideRef} → ${path.relative(ROOT, htmlPath)}`);
  }
  console.log(`Built ${SPECS.length} slide decks.`);
}

main();
