#!/usr/bin/env node
/**
 * T셀파 eBook(EPUB HTML) 크롤 → 기술·가정 단원 퀴즈·요약 갱신
 *
 * 사용: npm run ebook:sync
 * 주의: 교과서 본문은 요약·문항 형태로만 반영 (저작권)
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { TSHERPA_TECH_HOME, VIVASAM_ETHICS } from "./ebook/config.mjs";
import {
  fetchPagesInRange,
  assignPageRangesFromUnits,
} from "./ebook/tsherpaCrawler.mjs";
import {
  extractDefinitionsFromPages,
  extractKeyPointsFromPages,
  extractKeywords,
  buildSummary,
} from "./ebook/textExtract.mjs";
import { generateQuizzes } from "./ebook/quizGenerator.mjs";
import {
  readUnitMeta,
  writeUnitFile,
  buildLessonsBlock,
  resolveUnitPath,
} from "./ebook/writeUnitFile.mjs";

const CACHE_DIR = join(process.cwd(), "data", "ebook-cache");

async function main() {
  const cfg = TSHERPA_TECH_HOME;
  console.log(`\n📚 eBook 크롤: ${cfg.label}\n`);

  mkdirSync(CACHE_DIR, { recursive: true });

  const lessonRanges = assignPageRangesFromUnits(cfg.units);
  writeFileSync(
    join(CACHE_DIR, "tech-home-ranges.json"),
    JSON.stringify(lessonRanges, null, 2),
    "utf8"
  );
  console.log(`1) ${lessonRanges.length}개 레슨 · EPUB p.${cfg.pageOffset + 1}~${cfg.maxPage + cfg.pageOffset} 범위`);

  console.log("\n2) EPUB 페이지 텍스트 추출 중…");
  const extracted = {};

  for (const range of lessonRanges) {
    const key = `${range.unitId}-${range.lessonIndex}`;
    process.stdout.write(
      `   ${range.unitId} L${range.lessonIndex + 1} p.${range.pageStart}~${range.pageEnd} … `
    );
    const { pages, text, textLength } = await fetchPagesInRange(
      cfg.epubBase,
      range.pageStart,
      range.pageEnd,
      cfg.pageOffset
    );
    extracted[key] = { ...range, pages, text, textLength };
    console.log(`${text.length}자`);
  }

  writeFileSync(
    join(CACHE_DIR, "tech-home-extracted.json"),
    JSON.stringify(
      Object.fromEntries(
        Object.entries(extracted).map(([k, v]) => [k, { ...v, text: v.text.slice(0, 500) + "…" }])
      ),
      null,
      2
    ),
    "utf8"
  );

  console.log("\n3) 퀴즈·요약 생성 및 단원 파일 갱신…");

  for (const unitCfg of cfg.units) {
    const filePath = resolveUnitPath(cfg.outputDir, unitCfg.file);
    const { exportName, header } = readUnitMeta(filePath);

    const lessonContents = [];
    for (let i = 0; i < unitCfg.lessonCount; i++) {
      const key = `${unitCfg.unitId}-${i}`;
      const data = extracted[key];
      const meta = unitCfg.lessonMeta[i];

      if (!data || data.textLength < 50) {
        console.warn(`   ⚠ ${key}: 텍스트 부족 — 기존 레슨 유지 필요`);
        lessonContents.push(fallbackLesson(meta.title));
        continue;
      }

      const defs = extractDefinitionsFromPages(data.pages);
      const points = extractKeyPointsFromPages(data.pages, 6);
      const keywords = extractKeywords(data.text, points, 5);
      const summary = buildSummary(points, meta.title);
      const quizzes = generateQuizzes(defs, points, 6, meta.title);

      lessonContents.push({
        summary,
        points:
          points.length > 0
            ? points.map((p) => p.text)
            : [`${meta.title}의 핵심 개념을 e북에서 학습합니다.`],
        keywords: keywords.length > 0 ? keywords : [meta.title.slice(0, 6)],
        reflections: [
          `${meta.title}에서 시험에 나올 핵심은?`,
          `교과서 내용을 바탕으로 예시를 들어 설명해 보자.`,
        ],
        quizzes,
        source: {
          pages: `${data.pageStart}~${data.pageEnd}`,
          sections: data.sectionNames,
          chars: data.textLength,
        },
      });
    }

    const lessonsBlock = buildLessonsBlock(unitCfg, lessonContents);
    writeUnitFile(filePath, exportName, header, lessonsBlock);
  }

  console.log("\n4) 도덕(비바샘) eBook");
  console.log(`   ⚠ ${VIVASAM_ETHICS.note}`);
  console.log(`   URL: ${VIVASAM_ETHICS.ebookUrl}`);

  console.log("\n✅ eBook 동기화 완료");
  console.log(`   캐시: ${CACHE_DIR}`);
  console.log("   다음: npm run build\n");
}

function fallbackLesson(title) {
  return {
    summary: `${title} — e북 본문을 읽고 퀴즈로 확인하세요.`,
    points: [`${title}의 핵심 내용을 e북에서 학습합니다.`],
    keywords: [title.slice(0, 6)],
    reflections: ["e북에서 중요한 부분을 표시해 보자."],
    quizzes: [
      {
        question: "학습 내용 확인을 위해 먼저 할 일은?",
        options: [
          { id: "a", text: "e북에서 해당 단원을 읽는다" },
          { id: "b", text: "퀴즈만 푼다" },
          { id: "c", text: "범위를 확인하지 않는다" },
          { id: "d", text: "핵심 개념을 정리하지 않는다" },
        ],
        correctId: "a",
        explanation: "e북 본문 학습 후 퀴즈로 확인하는 것이 좋습니다.",
      },
    ],
  };
}

main().catch((err) => {
  console.error("\n❌ eBook 크롤 실패:", err.message);
  process.exit(1);
});
