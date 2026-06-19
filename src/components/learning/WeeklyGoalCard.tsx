"use client";

import Link from "next/link";
import { useProgress } from "@/lib/hooks";
import { getWeeklyGoal } from "@/lib/weekly-goal";
import { ProgressBar } from "@/components/ui/ProgressBar";

export function WeeklyGoalCard() {
  const { progress, loaded, setWeeklyGoalTargets } = useProgress();
  if (!loaded) return null;

  const goal = getWeeklyGoal(progress);
  const topicPct = Math.min(
    100,
    Math.round((goal.topicsDone / goal.topicsTarget) * 100)
  );
  const labPct = Math.min(
    100,
    Math.round((goal.labsDone / goal.labsTarget) * 100)
  );

  return (
    <section className="rounded-xl border border-border bg-card p-6">
      <h2 className="text-lg font-semibold text-foreground">Weekly goal</h2>
      <p className="mt-1 text-sm text-muted">
        {goal.topicsTarget} topics · {goal.labsTarget} lab
        {goal.labsTarget !== 1 ? "s" : ""} this week
      </p>
      <div className="mt-4 space-y-3">
        <div>
          <div className="flex justify-between text-sm">
            <span className="text-muted">Topics</span>
            <span>
              {goal.topicsDone}/{goal.topicsTarget}
            </span>
          </div>
          <ProgressBar value={topicPct} className="mt-1" showLabel={false} />
        </div>
        <div>
          <div className="flex justify-between text-sm">
            <span className="text-muted">Labs</span>
            <span>
              {goal.labsDone}/{goal.labsTarget}
            </span>
          </div>
          <ProgressBar value={labPct} className="mt-1" showLabel={false} />
        </div>
      </div>
      <div className="mt-4 flex gap-2 text-xs">
        {[1, 2, 3].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => setWeeklyGoalTargets(n, goal.labsTarget)}
            className="rounded border border-border px-2 py-1 hover:bg-muted-bg"
          >
            {n} topics
          </button>
        ))}
      </div>
      <Link
        href="/dashboard"
        className="mt-3 inline-block text-xs text-accent hover:underline"
      >
        View full dashboard
      </Link>
    </section>
  );
}
