import { useCallback, useEffect, useState } from "react";
import { getAllQuizzes, subjects } from "../data/subjects";
import { parseScopedQuizId } from "../lib/quizId";

const STORAGE_KEY = "learning-app-wrong-v1";

function buildRawIdIndex(): Map<string, { subjectId: string; scopedId: string }[]> {
  const index = new Map<string, { subjectId: string; scopedId: string }[]>();
  for (const subject of subjects) {
    for (const quiz of getAllQuizzes(subject)) {
      const parsed = parseScopedQuizId(quiz.id);
      const rawId = parsed?.rawId ?? quiz.id;
      const list = index.get(rawId) ?? [];
      list.push({ subjectId: subject.id, scopedId: quiz.id });
      index.set(rawId, list);
    }
  }
  return index;
}

/** 예전 `unit1-q01` 형식 키를 `과목:unit1-q01`으로 옮깁니다. */
function migrateWrongIds(state: Record<string, true>): Record<string, true> {
  const rawIndex = buildRawIdIndex();
  const next: Record<string, true> = {};

  for (const key of Object.keys(state)) {
    if (!state[key]) continue;

    if (parseScopedQuizId(key)) {
      next[key] = true;
      continue;
    }

    const matches = rawIndex.get(key) ?? [];
    if (matches.length === 1) {
      next[matches[0].scopedId] = true;
      continue;
    }

    if (matches.length > 1) {
      const preferred =
        matches.find((m) => m.subjectId === "tech-home") ?? matches[0];
      next[preferred.scopedId] = true;
    }
  }

  return next;
}

function load(): Record<string, true> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, true>;
    const migrated = migrateWrongIds(parsed);
    if (JSON.stringify(migrated) !== JSON.stringify(parsed)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
    }
    return migrated;
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

  return {
    wrongIds,
    isWrong: (id: string) => Boolean(wrong[id]),
    markWrong,
    clearWrong,
    clearAll,
  };
}
