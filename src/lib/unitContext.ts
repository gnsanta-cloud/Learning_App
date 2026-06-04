import type { Subject, Unit } from "../types";
import { getUnitQuizzes } from "./geminiContent";

/** Gemini 프롬프트용 단원 텍스트 요약 */
export function buildUnitContext(subject: Subject, unit: Unit): string {
  const lines: string[] = [
    `과목: ${subject.name} (${subject.publisher})`,
    `단원: ${unit.title}`,
    unit.subtitle,
  ];

  if (unit.goals?.length) {
    lines.push("학습 목표:", ...unit.goals.map((g) => `- ${g}`));
  }

  if (unit.sections?.length) {
    for (const s of unit.sections) {
      lines.push(`\n[${s.title}]`);
      for (const b of s.bullets) {
        lines.push(`- ${b.replace(/\*\*/g, "")}`);
      }
    }
  }

  for (const lesson of unit.lessons) {
    lines.push(`\n[${lesson.title}]`, lesson.summary);
    for (const p of lesson.points) lines.push(`- ${p}`);
  }

  const quizzes = getUnitQuizzes(unit).slice(0, 5);
  if (quizzes.length) {
    lines.push("\n[참고 퀴즈]");
    for (const q of quizzes) {
      lines.push(`Q: ${q.question}`);
      lines.push(
        `선지: ${q.options.map((o) => o.text).join(" / ")} (정답 id: ${q.correctId})`
      );
    }
  }

  return lines.join("\n");
}
