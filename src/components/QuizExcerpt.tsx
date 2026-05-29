type QuizSourcePageProps = {
  sourcePage?: number;
};

export function QuizExcerpt({ sourcePage }: QuizSourcePageProps) {
  if (sourcePage == null) return null;

  return <p className="quiz-source-page">교과서 p.{sourcePage}</p>;
}
