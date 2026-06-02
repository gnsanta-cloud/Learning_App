import { useMemo } from "react";
import { Link } from "react-router-dom";
import { QuizSession } from "../components/QuizSession";
import type { Quiz, Subject } from "../types";
import { getAllQuizzes, getSubject, subjects } from "../data/subjects";
import { useWrongAnswers } from "../hooks/useWrongAnswers";
import { parseScopedQuizId } from "../lib/quizId";

function subjectsFromQuizzes(quizzes: Quiz[]): Subject[] {
  const ids = new Set<string>();
  for (const q of quizzes) {
    const parsed = parseScopedQuizId(q.id);
    if (parsed) ids.add(parsed.subjectId);
  }
  return subjects.filter((s) => ids.has(s.id));
}

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

  const subjectsInWrong = useMemo(
    () => subjectsFromQuizzes(wrongQuizzes),
    [wrongQuizzes]
  );

  const theme =
    subjectsInWrong.length === 1
      ? subjectsInWrong[0]
      : {
          color: "#374151",
          accent: "#f3f4f6",
        };

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
        <div className="subject-grid" style={{ marginTop: "1rem" }}>
          {subjects.map((subject) => (
            <Link
              key={subject.id}
              to={`/subject/${subject.id}`}
              className="btn btn-primary btn-block"
              style={
                {
                  "--subject-color": subject.color,
                  marginBottom: "0.5rem",
                } as React.CSSProperties
              }
            >
              {subject.name} 학습하기
            </Link>
          ))}
        </div>
      </main>
    );
  }

  const doneLinks = [
    { to: "/settings", label: "설정으로" },
    ...subjectsInWrong.map((s) => ({
      to: `/subject/${s.id}`,
      label: `${s.shortName}으로`,
    })),
  ];

  return (
    <>
      <div className="review-toolbar page" style={{ paddingBottom: 0 }}>
        <Link to="/settings" className="back-link">
          ← 설정
        </Link>
        <p className="subject-meta">
          오답 {wrongQuizzes.length}문항
          {subjectsInWrong.length > 1
            ? ` · ${subjectsInWrong.map((s) => s.shortName).join(" · ")}`
            : ""}{" "}
          · 맞히면 노트에서 제거됩니다
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
        subjectColor={theme.color}
        subjectAccent={theme.accent}
        backLabel="설정"
        backTo="/settings"
        badge="오답 노트"
        doneLinks={doneLinks}
        questionMeta={(quiz) => {
          const parsed = parseScopedQuizId(quiz.id);
          if (!parsed) return undefined;
          return getSubject(parsed.subjectId)?.shortName;
        }}
      />
    </>
  );
}
