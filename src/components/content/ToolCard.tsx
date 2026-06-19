import { ExternalLink } from "lucide-react";
import type { Tool } from "@/types";
import { DifficultyBadge, TagBadge } from "@/components/ui/Badge";
import { BookmarkButton } from "@/components/ui/BookmarkButton";
import { CopyButton } from "@/components/ui/CopyButton";

export function ToolCard({ tool }: { tool: Tool }) {
  return (
    <div
      id={tool.id}
      className="rounded-xl border border-border bg-card p-5 scroll-mt-24"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-md bg-accent/10 px-2 py-0.5 text-xs font-medium text-accent">
              {tool.category}
            </span>
            <DifficultyBadge difficulty={tool.difficulty} />
          </div>
          <h3 className="mt-2 text-lg font-semibold text-foreground">
            {tool.name}
          </h3>
          <p className="mt-1 text-sm text-muted">{tool.description}</p>
        </div>
        <BookmarkButton type="tools" id={tool.id} />
      </div>
      <div className="mt-4 space-y-2 text-sm">
        <div className="flex flex-wrap items-center gap-2">
          <a
            href={tool.website}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-accent hover:underline"
          >
            Website <ExternalLink className="h-3 w-3" />
          </a>
          <span className="text-muted">·</span>
          <a
            href={tool.documentation}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-accent hover:underline"
          >
            Docs <ExternalLink className="h-3 w-3" />
          </a>
          <CopyButton text={tool.website} label="Copy" />
        </div>
        {tool.tutorials.length > 0 && (
          <div>
            <p className="text-xs font-medium uppercase text-muted">Tutorials</p>
            <ul className="mt-1 space-y-1">
              {tool.tutorials.map((t, i) => (
                <li key={i}>
                  <a
                    href={t}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent hover:underline"
                  >
                    Tutorial {i + 1}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {tool.tags.map((tag) => (
          <TagBadge key={tag} tag={tag} />
        ))}
      </div>
    </div>
  );
}
