import type { Subject } from "../types";
import { ethicsSubject } from "./ethics/index";
import { techHomeSubject } from "./techHome/index";

export const subjects: Subject[] = [techHomeSubject, ethicsSubject];

export function getSubject(id: string): Subject | undefined {
  return subjects.find((s) => s.id === id);
}

export function getUnit(
  subjectId: string,
  unitId: string
): { subject: Subject; unit: Subject["units"][number] } | undefined {
  const subject = getSubject(subjectId);
  if (!subject) return undefined;
  const unit = subject.units.find((u) => u.id === unitId);
  if (!unit) return undefined;
  return { subject, unit };
}

export function getUnitEbookUrl(
  subject: Subject,
  unit: Subject["units"][number]
): string | undefined {
  return unit.ebookUrl ?? subject.ebookUrl;
}

export function getLessonKey(
  subjectId: string,
  unitId: string,
  lessonId: string
): string {
  return `${subjectId}:${unitId}:${lessonId}`;
}

export function countLessons(subject: Subject): number {
  return subject.units.reduce((n, u) => n + u.lessons.length, 0);
}

export function countQuizzes(subject: Subject): number {
  return subject.units.reduce(
    (n, u) => n + u.lessons.reduce((m, l) => m + l.quizzes.length, 0),
    0
  );
}
