"use client";

import { useMemo, useState } from "react";
import { tools } from "@/data";
import { ToolCard } from "@/components/content/ToolCard";
import { FilterBar } from "@/components/ui/FilterBar";
import type { Difficulty } from "@/types";

export default function ToolsPage() {
  const [difficulty, setDifficulty] = useState<Difficulty | "all">("all");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [search, setSearch] = useState("");

  const allTags = useMemo(
    () => [...new Set(tools.flatMap((t) => t.tags))].sort(),
    []
  );

  const filtered = useMemo(() => {
    return tools.filter((t) => {
      if (difficulty !== "all" && t.difficulty !== difficulty) return false;
      if (selectedTags.length > 0 && !selectedTags.some((tag) => t.tags.includes(tag)))
        return false;
      if (
        search &&
        !t.name.toLowerCase().includes(search.toLowerCase()) &&
        !t.description.toLowerCase().includes(search.toLowerCase())
      )
        return false;
      return true;
    });
  }, [difficulty, selectedTags, search]);

  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="text-3xl font-bold text-foreground">Tools Database</h1>
      <p className="mt-2 max-w-3xl text-lg text-muted">
        Searchable catalog of reverse engineering, debugging, and analysis tools
        with documentation links and tutorials.
      </p>

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
          {filtered.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </div>
    </div>
  );
}
