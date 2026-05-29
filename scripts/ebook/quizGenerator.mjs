/**
 * eBook 굵은 글씨(용어·소제목) 블록 → 내신형 객관식
 * 보기는 eBook 본문 문장만 사용 (임의 변형·작문 없음)
 */
import { cleanOption } from "./examTemplates.mjs";

const TERM_STEMS = [
  (term) => `"${term}"에 대한 설명으로 옳은 것은?`,
  (term) => `"${term}"의 의미로 알맞은 것은?`,
  (term) => `다음 중 "${term}"에 대해 바르게 설명한 것은?`,
];

const TERM_STEMS_INCORRECT = [
  (term) => `"${term}"에 대한 설명으로 옳지 않은 것은?`,
  (term) => `"${term}"과(와) 관련하여 틀린 것은?`,
];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickDistractors(item, items, count, exclude = new Set()) {
  const correct = cleanOption(item.text);
  exclude.add(correct);
  const pool = shuffle(
    items.filter((x) => {
      const t = cleanOption(x.text);
      return t.length >= 12 && !exclude.has(t) && x.term !== item.term;
    })
  );
  const picked = [];
  for (const x of pool) {
    const t = cleanOption(x.text);
    if (!exclude.has(t)) {
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
  while (options.length < 4) {
    options.push({ id: ["a", "b", "c", "d"][options.length], text: correctText });
  }
  const correctId = options.find((o) => o.text === correctText)?.id || "a";
  return { options, correctId };
}

function buildCorrectQuiz(item, items, stemIndex) {
  const correct = cleanOption(item.text);
  const distractors = pickDistractors(item, items, 3);
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

function buildIncorrectQuiz(item, items, stemIndex) {
  const correctDesc = cleanOption(item.text);
  const exclude = new Set([correctDesc]);
  const wrongCandidates = pickDistractors(item, items, 1, exclude);
  const wrongStatement = wrongCandidates[0];
  if (!wrongStatement) return buildCorrectQuiz(item, items, stemIndex);

  const truePool = [correctDesc];
  for (const x of shuffle(items)) {
    const t = cleanOption(x.text);
    if (t !== wrongStatement && !truePool.includes(t)) {
      truePool.push(t);
    }
    if (truePool.length >= 3) break;
  }

  const { options, correctId } = buildOptions(wrongStatement, truePool.slice(0, 3));
  const termStem = TERM_STEMS_INCORRECT[stemIndex % TERM_STEMS_INCORRECT.length](item.term);

  return {
    question: termStem,
    sourcePage: item.sourcePage,
    options,
    correctId,
    explanation: `"${item.term}"의 올바른 설명: ${correctDesc}`,
  };
}

export function generateQuizzes(boldItems, count = 6, _lessonTitle = "이 단원") {
  const items = boldItems
    .filter((b) => b.term && b.text && b.text.length >= 15)
    .sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
  if (items.length < 4) return [];

  const quizzes = [];
  const used = new Set();

  for (let i = 0; i < items.length && quizzes.length < count; i++) {
    const item = items[i];
    const quiz =
      i % 4 === 3
        ? buildIncorrectQuiz(item, items, i)
        : buildCorrectQuiz(item, items, i);

    const key = `${quiz.sourcePage ?? ""}:${item.term}:${quiz.correctId}`;
    if (used.has(key)) continue;
    used.add(key);
    quizzes.push(quiz);
  }

  return quizzes.slice(0, count);
}

export function generateQuizzesWithFallback(boldItems, pages, count = 6, lessonTitle) {
  const primary = boldItems.filter(
    (b) =>
      b.type === "term-definition" ||
      b.type === "glossary" ||
      b.type === "section" ||
      (b.score ?? 0) >= 6
  );
  let quizzes = generateQuizzes(primary.length >= 4 ? primary : boldItems, count, lessonTitle);
  if (quizzes.length >= count) return quizzes;

  const fallbackItems = [];
  for (const { page, text } of pages) {
    for (const sentence of text.split(/(?<=[.!?])\s+/)) {
      const s = sentence.trim();
      if (s.length < 25 || s.length > 100 || !/[가-힣]/.test(s)) continue;
      if (/[\u0006\u0007]|[,·].*[,·]/.test(s)) continue;
      if (/^(?:남자|여자|공통)/.test(s) && s.split(/[,.]/).length >= 3) continue;
      fallbackItems.push({
        term: s.slice(0, 8).replace(/\s/g, ""),
        text: cleanOption(s),
        sourcePage: page,
        score: 1,
      });
    }
  }

  const merged = [...primary, ...fallbackItems];
  quizzes = generateQuizzes(merged, count, lessonTitle);
  return quizzes;
}
