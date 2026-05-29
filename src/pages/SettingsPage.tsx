import { Link } from "react-router-dom";
import { useProgress } from "../hooks/useProgress";
import { useStreak } from "../hooks/useStreak";
import { useTheme, type ThemeMode } from "../hooks/useTheme";
import { useWrongAnswers } from "../hooks/useWrongAnswers";
import { writeJson } from "../lib/storage";
import { siteConfig } from "../config/site";

const EXAM_KEY = "learning-app-exam-v1";

export function SettingsPage() {
  const { resetAll } = useProgress();
  const { current, longest, todayDone } = useStreak();
  const { mode, setMode } = useTheme();
  const { wrongIds, clearAll: clearWrongAll } = useWrongAnswers();

  const resetExamAll = () => {
    writeJson(EXAM_KEY, {});
    window.location.reload();
  };

  const handleResetProgress = () => {
    if (
      confirm(
        "학습 진도를 모두 초기화할까요? (연속 학습 일수·시험 체크는 유지됩니다)"
      )
    ) {
      resetAll();
    }
  };

  const handleResetAll = () => {
    if (
      confirm(
        "진도, 시험 체크, 연속 학습 기록을 모두 삭제합니다. 계속할까요?"
      )
    ) {
      resetAll();
      clearWrongAll();
      localStorage.removeItem("learning-app-streak-v1");
      writeJson(EXAM_KEY, {});
      window.location.reload();
    }
  };

  return (
    <main className="page">
      <Link to="/" className="back-link">
        ← 홈
      </Link>
      <header className="page-header">
        <h1>설정</h1>
        <p>테마, 데이터 관리</p>
      </header>

      <section className="settings-block">
        <h2 className="section-title">테마</h2>
        <div className="theme-toggle theme-toggle--block" role="group">
          {(
            [
              ["light", "라이트"],
              ["dark", "다크"],
              ["system", "시스템"],
            ] as [ThemeMode, string][]
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              className={`theme-toggle-btn ${mode === id ? "active" : ""}`}
              onClick={() => setMode(id)}
            >
              {label}
            </button>
          ))}
        </div>
      </section>

      <section className="settings-block">
        <h2 className="section-title">학습 연속 기록</h2>
        <div className="settings-stat-grid">
          <div className="settings-stat">
            <span className="settings-stat-num">{current}</span>
            <span>현재 연속</span>
          </div>
          <div className="settings-stat">
            <span className="settings-stat-num">{longest}</span>
            <span>최장 연속</span>
          </div>
          <div className="settings-stat">
            <span className="settings-stat-num">{todayDone ? "✓" : "—"}</span>
            <span>오늘 학습</span>
          </div>
        </div>
      </section>

      <section className="settings-block">
        <h2 className="section-title">오답 노트</h2>
        <p className="settings-hint">
          퀴즈에서 틀린 문항 {wrongIds.length}개가 저장되어 있습니다.
        </p>
        <Link
          to="/review"
          className={`btn btn-primary ${wrongIds.length === 0 ? "btn-disabled" : ""}`}
          style={wrongIds.length === 0 ? { pointerEvents: "none", opacity: 0.5 } : undefined}
        >
          오답 다시 풀기
        </Link>
      </section>

      <section className="settings-block">
        <h2 className="section-title">데이터</h2>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={handleResetProgress}
        >
          학습 진도만 초기화
        </button>
        <button
          type="button"
          className="btn btn-danger"
          onClick={resetExamAll}
        >
          시험 체크리스트만 초기화
        </button>
        <button type="button" className="btn btn-danger" onClick={handleResetAll}>
          모든 데이터 초기화
        </button>
      </section>

      <section className="settings-block">
        <h2 className="section-title">프로젝트</h2>
        <ul className="settings-link-list">
          <li>
            <a
              href={siteConfig.githubRepo}
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub 저장소 ↗
            </a>
          </li>
          <li>
            <a
              href={siteConfig.githubPages}
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub Pages (웹 앱) ↗
            </a>
          </li>
        </ul>
      </section>

      <p className="footer-note">
        버전 0.3.0
        <br />
        데이터는 이 기기 브라우저에만 저장됩니다.
      </p>
    </main>
  );
}
