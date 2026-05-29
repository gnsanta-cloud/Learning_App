import { Link, useParams } from "react-router-dom";
import { getSubject, getLessonKey } from "../data/subjects";
import { useProgress } from "../hooks/useProgress";

export function LessonPage() {
  const { subjectId, unitId, lessonId } = useParams<{
    subjectId: string;
    unitId: string;
    lessonId: string;
  }>();
  const subject = subjectId ? getSubject(subjectId) : undefined;
  const { markComplete, isComplete } = useProgress();

  const unit = subject?.units.find((u) => u.id === unitId);
  const lesson = unit?.lessons.find((l) => l.id === lessonId);

  if (!subject || !unit || !lesson) {
    return (
      <main className="page">
        <p>학습 내용을 찾을 수 없습니다.</p>
        <Link to="/">홈으로</Link>
      </main>
    );
  }

  const key = getLessonKey(subject.id, unit.id, lesson.id);
  const completed = isComplete(key);

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
      <Link
        to={`/subject/${subject.id}/unit/${unit.id}`}
        className="back-link"
      >
        ← {unit.title}
      </Link>
      <header className="page-header">
        <p className="subject-meta" style={{ marginBottom: "0.25rem" }}>
          {unit.title}
        </p>
        <h1>{lesson.title}</h1>
      </header>

      <div className="summary-box">{lesson.summary}</div>

      <h2 className="section-title">핵심 정리</h2>
      <ul className="points-list">
        {lesson.points.map((point) => (
          <li key={point}>{point}</li>
        ))}
      </ul>

      <div className="chip-row">
        {lesson.keywords.map((kw) => (
          <span key={kw} className="chip">
            {kw}
          </span>
        ))}
      </div>

      {lesson.reflections && lesson.reflections.length > 0 && (
        <>
          <h2 className="section-title">스스로 생각해 보기</h2>
          <ul className="reflection-list">
            {lesson.reflections.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </>
      )}

      <div className="btn-row">
        <Link
          to={`/subject/${subject.id}/unit/${unit.id}/lesson/${lesson.id}/quiz`}
          className="btn btn-primary"
        >
          퀴즈 풀기 ({lesson.quizzes.length}문항)
        </Link>
        {!completed && (
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => markComplete(key)}
          >
            학습 완료로 표시
          </button>
        )}
        {completed && (
          <p
            style={{
              textAlign: "center",
              color: subject.color,
              fontWeight: 600,
              fontSize: "0.9rem",
            }}
          >
            ✓ 이 단원 학습을 완료했습니다
          </p>
        )}
      </div>
    </main>
  );
}
