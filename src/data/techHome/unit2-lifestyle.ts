import type { Unit } from "../../types";
import { lesson } from "../quizHelpers";

export const unit2Lifestyle: Unit = {
  id: "unit2",
  title: "Ⅱ. 청소년의 의식주 생활과 건강",
  subtitle: "가정 영역 · 9기가02",
  textbookRef: "교과서 Ⅱ. 청소년의 의식주 생활과 건강",
  textbookChapters: [
    "01. 청소년의 영양과 건강한 식생활",
    "02. 청소년의 옷차림과 바람직한 의생활",
    "03. 청소년의 주거 문화",
  ],
  textbookPages: "p. 49 ~ 86",
  studyGuide:
    "식·의·주 생활은 건강과 직결됩니다. e북 Ⅱ단원을 읽고 생활 습관을 점검해 보세요.",
  goals: [
    "균형 잡힌 식생활과 식품 선택의 기준을 이해한다.",
    "바람직한 의생활과 주거·생활 환경의 중요성을 설명할 수 있다.",
  ],
  lessons: [
    lesson("u2l1", {
      id: "nutrition",
      title: "영양과 건강한 식생활",
      summary:
        "성장기에 필요한 영양소, 균형 잡힌 식단, 식품 라벨 읽기, 식습관과 건강의 관계를 학습합니다.",
      points: [
        "성장기에는 단백질·칼슘·철·비타민 등 다양한 영양소가 필요하다.",
        "곡류·단백질·채소·과일·유제품을 골고루 섭취하는 것이 바람직하다.",
        "식품 영양성분표와 원재료 정보로 합리적으로 선택한다.",
        "규칙적인 식사·아침 식사·과도한 당분·나트륨 섭취 주의가 중요하다.",
        "식문화와 지속 가능한 식생활(로컬·제철·잔반 줄이기)을 고려한다.",
      ],
      keywords: ["영양소", "균형 식단", "영양성분표", "식습관"],
      reflections: [
        "나의 하루 식단에서 부족한 영양소는?",
        "식품 라벨을 볼 때 확인할 정보는?",
      ],
      quizzes: [
        { question: "균형 잡힌 식생활의 의미는?", options: [{ id: "a", text: "한 가지 음식만 반복" }, { id: "b", text: "필요 영양소를 골고루 섭취" }, { id: "c", text: "아침은 생략" }, { id: "d", text: "당분 음료만 마심" }], correctId: "b", explanation: "성장에는 다양한 영양소의 균형 잡힌 섭취가 필요합니다." },
        { question: "식품 선택 시 확인하면 좋은 정보는?", options: [{ id: "a", text: "포장 디자인만" }, { id: "b", text: "영양·원재료·유통기한" }, { id: "c", text: "가격만" }, { id: "d", text: "유통기한은 무관" }], correctId: "b", explanation: "영양성분표와 원재료 정보로 합리적 선택이 가능합니다." },
        { question: "청소년기 특히 중요한 영양소 예는?", options: [{ id: "a", text: "칼슘·철·단백질" }, { id: "b", text: "당분만" }, { id: "c", text: "나트륨만" }, { id: "d", text: "지방만" }], correctId: "a", explanation: "성장·뼈·혈액 건강 등을 위해 칼슘·철·단백질이 중요합니다." },
        { question: "바람직하지 않은 식습관은?", options: [{ id: "a", text: "불규칙한 식사·과식" }, { id: "b", text: "규칙적인 식사" }, { id: "c", text: "채소·과일 섭취" }, { id: "d", text: "물 자주 마시기" }], correctId: "a", explanation: "규칙적·적당한 식사가 건강에 도움이 됩니다." },
        { question: "지속 가능한 식생활과 관련 있는 것은?", options: [{ id: "a", text: "제철·로컬 식재료·잔반 줄이기" }, { id: "b", text: "일회용만 사용" }, { id: "c", text: "음식 낭비" }, { id: "d", text: "포장 과다" }], correctId: "a", explanation: "환경을 고려한 식생활 선택이 지속 가능성과 연결됩니다." },
        { question: "외식·간식 선택 시 고려할 점은?", options: [{ id: "a", text: "영양·위생·양·가격을 함께 고려" }, { id: "b", text: "맛만 본다" }, { id: "c", text: "영양은 무관" }, { id: "d", text: "매일 같은 메뉴만" }], correctId: "a", explanation: "영양과 위생·경제성을 함께 고려해 선택합니다." },
      ],
    }),
    lesson("u2l2", {
      id: "clothing",
      title: "옷차림과 바람직한 의생활",
      summary:
        "의복의 기능, TPO에 맞는 옷차림, 세탁·관리, 패션과 자기 표현, 지속 가능한 의생활을 학습합니다.",
      points: [
        "의복은 보호·체온 조절·위생·자기 표현의 기능이 있다.",
        "TPO(시간·장소·상황)에 맞는 옷차림이 예절과 관련된다.",
        "소재별 세탁·관리법을 이해하면 옷을 오래 사용할 수 있다.",
        "유행과 개성, 예산·환경을 고려한 합리적 선택이 필요하다.",
        "의류 재활용·중고·수선 등 지속 가능한 의생활을 실천할 수 있다.",
      ],
      keywords: ["TPO", "의복 기능", "세탁·관리", "지속 가능"],
      reflections: ["나에게 맞는 옷차림 기준은?", "옷을 오래 쓰기 위한 방법은?"],
      quizzes: [
        { question: "의복의 기능으로 적절한 것은?", options: [{ id: "a", text: "보호·체온 조절·자기 표현" }, { id: "b", text: "타인 비하만" }, { id: "c", text: "위생과 무관" }, { id: "d", text: "계절과 무관" }], correctId: "a", explanation: "의복은 보호·편의·위생·표현 등 다양한 기능을 합니다." },
        { question: "TPO에 맞는 옷차림이란?", options: [{ id: "a", text: "시간·장소·상황에 맞게 입는 것" }, { id: "b", text: "항상 같게 입는 것" }, { id: "c", text: "가장 비싼 것만" }, { id: "d", text: "예절과 무관" }], correctId: "a", explanation: "TPO는 Time, Place, Occasion에 맞는 옷차림을 의미합니다." },
        { question: "의류 관리에 도움이 되는 것은?", options: [{ id: "a", text: "세탁표 확인·소재별 관리" }, { id: "b", text: "무조건 뜨거운 물" }, { id: "c", text: "세탁표 무시" }, { id: "d", text: "환경 고려 안 함" }], correctId: "a", explanation: "소재에 맞는 세탁·보관으로 의류 수명을 늘릴 수 있습니다." },
        { question: "합리적 의생활 선택은?", options: [{ id: "a", text: "예산·기능·환경·개성을 고려" }, { id: "b", text: "브랜드만 중요" }, { id: "c", text: "유행만 따름" }, { id: "d", text: "필요 이상 구매" }], correctId: "a", explanation: "기능·예산·환경·자기 표현을 균형 있게 고려합니다." },
        { question: "지속 가능한 의생활 예는?", options: [{ id: "a", text: "수선·재활용·필요한 만큼 구매" }, { id: "b", text: "매번 새 옷만" }, { id: "c", text: "버리기만" }, { id: "d", text: "낭비" }], correctId: "a", explanation: "수선·재활용·신중한 구매가 지속 가능한 의생활입니다." },
        { question: "전통·문화 의복에 대한 태도는?", options: [{ id: "a", text: "문화적 가치를 이해하고 존중" }, { id: "b", text: "전통은 무관" }, { id: "c", text: "비하한다" }, { id: "d", text: "디자인만 본다" }], correctId: "a", explanation: "한복 등 전통 의복은 문화·미적 가치를 지닙니다." },
      ],
    }),
    lesson("u2l3", {
      id: "housing",
      title: "주거 문화와 생활 환경",
      summary:
        "주거의 의미, 생활 공간의 기능, 안전·위생·에너지 절약, 지속 가능한 주거 생활을 학습합니다.",
      points: [
        "주거는 휴식·학습·가족 생활 등 기본적 생활의 토대이다.",
        "침실·학습 공간·공용 공간의 기능과 정리·위생이 중요하다.",
        "가스·전기·화재·미끄럼 등 생활 안전 수칙을 지켜야 한다.",
        "에너지 절약·분리배출·환기 등 환경 친화적 생활을 실천한다.",
        "주거 문화와 공동체·지역의 다양성을 존중한다.",
      ],
      keywords: ["주거", "생활 안전", "에너지 절약", "정리·위생"],
      reflections: ["우리 집에서 안전·환경을 위해 할 수 있는 일은?", "나만의 학습 공간은?"],
      quizzes: [
        { question: "주거 생활에서 중요한 것은?", options: [{ id: "a", text: "안전·위생·기능적 공간 활용" }, { id: "b", text: "정리는 필요 없다" }, { id: "c", text: "안전 수칙 무시" }, { id: "d", text: "환기는 불필요" }], correctId: "a", explanation: "주거는 안전하고 위생적이며 기능적으로 사용해야 합니다." },
        { question: "생활 안전과 관련 있는 것은?", options: [{ id: "a", text: "가스·전기·화재 예방" }, { id: "b", text: "콘센트 과부하" }, { id: "c", text: "미끄러운 바닥 방치" }, { id: "d", text: "환기 차단" }], correctId: "a", explanation: "가스·전기·화재·낙상 등 예방 수칙을 지켜야 합니다." },
        { question: "환경 친화적 주거 생활은?", options: [{ id: "a", text: "에너지 절약·분리배출·절수" }, { id: "b", text: "전등 항상 켜두기" }, { id: "c", text: "쓰레기 혼합 배출" }, { id: "d", text: "낭비" }], correctId: "a", explanation: "에너지·물·자원 절약과 분리배출이 중요합니다." },
        { question: "학습 공간 조성에 도움이 되는 것은?", options: [{ id: "a", text: "조명·정리·소음 관리" }, { id: "b", text: "침대에서만 공부" }, { id: "c", text: "항상 어수선함" }, { id: "d", text: "휴대폰만 옆에" }], correctId: "a", explanation: "밝기·정리·집중 환경이 학습 효율에 영향을 줍니다." },
        { question: "공용 공간 사용 시 바람직한 태도는?", options: [{ id: "a", text: "정리·청소·타인 배려" }, { id: "b", text: "남의 물건 무단 사용" }, { id: "c", text: "청소 거부" }, { id: "d", text: "소음 방치" }], correctId: "a", explanation: "가족·공동체 공간에서는 협력과 배려가 필요합니다." },
        { question: "주거 문화의 다양성에 대한 태도는?", options: [{ id: "a", text: "지역·가족 형태 차이를 존중" }, { id: "b", text: "한 가지 형태만 옳다" }, { id: "c", text: "차별한다" }, { id: "d", text: "무시한다" }], correctId: "a", explanation: "주거 형태와 문화는 다양하며 상호 존중이 필요합니다." },
      ],
    }),
  ],
};
