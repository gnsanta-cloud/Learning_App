import { todayKey } from "../lib/storage";
import { useStreak } from "../hooks/useStreak";

const DAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"];

export function StreakCard() {
  const { current, longest, todayDone, recentDays, allDates } = useStreak();
  const today = todayKey();

  return (
    <section className="streak-card" aria-label="학습 연속 기록">
      <div className="streak-top">
        <div>
          <p className="streak-label">오늘 학습</p>
          <p className="streak-value">
            {todayDone ? (
              <span className="streak-done">완료 ✓</span>
            ) : (
              <span className="streak-pending">아직 없음</span>
            )}
          </p>
        </div>
        <div className="streak-stat">
          <span className="streak-fire" aria-hidden>
            🔥
          </span>
          <span className="streak-count">{current}</span>
          <span className="streak-unit">일 연속</span>
        </div>
      </div>

      <div className="streak-week" aria-label="최근 7일">
        {recentDays.map((key) => {
          const d = new Date(key);
          const label = DAY_LABELS[d.getDay()];
          const active = allDates.includes(key);
          const isToday = key === today;
          return (
            <div
              key={key}
              className={`streak-day ${active ? "active" : ""} ${isToday ? "today" : ""}`}
            >
              <span className="streak-day-dot" />
              <span className="streak-day-label">{label}</span>
            </div>
          );
        })}
      </div>

      <p className="streak-meta">최장 연속 {longest}일 · 퀴즈·학습 완료 시 기록</p>
    </section>
  );
}
