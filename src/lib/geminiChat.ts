import { GoogleGenerativeAI } from "@google/generative-ai";
import { AI_TEACHER } from "../config/aiTeacher";

const DEFAULT_MODEL = "gemini-2.0-flash-lite";

export type ChatTurn = {
  role: "user" | "model";
  text: string;
};

export async function askAiTeacherChat(params: {
  apiKey: string;
  unitContext: string;
  subjectName: string;
  unitTitle: string;
  history: ChatTurn[];
  userMessage: string;
  model?: string;
}): Promise<string> {
  const genAI = new GoogleGenerativeAI(params.apiKey);
  const model = genAI.getGenerativeModel({
    model: params.model ?? DEFAULT_MODEL,
    systemInstruction: `당신은 중학교 학습 앱의 AI 캐릭터 교사 "${AI_TEACHER.name}"입니다.
- 항상 한국어로, 친절하고 또래가 이해하기 쉽게 답합니다.
- 아래 단원 학습 자료 범위를 우선으로 답하되, 범위를 벗어나면 "이 단원에서는 ~를 배워요"라고 안내합니다.
- 짧은 문단(2~4문장)과 필요 시 불릿을 사용합니다.
- 정답을 바로 알려주기보다 힌트를 주고, 학생이 스스로 생각하도록 격려합니다.

[현재 단원]
과목: ${params.subjectName}
단원: ${params.unitTitle}

[단원 학습 자료]
${params.unitContext}`,
  });

  const historyForApi = params.history.slice(-12).map((t) => ({
    role: t.role,
    parts: [{ text: t.text }],
  }));

  const chat = model.startChat({ history: historyForApi });
  const result = await chat.sendMessage(params.userMessage);
  const text = result.response.text();
  if (!text?.trim()) {
    throw new Error("빈 응답을 받았습니다.");
  }
  return text.trim();
}

export function formatGeminiError(err: unknown): string {
  const msg = err instanceof Error ? err.message : String(err);
  if (msg.includes("429") || msg.includes("quota")) {
    return "API 사용 한도에 도달했어요. 잠시 후 다시 시도하거나 Google AI Studio 할당량을 확인해 주세요.";
  }
  if (msg.includes("API_KEY") || msg.includes("403")) {
    return "API 키가 올바르지 않아요. 설정에서 키를 다시 확인해 주세요.";
  }
  return `답변을 가져오지 못했어요. (${msg.slice(0, 120)})`;
}
