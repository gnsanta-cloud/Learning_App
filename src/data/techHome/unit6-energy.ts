import type { Unit } from "../../types";
import { lesson } from "../quizHelpers";

export const unit6Energy: Unit = {
  id: "unit6",
  title: "Ⅵ. 친환경 에너지와 수송 기술",
  subtitle: "기술 영역 · 9기가05",
  textbookRef: "교과서 Ⅵ. 친환경 에너지와 수송 기술",
  textbookChapters: [
    "01. 친환경 에너지",
    "02. 수송 기술",
  ],
  textbookPages: "p. 212 ~",
  studyGuide:
    "친환경 에너지·수송·지속 가능한 기술을 e북 Ⅵ단원에서 정리하고 생활 실천과 연결하세요.",
  goals: [
    "친환경 에너지의 종류·원리·활용을 이해한다.",
    "수송 기술의 발달과 지속 가능한 이동·에너지 절약을 설명할 수 있다.",
  ],
  lessons: [
    lesson("u6l1", {
      id: "eco-energy",
      title: "친환경 에너지의 이해와 활용",
      summary:
        "태양·풍·수력·지열 등 신재생에너지, 에너지 절약, 탄소·환경 영향, 에너지 문제 해결 프로젝트를 학습합니다.",
      points: [
        "화석 연료는 유한하고 환경·기후에 영향을 줄 수 있다.",
        "태양광·풍력·수력·지열·바이오 등 신재생에너지가 활용된다.",
        "에너지 절약·효율 향상은 친환경 생활의 기본이다.",
        "에너지 선택 시 환경·비용·지역 조건을 고려한다.",
        "학교·가정에서 실천 가능한 에너지 절약·프로젝트를 계획할 수 있다.",
      ],
      keywords: ["신재생에너지", "에너지 절약", "지속 가능", "탄소"],
      reflections: ["우리 집·학교에서 할 수 있는 에너지 절약은?", "관심 있는 친환경 에너지는?"],
      quizzes: [
        { question: "친환경 에너지의 예는?", options: [{ id: "a", text: "태양·풍·수력·지열" }, { id: "b", text: "석탄만" }, { id: "c", text: "에너지 낭비" }, { id: "d", text: "일회용만" }], correctId: "a", explanation: "신재생에너지는 환경 부담을 줄이는 데 기여합니다." },
        { question: "에너지 절약 생활 습관은?", options: [{ id: "a", text: "대중교통·불필요한 전등 끄기" }, { id: "b", text: "항상 난방 최대" }, { id: "c", text: "낭비" }, { id: "d", text: "재활용 안 함" }], correctId: "a", explanation: "일상에서 에너지 절약을 실천할 수 있습니다." },
        { question: "화석 연료 사용의 문제는?", options: [{ id: "a", text: "환경·기후·자원 고갈" }, { id: "b", text: "문제 없음" }, { id: "c", text: "무한" }, { id: "d", text: "환경과 무관" }], correctId: "a", explanation: "화석 연료는 환경·기후 영향과 유한성이 있습니다." },
        { question: "에너지 선택 시 고려할 것은?", options: [{ id: "a", text: "환경·비용·지역·효율" }, { id: "b", text: "가격만" }, { id: "c", text: "환경 무시" }, { id: "d", text: "낭비" }], correctId: "a", explanation: "지역과 조건에 맞는 에너지를 선택합니다." },
        { question: "에너지 문제 해결 프로젝트는?", options: [{ id: "a", text: "문제 확인→아이디어→실행→평가" }, { id: "b", text: "계획 없음" }, { id: "c", text: "평가 생략" }, { id: "d", text: "실천 안 함" }], correctId: "a", explanation: "기술적 문제 해결 과정을 에너지에 적용합니다." },
        { question: "지속 가능한 에너지란?", options: [{ id: "a", text: "미래 세대도 사용 가능한 에너지" }, { id: "b", text: "당장만 쓰면 됨" }, { id: "c", text: "환경 무관" }, { id: "d", text: "낭비 OK" }], correctId: "a", explanation: "장기적·환경적 관점의 에너지 이용입니다." },
      ],
    }),
    lesson("u6l2", {
      id: "transport",
      title: "수송 기술과 지속 가능한 이동",
      summary:
        "수송 수단의 종류·원리·장단점, 교통 안전, 친환경·스마트 수송, 미래 이동 기술을 학습합니다.",
      points: [
        "수송 기술은 사람·물류 이동과 경제·문화 발전에 기여한다.",
        "도로·철도·해상·항공·우주 등 수송 방식마다 특징이 다르다.",
        "교통 안전·규칙·예절(보행·자전거·대중교통)을 지켜야 한다.",
        "대중교통·전기·수소 등 친환경 수송이 확대되고 있다.",
        "자율주행·스마트 교통 등 미래 수송 기술이 발전 중이다.",
      ],
      keywords: ["수송 기술", "교통 안전", "친환경 수송", "대중교통"],
      reflections: ["일상 이동에서 더 지속 가능하게 바꿀 점은?", "교통 안전 수칙 중 중요한 것은?"],
      quizzes: [
        { question: "수송 기술의 역할은?", options: [{ id: "a", text: "사람·물류 이동·경제·문화" }, { id: "b", text: "이동과 무관" }, { id: "c", text: "안전 무관" }, { id: "d", text: "환경 무관" }], correctId: "a", explanation: "수송은 사회·경제에 필수적입니다." },
        { question: "친환경 이동 방법은?", options: [{ id: "a", text: "대중교통·도보·자전거" }, { id: "b", text: "항상 단독 차량" }, { id: "c", text: "낭비" }, { id: "d", text: "안전 무시" }], correctId: "a", explanation: "대중교통·비 motor 이동이 환경에 유리합니다." },
        { question: "교통 안전과 관련 있는 것은?", options: [{ id: "a", text: "신호·횡단보도·헬met·속도" }, { id: "b", text: "규칙 무시" }, { id: "c", text: "음주 운전" }, { id: "d", text: "보행자 무시" }], correctId: "a", explanation: "교통 규칙과 안전 장비가 사고를 예방합니다." },
        { question: "해상·항공 수송의 특징은?", options: [{ id: "a", text: "대량·원거리 운반에 유리할 수 있음" }, { id: "b", text: "모두 같음" }, { id: "c", text: "단거리만" }, { id: "d", text: "안전 무관" }], correctId: "a", explanation: "수송 방식마다 거리·화물·속도 특성이 다릅니다." },
        { question: "미래 수송 기술 예는?", options: [{ id: "a", text: "전기·수소·자율주행·스마트 교통" }, { id: "b", text: "변화 없음" }, { id: "c", text: "안전 불필요" }, { id: "d", text: "환경 무관" }], correctId: "a", explanation: "친환경·지능형 수송이 발전하고 있습니다." },
        { question: "수송과 에너지·환경의 관계는?", options: [{ id: "a", text: "연료·배출·에너지 효율에 영향" }, { id: "b", text: "무관" }, { id: "c", text: "환경만" }, { id: "d", text: "기술만" }], correctId: "a", explanation: "수송은 에너지 소비와 환경에 큰 영향을 줍니다." },
      ],
    }),
  ],
};
