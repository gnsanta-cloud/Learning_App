/** 중학교 기말·내신 객관식 출제 유형 (평가문제집·기출 패턴 참고) */

export const EXAM_STEMS = {
  correct: (term, topic) => [
    `"${term}"에 대한 설명으로 옳은 것은?`,
    `"${term}"의 의미로 알맞은 것은?`,
    `다음 중 "${term}"에 대해 바르게 설명한 것은?`,
    `${topic}에서 "${term}"과(와) 관련하여 옳은 것은?`,
  ],
  incorrect: (term) => [
    `"${term}"에 대한 설명으로 옳지 않은 것은?`,
    `"${term}"과(와) 관련하여 틀린 것은?`,
  ],
  appropriate: (topic) => [
    `${topic}에 대한 바람직한 태도는?`,
    `${topic}과(와) 관련하여 바람직한 것은?`,
    `다음 중 ${topic}에 해당하는 것은?`,
  ],
  feature: (term) => [
    `"${term}"의 특징으로 알맞은 것은?`,
    `"${term}"에 대한 설명으로 적절한 것은?`,
  ],
  practice: (topic) => [
    `${topic}을(를) 실천하기 위해 필요한 것은?`,
    `일상에서 ${topic}과(와) 관련하여 할 수 있는 것은?`,
  ],
  cause: (term) => [
    `"${term}"이(가) 나타나는 이유로 알맞은 것은?`,
    `"${term}"의 결과로 알맞은 것은?`,
  ],
  compare: (topic) => [
    `${topic}에 대한 설명으로 옳은 것은?`,
    `다음 중 ${topic}과(와) 관련하여 옳은 것은?`,
  ],
};

export const WRONG_PATTERNS = [
  (s) => s.replace(/(?:라고|이라고)\s*한다\.?/, "와 관련이 없다."),
  (s) => s.replace(/중요(?:하다|합니다)/, "중요하지 않다"),
  (s) => s.replace(/바람직(?:하)?(?:다|한)?/, "바람직하지 않다"),
  (s) => s.replace(/개인(?:마다|차)/, "모두 동일하게"),
  (s) => s.replace(/긍정적(?:으로|인)?/, "부정적으로"),
  (s) => s.replace(/예방/, "방치"),
  (s) => s.replace(/절약/, "낭비"),
  (s) => s.replace(/안전(?:하게|한)?/, "위험하게"),
  (s) => s.replace(/친환경/, "환경을 해치는"),
  (s) => s.replace(/균형(?: 있게|잡힌)?/, "균형 없이"),
];

export function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/** eBook OCR: 음절 사이 잘못 끊긴 공백 복원 */
export function fixOcrSpaces(text) {
  let t = text.replace(/[\u0000-\u001f\u0007\u200b]/g, "").replace(/\s+/g, " ").trim();
  const spaceRatio = (t.match(/\s/g) || []).length / Math.max(t.length, 1);
  if (spaceRatio > 0.07) return t;

  for (let i = 0; i < 4; i++) {
    t = t.replace(/([가-힣])\s+([가-힣])/g, "$1$2");
  }
  return t
    .replace(
      /([가-힣]{2,})(을|를|은|는|이|가|과|와|에|의|도|만|에서|으로|에게|하며|하고|하거나|게|이다|한다|있다|없다|때|면)/g,
      "$1 $2"
    )
    .replace(/\s+/g, " ")
    .trim();
}

export function cleanOption(text) {
  return fixOcrSpaces(text)
    .replace(/([가-힣])수([가-힣])/g, "$1수 $2")
    .replace(/([가-힣])에([가-힣])/g, "$1에 $2")
    .replace(/([가-힣])를([가-힣])/g, "$1를 $2")
    .replace(/([가-힣])과([가-힣])/g, "$1과 $2")
    .replace(/([가-힣])에\s+게/g, "$1에 게")
    .replace(/([가-힣])자신의/g, "$1 자신의")
    .replace(/▲|그림|Link|활동|e북|교과서\s*쪽/g, "")
    .trim();
}

export function shortenTerm(term, max = 14) {
  const t = term.replace(/\s+/g, "").slice(0, max);
  return t.length >= 2 ? t : "핵심 개념";
}
