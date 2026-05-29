import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "learning-app-wrong-v1";

function load(): Record<string, true> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Record<string, true>;
  } catch {
    return {};
  }
}

function save(state: Record<string, true>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function useWrongAnswers() {
  const [wrong, setWrong] = useState<Record<string, true>>({});

  useEffect(() => {
    setWrong(load());
  }, []);

  const markWrong = useCallback((quizId: string) => {
    setWrong((prev) => {
      if (prev[quizId]) return prev;
      const next: Record<string, true> = { ...prev, [quizId]: true };
      save(next);
      return next;
    });
  }, []);

  const clearWrong = useCallback((quizId: string) => {
    setWrong((prev) => {
      if (!prev[quizId]) return prev;
      const next = { ...prev };
      delete next[quizId];
      save(next);
      return next;
    });
  }, []);

  const clearAll = useCallback(() => {
    save({});
    setWrong({});
  }, []);

  const wrongIds = Object.keys(wrong);

  return { wrongIds, isWrong: (id: string) => Boolean(wrong[id]), markWrong, clearWrong, clearAll };
}
