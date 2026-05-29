import type { Unit } from "../../types";
import { lesson } from "../quizHelpers";

export const unit5Materials: Unit = {
  id: "unit5",
  title: "Ⅴ. 재료와 설계",
  subtitle: "기술 영역 · 9기가04",
  textbookRef: "교과서 Ⅴ. 재료와 설계",
  textbookChapters: [
    "01. 재료의 선택과 관리",
    "02. 제품 설계와 제작",
  ],
  textbookPages: "p. 172 ~ 211",
  studyGuide:
    "재료 특성·설계·제작·안전을 e북 Ⅴ단원에서 학습하고 실습 전 안전 수칙을 반드시 확인하세요.",
  goals: [
    "재료의 특성과 선택·안전·환경을 고려한 사용을 이해한다.",
    "제품 설계 과정과 제작·평가 방법을 설명할 수 있다.",
  ],
  lessons: [
    lesson("u5l1", {
      id: "materials",
      title: "재료의 이해·선택·안전",
      summary:
        "금속·플라스틱·목재·섬유 등 재료의 특성, 용도별 선택, 안전한 가공·관리, 환경을 학습합니다.",
      points: [
        "재료는 강도·경도·내구성·가공성·환경 영향 등 특성이 다르다.",
        "용도·기능·비용·안전·환경을 고려해 재료를 선택한다.",
        "가공 시 보호구·도구 점검·작업 공간 정리가 필요하다.",
        "재활용·재사용·친환경 재료 선택이 지속 가능성과 연결된다.",
        "MSDS·안전 표시 등 안전 정보를 확인한다.",
      ],
      keywords: ["재료 특성", "재료 선택", "가공 안전", "재활용"],
      reflections: ["일상 제품의 재료는?", "가공·실습 시 지킬 안전 수칙은?"],
      quizzes: [
        { question: "재료 선택 시 고려할 것은?", options: [{ id: "a", text: "용도·강도·가공성·환경·안전" }, { id: "b", text: "색만" }, { id: "c", text: "가장 비싼 것만" }, { id: "d", text: "안전 무관" }], correctId: "a", explanation: "기능·안전·환경을 종합적으로 고려합니다." },
        { question: "목재·금속·플라스틱의 특성은?", options: [{ id: "a", text: "재료마다 강도·가공성 등이 다름" }, { id: "b", text: "모두 같음" }, { id: "c", text: "용도 무관" }, { id: "d", text: "환경 영향 없음" }], correctId: "a", explanation: "재료별 특성을 이해하고 적절히 선택합니다." },
        { question: "가공 안전 수칙은?", options: [{ id: "a", text: "보호구·도구 점검·주변 확인" }, { id: "b", text: "보호구 없이" }, { id: "c", text: "날카로운 면 만지기" }, { id: "d", text: "전선 젖은 손" }], correctId: "a", explanation: "안전 수칙을 지켜 사고를 예방합니다." },
        { question: "친환경 재료·관리는?", options: [{ id: "a", text: "재활용·재사용·분리·절약" }, { id: "b", text: "모두 버림" }, { id: "c", text: "일회용만" }, { id: "d", text: "환경 무관" }], correctId: "a", explanation: "재료 사용·폐기도 환경과 연결됩니다." },
        { question: "재료의 3R은?", options: [{ id: "a", text: "Reduce·Reuse·Recycle" }, { id: "b", text: "Read·Write·Run" }, { id: "c", text: "Random·Repeat·Remove" }, { id: "d", text: "재료와 무관" }], correctId: "a", explanation: "줄이기·재사용·재활용이 지속 가능한 재료 관리입니다." },
        { question: "안전 정보 확인 방법은?", options: [{ id: "a", text: "안전 표시·지도·교사 안내" }, { id: "b", text: "확인 안 함" }, { id: "c", text: "추측만" }, { id: "d", text: "규칙 무시" }], correctId: "a", explanation: "안전 정보를 확인하고 지켜야 합니다." },
      ],
    }),
    lesson("u5l2", {
      id: "design-making",
      title: "제품 설계·제작·평가",
      summary:
        "설계도·스케치·3D 개념, 설계 요구사항, 제작·조립·마감, 완성품 평가와 개선을 학습합니다.",
      points: [
        "설계는 사용자·기능·안전·미적 요소를 반영한다.",
        "스케치·설계도·축척·치수 표현으로 아이디어를 구체화한다.",
        "제작은 계획·순서·도구·재료를 준비하고 안전하게 수행한다.",
        "완성품은 기능·안전·완성도·사용성·개선점을 평가한다.",
        "사용자 피드백을 반영해 설계를 개선(반복 설계)한다.",
      ],
      keywords: ["설계도", "제작", "평가", "반복 설계"],
      reflections: ["설계 시 가장 중요하게 볼 기준은?", "개선하고 싶은 제품은?"],
      quizzes: [
        { question: "제품 설계에 반영할 것은?", options: [{ id: "a", text: "사용자·기능·안전·미적 요소" }, { id: "b", text: "색만" }, { id: "c", text: "안전 무시" }, { id: "d", text: "기능 무관" }], correctId: "a", explanation: "설계는 다양한 요구를 종합합니다." },
        { question: "설계도에 포함될 수 있는 것은?", options: [{ id: "a", text: "치수·축척·구조" }, { id: "b", text: "그림만" }, { id: "c", text: "색만" }, { id: "d", text: "치수 불필요" }], correctId: "a", explanation: "정확한 치수와 구조 표현이 제작에 필요합니다." },
        { question: "제작 전 준비는?", options: [{ id: "a", text: "계획·재료·도구·안전 확인" }, { id: "b", text: "준비 없이 시작" }, { id: "c", text: "도구 무점검" }, { id: "d", text: "순서 무시" }], correctId: "a", explanation: "체계적 준비가 안전하고 효율적입니다." },
        { question: "완성품 평가 기준은?", options: [{ id: "a", text: "기능·안전·완성도·사용성" }, { id: "b", text: "만들었으면 끝" }, { id: "c", text: "피드백 무시" }, { id: "d", text: "개선 안 함" }], correctId: "a", explanation: "다각도 평가로 품질을 높입니다." },
        { question: "반복 설계란?", options: [{ id: "a", text: "평가 후 개선을 반복" }, { id: "b", text: "한 번만 만듦" }, { id: "c", text: "평가 생략" }, { id: "d", text: "사용자 무시" }], correctId: "a", explanation: "개선을 반복하며 더 나은 제품을 만듭니다." },
        { question: "사용자 중심 설계란?", options: [{ id: "a", text: "사용자 needs·편의·안전 고려" }, { id: "b", text: "제작자만 편하면 됨" }, { id: "c", text: "기능 불필요" }, { id: "d", text: "피드백 거부" }], correctId: "a", explanation: "사용자 관점이 설계의 출발점입니다." },
      ],
    }),
  ],
};
