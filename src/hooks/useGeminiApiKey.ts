import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "learning-app-gemini-key-v1";

export function useGeminiApiKey() {
  const [apiKey, setApiKeyState] = useState("");

  useEffect(() => {
    try {
      setApiKeyState(localStorage.getItem(STORAGE_KEY) ?? "");
    } catch {
      setApiKeyState("");
    }
  }, []);

  const setApiKey = useCallback((key: string) => {
    const trimmed = key.trim();
    if (trimmed) {
      localStorage.setItem(STORAGE_KEY, trimmed);
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
    setApiKeyState(trimmed);
  }, []);

  const hasApiKey = apiKey.length > 0;

  return { apiKey, setApiKey, hasApiKey };
}
