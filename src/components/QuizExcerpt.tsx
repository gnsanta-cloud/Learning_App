type QuizExcerptProps = {
  excerpt?: string;
  sourcePage?: number;
};

export function QuizExcerpt({ excerpt, sourcePage }: QuizExcerptProps) {
  if (!excerpt) return null;

  return (
    <blockquote className="quiz-excerpt">
      {sourcePage != null && (
        <span className="quiz-excerpt-page">교과서 p.{sourcePage}</span>
      )}
      <p className="quiz-excerpt-text">{excerpt}</p>
    </blockquote>
  );
}
