import type { Subject } from "../../types";
import { tsherpaBookUrl } from "../../config/tsherpa";
import { unit1Youth } from "./unit1-youth";
import { unit2Lifestyle } from "./unit2-lifestyle";
import { unit3SelfMgmt } from "./unit3-self-mgmt";
import { unit4Invention } from "./unit4-invention";
import { unit5Materials } from "./unit5-materials";
import { unit6Energy } from "./unit6-energy";

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
  resourceLinks: [
    {
      label: "형성·총괄평가 샘플",
      url: tsherpaBookUrl({ tabIndex: 1, subTabIndex: 1 }),
      note: "대단원별 단원 평가지 · T셀파 로그인 필요",
    },
    {
      label: "중간고사 샘플",
      url: tsherpaBookUrl({ tabIndex: 1, searchWord: "중간" }),
      note: "중간기말고사 대비 평가 (대단원별)",
    },
    {
      label: "기말고사 샘플",
      url: tsherpaBookUrl({ tabIndex: 1, searchWord: "기말" }),
      note: "중간기말고사 대비 평가 (대단원별)",
    },
  ],
  examScope: [
    { id: "tech-exam-1", label: "Ⅰ. 청소년의 발달과 인간관계", hint: "발달·성·관계" },
    { id: "tech-exam-2", label: "Ⅱ. 의식주 생활과 건강", hint: "식·의·주" },
    { id: "tech-exam-3", label: "Ⅲ. 자기 관리와 주도적 삶", hint: "중독·스트레스·소비·진로" },
    { id: "tech-exam-4", label: "Ⅳ. 기술과 발명", hint: "표준화·문제해결·지식재산" },
    { id: "tech-exam-5", label: "Ⅴ. 재료와 설계", hint: "재료·설계·제작" },
    { id: "tech-exam-6", label: "Ⅵ. 친환경 에너지와 수송", hint: "에너지·수송" },
    { id: "tech-exam-review", label: "자습서·형성평가 복습", hint: "T셀파·천재 정답 자료" },
  ],
  units: [
    unit1Youth,
    unit2Lifestyle,
    unit3SelfMgmt,
    unit4Invention,
    unit5Materials,
    unit6Energy,
  ],
};
