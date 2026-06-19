"use client";

import { useMemo, useState } from "react";
import { videos } from "@/data";
import { VideoCard } from "@/components/content/VideoCard";
import { FilterBar } from "@/components/ui/FilterBar";
import type { Difficulty, VideoTopic } from "@/types";

const topics: VideoTopic[] = [
  "Assembly",
  "Ghidra",
  "x64dbg",
  "Windows Internals",
  "Unity",
  "Unreal",
  "Graphics",
  "Networking",
  "Anti-Cheat Architecture",
];

export default function VideosPage() {
  const [difficulty, setDifficulty] = useState<Difficulty | "all">("all");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [topic, setTopic] = useState<VideoTopic | "all">("all");

  const allTags = useMemo(
    () => [...new Set(videos.flatMap((v) => v.tags))].sort(),
    []
  );

  const filtered = useMemo(() => {
    return videos.filter((v) => {
      if (difficulty !== "all" && v.difficulty !== difficulty) return false;
      if (topic !== "all" && v.topic !== topic) return false;
      if (selectedTags.length > 0 && !selectedTags.some((t) => v.tags.includes(t)))
        return false;
      if (
        search &&
        !v.title.toLowerCase().includes(search.toLowerCase()) &&
        !v.description.toLowerCase().includes(search.toLowerCase())
      )
        return false;
      return true;
    });
  }, [difficulty, topic, selectedTags, search]);

  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="text-3xl font-bold text-foreground">Video Library</h1>
      <p className="mt-2 max-w-3xl text-lg text-muted">
        Curated video tutorials on assembly, Ghidra, x64dbg, Windows internals,
        game engines, graphics, networking, and anti-cheat architecture.
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        <button
          onClick={() => setTopic("all")}
          className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
            topic === "all"
              ? "border-accent bg-accent/10 text-accent"
              : "border-border text-muted hover:bg-muted-bg"
          }`}
        >
          All Topics
        </button>
        {topics.map((t) => (
          <button
            key={t}
            onClick={() => setTopic(t)}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
              topic === t
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
        <div className="grid gap-6 md:grid-cols-2">
          {filtered.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
          {filtered.length === 0 && (
            <p className="col-span-full py-12 text-center text-muted">
              No videos match your filters.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
