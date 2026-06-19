"use client";

import Link from "next/link";
import { ListOrdered } from "lucide-react";
import type { Topic } from "@/types";
import { labs, videos, challenges } from "@/data";
import { useProgress } from "@/lib/hooks";
import { getTopicMastery } from "@/lib/mastery";
import { cn } from "@/lib/utils";

export function TopicLearningBundle({ topic }: { topic: Topic }) {
  const { progress, loaded } = useProgress();
  const topicLabs = labs.filter(
    (l) => topic.labs.includes(l.id) || l.topicId === topic.id
  );
  const relatedVideos = videos.filter((v) =>
    v.tags.some((t) => topic.tags.includes(t))
  );
  const relatedChallenges = challenges.filter((c) =>
    c.topicIds.includes(topic.id)
  );

  const mastery = loaded ? getTopicMastery(topic, progress) : null;

  const steps = [
    {
      id: "read",
      label: "Read explanation & objectives",
      href: `#explanation`,
      done: mastery?.read ?? false,
    },
    ...topicLabs.slice(0, 1).map((lab) => ({
      id: lab.id,
      label: `Lab: ${lab.title}`,
      href: `/labs#${lab.id}`,
      done: loaded && progress.completedLabs.includes(lab.id),
    })),
    ...relatedVideos.slice(0, 1).map((v) => ({
      id: v.id,
      label: `Watch: ${v.title}`,
      href: v.youtubeUrl,
      done: false,
      external: true,
    })),
    {
      id: "quiz",
      label: "Pass topic quiz (80%+)",
      href: `#quiz`,
      done: mastery?.quiz ?? false,
    },
  ];

  return (
    <section className="mt-6 rounded-xl border border-border bg-card p-5">
      <div className="flex items-center gap-2">
        <ListOrdered className="h-5 w-5 text-accent" />
        <h2 className="text-lg font-semibold text-foreground">Learning bundle</h2>
      </div>
      <ol className="mt-4 space-y-2">
        {steps.map((step, i) => (
          <li key={step.id}>
            <Link
              href={step.href}
              target={"external" in step && step.external ? "_blank" : undefined}
              rel={"external" in step && step.external ? "noopener noreferrer" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-lg border px-3 py-2 text-sm transition-colors hover:bg-muted-bg",
                step.done ? "border-success/30 text-muted" : "border-border"
              )}
            >
              <span
                className={cn(
                  "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                  step.done ? "bg-success/10 text-success" : "bg-accent/10 text-accent"
                )}
              >
                {step.done ? "✓" : i + 1}
              </span>
              {step.label}
            </Link>
          </li>
        ))}
      </ol>
      {relatedChallenges.length > 0 && (
        <p className="mt-4 text-sm text-muted">
          Practice target:{" "}
          <Link
            href="/challenges"
            className="text-accent hover:underline"
          >
            {relatedChallenges[0].title}
          </Link>
        </p>
      )}
    </section>
  );
}
