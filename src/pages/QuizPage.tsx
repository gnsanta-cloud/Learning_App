import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { QuizExcerpt } from "../components/QuizExcerpt";
import { getSubject, getLessonKey } from "../data/subjects";
import { useProgress } from "../hooks/useProgress";

export function QuizPage() {
  const { subjectId, unitId, lessonId } = useParams<{
    subjectId: string;
    unitId: string;
    lessonId: string;
  }>();
  const subject = subjectId ? getSubject(subjectId) : undefined;
  const { markComplete } = useProgress();

  const unit = subject?.units.find((u) => u.id === unitId);
  const lesson = unit?.lessons.find((l) => l.id === lessonId);

  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  if (!subject || !unit || !lesson) {
    return (
      <main className="page">
        <p>퀴즈를 찾을 수 없습니다.</p>
        <Link to="/">홈으로</Link>
      </main>
    );
  }

  const quizzes = lesson.quizzes;
  const current = quizzes[index];
  const lessonPath = `/subject/${subject.id}/unit/${unit.id}/lesson/${lesson.id}`;

  const handleSelect = (optionId: string) => {
    if (selected !== null) return;
    setSelected(optionId);
    const correct = optionId === current.correctId;
    if (correct) setScore((s) => s + 1);

    setTimeout(() => {
      if (index + 1 >= quizzes.length) {
        setFinished(true);
        markComplete(getLessonKey(subject.id, unit.id, lesson.id));
      } else {
        setIndex((i) => i + 1);
        setSelected(null);
      }
    }, 1400);
  };

  if (finished) {
    const pct = Math.round((score / quizzes.length) * 100);
    return (
      <main
        className="page"
        style={
          {
            "--subject-color": subject.color,
            "--subject-accent": subject.accent,
          } as React.CSSProperties
        }
      >
        <div className="quiz-result">
          <h2>퀴즈 완료!</h2>
          <p style={{ fontSize: "2rem", fontWeight: 700, color: subject.color }}>
            {score} / {quizzes.length}
          </p>
          <p style={{ color: "var(--text-muted)" }}>정답률 {pct}%</p>
          <div className="btn-row" style={{ marginTop: "1.5rem" }}>
            <Link to={lessonPath} className="btn btn-primary">
              학습으로 돌아가기
            </Link>
            <Link to={`/subject/${subject.id}`} className="btn btn-secondary">
              단원 목록
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main
      className="page"
      style={
        {
          "--subject-color": subject.color,
          "--subject-accent": subject.accent,
        } as React.CSSProperties
      }
    >
      <Link to={lessonPath} className="back-link">
        ← {lesson.title}
      </Link>

      <p className="quiz-progress">
        문제 {index + 1} / {quizzes.length}
      </p>

      <div className="quiz-card">
        <QuizExcerpt sourcePage={current.sourcePage} />
        <h2 className="quiz-question">{current.question}</h2>
        <ul className="quiz-options">
          {current.options.map((opt) => {
            let className = "quiz-option";
            if (selected !== null) {
              if (opt.id === current.correctId) className += " correct";
              else if (opt.id === selected) className += " wrong";
            }
            return (
              <li key={opt.id}>
                <button
                  type="button"
                  className={className}
                  disabled={selected !== null}
                  onClick={() => handleSelect(opt.id)}
                >
                  {opt.text}
                </button>
              </li>
            );
          })}
        </ul>
        {selected !== null && (
          <div
            className={`quiz-feedback ${
              selected === current.correctId ? "ok" : "err"
            }`}
          >
            {selected === current.correctId ? "정답입니다! " : "아쉽습니다. "}
            {current.explanation}
          </div>
        )}
      </div>
    </main>
  );
}
