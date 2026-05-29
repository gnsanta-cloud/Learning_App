import type { Quiz, Section, Unit } from "../types";

export type GeminiQuestion = {
  id: string;
  unitId: string;
  sectionId?: string;
  order: number;
  question: string;
  options: { id: string; text: string }[];
  correctId: string;
  explanation: string;
  tags?: string[];
};

export type GeminiUnitJson = {
  id: string;
  title: string;
  subtitle: string;
  curriculumCodes?: string[];
  textbookRef?: string;
  textbookPages?: string;
  textbookChapters?: string[];
  studyGuide?: string;
  goals?: string[];
  sections: {
    id: string;
    title: string;
    bullets: string[];
    keywords: string[];
  }[];
  questions: GeminiQuestion[];
};

export function toQuiz(q: GeminiQuestion): Quiz {
  return {
    id: q.id,
    question: q.question,
    options: q.options,
    correctId: q.correctId,
    explanation: q.explanation,
  };
}

export function geminiJsonToUnit(raw: GeminiUnitJson): Unit {
  const sections: Section[] = raw.sections.map((s) => ({
    id: s.id,
    title: s.title,
    bullets: s.bullets,
    keywords: s.keywords,
  }));

  return {
    id: raw.id,
    title: raw.title,
    subtitle: raw.subtitle,
    textbookRef: raw.textbookRef,
    textbookChapters: raw.textbookChapters,
    textbookPages: raw.textbookPages,
    studyGuide: raw.studyGuide,
    goals: raw.goals,
    sections,
    unitQuizzes: raw.questions.map(toQuiz),
    lessons: [],
  };
}

export function getUnitQuizzes(unit: Unit): Quiz[] {
  if (unit.unitQuizzes?.length) return unit.unitQuizzes;
  return unit.lessons.flatMap((l) => l.quizzes);
}
