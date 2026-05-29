import type { Subject } from "../../types";
import { geminiTechHomeUnits } from "./geminiUnits";

export const techHomeSubject: Subject = {
  id: "tech-home",
  name: "기술·가정 ①",
  shortName: "기술·가정",
  publisher: "천재교육",
  author: "이춘식",
  curriculum: "2022 개정",
  color: "#0d9488",
  accent: "#ccfbf1",
  emoji: "🔧",
  ebookUrl:
    "https://cdata2.tsherpa.co.kr/ebook/tsherpa/22/22ebook_M/EB2022GC2Etc_02_70L_S/resource/include/main/index.html",
  ebookLabel: "T셀파 전자저작물 (기술·가정 ①)",
  units: geminiTechHomeUnits,
};
