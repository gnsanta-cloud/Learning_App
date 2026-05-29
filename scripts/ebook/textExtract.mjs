import * as cheerio from "cheerio";

/** HTML → 본문 텍스트 */
export function htmlToText(html) {
  const $ = cheerio.load(html);
  $("script, style, noscript, svg, img").remove();
  const text = $("body").text() || $.root().text();
  return cleanEbookText(text);
}

/** HTML → 본문 + 줄 단위 원문 (xmp 우선, 굵은 글씨·용어 블록 추출용) */
export function parsePageContent(html) {
  const $ = cheerio.load(html);
  const raw = $("xmp").first().text();
  if (raw?.trim().length > 30) {
    return { text: cleanEbookText(raw), raw };
  }
  const text = htmlToText(html);
  return { text, raw: text };
}

function splitRawLines(raw) {
  return raw.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
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
    .replace(/[\u200b-\u200d\ufeff\u0006\u0007]/g, "")
    .replace(/([가-힣])\s+([가-힣])/g, (m, a, b, offset, full) => {
      // eBook OCR: 음\u0007모 → 음모 (짧은 토막만 붙임)
      const before = full.slice(Math.max(0, offset - 1), offset);
      if (before && /[가-힣]/.test(before)) return m;
      return a + b;
    })
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

const BOLD_NOISE_TERM =
  /^(?:Link|활동|탐구|준비물|▲|그림|지식|마인드맵|Q&A|출발|문제\s*\d|지시|쑥쑥|반짝|톡톡|달걀|이해|알쏭|생각|준비|모둠|게임|접착|주사위)/;
const SPACED_HEADER = /^([가-힣]\s){4,}/;
const DIALOGUE_LINE = /(?:[!?]|해\s*보자|할까|거야|일까|해보자|나타나\s*$)/;

function isBoldTermLine(line) {
  const t = line.trim();
  if (t.length < 2 || t.length > 22) return false;
  if (/[.!?]/.test(t)) return false;
  if (/^\d+\s/.test(t)) return false;
  if (BOLD_NOISE_TERM.test(t)) return false;
  if (SPACED_HEADER.test(t)) return false;
  if (DIALOGUE_LINE.test(t)) return false;
  if (/Link|쪽$|활동|탐구|▲|그림|쪽\s*\d/.test(t)) return false;
  if (/(?:이다|한다|된다|있는|으로|에서|이며|때문)/.test(t) && t.length > 10) return false;
  if (/(?:하기|하려면|이루려면)$/.test(t)) return false;
  return /[가-힣]{2,}/.test(t);
}

function isReadableTerm(term) {
  const t = term.trim();
  if (!t || t.length < 2 || t.length > 18) return false;
  if (/[.!?…]/.test(t)) return false;
  if (/(?:하기|하려면|이루려면|해보자)$/.test(t)) return false;
  if (/^(?:여긴다|현재|하지만|칭찬|적용|유지|상황)/.test(t)) return false;
  if (t.length > 10 && !/\s/.test(t) && /(?:은|는|이|가|란|지만|으로|에서)/.test(t)) return false;
  return /[가-힣]{2,}/.test(t);
}

function isCompleteDefinition(text) {
  const t = text.trim();
  if (t.length < 18) return false;
  if (/[하여며고인]\.$/.test(t) && t.length < 50) return false;
  if (/▲|그림|Link|활동/.test(t)) return false;
  if (/[\u0006\u0007]/.test(t)) return false;
  const parts = t.split(/[,·]/).map((p) => p.trim()).filter((p) => p.length > 4);
  if (parts.length >= 4 && t.length < 80) return false;
  return true;
}

function isBoldDefinitionLine(line) {
  const t = line.trim();
  if (t.length < 15 || t.length > 130) return false;
  if (/^(?:Link|활동|탐구|▲|그림|준비물|모둠|Q\s)/.test(t)) return false;
  if (/^\d+\s/.test(t) && t.length < 25) return false;
  if (DIALOGUE_LINE.test(t) && !/[다님][.!?]?$/.test(t)) return false;
  if (!/[가-힣]/.test(t)) return false;
  if (/▲|그림|Link|활동|쪽\s*\d/.test(t)) return false;
  return isCompleteDefinition(t) && (isValidSentence(t) || t.length >= 20);
}

function formatBoldText(text, term) {
  let p = text.replace(/\s+/g, " ").trim();
  if (!/[.!?]$/.test(p)) p += ".";
  return p.length <= 130 ? p : `${p.slice(0, 127)}…`;
}

function scoreBoldItem(item) {
  let score = 0;
  if (item.type === "term-definition") score += 6;
  if (item.type === "glossary") score += 5;
  if (item.type === "section") score += 4;
  if (item.type === "definition") score += 3;
  if (item.text.length >= 25 && item.text.length <= 100) score += 2;
  if (/[다님][.!?]?$/.test(item.text)) score += 1;
  if (item.term.length >= 2 && item.term.length <= 12) score += 1;
  return score;
}

function extractTermDefinitionPairs(lines, page) {
  const items = [];
  for (let i = 0; i < lines.length - 1; i++) {
    const term = lines[i];
    const def = lines[i + 1];
    if (!isBoldTermLine(term) || !isBoldDefinitionLine(def)) continue;
    if (/^(?:남자|여자|공통)(?:된)?\s*변화$/.test(term.replace(/\s+/g, ""))) continue;
    const text = formatBoldText(def, term);
    items.push({
      term: term.replace(/\s+/g, " ").trim(),
      text,
      sourcePage: page,
      excerpt: makeExcerpt(`${term}\n${text}`),
      type: "term-definition",
    });
  }
  return items;
}

function extractGlossaryBlocks(lines, page) {
  const items = [];
  for (let i = 0; i < lines.length; i++) {
    if (/아하!\s*용어/.test(lines[i])) {
      const line = lines[i + 1];
      if (!line) continue;
      const m = line.match(/^([가-힣]{2,10})\s+(.{10,})/);
      if (!m || GENERIC_TERMS.has(m[1]) || !isReadableTerm(m[1])) continue;
      const text = formatBoldText(m[2], m[1]);
      if (!isCompleteDefinition(text)) continue;
      items.push({
        term: m[1],
        text,
        sourcePage: page,
        excerpt: makeExcerpt(`${m[1]} ${text}`),
        type: "glossary",
      });
      continue;
    }

    const inline = lines[i].match(/^([가-힣]{2,8})\s+(.{15,})$/);
    if (
      inline &&
      isReadableTerm(inline[1]) &&
      !GENERIC_TERMS.has(inline[1]) &&
      isCompleteDefinition(inline[2]) &&
      !isBoldTermLine(inline[1])
    ) {
      const text = formatBoldText(inline[2], inline[1]);
      items.push({
        term: inline[1],
        text,
        sourcePage: page,
        excerpt: makeExcerpt(`${inline[1]} ${text}`),
        type: "glossary",
      });
    }
  }
  return items;
}

function extractSectionHeadings(lines, page) {
  const items = [];
  for (let i = 0; i < lines.length - 1; i++) {
    const m = lines[i].match(/^(\d+)\s+([가-힣·\s]{4,28})$/);
    if (!m || SPACED_HEADER.test(m[2])) continue;
    const body = lines[i + 1];
    if (!body || body.length < 35) continue;
    const firstSent = body
      .split(/(?<=[.!?])\s+/)
      .map((s) => s.trim())
      .find((s) => s.length >= 25 && isCompleteDefinition(s));
    if (!firstSent) continue;
    const term = m[2].replace(/\s+/g, " ").trim();
    if (!isReadableTerm(term)) continue;
    const text = formatBoldText(firstSent, term);
    items.push({
      term,
      text,
      sourcePage: page,
      excerpt: makeExcerpt(`${m[1]} ${term}\n${text}`),
      type: "section",
    });
  }
  return items;
}

function extractDefinitionHighlights(text, page) {
  return extractDefinitions(text)
    .filter((d) => d.term && d.definition.length >= 15 && isReadableTerm(d.term))
    .filter((d) => isCompleteDefinition(d.definition) && !/[가-힣]{8,}[은는이가]/.test(d.term))
    .map((d) => ({
      term: d.term.replace(/\s+/g, "").slice(0, 14),
      text: formatBoldText(d.definition.replace(/은\(는\)|이\(가\)/g, (m) => m[0]), d.term),
      sourcePage: page,
      excerpt: makeExcerpt(`${d.term} ${d.definition}`),
      type: "definition",
    }));
}

/** eBook 굵은 글씨(용어·소제목·아하! 용어) 블록 추출 */
export function extractBoldHighlightsFromPages(pages, max = 24) {
  const all = [];

  for (const { page, text, raw } of pages) {
    const lines = splitRawLines(raw || text);
    all.push(
      ...extractTermDefinitionPairs(lines, page),
      ...extractGlossaryBlocks(lines, page),
      ...extractSectionHeadings(lines, page),
      ...extractDefinitionHighlights(text, page)
    );
  }

  const seen = new Set();
  const ranked = all
    .filter((item) => {
      if (!isReadableTerm(item.term)) return false;
      if (!isCompleteDefinition(item.text)) return false;
      const key = `${item.term}:${item.text.slice(0, 40)}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return item.term.length >= 2 && item.text.length >= 15;
    })
    .map((item) => ({ ...item, score: scoreBoldItem(item) }))
    .sort((a, b) => b.score - a.score);

  return ranked.slice(0, max);
}
