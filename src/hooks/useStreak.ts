import { useCallback, useEffect, useState } from "react";
import {
  getStreakStats,
  recordDailyActivity,
} from "../lib/activity";

export function useStreak() {
  const [stats, setStats] = useState(getStreakStats);

  const refresh = useCallback(() => {
    setStats(getStreakStats());
  }, []);

  const recordActivity = useCallback(() => {
    recordDailyActivity();
    refresh();
  }, [refresh]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { ...stats, recordActivity, refresh };
}
