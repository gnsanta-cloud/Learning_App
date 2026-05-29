import { useCallback, useEffect, useState } from "react";
import { readJson, writeJson } from "../lib/storage";

const EXAM_KEY = "learning-app-exam-v1";

type ExamState = Record<string, Record<string, boolean>>;

function load(): ExamState {
  return readJson(EXAM_KEY, {});
}

function save(state: ExamState) {
  writeJson(EXAM_KEY, state);
}

export function useExamChecklist(subjectId: string) {
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const all = load();
    setChecked(all[subjectId] ?? {});
  }, [subjectId]);

  const isChecked = useCallback(
    (itemId: string) => Boolean(checked[itemId]),
    [checked]
  );

  const toggle = useCallback(
    (itemId: string) => {
      setChecked((prev) => {
        const next = { ...prev, [itemId]: !prev[itemId] };
        const all = load();
        all[subjectId] = next;
        save(all);
        return next;
      });
    },
    [subjectId]
  );

  const countChecked = useCallback(
    (ids: string[]) => ids.filter((id) => checked[id]).length,
    [checked]
  );

  const getCheckedIds = useCallback(
    (ids: string[]) => ids.filter((id) => checked[id]),
    [checked]
  );

  return { isChecked, toggle, countChecked, getCheckedIds };
}
