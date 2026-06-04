import type { Quiz, Section, Subject, Unit } from "../types";
import { getUnitQuizzes } from "./geminiContent";

export type AiSayStep = {
  kind: "say";
  id: string;
  text: string;
};

export type AiTeachStep = {
  kind: "teach";
  id: string;
  sectionTitle: string;
  bullet: string;
  keywords: string[];
};

export type AiCheckStep = {
  kind: "check";
  id: string;
  sectionTitle: string;
  sectionId: string;
};

export type AiQuizStep = {
  kind: "quiz";
  id: string;
  quiz: Quiz;
  index: number;
  total: number;
};

export type AiCompleteStep = {
  kind: "complete";
  id: string;
};

export type AiTeacherStep =
  | AiSayStep
  | AiTeachStep
  | AiCheckStep
  | AiQuizStep
  | AiCompleteStep;

export function buildAiTeacherSteps(
  subject: Subject,
  unit: Unit
): AiTeacherStep[] {
  const steps: AiTeacherStep[] = [];
  let n = 0;
  const id = () => `step-${++n}`;

  steps.push({
    kind: "say",
    id: id(),
    text: `안녕! **${subject.shortName}** 과목의 「${unit.title}」 단원을 함께 공부해 보자.`,
  });

  if (unit.studyGuide) {
    steps.push({
      kind: "say",
      id: id(),
      text: `📌 **학습 방법:** ${unit.studyGuide}`,
    });
  }

  if (unit.goals?.length) {
    steps.push({
      kind: "say",
      id: id(),
      text: `🎯 **학습 목표**\n${unit.goals.map((g) => `· ${g}`).join("\n")}`,
    });
  }

  const sections = unit.sections ?? [];
  if (sections.length > 0) {
    steps.push({
      kind: "say",
      id: id(),
      text: `이 단원은 **${sections.length}개** 소주제로 나눠서 설명할게. 준비됐지?`,
    });

    for (const section of sections) {
      appendSectionSteps(steps, section, id);
    }
  } else if (unit.lessons.length > 0) {
    for (const lesson of unit.lessons) {
      steps.push({
        kind: "say",
        id: id(),
        text: `📖 **${lesson.title}**\n${lesson.summary}`,
      });
      for (const point of lesson.points) {
        steps.push({
          kind: "teach",
          id: id(),
          sectionTitle: lesson.title,
          bullet: point,
          keywords: lesson.keywords,
        });
      }
    }
  } else {
    steps.push({
      kind: "say",
      id: id(),
      text: "이 단원은 활동지와 퀴즈로 복습해 보자!",
    });
  }

  const quizzes = getUnitQuizzes(unit);
  const sample = quizzes.slice(0, Math.min(3, quizzes.length));
  if (sample.length > 0) {
    steps.push({
      kind: "say",
      id: id(),
      text: `좋아! 이제 **확인 문제 ${sample.length}개**로 배운 내용을 점검해 볼게.`,
    });
    sample.forEach((quiz, index) => {
      steps.push({
        kind: "quiz",
        id: id(),
        quiz,
        index: index + 1,
        total: sample.length,
      });
    });
  }

  steps.push({ kind: "complete", id: id() });
  return steps;
}

function appendSectionSteps(
  steps: AiTeacherStep[],
  section: Section,
  id: () => string
) {
  steps.push({
    kind: "say",
    id: id(),
    text: `── **${section.title}** ──\n이 부분을 집중해서 볼게!`,
  });

  for (const bullet of section.bullets) {
    steps.push({
      kind: "teach",
      id: id(),
      sectionTitle: section.title,
      bullet,
      keywords: section.keywords,
    });
  }

  steps.push({
    kind: "check",
    id: id(),
    sectionTitle: section.title,
    sectionId: section.id,
  });
}

export function getAiTeacherProgressTotal(unit: Unit): number {
  return (unit.sections?.length ?? unit.lessons.length) || 1;
}
