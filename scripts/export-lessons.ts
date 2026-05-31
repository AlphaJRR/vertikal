/**
 * Export toolkitCurriculum → standalone lessons.ts (AVA Creator Toolkit format).
 * Run: npx tsx scripts/export-lessons.ts
 */
import * as fs from "fs";
import * as path from "path";
import {
  toolkitCategories,
} from "../data/toolkitCurriculum";
import { TOOLKIT_TABS, type ToolkitTab } from "../data/toolkitCurriculumTypes";

const OUTPUT_PATHS = [
  path.resolve(__dirname, "../data/lessons-export.ts"),
];

const TAB_LABELS: Record<ToolkitTab, string> = {
  camera: "CAMERA",
  framing: "FRAMING",
  lighting: "LIGHTING",
  editing: "DAVINCI",
  strategy: "STRATEGY",
  production: "PRODUCTION",
};

const FREE_LESSONS = [
  "iso",
  "aperture",
  "shutter-speed",
  "white-balance",
  "exposure-triangle",
  "frame-rates",
  "rule-of-thirds",
  "leading-lines",
  "symmetry",
  "negative-space",
  "shot-types-overview",
  "extreme-wide",
  "wide-shot",
  "medium-shot",
  "close-up",
  "extreme-close-up",
  "hard-vs-soft-light",
  "natural-light",
  "color-temperature",
  "interface-overview",
  "basic-cut",
  "instagram-reels-overview",
  "tiktok-overview",
  "youtube-overview",
  "linkedin-overview",
];

type ExportLessonType = "STATIC" | "HTML_PRESENTATION";

function mapType(type?: string): ExportLessonType {
  return type === "html_presentation" ? "HTML_PRESENTATION" : "STATIC";
}

function isPro(id: string): boolean {
  const slug = id.includes("-") ? id.slice(id.indexOf("-") + 1) : id;
  return !FREE_LESSONS.includes(slug);
}

function isV2Complete(lesson: {
  description?: string;
  guide?: string;
  keyRule?: string;
  steps?: string[];
  proTip?: string;
  commonMistake?: string;
}): boolean {
  return Boolean(
    lesson.description?.trim() &&
      lesson.guide?.trim() &&
      lesson.keyRule?.trim() &&
      lesson.steps?.length &&
      lesson.proTip?.trim() &&
      lesson.commonMistake?.trim(),
  );
}

function tsString(value: string, indent: string): string {
  if (!value.includes("\n") && !value.includes("`") && !value.includes("${")) {
    const escaped = value.replace(/\\/g, "\\\\").replace(/'/g, "\\'");
    if (escaped.length <= 80 && !/[\u2010-\u2015\u2018\u2019\u201c\u201d]/.test(value)) {
      return `'${escaped}'`;
    }
  }
  const escaped = value
    .replace(/\\/g, "\\\\")
    .replace(/`/g, "\\`")
    .replace(/\$\{/g, "\\${");
  const lines = escaped.split("\n");
  if (lines.length === 1) {
    return `\`${escaped}\``;
  }
  return "`" + lines.join("\n" + indent) + "`";
}

function formatLesson(
  lesson: (typeof toolkitCategories)[number]["lessons"][number],
  categoryId: string,
  indent: string,
): string {
  const lines: string[] = ["{"];
  const i = indent + "  ";
  const push = (key: string, value: string) => lines.push(`${i}${key}: ${value},`);

  push("id", `'${lesson.id}'`);
  push("number", `'${lesson.number}'`);
  push("tab", `'${lesson.tab}'`);
  push("category", `'${categoryId}'`);
  push("title", tsString(lesson.title, i));
  push("type", `'${mapType(lesson.type)}'`);
  push("isPro", String(isPro(lesson.id)));
  push("description", tsString(lesson.description ?? "", i));
  push("guide", tsString(lesson.guide ?? "", i));
  push("keyRule", tsString(lesson.keyRule ?? "", i));

  lines.push(`${i}steps: [`);
  for (const step of lesson.steps ?? []) {
    lines.push(`${i}  ${tsString(step, i + "  ")},`);
  }
  lines.push(`${i}],`);

  push("proTip", tsString(lesson.proTip ?? "", i));
  push("commonMistake", tsString(lesson.commonMistake ?? "", i));

  if (lesson.htmlSlidePath) push("htmlSlidePath", `'${lesson.htmlSlidePath}'`);
  if (lesson.htmlSlideId) push("htmlSlideId", `'${lesson.htmlSlideId}'`);

  lines.push(`${i}images: [],`);
  lines.push(`${indent}}`);
  return lines.join("\n");
}

function buildTabsSection(): string {
  const tabBlocks = TOOLKIT_TABS.map((tab) => {
    const categories = toolkitCategories.filter((c) => c.tab === tab.id);
    const catLines = categories.map((cat, idx) => {
      const eyebrow = `${TAB_LABELS[tab.id]} · ${String(idx + 1).padStart(2, "0")}`;
      return `      { id: '${cat.id}', tab: '${cat.tab}', title: '${cat.eyebrow.replace(/'/g, "\\'")}', eyebrow: '${eyebrow}', subtitle: '${cat.title.replace(/'/g, "\\'")}.' },`;
    });
    return `  {
    id: '${tab.id}',
    label: '${tab.label}',
    categories: [
${catLines.join("\n")}
    ],
  },`;
  });
  return tabBlocks.join("\n");
}

function buildLessonCountSection(lessons: { tab: ToolkitTab }[]): string {
  const counts = {} as Record<ToolkitTab, number>;
  for (const tab of TOOLKIT_TABS) counts[tab.id] = 0;
  for (const lesson of lessons) counts[lesson.tab]++;
  const entries = TOOLKIT_TABS.map(({ id }) => `  '${id}': ${counts[id]},`).join("\n");
  return `export const lessonCountByTab: Record<TabId, number> = {\n${entries}\n}`;
}

function buildExport(today: string, total: number, v2Complete: number): string {
  const lessons = toolkitCategories.flatMap((cat) =>
    cat.lessons.map((lesson) => ({ lesson, categoryId: cat.id })),
  );

  const lessonBlocks = lessons
    .map(({ lesson, categoryId }) => formatLesson(lesson, categoryId, "  "))
    .join(",\n\n");

  return `// AVA Creator Toolkit — Lesson Data Structure
// data/lessons-export.ts (generated by scripts/export-lessons.ts)
// JRE · May 2026 · Exported from Vertikal-App/data/toolkitCurriculum.ts

// ─────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────

export type LessonType = 'STATIC' | 'HTML_PRESENTATION'

export type TabId =
  | 'camera'
  | 'framing'
  | 'lighting'
  | 'editing'
  | 'strategy'
  | 'production'

export interface ToolkitLesson {
  id: string
  number: string
  tab: TabId
  category: string
  title: string
  type: LessonType
  isPro: boolean
  description: string
  guide: string
  keyRule: string
  steps: string[]
  proTip: string
  commonMistake: string
  images: string[]  // paths from /public/assets/toolkit/
  htmlSlidePath?: string
  htmlSlideId?: string
  saved?: boolean
}

export interface ToolkitCategory {
  id: string
  tab: TabId
  title: string
  eyebrow: string
  subtitle: string
}

export interface ToolkitTab {
  id: TabId
  label: string
  categories: ToolkitCategory[]
}

// ─────────────────────────────────────────
// TABS + CATEGORIES
// ─────────────────────────────────────────

export const TOOLKIT_TABS: ToolkitTab[] = [
${buildTabsSection()}
]

// ─────────────────────────────────────────
// FREE vs PRO MAP
// ─────────────────────────────────────────
// isPro: false = free · isPro: true = subscription required

const FREE_LESSONS = [
${FREE_LESSONS.map((id) => `  '${id}',`).join("\n")}
]

const isProLesson = (id: string): boolean => {
  const slug = id.includes('-') ? id.slice(id.indexOf('-') + 1) : id
  return !FREE_LESSONS.includes(slug)
}

// ─────────────────────────────────────────
// LESSONS
// ─────────────────────────────────────────
// Exported ${today} from Vertikal-App/data/toolkitCurriculum.ts
// ${total} lessons · ${v2Complete} with full v2 content (description, guide, keyRule, steps, proTip, commonMistake)

export const TOOLKIT_LESSONS: ToolkitLesson[] = [
${lessonBlocks},
]

// ─────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────

export const getLessonsByTab = (tab: TabId): ToolkitLesson[] =>
  TOOLKIT_LESSONS.filter(l => l.tab === tab)

export const getLessonsByCategory = (categoryId: string): ToolkitLesson[] =>
  TOOLKIT_LESSONS.filter(l => l.category === categoryId)

export const getLessonById = (id: string): ToolkitLesson | undefined =>
  TOOLKIT_LESSONS.find(l => l.id === id)

export const getFreeLessons = (): ToolkitLesson[] =>
  TOOLKIT_LESSONS.filter(l => !l.isPro)

export const getProLessons = (): ToolkitLesson[] =>
  TOOLKIT_LESSONS.filter(l => l.isPro)

${buildLessonCountSection(lessons.map(({ lesson }) => lesson))}

// JRE Command · May 2026 · THE WORK SPEAKS FIRST
`;
}

function main() {
  const lessons = toolkitCategories.flatMap((cat) => cat.lessons);
  const total = lessons.length;
  const v2Complete = lessons.filter(isV2Complete).length;
  const partial = lessons.filter((l) => !isV2Complete(l));
  const today = new Date().toISOString().slice(0, 10);

  const content = buildExport(today, total, v2Complete);

  for (const outPath of OUTPUT_PATHS) {
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, content, "utf8");
    console.log(`Wrote ${outPath}`);
  }

  console.log(JSON.stringify({ total, v2Complete, partial: partial.map((l) => l.id) }, null, 2));
}

main();
