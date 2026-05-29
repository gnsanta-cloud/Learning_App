import { readJson, writeJson, todayKey } from "./storage";

const STREAK_KEY = "learning-app-streak-v1";

type StreakData = {
  dates: string[];
};

function load(): StreakData {
  return readJson(STREAK_KEY, { dates: [] });
}

function save(data: StreakData) {
  writeJson(STREAK_KEY, data);
}

export function recordDailyActivity(): void {
  const today = todayKey();
  const data = load();
  if (!data.dates.includes(today)) {
    save({ dates: [...data.dates, today].sort() });
  }
}

function parseDate(key: string): Date {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function dayDiff(a: string, b: string): number {
  const ms = parseDate(a).getTime() - parseDate(b).getTime();
  return Math.round(ms / 86400000);
}

export function computeStreak(dates: string[]): {
  current: number;
  longest: number;
  todayDone: boolean;
  recentDays: string[];
} {
  const unique = [...new Set(dates)].sort();
  const today = todayKey();
  const todayDone = unique.includes(today);

  let current = 0;
  if (todayDone) {
    current = 1;
    let cursor = today;
    for (let i = unique.length - 2; i >= 0; i--) {
      if (dayDiff(cursor, unique[i]) === 1) {
        current++;
        cursor = unique[i];
      } else break;
    }
  } else {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yKey = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, "0")}-${String(yesterday.getDate()).padStart(2, "0")}`;
    if (unique.includes(yKey)) {
      current = 1;
      let cursor = yKey;
      for (let i = unique.indexOf(yKey) - 1; i >= 0; i--) {
        if (dayDiff(cursor, unique[i]) === 1) {
          current++;
          cursor = unique[i];
        } else break;
      }
    }
  }

  let longest = 0;
  let run = unique.length > 0 ? 1 : 0;
  for (let i = 1; i < unique.length; i++) {
    if (dayDiff(unique[i], unique[i - 1]) === 1) run++;
    else {
      longest = Math.max(longest, run);
      run = 1;
    }
  }
  longest = Math.max(longest, run);

  const recentDays: string[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    recentDays.push(key);
  }

  return { current, longest, todayDone, recentDays };
}

export function getStreakStats() {
  const data = load();
  return { ...computeStreak(data.dates), allDates: data.dates };
}
