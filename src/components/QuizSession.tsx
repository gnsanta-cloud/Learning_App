import { useState } from "react";
import { Link } from "react-router-dom";
import type { Quiz } from "../types";
import { useWrongAnswers } from "../hooks/useWrongAnswers";

type Props = {
  quizzes: Quiz[];
  subjectColor: string;
  subjectAccent: string;
  backLabel: string;
  backTo: string;
  doneLinks: { to: string; label: string }[];
  onComplete?: () => void;
  badge?: string;
  questionMeta?: (quiz: Quiz, index: number) => string | undefined;
};

export function QuizSession({
  quizzes,
  subjectColor,
  subjectAccent,
  backLabel,
  backTo,
  doneLinks,
  onComplete,
  badge,
  questionMeta,
}: Props) {
  const { markWrong, clearWrong } = useWrongAnswers();
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const current = quizzes[index];

  const handleSelect = (optionId: string) => {
    if (selected !== null || !current) return;
    setSelected(optionId);
    const correct = optionId === current.correctId;
    if (correct) {
      setScore((s) => s + 1);
      clearWrong(current.id);
    } else {
      markWrong(current.id);
    }
  };

  const handleNext = () => {
    if (selected === null) return;
    if (index + 1 >= quizzes.length) {
      setFinished(true);
      onComplete?.();
    } else {
      setIndex((i) => i + 1);
      setSelected(null);
    }
  };

  if (!current) {
    return (
      <main className="page">
        <p>문항이 없습니다.</p>
        <Link to={backTo}>돌아가기</Link>
      </main>
    );
  }

  if (finished) {
    const pct = Math.round((score / quizzes.length) * 100);
    const passed = pct >= 80;
    return (
      <main
        className="page"
        style={
          {
            "--subject-color": subjectColor,
            "--subject-accent": subjectAccent,
          } as React.CSSProperties
        }
      >
        <div className="quiz-result">
          {badge && <p className="sample-exam-badge">{badge}</p>}
          <h2>퀴즈 완료!</h2>
          <p style={{ fontSize: "2rem", fontWeight: 700, color: subjectColor }}>
            {score} / {quizzes.length}
          </p>
          <p style={{ color: "var(--text-muted)" }}>
            정답률 {pct}%
            {passed ? " · 합격!" : " · 80% 이상을 목표로 다시 도전해 보세요."}
          </p>
          <div className="btn-row" style={{ marginTop: "1.5rem" }}>
            {doneLinks.map((link) => (
              <Link key={link.to} to={link.to} className="btn btn-primary">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </main>
    );
  }

  const meta = questionMeta?.(current, index);

  return (
    <main
      className="page"
      style={
        {
          "--subject-color": subjectColor,
          "--subject-accent": subjectAccent,
        } as React.CSSProperties
      }
    >
      <Link to={backTo} className="back-link">
        ← {backLabel}
      </Link>

      {badge && <p className="sample-exam-badge">{badge}</p>}
      <p className="quiz-progress">
        문제 {index + 1} / {quizzes.length}
      </p>
      {meta && <p className="sample-exam-question-meta">{meta}</p>}

      <div className="quiz-card">
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
          <>
            <div
              className={`quiz-feedback ${
                selected === current.correctId ? "ok" : "err"
              }`}
            >
              {selected === current.correctId ? "정답입니다! " : "아쉽습니다. "}
              {current.explanation}
            </div>
            <button
              type="button"
              className="btn btn-primary quiz-next-btn"
              onClick={handleNext}
            >
              {index + 1 >= quizzes.length ? "결과 보기" : "다음 문제"}
            </button>
          </>
        )}
      </div>
    </main>
  );
}
