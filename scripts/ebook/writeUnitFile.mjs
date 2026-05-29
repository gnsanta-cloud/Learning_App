import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

function tsStr(value) {
  return JSON.stringify(value);
}

function writeQuiz(quiz) {
  const opts = quiz.options
    .map((o) => `{ id: ${tsStr(o.id)}, text: ${tsStr(o.text)} }`)
    .join(", ");
  return `        {
          question: ${tsStr(quiz.question)},
          options: [${opts}],
          correctId: ${tsStr(quiz.correctId)},
          explanation: ${tsStr(quiz.explanation)},
        }`;
}

function writeLesson(prefix, meta, content) {
  const reflections =
    content.reflections?.length > 0
      ? `\n      reflections: [${content.reflections.map((r) => tsStr(r)).join(", ")}],`
      : "";

  const quizzes = content.quizzes.map(writeQuiz).join(",\n");

  return `    lesson(${tsStr(prefix)}, {
      id: ${tsStr(meta.id)},
      title: ${tsStr(meta.title)},
      summary: ${tsStr(content.summary)},
      points: [
${content.points.map((p) => `        ${tsStr(p)},`).join("\n")}
      ],
      keywords: [${content.keywords.map((k) => tsStr(k)).join(", ")}],${reflections}
      quizzes: [
${quizzes}
      ],
    })`;
}

/** 기존 파일에서 lessons 외 메타 필드 추출 */
export function readUnitMeta(filePath) {
  const content = readFileSync(filePath, "utf8");
  const exportMatch = content.match(/export const (\w+): Unit = \{/);
  if (!exportMatch) throw new Error(`Invalid unit file: ${filePath}`);

  const lessonsIdx = content.indexOf("lessons:");
  if (lessonsIdx < 0) throw new Error(`No lessons in ${filePath}`);

  const header = content.slice(0, lessonsIdx);
  return { exportName: exportMatch[1], header: header.trimEnd() };
}

export function writeUnitFile(filePath, exportName, header, lessonsBlock) {
  const body = `${header}
  lessons: [
${lessonsBlock}
  ],
};
`;
  writeFileSync(filePath, body, "utf8");
  console.log(`  ✓ ${exportName} → ${filePath}`);
}

export function buildLessonsBlock(unitConfig, lessonContents) {
  return lessonContents
    .map((content, i) => {
      const meta = unitConfig.lessonMeta[i];
      return writeLesson(meta.prefix, meta, content);
    })
    .join(",\n");
}

export function resolveUnitPath(outputDir, filename) {
  return join(process.cwd(), outputDir, filename);
}
