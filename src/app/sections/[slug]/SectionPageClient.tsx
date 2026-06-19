"use client";

import { useMemo, useState } from "react";
import type { Section, Difficulty } from "@/types";
import { TopicCard } from "@/components/content/TopicCard";
import { FilterBar } from "@/components/ui/FilterBar";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { useProgress } from "@/lib/hooks";
import { getSectionProgress } from "@/data";
import { formatHours } from "@/lib/utils";

export function SectionPageClient({ section }: { section: Section }) {
  const { progress, loaded } = useProgress();
  const [difficulty, setDifficulty] = useState<Difficulty | "all">("all");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [search, setSearch] = useState("");

  const allTags = useMemo(
    () => [...new Set(section.topics.flatMap((t) => t.tags))].sort(),
    [section.topics]
  );

  const filtered = useMemo(() => {
    return section.topics.filter((t) => {
      if (difficulty !== "all" && t.difficulty !== difficulty) return false;
      if (selectedTags.length > 0 && !selectedTags.some((tag) => t.tags.includes(tag)))
        return false;
      if (search && !t.title.toLowerCase().includes(search.toLowerCase()))
        return false;
      return true;
    });
  }, [section.topics, difficulty, selectedTags, search]);

  const sectionProgress = loaded
    ? getSectionProgress(section.slug, progress.completedTopics)
    : 0;

  const totalHours = section.topics.reduce((s, t) => s + t.estimatedHours, 0);

  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="text-3xl font-bold text-foreground">{section.title}</h1>
      <p className="mt-2 max-w-3xl text-lg text-muted">{section.description}</p>
      <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted">
        <span>{section.topics.length} topics</span>
        <span>·</span>
        <span>{formatHours(totalHours)} total</span>
      </div>
      {loaded && sectionProgress > 0 && (
        <div className="mt-4 max-w-md">
          <ProgressBar value={sectionProgress} />
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
        <div className="grid gap-4 md:grid-cols-2">
          {filtered.map((topic) => (
            <TopicCard
              key={topic.id}
              topic={topic}
              sectionSlug={section.slug}
              completed={
                loaded && progress.completedTopics.includes(topic.id)
              }
            />
          ))}
          {filtered.length === 0 && (
            <p className="col-span-full text-center text-muted py-12">
              No topics match your filters.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
