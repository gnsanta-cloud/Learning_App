#!/usr/bin/env node
/**
 * 퀴즈 데이터 자동 검수: 정답 일치, 문항-보기 연관, 옳지 않은 것 유형 등
 */
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const DATA_DIR = join(process.cwd(), "src/data/techHome");

function loadQuizzes() {
  const files = readdirSync(DATA_DIR).filter((f) => f.startsWith("unit") && f.endsWith(".ts"));
  const all = [];
  for (const file of files) {
    const content = readFileSync(join(DATA_DIR, file), "utf8");
    const unitMatch = content.match(/title:\s*"([^"]+)"/);
    const unitTitle = unitMatch?.[1] ?? file;

    const quizBlocks = content.matchAll(
      /question:\s*"((?:\\.|[^"\\])*)",[\s\S]*?sourcePage:\s*(\d+),[\s\S]*?options:\s*\[([\s\S]*?)\],[\s\S]*?correctId:\s*"([a-d])",[\s\S]*?explanation:\s*"((?:\\.|[^"\\])*)"/g
    );

    for (const m of quizBlocks) {
      const question = JSON.parse(`"${m[1]}"`);
      const sourcePage = Number(m[2]);
      const optionsRaw = m[3];
      const correctId = m[4];
      const explanation = JSON.parse(`"${m[5]}"`);

      const options = [...optionsRaw.matchAll(/\{\s*id:\s*"([a-d])",\s*text:\s*"((?:\\.|[^"\\])*)"\s*\}/g)].map(
        (o) => ({ id: o[1], text: JSON.parse(`"${o[2]}"`) })
      );

      const lessonMatch = content.slice(0, m.index).match(/title:\s*"([^"]+)"[^]*$/);
      const lessonTitle = lessonMatch?.[1] ?? "?";

      all.push({ file, unitTitle, lessonTitle, question, sourcePage, options, correctId, explanation });
    }
  }
  return all;
}

function extractTerm(question) {
  const m =
    question.match(/"([^"]+)"에 대한/) ||
    question.match(/"([^"]+)"의 의미/) ||
    question.match(/"([^"]+)"에 대해/) ||
    question.match(/"([^"]+)"과\(와\)/);
  return m?.[1] ?? null;
}

function isIncorrectType(question) {
  return /옳지 않은|틀린 것|맞지 않는/.test(question);
}

function audit(quizzes) {
  const issues = [];

  for (const q of quizzes) {
    const correctOpt = q.options.find((o) => o.id === q.correctId);
    if (!correctOpt) {
      issues.push({ severity: "error", ...q, msg: "correctId에 해당하는 보기 없음" });
      continue;
    }

    if (q.options.length !== 4) {
      issues.push({ severity: "error", ...q, msg: `보기 ${q.options.length}개` });
    }

    const dupTexts = q.options.map((o) => o.text.trim());
    if (new Set(dupTexts).size !== dupTexts.length) {
      issues.push({ severity: "error", ...q, msg: "중복 보기" });
    }

    if (!q.explanation.includes(correctOpt.text.slice(0, 12)) && !isIncorrectType(q.question)) {
      const expCore = q.explanation.replace(/^"[^"]+"의 올바른 설명:\s*/, "");
      if (expCore.trim() !== correctOpt.text.trim() && !expCore.includes(correctOpt.text.slice(0, 15))) {
        issues.push({
          severity: "warn",
          ...q,
          msg: `정답 보기와 explanation 불일치: "${correctOpt.text.slice(0, 30)}…"`,
        });
      }
    }

    if (isIncorrectType(q.question)) {
      const term = extractTerm(q.question);
      const correctWrong = correctOpt.text;
      const hasTrueForTerm = q.options.some(
        (o) => o.id !== q.correctId && o.text.length > 15 && (term ? !o.text.includes(term.slice(0, 4)) : true)
      );
      if (term && correctWrong.length > 20) {
        // wrong pick should NOT be the actual definition of the term
        const expDef = q.explanation.replace(/^"[^"]+"의 올바른 설명:\s*/, "").trim();
        if (expDef && correctWrong.slice(0, 20) === expDef.slice(0, 20)) {
          issues.push({ severity: "error", ...q, msg: "옳지 않은 것인데 정답이 올바른 설명과 동일" });
        }
      }
      if (!hasTrueForTerm) {
        issues.push({ severity: "warn", ...q, msg: "옳지 않은 것 문항에 옳은 설명 보기 부족" });
      }
    } else {
      const term = extractTerm(q.question);
      if (term && correctOpt.text.length < 12) {
        issues.push({ severity: "warn", ...q, msg: `용어 "${term}"인데 정답이 너무 짧음` });
      }
      if (term && !q.explanation.includes(term.slice(0, 2)) && !correctOpt.text.includes(term.slice(0, 2))) {
        // term might still match via definition
      }
    }

    for (const o of q.options) {
      if (o.text.length < 10) {
        issues.push({ severity: "warn", ...q, msg: `짧은/깨진 보기 (${o.id}): "${o.text}"` });
      }
      if (/[\u0006\u0007]/.test(o.text)) {
        issues.push({ severity: "error", ...q, msg: `OCR 잡음 (${o.id})` });
      }
      if (/^(?:고,|•|➊|➋|Q\s|사례\s*\d)/.test(o.text)) {
        issues.push({ severity: "warn", ...q, msg: `조각 보기 (${o.id}): "${o.text.slice(0, 40)}…"` });
      }
      if (!/[다님음][.!?]?$/.test(o.text.trim()) && o.text.length < 40 && !/(?:현상|능력|과정|상태|유형|체계|기관|역할|의미)[.!?]?$/.test(o.text.trim())) {
        issues.push({ severity: "warn", ...q, msg: `미완성 문장 (${o.id}): "${o.text.slice(0, 45)}…"` });
      }
    }

    if (/옳은 것|알맞은 것|바르게/.test(q.question) && isIncorrectType(q.question) === false) {
      const term = extractTerm(q.question);
      if (term) {
        const expDef = q.explanation.replace(/^"[^"]+"의 올바른 설명:\s*/, "").trim() || q.explanation.trim();
        const sim = correctOpt.text.trim() === expDef || expDef.includes(correctOpt.text.slice(0, 20));
        if (!sim && !correctOpt.text.includes(term) && term.length > 3) {
          issues.push({
            severity: "error",
            ...q,
            msg: `문항 용어 "${term}" vs 정답 내용 불일치`,
          });
        }
      }
    }
  }

  return issues;
}

const quizzes = loadQuizzes();
const issues = audit(quizzes);

console.log(`\n검수: ${quizzes.length}문항, 이슈 ${issues.length}건\n`);

const bySeverity = { error: [], warn: [] };
for (const i of issues) bySeverity[i.severity].push(i);

for (const sev of ["error", "warn"]) {
  console.log(`\n=== ${sev.toUpperCase()} (${bySeverity[sev].length}) ===`);
  for (const i of bySeverity[sev].slice(0, 40)) {
    console.log(`\n[${i.file}] ${i.lessonTitle} p.${i.sourcePage}`);
    console.log(`  Q: ${i.question}`);
    console.log(`  정답(${i.correctId}): ${i.options.find((o) => o.id === i.correctId)?.text.slice(0, 60)}…`);
    console.log(`  → ${i.msg}`);
  }
  if (bySeverity[sev].length > 40) console.log(`  … 외 ${bySeverity[sev].length - 40}건`);
}

console.log(`\n요약: error ${bySeverity.error.length}, warn ${bySeverity.warn.length}`);
