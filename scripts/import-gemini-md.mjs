/**
 * Gemini MD → data/tech-home/*.json
 * Usage: node scripts/import-gemini-md.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const MD_PATH = process.env.GEMINI_MD_PATH
  ? path.isAbsolute(process.env.GEMINI_MD_PATH)
    ? process.env.GEMINI_MD_PATH
    : path.join(ROOT, process.env.GEMINI_MD_PATH)
  : path.join(ROOT, "docs", "gemini-code-1780039929126.md");
const OUT_DIR = path.join(ROOT, "data", "tech-home");

const UNIT_META = [
  {
    id: "unit1",
    title: "Ⅰ. 청소년의 발달과 인간관계",
    subtitle: "가정 영역 · 9기가01",
    curriculumCodes: ["9기가01-01", "9기가01-02"],
    textbookPages: "p. 10 ~ 39",
    textbookRef: "교과서 Ⅰ. 청소년의 발달과 인간관계",
    questionSectionRanges: [
      { sectionOrder: 1, from: 1, to: 10 },
      { sectionOrder: 2, from: 11, to: 20 },
    ],
  },
  {
    id: "unit2",
    title: "Ⅱ. 청소년의 의식주 생활과 건강",
    subtitle: "가정 영역 · 9기가02",
    curriculumCodes: ["9기가02-01"],
    textbookPages: "p. 40 ~ 89",
    textbookRef: "교과서 Ⅱ. 청소년의 의식주 생활과 건강",
    questionSectionRanges: [
      { sectionOrder: 1, from: 1, to: 7 },
      { sectionOrder: 2, from: 8, to: 13 },
      { sectionOrder: 3, from: 14, to: 20 },
    ],
  },
  {
    id: "unit3",
    title: "Ⅲ. 청소년의 자기 관리와 주도적인 삶",
    subtitle: "가정 영역 · 9기가01",
    curriculumCodes: ["9기가01-03"],
    textbookPages: "p. 90 ~ 129",
    textbookRef: "교과서 Ⅲ. 청소년의 자기 관리와 주도적인 삶",
    questionSectionRanges: [
      { sectionOrder: 1, from: 1, to: 10 },
      { sectionOrder: 2, from: 11, to: 20 },
    ],
  },
  {
    id: "unit4",
    title: "Ⅳ. 기술과 발명",
    subtitle: "기술 영역 · 9기가03",
    curriculumCodes: ["9기가03-01"],
    textbookPages: "p. 130 ~ 169",
    textbookRef: "교과서 Ⅳ. 기술과 발명",
    questionSectionRanges: [
      { sectionOrder: 1, from: 1, to: 10 },
      { sectionOrder: 2, from: 11, to: 20 },
    ],
  },
  {
    id: "unit5",
    title: "Ⅴ. 재료와 제품 설계 및 제작",
    subtitle: "기술 영역 · 9기가03",
    curriculumCodes: ["9기가03-02"],
    textbookPages: "p. 170 ~ 209",
    textbookRef: "교과서 Ⅴ. 재료와 제품 설계 및 제작",
    questionSectionRanges: [
      { sectionOrder: 1, from: 1, to: 10 },
      { sectionOrder: 2, from: 11, to: 20 },
    ],
  },
  {
    id: "unit6",
    title: "Ⅵ. 친환경 에너지와 수송 기술",
    subtitle: "기술 영역 · 9기가03",
    curriculumCodes: ["9기가03-03"],
    textbookPages: "p. 210 ~ 258",
    textbookRef: "교과서 Ⅵ. 친환경 에너지와 수송 기술",
    questionSectionRanges: [
      { sectionOrder: 1, from: 1, to: 10 },
      { sectionOrder: 2, from: 11, to: 20 },
    ],
  },
];

const CIRCLED = ["①", "②", "③", "④", "⑤", "⑥"];
const CHOICE_IDS = ["a", "b", "c", "d", "e", "f"];

function extractKeywords(text) {
  const matches = text.match(/\*\*([^*]+)\*\*/g);
  if (!matches) return [];
  return [...new Set(matches.map((m) => m.slice(2, -2).trim()))].slice(0, 12);
}

function parseChoices(line) {
  const parts = line.replace(/^\*\s+\*\*선지:\*\*\s*/, "").split(/\s*\/\s*/);
  return parts.map((part, i) => {
    const trimmed = part.trim();
    const circled = CIRCLED.find((c) => trimmed.startsWith(c));
    let text = trimmed;
    if (circled) {
      text = trimmed.slice(circled.length).trim();
    }
    return { id: CHOICE_IDS[i] ?? `opt${i}`, text };
  });
}

function parseCorrectAnswer(line) {
  const m = line.match(/\*\*정답:\*\*\s*(.+)/);
  if (!m) return null;
  const raw = m[1].trim();
  const idx = CIRCLED.indexOf(raw);
  return idx >= 0 ? CHOICE_IDS[idx] : null;
}

function parseField(line, field) {
  const re = new RegExp(`\\*\\*${field}:\\*\\*\\s*(.+)`);
  const m = line.match(re);
  return m ? m[1].trim() : null;
}

function parsePart1(md) {
  const part1 = md.split("# PART 2.")[0];
  const units = [];
  let currentUnit = null;
  let currentSection = null;

  for (const line of part1.split("\n")) {
    const unitMatch = line.match(/^## 대단원 ([ⅠⅡⅢⅣⅤⅥ]+)\.\s+(.+)$/);
    if (unitMatch) {
      if (currentUnit) units.push(currentUnit);
      currentUnit = {
        roman: unitMatch[1],
        title: unitMatch[2].trim(),
        sections: [],
      };
      currentSection = null;
      continue;
    }

    const sectionMatch = line.match(/^### (\d+)\.\s+(.+)$/);
    if (sectionMatch && currentUnit) {
      currentSection = {
        order: Number(sectionMatch[1]),
        title: `${sectionMatch[1]}. ${sectionMatch[2].trim()}`,
        bullets: [],
      };
      currentUnit.sections.push(currentSection);
      continue;
    }

    const bulletMatch = line.match(/^\*\s{3}(.+)$/);
    if (bulletMatch && currentSection) {
      currentSection.bullets.push(bulletMatch[1].trim());
    }
  }
  if (currentUnit) units.push(currentUnit);
  return units;
}

function parsePart2(md) {
  const part2 = md.split("# PART 2.")[1] ?? "";
  const blocks = part2.split(/^### Q(\d+)/m).slice(1);
  const byUnit = {};

  let currentUnitNum = 0;
  const lines = part2.split("\n");
  let qBlocks = [];
  let currentQ = null;

  for (const line of lines) {
    const unitHeader = line.match(/^## \[UNIT_(\d+)\]/);
    if (unitHeader) {
      if (currentQ) qBlocks.push(currentQ);
      if (qBlocks.length) byUnit[currentUnitNum] = qBlocks;
      currentUnitNum = Number(unitHeader[1]);
      qBlocks = [];
      currentQ = null;
      continue;
    }

    const qStart = line.match(/^### Q(\d+)$/);
    if (qStart) {
      if (currentQ) qBlocks.push(currentQ);
      currentQ = { order: Number(qStart[1]), fields: [] };
      continue;
    }

    if (currentQ && line.startsWith("*")) {
      currentQ.fields.push(line);
    }
  }
  if (currentQ) qBlocks.push(currentQ);
  if (qBlocks.length) byUnit[currentUnitNum] = qBlocks;

  return byUnit;
}

function questionsToJson(unitId, qBlocks, sectionRanges, sections) {
  return qBlocks.map((block) => {
    const stemLine = block.fields.find((f) => f.includes("**발문:**"));
    const choiceLine = block.fields.find((f) => f.includes("**선지:**"));
    const answerLine = block.fields.find((f) => f.includes("**정답:**"));
    const explainLine = block.fields.find((f) => f.includes("**해설:**"));

    const stem = parseField(stemLine ?? "", "발문") ?? "";
    const options = parseChoices(choiceLine ?? "");
    const correctId = parseCorrectAnswer(answerLine ?? "") ?? "a";
    const explanation = parseField(explainLine ?? "", "해설") ?? "";

    let sectionId;
    for (const range of sectionRanges) {
      if (block.order >= range.from && block.order <= range.to) {
        const sec = sections.find((s) => s.order === range.sectionOrder);
        sectionId = sec?.id;
        break;
      }
    }

    return {
      id: `${unitId}-q${String(block.order).padStart(2, "0")}`,
      unitId,
      sectionId,
      order: block.order,
      question: stem,
      options,
      correctId,
      explanation,
      tags: extractKeywords(stem + explanation),
    };
  });
}

function buildSections(unitId, rawSections) {
  return rawSections.map((s) => ({
    id: `${unitId}-s${String(s.order).padStart(2, "0")}`,
    unitId,
    order: s.order,
    title: s.title,
    bullets: s.bullets,
    keywords: extractKeywords(s.bullets.join(" ")),
  }));
}

function main() {
  const md = fs.readFileSync(MD_PATH, "utf8");
  const part1Units = parsePart1(md);
  const part2ByUnit = parsePart2(md);

  fs.mkdirSync(OUT_DIR, { recursive: true });

  let totalQuestions = 0;

  for (let i = 0; i < UNIT_META.length; i++) {
    const meta = UNIT_META[i];
    const rawUnit = part1Units[i];
    if (!rawUnit) {
      console.error(`Missing PART1 unit at index ${i}`);
      process.exit(1);
    }

    const sections = buildSections(meta.id, rawUnit.sections);
    const qBlocks = part2ByUnit[i + 1] ?? [];
    const questions = questionsToJson(
      meta.id,
      qBlocks,
      meta.questionSectionRanges,
      sections
    );

    if (questions.length !== 20) {
      console.error(`${meta.id}: expected 20 questions, got ${questions.length}`);
      process.exit(1);
    }

    totalQuestions += questions.length;

    const unitJson = {
      id: meta.id,
      title: meta.title,
      subtitle: meta.subtitle,
      curriculumCodes: meta.curriculumCodes,
      textbookRef: meta.textbookRef,
      textbookPages: meta.textbookPages,
      textbookChapters: sections.map((s) => s.title),
      studyGuide:
        "e북 해당 단원을 읽은 뒤 핵심 요약을 확인하고, 단원 퀴즈 20문항으로 기말고사를 대비하세요.",
      goals: sections.map((s) => `${s.title} 핵심 개념을 설명할 수 있다.`),
      sections,
      questions,
    };

    fs.writeFileSync(
      path.join(OUT_DIR, `${meta.id}.json`),
      JSON.stringify(unitJson, null, 2),
      "utf8"
    );
    console.log(`✓ ${meta.id}.json — ${sections.length} sections, ${questions.length} questions`);
  }

  const meta = {
    subject: "tech-home",
    grade: 1,
    publisher: "천재교육",
    author: "이춘식",
    curriculum: "2022",
    questionCount: totalQuestions,
    unitCount: UNIT_META.length,
    version: "2026-05-gemini-v1",
    source: "docs/gemini-code-1780039929126.md",
  };

  fs.writeFileSync(
    path.join(OUT_DIR, "meta.json"),
    JSON.stringify(meta, null, 2),
    "utf8"
  );

  console.log(`\nTotal: ${totalQuestions} questions across ${UNIT_META.length} units`);
}

main();
