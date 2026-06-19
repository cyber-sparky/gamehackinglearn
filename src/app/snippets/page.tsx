"use client";

import { useMemo, useState } from "react";
import { snippets } from "@/data";
import { SnippetCard } from "@/components/content/SnippetCard";
import { FilterBar } from "@/components/ui/FilterBar";
import type { Difficulty, SnippetCategory } from "@/types";

const categories: SnippetCategory[] = [
  "WinAPI",
  "C++",
  "Memory Reading",
  "Pattern Scanning",
  "DLL Analysis",
  "PE Parsing",
  "Reverse Engineering Helpers",
  "Assembly Examples",
  "Debugging Helpers",
];

export default function SnippetsPage() {
  const [difficulty, setDifficulty] = useState<Difficulty | "all">("all");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<SnippetCategory | "all">("all");

  const allTags = useMemo(
    () => [...new Set(snippets.flatMap((s) => s.tags))].sort(),
    []
  );

  const filtered = useMemo(() => {
    return snippets.filter((s) => {
      if (difficulty !== "all" && s.difficulty !== difficulty) return false;
      if (category !== "all" && s.category !== category) return false;
      if (selectedTags.length > 0 && !selectedTags.some((t) => s.tags.includes(t)))
        return false;
      if (
        search &&
        !s.title.toLowerCase().includes(search.toLowerCase()) &&
        !s.description.toLowerCase().includes(search.toLowerCase())
      )
        return false;
      return true;
    });
  }, [difficulty, category, selectedTags, search]);

  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="text-3xl font-bold text-foreground">Code Snippet Library</h1>
      <p className="mt-2 max-w-3xl text-lg text-muted">
        Searchable code snippets for WinAPI, C++, memory reading, pattern scanning,
        PE parsing, and more. Copy and adapt for your lab work.
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
          {filtered.map((snippet) => (
            <SnippetCard key={snippet.id} snippet={snippet} />
          ))}
          {filtered.length === 0 && (
            <p className="py-12 text-center text-muted">No snippets match your filters.</p>
          )}
        </div>
      </div>
    </div>
  );
}
