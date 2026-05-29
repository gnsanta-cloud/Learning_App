import type { Unit } from "../../types";
import { lesson } from "../quizHelpers";

export const unit1Self: Unit = {
  id: "unit1",
  title: "Ⅰ. 자신과의 관계",
  subtitle: "나 · 도덕 · 행복",
  textbookRef: "교과서 Ⅰ. 자신과의 관계",
  textbookChapters: [
    "1. 나는 어떤 사람이고, 어떻게 살아야 할까?",
    "2. 도덕적인 사람이란?",
    "3. 행복이란?",
  ],
  studyGuide: "e북 Ⅰ단원과 수활북 성찰 질문을 함께 읽고 퀴즈로 정리하세요.",
  goals: [
    "자기 성찰과 도덕적 가치·덕목을 이해한다.",
    "도덕적 삶과 행복의 관계를 탐구한다.",
  ],
  lessons: [
    lesson("e1l1", {
      id: "who-am-i",
      title: "나는 어떤 사람이고, 어떻게 살아야 할까?",
      summary: "자기 성찰, 도덕적 가치·덕목, 자기 존중과 삶의 방향을 탐구합니다.",
      points: [
        "도덕 공부는 ‘무엇이 옳은가’를 생각하고 실천하는 과정이다.",
        "자기 성찰은 자신의 생각·감정·행동을 돌아보는 활동이다.",
        "덕목(정직·용기·배려 등)은 도덕적 삶의 기준을 제시한다.",
        "자기 존중은 도덕적 삶의 출발점이다.",
        "삶의 목표와 가치는 개인마다 다를 수 있으나 타인을 존중해야 한다.",
      ],
      keywords: ["자기 성찰", "도덕적 가치", "덕목", "자기 존중"],
      reflections: ["나에게 중요한 가치 세 가지는?", "최근 자랑스러웠던 도덕적 선택은?"],
      quizzes: [
        { question: "도덕 공부의 기초로 적절한 것은?", options: [{ id: "a", text: "타인만 비판" }, { id: "b", text: "자신을 존중하고 성찰" }, { id: "c", text: "규칙만 외우기" }, { id: "d", text: "행동은 중요하지 않음" }], correctId: "b", explanation: "자기 존중과 성찰이 도덕적 삶의 출발점입니다." },
        { question: "자기 성찰이란?", options: [{ id: "a", text: "남의 잘못만 찾기" }, { id: "b", text: "자신의 생각·행동 돌아보기" }, { id: "c", text: "감정 무시" }, { id: "d", text: "규칙 거부" }], correctId: "b", explanation: "성찰은 자신을 이해하고 개선하는 과정입니다." },
        { question: "바람직한 덕목 예는?", options: [{ id: "a", text: "정직·배려·책임" }, { id: "b", text: "거짓·편견" }, { id: "c", text: "무관심" }, { id: "d", text: "폭력" }], correctId: "a", explanation: "덕목은 도덕적 행동의 기준을 제시합니다." },
        { question: "자기 존중과 타인 존중의 관계는?", options: [{ id: "a", text: "자신을 존중할 때 타인도 존중하기 쉽다" }, { id: "b", text: "무관" }, { id: "c", text: "타인만" }, { id: "d", text: "자신은 불필요" }], correctId: "a", explanation: "자기 존중은 타인 존중의 기초가 됩니다." },
        { question: "가치와 목표 설정 시?", options: [{ id: "a", text: "자신의 가치를 생각하되 타인 존중" }, { id: "b", text: "타인만 따름" }, { id: "c", text: "성찰 불필요" }, { id: "d", text: "타인 비하" }], correctId: "a", explanation: "개인적 가치와 타인 존중을 함께 고려합니다." },
        { question: "도덕적 선택을 할 때?", options: [{ id: "a", text: "가치·결과·타인 영향을 생각" }, { id: "b", text: "충동만" }, { id: "c", text: "결과 무시" }, { id: "d", text: "책임 회피" }], correctId: "a", explanation: "신중한 판단과 책임 있는 선택이 필요합니다." },
      ],
    }),
    lesson("e1l2", {
      id: "moral-person",
      title: "어떤 사람이 도덕적인 사람일까?",
      summary: "양심·책임·실천, 도덕적 판단과 일관된 행동을 학습합니다.",
      points: [
        "도덕적 사람은 가치를 인식하고 실천하려 노력한다.",
        "양심은 옳고 그름을 판단하는 내면의 기준이다.",
        "도덕적 딜레마에서 충분히 고려하고 책임 있게 결정한다.",
        "말과 행동의 일치(성실·정직)가 중요하다.",
        "작은 실천이 습관이 되어 인격을 형성한다.",
      ],
      keywords: ["양심", "책임", "도덕적 판단", "실천"],
      reflections: ["도덕적 딜레mma 경험은?", "말과 행동이 일치할 때는?"],
      quizzes: [
        { question: "도덕적 사람의 특징은?", options: [{ id: "a", text: "말만 하고 행동 안 함" }, { id: "b", text: "가치를 인식하고 실천 노력" }, { id: "c", text: "무조건 거짓" }, { id: "d", text: "타인 권리 무시" }], correctId: "b", explanation: "인식과 실천의 연결이 중요합니다." },
        { question: "양심이란?", options: [{ id: "a", text: "옳고 그름 판단하는 내면 기준" }, { id: "b", text: "법 어기기" }, { id: "c", text: "타인 비하" }, { id: "d", text: "감정만" }], correctId: "a", explanation: "양심은 도덕적 판단의 기준이 됩니다." },
        { question: "도덕적 딜레mma에서?", options: [{ id: "a", text: "가치·결과 고려·책임 결정" }, { id: "b", text: "아무 생각 없이" }, { id: "c", text: "결과 무시" }, { id: "d", text: "전가만" }], correctId: "a", explanation: "신중한 판단과 책임이 필요합니다." },
        { question: "성실·정직이란?", options: [{ id: "a", text: "말과 행동 일치" }, { id: "b", text: "약속 자주 어김" }, { id: "c", text: "진실 숨김" }, { id: "d", text: "공정 불필요" }], correctId: "a", explanation: "일관된 태도가 신뢰를 만듭니다." },
        { question: "작은 실천의 의미는?", options: [{ id: "a", text: "습관·인격 형성" }, { id: "b", text: "중요하지 않음" }, { id: "c", text: "큰 것만" }, { id: "d", text: "실천 불필요" }], correctId: "a", explanation: "일상의 작은 선택이 인격을 만듭니다." },
        { question: "책임 있는 행동이란?", options: [{ id: "a", text: "결과를 인정하고 수습" }, { id: "b", text: "회피만" }, { id: "c", text: "남탓" }, { id: "d", text: "무관심" }], correctId: "a", explanation: "책임은 도덕적 성숙의 표현입니다." },
      ],
    }),
    lesson("e1l3", {
      id: "happiness",
      title: "행복이란 무엇일까?",
      summary: "행복의 의미, 물질·관계·의미, 도덕적 삶과 행복의 관계를 탐구합니다.",
      points: [
        "행복은 개인·문화에 따라 다양하게 이해될 수 있다.",
        "관계·의미·건강·성장 등이 행복과 연결된다.",
        "물질만으로 행복이 보장되지는 않는다.",
        "도덕적·성찰적 삶이 장기적 만족에 기여할 수 있다.",
        "감사·관계·자기 성찰 등이 행복 실천에 도움이 된다.",
      ],
      keywords: ["행복", "의미", "관계", "성찰"],
      reflections: ["나에게 행복은 무엇인가?", "감사할 일 세 가지는?"],
      quizzes: [
        { question: "행복에 대한 바람직한 태도는?", options: [{ id: "a", text: "남과 같은 기준만" }, { id: "b", text: "자신의 가치·관계 고려" }, { id: "c", text: "물질만" }, { id: "d", text: "성찰 불필요" }], correctId: "b", explanation: "행복은 다양한 요소와 개인적 의미를 포함합니다." },
        { question: "행복과 관련 있는 것은?", options: [{ id: "a", text: "관계·의미·건강·성장" }, { id: "b", text: "타인 비하" }, { id: "c", text: "고립만" }, { id: "d", text: "무책임" }], correctId: "a", explanation: "행복은 다면적 개념입니다." },
        { question: "도덕적 삶과 행복은?", options: [{ id: "a", text: "의미·성숙과 연결될 수 있음" }, { id: "b", text: "무관" }, { id: "c", text: "항상 반대" }, { id: "d", text: "물질만" }], correctId: "a", explanation: "가치 있는 삶이 만족과 연결될 수 있습니다." },
        { question: "행복 실천 방법은?", options: [{ id: "a", text: "감사·관계·성찰" }, { id: "b", text: "타인 무시" }, { id: "c", text: "약속 어김" }, { id: "d", text: "환경 파괴" }], correctId: "a", explanation: "일상 실천이 행복에 기여합니다." },
        { question: "물질과 행복의 관계는?", options: [{ id: "a", text: "필요는 있으나 전부는 아님" }, { id: "b", text: "물질만이 행복" }, { id: "c", text: "무관" }, { id: "d", text: "많을수록 항상 행복" }], correctId: "a", explanation: "물질 외 관계·의미도 중요합니다." },
        { question: "타인과의 관계가 행복에?", options: [{ id: "a", text: "중요한 요소" }, { id: "b", text: "불필요" }, { id: "c", text: "해로움만" }, { id: "d", text: "고립이 최고" }], correctId: "a", explanation: "건강한 관계는 행복의 중요한 부분입니다." },
      ],
    }),
  ],
};
