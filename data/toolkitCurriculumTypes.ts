export type ToolkitTab = "camera" | "framing" | "lighting" | "editing" | "strategy";

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
];

export const SAVED_LESSONS_KEY = "@ava/toolkit/saved-lessons";
