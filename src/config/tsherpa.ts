/** T셀파 22개정 중학 기술·가정 ① (이춘식) 교과서 ID */
export const TSHERPA_TECH_HOME_BOOK_ID = "824498";

const TSHERPA_BOOK_BASE =
  "https://mh.tsherpa.co.kr/curri/schoolbookdata.html";

type TsherpaBookParams = {
  curriCateId?: string;
  tabIndex?: number;
  subTabIndex?: number;
  sectionIndex?: number;
  searchWord?: string;
};

/** T셀파 교과서 자료실 딥링크 (평가 탭 등) */
export function tsherpaBookUrl(params: TsherpaBookParams = {}): string {
  const query = new URLSearchParams({
    id: TSHERPA_TECH_HOME_BOOK_ID,
    curriCateId: params.curriCateId ?? TSHERPA_TECH_HOME_BOOK_ID,
    sectionIndex: String(params.sectionIndex ?? 0),
    tabIndex: String(params.tabIndex ?? 0),
    subTabIndex: String(params.subTabIndex ?? 0),
  });

  if (params.searchWord) {
    query.set("searchWord", params.searchWord);
  }

  return `${TSHERPA_BOOK_BASE}?${query.toString()}`;
}
