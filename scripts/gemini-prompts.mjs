/** @typedef {{ unitNum: number; id: string; title: string; sections: string[] }} TechUnitSpec */

export const TECH_HOME_UNITS = [
  {
    unitNum: 1,
    id: "unit1",
    title: "Ⅰ. 청소년의 발달과 인간관계",
    sections: ["01. 청소년의 발달", "02. 청소년의 건강한 성과 인간관계"],
  },
  {
    unitNum: 2,
    id: "unit2",
    title: "Ⅱ. 청소년의 의식주 생활과 건강",
    sections: [
      "01. 청소년의 영양과 건강한 식생활",
      "02. 청소년의 옷차림과 바람직한 의생활",
      "03. 주거와 주거 문화",
    ],
  },
  {
    unitNum: 3,
    id: "unit3",
    title: "Ⅲ. 청소년의 자기 관리와 주도적인 삶",
    sections: [
      "01. 청소년 생활 문제의 이해와 예방",
      "02. 청소년의 바람직한 소비 생활",
    ],
  },
  {
    unitNum: 4,
    id: "unit4",
    title: "Ⅳ. 기술과 발명",
    sections: ["01. 기술의 이해와 발달", "02. 발명과 지식 재산"],
  },
  {
    unitNum: 5,
    id: "unit5",
    title: "Ⅴ. 재료와 제품 설계 및 제작",
    sections: ["01. 재료의 성질과 이용", "02. 제품의 설계와 제작"],
  },
  {
    unitNum: 6,
    id: "unit6",
    title: "Ⅵ. 친환경 에너지와 수송 기술",
    sections: [
      "01. 신재생 에너지의 이해와 체험",
      "02. 수송 기술과 수송 수단의 안전",
    ],
  },
];

const FORMAT_RULES = `
반드시 아래 형식만 사용하세요. 코드 블록(\`\`\`)으로 감싸지 마세요.

문항 형식 (각 Q마다):
### Q01
*   **발문:** (질문 한 문장)
*   **선지:** ① 보기1 / ② 보기2 / ③ 보기3 / ④ 보기4
*   **정답:** ②
*   **해설:** (1~2문장)

요약 불릿 형식:
*   **키워드:** 설명 문장 (**강조**는 핵심 용어에만)
`;

export function techHomeUnitPrompt(unit) {
  const sectionList = unit.sections
    .map((s) => `### ${s}\n*   **(소제목):** (불릿 3~5개)`)
    .join("\n\n");

  return `중학교 1학년 「기술·가정 ①」(천재교과서, 2022 개정) 다음 대단원만 작성하세요.

대단원: ${unit.title}
소단원: ${unit.sections.join(", ")}

출력 구조 (이 순서만):

## 대단원 ${"ⅠⅡⅢⅣⅤⅥ"[unit.unitNum - 1]}. ${unit.title.replace(/^Ⅰ+\.\s*/, "")}

${sectionList}

---

## [UNIT_${unit.unitNum}] ${unit.title} (20문항)

### Q01
(Q01~Q20까지 위 문항 형식으로 정확히 20개, 번호 연속)
${FORMAT_RULES}
`;
}

export function ethicsFullPrompt() {
  return `중학교 1학년 「도덕 ①」(비상교육, 2022 개정) 전체 학습 DB를 작성하세요.

출력 구조:

# [Data] 중1 도덕 비상교육 핵심요약 및 기말대비 20문항

## PART 1. 전체 단원별 핵심 요약

### 단원 1. 자신과의 관계
(불릿 3개: **인간의 도덕적 특성:**, **도덕적 성찰:**, **자아 정체성:**)

### 단원 2. 타인과의 관계
(불릿 3개: 가족, 친구, 이웃)

### 단원 3. 사회·공동체와의 관계
(불릿 3개: 인권, 사회 정의, 사이버 윤리)

### 단원 4. 자연·초월과의 관계
(불릿 2개: 환경 윤리, 과학 기술과 도덕)

---

## PART 2. 기말고사대비 연습문제 20문항

### Q01
~ ### Q20 (각 문항은 반드시 4지선다 객관식)
${FORMAT_RULES}

서술형 없이 모두 4지선다로 작성하세요.
`;
}

export function assembleTechHomeMd(unitChunks) {
  const header = `# [APP 개발용 데이터] 중학교 1학년 기술·가정 ① 전단원 핵심 요약 및 기출문제 DB
> **교육과정:** 2022 개정 교육과정 반영
> **교과서:** 천재교과서 (이춘식 외) 기준

---

# PART 1. 전단원 핵심 요약 (Summary Data)

`;

  const part1 = unitChunks.map((c) => c.part1).join("\n---\n\n");
  const part2Header = `---
---

# PART 2. 단원별 기말고사 대비 문제 DB (각 단원 20문항, 총 120문항)

`;
  const part2 = unitChunks.map((c) => c.part2).join("\n\n");

  return header + part1 + part2Header + part2 + "\n";
}
