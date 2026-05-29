import * as cheerio from "cheerio";
import { parsePageContent } from "./textExtract.mjs";

const FETCH_DELAY_MS = 30;

export async function fetchText(url) {
  const res = await fetch(url, {
    headers: { "User-Agent": "LearningApp-EbookSync/1.0" },
  });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.text();
}

export function parseToc(html) {
  const $ = cheerio.load(html);
  const items = [];

  $(".Toc-Depth-Container").each((_, el) => {
    const depth = Number($(el).attr("depth") || 0);
    const pageAttr = $(el).attr("default_ebook_page") || "";
    const pageMatch = pageAttr.match(/page=(\d+)/);
    const page = pageMatch ? Number(pageMatch[1]) : null;
    const name = $(el).find(".Toc-Depth-Title__Name").text().trim();
    const note = $(el).find(".Toc-Depth-Title__Number").text().trim();
    if (name) items.push({ depth, page, name, note });
  });

  return buildUnitSections(items);
}

function buildUnitSections(items) {
  const units = [];
  let current = null;

  for (const item of items) {
    if (item.depth === 1 && /^Ⅰ|Ⅱ|Ⅲ|Ⅳ|Ⅴ|Ⅵ/.test(item.name)) {
      current = { title: item.name, note: item.note, sections: [] };
      units.push(current);
    } else if (current && item.depth === 3 && item.page != null) {
      current.sections.push({ name: item.name, page: item.page });
    }
  }

  return units;
}

export async function fetchEpubPage(epubBase, textbookPage, pageOffset) {
  const fileNum = textbookPage + pageOffset;
  const url = `${epubBase}/page-${fileNum}.html`;
  const html = await fetchText(url);
  const { text, raw } = parsePageContent(html);
  return { fileNum, url, text, raw };
}

export async function fetchPagesInRange(epubBase, start, end, pageOffset) {
  const pages = [];
  for (let p = start; p <= end; p++) {
    try {
      const { text, raw } = await fetchEpubPage(epubBase, p, pageOffset);
      if (text.length > 30) pages.push({ page: p, text, raw });
    } catch {
      /* 일부 페이지 누락 허용 */
    }
    await sleep(FETCH_DELAY_MS);
  }
  const text = pages.map((pg) => pg.text).join("\n");
  return { pages, text, textLength: text.length };
}

export async function fetchPageRange(epubBase, start, end, pageOffset, onProgress) {
  const { pages, text } = await fetchPagesInRange(epubBase, start, end, pageOffset);
  for (const pg of pages) onProgress?.(pg.page, end);
  return text;
}

export function assignLessonPageRanges(tocUnits, unitConfigs) {
  const result = [];

  for (let i = 0; i < unitConfigs.length; i++) {
    const cfg = unitConfigs[i];
    const tocUnit = tocUnits[i];
    if (!tocUnit || tocUnit.sections.length === 0) continue;

    const sections = tocUnit.sections;
    const lessonCount = cfg.lessonCount;
    const chunk = Math.ceil(sections.length / lessonCount);

    for (let li = 0; li < lessonCount; li++) {
      const slice = sections.slice(li * chunk, (li + 1) * chunk);
      if (slice.length === 0) continue;
      const pageStart = slice[0].page;
      const nextSliceStart = sections[(li + 1) * chunk]?.page;
      const pageEnd =
        nextSliceStart != null ? nextSliceStart - 1 : sections[sections.length - 1].page + 5;

      result.push({
        unitId: cfg.unitId,
        lessonIndex: li,
        pageStart,
        pageEnd: Math.max(pageEnd, pageStart),
        sectionNames: slice.map((s) => s.name),
      });
    }
  }

  return result;
}

export function assignPageRangesFromUnits(unitConfigs) {
  const result = [];

  for (const cfg of unitConfigs) {
    const totalPages = cfg.pageEnd - cfg.pageStart + 1;
    const pagesPerLesson = Math.ceil(totalPages / cfg.lessonCount);

    for (let li = 0; li < cfg.lessonCount; li++) {
      const pageStart = cfg.pageStart + li * pagesPerLesson;
      const pageEnd = Math.min(cfg.pageStart + (li + 1) * pagesPerLesson - 1, cfg.pageEnd);
      result.push({
        unitId: cfg.unitId,
        lessonIndex: li,
        pageStart,
        pageEnd,
        sectionNames: [],
      });
    }
  }

  return result;
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}
