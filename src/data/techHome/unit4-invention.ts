import type { Unit } from "../../types";
import { lesson } from "../quizHelpers";

export const unit4Invention: Unit = {
  id: "unit4",
  title: "Ⅳ. 기술과 발명",
  subtitle: "기술 영역 · 9기가03~05",
  textbookRef: "교과서 Ⅳ. 기술과 발명",
  textbookChapters: [
    "01. 기술과 표준화의 이해",
    "02. 기술적 문제 해결",
    "03. 발명과 지식 재산권",
  ],
  textbookPages: "p. 128 ~ 171",
  studyGuide:
    "기술·표준화·문제해결·발명·지식재산을 e북 Ⅳ단원에서 읽고 퀴즈로 정리하세요.",
  goals: [
    "기술의 의미·사회적 영향·표준화·적정 기술을 이해한다.",
    "기술적 문제 해결 과정과 발명·지식재산권을 설명할 수 있다.",
  ],
  lessons: [
    lesson("u4l1", {
      id: "tech-standard",
      title: "기술·표준화·적정 기술",
      summary:
        "기술의 의미와 특성, 기술과 사회 변화, 표준화의 필요성, 적정 기술과 지속 가능한 발전을 학습합니다.",
      points: [
        "기술은 인간의 욕구를 충족하기 위한 지식·경험·도구의 총체이다.",
        "기술은 생활·산업·문화를 변화시키며 긍정·부정적 영향을 모두 가진다.",
        "표준화는 호환성·안전·효율·교류를 위해 규격·기준을 정하는 것이다.",
        "적정 기술은 지역·환경·자원에 맞는 실용적·지속 가능한 기술이다.",
        "기술 선택 시 필요·영향·윤리·환경을 함께 고려한다.",
      ],
      keywords: ["표준화", "적정 기술", "기술과 사회", "지속 가능"],
      reflections: ["일상에서 표준화의 예는?", "적정 기술의 좋은 사례는?"],
      quizzes: [
        { question: "기술의 의미로 알맞은 것은?", options: [{ id: "a", text: "욕구 충족을 위한 지식·도구·방법의 총체" }, { id: "b", text: "기계만 해당" }, { id: "c", text: "윤리와 무관" }, { id: "d", text: "변화와 무관" }], correctId: "a", explanation: "기술은 문제 해결과 욕구 충족을 위한 다양한 수단을 포함합니다." },
        { question: "표준화의 장점은?", options: [{ id: "a", text: "호환·안전·효율·교류" }, { id: "b", text: "모든 제품이 달라야 함" }, { id: "c", text: "안전과 무관" }, { id: "d", text: "혁신을 막음" }], correctId: "a", explanation: "표준화는 생산·수리·교류·안전에 도움이 됩니다." },
        { question: "적정 기술이란?", options: [{ id: "a", text: "환경·자원·상황에 맞는 실용적 기술" }, { id: "b", text: "항상 최첨단만" }, { id: "c", text: "가장 비싼 것만" }, { id: "d", text: "환경 무관" }], correctId: "a", explanation: "적정 기술은 지역·환경에 맞는 지속 가능한 기술입니다." },
        { question: "기술과 사회 변화의 관계는?", options: [{ id: "a", text: "상호 영향을 주고받는다" }, { id: "b", text: "기술만 변한다" }, { id: "c", text: "사회는 변하지 않는다" }, { id: "d", text: "역사와 무관" }], correctId: "a", explanation: "기술은 사회를 바꾸고 사회적 요구가 기술을 발전시킵니다." },
        { question: "기술 선택 시 고려할 것은?", options: [{ id: "a", text: "필요·영향·윤리·환경" }, { id: "b", text: "최신만" }, { id: "c", text: "가격만" }, { id: "d", text: "영향 무시" }], correctId: "a", explanation: "합리적·윤리적 기술 활용을 위해 다각도로 고려합니다." },
        { question: "기술의 부정적 영향 예는?", options: [{ id: "a", text: "환경 오염·개인정보 침해·일자리 변화" }, { id: "b", text: "교통 발달" }, { id: "c", text: "의료 발전" }, { id: "d", text: "교육 확대" }], correctId: "a", explanation: "기술은 긍정·부정 영향을 모두 가질 수 있어 비판적 이해가 필요합니다." },
      ],
    }),
    lesson("u4l2", {
      id: "problem-solving",
      title: "기술적 문제 해결 과정",
      summary:
        "문제 확인·아이디어·계획·실행·평가의 기술적 문제 해결 과정과 창의·협력적 적용을 학습합니다.",
      points: [
        "기술적 문제는 생활·사회에서 필요·불편·제약 등으로 나타난다.",
        "문제 해결 과정: 문제 확인 → 아이디어 → 계획 → 실행 → 평가.",
        "아이디어 발상에 브레인스토밍·스케치·프로토타입이 활용된다.",
        "평가를 통해 개선하고 반복(반복 설계)한다.",
        "협력·안전·윤리를 지키며 문제를 해결한다.",
      ],
      keywords: ["문제 해결", "프로토타입", "평가·개선", "협력"],
      reflections: ["생활 속 기술적 문제 한 가지는?", "해결 과정 중 가장 어려운 단계는?"],
      quizzes: [
        { question: "기술적 문제 해결 과정 순서는?", options: [{ id: "a", text: "문제 확인→아이디어→계획→실행→평가" }, { id: "b", text: "실행→평가→문제 확인" }, { id: "c", text: "아이디어만 있으면 끝" }, { id: "d", text: "평가 생략" }], correctId: "a", explanation: "체계적 과정을 통해 문제를 해결하고 개선합니다." },
        { question: "프로토타입의 역할은?", options: [{ id: "a", text: "아이디어를 시험·검증·개선" }, { id: "b", text: "완성품과 무관" }, { id: "c", text: "평가 불필요" }, { id: "d", text: "협업 거부" }], correctId: "a", explanation: "시제품으로 아이디어를 검증하고 개선합니다." },
        { question: "실습·제작 시 필수는?", options: [{ id: "a", text: "안전 수칙·도구 올바른 사용" }, { id: "b", text: "보호구 없이 작업" }, { id: "c", text: "남의 도구 무단 사용" }, { id: "d", text: "정리 생략" }], correctId: "a", explanation: "안전과 도구·공간 관리가 최우선입니다." },
        { question: "평가 단계에서 하는 일은?", options: [{ id: "a", text: "기능·안전·완성도 점검·개선" }, { id: "b", text: "만들었으면 끝" }, { id: "c", text: "사용자 의견 무시" }, { id: "d", text: "개선 안 함" }], correctId: "a", explanation: "평가를 통해 결과를 분석하고 개선합니다." },
        { question: "창의적 아이디어 발상 방법은?", options: [{ id: "a", text: "브레인스토밍·스케치·연결" }, { id: "b", text: "한 가지만 고집" }, { id: "c", text: "비판만" }, { id: "d", text: "기록 안 함" }], correctId: "a", explanation: "다양한 발상 기법으로 아이디어를 확장합니다." },
        { question: "협력적 문제 해결의 장점은?", options: [{ id: "a", text: "다양한 관점·역할 분담" }, { id: "b", text: "혼자만 해야 함" }, { id: "c", text: "의견 충돌 금지" }, { id: "d", text: "역할 없음" }], correctId: "a", explanation: "협력을 통해 더 나은 해결책을 만들 수 있습니다." },
      ],
    }),
    lesson("u4l3", {
      id: "invention-ip",
      title: "발명과 지식재산권",
      summary:
        "발명의 의미·특징·사회적 영향, 특허·저작권 등 지식재산권과 기술 윤리를 학습합니다.",
      points: [
        "발명은 새로운 문제 해결 방법·제품·기술을 창출하는 활동이다.",
        "발명은 생활·산업·사회 변화에 큰 영향을 준다.",
        "지식재산권은 창작·발명에 대한 권리를 보호하고 혁신을 촉진한다.",
        "특허(발명), 저작권(창작물 표현), 상표 등 종류가 있다.",
        "타인의 지식재산을 존중하고 출처 표시·허락·공정 이용을 지킨다.",
      ],
      keywords: ["발명", "특허", "저작권", "기술 윤리"],
      reflections: ["생활 속 발명품의 예는?", "지식재산 침해를 피하려면?"],
      quizzes: [
        { question: "발명의 의미는?", options: [{ id: "a", text: "새로운 문제 해결·기술 창출" }, { id: "b", text: "남의 아이디어 베끼기" }, { id: "c", text: "실험 불필요" }, { id: "d", text: "생활과 무관" }], correctId: "a", explanation: "발명은 창의적 문제 해결과 새로운 가치 창출입니다." },
        { question: "지식재산권의 목적은?", options: [{ id: "a", text: "창작·발명 보호와 혁신 촉진" }, { id: "b", text: "무단 복제 허용" }, { id: "c", text: "정보 공유 금지" }, { id: "d", text: "특허만 해당" }], correctId: "a", explanation: "권리 보호가 창의 활동을 장려합니다." },
        { question: "특허와 저작권의 차이는?", options: [{ id: "a", text: "특허는 발명, 저작권은 창작물 표현" }, { id: "b", text: "완전히 같음" }, { id: "c", text: "특허는 책만" }, { id: "d", text: "저작권은 기계만" }], correctId: "a", explanation: "보호 대상과 요건이 다릅니다." },
        { question: "올바른 자료 이용은?", options: [{ id: "a", text: "출처 표시·허락·공정 이용" }, { id: "b", text: "출처 없이 그대로 제출" }, { id: "c", text: "무단 복제" }, { id: "d", text: "침해 OK" }], correctId: "a", explanation: "타인의 창작물·발명을 존중해야 합니다." },
        { question: "기술 윤리에 포함되는 것은?", options: [{ id: "a", text: "안전·권리 존중·환경·공정" }, { id: "b", text: "안전 무시" }, { id: "c", text: "차별" }, { id: "d", text: "권리 침해" }], correctId: "a", explanation: "기술 활용 시 윤리적 책임이 따릅니다." },
        { question: "발명이 사회에 미치는 영향은?", options: [{ id: "a", text: "생활 편의·산업·일자리 변화" }, { id: "b", text: "영향 없음" }, { id: "c", text: "항상 부정적" }, { id: "d", text: "역사와 무관" }], correctId: "a", explanation: "발명은 사회·경제·문화에 폭넓은 영향을 줍니다." },
      ],
    }),
  ],
};
