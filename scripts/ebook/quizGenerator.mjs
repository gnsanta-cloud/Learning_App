/**
 * eBook 추출 내용 → 내신·기말고사형 객관식 문항 생성
 * (평가문제집·기출: "옳은 것", "바르게 설명한 것", "바람직한 태도" 유형)
 */
import {
  EXAM_STEMS,
  WRONG_PATTERNS,
  pick,
  cleanOption,
  shortenTerm,
} from "./examTemplates.mjs";

const GENERIC_TERMS = new Set([
  "중요한",
  "하지만",
  "따라서",
  "이러한",
  "청소년",
  "청소년은",
  "또한",
  "그러나",
]);

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function makeWrongAnswers(correct, pool, term, count = 3) {
  const wrongs = [];
  const used = new Set([cleanOption(correct)]);

  for (const fn of shuffle(WRONG_PATTERNS)) {
    const w = cleanOption(fn(correct));
    if (w.length >= 8 && !used.has(w) && w !== cleanOption(correct)) {
      wrongs.push(w);
      used.add(w);
    }
    if (wrongs.length >= count) break;
  }

  for (const item of shuffle(pool)) {
    if (wrongs.length >= count) break;
    const raw = typeof item === "string" ? item : item.definition || item;
    const w = cleanOption(raw);
    if (w.length >= 8 && !used.has(w) && w !== cleanOption(correct)) {
      wrongs.push(w);
      used.add(w);
    }
  }

  const fallbacks = [
    `${shortenTerm(term)}과(와) 관련이 없는 설명`,
    `${shortenTerm(term)}의 의미를 잘못 이해한 설명`,
    "개념을 반대로 이해한 설명",
    "단원 내용과 맞지 않는 설명",
  ];
  for (const f of fallbacks) {
    if (wrongs.length >= count) break;
    if (!used.has(f)) {
      wrongs.push(f);
      used.add(f);
    }
  }

  return wrongs.slice(0, count);
}

function buildMcq(question, correctText, pool, term) {
  const correct = cleanOption(correctText);
  const wrongs = makeWrongAnswers(correctText, pool, term, 3);
  const options = shuffle([
    { id: "a", text: correct },
    { id: "b", text: wrongs[0] || "틀린 설명 1" },
    { id: "c", text: wrongs[1] || "틀린 설명 2" },
    { id: "d", text: wrongs[2] || "틀린 설명 3" },
  ]);
  const correctId = options.find((o) => o.text === correct)?.id || "a";
  return {
    question,
    options,
    correctId,
    explanation:
      correctText.length > 100 ? `${correctText.slice(0, 97)}…` : correctText,
  };
}

function buildDefinitionQuiz(def, topic, pool, typeIndex) {
  const term = shortenTerm(def.term);
  const types = ["correct", "feature", "incorrect", "correct"];
  const type = types[typeIndex % types.length];

  if (type === "incorrect") {
    const question = pick(EXAM_STEMS.incorrect(term));
    const wrongs = makeWrongAnswers(def.definition, pool, term, 5);
    const wrongStatement = cleanOption(wrongs.find((w) => w !== cleanOption(def.definition)) || wrongs[0]);
    const truePool = shuffle(
      [def.definition, ...pool.filter((p) => typeof p === "string" && p !== def.definition)]
    )
      .map((t) => cleanOption(t))
      .filter((t) => t !== wrongStatement)
      .slice(0, 3);

    const optionTexts = shuffle([wrongStatement, ...truePool]);
    const ids = ["a", "b", "c", "d"];
    const options = optionTexts.slice(0, 4).map((text, i) => ({ id: ids[i], text }));
    while (options.length < 4) {
      options.push({ id: ids[options.length], text: `${term}과(와) 관련 있는 설명` });
    }

    return {
      question,
      options,
      correctId: options.find((o) => o.text === wrongStatement)?.id || "a",
      explanation: `"${term}"의 올바른 설명: ${cleanOption(def.definition, 80)}`,
    };
  }

  const question = pick(EXAM_STEMS[type](term, topic));
  return buildMcq(question, def.definition, pool, term);
}

function buildPointQuiz(point, topic, pool, typeIndex) {
  const termMatch = point.match(/([가-힣]{2,8})(?:란|은|는|이|가|을|를|과|와)/);
  const rawTerm = termMatch?.[1];
  const term =
    rawTerm && !GENERIC_TERMS.has(rawTerm)
      ? shortenTerm(rawTerm)
      : shortenTerm(topic.replace(/[·\s]/g, "").slice(0, 8));

  const types = ["appropriate", "compare", "practice", "feature", "cause"];
  const type = types[typeIndex % types.length];
  const question = pick(EXAM_STEMS[type](type === "appropriate" || type === "practice" ? topic : term, topic));

  return buildMcq(question, point, pool, term);
}

export function generateQuizzes(definitions, points, count = 6, lessonTitle = "이 단원") {
  const topic = lessonTitle.replace(/[·]/g, " ");
  const pool = [
    ...definitions.map((d) => d.definition),
    ...points,
  ].filter(Boolean);

  const quizzes = [];
  const usedQuestions = new Set();

  const defCount = Math.min(Math.ceil(count * 0.5), definitions.length);
  for (let i = 0; i < defCount; i++) {
    const quiz = buildDefinitionQuiz(definitions[i], topic, pool, i);
    if (!usedQuestions.has(quiz.question)) {
      quizzes.push(quiz);
      usedQuestions.add(quiz.question);
    }
  }

  let pi = 0;
  while (quizzes.length < count && pi < points.length) {
    const quiz = buildPointQuiz(points[pi], topic, pool, pi);
    if (!usedQuestions.has(quiz.question)) {
      quizzes.push(quiz);
      usedQuestions.add(quiz.question);
    }
    pi++;
  }

  while (quizzes.length < count && definitions.length > 0) {
    const def = definitions[quizzes.length % definitions.length];
    const quiz = buildDefinitionQuiz(def, topic, pool, quizzes.length + 2);
    if (!usedQuestions.has(quiz.question)) {
      quizzes.push(quiz);
      usedQuestions.add(quiz.question);
    } else break;
  }

  return quizzes.slice(0, count);
}
