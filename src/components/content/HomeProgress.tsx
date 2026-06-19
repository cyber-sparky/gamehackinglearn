"use client";

import { sections, getSectionProgress } from "@/data";
import { useProgress } from "@/lib/hooks";
import { ProgressBar } from "@/components/ui/ProgressBar";

export function HomeProgress() {
  const { progress, loaded } = useProgress();

  if (!loaded) return null;

  const totalTopics = sections.reduce((s, sec) => s + sec.topics.length, 0);
  const completed = progress.completedTopics.length;
  const overallPercent =
    totalTopics > 0 ? Math.round((completed / totalTopics) * 100) : 0;

  if (completed === 0 && progress.completedLabs.length === 0) return null;

  return (
    <section className="mt-8 rounded-xl border border-border bg-card p-6">
      <h2 className="text-lg font-semibold text-foreground">Your Progress</h2>
      <div className="mt-4">
        <ProgressBar value={overallPercent} />
        <p className="mt-2 text-sm text-muted">
          {completed} of {totalTopics} topics completed ·{" "}
          {progress.completedLabs.length} labs completed
        </p>
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {sections
          .filter((s) => getSectionProgress(s.slug, progress.completedTopics) > 0)
          .map((s) => (
            <div key={s.slug} className="rounded-lg bg-muted-bg/50 p-3">
              <p className="text-sm font-medium text-foreground">{s.title}</p>
              <ProgressBar
                value={getSectionProgress(s.slug, progress.completedTopics)}
                className="mt-2"
              />
            </div>
          ))}
      </div>
    </section>
  );
}
