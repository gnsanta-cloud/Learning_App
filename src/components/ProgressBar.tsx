type Props = {
  done: number;
  total: number;
  color: string;
};

export function ProgressBar({ done, total, color }: Props) {
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  return (
    <div className="progress-bar-wrap">
      <div className="progress-label">
        <span>학습 진도</span>
        <span>
          {done}/{total} ({pct}%)
        </span>
      </div>
      <div className="progress-track">
        <div
          className="progress-fill"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
    </div>
  );
}
