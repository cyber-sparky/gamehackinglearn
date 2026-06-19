"use client";

import Link from "next/link";
import { PlayCircle } from "lucide-react";
import { useProgress } from "@/lib/hooks";
import { getContinueLearning } from "@/lib/continue-learning";
import { ProgressBar } from "@/components/ui/ProgressBar";

export function ContinueLearningCard() {
  const { progress, loaded } = useProgress();
  if (!loaded) return null;

  const items = getContinueLearning(progress, 1);
  const item = items[0];
  if (!item) return null;

  return (
    <section className="rounded-xl border border-accent/30 bg-gradient-to-r from-accent/10 to-card p-6">
      <div className="flex items-center gap-2">
        <PlayCircle className="h-5 w-5 text-accent" />
        <h2 className="text-lg font-semibold text-foreground">Continue learning</h2>
      </div>
      <p className="mt-1 text-sm text-muted">{item.reason}</p>
      <Link
        href={item.href}
        className="mt-3 block font-medium text-foreground hover:text-accent"
      >
        {item.title} →
      </Link>
      <p className="mt-1 text-sm text-accent">{item.nextStep}</p>
      <ProgressBar value={item.masteryPercent} className="mt-3" />
    </section>
  );
}

export function ContinueLearningList({ limit = 3 }: { limit?: number }) {
  const { progress, loaded } = useProgress();
  if (!loaded) return null;

  const items = getContinueLearning(progress, limit);
  if (items.length === 0) return null;

  return (
    <section className="space-y-3">
      {items.map((item) => (
        <Link
          key={item.topicId}
          href={item.href}
          className="block rounded-lg border border-border bg-card p-4 transition-colors hover:border-accent/30"
        >
          <div className="flex justify-between gap-2">
            <span className="font-medium text-foreground">{item.title}</span>
            <span className="text-xs text-muted">{item.masteryPercent}%</span>
          </div>
          <p className="mt-1 text-xs text-accent">{item.nextStep}</p>
          <ProgressBar value={item.masteryPercent} className="mt-2" showLabel={false} />
        </Link>
      ))}
    </section>
  );
}
