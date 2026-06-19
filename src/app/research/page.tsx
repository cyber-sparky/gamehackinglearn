"use client";

import { useMemo, useState } from "react";
import { research } from "@/data";
import { ResearchCard } from "@/components/content/ResearchCard";
import { FilterBar } from "@/components/ui/FilterBar";
import type { Difficulty, ResearchType } from "@/types";

const types: ResearchType[] = ["blog", "whitepaper", "conference", "notes"];

export default function ResearchPage() {
  const [difficulty, setDifficulty] = useState<Difficulty | "all">("all");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [type, setType] = useState<ResearchType | "all">("all");

  const allTags = useMemo(
    () => [...new Set(research.flatMap((r) => r.tags))].sort(),
    []
  );

  const filtered = useMemo(() => {
    return research.filter((r) => {
      if (difficulty !== "all" && r.difficulty !== difficulty) return false;
      if (type !== "all" && r.type !== type) return false;
      if (selectedTags.length > 0 && !selectedTags.some((t) => r.tags.includes(t)))
        return false;
      if (
        search &&
        !r.title.toLowerCase().includes(search.toLowerCase()) &&
        !r.description.toLowerCase().includes(search.toLowerCase())
      )
        return false;
      return true;
    });
  }, [difficulty, type, selectedTags, search]);

  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="text-3xl font-bold text-foreground">Research Archive</h1>
      <p className="mt-2 max-w-3xl text-lg text-muted">
        Blog articles, whitepapers, conference talks, and research notes on
        Windows internals, game engines, memory analysis, and anti-cheat architecture.
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        <button
          onClick={() => setType("all")}
          className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
            type === "all"
              ? "border-accent bg-accent/10 text-accent"
              : "border-border text-muted hover:bg-muted-bg"
          }`}
        >
          All
        </button>
        {types.map((t) => (
          <button
            key={t}
            onClick={() => setType(t)}
            className={`rounded-full border px-3 py-1 text-xs font-medium capitalize transition-colors ${
              type === t
                ? "border-accent bg-accent/10 text-accent"
                : "border-border text-muted hover:bg-muted-bg"
            }`}
          >
            {t}
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
        <div className="grid gap-4 md:grid-cols-2">
          {filtered.map((item) => (
            <ResearchCard key={item.id} item={item} />
          ))}
          {filtered.length === 0 && (
            <p className="col-span-full py-12 text-center text-muted">
              No research items match your filters.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
