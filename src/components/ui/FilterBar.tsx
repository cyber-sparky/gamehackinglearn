"use client";

import type { Difficulty } from "@/types";
import { cn } from "@/lib/utils";
import { difficultyLabel } from "@/lib/utils";

export function FilterBar({
  difficulties,
  selectedDifficulty,
  onDifficultyChange,
  tags,
  selectedTags,
  onTagToggle,
  searchQuery,
  onSearchChange,
}: {
  difficulties?: Difficulty[];
  selectedDifficulty: Difficulty | "all";
  onDifficultyChange: (d: Difficulty | "all") => void;
  tags?: string[];
  selectedTags: string[];
  onTagToggle: (tag: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}) {
  const allDifficulties: (Difficulty | "all")[] = [
    "all",
    ...(difficulties ?? ["beginner", "intermediate", "advanced", "expert"]),
  ];

  return (
    <div className="space-y-4 rounded-xl border border-border bg-card p-4">
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Filter by name..."
        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent/50"
      />
      <div>
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted">
          Difficulty
        </p>
        <div className="flex flex-wrap gap-2">
          {allDifficulties.map((d) => (
            <button
              key={d}
              onClick={() => onDifficultyChange(d)}
              className={cn(
                "rounded-md border px-3 py-1 text-xs font-medium transition-colors",
                selectedDifficulty === d
                  ? "border-accent bg-accent/10 text-accent"
                  : "border-border text-muted hover:bg-muted-bg"
              )}
            >
              {d === "all" ? "All" : difficultyLabel(d)}
            </button>
          ))}
        </div>
      </div>
      {tags && tags.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted">
            Tags
          </p>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <button
                key={tag}
                onClick={() => onTagToggle(tag)}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                  selectedTags.includes(tag)
                    ? "border-accent bg-accent/10 text-accent"
                    : "border-border text-muted hover:bg-muted-bg"
                )}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
