"use client";

import { useMemo, useState } from "react";
import { downloads } from "@/data";
import { DownloadCard } from "@/components/content/DownloadCard";
import { FilterBar } from "@/components/ui/FilterBar";
import type { Difficulty, DownloadCategory } from "@/types";

const categories: DownloadCategory[] = [
  "Research Papers",
  "Whitepapers",
  "Cheat Engine Tables",
  "Open Source Projects",
  "Example Repositories",
  "Practice Targets",
  "Reference Material",
];

export default function DownloadsPage() {
  const [difficulty, setDifficulty] = useState<Difficulty | "all">("all");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<DownloadCategory | "all">("all");

  const allTags = useMemo(
    () => [...new Set(downloads.flatMap((d) => d.tags))].sort(),
    []
  );

  const filtered = useMemo(() => {
    return downloads.filter((d) => {
      if (difficulty !== "all" && d.difficulty !== difficulty) return false;
      if (category !== "all" && d.category !== category) return false;
      if (selectedTags.length > 0 && !selectedTags.some((t) => d.tags.includes(t)))
        return false;
      if (
        search &&
        !d.title.toLowerCase().includes(search.toLowerCase()) &&
        !d.description.toLowerCase().includes(search.toLowerCase())
      )
        return false;
      return true;
    });
  }, [difficulty, category, selectedTags, search]);

  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="text-3xl font-bold text-foreground">Download Center</h1>
      <p className="mt-2 max-w-3xl text-lg text-muted">
        Research papers, practice targets, open-source tools, Cheat Engine tables,
        and reference material for your lab environment.
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        <button
          onClick={() => setCategory("all")}
          className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
            category === "all"
              ? "border-accent bg-accent/10 text-accent"
              : "border-border text-muted hover:bg-muted-bg"
          }`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
              category === cat
                ? "border-accent bg-accent/10 text-accent"
                : "border-border text-muted hover:bg-muted-bg"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[280px_1fr]">
        <FilterBar
          selectedDifficulty={difficulty}
          onDifficultyChange={setDifficulty}
          tags={allTags}
          selectedTags={selectedTags}
          onTagToggle={(tag) =>
            setSelectedTags((prev) =>
              prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
            )
          }
          searchQuery={search}
          onSearchChange={setSearch}
        />
        <div className="grid gap-4">
          {filtered.map((item) => (
            <DownloadCard key={item.id} item={item} />
          ))}
          {filtered.length === 0 && (
            <p className="py-12 text-center text-muted">No downloads match your filters.</p>
          )}
        </div>
      </div>
    </div>
  );
}
