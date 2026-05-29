import type { Unit } from "../../types";
import { lesson } from "../quizHelpers";

export const unit4Nature: Unit = {
  id: "unit4",
  title: "Ⅳ. 자연과의 관계",
  subtitle: "환경 · 생명 · 책임",
  textbookRef: "교과서 Ⅳ. 자연과의 관계",
  textbookChapters: [
    "1. 도덕적 고려의 대상은 어디까지일까?",
    "2. 환경·생명·지속 가능한 실천",
  ],
  studyGuide: "환경 윤리·생명·미래 세대 책임을 e북 Ⅳ단원에서 탐구하세요.",
  goals: [
    "자연·환경·동물을 도덕적 고려 대상으로 이해한다.",
    "지속 가능한 삶과 환경 윤리를 실천 방안과 연결한다.",
  ],
  lessons: [
    lesson("e4l1", {
      id: "moral-scope",
      title: "도덕적 고려의 대상은 어디까지일까?",
      summary: "환경·동물·미래 세대에 대한 도덕적 책임, 생명 존중, 도덕 공동체의 확장을 학습합니다.",
      points: [
        "도덕적 고려 대상은 인간에서 자연·동물·미래 세대로 확장될 수 있다.",
        "환경 문제는 개인·사회·국제적 책임과 연결된다.",
        "생명 존중은 동물·생태계 대우와도 관련된다.",
        "소비·에너지·쓰레기 등 일상 선택이 환경에 영향을 준다.",
        "환경 윤리는 ‘누구를 위해, 무엇을 남길 것인가’를 묻는다.",
      ],
      keywords: ["환경 윤리", "생명 존중", "미래 세대", "도덕적 책임"],
      reflections: ["도덕적 대상으로 자연을 포함해야 할까?", "미래 세대에게 남길 것은?"],
      quizzes: [
        { question: "환경·미래 세대에 대한 태도는?", options: [{ id: "a", text: "무한 이용" }, { id: "b", text: "미래 세대·환경 고려" }, { id: "c", text: "동물은 대상 아님" }, { id: "d", text: "소비만" }], correctId: "b", explanation: "미래 세대와 환경을 고려하는 것이 환경 윤리입니다." },
        { question: "지속 가능한 선택은?", options: [{ id: "a", text: "일회용 남용" }, { id: "b", text: "자원 절약·재활용" }, { id: "c", text: "환경과 무관" }, { id: "d", text: "분리배출 안 함" }], correctId: "b", explanation: "절약과 재활용이 지속 가능성에 기여합니다." },
        { question: "환경 윤리의 질문은?", options: [{ id: "a", text: "누구를 위해·무엇을 남길 것인가" }, { id: "b", text: "이익만" }, { id: "c", text: "법만" }, { id: "d", text: "기술만" }], correctId: "a", explanation: "환경 윤리는 책임과 미래를 묻습니다." },
        { question: "생명 존중이란?", options: [{ id: "a", text: "동물·생태 책임 있는 대우" }, { id: "b", text: "학대 방관" }, { id: "c", text: "유기 장려" }, { id: "d", text: "생태 무관" }], correctId: "a", explanation: "생명은 도덕적 고려의 대상이 될 수 있습니다." },
        { question: "환경 문제와 개인은?", options: [{ id: "a", text: "일상 선택과 연결" }, { id: "b", text: "무관" }, { id: "c", text: "국가만" }, { id: "d", text: "기업만" }], correctId: "a", explanation: "개인의 선택도 환경에 영향을 줍니다." },
        { question: "도덕 공동체 확장이란?", options: [{ id: "a", text: "인간 너머 자연·미래 포함" }, { id: "b", text: "인간만" }, { id: "c", text: "동물 배제" }, { id: "d", text: "미래 무시" }], correctId: "a", explanation: "도덕적 대상이 확장될 수 있습니다." },
      ],
    }),
    lesson("e4l2", {
      id: "eco-practice",
      title: "환경·생명·지속 가능한 실천",
      summary: "기후·생태 위기, 탄소·에너지·소비 실천, 생태 전환과 시민 참여를 학습합니다.",
      points: [
        "기후 변화·생태 파괴는 도덕적·사회적 문제이다.",
        "에너지 절약·대중교통·재활용·로컬 소비 등 실천이 가능하다.",
        "환경 정의는 취약 계층·지역에 더 큰 피해가 갈 수 있음을 본다.",
        "학교·지역·가정에서 캠페인·프로젝트로 참여할 수 있다.",
        "작은 실천의 누적이 생태 전환에 기여한다.",
      ],
      keywords: ["기후", "생태 전환", "시민 참여", "환경 실천"],
      reflections: ["이번 주 실천할 환경 행동은?", "학교·지역에서 할 수 있는 일은?"],
      quizzes: [
        { question: "환경 실천 예는?", options: [{ id: "a", text: "에너지 절약·재활용·대중교통" }, { id: "b", text: "낭비" }, { id: "c", text: "관심 없음" }, { id: "d", text: "미래 무시" }], correctId: "a", explanation: "일상에서 환경 실천이 가능합니다." },
        { question: "기후·생태 위기는?", options: [{ id: "a", text: "도덕·사회적 문제" }, { id: "b", text: "개인과 무관" }, { id: "c", text: "미래만" }, { id: "d", text: "기술만 해결" }], correctId: "a", explanation: "환경은 도덕적 책임과 연결됩니다." },
        { question: "환경 정의란?", options: [{ id: "a", text: "취약 계층·지역 피해 고려" }, { id: "b", text: "모두 같음" }, { id: "c", text: "무관" }, { id: "d", text: "피해 무시" }], correctId: "a", explanation: "환경 피해는 불평등하게 나타날 수 있습니다." },
        { question: "시민 참여 방법은?", options: [{ id: "a", text: "캠페인·프로젝트·교육" }, { id: "b", text: "무관심" }, { id: "c", text: "낭비" }, { id: "d", text: "파괴" }], correctId: "a", explanation: "학교·지역에서 참여할 수 있습니다." },
        { question: "생태 전환이란?", options: [{ id: "a", text: "지속 가능한 사회·경제·생활 전환" }, { id: "b", text: "소비만 증가" }, { id: "c", text: "환경 무시" }, { id: "d", text: "일회용" }], correctId: "a", explanation: "생태 전환은 지속 가능성을 목표로 합니다." },
        { question: "작은 실천의 의미는?", options: [{ id: "a", text: "누적·습관·공동체 변화" }, { id: "b", text: "중요 없음" }, { id: "c", text: "큰 것만" }, { id: "d", text: "실천 불필요" }], correctId: "a", explanation: "작은 실천이 모여 변화를 만듭니다." },
      ],
    }),
  ],
};
