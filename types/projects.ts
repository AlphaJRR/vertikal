/**
 * Creator project pipeline — stored in projects.data.meta (jsonb).
 */

export type CreatorProjectStage =
  | "prospecting"
  | "quoted"
  | "booked"
  | "pre_production"
  | "shoot_day"
  | "post"
  | "delivered";

export interface ProjectQuoteSnapshot {
  totalCents: number;
  sentAt:       string;
  clientName:   string;
  projectType:  string;
}

export interface ProjectMeta {
  stage:                 CreatorProjectStage;
  eventType:             string;
  description:           string | null;
  clientName:            string | null;
  shootDate:             string | null;
  targetCompletionDate:  string | null;
  depositReceived:       boolean;
  quote:                 ProjectQuoteSnapshot | null;
  invoiceSentAt:         string | null;
}

export const CREATOR_STAGES: CreatorProjectStage[] = [
  "prospecting",
  "quoted",
  "booked",
  "pre_production",
  "shoot_day",
  "post",
  "delivered",
];

export const STAGE_LABELS: Record<CreatorProjectStage, string> = {
  prospecting:    "Prospecting",
  quoted:         "Quote sent",
  booked:         "Booked · deposit",
  pre_production: "Pre-production",
  shoot_day:      "Shoot day",
  post:           "Post / edit",
  delivered:      "Delivered",
};

export const STAGE_HINTS: Record<CreatorProjectStage, string> = {
  prospecting:    "Lead — not quoted yet",
  quoted:         "Quote builder used — awaiting booking",
  booked:         "Client booked and deposit received",
  pre_production: "Planning, gear, call sheet",
  shoot_day:      "On set / rolling cameras",
  post:           "Edit, color, mix, delivery",
  delivered:      "Project wrapped and invoiced",
};

export const STAGE_COLORS: Record<CreatorProjectStage, string> = {
  prospecting:    "#888",
  quoted:         "#60a5fa",
  booked:         "#4ade80",
  pre_production: "#fbbf24",
  shoot_day:      "#E8000A",
  post:           "#a78bfa",
  delivered:      "#22d3ee",
};

export const EVENT_TYPES: { id: string; label: string }[] = [
  { id: "commercial",  label: "Commercial / Brand" },
  { id: "podcast",     label: "Podcast" },
  { id: "corporate",   label: "Corporate" },
  { id: "social",      label: "Social content" },
  { id: "wedding",     label: "Wedding / Event" },
  { id: "documentary", label: "Documentary" },
  { id: "music",       label: "Music video" },
  { id: "other",       label: "Other" },
];

export function defaultProjectMeta(): ProjectMeta {
  return {
    stage:                "prospecting",
    eventType:            "commercial",
    description:          null,
    clientName:           null,
    shootDate:            null,
    targetCompletionDate: null,
    depositReceived:      false,
    quote:                null,
    invoiceSentAt:          null,
  };
}

export function eventTypeLabel(id: string): string {
  return EVENT_TYPES.find((t) => t.id === id)?.label ?? id;
}

export function formatCents(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style:    "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

export function formatIsoDate(iso: string | null): string {
  if (!iso) return "—";
  try {
    return new Date(iso + (iso.length === 10 ? "T12:00:00" : "")).toLocaleDateString("en-US", {
      month: "short",
      day:   "numeric",
      year:  "numeric",
    });
  } catch {
    return iso;
  }
}
