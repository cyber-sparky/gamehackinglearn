import { ExternalLink } from "lucide-react";
import type { ResearchItem } from "@/types";
import { DifficultyBadge, TagBadge } from "@/components/ui/Badge";

const typeLabels: Record<ResearchItem["type"], string> = {
  blog: "Blog",
  whitepaper: "Whitepaper",
  conference: "Conference",
  notes: "Research Notes",
};

export function ResearchCard({ item }: { item: ResearchItem }) {
  return (
    <div
      id={item.id}
      className="rounded-xl border border-border bg-card p-5 scroll-mt-24"
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-md bg-muted-bg px-2 py-0.5 text-xs font-medium uppercase text-muted">
          {typeLabels[item.type]}
        </span>
        <DifficultyBadge difficulty={item.difficulty} />
        {item.date && (
          <span className="text-xs text-muted">{item.date}</span>
        )}
      </div>
      <h3 className="mt-2 text-lg font-semibold text-foreground">
        {item.title}
      </h3>
      {item.author && (
        <p className="mt-0.5 text-xs text-muted">by {item.author}</p>
      )}
      <p className="mt-2 text-sm text-muted">{item.description}</p>
      {item.url && (
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-1.5 text-sm text-accent hover:underline"
        >
          Read more <ExternalLink className="h-3 w-3" />
        </a>
      )}
      <div className="mt-3 flex flex-wrap gap-1.5">
        {item.tags.map((tag) => (
          <TagBadge key={tag} tag={tag} />
        ))}
      </div>
    </div>
  );
}
