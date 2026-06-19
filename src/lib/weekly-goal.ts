import type { UserProgress } from "@/types";

export interface WeeklyGoalState {
  weekKey: string;
  topicsTarget: number;
  labsTarget: number;
  topicsDone: number;
  labsDone: number;
}

function currentWeekKey(): string {
  const d = new Date();
  const onejan = new Date(d.getFullYear(), 0, 1);
  const week = Math.ceil(
    ((d.getTime() - onejan.getTime()) / 86400000 + onejan.getDay() + 1) / 7
  );
  return `${d.getFullYear()}-W${week}`;
}

export function getWeeklyGoal(progress: UserProgress): WeeklyGoalState {
  const weekKey = currentWeekKey();
  const goal = progress.weeklyGoal ?? {
    weekKey,
    topicsTarget: 2,
    labsTarget: 1,
  };

  const activeWeek = goal.weekKey === weekKey ? goal : {
    weekKey,
    topicsTarget: goal.topicsTarget,
    labsTarget: goal.labsTarget,
  };

  const weekStart = getWeekStart();
  const topicsDone = (progress.weeklyCompletions?.topics ?? []).filter(
    (id) => (progress.topicCompletedAt?.[id] ?? 0) >= weekStart
  ).length;
  const labsDone = (progress.weeklyCompletions?.labs ?? []).filter(
    (id) => (progress.labCompletedAt?.[id] ?? 0) >= weekStart
  ).length;

  return {
    weekKey: activeWeek.weekKey,
    topicsTarget: activeWeek.topicsTarget,
    labsTarget: activeWeek.labsTarget,
    topicsDone,
    labsDone,
  };
}

function getWeekStart(): number {
  const d = new Date();
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(d.setDate(diff));
  monday.setHours(0, 0, 0, 0);
  return monday.getTime();
}

export function defaultWeeklyGoal() {
  return {
    weekKey: currentWeekKey(),
    topicsTarget: 2,
    labsTarget: 1,
  };
}
