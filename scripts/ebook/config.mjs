/** T셀파 · 비바샘 eBook 크롤 설정 */
export const TSHERPA_TECH_HOME = {
  id: "tech-home",
  label: "기술·가정 ① (T셀파)",
  tocUrl:
    "https://cdata2.tsherpa.co.kr/ebook/tsherpa/22/22ebook_M/EB2022GC2Etc_02_70L_S/resource/include/main/index.html",
  epubBase:
    "https://cdata2.tsherpa.co.kr/ebook/tsherpa/22/22ebook_M/EB2022GC2Etc_02_70L_S/resource/ebook/ebook.epub/OPS",
  /** 교과서 쪽수 → EPUB HTML 파일 번호 (page-N.html) */
  pageOffset: 1,
  maxPage: 258,
  outputDir: "src/data/techHome",
  /** 기존 단원 파일별 레슨 개수 (ID·메타 유지) */
  units: [
    {
      file: "unit1-youth.ts",
      exportName: "unit1Youth",
      unitId: "unit1",
      pageStart: 10,
      pageEnd: 48,
      lessonCount: 4,
      lessonMeta: [
        { prefix: "u1l1", id: "physical-cognitive", title: "신체적·인지적 발달" },
        { prefix: "u1l2", id: "emotion-identity", title: "정서·사회적 발달과 자아 정체성" },
        { prefix: "u1l3", id: "healthy-sex", title: "청소년의 건강한 성" },
        { prefix: "u1l4", id: "relationships", title: "건강한 인간관계와 또래·가족" },
      ],
    },
    {
      file: "unit2-lifestyle.ts",
      exportName: "unit2Lifestyle",
      unitId: "unit2",
      pageStart: 49,
      pageEnd: 86,
      lessonCount: 3,
      lessonMeta: [
        { prefix: "u2l1", id: "nutrition", title: "영양과 건강한 식생활" },
        { prefix: "u2l2", id: "clothing", title: "옷차림과 바람직한 의생활" },
        { prefix: "u2l3", id: "housing", title: "주거 문화와 생활 환경" },
      ],
    },
    {
      file: "unit3-self-mgmt.ts",
      exportName: "unit3SelfMgmt",
      unitId: "unit3",
      pageStart: 87,
      pageEnd: 127,
      lessonCount: 3,
      lessonMeta: [
        { prefix: "u3l1", id: "behavior-addiction", title: "행동·심리·중독 문제의 예방과 대처" },
        { prefix: "u3l2", id: "stress-emotion", title: "스트레스·정서 문제와 대처" },
        { prefix: "u3l3", id: "consumption-career", title: "바람직한 소비와 진로·주도적 삶" },
      ],
    },
    {
      file: "unit4-invention.ts",
      exportName: "unit4Invention",
      unitId: "unit4",
      pageStart: 128,
      pageEnd: 171,
      lessonCount: 3,
      lessonMeta: [
        { prefix: "u4l1", id: "tech-standard", title: "기술·표준화·적정 기술" },
        { prefix: "u4l2", id: "problem-solving", title: "기술적 문제 해결 과정" },
        { prefix: "u4l3", id: "invention-ip", title: "발명과 지식재산권" },
      ],
    },
    {
      file: "unit5-materials.ts",
      exportName: "unit5Materials",
      unitId: "unit5",
      pageStart: 172,
      pageEnd: 211,
      lessonCount: 2,
      lessonMeta: [
        { prefix: "u5l1", id: "materials-safety", title: "재료의 이해·선택·안전" },
        { prefix: "u5l2", id: "design-making", title: "제품 설계·제작·평가" },
      ],
    },
    {
      file: "unit6-energy.ts",
      exportName: "unit6Energy",
      unitId: "unit6",
      pageStart: 212,
      pageEnd: 258,
      lessonCount: 2,
      lessonMeta: [
        { prefix: "u6l1", id: "eco-energy", title: "친환경 에너지의 이해와 활용" },
        { prefix: "u6l2", id: "transport", title: "수송 기술과 지속 가능한 이동" },
      ],
    },
  ],
};

export const VIVASAM_ETHICS = {
  id: "ethics",
  label: "도덕 ① (비바샘)",
  ebookUrl:
    "https://ibook.vivasam.com/CBS_iBook/1702/contents/index.html?skin=basic01",
  note: "Canvas 기반 뷰어로 텍스트 크롤 불가 — 수동/별도 EPUB 필요",
};
