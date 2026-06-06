/**
 * Automated slide + curriculum QA (SLIDE_QA_CHECKLIST patterns).
 * Run: npx tsx scripts/verify-slide-qa.ts
 */
import * as fs from "fs";
import * as path from "path";
import { toolkitCategories, toolkitLessons, lessonCountByTab } from "../data/toolkitCurriculum";
import { LINKING_MAP, SLIDE_BLOCKS } from "../data/toolkitSlideTypes";
import { getHtmlSlideIdForLesson, htmlSlideIdForSlideRef } from "../data/toolkitSlideLinking";
import { SLIDE_DECK_IDS, getSlideDeck } from "../data/slides/index";

const ROOT = path.resolve(__dirname, "..");

const BUNDLED_HTML_PATHS = new Set(
  [...fs.readFileSync(path.join(ROOT, "data/toolkitSlideAssets.ts"), "utf8").matchAll(
    /"((?:slides\/)[^"]+\.html)":/g,
  )].map((m) => m[1]),
);

function isBundledHtmlSlidePath(htmlPath: string): boolean {
  return BUNDLED_HTML_PATHS.has(htmlPath);
}
const HTML_ROOT = path.join(ROOT, "assets/creators-toolkit");
const SLIDES_JSON_DIR = path.join(ROOT, "data/slides");

const CAMERA_SLIDE_REFS = [
  "slides_manual_mode",
  "slides_aperture_priority",
  "slides_shutter_priority",
  "slides_picture_profiles",
  "slides_raw_vs_compressed",
  "slides_handheld",
  "slides_gimbal",
  "slides_static_locked",
  "slides_dolly_slider",
  "slides_camera_whip_pan",
] as const;

const CAMERA_CURRICULUM_IDS = [
  "camera-manual-mode",
  "camera-aperture-priority",
  "camera-shutter-priority",
  "camera-picture-profiles",
  "camera-raw-vs-compressed",
  "camera-handheld",
  "camera-gimbal",
  "camera-static",
  "camera-dolly-slider",
  "camera-whip-pan",
];

interface Check {
  name: string;
  pass: boolean;
  detail?: string;
}

const checks: Check[] = [];

function add(name: string, pass: boolean, detail?: string) {
  checks.push({ name, pass, detail });
}

function main() {
  const content = JSON.parse(
    fs.readFileSync(path.join(ROOT, "data/toolkit-content.json"), "utf8"),
  );
  const contentIds = new Set(content.slides.map((s: { id: string }) => s.id));

  // Production tab
  const productionLessons = toolkitLessons.filter((l) => l.tab === "production");
  add(
    "Production lesson count = 11",
    productionLessons.length === 11,
    `got ${productionLessons.length}`,
  );
  add(
    "lessonCountByTab.production = 11",
    lessonCountByTab.production === 11,
    String(lessonCountByTab.production),
  );
  const contracts = toolkitLessons.find((l) => l.id === "production-contracts-kill-fees");
  add("Contracts & Kill Fees lesson exists", Boolean(contracts));
  add(
    "Contracts lesson has v2 fields",
    Boolean(
      contracts?.description &&
        contracts.guide &&
        contracts.keyRule &&
        contracts.steps?.length === 4 &&
        contracts.proTip &&
        contracts.commonMistake,
    ),
  );

  // Total lessons
  add("Total toolkit lessons = 108", toolkitLessons.length === 108, String(toolkitLessons.length));

  // 10 camera decks
  for (const ref of CAMERA_SLIDE_REFS) {
    const jsonPath = path.join(SLIDES_JSON_DIR, `${ref}.json`);
    add(`JSON deck exists: ${ref}`, fs.existsSync(jsonPath));
    const deck = getSlideDeck(ref);
    add(
      `6-slide structure: ${ref}`,
      deck?.slides.length === 6 &&
        ["title", "concept", "diagram", "steps", "callout", "warning"].every(
          (t, i) => deck.slides[i]?.type === t,
        ),
      deck ? String(deck.slides.length) : "missing",
    );
    add(`In SLIDE_DECK_IDS: ${ref}`, SLIDE_DECK_IDS.includes(ref as (typeof SLIDE_DECK_IDS)[number]));
    add(`In LINKING_MAP values: ${ref}`, Object.values(LINKING_MAP).includes(ref));
    add(`In BLOCK_1: ${ref}`, (SLIDE_BLOCKS.BLOCK_1 as readonly string[]).includes(ref));

    const htmlSlideId = htmlSlideIdForSlideRef(ref);
    add(`toolkit-content entry: ${htmlSlideId}`, contentIds.has(htmlSlideId));

    const lesson = toolkitLessons.find((l) => {
      const snake = Object.entries(LINKING_MAP).find(([, v]) => v === ref)?.[0];
      return snake && l.id === snake.replace(/_/g, "-");
    });
    if (!lesson) {
      const curriculumId = CAMERA_CURRICULUM_IDS[CAMERA_SLIDE_REFS.indexOf(ref)];
      const L = toolkitLessons.find((l) => l.id === curriculumId);
      add(`Curriculum html_presentation: ${curriculumId}`, L?.type === "html_presentation");
      if (L?.htmlSlidePath) {
        add(
          `HTML on disk: ${L.htmlSlidePath}`,
          fs.existsSync(path.join(HTML_ROOT, L.htmlSlidePath)),
        );
        add(
          `Bundled in toolkitSlideAssets: ${L.htmlSlidePath}`,
          isBundledHtmlSlidePath(L.htmlSlidePath),
        );
        if (L.htmlSlideId) {
          add(`htmlSlideId matches ref: ${L.htmlSlideId}`, L.htmlSlideId === htmlSlideId);
        }
      }
    }
  }

  for (const id of CAMERA_CURRICULUM_IDS) {
    const lesson = toolkitLessons.find((l) => l.id === id);
    add(`${id} → html_presentation`, lesson?.type === "html_presentation", lesson?.type);
    if (lesson?.htmlSlidePath) {
      add(`${id} HTML bundled`, isBundledHtmlSlidePath(lesson.htmlSlidePath));
    }
    const snake = id.replace(/-/g, "_");
    const slideRef = LINKING_MAP[snake];
    add(`${id} LINKING_MAP`, slideRef !== undefined, slideRef);
    if (slideRef) {
      const expectedHtmlId = getHtmlSlideIdForLesson(snake);
      add(
        `${id} htmlSlideId ↔ LINKING_MAP`,
        lesson?.htmlSlideId === expectedHtmlId,
        `${lesson?.htmlSlideId} vs ${expectedHtmlId}`,
      );
    }
  }

  const failed = checks.filter((c) => !c.pass);
  console.log(JSON.stringify({ pass: checks.length - failed.length, fail: failed.length, failed }, null, 2));
  process.exit(failed.length > 0 ? 1 : 0);
}

main();
