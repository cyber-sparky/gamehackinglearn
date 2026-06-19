"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, X, ArrowRight } from "lucide-react";
import { search } from "@/lib/search";
import { getAllTopics } from "@/data";
import { useNotes } from "@/lib/hooks";
import type { SearchResult } from "@/types";
import { cn } from "@/lib/utils";

const typeLabels: Record<SearchResult["type"], string> = {
  section: "Section",
  topic: "Topic",
  tool: "Tool",
  resource: "Resource",
  lab: "Lab",
  roadmap: "Roadmap",
  snippet: "Snippet",
  video: "Video",
  download: "Download",
  research: "Research",
  path: "Learning Path",
  note: "Note",
};

const QUICK_ACTIONS = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Continue study", href: "/study" },
  { label: "Review flashcards", href: "/review" },
  { label: "Export backup", href: "/dashboard#backup" },
  { label: "Foundation section", href: "/sections/foundation" },
  { label: "Glossary", href: "/glossary" },
];

const FILTER_TYPES: Array<SearchResult["type"] | "all"> = [
  "all",
  "topic",
  "lab",
  "tool",
  "snippet",
  "video",
  "path",
];

export function SearchModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<SearchResult["type"] | "all">(
    "all"
  );
  const { notes } = useNotes();
  // Reset the query when the modal closes. Adjusting state during render in
  // response to a prop change is the React-recommended pattern and avoids the
  // cascading re-renders that a setState-in-effect would cause.
  const [prevOpen, setPrevOpen] = useState(open);
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (!open) {
      if (query !== "") setQuery("");
      if (typeFilter !== "all") setTypeFilter("all");
    }
  }

  const topicById = useMemo(() => {
    const map = new Map<string, { title: string; href: string }>();
    for (const t of getAllTopics()) {
      map.set(t.id, {
        title: t.title,
        href: `/sections/${t.sectionSlug}/${t.id}`,
      });
    }
    return map;
  }, []);

  // Results are derived directly from the query — no extra state or effect.
  const results = useMemo<SearchResult[]>(() => {
    const q = query.trim();
    if (!q) return [];

    const base = search(q, 30);
    const lower = q.toLowerCase();

    const noteResults: SearchResult[] = [];
    for (const [topicId, body] of Object.entries(notes)) {
      if (!body.trim()) continue;
      if (
        !body.toLowerCase().includes(lower) &&
        !topicId.toLowerCase().includes(lower)
      ) {
        continue;
      }
      const topic = topicById.get(topicId);
      noteResults.push({
        id: `note-${topicId}`,
        title: topic ? `Note: ${topic.title}` : `Note on ${topicId}`,
        type: "note",
        description: body.slice(0, 120),
        href: topic?.href ?? "/notes",
        tags: ["note"],
      });
    }

    const merged = [...base, ...noteResults];
    if (typeFilter === "all") return merged.slice(0, 20);
    return merged.filter((r) => r.type === typeFilter).slice(0, 20);
  }, [query, notes, topicById, typeFilter]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (open) onClose();
      }
      if (e.key === "Escape" && open) onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-xl rounded-xl border border-border bg-card shadow-2xl">
        <div className="flex items-center gap-3 border-b border-border px-4 py-3">
          <Search className="h-5 w-5 text-muted" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search topics, tools, labs, snippets, videos..."
            className="flex-1 bg-transparent text-foreground outline-none placeholder:text-muted"
          />
          <button
            onClick={onClose}
            className="rounded-md p-1 text-muted hover:bg-muted-bg hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="flex flex-wrap gap-1.5 border-b border-border px-4 py-2">
          {FILTER_TYPES.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setTypeFilter(type)}
              className={cn(
                "rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
                typeFilter === type
                  ? "bg-accent text-white"
                  : "bg-muted-bg text-muted hover:text-foreground"
              )}
            >
              {type === "all" ? "All" : typeLabels[type]}
            </button>
          ))}
        </div>
        <div className="max-h-96 overflow-y-auto p-2">
          {query && results.length === 0 && (
            <p className="px-3 py-6 text-center text-sm text-muted">
              No results for &ldquo;{query}&rdquo;
            </p>
          )}
          {results.map((result) => (
            <a
              key={`${result.type}-${result.id}`}
              href={result.href}
              onClick={onClose}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-muted-bg"
            >
              <span className="shrink-0 rounded-md bg-accent/10 px-2 py-0.5 text-xs font-medium text-accent">
                {typeLabels[result.type]}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">
                  {result.title}
                </p>
                <p className="truncate text-xs text-muted">
                  {result.description}
                </p>
              </div>
              <ArrowRight className="h-4 w-4 shrink-0 text-muted" />
            </a>
          ))}
          {!query && (
            <div className="px-2 py-4">
              <p className="px-3 pb-2 text-xs font-medium uppercase text-muted">
                Quick actions
              </p>
              <div className="grid gap-1 sm:grid-cols-2">
                {QUICK_ACTIONS.map((action) => (
                  <a
                    key={action.href}
                    href={action.href}
                    onClick={onClose}
                    className="rounded-lg px-3 py-2 text-sm text-foreground hover:bg-muted-bg"
                  >
                    {action.label}
                  </a>
                ))}
              </div>
              <p className="mt-4 px-3 text-center text-sm text-muted">
                Or type to search topics, tools, labs, and more
              </p>
            </div>
          )}
        </div>
        <div className="border-t border-border px-4 py-2 text-xs text-muted">
          Press <kbd className="rounded bg-muted-bg px-1.5 py-0.5">Esc</kbd> to
          close
        </div>
      </div>
    </div>
  );
}

export function SearchTrigger({
  onClick,
  className,
}: {
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 rounded-lg border border-border bg-muted-bg/50 px-3 py-2 text-sm text-muted transition-colors hover:border-accent/30 hover:text-foreground",
        className
      )}
    >
      <Search className="h-4 w-4" />
      <span className="hidden sm:inline">Search...</span>
      <kbd className="ml-auto hidden rounded bg-card px-1.5 py-0.5 text-xs sm:inline">
        Ctrl+K
      </kbd>
    </button>
  );
}
