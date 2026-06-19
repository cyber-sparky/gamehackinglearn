import type { UserProgress } from "@/types";

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function yesterdayKey(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

export function recordStudyActivity(
  progress: UserProgress,
  topicId: string,
  minutes: number
): Partial<UserProgress> {
  const today = todayKey();
  const last = progress.lastStudyDate;
  let streak = progress.studyStreak;

  if (!last) {
    streak = 1;
  } else if (last === today) {
    // same day — keep streak
  } else if (last === yesterdayKey()) {
    streak += 1;
  } else {
    streak = 1;
  }

  return {
    studyMinutes: {
      ...progress.studyMinutes,
      [topicId]: (progress.studyMinutes[topicId] ?? 0) + minutes,
    },
    lastStudyDate: today,
    studyStreak: streak,
  };
}
