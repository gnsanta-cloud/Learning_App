import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AiTeacherAvatar } from "../components/AiTeacherAvatar";
import {
  AiTeacherChat,
  appendTeacherChatMessage,
  newChatId,
  type ChatMessage,
} from "../components/AiTeacherChat";
import { AI_TEACHER } from "../config/aiTeacher";
import {
  getSectionKey,
  getUnit,
  getUnitQuizKey,
  unitUsesSections,
} from "../data/subjects";
import { useProgress } from "../hooks/useProgress";
import { useWrongAnswers } from "../hooks/useWrongAnswers";
import { recordDailyActivity } from "../lib/activity";
import { stepToTeacherText } from "../lib/aiTeacherStepText";
import {
  buildAiTeacherSteps,
  type AiTeacherStep,
} from "../lib/aiTeacherSteps";
import { buildUnitContext } from "../lib/unitContext";

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

  const unitContext = useMemo(() => {
    if (!result) return "";
    return buildUnitContext(result.subject, result.unit);
  }, [result]);

  const [stepIndex, setStepIndex] = useState(0);
  const [quizSelected, setQuizSelected] = useState<string | null>(null);
  const [quizRevealed, setQuizRevealed] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const appendedSteps = useRef(new Set<number>());

  const step = steps[stepIndex];
  const progressPct =
    steps.length > 1 ? Math.round((stepIndex / (steps.length - 1)) * 100) : 0;

  useEffect(() => {
    if (!step || appendedSteps.current.has(stepIndex)) return;
    appendedSteps.current.add(stepIndex);
    const text = stepToTeacherText(step);
    if (text) appendTeacherChatMessage(setMessages, text);
  }, [step, stepIndex]);

  useEffect(() => {
    appendedSteps.current.clear();
    setMessages([
      {
        id: newChatId(),
        role: "teacher",
        text: `안녕! 나는 **${AI_TEACHER.name}**이야. 아래에서 **다음**으로 차례대로 배우고, 궁금한 건 **채팅**으로 물어봐!`,
      },
    ]);
    setStepIndex(0);
  }, [subjectId, unitId]);

  const goNext = useCallback(() => {
    setQuizSelected(null);
    setQuizRevealed(false);
    setStepIndex((i) => Math.min(i + 1, steps.length - 1));
  }, [steps.length]);

  const handleCheck = useCallback(
    (understood: boolean) => {
      if (!result || !step || step.kind !== "check") return;
      if (understood) {
        appendTeacherChatMessage(setMessages, "좋아! 다음으로 넘어갈게 ✓");
        if (unitUsesSections(result.unit)) {
          markComplete(
            getSectionKey(result.subject.id, result.unit.id, step.sectionId)
          );
        }
        goNext();
        return;
      }
      appendTeacherChatMessage(
        setMessages,
        "괜찮아, 같은 내용을 다시 볼게!"
      );
      const rewind = steps.findIndex(
        (s) =>
          s.kind === "teach" && s.sectionTitle === step.sectionTitle
      );
      if (rewind >= 0) {
        appendedSteps.current.delete(rewind);
        setStepIndex(rewind);
      }
    },
    [result, step, steps, markComplete, goNext]
  );

  const handleQuizSelect = useCallback(
    (optionId: string) => {
      if (!step || step.kind !== "quiz" || quizRevealed) return;
      setQuizSelected(optionId);
      setQuizRevealed(true);
      const correct = optionId === step.quiz.correctId;
      const opt = step.quiz.options.find((o) => o.id === optionId);
      appendTeacherChatMessage(
        setMessages,
        `내 답: ${opt?.text ?? optionId}`
      );
      appendTeacherChatMessage(
        setMessages,
        correct
          ? `정답이야! 🎉 ${step.quiz.explanation}`
          : `아쉽게도 틀렸어. 정답은 **${step.quiz.options.find((o) => o.id === step.quiz.correctId)?.text}**. ${step.quiz.explanation}`
      );
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

  const showNext =
    step.kind !== "check" &&
    step.kind !== "complete" &&
    !(step.kind === "quiz" && !quizRevealed);

  return (
    <main
      className="page ai-teacher-learn ai-teacher-learn--chat"
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

      <header className="ai-teacher-learn__header ai-teacher-learn__header--chat">
        <AiTeacherAvatar size="xl" speaking />
        <div className="ai-teacher-learn__header-text">
          <p className="subject-meta">{subject.name}</p>
          <h1 className="ai-teacher-learn__title">{unit.title}</h1>
          <p className="ai-teacher-learn__teacher-name">{AI_TEACHER.name}</p>
        </div>
        <div className="progress-bar-wrap ai-teacher-learn__progress">
          <div className="progress-label">
            <span>학습 진도</span>
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

      <AiTeacherChat
        messages={messages}
        setMessages={setMessages}
        subjectName={subject.name}
        unitTitle={unit.title}
        unitContext={unitContext}
        subjectColor={subject.color}
      />

      <StepActions
        step={step}
        subjectColor={subject.color}
        quizSelected={quizSelected}
        quizRevealed={quizRevealed}
        onQuizSelect={handleQuizSelect}
        onCheck={handleCheck}
        onNext={goNext}
        showNext={showNext}
        unitPath={unitPath}
        quizPath={quizPath}
        hubPath={hubPath}
        onComplete={() => {
          recordDailyActivity();
          markComplete(getUnitQuizKey(subject.id, unit.id));
          appendTeacherChatMessage(
            setMessages,
            "학습 완료로 표시했어! 수고했어 🎉"
          );
        }}
      />
    </main>
  );
}

type StepActionsProps = {
  step: AiTeacherStep;
  subjectColor: string;
  quizSelected: string | null;
  quizRevealed: boolean;
  onQuizSelect: (id: string) => void;
  onCheck: (understood: boolean) => void;
  onNext: () => void;
  showNext: boolean;
  unitPath: string;
  quizPath: string;
  hubPath: string;
  onComplete: () => void;
};

function StepActions({
  step,
  subjectColor,
  quizRevealed,
  onQuizSelect,
  onCheck,
  onNext,
  showNext,
  unitPath,
  quizPath,
  hubPath,
  onComplete,
}: StepActionsProps) {
  if (step.kind === "check") {
    return (
      <div className="ai-teacher-step-actions">
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
    );
  }

  if (step.kind === "quiz" && !quizRevealed) {
    return (
      <div className="ai-teacher-step-actions ai-teacher-step-actions--quiz">
        <p className="ai-teacher-step-actions__label">선택하세요</p>
        <ul className="quiz-options">
          {step.quiz.options.map((opt) => (
            <li key={opt.id}>
              <button
                type="button"
                className="quiz-option"
                onClick={() => onQuizSelect(opt.id)}
              >
                {opt.text}
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (step.kind === "quiz" && quizRevealed) {
    return (
      <div className="ai-teacher-step-actions">
        <button
          type="button"
          className="btn btn-primary btn-block"
          style={{ background: subjectColor }}
          onClick={onNext}
        >
          다음 →
        </button>
      </div>
    );
  }

  if (step.kind === "complete") {
    return (
      <div className="ai-teacher-step-actions ai-teacher-step-actions--column">
        <button type="button" className="btn btn-primary btn-block" onClick={onComplete}>
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
    );
  }

  if (showNext) {
    return (
      <div className="ai-teacher-step-actions">
        <button
          type="button"
          className="btn btn-primary btn-block"
          style={{ background: subjectColor }}
          onClick={onNext}
        >
          다음 학습 →
        </button>
      </div>
    );
  }

  return null;
}
