import { useCallback, useEffect, useState } from "react";
import { readJson, writeJson } from "../lib/storage";

export type ThemeMode = "light" | "dark" | "system";

const THEME_KEY = "learning-app-theme-v1";

function getSystemDark(): boolean {
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function resolveDark(mode: ThemeMode): boolean {
  if (mode === "dark") return true;
  if (mode === "light") return false;
  return getSystemDark();
}

export function applyTheme(mode: ThemeMode) {
  const dark = resolveDark(mode);
  document.documentElement.dataset.theme = dark ? "dark" : "light";
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", dark ? "#0f172a" : "#1e3a5f");
}

export function useTheme() {
  const [mode, setModeState] = useState<ThemeMode>(() =>
    readJson<ThemeMode>(THEME_KEY, "system")
  );

  useEffect(() => {
    applyTheme(mode);
    writeJson(THEME_KEY, mode);
  }, [mode]);

  useEffect(() => {
    if (mode !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => applyTheme("system");
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [mode]);

  const setMode = useCallback((next: ThemeMode) => {
    setModeState(next);
  }, []);

  const isDark =
    mode === "dark" || (mode === "system" && getSystemDark());

  return { mode, setMode, isDark };
}
