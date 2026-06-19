"use client";

import { useMemo, useState } from "react";
import { resources } from "@/data";
import { ResourceCard } from "@/components/content/ResourceCard";
import { FilterBar } from "@/components/ui/FilterBar";
import type { Difficulty } from "@/types";

export default function ResourcesPage() {
  const [difficulty, setDifficulty] = useState<Difficulty | "all">("all");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [search, setSearch] = useState("");

  const allTags = useMemo(
    () => [...new Set(resources.flatMap((r) => r.tags))].sort(),
    []
  );

  const filtered = useMemo(() => {
    return resources.filter((r) => {
      if (difficulty !== "all" && r.difficulty !== difficulty) return false;
      if (selectedTags.length > 0 && !selectedTags.some((tag) => r.tags.includes(tag)))
        return false;
      if (
        search &&
        !r.title.toLowerCase().includes(search.toLowerCase()) &&
        !r.description.toLowerCase().includes(search.toLowerCase())
      )
        return false;
      return true;
    });
  }, [difficulty, selectedTags, search]);

  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="text-3xl font-bold text-foreground">Resource Library</h1>
      <p className="mt-2 max-w-3xl text-lg text-muted">
        Curated collection of books, courses, blogs, research papers, GitHub
        repositories, and YouTube channels — all legitimate publicly available
        resources.
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
          {filtered.map((resource) => (
            <ResourceCard key={resource.id} resource={resource} />
          ))}
        </div>
      </div>
    </div>
  );
}
