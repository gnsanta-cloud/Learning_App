import { useCallback, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AiTeacherAvatar } from "../components/AiTeacherAvatar";
import {
  AiTeacherBubble,
  AiTeacherMarkdown,
} from "../components/AiTeacherBubble";
import { AI_TEACHER } from "../config/aiTeacher";
import {
  getSectionKey,
  getUnit,
  getUnitQuizKey,
  unitUsesSections,
} from "../data/subjects";
import { useProgress } from "../hooks/useProgress";
import { useWrongAnswers } from "../hooks/useWrongAnswers";
import {
  buildAiTeacherSteps,
  type AiTeacherStep,
} from "../lib/aiTeacherSteps";
import { formatInlineMarkdown } from "../lib/formatText";
import { recordDailyActivity } from "../lib/activity";

export function AiTeacherLearnPage() {
  const { subjectId, unitId } = useParams<{
    subjectId: string;
    unitId: string;
  }>();
  const result =
    subjectId && unitId ? getUnit(subjectId, unitId) : undefined;
  const { markComplete } = useProgress();
  const { markWrong, clearWrong } = useWrongAnswers();

  const steps = useMemo(() => {
    if (!result) return [];
    return buildAiTeacherSteps(result.subject, result.unit);
  }, [result]);

  const [stepIndex, setStepIndex] = useState(0);
  const [quizSelected, setQuizSelected] = useState<string | null>(null);
  const [quizRevealed, setQuizRevealed] = useState(false);

  const step = steps[stepIndex];
  const progressPct =
    steps.length > 1 ? Math.round((stepIndex / (steps.length - 1)) * 100) : 0;

  const goNext = useCallback(() => {
    setQuizSelected(null);
    setQuizRevealed(false);
    setStepIndex((i) => Math.min(i + 1, steps.length - 1));
  }, [steps.length]);

  const handleCheck = useCallback(
    (understood: boolean) => {
      if (!result || !step || step.kind !== "check") return;
      if (understood) {
        if (unitUsesSections(result.unit)) {
          markComplete(
            getSectionKey(result.subject.id, result.unit.id, step.sectionId)
          );
        }
        goNext();
        return;
      }
      const rewind = steps.findIndex(
        (s) =>
          s.kind === "teach" && s.sectionTitle === step.sectionTitle
      );
      if (rewind >= 0) setStepIndex(rewind);
    },
    [result, step, steps, markComplete, goNext]
  );

  const handleQuizSelect = useCallback(
    (optionId: string) => {
      if (!step || step.kind !== "quiz" || quizRevealed) return;
      setQuizSelected(optionId);
      setQuizRevealed(true);
      const correct = optionId === step.quiz.correctId;
      if (correct) clearWrong(step.quiz.id);
      else markWrong(step.quiz.id);
    },
    [step, quizRevealed, clearWrong, markWrong]
  );

  if (!result) {
    return (
      <main className="page">
        <p>단원을 찾을 수 없습니다.</p>
        <Link to="/ai-teacher">AI 선생님으로</Link>
      </main>
    );
  }

  const { subject, unit } = result;
  const unitPath = `/subject/${subject.id}/unit/${unit.id}`;
  const quizPath = `${unitPath}/quiz`;
  const hubPath = "/ai-teacher";

  if (!step) {
    return (
      <main className="page">
        <p>학습 내용이 없습니다.</p>
        <Link to={hubPath}>단원 선택으로</Link>
      </main>
    );
  }

  return (
    <main
      className="page ai-teacher-learn"
      style={
        {
          "--subject-color": subject.color,
          "--subject-accent": subject.accent,
        } as React.CSSProperties
      }
    >
      <Link to={hubPath} className="back-link">
        ← 단원 선택
      </Link>

      <header className="ai-teacher-learn__header">
        <div className="ai-teacher-learn__header-top">
          <AiTeacherAvatar size="md" speaking={step.kind !== "complete"} />
          <div>
            <p className="subject-meta">{subject.name}</p>
            <h1 className="ai-teacher-learn__title">{unit.title}</h1>
          </div>
        </div>
        <div className="progress-bar-wrap">
          <div className="progress-label">
            <span>{AI_TEACHER.name}와 함께 학습 중</span>
            <span>{progressPct}%</span>
          </div>
          <div className="progress-track">
            <div
              className="progress-fill"
              style={{
                width: `${progressPct}%`,
                background: subject.color,
              }}
            />
          </div>
        </div>
      </header>

      <div className="ai-teacher-learn__stage">
        <StepView
          step={step}
          unitTitle={unit.title}
          subjectColor={subject.color}
          quizSelected={quizSelected}
          quizRevealed={quizRevealed}
          onQuizSelect={handleQuizSelect}
          onCheck={handleCheck}
          onNext={goNext}
          unitPath={unitPath}
          quizPath={quizPath}
          hubPath={hubPath}
          onComplete={() => {
            recordDailyActivity();
            markComplete(getUnitQuizKey(subject.id, unit.id));
          }}
        />
      </div>

      {step.kind !== "check" &&
        step.kind !== "quiz" &&
        step.kind !== "complete" && (
          <div className="ai-teacher-learn__nav">
            <button
              type="button"
              className="btn btn-primary btn-block"
              onClick={goNext}
            >
              다음 →
            </button>
          </div>
        )}
    </main>
  );
}

type StepViewProps = {
  step: AiTeacherStep;
  unitTitle: string;
  subjectColor: string;
  quizSelected: string | null;
  quizRevealed: boolean;
  onQuizSelect: (id: string) => void;
  onCheck: (understood: boolean) => void;
  onNext: () => void;
  unitPath: string;
  quizPath: string;
  hubPath: string;
  onComplete: () => void;
};

function StepView({
  step,
  unitTitle,
  subjectColor,
  quizSelected,
  quizRevealed,
  onQuizSelect,
  onCheck,
  onNext,
  unitPath,
  quizPath,
  hubPath,
  onComplete,
}: StepViewProps) {
  switch (step.kind) {
    case "say":
      return (
        <AiTeacherBubble>
          <AiTeacherMarkdown text={step.text} />
        </AiTeacherBubble>
      );

    case "teach":
      return (
        <AiTeacherBubble>
          <p className="ai-teacher-teach__section">{step.sectionTitle}</p>
          <div className="ai-teacher-teach__card">
            {formatInlineMarkdown(step.bullet)}
          </div>
          {step.keywords.length > 0 && (
            <div className="chip-row" style={{ marginTop: "0.75rem" }}>
              {step.keywords.slice(0, 4).map((kw) => (
                <span key={kw} className="chip">
                  {kw}
                </span>
              ))}
            </div>
          )}
        </AiTeacherBubble>
      );

    case "check":
      return (
        <>
          <AiTeacherBubble>
            <p>
              <strong>{step.sectionTitle}</strong> 내용, 이해했어?
            </p>
            <p className="ai-teacher-check__hint">
              이해했으면 소단원 학습 완료로 표시할게.
            </p>
          </AiTeacherBubble>
          <div className="btn-row ai-teacher-check__actions">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => onCheck(true)}
            >
              네, 이해했어요 ✓
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => onCheck(false)}
            >
              한 번 더 볼게요
            </button>
          </div>
        </>
      );

    case "quiz": {
      const quiz = step.quiz;
      return (
        <>
          <AiTeacherBubble>
            <p className="quiz-badge">
              확인 문제 {step.index}/{step.total}
            </p>
            <p className="quiz-question">{quiz.question}</p>
          </AiTeacherBubble>
          <ul className="quiz-options ai-teacher-quiz-options">
            {quiz.options.map((opt) => {
              let className = "quiz-option";
              if (quizRevealed) {
                if (opt.id === quiz.correctId) className += " correct";
                else if (opt.id === quizSelected) className += " wrong";
              } else if (opt.id === quizSelected) {
                className += " selected";
              }
              return (
                <li key={opt.id}>
                  <button
                    type="button"
                    className={className}
                    disabled={quizRevealed}
                    onClick={() => onQuizSelect(opt.id)}
                  >
                    {opt.text}
                  </button>
                </li>
              );
            })}
          </ul>
          {quizRevealed && (
            <div className="quiz-feedback">
              <p>{quiz.explanation}</p>
              <button
                type="button"
                className="btn btn-primary btn-block"
                style={
                  { marginTop: "1rem", "--subject-color": subjectColor } as React.CSSProperties
                }
                onClick={onNext}
              >
                다음 →
              </button>
            </div>
          )}
        </>
      );
    }

    case "complete":
      return (
        <>
          <AiTeacherBubble>
            <p>
              🎉 <strong>수고했어!</strong> 「{unitTitle}」 단원 핵심을 모두
              살펴봤어.
            </p>
            <p>더 연습하려면 단원 퀴즈를 풀거나, 교과서 요약을 다시 볼 수 있어.</p>
          </AiTeacherBubble>
          <div className="btn-row">
            <button
              type="button"
              className="btn btn-primary btn-block"
              onClick={() => {
                onComplete();
              }}
            >
              학습 완료 표시
            </button>
            <Link to={quizPath} className="btn btn-secondary btn-block">
              단원 퀴즈 풀기
            </Link>
            <Link to={unitPath} className="btn btn-secondary btn-block">
              단원 요약 보기
            </Link>
            <Link to={hubPath} className="btn btn-secondary btn-block">
              다른 단원 선택
            </Link>
          </div>
        </>
      );

    default:
      return null;
  }
}
