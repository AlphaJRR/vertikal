/**
 * One-shot migration: toolkitCurriculum + HTML slides → data/lessons + data/slides JSON.
 * Run: npx tsx scripts/migrate-canonical-architecture.ts
 */
import * as fs from "fs";
import * as path from "path";
import { toolkitCategories } from "../data/toolkitCurriculum";
import {
  KNOWN_LESSON_ID_MISMATCHES,
  slideRefToHtmlSlideId,
} from "../data/toolkitSlideLinking";
import { LINKING_MAP, type Slide, type SlideDeck } from "../data/toolkitSlideTypes";
import { getAvaDiagramBySlideRef } from "../data/avaDiagramManifest";

const ROOT = path.resolve(__dirname, "..");
const LESSONS_DIR = path.join(ROOT, "data/lessons");
const SLIDES_DIR = path.join(ROOT, "data/slides");
const HTML_ROOT = path.join(ROOT, "assets/creators-toolkit");
const AVA_ROOT = path.join(ROOT, "assets/ava");
const PLACEHOLDER = "ava/common/placeholder.png";

/** htmlSlideId → snake_case lesson id (LINKING_MAP keys) */
const HTML_TO_SNAKE: Record<string, string> = {};
for (const [snake, slideRef] of Object.entries(LINKING_MAP)) {
  HTML_TO_SNAKE[slideRefToHtmlSlideId(slideRef)] = snake;
}

/** curriculum kebab id → snake_case lesson id */
const CURRICULUM_TO_SNAKE: Record<string, string> = {};
for (const [snake, kebab] of Object.entries(KNOWN_LESSON_ID_MISMATCHES)) {
  CURRICULUM_TO_SNAKE[kebab] = snake;
}
for (const [snake] of Object.entries(LINKING_MAP)) {
  const kebab = snake.replace(/_/g, "-");
  if (!(kebab in CURRICULUM_TO_SNAKE)) {
    CURRICULUM_TO_SNAKE[kebab] = snake;
  }
}

function resolveSnakeId(curriculumId: string, htmlSlideId?: string): string {
  if (htmlSlideId && HTML_TO_SNAKE[htmlSlideId]) {
    return HTML_TO_SNAKE[htmlSlideId];
  }
  if (curriculumId in CURRICULUM_TO_SNAKE) {
    return CURRICULUM_TO_SNAKE[curriculumId];
  }
  return curriculumId.replace(/-/g, "_");
}

function resolveDiagramPath(rawPath: string, slideRef?: string): string {
  const normalized = rawPath.replace(/^\.\.\/+/, "").replace(/^assets\//, "");
  let avaPath = normalized.startsWith("ava/") ? normalized : `ava/${normalized}`;

  // Prefer manifest SVG when slideRef known
  if (slideRef) {
    const entry = getAvaDiagramBySlideRef(slideRef as keyof typeof LINKING_MAP extends string ? never : never);
    if (entry) {
      avaPath = `ava/${entry.category}/${entry.file}`;
    }
  }

  // Check disk: svg first, then png, else placeholder
  const rel = avaPath.replace(/^ava\//, "");
  const svgPath = path.join(AVA_ROOT, rel.replace(/\.png$/, ".svg"));
  const pngPath = path.join(AVA_ROOT, rel.endsWith(".png") ? rel : rel.replace(/\.svg$/, ".png"));
  const directPath = path.join(AVA_ROOT, rel);

  if (fs.existsSync(svgPath)) return `ava/${path.relative(AVA_ROOT, svgPath).replace(/\\/g, "/")}`;
  if (fs.existsSync(pngPath)) return `ava/${path.relative(AVA_ROOT, pngPath).replace(/\\/g, "/")}`;
  if (fs.existsSync(directPath)) return avaPath;
  return PLACEHOLDER;
}

function stripTags(html: string): string {
  return html.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
}

function parseHtmlSlideDeck(htmlPath: string, slideRef: string, lessonId: string, title: string): SlideDeck {
  const fullPath = path.join(HTML_ROOT, htmlPath.replace(/^slides\//, "slides/"));
  const html = fs.readFileSync(fullPath, "utf8");
  const articleRe = /<article[^>]*data-slide="([^"]+)"[^>]*>([\s\S]*?)<\/article>/g;
  const slides: Slide[] = [];
  let match: RegExpExecArray | null;

  while ((match = articleRe.exec(html)) !== null) {
    const slideType = match[1];
    const block = match[2];

    const h1 = block.match(/<h1[^>]*class="presentation-heading"[^>]*>([\s\S]*?)<\/h1>/);
    const h2 = block.match(/<h2[^>]*class="presentation-heading"[^>]*>([\s\S]*?)<\/h2>/);
    const sub = block.match(/<p[^>]*class="presentation-subheading"[^>]*>([\s\S]*?)<\/p>/);
    const heading = stripTags(h1?.[1] ?? h2?.[1] ?? title);

    switch (slideType) {
      case "title":
        slides.push({
          type: "title",
          heading,
          subheading: sub ? stripTags(sub[1]) : undefined,
        });
        break;
      case "concept": {
        const bullets: string[] = [];
        const liRe = /<li[^>]*>([\s\S]*?)<\/li>/g;
        let li: RegExpExecArray | null;
        while ((li = liRe.exec(block)) !== null) {
          bullets.push(stripTags(li[1]));
        }
        slides.push({ type: "concept", heading, bullets });
        break;
      }
      case "diagram": {
        const img = block.match(/<img[^>]*src="([^"]+)"/);
        const caption = block.match(/<p[^>]*class="presentation-caption"[^>]*>([\s\S]*?)<\/p>/);
        const rawImage = img?.[1] ?? PLACEHOLDER;
        slides.push({
          type: "diagram",
          heading,
          image: resolveDiagramPath(rawImage, slideRef),
          caption: caption ? stripTags(caption[1]) : undefined,
        });
        break;
      }
      case "steps": {
        const steps: string[] = [];
        const stepRe = /<div class="davinci-step"[^>]*>[\s\S]*?<p>([\s\S]*?)<\/p>/g;
        let step: RegExpExecArray | null;
        while ((step = stepRe.exec(block)) !== null) {
          steps.push(stripTags(step[1]));
        }
        slides.push({ type: "steps", heading, steps });
        break;
      }
      case "callout": {
        const text = block.match(/<div class="presentation-callout"[^>]*>[\s\S]*?<p>([\s\S]*?)<\/p>/);
        slides.push({
          type: "callout",
          heading,
          text: text ? stripTags(text[1]) : "",
        });
        break;
      }
      case "warning": {
        const text = block.match(/<div class="presentation-warning"[^>]*>[\s\S]*?<p>([\s\S]*?)<\/p>/);
        slides.push({
          type: "warning",
          heading,
          text: text ? stripTags(text[1]) : "",
        });
        break;
      }
      default:
        break;
    }
  }

  return { id: slideRef, lessonId, title, slides };
}

interface CanonicalLesson {
  id: string;
  tab: string;
  type: "STATIC" | "HTML_PRESENTATION";
  title: string;
  description: string;
  guide: string;
  keyRule: string;
  howTo: string[];
  proTip: string;
  commonMistake: string;
  slideRef?: string;
}

function main() {
  fs.mkdirSync(LESSONS_DIR, { recursive: true });
  fs.mkdirSync(SLIDES_DIR, { recursive: true });

  const audit = {
    lessonsWritten: 0,
    slidesWritten: 0,
    htmlWithoutSlideRef: [] as string[],
    slideRefMissingJson: [] as string[],
    brokenDiagrams: [] as string[],
    extraHtmlNotInLinkingMap: [] as string[],
  };

  const slideDeckByRef = new Map<string, SlideDeck>();

  // Generate slide decks from LINKING_MAP (31 canonical)
  for (const [lessonSnake, slideRef] of Object.entries(LINKING_MAP)) {
    const htmlSlideId = slideRefToHtmlSlideId(slideRef);
    let htmlPath: string | undefined;
    let title = slideRef.replace(/^slides_/, "").replace(/_/g, " ");

    for (const cat of toolkitCategories) {
      for (const lesson of cat.lessons) {
        if (lesson.htmlSlideId === htmlSlideId) {
          htmlPath = lesson.htmlSlidePath;
          title = lesson.title;
          break;
        }
      }
      if (htmlPath) break;
    }

    if (!htmlPath) {
      // Fallback: search toolkit-content paths
      const content = JSON.parse(fs.readFileSync(path.join(ROOT, "data/toolkit-content.json"), "utf8"));
      const slide = content.slides.find((s: { id: string }) => s.id === htmlSlideId);
      if (slide?.htmlPath) {
        htmlPath = slide.htmlPath;
        title = slide.title;
      }
    }

    if (!htmlPath) {
      audit.slideRefMissingJson.push(slideRef);
      continue;
    }

    const deck = parseHtmlSlideDeck(htmlPath, slideRef, lessonSnake, title);
    for (const s of deck.slides) {
      if (s.type === "diagram" && s.image === PLACEHOLDER) {
        audit.brokenDiagrams.push(`${slideRef}: ${s.image}`);
      }
    }
    slideDeckByRef.set(slideRef, deck);
    fs.writeFileSync(
      path.join(SLIDES_DIR, `${slideRef}.json`),
      JSON.stringify(deck, null, 2) + "\n",
    );
    audit.slidesWritten++;
  }

  // All curriculum lessons → data/lessons/*.json
  for (const cat of toolkitCategories) {
    for (const lesson of cat.lessons) {
      const snakeId = resolveSnakeId(lesson.id, lesson.htmlSlideId);
      const isHtml = lesson.type === "html_presentation";
      const slideRef: string | undefined = isHtml && lesson.htmlSlideId
        ? LINKING_MAP[snakeId] ?? HTML_TO_SNAKE[lesson.htmlSlideId]
        : undefined;

      if (isHtml && !slideRef) {
        audit.htmlWithoutSlideRef.push(`${lesson.id} (${lesson.htmlSlideId})`);
        if (lesson.htmlSlideId && !(lesson.htmlSlideId in HTML_TO_SNAKE)) {
          audit.extraHtmlNotInLinkingMap.push(lesson.htmlSlideId);
        }
      }

      const canonical: CanonicalLesson = {
        id: snakeId,
        tab: lesson.tab,
        type: isHtml ? "HTML_PRESENTATION" : "STATIC",
        title: lesson.title,
        description: lesson.description,
        guide: lesson.guide ?? "",
        keyRule: lesson.keyRule ?? "",
        howTo: lesson.steps ?? [],
        proTip: lesson.proTip ?? "",
        commonMistake: lesson.commonMistake ?? "",
        ...(slideRef ? { slideRef } : {}),
      };

      fs.writeFileSync(
        path.join(LESSONS_DIR, `${snakeId}.json`),
        JSON.stringify(canonical, null, 2) + "\n",
      );
      audit.lessonsWritten++;
    }
  }

  // Verify every slideRef has JSON
  for (const slideRef of Object.values(LINKING_MAP)) {
    const jsonPath = path.join(SLIDES_DIR, `${slideRef}.json`);
    if (!fs.existsSync(jsonPath)) {
      audit.slideRefMissingJson.push(slideRef);
    }
  }

  fs.writeFileSync(
    path.join(ROOT, "data/migration-audit.json"),
    JSON.stringify(audit, null, 2) + "\n",
  );

  console.log("Migration complete:");
  console.log(`  Lessons JSON: ${audit.lessonsWritten}`);
  console.log(`  Slides JSON:  ${audit.slidesWritten}`);
  console.log(`  HTML without slideRef: ${audit.htmlWithoutSlideRef.length}`, audit.htmlWithoutSlideRef);
  console.log(`  Extra HTML not in LINKING_MAP: ${audit.extraHtmlNotInLinkingMap.length}`, audit.extraHtmlNotInLinkingMap);
  console.log(`  Missing slide JSON: ${audit.slideRefMissingJson.length}`, audit.slideRefMissingJson);
  console.log(`  Broken diagram paths (placeholder): ${audit.brokenDiagrams.length}`);
}

main();
