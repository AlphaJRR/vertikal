export type ToolkitTab =
  | "camera"
  | "framing"
  | "lighting"
  | "editing"
  | "strategy"
  | "production";

export type ToolkitLessonType =
  | "static"
  | "motion"
  | "interactive"
  | "html_presentation";

export interface ToolkitLesson {
  id: string;
  number: string;
  tab: ToolkitTab;
  category: string;
  title: string;
  description: string;
  steps: string[];
  images: string[];
  saved: boolean;
  /** Lesson format — static text, motion demo, or interactive */
  type?: ToolkitLessonType;
  /** THE GUIDE — longer explanation */
  guide?: string;
  /** KEY RULE — single highlighted takeaway */
  keyRule?: string;
  /** PRO TIP */
  proTip?: string;
  /** COMMON MISTAKE */
  commonMistake?: string;
  /** Relative path to bundled HTML slide (creators-toolkit layout) */
  htmlSlidePath?: string;
  /** Slide id for app/slide/[id] and toolkit-content.json */
  htmlSlideId?: string;
  /** Canonical slide deck id in data/slides/ (snake_case, e.g. slides_depth_layers) */
  slideRef?: string;
  /** Parsed or author-supplied guided links (optional; also parsed inline) */
  guidedLinks?: { label: string; href: string }[];
  /** Single image path shown after THE GUIDE (from /public/assets/toolkit/ or assets/) */
  imageAfterGuide?: string;
  /** Alt text for imageAfterGuide */
  imageAlt?: string;
}

export interface ToolkitCategory {
  id: string;
  tab: ToolkitTab;
  eyebrow: string;
  title: string;
  lessons: Omit<ToolkitLesson, "saved">[];
}

export const TOOLKIT_TABS: { id: ToolkitTab; label: string }[] = [
  { id: "camera", label: "CAMERA" },
  { id: "framing", label: "FRAMING" },
  { id: "lighting", label: "LIGHTING" },
  { id: "editing", label: "EDITING" },
  { id: "strategy", label: "STRATEGY" },
  { id: "production", label: "PRODUCTION 101" },
];

export const SAVED_LESSONS_KEY = "@ava/toolkit/saved-lessons";

/** Total lessons in toolkitCurriculum — avoid importing the full curriculum for UI copy. */
export const TOOLKIT_LESSON_COUNT = 108;
