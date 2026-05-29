export type QuizOption = {
  id: string;
  text: string;
};

export type Quiz = {
  id: string;
  question: string;
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
  lessons: Lesson[];
};

export type ExamScopeItem = {
  id: string;
  label: string;
  hint?: string;
};

export type ResourceLink = {
  label: string;
  url: string;
  note?: string;
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
  /** T셀파·비바샘 등 외부 평가·자료 링크 */
  resourceLinks?: ResourceLink[];
  units: Unit[];
  examScope: ExamScopeItem[];
};

export type ProgressState = Record<string, boolean>;
