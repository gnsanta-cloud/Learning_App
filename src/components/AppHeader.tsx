import { Link, useLocation } from "react-router-dom";
import { useTheme, type ThemeMode } from "../hooks/useTheme";

const MODES: { id: ThemeMode; label: string }[] = [
  { id: "light", label: "라이트" },
  { id: "dark", label: "다크" },
  { id: "system", label: "시스템" },
];

export function AppHeader() {
  const { pathname } = useLocation();
  const { mode, setMode } = useTheme();
  const isHome = pathname === "/";

  return (
    <header className="app-header">
      <div className="app-header-inner">
        {isHome ? (
          <span className="app-header-brand">중1 학습</span>
        ) : (
          <Link to="/" className="app-header-brand app-header-brand-link">
            중1 학습
          </Link>
        )}
        <div className="app-header-actions">
          <div
            className="theme-toggle"
            role="group"
            aria-label="테마 선택"
          >
            {MODES.map((m) => (
              <button
                key={m.id}
                type="button"
                className={`theme-toggle-btn ${mode === m.id ? "active" : ""}`}
                onClick={() => setMode(m.id)}
                aria-pressed={mode === m.id}
              >
                {m.label}
              </button>
            ))}
          </div>
          <Link
            to="/settings"
            className="settings-link"
            aria-label="설정"
            title="설정"
          >
            ⚙
          </Link>
        </div>
      </div>
    </header>
  );
}
