/** API 응답에서 ```markdown ... ``` 감싸기 제거 */
export function stripCodeFence(text) {
  let s = text.trim();
  const m = s.match(/^```(?:markdown|md)?\s*\n?([\s\S]*?)\n?```$/i);
  if (m) s = m[1].trim();
  return s;
}

export function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}
