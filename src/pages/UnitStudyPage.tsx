import { Link, useParams } from "react-router-dom";
import { EbookBanner } from "../components/EbookBanner";
import { ProgressBar } from "../components/ProgressBar";
import {
  getLessonKey,
  getUnit,
  getUnitEbookUrl,
} from "../data/subjects";
import { useProgress } from "../hooks/useProgress";

export function UnitStudyPage() {
  const { subjectId, unitId } = useParams<{
    subjectId: string;
    unitId: string;
  }>();
  const result =
    subjectId && unitId ? getUnit(subjectId, unitId) : undefined;
  const { isComplete, countCompleted } = useProgress();

  if (!result) {
    return (
      <main className="page">
        <p>단원을 찾을 수 없습니다.</p>
        <Link to="/">홈으로</Link>
      </main>
    );
  }

  const { subject, unit } = result;
  const lessonKeys = unit.lessons.map((l) =>
    getLessonKey(subject.id, unit.id, l.id)
  );
  const done = countCompleted(lessonKeys);
  const quizCount = unit.lessons.reduce((n, l) => n + l.quizzes.length, 0);
  const ebookUrl = getUnitEbookUrl(subject, unit);

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
      <Link to={`/subject/${subject.id}`} className="back-link">
        ← {subject.shortName}
      </Link>

      <header className="page-header">
        <h1>{unit.title}</h1>
        <p>{unit.subtitle}</p>
      </header>

      <ProgressBar done={done} total={lessonKeys.length} color={subject.color} />

      {ebookUrl && (
        <EbookBanner
          url={ebookUrl}
          label={subject.ebookLabel ?? "공식 e북"}
          note={
            unit.textbookPages
              ? `교과서 ${unit.textbookPages} · ${unit.textbookRef ?? "해당 단원"}`
              : unit.textbookRef
          }
          color={subject.color}
          accent={subject.accent}
        />
      )}

      {(unit.textbookChapters?.length || unit.textbookRef) && (
        <section className="study-section">
          <h2 className="section-title">교과서 목차</h2>
          <div className="textbook-ref-card">
            {unit.textbookRef && (
              <p className="textbook-ref-label">{unit.textbookRef}</p>
            )}
            {unit.textbookChapters && (
              <ul className="textbook-chapter-list">
                {unit.textbookChapters.map((chapter) => (
                  <li key={chapter}>{chapter}</li>
                ))}
              </ul>
            )}
            {unit.textbookPages && (
              <p className="textbook-pages">쪽수: {unit.textbookPages}</p>
            )}
          </div>
        </section>
      )}

      {unit.studyGuide && (
        <section className="study-section">
          <h2 className="section-title">학습 방법</h2>
          <div className="summary-box">{unit.studyGuide}</div>
        </section>
      )}

      {unit.goals && unit.goals.length > 0 && (
        <section className="study-section">
          <h2 className="section-title">학습 목표</h2>
          <ul className="points-list">
            {unit.goals.map((goal) => (
              <li key={goal}>{goal}</li>
            ))}
          </ul>
        </section>
      )}

      <section className="study-section">
        <h2 className="section-title">
          앱 학습 ({unit.lessons.length}개 · 퀴즈 {quizCount}문항)
        </h2>
        <ol className="unit-study-steps">
          <li>e북에서 교과서 내용을 읽습니다.</li>
          <li>아래 소단원 요약·핵심 정리를 확인합니다.</li>
          <li>퀴즈로 이해도를 점검합니다.</li>
        </ol>
        <ul className="lesson-list">
          {unit.lessons.map((lesson, index) => {
            const key = getLessonKey(subject.id, unit.id, lesson.id);
            const completed = isComplete(key);
            return (
              <li key={lesson.id}>
                <Link
                  to={`/subject/${subject.id}/unit/${unit.id}/lesson/${lesson.id}`}
                  className={`lesson-item ${completed ? "done" : ""}`}
                >
                  <span className="lesson-step" aria-hidden>
                    {index + 1}
                  </span>
                  <span className="lesson-check" aria-hidden>
                    {completed ? "✓" : ""}
                  </span>
                  <span className="lesson-title">{lesson.title}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>
    </main>
  );
}
