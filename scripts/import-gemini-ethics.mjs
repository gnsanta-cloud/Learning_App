/**
 * 도덕 Gemini MD → data/ethics/*.json
 * Usage: node scripts/import-gemini-ethics.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const MD_PATH = process.env.GEMINI_MD_PATH
  ? path.isAbsolute(process.env.GEMINI_MD_PATH)
    ? process.env.GEMINI_MD_PATH
    : path.join(ROOT, process.env.GEMINI_MD_PATH)
  : path.join(ROOT, "docs", "gemini-code-1780040427395.md");

const CIRCLED = ["①", "②", "③", "④", "⑤", "⑥"];
const OUT_DIR = path.join(ROOT, "data", "ethics");

const CHOICE_IDS = ["a", "b", "c", "d"];

const UNIT_META = [
  {
    id: "unit1",
    title: "Ⅰ. 자신과의 관계",
    subtitle: "도덕 ① · 나는 어떤 사람인가",
    textbookRef: "교과서 Ⅰ. 자신과의 관계",
    textbookPages: "p. 8 ~ 59",
    questionOrders: [1, 2, 8, 11, 13, 20],
  },
  {
    id: "unit2",
    title: "Ⅱ. 타인과의 관계",
    subtitle: "도덕 ① · 가족·우정·이웃",
    textbookRef: "교과서 Ⅱ. 타인과의 관계",
    textbookPages: "p. 60 ~ 119",
    questionOrders: [3, 4, 6, 14, 18],
  },
  {
    id: "unit3",
    title: "Ⅲ. 사회·공동체와의 관계",
    subtitle: "도덕 ① · 인권·정의·사이버 윤리",
    textbookRef: "교과서 Ⅲ. 사회·공동체와의 관계",
    textbookPages: "p. 120 ~ 175",
    questionOrders: [5, 7, 9, 12, 15, 16],
  },
  {
    id: "unit4",
    title: "Ⅳ. 자연·초월과의 관계",
    subtitle: "도덕 ① · 환경 윤리·과학기술",
    textbookRef: "교과서 Ⅳ. 자연·초월과의 관계",
    textbookPages: "p. 176 ~ 216",
    questionOrders: [10, 17, 19],
  },
];

/** 서술형·단답형 → 4지선다 변환 (앱 호환) */
const MC_BANK = {
  1: {
    question:
      "인간이 동물과 구별되는 특징으로, 자신의 삶을 스스로 돌아보고 무엇이 옳고 그른지 이성적으로 생각하여 행동하는 능력은?",
    options: [
      "도덕성",
      "본능",
      "감각",
      "습관",
    ],
    correct: 0,
    explanation:
      "인간은 본능에만 따르지 않고 도덕적 규범에 따라 행동할 수 있는 도덕성을 지닙니다.",
  },
  2: {
    question:
      "유교에서 강조하는 성찰의 자세로, 매일 세 가지 행동을 스스로 돌아보고 점검하는 방법을 뜻하는 사자성어는?",
    options: ["일일삼성", "일심동체", "일석이조", "일거양득"],
    correct: 0,
    explanation:
      "하루에 세 번씩 자신을 반성하여 올바른 마음가짐을 유지하려는 태도입니다.",
  },
  3: {
    question: "다음 중 참된 우정에 대한 설명으로 가장 적절하지 않은 것은?",
    options: [
      "친구의 잘못된 행동에 대해서는 예의를 갖추어 올바르게 충고한다.",
      "친구가 어려움에 처했을 때 대가를 바라지 않고 진심으로 돕는다.",
      "친구와 더 친해지기 위해 친구가 규칙을 어기는 행동을 해도 무조건 동조한다.",
      "서로의 생각이나 성격이 다르더라도 차이를 인정하고 존중한다.",
    ],
    correct: 2,
    explanation:
      "친구의 잘못이나 도덕적이지 못한 행동에 무조건 동조하는 것은 참된 우정이 아닙니다.",
  },
  4: {
    question:
      "타인의 처지나 감정을 마치 나의 일처럼 느끼고 깊이 이해하는 감정적 능력은?",
    options: ["공감", "동조", "편견", "무관심"],
    correct: 0,
    explanation:
      "상대방의 입장에서 생각하는 역지사지의 자세와 공감은 도덕적 행동의 출발점입니다.",
  },
  5: {
    question:
      "인간은 누구나 태어나면서부터 인간답게 살 권리를 가지는데, 이를 무엇이라 하는가? (국가나 타인이 함부로 침해할 수 없는 절대적 권리)",
    options: ["인권", "의무", "특권", "관습"],
    correct: 0,
    explanation: "인권은 천부인권으로서 인간 존엄성의 핵심 가치입니다.",
  },
  6: {
    question:
      "현대 사회에서 아파트 등 공동 주택의 이웃 간 소통 부족과 배려 부족으로 인해 가장 자주 발생하는 갈등 문제는?",
    options: ["층간 소음", "주차 분쟁", "엘리베이터 예절", "분리수거"],
    correct: 0,
    explanation:
      "공동생활 공간에서는 타인을 배려하는 소음 저감 노력과 이웃 간의 소통이 필요합니다.",
  },
  7: {
    question: "다음 중 '사이버 공간'의 특징으로 올바르지 않은 것은?",
    options: [
      "자신의 신분을 감출 수 있는 익명성을 지닌다.",
      "시공간의 제약을 받지 않고 실시간으로 소통할 수 있다.",
      "글이나 사진이 순식간에 퍼지는 높은 전파성을 가지고 있다.",
      "대면 상태가 아니므로 현실 세계의 도덕 규칙을 지킬 필요가 없다.",
    ],
    correct: 3,
    explanation:
      "비대면 공간일수록 타인에게 상처를 주지 않기 위한 사이버 예절(네티켓)이 더욱 요구됩니다.",
  },
  8: {
    question:
      "맹자가 제시한 사덕(인·의·예·지) 중, 불쌍하고 가엾은 사람을 보면 참지 못하고 측은하게 여기는 마음(측은지심)과 연결된 덕목은?",
    options: ["인(仁)", "의(義)", "예(禮)", "지(智)"],
    correct: 0,
    explanation: "'인(仁)'은 타인을 사랑하고 가엾게 여기는 도덕적 마음씨를 뜻합니다.",
  },
  9: {
    question:
      "사회 구성원들에게 합당한 몫을 공평하게 나누어 주고, 억울함이 없도록 올바르게 대우하는 사회적 기준과 가치는?",
    options: ["정의", "자유", "효율", "전통"],
    correct: 0,
    explanation:
      "정의로운 사회는 모든 구성원의 권리를 공정하게 보장하는 사회입니다.",
  },
  10: {
    question:
      "자연을 인간의 이익과 편리함을 얻기 위한 수단이나 재료로만 바라보는 환경 관점은?",
    options: [
      "인간 중심주의",
      "생태 중심주의",
      "공존주의",
      "순환 경제",
    ],
    correct: 0,
    explanation:
      "인간 중심주의는 자연을 인간의 지배 대상으로 보아 환경 파괴를 정당화할 우려가 있습니다.",
  },
  11: {
    question: "바람직한 '자아 정체성'을 형성하기 위한 태도로 가장 올바른 것은?",
    options: [
      "타인의 시선과 유행에만 전적으로 의존하여 나를 평가한다.",
      "나의 장점뿐만 아니라 단점까지도 객관적으로 수용하고 개선하려 노력한다.",
      "완벽하지 못한 내 모습을 부끄러워하며 스스로를 비난한다.",
      "과거의 실수에만 얽매여 새로운 도전을 두려워한다.",
    ],
    correct: 1,
    explanation:
      "긍정적이고 건강한 자아 정체성은 자신을 온전히 이해하고 수용하는 것에서 시작됩니다.",
  },
  12: {
    question:
      "정보 사회에서 인터넷에 게시된 음악, 글, 사진 등 타인의 창작물이나 아이디어를 보호하기 위해 법적으로 인정하는 권리는?",
    options: ["저작권", "특허권", "상표권", "재산권"],
    correct: 0,
    explanation:
      "타인의 직접적인 노력의 산물인 저작권을 존중하고 무단 도용하지 않아야 합니다.",
  },
  13: {
    question:
      "우리가 매일 '도덕적 성찰'을 해야 하는 이유로 가장 적절한 설명은?",
    options: [
      "잘못을 반성하고 올바른 도덕적 기준을 확립해 인격을 성장시키기 위해",
      "타인의 잘못만 찾아 비판하기 위해",
      "도덕 규범을 피하기 위해",
      "감정을 억누르지 않고 즉흥적으로 행동하기 위해",
    ],
    correct: 0,
    explanation:
      "도덕적 성찰을 통해 자신의 잘못된 행동을 스스로 반성하고 올바른 도덕적 기준을 확립함으로써, 더 성숙한 인격을 가진 사람으로 성장할 수 있습니다.",
  },
  14: {
    question: "친구 관계에서 전통적으로 강조된 '책선(責善)'의 의미로 옳은 것은?",
    options: [
      "친구에게 착한 일을 권하고 잘못을 부드럽게 타이르는 것",
      "친구의 잘못을 모른 척하고 무조건 옹호하는 것",
      "친구보다 경쟁에서 이기는 것",
      "친구의 비밀을 다른 사람에게 알리는 것",
    ],
    correct: 0,
    explanation:
      "책선은 친구에게 착한 일을 권하고 잘못을 부드럽게 타이르는 것을 말하며, 서로의 도덕적 성장을 돕는 참된 우정의 행동입니다.",
  },
  15: {
    question:
      "사이버 공간의 '익명성'이 유발할 수 있는 문제와 이를 예방하기 위한 올바른 자세로 가장 적절한 것은?",
    options: [
      "악성 댓글·허위 유포가 생길 수 있으므로, 얼굴이 보이지 않아도 상대를 존중해야 한다",
      "익명이므로 어떤 말도 해도 책임이 없다",
      "익명이면 사생활을 마음대로 공유해도 된다",
      "익명이면 저작권을 지킬 필요가 없다",
    ],
    correct: 0,
    explanation:
      "익명성 뒤에 숨어 타인에게 악성 댓글을 달거나 허위 사실을 유포하는 문제가 생길 수 있으므로, 얼굴이 보이지 않는 곳에서도 상대방을 존중하는 책임감을 가져야 합니다.",
  },
  16: {
    question:
      "'장애인 전용 주차구역'이나 '사회적 약자 배려 전형'이 사회 정의에 부합하는 이유는?",
    options: [
      "약자를 배려해 실질적인 기회의 공정함을 보장하기 위해",
      "강자만 유리하도록 하기 위해",
      "모든 사람에게 똑같은 대우만 하기 위해",
      "규칙을 어기는 사람을 보호하기 위해",
    ],
    correct: 0,
    explanation:
      "신체적·사회적 조건이 다른 사람들에게 기계적인 평등만 적용하는 것은 오히려 불평등할 수 있으므로, 약자를 배려하여 실질적인 기회의 공정함을 보장하기 위함입니다.",
  },
  17: {
    question:
      "'생태 중심주의 환경관'이 기후 변화·환경 오염 해결에 도움이 되는 이유는?",
    options: [
      "인간을 자연의 지배자가 아닌 생태계의 일원으로 보아 공존·상생을 추구하기 위해",
      "자연을 인간의 재화로만 보기 위해",
      "환경 보호를 경제 성장보다 무조건 억제하기 위해",
      "기술 발전을 모두 중단하기 위해",
    ],
    correct: 0,
    explanation:
      "인간을 자연의 지배자가 아닌 생태계의 평등한 일원으로 바라보게 하여, 자연을 훼손하지 않고 모든 생명체와 공존·상생하는 태도를 갖게 합니다.",
  },
  18: {
    question:
      "부모님께 물질적인 풍요만으로 효도(孝)가 완성되지 않는 이유는?",
    options: [
      "진심으로 공경하고 사랑하는 마음과 정신적 배려가 함께해야 하기 때문",
      "물질적 봉양은 전혀 필요 없기 때문",
      "부모님의 말씀을 따르지 않아도 되기 때문",
      "형제자매보다 친구가 더 중요하기 때문",
    ],
    correct: 0,
    explanation:
      "참된 효도는 물질적인 봉양뿐만 아니라 부모님을 진심으로 공경하고 사랑하는 마음(경애)과 부모님의 마음을 편안하게 해 드리는 정신적 배려가 동반되어야 합니다.",
  },
  19: {
    question:
      "과학 기술 발전에 반드시 '도덕적 성찰과 평가'가 함께되어야 하는 이유는?",
    options: [
      "무기 개발·생명 경시 등 도덕적 통제 없는 기술이 큰 재앙을 초래할 수 있기 때문",
      "기술은 항상 해로우므로 사용을 금해야 하기 때문",
      "도덕보다 기술이 항상 우선이기 때문",
      "과학 실험은 모두 불법이기 때문",
    ],
    correct: 0,
    explanation:
      "도덕적 통제 없이 기술만 발전할 경우, 무기 개발로 인한 인류 위협이나 유전자 조작으로 인한 생명 경시 등 큰 재앙을 초래할 수 있습니다.",
  },
  20: {
    question:
      "도덕적 갈등 상황에서 '도덕적 추론'이 필요한 이유로 가장 적절한 것은?",
    options: [
      "감정·편견에 치우친 잘못된 판단을 피하고 공정하게 해결하기 위해",
      "갈등을 회피하고 무관심하게 지내기 위해",
      "자신의 감정만 우선하기 위해",
      "타인을 비난하는 것이 목적이기 때문",
    ],
    correct: 0,
    explanation:
      "순간적인 감정이나 편견에 치우치면 잘못된 판단을 내려 타인에게 피해를 줄 수 있으므로, 갈등을 합리적이고 공정하게 해결하기 위해 필요합니다.",
  },
};

function extractKeywords(text) {
  const matches = text.match(/\*\*([^*]+)\*\*/g);
  if (!matches) return [];
  return [...new Set(matches.map((m) => m.slice(2, -2).trim()))].slice(0, 12);
}

function parseField(line, field) {
  const re = new RegExp(`\\*\\*${field}:\\*\\*\\s*(.+)`);
  const m = line.match(re);
  return m ? m[1].trim() : null;
}

function parseChoices(line) {
  const parts = line.replace(/^\*\s+\*\*선지:\*\*\s*/, "").split(/\s*\/\s*/);
  return parts.map((part, i) => {
    const trimmed = part.trim();
    const circled = CIRCLED.find((c) => trimmed.startsWith(c));
    let text = trimmed;
    if (circled) text = trimmed.slice(circled.length).trim();
    return { id: CHOICE_IDS[i] ?? `opt${i}`, text };
  });
}

function parseCorrectAnswer(line) {
  const m = line.match(/\*\*정답:\*\*\s*(.+)/);
  if (!m) return null;
  const raw = m[1].trim();
  const idx = CIRCLED.indexOf(raw);
  if (idx >= 0) return CHOICE_IDS[idx];
  const num = Number(raw);
  if (num >= 1 && num <= 4) return CHOICE_IDS[num - 1];
  return null;
}

/** PART 2 flat Q01~Q20 (tech-home 형식) */
function parsePart2Flat(md) {
  const part2 = md.split("## PART 2.")[1] ?? "";
  const lines = part2.split("\n");
  const blocks = [];
  let currentQ = null;

  for (const line of lines) {
    const inline = line.match(/^### Q(\d+)\.\s+(.+)/);
    if (inline) {
      if (currentQ) blocks.push(currentQ);
      currentQ = {
        order: Number(inline[1]),
        fields: [`*   **발문:** ${inline[2].trim()}`],
      };
      continue;
    }
    const head = line.match(/^### Q(\d+)$/);
    if (head) {
      if (currentQ) blocks.push(currentQ);
      currentQ = { order: Number(head[1]), fields: [] };
      continue;
    }
    if (currentQ && line.startsWith("*")) {
      currentQ.fields.push(line);
    }
  }
  if (currentQ) blocks.push(currentQ);
  return blocks;
}

function questionFromBlock(block, unitId) {
  const stemLine = block.fields.find((f) => f.includes("**발문:**"));
  const choiceLine = block.fields.find((f) => f.includes("**선지:**"));
  const answerLine = block.fields.find((f) => f.includes("**정답:**"));
  const explainLine = block.fields.find((f) => f.includes("**해설:**"));

  return {
    id: `${unitId}-q${String(block.order).padStart(2, "0")}`,
    unitId,
    order: block.order,
    question: parseField(stemLine ?? "", "발문") ?? "",
    options: parseChoices(choiceLine ?? ""),
    correctId: parseCorrectAnswer(answerLine ?? "") ?? "a",
    explanation: parseField(explainLine ?? "", "해설") ?? "",
    tags: extractKeywords(
      (parseField(stemLine ?? "", "발문") ?? "") +
        (parseField(explainLine ?? "", "해설") ?? "")
    ),
  };
}

function parsePart1(md) {
  const part1 = md.split("## PART 2.")[0];
  const units = [];
  let current = null;

  for (const line of part1.split("\n")) {
    const unitMatch = line.match(/^### 단원 (\d+)\.\s+(.+)$/);
    if (unitMatch) {
      if (current) units.push(current);
      current = {
        order: Number(unitMatch[1]),
        title: `단원 ${unitMatch[1]}. ${unitMatch[2].trim()}`,
        bullets: [],
      };
      continue;
    }
    const bullet = line.match(/^\*\s+(.+)$/);
    if (bullet && current) {
      current.bullets.push(bullet[1].trim());
    }
  }
  if (current) units.push(current);
  return units;
}

function toQuestion(order, unitId) {
  const bank = MC_BANK[order];
  if (!bank) throw new Error(`Missing MC_BANK for Q${order}`);
  const options = bank.options.map((text, i) => ({
    id: CHOICE_IDS[i],
    text,
  }));
  return {
    id: `${unitId}-q${String(order).padStart(2, "0")}`,
    unitId,
    order,
    question: bank.question,
    options,
    correctId: CHOICE_IDS[bank.correct],
    explanation: bank.explanation,
    tags: extractKeywords(bank.question + bank.explanation),
  };
}

function main() {
  const md = fs.readFileSync(MD_PATH, "utf8");
  const part1Units = parsePart1(md);
  const part2Blocks = parsePart2Flat(md);
  const useParsedQuestions =
    part2Blocks.length >= 20 &&
    part2Blocks.some((b) => b.fields.some((f) => f.includes("**발문:**")));

  if (useParsedQuestions) {
    console.log("PART 2: MD 문항 파싱 모드");
  } else {
    console.log("PART 2: 내장 MC_BANK 모드");
  }

  if (part1Units.length !== 4) {
    console.error(`Expected 4 units in PART 1, got ${part1Units.length}`);
    process.exit(1);
  }

  fs.mkdirSync(OUT_DIR, { recursive: true });

  const blockByOrder = new Map(part2Blocks.map((b) => [b.order, b]));
  let totalQuestions = 0;

  for (let i = 0; i < UNIT_META.length; i++) {
    const meta = UNIT_META[i];
    const raw = part1Units[i];
    const sectionId = `${meta.id}-s01`;

    const sections = [
      {
        id: sectionId,
        unitId: meta.id,
        order: 1,
        title: raw.title,
        bullets: raw.bullets,
        keywords: extractKeywords(raw.bullets.join(" ")),
      },
    ];

    const questions = meta.questionOrders.map((order) => {
      const block = blockByOrder.get(order);
      if (useParsedQuestions && block) {
        return questionFromBlock(block, meta.id);
      }
      return toQuestion(order, meta.id);
    });
    totalQuestions += questions.length;

    const unitJson = {
      id: meta.id,
      title: meta.title,
      subtitle: meta.subtitle,
      textbookRef: meta.textbookRef,
      textbookPages: meta.textbookPages,
      textbookChapters: [sections[0].title],
      studyGuide:
        "e북 해당 단원을 읽은 뒤 핵심 요약을 확인하고, 단원 퀴즈로 기말고사를 대비하세요.",
      goals: [`${meta.title} 핵심 개념을 설명할 수 있다.`],
      sections,
      questions,
    };

    fs.writeFileSync(
      path.join(OUT_DIR, `${meta.id}.json`),
      JSON.stringify(unitJson, null, 2),
      "utf8"
    );
    console.log(
      `✓ ${meta.id}.json — ${sections.length} section, ${questions.length} questions`
    );
  }

  const meta = {
    subject: "ethics",
    grade: 1,
    publisher: "비상교육",
    author: "김국현",
    curriculum: "2022",
    questionCount: totalQuestions,
    unitCount: UNIT_META.length,
    version: "2026-05-gemini-v1",
    source: "docs/gemini-code-1780040427395.md",
  };

  fs.writeFileSync(
    path.join(OUT_DIR, "meta.json"),
    JSON.stringify(meta, null, 2),
    "utf8"
  );

  console.log(`\nTotal: ${totalQuestions} questions across ${UNIT_META.length} units`);
}

main();
