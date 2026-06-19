import Link from "next/link";
import type { Difficulty } from "@/types";
import { ArrowRight, Clock } from "lucide-react";
import { roadmaps } from "@/data";
import { DifficultyBadge } from "@/components/ui/Badge";
import { formatHours } from "@/lib/utils";

export default function RoadmapsPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="text-3xl font-bold text-foreground">Visual Roadmaps</h1>
      <p className="mt-2 max-w-3xl text-lg text-muted">
        Interactive dependency graphs showing learning paths. Click nodes to
        mark progress and navigate to related topics.
      </p>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {roadmaps.map((roadmap) => {
          const totalHours = roadmap.nodes.reduce(
            (s, n) => s + n.estimatedHours,
            0
          );
          const difficulties: Difficulty[] = [
            "beginner",
            "intermediate",
            "advanced",
            "expert",
          ];
          const maxDifficulty = roadmap.nodes.reduce<Difficulty>(
            (max, n) =>
              difficulties.indexOf(n.difficulty) > difficulties.indexOf(max)
                ? n.difficulty
                : max,
            "beginner"
          );

          return (
            <Link
              key={roadmap.slug}
              href={`/roadmaps/${roadmap.slug}`}
              className="group rounded-xl border border-border bg-card p-6 transition-all hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5"
            >
              <h2 className="text-xl font-semibold text-foreground group-hover:text-accent transition-colors">
                {roadmap.title}
              </h2>
              <p className="mt-2 text-sm text-muted">{roadmap.description}</p>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <DifficultyBadge difficulty={maxDifficulty} />
                <span className="flex items-center gap-1 text-xs text-muted">
                  <Clock className="h-3 w-3" />
                  {formatHours(totalHours)}
                </span>
                <span className="text-xs text-muted">
                  {roadmap.nodes.length} nodes
                </span>
              </div>
              <span className="mt-4 inline-flex items-center gap-1 text-sm text-accent">
                Open roadmap <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
