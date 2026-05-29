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
  units: [unit1Self, unit2Others, unit3Society, unit4Nature],
};
