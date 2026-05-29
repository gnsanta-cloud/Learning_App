import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

/** 프로젝트 루트 `.env` 로드 (이미 설정된 process.env 는 덮어쓰지 않음) */
export function loadEnv() {
  const envPath = path.join(ROOT, ".env");
  if (!fs.existsSync(envPath)) return;

  const text = fs.readFileSync(envPath, "utf8");
  for (const line of text.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

export function requireGeminiApiKey() {
  loadEnv(); // GEMINI_MODEL 등도 함께 로드
  const key = process.env.GEMINI_API_KEY?.trim();
  if (!key) {
    console.error(
      "GEMINI_API_KEY 가 없습니다. 프로젝트 루트 .env 파일에 키를 설정하세요."
    );
    console.error("발급: https://aistudio.google.com/apikey");
    process.exit(1);
  }
  return key;
}
