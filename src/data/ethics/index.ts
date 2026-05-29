import type { Subject } from "../../types";
import { geminiEthicsUnits } from "./geminiUnits";

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
  units: geminiEthicsUnits,
};
