import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabase";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ChecklistItem {
  id: string;
  text: string;
  done: boolean;
}

export interface ProjectData {
  shoot_pre: ChecklistItem[];
  shoot_day: ChecklistItem[];
  edit: ChecklistItem[];
}

export interface Project {
  id: string;
  user_id: string;
  name: string;
  data: ProjectData;
  created_at: string;
  updated_at: string;
}

export type SyncStatus = "synced" | "syncing" | "offline" | "not_signed_in";

// ─── AsyncStorage keys ───────────────────────────────────────────────────────

const KEY_ACTIVE_PROJECT = "ava_active_project_id";
const LEGACY_KEYS = {
  shoot_pre: "ava_shoot_pre_v1",
  shoot_day: "ava_shoot_day_v1",
  edit: "ava_edit_v1",
} as const;
const MIGRATION_DONE_KEY = "ava_projects_migration_done";

function cacheKey(id: string) {
  return `ava_project_${id}`;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function emptyData(): ProjectData {
  return { shoot_pre: [], shoot_day: [], edit: [] };
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
      shoot_pre: pre ? (JSON.parse(pre) as ChecklistItem[]) : [],
      shoot_day: day ? (JSON.parse(day) as ChecklistItem[]) : [],
      edit: edit ? (JSON.parse(edit) as ChecklistItem[]) : [],
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

  // ── Load from Supabase ────────────────────────────────────────────────────
  const fetchFromSupabase = useCallback(async (): Promise<Project[]> => {
    if (!user) return [];
    try {
      setSyncStatus("syncing");
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false });
      if (error) throw error;
      setSyncStatus("synced");
      setLastSyncedAt(new Date());
      return (data ?? []) as Project[];
    } catch (err) {
      console.error("[useProjects] fetchFromSupabase failed:", err);
      setSyncStatus("offline");
      return [];
    }
  }, [user]);

  // ── Write project to Supabase (non-blocking) ──────────────────────────────
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
              .upsert(
                {
                  id: project.id,
                  user_id: user.id,
                  name: project.name,
                  data: project.data,
                },
                { onConflict: "id" },
              );
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

  // ── Migrate legacy AsyncStorage data ──────────────────────────────────────
  const maybeMigrateLegacy = useCallback(
    async (existingProjects: Project[]) => {
      if (!user) return;
      const done = await AsyncStorage.getItem(MIGRATION_DONE_KEY);
      if (done) return;
      if (existingProjects.length > 0) {
        // Already has projects — mark done, skip migration
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
      // Create "My First Project" from legacy data
      const { data: newProject, error } = await supabase
        .from("projects")
        .insert({ user_id: user.id, name: "My First Project", data: legacyData })
        .select()
        .single();
      if (error || !newProject) {
        console.error("[useProjects] migration insert failed:", error);
        return;
      }
      await AsyncStorage.setItem(MIGRATION_DONE_KEY, "1");
      setMigrationBanner(true);
    },
    [user],
  );

  // ── Initial load ──────────────────────────────────────────────────────────
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

      // Re-fetch after potential migration
      const final = await fetchFromSupabase();
      if (cancelled) return;

      setProjects(final);

      // Restore active project
      const savedId = await AsyncStorage.getItem(KEY_ACTIVE_PROJECT);
      if (cancelled) return;
      const active =
        (savedId ? final.find((p) => p.id === savedId) : null) ?? final[0] ?? null;
      setActiveProject(active);
      setLoading(false);
    }

    void init();
    return () => {
      cancelled = true;
    };
  }, [user, fetchFromSupabase, maybeMigrateLegacy]);

  // ── createProject ─────────────────────────────────────────────────────────
  const createProject = useCallback(
    async (name: string): Promise<Project | null> => {
      if (!user) return null;
      try {
        const { data, error } = await supabase
          .from("projects")
          .insert({ user_id: user.id, name, data: emptyData() })
          .select()
          .single();
        if (error || !data) {
          console.error("[useProjects] createProject failed:", error);
          return null;
        }
        const p = data as Project;
        setProjects((prev) => [p, ...prev]);
        return p;
      } catch (err) {
        console.error("[useProjects] createProject error:", err);
        return null;
      }
    },
    [user],
  );

  // ── switchProject ─────────────────────────────────────────────────────────
  const switchProject = useCallback(
    async (id: string) => {
      const found = projects.find((p) => p.id === id);
      if (!found) return;
      await AsyncStorage.setItem(KEY_ACTIVE_PROJECT, id);
      setActiveProject(found);
    },
    [projects],
  );

  // ── renameProject ─────────────────────────────────────────────────────────
  const renameProject = useCallback(
    async (id: string, name: string) => {
      if (!user) return;
      const { error } = await supabase
        .from("projects")
        .update({ name })
        .eq("id", id)
        .eq("user_id", user.id);
      if (error) {
        console.error("[useProjects] renameProject failed:", error);
        return;
      }
      setProjects((prev) =>
        prev.map((p) => (p.id === id ? { ...p, name } : p)),
      );
      setActiveProject((prev) =>
        prev?.id === id ? { ...prev, name } : prev,
      );
    },
    [user],
  );

  // ── deleteProject ─────────────────────────────────────────────────────────
  const deleteProject = useCallback(
    async (id: string) => {
      if (!user) return;
      const { error } = await supabase
        .from("projects")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);
      if (error) {
        console.error("[useProjects] deleteProject failed:", error);
        return;
      }
      await AsyncStorage.removeItem(cacheKey(id));
      setProjects((prev) => prev.filter((p) => p.id !== id));
      setActiveProject((prev) => {
        if (prev?.id !== id) return prev;
        return null;
      });
    },
    [user],
  );

  // ── updateProjectData ─────────────────────────────────────────────────────
  const updateProjectData = useCallback(
    async (id: string, data: ProjectData) => {
      const updated = projects.find((p) => p.id === id);
      if (!updated) return;
      const next: Project = { ...updated, data };
      setProjects((prev) => prev.map((p) => (p.id === id ? next : p)));
      if (activeProject?.id === id) setActiveProject(next);
      await AsyncStorage.setItem(cacheKey(id), JSON.stringify(next));
      syncToSupabase(next);
    },
    [projects, activeProject, syncToSupabase],
  );

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
    syncStatus,
    lastSyncedAt,
    migrationBanner,
    dismissMigrationBanner,
  };
}
