import type { Quiz } from "../types";

type Q = Omit<Quiz, "id"> & { id?: string };

export function q(id: string, data: Omit<Quiz, "id">): Quiz {
  return { id, ...data };
}

export function quizSet(prefix: string, items: Q[]): Quiz[] {
  return items.map((item, i) => ({
    ...item,
    id: item.id ?? `${prefix}-q${i + 1}`,
  }));
}

type LessonInput = {
  id: string;
  title: string;
  summary: string;
  points: string[];
  keywords: string[];
  reflections?: string[];
  quizzes: Q[];
};

export function lesson(prefix: string, data: LessonInput) {
  return {
    ...data,
    quizzes: quizSet(prefix, data.quizzes),
  };
}
