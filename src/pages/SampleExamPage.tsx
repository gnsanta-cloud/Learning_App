import { useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { buildSampleExam, MIN_EXAM_UNITS, SAMPLE_EXAM_QUESTION_COUNT } from "../lib/sampleExam";
import { QuizExcerpt } from "../components/QuizExcerpt";
import { getExamScope, getSubject } from "../data/subjects";
import { useWrongAnswers } from "../hooks/useWrongAnswers";

export function SampleExamPage() {
  const { subjectId } = useParams<{ subjectId: string }>();
  const [searchParams] = useSearchParams();
  const subject = subjectId ? getSubject(subjectId) : undefined;

  const unitIds = useMemo(() => {
    const raw = searchParams.get("units") ?? "";
    return raw.split(",").filter(Boolean);
  }, [searchParams]);

  const [attempt, setAttempt] = useState(0);

  const questions = useMemo(() => {
    if (!subject || unitIds.length === 0) return [];
    return buildSampleExam(subject, unitIds);
    // attempt 변경 시 문항 재추출
  }, [subject, unitIds, attempt]);

  const [started, setStarted] = useState(false);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const { markWrong, clearWrong } = useWrongAnswers();

  if (!subject) {
    return (
      <main className="page">
        <p>과목을 찾을 수 없습니다.</p>
        <Link to="/">홈으로</Link>
      </main>
    );
  }

  const subjectPath = `/subject/${subject.id}`;
  const scopeByUnit = new Map(
    getExamScope(subject).map((item) => [item.unitId, item.label])
  );
  const unitLabels = unitIds.map(
    (id) => scopeByUnit.get(id) ?? subject.units.find((u) => u.id === id)?.title ?? id
  );

  if (unitIds.length < MIN_EXAM_UNITS || questions.length === 0) {
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
        <Link to={subjectPath} className="back-link">
          ← {subject.shortName}
        </Link>
        <div className="sample-exam-empty">
          <h2>기말고사 샘플문제</h2>
          <p>
            {unitIds.length < MIN_EXAM_UNITS
              ? "시험 범위에서 대단원을 2개 이상 체크한 뒤 다시 시도해 주세요."
              : "선택한 대단원에서 출제할 문항을 찾지 못했습니다."}
          </p>
          <Link to={subjectPath} className="btn btn-primary">
            시험 범위로 돌아가기
          </Link>
        </div>
      </main>
    );
  }

  const current = questions[index];

  const handleSelect = (optionId: string) => {
    if (selected !== null || !current) return;
    setSelected(optionId);
    if (optionId === current.quiz.correctId) {
      setScore((s) => s + 1);
      clearWrong(current.quiz.id);
    } else {
      markWrong(current.quiz.id);
    }
  };

  const handleNext = () => {
    if (selected === null) return;
    if (index + 1 >= questions.length) {
      setFinished(true);
    } else {
      setIndex((i) => i + 1);
      setSelected(null);
    }
  };

  const handleRestart = () => {
    setAttempt((n) => n + 1);
    setStarted(false);
    setIndex(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
  };

  if (finished) {
    const pct = Math.round((score / questions.length) * 100);
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
        <div className="quiz-result sample-exam-result">
          <p className="sample-exam-badge">기말고사 샘플</p>
          <h2>채점 결과</h2>
          <p style={{ fontSize: "2rem", fontWeight: 700, color: subject.color }}>
            {score} / {questions.length}
          </p>
          <p style={{ color: "var(--text-muted)" }}>정답률 {pct}%</p>
          <p className="sample-exam-scope">
            범위: {unitLabels.join(" · ")}
          </p>
          <div className="btn-row" style={{ marginTop: "1.5rem" }}>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleRestart}
            >
              다시 풀기
            </button>
            <Link to={subjectPath} className="btn btn-secondary">
              과목으로
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (!started) {
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
        <Link to={subjectPath} className="back-link">
          ← {subject.shortName}
        </Link>
        <div className="sample-exam-intro">
          <p className="sample-exam-badge">기말고사 샘플</p>
          <h1>{subject.name}</h1>
          <p className="sample-exam-intro-desc">
            체크한 대단원 Gemini DB({SAMPLE_EXAM_QUESTION_COUNT}문항)에서
            무작위로 출제합니다. 틀린 문항은 오답 노트에 저장됩니다.
          </p>
          <div className="sample-exam-scope-card">
            <h2 className="section-title">시험 범위</h2>
            <ul className="sample-exam-scope-list">
              {unitLabels.map((label) => (
                <li key={label}>{label}</li>
              ))}
            </ul>
          </div>
          <p className="sample-exam-meta">
            총 {SAMPLE_EXAM_QUESTION_COUNT}문항 · 제한 시간 없음
          </p>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setStarted(true)}
          >
            시험 시작
          </button>
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
      <Link to={subjectPath} className="back-link">
        ← 나가기
      </Link>

      <p className="quiz-progress">
        문제 {index + 1} / {questions.length}
      </p>
      <p className="sample-exam-question-meta">
        {current.unitTitle} · {current.lessonTitle}
      </p>

      <div className="quiz-card">
        <QuizExcerpt sourcePage={current.quiz.sourcePage} />
        <h2 className="quiz-question">{current.quiz.question}</h2>
        <ul className="quiz-options">
          {current.quiz.options.map((opt) => {
            let className = "quiz-option";
            if (selected !== null) {
              if (opt.id === current.quiz.correctId) className += " correct";
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
                selected === current.quiz.correctId ? "ok" : "err"
              }`}
            >
              {selected === current.quiz.correctId ? "정답입니다! " : "아쉽습니다. "}
              {current.quiz.explanation}
            </div>
            <button
              type="button"
              className="btn btn-primary quiz-next-btn"
              onClick={handleNext}
            >
              {index + 1 >= questions.length ? "결과 보기" : "다음 문제"}
            </button>
          </>
        )}
      </div>
    </main>
  );
}
