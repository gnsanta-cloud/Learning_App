/**
 * eBook 굵은 글씨(용어·소제목) 블록 → 내신형 객관식
 * 보기는 eBook 본문 문장만 사용, 생성 후 검증
 */
import { cleanOption } from "./examTemplates.mjs";

const TERM_STEMS = [
  (term) => `"${term}"에 대한 설명으로 옳은 것은?`,
  (term) => `"${term}"의 의미로 알맞은 것은?`,
  (term) => `다음 중 "${term}"에 대해 바르게 설명한 것은?`,
];

const SPACED_HEADER = /^([가-힣]\s){4,}/;

const GENERIC_QUIZ_TERMS =
  /^(?:카메라|레이더|모터|GPS|원리|위성|포장|하역|보관|충전기|실행|평가|문제|확인|탐색|선정|구체화|만드는|방법|특징|원리|라이다)$/;

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** 보기·정답 문장 품질 */
export function isValidQuizText(text) {
  const t = cleanOption(text).trim();
  if (t.length < 20 || t.length > 120) return false;
  if (/[\u0000-\u001f\u0007\u200b]/.test(text)) return false;
  if (SPACED_HEADER.test(t)) return false;
  if (/^(?:•|➊|➋|Q\s|사례\s*\d|②|①|\(O|O\s*X|\d+단계)/.test(t)) return false;
  if (/(?:능력\s){2,}/.test(t)) return false;
  if (/^\d/.test(t)) return false;
  if (/\?|할까|해\s*보자|반짝|캐릭터|우주선|게임을/.test(t)) return false;
  if (/설명하시오|서술형|활동\s*\d|준비물|Link|▲|그림/.test(t)) return false;
  if (/[하여며고인을를]\.$/.test(t) && t.length < 50) return false;
  if (/[,·]\s*$/.test(t)) return false;
  if (/\(\s*\)\s*\(/.test(t) || /라고\s*한다/.test(t)) return false;
  if (/^(?:는|있으며|께|적응하고)/.test(t)) return false;
  if (t.length > 35 && (t.match(/\s/g) || []).length / t.length < 0.04) return false;
  if (!/(?:다|된다|한다|이다|요|음|것이다|있다|없다|현상|능력|과정|상태|태도|유형|방법|기술|원인|결과|특징|의미|작용|역할|형태|체계|대상|기관|시설|권리|민감성|장치|것|많다)[.!?]?$/.test(t)) return false;
  return true;
}

/** 퀴즈 주제 용어 품질 */
export function isValidQuizTerm(term) {
  const t = term.trim();
  if (!t || t.length < 2 || t.length > 18) return false;
  if (/[.!?…?()]/.test(t)) return false;
  if (/^\d/.test(t)) return false;
  if (SPACED_HEADER.test(t)) return false;
  if (GENERIC_QUIZ_TERMS.test(t.replace(/\s/g, ""))) return false;
  if (/(?:하기|하려면|이루려면|해보자|으면|에서|좋으면|있으면|없으면|대해|관하여|이나|이는|에는|에서는|조절|보이지|함께|다른|문제가)$/.test(t.replace(/\s/g, ""))) return false;
  if (t.split(/\s+/).length > 4) return false;
  if (!/\s/.test(t) && t.length > 10 && /(?:은|는|이|가|을|를|과|와|에|의|도|만|에서|으로|에게|란|함께|다른|없|조절|보이)/.test(t)) return false;
  if (
    /^(?:만나기|놀이|서술형|공원|생각|우리나라|주제|사례|아이디어|문제|준비|나눔|알쏭|탐구|지속|몸의|생리|방법|서술|50|우리|중요|청소년의|만나|선정|나사|적사|요약|배경|결과|확인|편리|자유|공공|스마트|아이디어|이\s*단원|타이포|이처럼|하고|산책|동아리|결혼|학교|과학|단순|텔레비|가지|쓰레기|76|주거는|농구|뒷표|면지)/.test(
      t.replace(/\s/g, "")
    ) &&
    !/^잘못된/.test(t)
  ) {
    return false;
  }
  if (/^(?:여긴다|현재|하지만|칭찬|적용|유지|상황|만나기|놀이)/.test(t)) return false;
  return /[가-힣]{2,}/.test(t);
}

function isQuizItem(item) {
  return (
    (item.type === "term-definition" || item.type === "glossary" || item.type === "section") &&
    (item.score ?? 0) >= 7 &&
    isValidQuizTerm(item.term) &&
    isValidQuizText(item.text)
  );
}

function pickDistractors(item, pool, count, exclude = new Set(), lessonPool = []) {
  const correct = cleanOption(item.text);
  exclude.add(correct);

  const candidates = shuffle([
    ...lessonPool.filter((x) => x.term !== item.term),
    ...pool.filter((x) => x.term !== item.term),
  ]);

  const picked = [];
  for (const x of candidates) {
    const t = cleanOption(x.text);
    if (
      isValidQuizText(t) &&
      t.length >= 20 &&
      !exclude.has(t) &&
      isValidQuizTerm(x.term)
    ) {
      picked.push(t);
      exclude.add(t);
    }
    if (picked.length >= count) break;
  }
  return picked;
}

function buildOptions(correctText, distractors) {
  const options = shuffle([
    { id: "a", text: correctText },
    ...distractors.slice(0, 3).map((text, i) => ({
      id: ["b", "c", "d"][i],
      text,
    })),
  ]);
  const correctId = options.find((o) => o.text === correctText)?.id || "a";
  return { options, correctId };
}

function buildCorrectQuiz(item, lessonItems, pool, stemIndex) {
  const correct = cleanOption(item.text);
  const distractors = pickDistractors(item, pool, 3, new Set(), lessonItems);
  if (distractors.length < 3) return null;

  const { options, correctId } = buildOptions(correct, distractors);
  const termStem = TERM_STEMS[stemIndex % TERM_STEMS.length](item.term);

  return {
    question: termStem,
    sourcePage: item.sourcePage,
    options,
    correctId,
    explanation: correct,
  };
}

function validateQuiz(quiz, item) {
  if (!quiz || quiz.options.length !== 4) return false;
  const texts = quiz.options.map((o) => o.text);
  if (new Set(texts).size !== 4) return false;
  if (!texts.every(isValidQuizText)) return false;

  const correctOpt = quiz.options.find((o) => o.id === quiz.correctId);
  if (!correctOpt) return false;

  const expected = cleanOption(item.text);
  return correctOpt.text === expected;
}

export function generateQuizzes(boldItems, count = 6, _lessonTitle = "이 단원", poolItems = null) {
  const items = boldItems.filter(isQuizItem).sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
  const pool = (poolItems ?? boldItems).filter(isQuizItem);
  if (items.length < 2) return [];

  const quizzes = [];
  const usedTerms = new Set();

  for (let i = 0; i < items.length && quizzes.length < count; i++) {
    const item = items[i];
    if (usedTerms.has(item.term)) continue;

    const quiz = buildCorrectQuiz(item, items, pool, i);
    if (!quiz || !validateQuiz(quiz, item)) continue;

    usedTerms.add(item.term);
    quizzes.push(quiz);
  }

  return quizzes;
}

export function generateQuizzesWithFallback(boldItems, _pages, count = 6, lessonTitle, poolItems = null) {
  return generateQuizzes(boldItems, count, lessonTitle, poolItems);
}
