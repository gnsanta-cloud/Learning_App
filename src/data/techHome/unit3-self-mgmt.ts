import type { Unit } from "../../types";
import { lesson } from "../quizHelpers";

export const unit3SelfMgmt: Unit = {
  id: "unit3",
  title: "Ⅲ. 청소년의 자기 관리와 주도적인 삶",
  subtitle: "가정 영역 · 9기가01",
  textbookRef: "교과서 Ⅲ. 청소년의 자기 관리와 주도적인 삶",
  textbookChapters: [
    "01. 청소년 생활 문제의 이해와 예방",
    "02. 청소년의 바람직한 소비 생활",
  ],
  textbookPages: "p. 87 ~ 127",
  studyGuide:
    "중독·스트레스·소비·진로는 주도적 삶과 연결됩니다. e북 Ⅲ단원과 함께 자기 점검표를 만들어 보세요.",
  goals: [
    "행동·심리·중독 문제를 예방하고 대처할 수 있다.",
    "합리적 소비와 진로 탐색의 중요성을 이해한다.",
  ],
  lessons: [
    lesson("u3l1", {
      id: "addiction-prevention",
      title: "행동·심리·중독 문제의 예방과 대처",
      summary:
        "게임·SNS·물질 등 중독의 특징, 예방, 도움 요청 방법과 건강한 디지털·생활 습관을 학습합니다.",
      points: [
        "중독은 통제 어려움·일상 기능 저하·관계 악화 등을 동반할 수 있다.",
        "디지털 중독은 사용 시간·목적·수면·대인관계에 영향을 준다.",
        "예방을 위해 사용 규칙·가족 약속·대체 활동이 도움이 된다.",
        "문제가 의심되면 혼자 참지 말고 전문 기관·어른에게 도움을 요청한다.",
        "건강한 여가·수면·운동이 중독 예방에 기여한다.",
      ],
      keywords: ["중독 예방", "디지털 사용", "도움 요청", "생활 규칙"],
      reflections: ["나의 스마트폰·게임 사용 습관은?", "도움을 요청할 사람·기관은?"],
      quizzes: [
        { question: "중독 예방에 도움이 되는 것은?", options: [{ id: "a", text: "사용 시간·목적 규칙 정하기" }, { id: "b", text: "무제한 사용" }, { id: "c", text: "수면 줄이기" }, { id: "d", text: "도움 요청 안 함" }], correctId: "a", explanation: "규칙과 대체 활동이 중독 예방에 효과적입니다." },
        { question: "디지털 중독 신호로 볼 수 있는 것은?", options: [{ id: "a", text: "수면·학업·관계에 부정적 영향" }, { id: "b", text: "가끔 게임 즐기기" }, { id: "c", text: "규칙적 사용" }, { id: "d", text: "오프라인 활동 병행" }], correctId: "a", explanation: "일상 기능 저하가 중독의 신호일 수 있습니다." },
        { question: "중독 문제 대처로 적절한 것은?", options: [{ id: "a", text: "전문 기관·어른에게 도움 요청" }, { id: "b", text: "혼자만 참기" }, { id: "c", text: "사용 시간 늘리기" }, { id: "d", text: "숨기기만" }], correctId: "a", explanation: "조기 도움 요청이 회복에 중요합니다." },
        { question: "가족과 디지털 규칙을 정할 때?", options: [{ id: "a", text: "함께 약속하고 지킨다" }, { id: "b", text: "규칙 없음" }, { id: "c", text: "어른만 지킴" }, { id: "d", text: "대화 거부" }], correctId: "a", explanation: "가족 합의와 실천이 지속 가능합니다." },
        { question: "물질 중독(담배· alcohol 등) 예방은?", options: [{ id: "a", text: "정확한 정보·거절 연습·건강한 관계" }, { id: "b", text: "무조건 시도" }, { id: "c", text: "또래 압력 따르기" }, { id: "d", text: "정보 무시" }], correctId: "a", explanation: "정보와 거절·지지 관계가 예방에 중요합니다." },
        { question: "건강한 여가 활동의 역할은?", options: [{ id: "a", text: "스트레스 해소·중독 예방·성장" }, { id: "b", text: "학업만" }, { id: "c", text: "수면 대체" }, { id: "d", text: "관계 단절" }], correctId: "a", explanation: "운동·취미·봉사 등 건강한 여가가 균형을 돕습니다." },
      ],
    }),
    lesson("u3l2", {
      id: "stress-emotion",
      title: "스트레스·정서 문제와 대처",
      summary:
        "스트레스 원인·반응, 정서 조절, 회복 탄력성, 전문 도움이 필요한 경우를 학습합니다.",
      points: [
        "스트레스는 학업·관계·변화 등 다양한 원인으로 발생한다.",
        "적절한 스트레스는 동기가 될 수 있으나 과도하면 건강에 해롭다.",
        "운동·대화·취미·수면·호흡 등 건강한 대처가 필요하다.",
        "회복 탄력성은 어려움 속에서 조절하고 회복하는 능력이다.",
        "오래 지속되는 우울·불안·자해 생각 등은 전문 도움이 필요하다.",
      ],
      keywords: ["스트레스", "정서 조절", "회복 탄력성", "상담"],
      reflections: ["나만의 스트레스 해소법은?", "힘들 때 도움받을 사람은?"],
      quizzes: [
        { question: "건강한 스트레스 대처는?", options: [{ id: "a", text: "운동·대화·취미·수면" }, { id: "b", text: "감정 억누르기만" }, { id: "c", text: "수면 줄이기" }, { id: "d", text: "문제 무시" }], correctId: "a", explanation: "건강한 대처 방법으로 스트레스를 관리합니다." },
        { question: "회복 탄력성이란?", options: [{ id: "a", text: "어려움 속에서 조절·회복하는 능력" }, { id: "b", text: "감정 표출 금지" }, { id: "c", text: "문제 회피만" }, { id: "d", text: "타인에게만 맞춤" }], correctId: "a", explanation: "회복 탄력성은 역경을 극복하는 심리적 자원입니다." },
        { question: "전문 도움이 필요한 신호는?", options: [{ id: "a", text: "오랜 우울·불안·일상 기능 저하" }, { id: "b", text: "시험 전 긴장" }, { id: "c", text: "가끔 피곤함" }, { id: "d", text: "친구와 놀기" }], correctId: "a", explanation: "지속적 증상은 상담·치료 등 전문 도움이 필요할 수 있습니다." },
        { question: "친구가 힘들어할 때?", options: [{ id: "a", text: "공감하고 필요 시 어른·전문가 연결" }, { id: "b", text: "비난" }, { id: "c", text: "SNS 공개" }, { id: "d", text: "놀림" }], correctId: "a", explanation: "경청·공감·적절한 도움 연결이 중요합니다." },
        { question: "스트레스 예방 생활 습관은?", options: [{ id: "a", text: "규칙적 수면·계획·여가·관계" }, { id: "b", text: "과로만" }, { id: "c", text: "고립" }, { id: "d", text: "불규칙 생활" }], correctId: "a", explanation: "균형 잡힌 생활이 스트레스 예방에 도움이 됩니다." },
        { question: "감정 조절에 도움이 되는 것은?", options: [{ id: "a", text: "감정 인식·표현·건강한 해소" }, { id: "b", text: "완전 억누르기" }, { id: "c", text: "폭력적 표출" }, { id: "d", text: "감정 무시" }], correctId: "a", explanation: "감정을 인식하고 적절히 표현·조절하는 것이 중요합니다." },
      ],
    }),
    lesson("u3l3", {
      id: "consumption-career",
      title: "바람직한 소비와 진로·주도적 삶",
      summary:
        "합리적 소비·소비자 권리, 진로 탐색·설계, 주도적 삶과 자기 관리를 학습합니다.",
      points: [
        "소비는 필요·예산·환경·정보를 고려해 합리적으로 결정한다.",
        "소비자 기본권(안전·정보·선택·피해 구제)을 알고 실천한다.",
        "광고·SNS·인플루언서 정보를 비판적으로 확인한다.",
        "진로는 적성·흥미·가치·사회 변화를 고려해 탐색한다.",
        "주도적 삶은 스스로 목표를 세우고 책임 있게 실천하는 태도이다.",
      ],
      keywords: ["합리적 소비", "소비자 권리", "진로 탐색", "주도적 삶"],
      reflections: ["최근 소비에서 후회한 점은?", "관심 있는 진로 분야는?"],
      quizzes: [
        { question: "합리적 소비란?", options: [{ id: "a", text: "필요·예산·정보·환경을 고려" }, { id: "b", text: "충동 구매만" }, { id: "c", text: "정보 확인 안 함" }, { id: "d", text: "낭비" }], correctId: "a", explanation: "필요와 정보·예산을 바탕으로 소비합니다." },
        { question: "소비자 권리 예는?", options: [{ id: "a", text: "안전·정보·선택·피해 구제" }, { id: "b", text: "무조건 환불 불가" }, { id: "c", text: "정보 제공 거부" }, { id: "d", text: "피해 방치" }], correctId: "a", explanation: "소비자는 기본적 권리를 보호받을 수 있습니다." },
        { question: "광고·SNS 정보 활용 시?", options: [{ id: "a", text: "출처·목적·사실 여부 확인" }, { id: "b", text: "무조건 믿음" }, { id: "c", text: "비교 안 함" }, { id: "d", text: "과소비 장려" }], correctId: "a", explanation: "비판적 정보 확인이 합리적 소비에 필요합니다." },
        { question: "진로 탐색에 도움이 되는 것은?", options: [{ id: "a", text: "적성·흥미·체험·정보 탐색" }, { id: "b", text: "타인 선택만 따름" }, { id: "c", text: "계획 없음" }, { id: "d", text: "성별 고정관념" }], correctId: "a", explanation: "다양한 탐색과 경험이 진로 설계에 도움이 됩니다." },
        { question: "주도적 삶의 의미는?", options: [{ id: "a", text: "목표 설정·자기 관리·책임 실천" }, { id: "b", text: "타인에게만 맡김" }, { id: "c", text: "무계획" }, { id: "d", text: "책임 회피" }], correctId: "a", explanation: "스스로 삶의 방향을 세우고 실천하는 태도입니다." },
        { question: "친환경·윤리적 소비란?", options: [{ id: "a", text: "환경·노동·공정성을 고려한 선택" }, { id: "b", text: "일회용만" }, { id: "c", text: "과포장 선호" }, { id: "d", text: "환경 무관" }], correctId: "a", explanation: "환경과 사회적 책임을 고려한 소비가 확대되고 있습니다." },
      ],
    }),
  ],
};
