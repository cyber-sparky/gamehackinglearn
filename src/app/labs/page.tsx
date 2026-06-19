"use client";

import { useMemo, useState } from "react";
import { labs } from "@/data";
import { LabCard } from "@/components/content/LabCard";
import { FilterBar } from "@/components/ui/FilterBar";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { useProgress } from "@/lib/hooks";
import type { Difficulty } from "@/types";

export default function LabsPage() {
  const { progress, loaded } = useProgress();
  const [difficulty, setDifficulty] = useState<Difficulty | "all">("all");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [search, setSearch] = useState("");

  const allTags = useMemo(
    () => [...new Set(labs.flatMap((l) => l.tags))].sort(),
    []
  );

  const filtered = useMemo(() => {
    return labs.filter((l) => {
      if (difficulty !== "all" && l.difficulty !== difficulty) return false;
      if (selectedTags.length > 0 && !selectedTags.some((tag) => l.tags.includes(tag)))
        return false;
      if (search && !l.title.toLowerCase().includes(search.toLowerCase()))
        return false;
      return true;
    });
  }, [difficulty, selectedTags, search]);

  const labProgress = loaded
    ? Math.round((progress.completedLabs.length / labs.length) * 100)
    : 0;

  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="text-3xl font-bold text-foreground">Guided Labs</h1>
      <p className="mt-2 max-w-3xl text-lg text-muted">
        Hands-on exercises from beginner to advanced. Track completion progress
        locally in your browser.
      </p>
      {loaded && (
        <div className="mt-4 max-w-md">
          <ProgressBar value={labProgress} />
          <p className="mt-1 text-sm text-muted">
            {progress.completedLabs.length} of {labs.length} labs completed
          </p>
        </div>
      )}

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
          {filtered.map((lab) => (
            <LabCard key={lab.id} lab={lab} />
          ))}
        </div>
      </div>
    </div>
  );
}
