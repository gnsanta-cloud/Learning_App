import { useMemo } from "react";
import { Link } from "react-router-dom";
import { QuizSession } from "../components/QuizSession";
import type { Quiz } from "../types";
import { getAllQuizzes, getSubject, subjects } from "../data/subjects";
import { useWrongAnswers } from "../hooks/useWrongAnswers";

export function ReviewPage() {
  const { wrongIds, clearAll } = useWrongAnswers();

  const wrongQuizzes = useMemo(() => {
    const byId = new Map<string, Quiz>();
    for (const subject of subjects) {
      for (const quiz of getAllQuizzes(subject)) {
        if (wrongIds.includes(quiz.id)) {
          byId.set(quiz.id, quiz);
        }
      }
    }
    return wrongIds
      .map((id) => byId.get(id))
      .filter((q): q is Quiz => q !== undefined);
  }, [wrongIds]);

  const techHome = getSubject("tech-home");

  if (wrongQuizzes.length === 0) {
    return (
      <main className="page">
        <Link to="/settings" className="back-link">
          ← 설정
        </Link>
        <header className="page-header">
          <h1>오답 노트</h1>
          <p>틀린 문항이 없습니다. 퀴즈를 풀어 보세요!</p>
        </header>
        {techHome && (
          <Link to={`/subject/${techHome.id}`} className="btn btn-primary">
            기술·가정 학습하기
          </Link>
        )}
      </main>
    );
  }

  if (!techHome) {
    return (
      <main className="page">
        <p>과목 데이터를 불러올 수 없습니다.</p>
      </main>
    );
  }

  return (
    <>
      <div className="review-toolbar page" style={{ paddingBottom: 0 }}>
        <Link to="/settings" className="back-link">
          ← 설정
        </Link>
        <p className="subject-meta">
          오답 {wrongQuizzes.length}문항 · 맞히면 노트에서 제거됩니다
        </p>
        <button
          type="button"
          className="btn btn-secondary"
          style={{ marginTop: "0.5rem" }}
          onClick={() => {
            if (confirm("오답 노트를 비울까요?")) clearAll();
          }}
        >
          오답 노트 비우기
        </button>
      </div>
      <QuizSession
        quizzes={wrongQuizzes}
        subjectColor={techHome.color}
        subjectAccent={techHome.accent}
        backLabel="설정"
        backTo="/settings"
        badge="오답 노트"
        doneLinks={[
          { to: "/settings", label: "설정으로" },
          { to: `/subject/${techHome.id}`, label: "과목으로" },
        ]}
      />
    </>
  );
}
