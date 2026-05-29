import type { Unit } from "../../types";
import { lesson } from "../quizHelpers";

export const unit3Society: Unit = {
  id: "unit3",
  title: "Ⅲ. 사회·공동체와의 관계",
  subtitle: "인권 · 문화 · 통일",
  textbookRef: "교과서 Ⅲ. 사회·공동체와의 관계",
  textbookChapters: ["1. 인권", "2. 문화·종교와 공존", "3. 통일"],
  studyGuide: "인권·다문화·통일을 e북 Ⅲ단원에서 읽고 쟁점 토론 자료와 연결하세요.",
  goals: [
    "인권의 보편성과 차별 반대를 이해한다.",
    "문화·종교 다양성 속 공존과 통일의 가치를 설명할 수 있다.",
  ],
  lessons: [
    lesson("e3l1", {
      id: "human-rights",
      title: "인권은 보편적 가치일까?",
      summary: "인권의 의미·보편성·아동·장애·성별 등 차별 금지와 인권 실천을 학습합니다.",
      points: [
        "인권은 모든 사람이 존엄하게 살 권리이다.",
        "인권은 보편적·不可分·상호依存적이다.",
        "차별(성·장애·인종·종교 등)은 인권 침해이다.",
        "아동·청소년도 의견 표현·학대·폭력으로부터 보호받는다.",
        "인권 침해에 관심·참여·지지로 대응할 수 있다.",
      ],
      keywords: ["인권", "차별", "아동 권리", "존엄"],
      reflections: ["일상에서 본 차별 사례는?", "인권을 지키기 위해 할 일은?"],
      quizzes: [
        { question: "인권의 의미는?", options: [{ id: "a", text: "특정 집단만" }, { id: "b", text: "모든 사람 존엄·권리" }, { id: "c", text: "나이에 따라 없음" }, { id: "d", text: "법과 무관" }], correctId: "b", explanation: "인권은 모든 사람에게 적용됩니다." },
        { question: "차별에 대한 태도는?", options: [{ id: "a", text: "인식·반대" }, { id: "b", text: "방관" }, { id: "c", text: "장려" }, { id: "d", text: "피해자 비난" }], correctId: "a", explanation: "차별을 인식하고 반대하는 것이 중요합니다." },
        { question: "아동·청소년 인권은?", options: [{ id: "a", text: "의견·보호·학대 예방" }, { id: "b", text: "어른만 해당" }, { id: "c", text: "학대는 가정 문제" }, { id: "d", text: "의견 불필요" }], correctId: "a", explanation: "아동도 인권의 주체입니다." },
        { question: "인권 침해 목격 시?", options: [{ id: "a", text: "관심·참여·지지" }, { id: "b", text: "무관심" }, { id: "c", text: "방관" }, { id: "d", text: "법 불필요" }], correctId: "a", explanation: "적극적 관심과 지지가 필요합니다." },
        { question: "인권과 평등은?", options: [{ id: "a", text: "차별 없이 동등한 존중" }, { id: "b", text: "일부만" }, { id: "c", text: "형식만" }, { id: "d", text: "무관" }], correctId: "a", explanation: "평등과 존중은 인권의 핵심입니다." },
        { question: "장애·성별 등 차별은?", options: [{ id: "a", text: "인권 침해" }, { id: "b", text: "자연스러움" }, { id: "c", text: "문제 아님" }, { id: "d", text: "허용" }], correctId: "a", explanation: "어떤 이유로도 차별은 정당화되지 않습니다." },
      ],
    }),
    lesson("e3l2", {
      id: "culture-religion",
      title: "다양한 문화·종교는 어떻게 공존할 수 있을까?",
      summary: "다문화·종교 다양성, 편견·혐오, 문화 상대주의와 인권, 공동체 참여를 학습합니다.",
      points: [
        "문화·종교는 다양하며 차이를 인정하고 존중한다.",
        "문화 상대주의는 맥락 속 이해이나 인권 침해는 정당화되지 않는다.",
        "편견·고정관념·혐오 표현을 비판하고 피해자를 지지한다.",
        "대화·참여·배려가 다문화 공동체를 만든다.",
        "지역·학교·사회에서 공존 실천이 가능하다.",
      ],
      keywords: ["다문화", "공존", "편견", "문화 상대주의"],
      reflections: ["다른 문화를 존중한 경험은?", "혐오 표현을 본 적 있는가?"],
      quizzes: [
        { question: "문화·종교 다양성에?", options: [{ id: "a", text: "차이 인정·상호 존중" }, { id: "b", text: "무조건 배척" }, { id: "c", text: "대화 불필요" }, { id: "d", text: "고정관념 강화" }], correctId: "a", explanation: "다양성 속 존중이 공존의 기초입니다." },
        { question: "문화 상대주의란?", options: [{ id: "a", text: "맥락 속 이해 태도" }, { id: "b", text: "모든 관습 옳음" }, { id: "c", text: "인권 부정" }, { id: "d", text: "편견 강화" }], correctId: "a", explanation: "이해와 존중이지만 인권 침해는 용납되지 않습니다." },
        { question: "혐오·차별 목격 시?", options: [{ id: "a", text: "반대·피해자 지지" }, { id: "b", text: "함께 비난" }, { id: "c", text: "퍼뜨림" }, { id: "d", text: "무관심" }], correctId: "a", explanation: "혐오에 적극적으로 대응합니다." },
        { question: "다문화 공동체 실천은?", options: [{ id: "a", text: "배려·존중·참여" }, { id: "b", text: "고립·배제" }, { id: "c", text: "편견" }, { id: "d", text: "대화 거부" }], correctId: "a", explanation: "일상에서 공존을 실천할 수 있습니다." },
        { question: "종교·문화 차이 대화는?", options: [{ id: "a", text: "경청·존중·학습" }, { id: "b", text: "무조건 옳다고만" }, { id: "c", text: "비하" }, { id: "d", text: "금지" }], correctId: "a", explanation: "대화와 학습이 이해를 돕습니다." },
        { question: "편견을 줄이려면?", options: [{ id: "a", text: "접촉·정보·비판적 사고" }, { id: "b", text: "고정관념 유지" }, { id: "c", text: "대화 거부" }, { id: "d", text: "차별" }], correctId: "a", explanation: "경험과 정보가 편견을 줄입니다." },
      ],
    }),
    lesson("e3l3", {
      id: "unification",
      title: "통일은 어떤 의미와 가치가 있을까?",
      summary: "분단·통일의 의미, 평화·인권·공동 번영, 청소년의 역할을 학습합니다.",
      points: [
        "통일은 평화·인권·공동 번영과 연결된 민족·국가적 과제이다.",
        "역사·현실을 이해하고 평화적·비폭력적 해결을 지향한다.",
        "남북 주민 모두의 인권과 존중이 중요하다.",
        "대화·이해·신뢰가 통일의 기반이 될 수 있다.",
        "청소년도 역사 학습·평화·인권 관점에서 관심을 가질 수 있다.",
      ],
      keywords: ["통일", "평화", "인권", "분단"],
      reflections: ["통일이 중요하다고 생각하는 이유는?", "평화를 위해 할 수 있는 일은?"],
      quizzes: [
        { question: "통일 논의 시 필요한 것은?", options: [{ id: "a", text: "역사·현실 이해·평화적 해결" }, { id: "b", text: "역사 불필요" }, { id: "c", text: "힘으로만" }, { id: "d", text: "상대 부정" }], correctId: "a", explanation: "역사와 평화적 관점이 필요합니다." },
        { question: "통일의 가치로 적절한 것은?", options: [{ id: "a", text: "평화·공동 번영·인권" }, { id: "b", text: "전쟁 승리만" }, { id: "c", text: "차별" }, { id: "d", text: "고립" }], correctId: "a", explanation: "평화와 인권이 통일 논의의 기반입니다." },
        { question: "남북 관계에서?", options: [{ id: "a", text: "이해·신뢰·대화" }, { id: "b", text: "대결만" }, { id: "c", text: "역사 무관" }, { id: "d", text: "청소년 무관" }], correctId: "a", explanation: "이해와 신뢰 구축이 중요합니다." },
        { question: "통일과 인권은?", options: [{ id: "a", text: "모든 주민 존중·권리" }, { id: "b", text: "일부만" }, { id: "c", text: "무관" }, { id: "d", text: "억압" }], correctId: "a", explanation: "인권 존중이 통일의 도덕적 기반입니다." },
        { question: "청소년의 역할은?", options: [{ id: "a", text: "역사·평화·인권 학습·관심" }, { id: "b", text: "무관심" }, { id: "c", text: "혐오 조장" }, { id: "d", text: "정보 차단" }], correctId: "a", explanation: "미래 세대의 관심과 학습이 중요합니다." },
        { question: "평화적 통일 지향이란?", options: [{ id: "a", text: "대화·비폭력·인권 존중" }, { id: "b", text: "적대만" }, { id: "c", text: "역사 왜곡" }, { id: "d", text: "폭력" }], correctId: "a", explanation: "비폭력과 대화가 바람직한 방향입니다." },
      ],
    }),
  ],
};
