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
    /([^.!?]{10,100}?)(?:이라고|라고)\s*(?:한다|합니다)/g,
    /([^.!?]{8,60}?)(?:을|를|이|가)\s*(?:말한다|뜻한다|의미한다)/g,
  ];

  for (const re of patterns) {
    let m;
    while ((m = re.exec(text)) !== null) {
      const raw = m[1].trim();
      if (!isValidSentence(raw)) continue;
      const term = guessTerm(raw);
      const definition = m[0].replace(/\s+/g, " ").trim().slice(0, 100);
      defs.push({ term, definition: definition.slice(0, 100) });
    }
  }

  const seen = new Set();
  return defs.filter((d) => {
    const key = d.definition.slice(0, 35);
    if (seen.has(key) || d.term.length < 2) return false;
    seen.add(key);
    return true;
  });
}

function isValidSentence(s) {
  if (s.length < 12 || s.length > 90) return false;
  if (/▲|그림|활동|Link|단계|쪽/.test(s)) return false;
  if (/^\d/.test(s)) return false;
  if (/[A-Za-z]{3,}/.test(s)) return false;
  if (/발달과인간관계|의식주생활|자기관리와|기술과발명|재료와설계|친환경에너지/.test(s.replace(/\s/g, "")))
    return false;
  return /[가-힣]{4,}/.test(s);
}

function guessTerm(sentence) {
  const m = sentence.match(/^(.{2,18}?)(?:은|는|이|가|을|를)\s/);
  return m ? m[1] : sentence.slice(0, 12);
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

function formatPoint(s) {
  let p = s.replace(/\s+/g, " ").trim();
  if (!/[.!?]$/.test(p)) p += ".";
  return p.length > 90 ? `${p.slice(0, 87)}…` : p;
}

/** 키워드 추출 */
export function extractKeywords(text, points, max = 5) {
  const fromPoints = points
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
  if (points.length === 0) {
    return `${title} 내용을 e북에서 학습하고 퀴즈로 확인합니다.`;
  }
  const core = points.slice(0, 2).join(" ");
  return core.length > 120 ? `${core.slice(0, 117)}…` : core;
}
