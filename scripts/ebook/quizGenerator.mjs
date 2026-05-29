/** eBook 본문에서 객관식 퀴즈 생성 */

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function shorten(text, max = 42) {
  const t = text.replace(/\s+/g, " ").trim();
  return t.length <= max ? t : `${t.slice(0, max - 1)}…`;
}

function wrongOption(pool, correct, used) {
  for (const item of shuffle(pool)) {
    const t = shorten(typeof item === "string" ? item : item.definition || item);
    if (t !== correct && t.length >= 8 && !used.has(t)) {
      used.add(t);
      return t;
    }
  }
  const fallbacks = [
    "교과서와 다른 설명",
    "e북 내용과 맞지 않음",
    "개념을 잘못 이해한 설명",
    "단원과 관련 없는 설명",
  ];
  for (const f of fallbacks) {
    if (!used.has(f) && f !== correct) {
      used.add(f);
      return f;
    }
  }
  return "틀린 설명";
}

export function generateQuizzes(definitions, points, count = 6) {
  const quizzes = [];
  const pool = [
    ...definitions.map((d) => d.definition),
    ...points,
  ].filter(Boolean);

  const sources = definitions.length > 0 ? definitions : points.map((p) => ({ term: "핵심", definition: p }));

  for (let i = 0; i < Math.min(count, sources.length); i++) {
    const src = sources[i];
    const def = typeof src === "string" ? src : src.definition;
    const term = typeof src === "string" ? "다음" : src.term || "다음";
    const correct = shorten(def, 48);
    const used = new Set([correct]);

    const options = shuffle([
      { id: "a", text: correct },
      { id: "b", text: wrongOption(pool, correct, used) },
      { id: "c", text: wrongOption(pool, correct, used) },
      { id: "d", text: wrongOption(pool, correct, used) },
    ]);

    const correctId = options.find((o) => o.text === correct)?.id || "a";

    quizzes.push({
      question:
        definitions.length > 0 && term.length <= 12
          ? `"${term}"에 대한 설명으로 알맞은 것은?`
          : "e북 내용에 맞는 설명은?",
      options,
      correctId,
      explanation: def.length > 100 ? `${def.slice(0, 97)}…` : def,
    });
  }

  while (quizzes.length < count && points.length > quizzes.length) {
    const p = points[quizzes.length];
    const correct = shorten(p, 48);
    const used = new Set([correct]);
    const options = shuffle([
      { id: "a", text: correct },
      { id: "b", text: wrongOption(pool, correct, used) },
      { id: "c", text: wrongOption(pool, correct, used) },
      { id: "d", text: wrongOption(pool, correct, used) },
    ]);
    quizzes.push({
      question: "다음 중 e북에서 다룬 내용과 일치하는 것은?",
      options,
      correctId: options.find((o) => o.text === correct)?.id || "a",
      explanation: p,
    });
  }

  return quizzes.slice(0, count);
}
