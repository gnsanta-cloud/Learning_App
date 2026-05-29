import { Link, useParams } from "react-router-dom";
import { formatInlineMarkdown } from "../lib/formatText";
import {
  getSectionKey,
  getUnit,
  getUnitQuizzes,
  unitUsesSections,
} from "../data/subjects";
import { useProgress } from "../hooks/useProgress";

export function SectionStudyPage() {
  const { subjectId, unitId, sectionId } = useParams<{
    subjectId: string;
    unitId: string;
    sectionId: string;
  }>();
  const result =
    subjectId && unitId ? getUnit(subjectId, unitId) : undefined;
  const { markComplete, isComplete } = useProgress();

  if (!result) {
    return (
      <main className="page">
        <p>단원을 찾을 수 없습니다.</p>
        <Link to="/">홈으로</Link>
      </main>
    );
  }

  const { subject, unit } = result;
  const section = unit.sections?.find((s) => s.id === sectionId);

  if (!section || !unitUsesSections(unit)) {
    return (
      <main className="page">
        <p>학습 내용을 찾을 수 없습니다.</p>
        <Link to={`/subject/${subject.id}`}>과목으로</Link>
      </main>
    );
  }

  const key = getSectionKey(subject.id, unit.id, section.id);
  const completed = isComplete(key);
  const unitPath = `/subject/${subject.id}/unit/${unit.id}`;
  const quizCount = getUnitQuizzes(unit).length;

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
      <Link to={unitPath} className="back-link">
        ← {unit.title}
      </Link>
      <header className="page-header">
        <p className="subject-meta" style={{ marginBottom: "0.25rem" }}>
          {unit.title}
        </p>
        <h1>{section.title}</h1>
      </header>

      <h2 className="section-title">핵심 요약</h2>
      <ul className="points-list points-list--formatted">
        {section.bullets.map((bullet) => (
          <li key={bullet}>{formatInlineMarkdown(bullet)}</li>
        ))}
      </ul>

      {section.keywords.length > 0 && (
        <div className="chip-row">
          {section.keywords.map((kw) => (
            <span key={kw} className="chip">
              {kw}
            </span>
          ))}
        </div>
      )}

      <div className="btn-row">
        <Link to={`${unitPath}/quiz`} className="btn btn-secondary">
          단원 퀴즈 {quizCount}문항
        </Link>
        {!completed && (
          <button
            type="button"
            className="btn btn-primary"
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
            ✓ 이 소단원 학습을 완료했습니다
          </p>
        )}
      </div>
    </main>
  );
}
