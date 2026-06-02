const SEP = ":";

/** 과목·문항 ID를 localStorage·오답 노트용 전역 키로 만듭니다. */
export function scopedQuizId(subjectId: string, rawId: string): string {
  if (rawId.startsWith(`${subjectId}${SEP}`)) return rawId;
  return `${subjectId}${SEP}${rawId}`;
}

export function parseScopedQuizId(
  id: string
): { subjectId: string; rawId: string } | null {
  const idx = id.indexOf(SEP);
  if (idx <= 0) return null;
  return { subjectId: id.slice(0, idx), rawId: id.slice(idx + 1) };
}
