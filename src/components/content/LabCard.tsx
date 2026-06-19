"use client";

import { CheckCircle2, Clock } from "lucide-react";
import type { Lab } from "@/types";
import { DifficultyBadge, TagBadge } from "@/components/ui/Badge";
import { BookmarkButton } from "@/components/ui/BookmarkButton";
import { useProgress } from "@/lib/hooks";
import { formatHours, cn } from "@/lib/utils";

export function LabCard({ lab }: { lab: Lab }) {
  const { progress, toggleLab, loaded } = useProgress();
  const completed = loaded && progress.completedLabs.includes(lab.id);

  return (
    <div
      id={lab.id}
      className={cn(
        "rounded-xl border bg-card p-5 scroll-mt-24 transition-colors",
        completed ? "border-success/30" : "border-border"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <DifficultyBadge difficulty={lab.difficulty} />
            <span className="flex items-center gap-1 text-xs text-muted">
              <Clock className="h-3 w-3" />
              {formatHours(lab.estimatedHours)}
            </span>
          </div>
          <h3 className="mt-2 text-lg font-semibold text-foreground">
            {lab.title}
          </h3>
          <p className="mt-1 text-sm text-muted">{lab.description}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => toggleLab(lab.id)}
            className={cn(
              "rounded-lg border p-2 transition-colors",
              completed
                ? "border-success/50 bg-success/10 text-success"
                : "border-border text-muted hover:border-success/30 hover:text-success"
            )}
            aria-label={completed ? "Mark lab incomplete" : "Mark lab complete"}
          >
            <CheckCircle2 className={cn("h-5 w-5", completed && "fill-success/20")} />
          </button>
          <BookmarkButton type="labs" id={lab.id} />
        </div>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wide text-muted">
            Objectives
          </h4>
          <ul className="mt-2 space-y-1">
            {lab.objectives.map((obj, i) => (
              <li key={i} className="flex gap-2 text-sm text-muted">
                <span className="text-accent">•</span>
                {obj}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wide text-muted">
            Steps
          </h4>
          <ol className="mt-2 space-y-1">
            {lab.steps.map((step, i) => (
              <li key={i} className="flex gap-2 text-sm text-muted">
                <span className="shrink-0 font-mono text-xs text-accent">
                  {i + 1}.
                </span>
                {step}
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {lab.tags.map((tag) => (
          <TagBadge key={tag} tag={tag} />
        ))}
      </div>
    </div>
  );
}
