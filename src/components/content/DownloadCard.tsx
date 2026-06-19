import { ExternalLink, Download as DownloadIcon } from "lucide-react";
import type { Download } from "@/types";
import { DifficultyBadge, TagBadge } from "@/components/ui/Badge";
import { CopyButton } from "@/components/ui/CopyButton";

export function DownloadCard({ item }: { item: Download }) {
  return (
    <div
      id={item.id}
      className="rounded-xl border border-border bg-card p-5 scroll-mt-24"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-md bg-accent/10 px-2 py-0.5 text-xs font-medium text-accent">
              {item.category}
            </span>
            {item.fileType && (
              <span className="rounded-md bg-muted-bg px-2 py-0.5 text-xs text-muted">
                {item.fileType}
              </span>
            )}
            <DifficultyBadge difficulty={item.difficulty} />
          </div>
          <h3 className="mt-2 text-lg font-semibold text-foreground">
            {item.title}
          </h3>
          <p className="mt-1 text-sm text-muted">{item.description}</p>
          {item.size && (
            <p className="mt-1 text-xs text-muted">Size: {item.size}</p>
          )}
        </div>
        <DownloadIcon className="h-5 w-5 shrink-0 text-muted" />
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-md bg-accent px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-accent-hover"
        >
          Open <ExternalLink className="h-3 w-3" />
        </a>
        <CopyButton text={item.url} label="Copy URL" />
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {item.tags.map((tag) => (
          <TagBadge key={tag} tag={tag} />
        ))}
      </div>
    </div>
  );
}
