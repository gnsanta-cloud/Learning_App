/**
 * Gemini에 질문하고 응답을 stdout 또는 파일로 저장
 *
 * Usage:
 *   npm run gemini:ask -- "중1 기술가정 1단원 요약해줘"
 *   npm run gemini:ask -- "..." --out docs/generated.md
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { generateText } from "./gemini-client.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

function parseArgs(argv) {
  const outIdx = argv.indexOf("--out");
  let outPath;
  let args = [...argv];
  if (outIdx !== -1) {
    outPath = argv[outIdx + 1];
    args = args.filter((_, i) => i !== outIdx && i !== outIdx + 1);
  }
  const prompt = args.join(" ").trim();
  return { prompt, outPath };
}

const { prompt, outPath } = parseArgs(process.argv.slice(2));

if (!prompt) {
  console.error('Usage: npm run gemini:ask -- "질문 내용" [--out docs/file.md]');
  process.exit(1);
}

try {
  const text = await generateText(prompt, {
    systemInstruction:
      "당신은 중학교 1학년 교과(기술·가정, 도덕) 학습 자료를 만드는 교육 도우미입니다. 한국어로 명확하고 간결하게 답합니다.",
  });

  if (outPath) {
    const abs = path.isAbsolute(outPath)
      ? outPath
      : path.join(ROOT, outPath);
    fs.mkdirSync(path.dirname(abs), { recursive: true });
    fs.writeFileSync(abs, text.trim() + "\n", "utf8");
    console.log(`✓ 저장: ${path.relative(ROOT, abs)}`);
  } else {
    console.log(text.trim());
  }
} catch (err) {
  console.error("✗ 오류:", err instanceof Error ? err.message : err);
  process.exit(1);
}
