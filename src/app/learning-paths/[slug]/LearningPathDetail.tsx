"use client";

import Link from "next/link";
import { CheckCircle2, Circle } from "lucide-react";
import type { LearningPath } from "@/types";
import { useProgress } from "@/lib/hooks";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { getLearningPathModuleProgress } from "@/data";
import { estimatePathTimeline } from "@/lib/path-timeline";
import { formatHours } from "@/lib/utils";

export function LearningPathDetail({ path }: { path: LearningPath }) {
  const { progress, loaded, setActiveLearningPath } = useProgress();
  const pct = loaded
    ? getLearningPathModuleProgress(path, progress.completedTopics)
    : 0;
  const timeline = loaded
    ? estimatePathTimeline(path, progress)
    : null;

  return (
    <div className="mt-8 space-y-6">
      {loaded && (
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">Progress</span>
            <span className="text-sm text-muted">{pct}%</span>
          </div>
          <ProgressBar value={pct} className="mt-2" />
          {timeline && timeline.modulesRemaining > 0 && (
            <p className="mt-2 text-sm text-muted">
              ~{formatHours(timeline.remainingHours)} remaining · about{" "}
              {timeline.weeksAtPace} week{timeline.weeksAtPace !== 1 ? "s" : ""}{" "}
              at 8h/week
            </p>
          )}
          <button
            onClick={() => setActiveLearningPath(path.id)}
            className="mt-3 text-sm text-accent hover:underline"
          >
            Set as active learning path
          </button>
        </div>
      )}

      {path.prerequisites.length > 0 && (
        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="text-sm font-semibold text-foreground">Prerequisites</h2>
          <p className="mt-1 text-sm text-muted">
            Recommended paths to complete before starting this curriculum.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {path.prerequisites.map((pre) => (
              <span
                key={pre}
                className="rounded-md bg-muted-bg px-3 py-1 text-sm text-muted"
              >
                {pre.replace("path-", "").replace(/-/g, " ")}
              </span>
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="text-lg font-semibold text-foreground">Modules</h2>
        <ol className="mt-4 space-y-3">
          {path.modules.map((mod, i) => {
            const done =
              loaded && progress.completedTopics.includes(mod.topicId);
            return (
              <li
                key={mod.id}
                className="flex gap-4 rounded-xl border border-border bg-card p-4"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent/10 text-sm font-bold text-accent">
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    {done ? (
                      <CheckCircle2 className="h-4 w-4 text-success" />
                    ) : (
                      <Circle className="h-4 w-4 text-muted" />
                    )}
                    <Link
                      href={`/sections/${mod.sectionSlug}/${mod.topicId}`}
                      className="font-medium text-foreground hover:text-accent"
                    >
                      {mod.title}
                    </Link>
                  </div>
                  <p className="mt-1 text-xs text-muted">
                    {mod.estimatedHours}h estimated
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
