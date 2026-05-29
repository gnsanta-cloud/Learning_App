import { Link, useParams } from "react-router-dom";
import { EbookBanner } from "../components/EbookBanner";
import { ProgressBar } from "../components/ProgressBar";
import { formatInlineMarkdown } from "../lib/formatText";
import {
  getLessonKey,
  getSectionKey,
  getUnit,
  getUnitEbookUrl,
  getUnitProgressKeys,
  getUnitQuizKey,
  unitUsesSections,
} from "../data/subjects";
import { getUnitQuizzes } from "../lib/geminiContent";
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
  const progressKeys = getUnitProgressKeys(subject.id, unit);
  const done = countCompleted(progressKeys);
  const quizCount = getUnitQuizzes(unit).length;
  const ebookUrl = getUnitEbookUrl(subject, unit);
  const usesSections = unitUsesSections(unit);
  const unitQuizDone = isComplete(getUnitQuizKey(subject.id, unit.id));

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

      <ProgressBar done={done} total={progressKeys.length} color={subject.color} />

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

      {unit.studyGuide && (
        <section className="study-section">
          <h2 className="section-title">학습 방법</h2>
          <div className="summary-box">{unit.studyGuide}</div>
        </section>
      )}

      {usesSections && unit.sections && (
        <>
          <section className="study-section">
            <h2 className="section-title">핵심 요약 미리보기</h2>
            {unit.sections.map((section) => (
              <details key={section.id} className="summary-accordion">
                <summary>{section.title}</summary>
                <ul className="points-list points-list--formatted">
                  {section.bullets.map((b) => (
                    <li key={b}>{formatInlineMarkdown(b)}</li>
                  ))}
                </ul>
              </details>
            ))}
          </section>

          <section className="study-section">
            <h2 className="section-title">
              소단원 학습 ({unit.sections.length}개)
            </h2>
            <ol className="unit-study-steps">
              <li>e북에서 교과서 내용을 읽습니다.</li>
              <li>아래 소단원별 핵심 요약을 확인합니다.</li>
              <li>단원 퀴즈 20문항으로 기말고사를 대비합니다.</li>
            </ol>
            <ul className="lesson-list">
              {unit.sections.map((section, index) => {
                const key = getSectionKey(subject.id, unit.id, section.id);
                const completed = isComplete(key);
                return (
                  <li key={section.id}>
                    <Link
                      to={`/subject/${subject.id}/unit/${unit.id}/section/${section.id}`}
                      className={`lesson-item ${completed ? "done" : ""}`}
                    >
                      <span className="lesson-step" aria-hidden>
                        {index + 1}
                      </span>
                      <span className="lesson-check" aria-hidden>
                        {completed ? "✓" : ""}
                      </span>
                      <span className="lesson-title">{section.title}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        </>
      )}

      {!usesSections && unit.lessons.length > 0 && (
        <section className="study-section">
          <h2 className="section-title">
            앱 학습 ({unit.lessons.length}개 소단원)
          </h2>
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
      )}

      {quizCount > 0 && (
        <section className="study-section unit-quiz-cta">
          <h2 className="section-title">단원 퀴즈</h2>
          <p className="unit-quiz-desc">
            기말고사 대비 객관식 {quizCount}문항 · 80% 이상이면 합격
          </p>
          <Link
            to={`/subject/${subject.id}/unit/${unit.id}/quiz`}
            className={`btn btn-primary btn-block ${unitQuizDone ? "btn-done" : ""}`}
          >
            {unitQuizDone ? "✓ 단원 퀴즈 완료 · 다시 풀기" : `단원 퀴즈 ${quizCount}문항 시작`}
          </Link>
        </section>
      )}
    </main>
  );
}
