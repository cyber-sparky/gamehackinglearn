import { ExternalLink } from "lucide-react";
import type { Resource } from "@/types";
import { DifficultyBadge, TagBadge } from "@/components/ui/Badge";
import { BookmarkButton } from "@/components/ui/BookmarkButton";
import { CopyButton } from "@/components/ui/CopyButton";
import { RatingStars } from "@/components/ui/RatingStars";

export function ResourceCard({ resource }: { resource: Resource }) {
  return (
    <div
      id={resource.id}
      className="rounded-xl border border-border bg-card p-5 scroll-mt-24"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-md bg-muted-bg px-2 py-0.5 text-xs font-medium uppercase text-muted">
              {resource.type}
            </span>
            <span
              className={`rounded-md px-2 py-0.5 text-xs font-medium ${
                resource.cost === "free"
                  ? "bg-emerald-500/10 text-emerald-400"
                  : resource.cost === "paid"
                    ? "bg-orange-500/10 text-orange-400"
                    : "bg-amber-500/10 text-amber-400"
              }`}
            >
              {resource.cost}
            </span>
            <DifficultyBadge difficulty={resource.difficulty} />
          </div>
          <h3 className="mt-2 font-semibold text-foreground">{resource.title}</h3>
          <p className="mt-1 text-sm text-muted">{resource.description}</p>
        </div>
        <BookmarkButton type="resources" id={resource.id} />
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <a
          href={resource.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-md bg-accent px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-accent-hover"
        >
          Open <ExternalLink className="h-3 w-3" />
        </a>
        <CopyButton text={resource.url} label="Copy URL" />
        <RatingStars resourceId={resource.id} />
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {resource.tags.map((tag) => (
          <TagBadge key={tag} tag={tag} />
        ))}
      </div>
    </div>
  );
}
