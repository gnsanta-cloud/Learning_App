import { useCallback, useEffect, useState } from "react";
import { recordDailyActivity } from "../lib/activity";
import type { ProgressState } from "../types";

const STORAGE_KEY = "learning-app-progress-v1";

function load(): ProgressState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as ProgressState;
  } catch {
    return {};
  }
}

function save(state: ProgressState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function useProgress() {
  const [progress, setProgress] = useState<ProgressState>({});

  useEffect(() => {
    setProgress(load());
  }, []);

  const isComplete = useCallback(
    (key: string) => Boolean(progress[key]),
    [progress]
  );

  const markComplete = useCallback((key: string) => {
    recordDailyActivity();
    setProgress((prev) => {
      const next = { ...prev, [key]: true };
      save(next);
      return next;
    });
  }, []);

  const countCompleted = useCallback(
    (keys: string[]) => keys.filter((k) => progress[k]).length,
    [progress]
  );

  const resetAll = useCallback(() => {
    save({});
    setProgress({});
  }, []);

  return { progress, isComplete, markComplete, countCompleted, resetAll };
}
