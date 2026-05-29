import * as cheerio from "cheerio";

/** HTML → 본문 텍스트 */
export function htmlToText(html) {
  const $ = cheerio.load(html);
  $("script, style, noscript, svg, img").remove();
  const text = $("body").text() || $.root().text();
  return cleanEbookText(text);
}

export function cleanEbookText(text) {
  return normalizeText(
    text
      .replace(/\d+\s+\d+(?:차|단계)\s+/g, " ")
      .replace(/지식\s*날개[^.!?]*[.!?]?/g, " ")
      .replace(/아하!\s*용어[^.!?]*[.!?]?/g, " ")
      .replace(/(?:^|\s)\d{1,2}\s+(?=[가-힣])/g, " ")
  );
}

export function normalizeText(text) {
  return text
    .replace(/\u00a0/g, " ")
    .replace(/[\u200b-\u200d\ufeff\u0007]/g, "")
    .replace(/(?:[가-힣]\s+){2,}[가-힣]/g, (m) => m.replace(/\s+/g, ""))
    .replace(/▲\s*그림[^.!?]*[.!?]?/g, " ")
    .replace(/Link\s*\d+\s*~?\s*\d*쪽/g, " ")
    .replace(/\[자료:[^\]]+\]/g, " ")
    .replace(/\b\d{1,3}\s*(?:쪽|p\.?\s*\d+)/gi, " ")
    .replace(/활동\s+[^.!?]+[.!?]/g, " ")
    .replace(/\s+/g, " ")
    .replace(/\s*([.!?])\s*/g, "$1 ")
    .trim();
}

/** 정의·핵심 문장 추출 */
export function extractDefinitions(text) {
  const defs = [];
  const patterns = [
    /([^.!?]{8,85}?)(?:이라고|라고)\s*(?:한다|합니다)\.?/g,
    /([^.!?]{6,50}?)(?:은|는|이|가)\s*([^.!?]{8,60}?)(?:이다|입니다)\.?/g,
  ];

  for (const re of patterns) {
    let m;
    while ((m = re.exec(text)) !== null) {
      let term, definition;
      if (m[2]) {
        term = m[1].trim();
        definition = `${term}은(는) ${m[2].trim()}이다.`;
      } else {
        term = guessTerm(m[1]);
        if (!term) continue;
        definition = `${m[1].trim()}라고 한다.`;
      }
      if (!isValidSentence(definition) || GENERIC_TERMS.has(term)) continue;
      defs.push({
        term,
        definition: formatPoint(definition, false),
        sourcePage: null,
        excerpt: makeExcerpt(definition),
      });
    }
  }

  const seen = new Set();
  return defs.filter((d) => {
    const key = d.definition.slice(0, 35);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function shortenTerm(term) {
  return term.replace(/\s+/g, "").slice(0, 12);
}

function isValidSentence(s) {
  if (s.length < 12 || s.length > 90) return false;
  if (/▲|그림|활동|Link|단계|쪽/.test(s)) return false;
  if (/^\d/.test(s)) return false;
  if (/[A-Za-z]{3,}/.test(s)) return false;
  if (/발달과인간관계|의식주생활|자기관리와|기술과발명|재료와설계|친환경에너지/.test(s.replace(/\s/g, "")))
    return false;
  return true;
}

/** 페이지별 정의 추출 (쪽수·발췌 포함) */
export function extractDefinitionsFromPages(pages) {
  const all = [];
  for (const { page, text } of pages) {
    for (const def of extractDefinitions(text)) {
      all.push({
        ...def,
        sourcePage: page,
        excerpt: makeExcerpt(def.definition),
      });
    }
  }
  return dedupeByKey(all, (d) => d.definition.slice(0, 40));
}

/** 페이지별 핵심 문장 추출 */
export function extractKeyPointsFromPages(pages, max = 6) {
  const all = [];
  for (const { page, text } of pages) {
    for (const sentence of extractKeyPoints(text, max)) {
      all.push({
        text: sentence,
        sourcePage: page,
        excerpt: makeExcerpt(sentence),
      });
    }
  }
  return dedupeByKey(all, (p) => p.text.slice(0, 40)).slice(0, max);
}

function dedupeByKey(items, keyFn) {
  const seen = new Set();
  return items.filter((item) => {
    const key = keyFn(item);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/** 발췌용 문장 (문제 본문에 표시) */
export function makeExcerpt(text, max = 200) {
  const t = text.replace(/\s+/g, " ").trim();
  if (t.length <= max) return t;
  const cut = t.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return (lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut) + "…";
}

const GENERIC_TERMS = new Set([
  "중요한",
  "중요한것",
  "하지만",
  "하지만이는",
  "따라서",
  "그러므로",
  "이러한",
  "청소년",
  "청소년은",
  "또한",
  "그러나",
  "즉",
  "예를",
]);

function guessTerm(sentence) {
  const named = sentence.match(/([가-힣]{2,10})란/);
  if (named) return named[1];

  const m = sentence.match(/^([가-힣]{2,10}?)(?:은|는|이|가|을|를|과|와)\s/);
  if (m && !GENERIC_TERMS.has(m[1])) return m[1];

  return null;
}

/** 핵심 포인트(불릿) 추출 */
export function extractKeyPoints(text, max = 6) {
  const sentences = text
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length >= 12 && s.length <= 100);

  const scored = sentences
    .filter(isValidSentence)
    .map((s) => {
    let score = 0;
    if (/(?:이라고|라고|한다|이다|중요|필요|바람직|예방|이해)/.test(s)) score += 3;
    if (/(?:청소년|기술|에너지|소비|발명|재료|수송)/.test(s)) score += 1;
    if (/^\d|•|·/.test(s)) score += 2;
    return { s, score };
  });

  scored.sort((a, b) => b.score - a.score);
  const picked = [];
  const seen = new Set();
  for (const { s } of scored) {
    const key = s.slice(0, 30);
    if (seen.has(key)) continue;
    seen.add(key);
    picked.push(formatPoint(s));
    if (picked.length >= max) break;
  }
  return picked;
}

function formatPoint(s, allowTruncate = true) {
  let p = s.replace(/\s+/g, " ").trim();
  if (!/[.!?]$/.test(p)) p += ".";
  if (!allowTruncate || p.length <= 120) return p;
  return `${p.slice(0, 117)}…`;
}

/** 키워드 추출 */
export function extractKeywords(text, points, max = 5) {
  const pointTexts = points.map((p) => (typeof p === "string" ? p : p.text));
  const fromPoints = pointTexts
    .flatMap((p) => p.match(/[가-힣]{2,8}/g) || [])
    .filter((w) => w.length >= 2 && !STOP_WORDS.has(w));

  const freq = new Map();
  for (const w of fromPoints) {
    freq.set(w, (freq.get(w) || 0) + 1);
  }
  return [...freq.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, max)
    .map(([w]) => w);
}

const STOP_WORDS = new Set([
  "것은",
  "것이",
  "있는",
  "하는",
  "된다",
  "하여",
  "통해",
  "대한",
  "있으며",
  "때문",
  "이러한",
  "이와",
  "따라",
  "청소년",
  "이때",
  "또한",
  "한다",
  "있는",
  "나타나는",
  "것을",
  "있도록",
]);

export function buildSummary(points, title) {
  const texts = points.map((p) => (typeof p === "string" ? p : p.text));
  if (texts.length === 0) {
    return `${title} 내용을 e북에서 학습하고 퀴즈로 확인합니다.`;
  }
  const core = texts.slice(0, 2).join(" ");
  return core.length > 160 ? `${core.slice(0, 157)}…` : core;
}
