"use client";

import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { learningPaths, getLearningPathModuleProgress } from "@/data";
import { DifficultyBadge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { useProgress } from "@/lib/hooks";
import { formatHours } from "@/lib/utils";

export default function LearningPathsPage() {
  const { progress, loaded, setActiveLearningPath } = useProgress();

  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="text-3xl font-bold text-foreground">Learning Paths</h1>
      <p className="mt-2 max-w-3xl text-lg text-muted">
        Structured curricula with prerequisites, ordered modules, and progress
        tracking. Select a path to focus your studies.
      </p>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {learningPaths.map((path) => {
          const pct = loaded
            ? getLearningPathModuleProgress(path, progress.completedTopics)
            : 0;
          const isActive = progress.activeLearningPath === path.id;

          return (
            <div
              key={path.slug}
              className="rounded-xl border border-border bg-card p-6 transition-all hover:border-accent/30"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <DifficultyBadge difficulty={path.difficulty} />
                    {isActive && (
                      <span className="rounded-md bg-accent/10 px-2 py-0.5 text-xs font-medium text-accent">
                        Active
                      </span>
                    )}
                  </div>
                  <h2 className="mt-2 text-xl font-semibold text-foreground">
                    {path.title}
                  </h2>
                  <p className="mt-1 text-sm text-muted">{path.description}</p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-muted">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {formatHours(path.estimatedHours)}
                </span>
                <span>{path.modules.length} modules</span>
                {path.prerequisites.length > 0 && (
                  <span>{path.prerequisites.length} prerequisites</span>
                )}
              </div>

              {loaded && pct > 0 && (
                <div className="mt-4">
                  <ProgressBar value={pct} />
                  <p className="mt-1 text-xs text-muted">{pct}% complete</p>
                </div>
              )}

              <div className="mt-4 flex flex-wrap gap-2">
                <Link
                  href={`/learning-paths/${path.slug}`}
                  className="inline-flex items-center gap-1 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
                >
                  View path <ArrowRight className="h-4 w-4" />
                </Link>
                <button
                  onClick={() => setActiveLearningPath(path.id)}
                  className="rounded-lg border border-border px-4 py-2 text-sm text-muted transition-colors hover:border-accent/30 hover:text-foreground"
                >
                  Set as active
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
