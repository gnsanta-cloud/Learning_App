/**
 * GEMINI_API_KEY 연결 테스트
 * Usage: npm run gemini:test
 */
import { generateText } from "./gemini-client.mjs";

const prompt =
  process.argv.slice(2).join(" ") ||
  "한 문장으로 'API 연결 성공'이라고만 답해 주세요.";

try {
  const text = await generateText(prompt);
  console.log("✓ Gemini API 연결 성공\n");
  console.log(text.trim());
} catch (err) {
  console.error("✗ Gemini API 호출 실패:");
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
}
