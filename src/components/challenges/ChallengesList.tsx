"use client";

import Link from "next/link";
import { ExternalLink, CheckCircle2 } from "lucide-react";
import type { CrackmeChallenge } from "@/types";
import { DifficultyBadge } from "@/components/ui/Badge";
import { useProgress } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import { getAllTopics } from "@/data";

export function ChallengesList({ items }: { items: CrackmeChallenge[] }) {
  const { progress, loaded, toggleChallenge } = useProgress();
  const topicSlugs = Object.fromEntries(
    getAllTopics().map((t) => [t.id, t.sectionSlug])
  );

  const toggle = (id: string) => toggleChallenge(id);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {items.map((item) => {
        const done =
          loaded && (progress.completedChallenges ?? []).includes(item.id);
        return (
          <article
            key={item.id}
            className={cn(
              "rounded-xl border bg-card p-5",
              done ? "border-success/30" : "border-border"
            )}
          >
            <div className="flex items-start justify-between gap-2">
              <DifficultyBadge difficulty={item.difficulty} />
              <button
                type="button"
                onClick={() => toggle(item.id)}
                className={cn(
                  "rounded-lg border p-1.5",
                  done ? "border-success text-success" : "border-border text-muted"
                )}
                aria-label="Toggle complete"
              >
                <CheckCircle2 className="h-4 w-4" />
              </button>
            </div>
            <h3 className="mt-2 text-lg font-semibold text-foreground">
              {item.title}
            </h3>
            <p className="mt-1 text-sm text-muted">{item.description}</p>
            <p className="mt-2 text-xs text-muted">Platform: {item.platform}</p>
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1 text-sm text-accent hover:underline"
            >
              Open target <ExternalLink className="h-3.5 w-3.5" />
            </a>
            <div className="mt-3 flex flex-wrap gap-2">
              {item.topicIds.map((tid) => (
                <Link
                  key={tid}
                  href={`/sections/${topicSlugs[tid] ?? "foundation"}/${tid}`}
                  className="text-xs text-muted hover:text-accent"
                >
                  {tid}
                </Link>
              ))}
            </div>
          </article>
        );
      })}
    </div>
  );
}
