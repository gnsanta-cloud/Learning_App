import { Link, useParams } from "react-router-dom";
import { QuizSession } from "../components/QuizSession";
import { getUnitQuizzes } from "../lib/geminiContent";
import { getUnit, getUnitQuizKey, unitUsesSections } from "../data/subjects";
import { useProgress } from "../hooks/useProgress";

export function UnitQuizPage() {
  const { subjectId, unitId } = useParams<{
    subjectId: string;
    unitId: string;
  }>();
  const result =
    subjectId && unitId ? getUnit(subjectId, unitId) : undefined;
  const { markComplete } = useProgress();

  if (!result) {
    return (
      <main className="page">
        <p>단원을 찾을 수 없습니다.</p>
        <Link to="/">홈으로</Link>
      </main>
    );
  }

  const { subject, unit } = result;
  const quizzes = getUnitQuizzes(unit);
  const unitPath = `/subject/${subject.id}/unit/${unit.id}`;

  if (quizzes.length === 0) {
    return (
      <main className="page">
        <p>이 단원에는 퀴즈가 없습니다.</p>
        <Link to={unitPath}>단원으로</Link>
      </main>
    );
  }

  return (
    <QuizSession
      quizzes={quizzes}
      subjectColor={subject.color}
      subjectAccent={subject.accent}
      backLabel={unit.title}
      backTo={unitPath}
      badge={unitUsesSections(unit) ? "단원 퀴즈 · 20문항" : undefined}
      onComplete={() => markComplete(getUnitQuizKey(subject.id, unit.id))}
      doneLinks={[
        { to: unitPath, label: "단원으로 돌아가기" },
        { to: `/subject/${subject.id}`, label: "과목 목록" },
      ]}
    />
  );
}
