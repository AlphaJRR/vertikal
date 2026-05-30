import { useCallback, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SAVED_LESSONS_KEY } from "../data/toolkitCurriculumTypes";

export function useSavedLessons() {
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(SAVED_LESSONS_KEY)
      .then((raw) => {
        if (raw) {
          try {
            const ids = JSON.parse(raw) as string[];
            setSavedIds(new Set(ids));
          } catch {
            setSavedIds(new Set());
          }
        }
      })
      .finally(() => setLoaded(true));
  }, []);

  const persist = useCallback(async (next: Set<string>) => {
    setSavedIds(next);
    await AsyncStorage.setItem(SAVED_LESSONS_KEY, JSON.stringify([...next]));
  }, []);

  const toggleSaved = useCallback(
    async (lessonId: string) => {
      const next = new Set(savedIds);
      if (next.has(lessonId)) {
        next.delete(lessonId);
      } else {
        next.add(lessonId);
      }
      await persist(next);
    },
    [savedIds, persist],
  );

  const isSaved = useCallback((lessonId: string) => savedIds.has(lessonId), [savedIds]);

  return { savedIds, loaded, toggleSaved, isSaved };
}
