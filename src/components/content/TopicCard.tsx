import Link from "next/link";
import { Clock, ArrowRight } from "lucide-react";
import type { Topic } from "@/types";
import { DifficultyBadge, TagBadge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { formatHours } from "@/lib/utils";

export function TopicCard({
  topic,
  sectionSlug,
  completed,
  progress,
}: {
  topic: Topic;
  sectionSlug: string;
  completed?: boolean;
  progress?: number;
}) {
  return (
    <Link
      href={`/sections/${sectionSlug}/${topic.id}`}
      className="group block rounded-xl border border-border bg-card p-5 transition-all hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-foreground group-hover:text-accent transition-colors">
            {topic.title}
          </h3>
          <p className="mt-1 text-sm text-muted line-clamp-2">
            {topic.description}
          </p>
        </div>
        <ArrowRight className="h-4 w-4 shrink-0 text-muted opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-0.5" />
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <DifficultyBadge difficulty={topic.difficulty} />
        <span className="flex items-center gap-1 text-xs text-muted">
          <Clock className="h-3 w-3" />
          {formatHours(topic.estimatedHours)}
        </span>
        {completed && (
          <span className="rounded-md bg-success/10 px-2 py-0.5 text-xs font-medium text-success">
            Completed
          </span>
        )}
      </div>
      {progress !== undefined && progress > 0 && progress < 100 && (
        <div className="mt-3">
          <ProgressBar value={progress} />
        </div>
      )}
      <div className="mt-3 flex flex-wrap gap-1.5">
        {topic.tags.slice(0, 3).map((tag) => (
          <TagBadge key={tag} tag={tag} />
        ))}
      </div>
    </Link>
  );
}
