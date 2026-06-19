"use client";

import { CheckCircle2, Clock } from "lucide-react";
import type { Lab } from "@/types";
import { DifficultyBadge, TagBadge } from "@/components/ui/Badge";
import { BookmarkButton } from "@/components/ui/BookmarkButton";
import { useProgress } from "@/lib/hooks";
import { getLabStepProgress } from "@/lib/mastery";
import { formatHours, cn } from "@/lib/utils";

export function LabCard({ lab }: { lab: Lab }) {
  const { progress, toggleLab, toggleLabStep, confirmLabOutcome, loaded } =
    useProgress();
  const completed = loaded && progress.completedLabs.includes(lab.id);
  const steps = loaded
    ? getLabStepProgress(lab.id, lab.steps.length, progress)
    : lab.steps.map(() => false);
  const stepsDone = steps.filter(Boolean).length;

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
            {loaded && (
              <span className="text-xs text-muted">
                Steps {stepsDone}/{lab.steps.length}
              </span>
            )}
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
          {lab.learningGoals && lab.learningGoals.length > 0 && (
            <>
              <h4 className="mt-4 text-xs font-semibold uppercase tracking-wide text-muted">
                Learning Goals
              </h4>
              <ul className="mt-2 space-y-1">
                {lab.learningGoals.map((goal, i) => (
                  <li key={i} className="flex gap-2 text-sm text-muted">
                    <span className="text-accent">•</span>
                    {goal}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wide text-muted">
            Steps
            {loaded && stepsDone < lab.steps.length && (
              <span className="ml-2 normal-case text-accent">
                Check each step as you go
              </span>
            )}
          </h4>
          <ol className="mt-2 space-y-2">
            {lab.steps.map((step, i) => (
              <li key={i} className="flex gap-2 text-sm text-muted">
                {loaded ? (
                  <button
                    type="button"
                    onClick={() =>
                      toggleLabStep(lab.id, i, lab.steps.length)
                    }
                    className={cn(
                      "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border text-xs",
                      steps[i]
                        ? "border-success bg-success/10 text-success"
                        : "border-border hover:border-accent"
                    )}
                    aria-label={`Step ${i + 1}`}
                  >
                    {steps[i] ? "✓" : i + 1}
                  </button>
                ) : (
                  <span className="shrink-0 font-mono text-xs text-accent">
                    {i + 1}.
                  </span>
                )}
                <span className={cn(steps[i] && "text-foreground line-through opacity-70")}>
                  {step}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {lab.skillsRequired && lab.skillsRequired.length > 0 && (
        <div className="mt-4">
          <h4 className="text-xs font-semibold uppercase tracking-wide text-muted">
            Skills Required
          </h4>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {lab.skillsRequired.map((skill) => (
              <TagBadge key={skill} tag={skill} />
            ))}
          </div>
        </div>
      )}

      {lab.setupInstructions && lab.setupInstructions.length > 0 && (
        <div className="mt-4 rounded-lg border border-border bg-muted-bg/30 p-4">
          <h4 className="text-xs font-semibold uppercase tracking-wide text-muted">
            Setup
          </h4>
          <ol className="mt-2 space-y-1">
            {lab.setupInstructions.map((step, i) => (
              <li key={i} className="text-sm text-muted">
                {i + 1}. {step}
              </li>
            ))}
          </ol>
        </div>
      )}

      {lab.hints && lab.hints.length > 0 && (
        <details className="mt-4 rounded-lg border border-border p-4">
          <summary className="cursor-pointer text-sm font-medium text-foreground">
            Hints ({lab.hints.length})
          </summary>
          <ul className="mt-2 space-y-1">
            {lab.hints.map((hint, i) => (
              <li key={i} className="text-sm text-muted">
                {i + 1}. {hint}
              </li>
            ))}
          </ul>
        </details>
      )}

      {lab.expectedOutcome && (
        <div className="mt-4 rounded-lg border border-success/20 bg-success/5 p-4">
          <h4 className="text-xs font-semibold uppercase tracking-wide text-success">
            Expected Outcome
          </h4>
          <p className="mt-1 text-sm text-muted">{lab.expectedOutcome}</p>
          {loaded && (
            <label className="mt-3 flex cursor-pointer items-start gap-2 text-sm">
              <input
                type="checkbox"
                checked={!!progress.labOutcomeConfirmed?.[lab.id]}
                onChange={(e) => confirmLabOutcome(lab.id, e.target.checked)}
                className="mt-1"
              />
              <span className="text-foreground">
                I achieved this outcome and documented my findings
              </span>
            </label>
          )}
        </div>
      )}

      <div className="mt-4 flex flex-wrap gap-1.5">
        {lab.tags.map((tag) => (
          <TagBadge key={tag} tag={tag} />
        ))}
      </div>
    </div>
  );
}
