import type { Quiz, Subject } from "../types";

export const MIN_EXAM_UNITS = 2;
export const SAMPLE_EXAM_QUESTION_COUNT = 20;

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

/** 체크된 대단원에서 기말고사용 샘플 문항 20개를 추출합니다. */
export function buildSampleExam(
  subject: Subject,
  unitIds: string[],
  questionCount = SAMPLE_EXAM_QUESTION_COUNT
): SampleExamItem[] {
  const pool: Omit<SampleExamItem, "examIndex">[] = [];

  for (const unitId of unitIds) {
    const unit = subject.units.find((u) => u.id === unitId);
    if (!unit) continue;

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
  }

  if (pool.length === 0) return [];

  const shuffled = shuffle(pool);
  const picked: SampleExamItem[] = [];

  for (let i = 0; i < questionCount; i++) {
    const item = shuffled[i % shuffled.length];
    picked.push({ ...item, examIndex: i });
  }

  return shuffle(picked).map((item, index) => ({ ...item, examIndex: index }));
}
