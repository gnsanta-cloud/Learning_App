import { useNavigate } from "react-router-dom";
import type { ExamScopeItem } from "../types";
import { useExamChecklist } from "../hooks/useExamChecklist";

type Props = {
  subjectId: string;
  items: ExamScopeItem[];
  color: string;
};

export function ExamChecklist({ subjectId, items, color }: Props) {
  const navigate = useNavigate();
  const { isChecked, toggle, countChecked } = useExamChecklist(subjectId);
  const ids = items.map((i) => i.id);
  const done = countChecked(ids);

  const checkedUnitIds = items
    .filter((item) => isChecked(item.id))
    .map((item) => item.unitId);

  const handleSampleExam = () => {
    if (checkedUnitIds.length === 0) return;
    const params = new URLSearchParams({
      units: checkedUnitIds.join(","),
    });
    navigate(`/subject/${subjectId}/sample-exam?${params.toString()}`);
  };

  return (
    <section
      className="exam-section"
      aria-label="시험 범위 체크리스트"
      style={{ "--subject-color": color } as React.CSSProperties}
    >
      <div className="exam-header">
        <h2 className="section-title" style={{ margin: 0 }}>
          시험 범위 체크
        </h2>
        <span className="exam-count" style={{ color }}>
          {done}/{items.length}
        </span>
      </div>
      <p className="exam-hint">
        학교 시험 범위에 맞게 대단원을 체크한 뒤, 기말고사 샘플문제를
        풀어보세요.
      </p>
      <ul className="exam-list">
        {items.map((item) => {
          const on = isChecked(item.id);
          return (
            <li key={item.id}>
              <label className={`exam-item ${on ? "checked" : ""}`}>
                <input
                  type="checkbox"
                  checked={on}
                  onChange={() => toggle(item.id)}
                />
                <span className="exam-item-body">
                  <span className="exam-item-label">{item.label}</span>
                  {item.hint && (
                    <span className="exam-item-hint">{item.hint}</span>
                  )}
                </span>
              </label>
            </li>
          );
        })}
      </ul>
      <button
        type="button"
        className="btn btn-primary exam-sample-btn"
        disabled={checkedUnitIds.length === 0}
        onClick={handleSampleExam}
      >
        기말고사 샘플문제
        {checkedUnitIds.length > 0 && (
          <span className="exam-sample-btn-meta">
            {checkedUnitIds.length}개 대단원
          </span>
        )}
      </button>
    </section>
  );
}
