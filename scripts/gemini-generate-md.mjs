/**
 * Gemini API로 import 가능한 MD 생성
 *
 * Usage:
 *   node scripts/gemini-generate-md.mjs ethics
 *   node scripts/gemini-generate-md.mjs tech-home
 *   node scripts/gemini-generate-md.mjs tech-home unit3
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { generateText } from "./gemini-client.mjs";
import {
  assembleTechHomeMd,
  ethicsFullPrompt,
  TECH_HOME_UNITS,
  techHomeUnitPrompt,
} from "./gemini-prompts.mjs";
import { stripCodeFence, sleep } from "./gemini-utils.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

const OUT_PATHS = {
  ethics: path.join(ROOT, "docs", "gemini-code-1780040427395.md"),
  "tech-home": path.join(ROOT, "docs", "gemini-code-1780039929126.md"),
};

const SYSTEM = `당신은 중학교 교과 학습 DB를 만드는 전문가입니다.
지시한 마크다운 형식을 정확히 따르고, 한국어 교육용어를 사용합니다.
출력은 순수 마크다운만 하며 설명 문장은 넣지 않습니다.`;

function splitTechHomeUnit(raw, unit) {
  const unitHeaderRe = new RegExp(
    `## \\[UNIT_${unit.unitNum}\\][\\s\\S]*$`,
    "m"
  );
  const part2Match = raw.match(unitHeaderRe);
  const part2 = part2Match ? part2Match[0].trim() : "";

  const part1Match = raw.match(
    /^## 대단원[\s\S]*?(?=---\s*\n\s*## \[UNIT_|$)/m
  );
  let part1 = part1Match ? part1Match[0].trim() : raw;
  part1 = part1.replace(/\n---\s*$/, "").trim();

  if (!part2.includes("### Q01")) {
    throw new Error(`${unit.id}: PART 2 (문항 20개) 형식이 올바르지 않습니다.`);
  }
  return { part1, part2 };
}

async function generateEthics(outPath) {
  console.log("도덕 ① 전체 MD 생성 중…");
  const raw = await generateText(ethicsFullPrompt(), { systemInstruction: SYSTEM });
  const md = stripCodeFence(raw);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, md + "\n", "utf8");
  console.log(`✓ 저장: ${path.relative(ROOT, outPath)}`);
}

async function generateTechHome(outPath, onlyUnitId) {
  const units = onlyUnitId
    ? TECH_HOME_UNITS.filter((u) => u.id === onlyUnitId)
    : TECH_HOME_UNITS;

  if (units.length === 0) {
    console.error(`알 수 없는 단원: ${onlyUnitId}`);
    process.exit(1);
  }

  const chunks = [];
  for (const unit of units) {
    console.log(`기술·가정 ${unit.id} (${unit.title}) 생성 중…`);
    const raw = await generateText(techHomeUnitPrompt(unit), {
      systemInstruction: SYSTEM,
    });
    chunks.push(splitTechHomeUnit(stripCodeFence(raw), unit));
    await sleep(2000);
  }

  let md;
  if (onlyUnitId && fs.existsSync(outPath)) {
    console.log("기존 MD에 단원 병합은 아직 미지원 — 전체 tech-home 생성을 권장합니다.");
    md = assembleTechHomeMd(chunks);
  } else {
    md = assembleTechHomeMd(chunks);
  }

  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, md, "utf8");
  console.log(`✓ 저장: ${path.relative(ROOT, outPath)} (${units.length}단원)`);
}

async function main() {
  const subject = process.argv[2];
  const unitId = process.argv[3];

  if (!subject || !OUT_PATHS[subject]) {
    console.error("Usage: node scripts/gemini-generate-md.mjs <ethics|tech-home> [unitId]");
    process.exit(1);
  }

  const outPath = OUT_PATHS[subject];

  if (subject === "ethics") {
    await generateEthics(outPath);
  } else {
    await generateTechHome(outPath, unitId);
  }
}

main().catch((err) => {
  console.error("✗", err instanceof Error ? err.message : err);
  process.exit(1);
});
