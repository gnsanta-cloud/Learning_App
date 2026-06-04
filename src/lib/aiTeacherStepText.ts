import type { AiTeacherStep } from "./aiTeacherSteps";

export function stepToTeacherText(step: AiTeacherStep): string {
  switch (step.kind) {
    case "say":
      return step.text;
    case "teach":
      return `**${step.sectionTitle}**\n${step.bullet}`;
    case "check":
      return `**${step.sectionTitle}** 내용을 다 봤어? 이해했는지 알려줘! (아래 버튼을 누르거나, 궁금한 걸 채팅으로 물어봐도 돼)`;
    case "quiz":
      return `**확인 문제 ${step.index}/${step.total}**\n${step.quiz.question}`;
    case "complete":
      return "🎉 이 단원 핵심 설명을 모두 마쳤어! 궁금한 게 있으면 채팅으로 물어보고, 아래에서 퀴즈나 다른 단원으로 이동할 수 있어.";
    default:
      return "";
  }
}
