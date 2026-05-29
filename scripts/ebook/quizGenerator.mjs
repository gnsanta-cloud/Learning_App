/**
 * eBook 추출 내용 → 내신·기말고사형 객관식 문항 생성
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
  "그러므로",
  "이러한",
  "청소년",
  "청소년은",
  "또한",
  "그러나",
]);

const EXCERPT_STEMS_INCORRECT = [
  "위 발췌 내용에 대한 설명으로 옳지 않은 것은?",
  "교과서 발췌 내용과 맞지 않는 설명은?",
];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function sourceOf(item) {
  if (!item || typeof item === "string") {
    return { excerpt: undefined, sourcePage: undefined };
  }
  return {
    excerpt: item.excerpt,
    sourcePage: item.sourcePage,
  };
}

function textOf(item) {
  if (typeof item === "string") return item;
  return item.definition || item.text || "";
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
    const raw = textOf(item);
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

const EXCERPT_STEMS = [
  "위 발췌 내용에 대한 설명으로 옳은 것은?",
  "위 교과서 내용과 일치하는 설명은?",
  "발췌 내용을 바르게 이해한 것은?",
];

function withSource(base, sourceItem, questionOverride) {
  const { excerpt, sourcePage } = sourceOf(sourceItem);
  if (excerpt) {
    return {
      ...base,
      excerpt,
      sourcePage,
      question: questionOverride ?? pick(EXCERPT_STEMS),
    };
  }
  return base;
}

function buildMcq(question, correctText, pool, term, sourceItem) {
  const correct = cleanOption(correctText);
  const wrongs = makeWrongAnswers(correctText, pool, term, 3);
  const options = shuffle([
    { id: "a", text: correct },
    { id: "b", text: wrongs[0] || "틀린 설명 1" },
    { id: "c", text: wrongs[1] || "틀린 설명 2" },
    { id: "d", text: wrongs[2] || "틀린 설명 3" },
  ]);
  const correctId = options.find((o) => o.text === correct)?.id || "a";
  return withSource(
    {
      question,
      options,
      correctId,
      explanation: cleanOption(correctText),
    },
    sourceItem
  );
}

function buildDefinitionQuiz(def, topic, pool, typeIndex) {
  const term = shortenTerm(def.term);
  const types = ["correct", "feature", "incorrect", "correct"];
  const type = types[typeIndex % types.length];

  if (type === "incorrect") {
    const question = pick(EXAM_STEMS.incorrect(term));
    const wrongs = makeWrongAnswers(def.definition, pool, term, 5);
    const wrongStatement = cleanOption(
      wrongs.find((w) => w !== cleanOption(def.definition)) || wrongs[0]
    );
    const truePool = shuffle(
      [def.definition, ...pool.map(textOf).filter((p) => p !== def.definition)]
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

    return withSource(
      {
        question,
        options,
        correctId: options.find((o) => o.text === wrongStatement)?.id || "a",
        explanation: `"${term}"의 올바른 설명: ${cleanOption(def.definition)}`,
      },
      def,
      pick(EXCERPT_STEMS_INCORRECT)
    );
  }

  const question = pick(EXAM_STEMS[type](term, topic));
  return buildMcq(question, def.definition, pool, term, def);
}

function buildPointQuiz(pointItem, topic, pool, typeIndex) {
  const point = textOf(pointItem);
  const termMatch = point.match(/([가-힣]{2,8})(?:란|은|는|이|가|을|를|과|와)/);
  const rawTerm = termMatch?.[1];
  const term =
    rawTerm && !GENERIC_TERMS.has(rawTerm)
      ? shortenTerm(rawTerm)
      : shortenTerm(topic.replace(/[·\s]/g, "").slice(0, 8));

  const types = ["appropriate", "compare", "practice", "feature", "cause"];
  const type = types[typeIndex % types.length];
  const question = pick(
    EXAM_STEMS[type](type === "appropriate" || type === "practice" ? topic : term, topic)
  );

  return buildMcq(question, point, pool, term, pointItem);
}

export function generateQuizzes(definitions, points, count = 6, lessonTitle = "이 단원") {
  const topic = lessonTitle.replace(/[·]/g, " ");
  const pool = [
    ...definitions.map((d) => d.definition),
    ...points.map((p) => textOf(p)),
  ].filter(Boolean);

  const quizzes = [];
  const usedQuestions = new Set();

  const defCount = Math.min(Math.ceil(count * 0.5), definitions.length);
  for (let i = 0; i < defCount; i++) {
    const quiz = buildDefinitionQuiz(definitions[i], topic, pool, i);
    const key = `${quiz.sourcePage ?? ""}:${quiz.excerpt ?? quiz.question}`;
    if (!usedQuestions.has(key)) {
      quizzes.push(quiz);
      usedQuestions.add(key);
    }
  }

  let pi = 0;
  while (quizzes.length < count && pi < points.length) {
    const quiz = buildPointQuiz(points[pi], topic, pool, pi);
    const key = `${quiz.sourcePage ?? ""}:${quiz.excerpt ?? quiz.question}`;
    if (!usedQuestions.has(key)) {
      quizzes.push(quiz);
      usedQuestions.add(key);
    }
    pi++;
  }

  while (quizzes.length < count && definitions.length > 0) {
    const def = definitions[quizzes.length % definitions.length];
    const quiz = buildDefinitionQuiz(def, topic, pool, quizzes.length + 2);
    const key = `${quiz.sourcePage ?? ""}:${quiz.excerpt ?? quiz.question}`;
    if (!usedQuestions.has(key)) {
      quizzes.push(quiz);
      usedQuestions.add(key);
    } else break;
  }

  return quizzes.slice(0, count);
}
