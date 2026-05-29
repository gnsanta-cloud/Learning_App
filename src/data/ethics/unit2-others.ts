import type { Unit } from "../../types";
import { lesson } from "../quizHelpers";

export const unit2Others: Unit = {
  id: "unit2",
  title: "Ⅱ. 타인과의 관계",
  subtitle: "가정 · 우정 · 가상공간",
  textbookRef: "교과서 Ⅱ. 타인과의 관계",
  textbookChapters: ["1. 가정", "2. 우정", "3. 가상공간과 타인"],
  studyGuide: "가정·우정·디지털 예절을 e북 Ⅱ단원에서 읽고 사례를 정리하세요.",
  goals: [
    "가족·친구 관계의 도덕적 책임을 이해한다.",
    "가상공간에서 타인을 존중하는 태도를 설명할 수 있다.",
  ],
  lessons: [
    lesson("e2l1", {
      id: "family",
      title: "가정의 모습은 어떠해야 할까?",
      summary: "가족 관계·역할·갈등 해결·가정폭력 예방과 도덕적 가정을 학습합니다.",
      points: [
        "가정은 사랑·존중·책임·협력을 바탕으로 한다.",
        "세대·의견 차이는 대화와 경청으로 조율할 수 있다.",
        "역할 분담의 고정관념을 넘어 협력하는 가정을 지향한다.",
        "가정폭력은 절대 피해자 잘못이 아니며 도움을 요청해야 한다.",
        "건강한 가정은 구성원의 성장과 안전을 지원한다.",
      ],
      keywords: ["가정", "갈등 해결", "가정폭력", "협력"],
      reflections: ["우리 가정의 좋은 점은?", "갈등을 해결한 경험은?"],
      quizzes: [
        { question: "건강한 가정의 기초는?", options: [{ id: "a", text: "존중·대화·협력" }, { id: "b", text: "감정만 표출" }, { id: "c", text: "갈등 숨김" }, { id: "d", text: "고정관념만" }], correctId: "a", explanation: "존중과 대화가 건강한 가정의 기반입니다." },
        { question: "세대 갈등 해결은?", options: [{ id: "a", text: "차이 인정·경청" }, { id: "b", text: "무조건 옳다고만" }, { id: "c", text: "대화 거부" }, { id: "d", text: "비하" }], correctId: "a", explanation: "경청과 이해가 갈등 해결에 도움이 됩니다." },
        { question: "다양한 가족 형태에?", options: [{ id: "a", text: "존중·편견 없음" }, { id: "b", text: "한 형태만 옳음" }, { id: "c", text: "차별" }, { id: "d", text: "무시" }], correctId: "a", explanation: "가족 형태는 다양하며 존중이 필요합니다." },
        { question: "가정폭력에 대한 이해는?", options: [{ id: "a", text: "피해자 잘못 아님·도움 요청" }, { id: "b", text: "가족이면 괜찮음" }, { id: "c", text: "신고 금지" }, { id: "d", text: "참는 것이 미덕" }], correctId: "a", explanation: "폭력은 참아야 할 일이 아닙니다." },
        { question: "가정에서의 역할은?", options: [{ id: "a", text: "협력·상황에 맞게" }, { id: "b", text: "성별 고정만" }, { id: "c", text: "한 사람만" }, { id: "d", text: "대화 불필요" }], correctId: "a", explanation: "역할은 협력적으로 나눌 수 있습니다." },
        { question: "가족 내 존중이란?", options: [{ id: "a", text: "의견·사생활·감정 존중" }, { id: "b", text: "강요만" }, { id: "c", text: "무시" }, { id: "d", text: "비밀 침해" }], correctId: "a", explanation: "구성원 각자를 존중하는 태도가 필요합니다." },
      ],
    }),
    lesson("e2l2", {
      id: "friendship",
      title: "우정이 소중한 이유는 무엇일까?",
      summary: "우정의 의미, 상호 존중·성장, 또래 압력·거절·학교폭력 대처를 학습합니다.",
      points: [
        "우정은 서로 존중하고 성장을 돕는 관계이다.",
        "진정한 우정은 잘못된 요구를 거절할 수 있다.",
        "경계와 거절의 권리도 관계의 일부이다.",
        "학교폭력·왕따에 방관하지 않고 피해자를 지지한다.",
        "또래 압력 속에서도 스스로 판단하고 도움을 요청한다.",
      ],
      keywords: ["우정", "거절", "학교폭력", "또래 압력"],
      reflections: ["좋은 친구란?", "거절해야 했던 경험은?"],
      quizzes: [
        { question: "바람직한 우정은?", options: [{ id: "a", text: "존중·성장 돕기" }, { id: "b", text: "비밀 무단 유포" }, { id: "c", text: "무조건 강요" }, { id: "d", text: "거절 불가" }], correctId: "a", explanation: "우정은 상호 존중과 성장을 포함합니다." },
        { question: "또래 압력 시?", options: [{ id: "a", text: "스스로 판단·거절·도움" }, { id: "b", text: "무조건 따름" }, { id: "c", text: "위험 행동" }, { id: "d", text: "도움 안 함" }], correctId: "a", explanation: "스스로 판단하고 필요 시 거절합니다." },
        { question: "경계의 의미는?", options: [{ id: "a", text: "권리·공간 존중 선" }, { id: "b", text: "거리 두면 안 됨" }, { id: "c", text: "비밀 모두 공유" }, { id: "d", text: "거절 불가" }], correctId: "a", explanation: "건강한 관계에는 경계가 있습니다." },
        { question: "학교폭력 목격 시?", options: [{ id: "a", text: "방관 안 하고 지지·신고" }, { id: "b", text: "함께 괴롭힘" }, { id: "c", text: "SNS 공개" }, { id: "d", text: "신고 금지" }], correctId: "a", explanation: "피해자를 지지하고 도움을 연결합니다." },
        { question: "우정에서 정직이란?", options: [{ id: "a", text: "진실·약속 지키기" }, { id: "b", text: "거짓말 OK" }, { id: "c", text: "배신" }, { id: "d", text: "무관심" }], correctId: "a", explanation: "신뢰는 정직과 약속 이행에서 나옵니다." },
        { question: "친구의 어려움에?", options: [{ id: "a", text: "경청·공감·도움 연결" }, { id: "b", text: "비난" }, { id: "c", text: "무시" }, { id: "d", text: "유포" }], correctId: "a", explanation: "공감과 적절한 도움이 우정을 지킵니다." },
      ],
    }),
    lesson("e2l3", {
      id: "digital-others",
      title: "가상공간에서 타인을 어떻게 대해야 할까?",
      summary: "디지털 시민성, 사이버 폭력·개인정보·혐오 표현 예방과 책임 있는 소통을 학습합니다.",
      points: [
        "온라인에서도 타인의 인격과 권리를 존중한다.",
        "악성 댓글·사이버 따돌림·몰카·유포는 범죄·폭력이다.",
        "개인정보·사진·연락처를 허락 없이 공유하지 않는다.",
        "디지털 시민성은 온라인에서도 권리·책임·예절을 실천하는 태도이다.",
        "비판적 사고로 정보·혐오 표현을 분별한다.",
      ],
      keywords: ["디지털 시민성", "사이버 폭력", "개인정보", "혐오 표현"],
      reflections: ["온라인에서 지킬 약속은?", "디지털 폭력 목격 시?"],
      quizzes: [
        { question: "가상공간 예절은?", options: [{ id: "a", text: "인격 존중·책임 있는 말" }, { id: "b", text: "익명 모욕" }, { id: "c", text: "정보 무단 공유" }, { id: "d", text: "예절 불필요" }], correctId: "a", explanation: "온라인도 실제 관계와 같이 존중이 필요합니다." },
        { question: "사이버 폭력 예는?", options: [{ id: "a", text: "악성 댓글·따돌림·몰카" }, { id: "b", text: "건전한 채팅" }, { id: "c", text: "출처 표시 인용" }, { id: "d", text: "건전한 게임" }], correctId: "a", explanation: "사이버 폭력은 심각한 피해를 줍니다." },
        { question: "개인정보 보호는?", options: [{ id: "a", text: "허락 없이 공유 금지" }, { id: "b", text: "친구 사진 무단 업로드" }, { id: "c", text: "비밀번호 공유" }, { id: "d", text: "남의 계정 사용" }], correctId: "a", explanation: "개인정보는 권리이며 보호해야 합니다." },
        { question: "디지털 시민성이란?", options: [{ id: "a", text: "온라인 권리·책임·예절 실천" }, { id: "b", text: "규칙은 오프라인만" }, { id: "c", text: "혐오 표현 자유" }, { id: "d", text: "비판 불필요" }], correctId: "a", explanation: "디지털 공간에서도 시민의 책임이 있습니다." },
        { question: "혐오 표현에?", options: [{ id: "a", text: "반대·피해자 지지" }, { id: "b", text: "함께 비난" }, { id: "c", text: "퍼뜨림" }, { id: "d", text: "무관심" }], correctId: "a", explanation: "혐오 표현은 차별과 폭력을 조장합니다." },
        { question: "디지털 정보 이용 시?", options: [{ id: "a", text: "출처·사실·목적 확인" }, { id: "b", text: "무조건 공유" }, { id: "c", text: "가짜 뉴스 유포" }, { id: "d", text: "확인 안 함" }], correctId: "a", explanation: "비판적 정보 확인이 필요합니다." },
      ],
    }),
  ],
};
