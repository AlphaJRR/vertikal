export const IRS_MILEAGE_RATE = 0.67;

export type SkillLevel = "entry" | "intermediate" | "advanced" | "expert";

export type ProjectType =
  | "commercial"
  | "corporate"
  | "social"
  | "wedding"
  | "documentary";

export interface SkillLevelOption {
  id: SkillLevel;
  label: string;
  hourlyRate: number;
  description: string;
}

/** US national average hourly baselines by skill level (2026) */
export const SKILL_LEVELS: SkillLevelOption[] = [
  {
    id: "entry",
    label: "Entry",
    hourlyRate: 35,
    description: "0–2 yrs · assistants, PA work",
  },
  {
    id: "intermediate",
    label: "Intermediate",
    hourlyRate: 55,
    description: "2–5 yrs · solo shoots, small crews",
  },
  {
    id: "advanced",
    label: "Advanced",
    hourlyRate: 85,
    description: "5–10 yrs · commercial, brand work",
  },
  {
    id: "expert",
    label: "Expert",
    hourlyRate: 125,
    description: "10+ yrs · agency, broadcast, premium",
  },
];

export const PROJECT_TYPES: { id: ProjectType; label: string }[] = [
  { id: "commercial", label: "Commercial / Brand" },
  { id: "corporate", label: "Corporate Video" },
  { id: "social", label: "Social Content" },
  { id: "wedding", label: "Wedding / Event" },
  { id: "documentary", label: "Documentary" },
];

export interface GearLineItem {
  id: string;
  label: string;
  /** National average default (USD) */
  defaultAmount: number;
  enabled: boolean;
}

/** Pre-filled national average production costs */
export const DEFAULT_GEAR_ITEMS: Omit<GearLineItem, "enabled">[] = [
  { id: "camera", label: "Camera package rental", defaultAmount: 350 },
  { id: "lighting", label: "Lighting kit", defaultAmount: 200 },
  { id: "audio", label: "Audio kit", defaultAmount: 75 },
  { id: "grip", label: "Grip / support gear", defaultAmount: 150 },
  { id: "assistant", label: "Second shooter / PA", defaultAmount: 250 },
];

export const QUOTE_STEPS = [
  { id: 1, label: "Project" },
  { id: 2, label: "Labor" },
  { id: 3, label: "Gear" },
  { id: 4, label: "Travel" },
  { id: 5, label: "Quote" },
] as const;

export function parseAmount(value: string): number {
  const n = parseFloat(value.replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

export function formatCurrency(amount: number): string {
  return `$${amount.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
}
