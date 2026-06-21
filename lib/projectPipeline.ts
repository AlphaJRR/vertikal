import type { ChecklistItem } from "@/hooks/useProjects";
import type { CreatorProjectStage, ProjectMeta } from "@/types/projects";
import { CREATOR_STAGES } from "@/types/projects";

export interface ChecklistProgress {
  total:     number;
  done:      number;
  percent:   number;
  prePct:    number;
  dayPct:    number;
  postPct:   number;
}

function segmentProgress(items: ChecklistItem[]): number {
  if (items.length === 0) return 0;
  return Math.round((items.filter((i) => i.done).length / items.length) * 100);
}

export function checklistProgress(data: {
  shoot_pre: ChecklistItem[];
  shoot_day: ChecklistItem[];
  edit:      ChecklistItem[];
}): ChecklistProgress {
  const all = [...data.shoot_pre, ...data.shoot_day, ...data.edit];
  const done = all.filter((i) => i.done).length;
  return {
    total:   all.length,
    done,
    percent: all.length === 0 ? 0 : Math.round((done / all.length) * 100),
    prePct:  segmentProgress(data.shoot_pre),
    dayPct:  segmentProgress(data.shoot_day),
    postPct: segmentProgress(data.edit),
  };
}

/** Suggest a production stage from checklist activity — never downgrades sales stages. */
export function suggestStageFromChecklists(
  meta: ProjectMeta,
  data: { shoot_pre: ChecklistItem[]; shoot_day: ChecklistItem[]; edit: ChecklistItem[] },
): CreatorProjectStage | null {
  const salesStages: CreatorProjectStage[] = ["prospecting", "quoted", "booked"];
  if (salesStages.includes(meta.stage)) return null;

  const { prePct, dayPct, postPct } = checklistProgress(data);
  if (postPct >= 80) return "delivered";
  if (postPct > 0 || data.edit.some((i) => i.done)) return "post";
  if (dayPct > 0 || data.shoot_day.some((i) => i.done)) return "shoot_day";
  if (prePct > 0 || data.shoot_pre.some((i) => i.done)) return "pre_production";
  return null;
}

export function stageIndex(stage: CreatorProjectStage): number {
  return CREATOR_STAGES.indexOf(stage);
}
