export type QuizOption = {
  id: string;
  text: string;
};

export type Quiz = {
  id: string;
  question: string;
  /** eBook·교과서 발췌 본문 */
  excerpt?: string;
  /** 교과서 쪽수 (eBook 기준) */
  sourcePage?: number;
  options: QuizOption[];
  correctId: string;
  explanation: string;
};

export type Lesson = {
  id: string;
  title: string;
  summary: string;
  /** 핵심 정리 (불릿) */
  points: string[];
  keywords: string[];
  /** 스스로 생각해 보기 */
  reflections?: string[];
  quizzes: Quiz[];
};

/** Gemini DB 소단원 요약 (기술·가정) */
export type Section = {
  id: string;
  title: string;
  bullets: string[];
  keywords: string[];
};

export type Unit = {
  id: string;
  title: string;
  subtitle: string;
  /** 교과서 대단원 대응 (예: Ⅰ~Ⅲ 대단원) */
  textbookRef?: string;
  /** 교과서 목차상 대단원명 */
  textbookChapters?: string[];
  /** 교과서 쪽수 안내 */
  textbookPages?: string;
  /** 단원별 e북 직접 링크 (없으면 과목 e북 사용) */
  ebookUrl?: string;
  /** 단원 학습 안내 */
  studyGuide?: string;
  /** 단원 학습 목표 */
  goals?: string[];
  /** Gemini 핵심 요약 소단원 */
  sections?: Section[];
  /** 단원 퀴즈 20문항 (Gemini DB) */
  unitQuizzes?: Quiz[];
  /** 도덕 등 레거시 소단원 */
  lessons: Lesson[];
};

export type ExamScopeItem = {
  id: string;
  label: string;
  hint?: string;
  /** 샘플 시험 문항 출처 대단원 */
  unitId: string;
};

export type Subject = {
  id: string;
  name: string;
  shortName: string;
  publisher: string;
  author: string;
  curriculum: string;
  color: string;
  accent: string;
  emoji: string;
  /** 공식 e북 URL */
  ebookUrl?: string;
  ebookLabel?: string;
  units: Unit[];
};

export type ProgressState = Record<string, boolean>;
