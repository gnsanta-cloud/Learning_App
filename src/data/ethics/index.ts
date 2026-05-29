import type { Subject } from "../../types";
import { unit1Self } from "./unit1-self";
import { unit2Others } from "./unit2-others";
import { unit3Society } from "./unit3-society";
import { unit4Nature } from "./unit4-nature";

export const ethicsSubject: Subject = {
  id: "ethics",
  name: "도덕 ①",
  shortName: "도덕",
  publisher: "비상교육",
  author: "김국현",
  curriculum: "2022 개정",
  color: "#7c3aed",
  accent: "#ede9fe",
  emoji: "💭",
  ebookUrl:
    "https://ibook.vivasam.com/CBS_iBook/1702/contents/index.html?skin=basic01",
  ebookLabel: "비바샘 스마트 교과서 (도덕 ①)",
  examScope: [
    { id: "ethics-exam-1", label: "Ⅰ. 자신과의 관계", hint: "나·도덕·행복" },
    { id: "ethics-exam-2", label: "Ⅱ. 타인과의 관계", hint: "가정·우정·가상공간" },
    { id: "ethics-exam-3", label: "Ⅲ. 사회·공동체", hint: "인권·문화·통일" },
    { id: "ethics-exam-4", label: "Ⅳ. 자연과의 관계", hint: "환경 윤리·생태" },
    { id: "ethics-exam-review", label: "수활북·쟁점 토론", hint: "비바샘 특화 자료" },
  ],
  units: [unit1Self, unit2Others, unit3Society, unit4Nature],
};
