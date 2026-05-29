import type { ExamScopeItem, Quiz, Subject } from "../types";
import { getUnitQuizzes as getUnitQuizzesFromUnit } from "../lib/geminiContent";

export const getUnitQuizzes = getUnitQuizzesFromUnit;
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

export function getSectionKey(
  subjectId: string,
  unitId: string,
  sectionId: string
): string {
  return `${subjectId}:${unitId}:section:${sectionId}`;
}

export function getUnitQuizKey(subjectId: string, unitId: string): string {
  return `${subjectId}:${unitId}:unit-quiz`;
}

export function unitUsesSections(unit: Subject["units"][number]): boolean {
  return Boolean(unit.sections?.length);
}

export function countStudyItems(subject: Subject): number {
  return subject.units.reduce((n, u) => {
    if (unitUsesSections(u)) {
      return n + (u.sections?.length ?? 0) + 1;
    }
    return n + u.lessons.length;
  }, 0);
}

export function getUnitProgressKeys(
  subjectId: string,
  unit: Subject["units"][number]
): string[] {
  if (unitUsesSections(unit)) {
    const sectionKeys =
      unit.sections?.map((s) => getSectionKey(subjectId, unit.id, s.id)) ?? [];
    return [...sectionKeys, getUnitQuizKey(subjectId, unit.id)];
  }
  return unit.lessons.map((l) => getLessonKey(subjectId, unit.id, l.id));
}

export function countLessons(subject: Subject): number {
  return countStudyItems(subject);
}

export function countQuizzes(subject: Subject): number {
  return subject.units.reduce((n, u) => n + getUnitQuizzesFromUnit(u).length, 0);
}

export function getAllQuizzes(subject: Subject): Quiz[] {
  return subject.units.flatMap((u) => getUnitQuizzesFromUnit(u));
}

/** 기술·가정: 단원당 20문항 고정, 도덕: 실제 문항 수 */
export function getUnitQuizLabel(unit: Subject["units"][number]): string {
  const n = getUnitQuizzesFromUnit(unit).length;
  return `단원 퀴즈 ${n}문항`;
}

export function getExamScope(subject: Subject): ExamScopeItem[] {
  return subject.units.map((unit) => ({
    id: `exam-${subject.id}-${unit.id}`,
    unitId: unit.id,
    label: unit.title,
    hint: unit.subtitle,
  }));
}
