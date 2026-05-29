import type { ExamScopeItem } from "../types";
import { useExamChecklist } from "../hooks/useExamChecklist";

type Props = {
  subjectId: string;
  items: ExamScopeItem[];
  color: string;
};

export function ExamChecklist({ subjectId, items, color }: Props) {
  const { isChecked, toggle, countChecked } = useExamChecklist(subjectId);
  const ids = items.map((i) => i.id);
  const done = countChecked(ids);

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
        학교 시험 범위에 맞게 항목을 추가·해제하며 복습하세요.
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
    </section>
  );
}
