import { GoogleGenerativeAI } from "@google/generative-ai";
import { loadEnv, requireGeminiApiKey } from "./loadEnv.mjs";

loadEnv();

/** 무료 티어: gemini-1.5-flash 권장. .env 에 GEMINI_MODEL= 로 변경 가능 */
function getDefaultModel() {
  return process.env.GEMINI_MODEL?.trim() || "gemini-2.0-flash-lite";
}

export function createGeminiClient() {
  const apiKey = requireGeminiApiKey();
  return new GoogleGenerativeAI(apiKey);
}

/**
 * @param {string} prompt
 * @param {{ model?: string; systemInstruction?: string }} [options]
 */
export async function generateText(prompt, options = {}) {
  const genAI = createGeminiClient();
  const model = genAI.getGenerativeModel({
    model: options.model ?? getDefaultModel(),
    ...(options.systemInstruction
      ? { systemInstruction: options.systemInstruction }
      : {}),
  });
  const result = await model.generateContent(prompt);
  return result.response.text();
}
