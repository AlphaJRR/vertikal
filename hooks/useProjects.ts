import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabase";
import {
  defaultProjectMeta,
  type ProjectMeta,
  type ProjectQuoteSnapshot,
} from "../types/projects";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ChecklistItem {
  id: string;
  text: string;
  done: boolean;
}

export interface ProjectData {
  meta?:       ProjectMeta;
  shoot_pre:   ChecklistItem[];
  shoot_day:   ChecklistItem[];
  edit:        ChecklistItem[];
}

export interface Project {
  id:         string;
  user_id:    string;
  name:       string;
  data:       ProjectData;
  meta:       ProjectMeta;
  created_at: string;
  updated_at: string;
}

export type SyncStatus = "synced" | "syncing" | "offline" | "not_signed_in";

export interface CreateProjectInput {
  name:                 string;
  eventType?:           string;
  description?:         string;
  clientName?:          string;
  shootDate?:           string | null;
  targetCompletionDate?: string | null;
}

export interface AttachQuoteInput {
  projectId?:   string;
  projectName:  string;
  clientName:   string;
  projectType:  string;
  totalCents:   number;
}

// ─── AsyncStorage keys ───────────────────────────────────────────────────────

const KEY_ACTIVE_PROJECT = "ava_active_project_id";
const LEGACY_KEYS = {
  shoot_pre: "ava_shoot_pre_v1",
  shoot_day: "ava_shoot_day_v1",
  edit:      "ava_edit_v1",
} as const;
const MIGRATION_DONE_KEY = "ava_projects_migration_done";

function cacheKey(id: string) {
  return `ava_project_${id}`;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function emptyData(meta?: Partial<ProjectMeta>): ProjectData {
  return {
    meta:      { ...defaultProjectMeta(), ...meta },
    shoot_pre: [],
    shoot_day: [],
    edit:      [],
  };
}

function parseMeta(raw: unknown): ProjectMeta {
  const base = defaultProjectMeta();
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return base;
  const m = raw as Partial<ProjectMeta>;
  return {
    stage:                m.stage                ?? base.stage,
    eventType:            m.eventType            ?? base.eventType,
    description:          m.description          ?? base.description,
    clientName:           m.clientName           ?? base.clientName,
    shootDate:            m.shootDate            ?? base.shootDate,
    targetCompletionDate: m.targetCompletionDate ?? base.targetCompletionDate,
    depositReceived:      m.depositReceived      ?? base.depositReceived,
    quote:                m.quote                ?? base.quote,
    invoiceSentAt:        m.invoiceSentAt        ?? base.invoiceSentAt,
  };
}

function normalizeProject(row: Record<string, unknown>): Project {
  const raw = row.data;
  let data = emptyData();
  if (raw && typeof raw === "object" && !Array.isArray(raw)) {
    const d = raw as Partial<ProjectData>;
    data = {
      meta:      parseMeta(d.meta),
      shoot_pre: Array.isArray(d.shoot_pre) ? d.shoot_pre : [],
      shoot_day: Array.isArray(d.shoot_day) ? d.shoot_day : [],
      edit:      Array.isArray(d.edit)      ? d.edit      : [],
    };
  }
  const ownerId = (row.user_id ?? row.client_id) as string;
  return {
    id:         row.id as string,
    user_id:    ownerId,
    name:       row.name as string,
    data,
    meta:       data.meta ?? defaultProjectMeta(),
    created_at: row.created_at as string,
    updated_at: row.updated_at as string,
  };
}

function projectInsertPayload(userId: string, input: CreateProjectInput) {
  const meta: Partial<ProjectMeta> = {
    eventType:            input.eventType ?? "commercial",
    description:          input.description?.trim() || null,
    clientName:           input.clientName?.trim() || null,
    shootDate:            input.shootDate ?? null,
    targetCompletionDate: input.targetCompletionDate ?? null,
  };
  return {
    user_id:      userId,
    client_id:    userId,
    name:         input.name.trim(),
    data:         emptyData(meta),
    package_type: "creator",
  };
}

function projectUpsertPayload(userId: string, project: Project) {
  return {
    id:           project.id,
    user_id:      userId,
    client_id:    userId,
    name:         project.name,
    data:         project.data,
    package_type: "creator",
  };
}

function ownerFilter(userId: string) {
  return `user_id.eq.${userId},client_id.eq.${userId}`;
}

async function readLegacyData(): Promise<ProjectData | null> {
  try {
    const [pre, day, edit] = await Promise.all([
      AsyncStorage.getItem(LEGACY_KEYS.shoot_pre),
      AsyncStorage.getItem(LEGACY_KEYS.shoot_day),
      AsyncStorage.getItem(LEGACY_KEYS.edit),
    ]);
    if (!pre && !day && !edit) return null;
    return {
      meta:      defaultProjectMeta(),
      shoot_pre: pre ? (JSON.parse(pre) as ChecklistItem[]) : [],
      shoot_day: day ? (JSON.parse(day) as ChecklistItem[]) : [],
      edit:      edit ? (JSON.parse(edit) as ChecklistItem[]) : [],
    };
  } catch {
    return null;
  }
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useProjects() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>("not_signed_in");
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(null);
  const [migrationBanner, setMigrationBanner] = useState(false);
  const syncTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchFromSupabase = useCallback(async (): Promise<Project[]> => {
    if (!user) return [];
    try {
      setSyncStatus("syncing");
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .or(ownerFilter(user.id))
        .order("updated_at", { ascending: false });
      if (error) throw error;
      setSyncStatus("synced");
      setLastSyncedAt(new Date());
      return (data ?? []).map((row) => normalizeProject(row as Record<string, unknown>));
    } catch (err) {
      console.error("[useProjects] fetchFromSupabase failed:", err);
      setSyncStatus("offline");
      return [];
    }
  }, [user]);

  const syncToSupabase = useCallback(
    (project: Project) => {
      if (!user) return;
      if (syncTimerRef.current) clearTimeout(syncTimerRef.current);
      syncTimerRef.current = setTimeout(() => {
        setSyncStatus("syncing");
        void (async () => {
          try {
            const { error } = await supabase
              .from("projects")
              .upsert(projectUpsertPayload(user.id, project), { onConflict: "id" });
            if (error) {
              console.error("[useProjects] syncToSupabase failed:", error);
              setSyncStatus("offline");
            } else {
              setSyncStatus("synced");
              setLastSyncedAt(new Date());
            }
          } catch (err) {
            console.error("[useProjects] syncToSupabase error:", err);
            setSyncStatus("offline");
          }
        })();
      }, 800);
    },
    [user],
  );

  const applyLocalProject = useCallback((next: Project) => {
    setProjects((prev) => prev.map((p) => (p.id === next.id ? next : p)));
    setActiveProject((prev) => (prev?.id === next.id ? next : prev));
    void AsyncStorage.setItem(cacheKey(next.id), JSON.stringify(next));
    syncToSupabase(next);
    return next;
  }, [syncToSupabase]);

  const maybeMigrateLegacy = useCallback(
    async (existingProjects: Project[]) => {
      if (!user) return;
      const done = await AsyncStorage.getItem(MIGRATION_DONE_KEY);
      if (done) return;
      if (existingProjects.length > 0) {
        await AsyncStorage.setItem(MIGRATION_DONE_KEY, "1");
        return;
      }
      const legacyData = await readLegacyData();
      if (!legacyData) {
        await AsyncStorage.setItem(MIGRATION_DONE_KEY, "1");
        return;
      }
      const hasContent =
        legacyData.shoot_pre.length > 0 ||
        legacyData.shoot_day.length > 0 ||
        legacyData.edit.length > 0;
      if (!hasContent) {
        await AsyncStorage.setItem(MIGRATION_DONE_KEY, "1");
        return;
      }
      const { data: newProject, error } = await supabase
        .from("projects")
        .insert(projectInsertPayload(user.id, { name: "My First Project" }))
        .select()
        .single();
      if (error || !newProject) {
        console.error("[useProjects] migration insert failed:", error);
        return;
      }
      const migrated = normalizeProject(newProject as Record<string, unknown>);
      migrated.data = { ...legacyData, meta: migrated.meta };
      await supabase.from("projects").update({ data: migrated.data }).eq("id", migrated.id);
      await AsyncStorage.setItem(MIGRATION_DONE_KEY, "1");
      setMigrationBanner(true);
      await AsyncStorage.setItem(KEY_ACTIVE_PROJECT, migrated.id);
    },
    [user],
  );

  useEffect(() => {
    let cancelled = false;

    async function init() {
      setLoading(true);
      if (!user) {
        setSyncStatus("not_signed_in");
        setProjects([]);
        setActiveProject(null);
        setLoading(false);
        return;
      }

      const fetched = await fetchFromSupabase();
      if (cancelled) return;

      await maybeMigrateLegacy(fetched);
      if (cancelled) return;

      const final = await fetchFromSupabase();
      if (cancelled) return;

      setProjects(final);

      const savedId = await AsyncStorage.getItem(KEY_ACTIVE_PROJECT);
      if (cancelled) return;
      const active =
        (savedId ? final.find((p) => p.id === savedId) : null) ?? final[0] ?? null;
      setActiveProject(active);
      setLoading(false);
    }

    void init();
    return () => { cancelled = true; };
  }, [user, fetchFromSupabase, maybeMigrateLegacy]);

  const createProject = useCallback(
    async (input: CreateProjectInput | string): Promise<Project | null> => {
      if (!user) return null;
      const payload = typeof input === "string"
        ? projectInsertPayload(user.id, { name: input })
        : projectInsertPayload(user.id, input);
      try {
        const { data, error } = await supabase
          .from("projects")
          .insert(payload)
          .select()
          .single();
        if (error || !data) {
          console.error("[useProjects] createProject failed:", error?.code, error?.message);
          return null;
        }
        const p = normalizeProject(data as Record<string, unknown>);
        setProjects((prev) => [p, ...prev]);
        await AsyncStorage.setItem(KEY_ACTIVE_PROJECT, p.id);
        setActiveProject(p);
        return p;
      } catch (err) {
        console.error("[useProjects] createProject error:", err);
        return null;
      }
    },
    [user],
  );

  const switchProject = useCallback(async (id: string) => {
    const found = projects.find((p) => p.id === id);
    if (!found) return;
    await AsyncStorage.setItem(KEY_ACTIVE_PROJECT, id);
    setActiveProject(found);
  }, [projects]);

  const renameProject = useCallback(async (id: string, name: string) => {
    if (!user) return;
    const { error } = await supabase
      .from("projects")
      .update({ name })
      .eq("id", id)
      .or(ownerFilter(user.id));
    if (error) {
      console.error("[useProjects] renameProject failed:", error);
      return;
    }
    setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, name } : p)));
    setActiveProject((prev) => (prev?.id === id ? { ...prev, name } : prev));
  }, [user]);

  const deleteProject = useCallback(async (id: string) => {
    if (!user) return;
    const { error } = await supabase
      .from("projects")
      .delete()
      .eq("id", id)
      .or(ownerFilter(user.id));
    if (error) {
      console.error("[useProjects] deleteProject failed:", error);
      return;
    }
    await AsyncStorage.removeItem(cacheKey(id));
    setProjects((prev) => prev.filter((p) => p.id !== id));
    setActiveProject((prev) => (prev?.id === id ? null : prev));
  }, [user]);

  const updateProjectData = useCallback(async (id: string, data: ProjectData) => {
    const updated = projects.find((p) => p.id === id);
    if (!updated) return;
    const meta = data.meta ?? updated.meta;
    const next: Project = { ...updated, data: { ...data, meta }, meta };
    applyLocalProject(next);
  }, [projects, applyLocalProject]);

  const updateProjectMeta = useCallback(async (id: string, patch: Partial<ProjectMeta>) => {
    const updated = projects.find((p) => p.id === id);
    if (!updated) return;
    const meta = { ...updated.meta, ...patch };
    const next: Project = {
      ...updated,
      meta,
      data: { ...updated.data, meta },
    };
    applyLocalProject(next);
  }, [projects, applyLocalProject]);

  const attachQuote = useCallback(async (input: AttachQuoteInput): Promise<Project | null> => {
    if (!user) return null;
    const quote: ProjectQuoteSnapshot = {
      totalCents:  input.totalCents,
      sentAt:      new Date().toISOString(),
      clientName:  input.clientName.trim(),
      projectType: input.projectType,
    };

    let target = input.projectId
      ? projects.find((p) => p.id === input.projectId)
      : projects.find((p) => p.name.toLowerCase() === input.projectName.trim().toLowerCase());

    if (!target) {
      target = await createProject({
        name:        input.projectName.trim() || "Untitled project",
        clientName:  input.clientName,
        eventType:   input.projectType,
      }) ?? undefined;
    }
    if (!target) return null;

    const meta: ProjectMeta = {
      ...target.meta,
      clientName:  input.clientName.trim() || target.meta.clientName,
      eventType:   input.projectType || target.meta.eventType,
      stage:       "quoted",
      quote,
    };
    const next: Project = {
      ...target,
      meta,
      data: { ...target.data, meta },
    };
    return applyLocalProject(next);
  }, [user, projects, createProject, applyLocalProject]);

  const markDepositReceived = useCallback(async (id: string, received: boolean) => {
    await updateProjectMeta(id, {
      depositReceived: received,
      stage:           received ? "booked" : "quoted",
    });
  }, [updateProjectMeta]);

  const markInvoiceSent = useCallback(async (id: string) => {
    await updateProjectMeta(id, {
      invoiceSentAt: new Date().toISOString(),
      stage:         "delivered",
    });
  }, [updateProjectMeta]);

  const dismissMigrationBanner = useCallback(() => {
    setMigrationBanner(false);
  }, []);

  return {
    projects,
    activeProject,
    loading,
    createProject,
    switchProject,
    renameProject,
    deleteProject,
    updateProjectData,
    updateProjectMeta,
    attachQuote,
    markDepositReceived,
    markInvoiceSent,
    syncStatus,
    lastSyncedAt,
    migrationBanner,
    dismissMigrationBanner,
  };
}
