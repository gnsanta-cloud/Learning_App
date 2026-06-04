import { Link } from "react-router-dom";
import { AiTeacherAvatar } from "../components/AiTeacherAvatar";
import { AiTeacherMarkdown } from "../components/AiTeacherBubble";
import { AI_TEACHER } from "../config/aiTeacher";
import { subjects } from "../data/subjects";
import { unitUsesSections } from "../data/subjects";
import { getUnitQuizzes } from "../lib/geminiContent";

export function AiTeacherHubPage() {
  return (
    <main className="page ai-teacher-hub">
      <Link to="/" className="back-link">
        ← 홈
      </Link>

      <header
        className="ai-teacher-hub__hero"
        style={
          {
            "--subject-color": "#7c3aed",
            "--subject-accent": "#ede9fe",
          } as React.CSSProperties
        }
      >
        <AiTeacherAvatar size="lg" speaking />
        <div>
          <h1>AI 선생님 학습</h1>
          <p className="ai-teacher-hub__tagline">{AI_TEACHER.tagline}</p>
        </div>
      </header>

      <div className="ai-teacher-hub__intro summary-box">
        <AiTeacherMarkdown text={AI_TEACHER.greeting} />
      </div>

      {subjects.map((subject) => (
        <section key={subject.id} className="ai-teacher-hub__subject">
          <h2
            className="section-title"
            style={{ color: subject.color }}
          >
            {subject.emoji} {subject.name}
          </h2>
          <ul className="ai-teacher-unit-list">
            {subject.units.map((unit) => {
              const sectionCount = unitUsesSections(unit)
                ? (unit.sections?.length ?? 0)
                : unit.lessons.length;
              const quizCount = getUnitQuizzes(unit).length;

              return (
                <li key={unit.id}>
                  <Link
                    to={`/ai-teacher/${subject.id}/${unit.id}`}
                    className="ai-teacher-unit-card"
                    style={
                      {
                        "--subject-color": subject.color,
                        "--subject-accent": subject.accent,
                      } as React.CSSProperties
                    }
                  >
                    <div className="ai-teacher-unit-card__main">
                      <h3>{unit.title}</h3>
                      <p>{unit.subtitle}</p>
                    </div>
                    <span className="ai-teacher-unit-card__meta">
                      {sectionCount > 0
                        ? `소단원 ${sectionCount}`
                        : "활동지"}{" "}
                      · 확인문제 최대 3 · 퀴즈 {quizCount}문항
                    </span>
                    <span className="ai-teacher-unit-card__cta" aria-hidden>
                      학습 시작 →
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </main>
  );
}
