/** Canonical lesson JSON schema (Joshua's AVA Creator Toolkit architecture). */
export type CanonicalLessonType = "STATIC" | "HTML_PRESENTATION";

export interface CanonicalLesson {
  id: string;
  tab: "camera" | "framing" | "lighting" | "editing" | "strategy";
  type: CanonicalLessonType;
  title: string;
  description: string;
  guide: string;
  keyRule: string;
  howTo: string[];
  proTip: string;
  commonMistake: string;
  /** Present when type is HTML_PRESENTATION — points to data/slides/<slideRef>.json */
  slideRef?: string;
}
