import { Link, useParams } from "react-router-dom";
import { EbookBanner } from "../components/EbookBanner";
import { getExamScope, getSubject, getLessonKey } from "../data/subjects";
import { useProgress } from "../hooks/useProgress";
import { ProgressBar } from "../components/ProgressBar";
import { ExamChecklist } from "../components/ExamChecklist";

export function SubjectPage() {
  const { subjectId } = useParams<{ subjectId: string }>();
  const subject = subjectId ? getSubject(subjectId) : undefined;
  const { countCompleted } = useProgress();

  if (!subject) {
    return (
      <main className="page">
        <p>과목을 찾을 수 없습니다.</p>
        <Link to="/">홈으로</Link>
      </main>
    );
  }

  const allKeys = subject.units.flatMap((u) =>
    u.lessons.map((l) => getLessonKey(subject.id, u.id, l.id))
  );
  const done = countCompleted(allKeys);

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
      <Link to="/" className="back-link">
        ← 홈
      </Link>
      <header className="page-header">
        <h1>
          {subject.emoji} {subject.name}
        </h1>
        <p>
          {subject.publisher} · {subject.author}
        </p>
      </header>

      <ProgressBar
        done={done}
        total={allKeys.length}
        color={subject.color}
      />

      {subject.ebookUrl && (
        <EbookBanner
          url={subject.ebookUrl}
          label={subject.ebookLabel ?? "공식 e북"}
          note="교과서 본문은 e북에서 열람 · 앱에서는 요약·퀴즈로 복습"
          color={subject.color}
          accent={subject.accent}
        />
      )}

      <ExamChecklist
        subjectId={subject.id}
        items={getExamScope(subject)}
        color={subject.color}
      />

      <h2 className="section-title">단원별 학습</h2>
      <ul className="unit-list">
        {subject.units.map((unit) => {
          const unitKeys = unit.lessons.map((l) =>
            getLessonKey(subject.id, unit.id, l.id)
          );
          const unitDone = countCompleted(unitKeys);
          const quizTotal = unit.lessons.reduce(
            (n, l) => n + l.quizzes.length,
            0
          );

          return (
            <li key={unit.id}>
              <Link
                to={`/subject/${subject.id}/unit/${unit.id}`}
                className="unit-card unit-card--link"
              >
                <div className="unit-card-head">
                  <div>
                    <h3>{unit.title}</h3>
                    <p>{unit.subtitle}</p>
                  </div>
                  <span className="unit-card-arrow" aria-hidden>
                    →
                  </span>
                </div>
                {unit.textbookRef && (
                  <p className="unit-card-ref">{unit.textbookRef}</p>
                )}
                <div className="unit-card-meta">
                  <span>
                    {unitDone}/{unitKeys.length} 소단원
                  </span>
                  <span>퀴즈 {quizTotal}문항</span>
                </div>
                <div className="progress-bar-wrap">
                  <div className="progress-track">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${unitKeys.length ? (unitDone / unitKeys.length) * 100 : 0}%`,
                        background: subject.color,
                      }}
                    />
                  </div>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
