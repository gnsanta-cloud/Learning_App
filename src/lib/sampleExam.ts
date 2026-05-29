import type { Quiz, Subject } from "../types";

export type SampleExamItem = {
  examIndex: number;
  quiz: Quiz;
  unitId: string;
  unitTitle: string;
  lessonTitle: string;
};

function shuffle<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/** 체크된 대단원에서 기말고사용 샘플 문항을 추출합니다. */
export function buildSampleExam(
  subject: Subject,
  unitIds: string[],
  perUnit = 4,
  maxTotal = 24
): SampleExamItem[] {
  const picked: SampleExamItem[] = [];
  let examIndex = 0;

  for (const unitId of unitIds) {
    const unit = subject.units.find((u) => u.id === unitId);
    if (!unit) continue;

    const pool: Omit<SampleExamItem, "examIndex">[] = [];
    for (const lesson of unit.lessons) {
      for (const quiz of lesson.quizzes) {
        pool.push({
          quiz,
          unitId: unit.id,
          unitTitle: unit.title,
          lessonTitle: lesson.title,
        });
      }
    }

    for (const item of shuffle(pool).slice(0, perUnit)) {
      picked.push({ ...item, examIndex: examIndex++ });
    }
  }

  return shuffle(picked).slice(0, maxTotal);
}
