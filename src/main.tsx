import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { registerSW } from "virtual:pwa-register";
import { App } from "./App";
import { applyTheme, type ThemeMode } from "./hooks/useTheme";
import { readJson } from "./lib/storage";
import "./styles/global.css";

applyTheme(readJson<ThemeMode>("learning-app-theme-v1", "system"));

const updateSW = registerSW({
  onNeedRefresh() {
    if (confirm("새 버전이 있습니다. 지금 업데이트할까요?")) {
      updateSW(true);
    }
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
