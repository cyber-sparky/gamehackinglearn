"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, Download, Trash2 } from "lucide-react";
import { getAllTopics } from "@/data";
import { useNotes } from "@/lib/hooks";

export default function NotesPage() {
  const { notes, setNote, loaded } = useNotes();
  const [query, setQuery] = useState("");

  const allTopics = getAllTopics();

  const noteEntries = useMemo(() => {
    return Object.entries(notes)
      .filter(([, content]) => content.trim())
      .map(([key, content]) => {
        const topicId = key.replace("topic-", "");
        const topic = allTopics.find((t) => t.id === topicId);
        return {
          key,
          content,
          topic,
          title: topic?.title ?? key,
          href: topic
            ? `/sections/${topic.sectionSlug}/${topic.id}`
            : undefined,
        };
      })
      .filter(
        (entry) =>
          !query ||
          entry.title.toLowerCase().includes(query.toLowerCase()) ||
          entry.content.toLowerCase().includes(query.toLowerCase())
      )
      .sort((a, b) => a.title.localeCompare(b.title));
  }, [notes, allTopics, query]);

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(notes, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ghr-notes-export.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!loaded) {
    return (
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold text-foreground">My Notes</h1>
        <p className="mt-4 text-muted">Loading...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Notes</h1>
          <p className="mt-2 text-muted">
            {noteEntries.length} note{noteEntries.length !== 1 ? "s" : ""} saved
            locally in your browser.
          </p>
        </div>
        <button
          onClick={handleExport}
          className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm text-muted transition-colors hover:bg-muted-bg hover:text-foreground"
        >
          <Download className="h-4 w-4" />
          Export JSON
        </button>
      </div>

      <div className="relative mt-6">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search notes..."
          className="w-full rounded-lg border border-border bg-card py-2.5 pl-10 pr-4 text-sm outline-none focus:border-accent/50"
        />
      </div>

      {noteEntries.length === 0 ? (
        <div className="mt-12 text-center">
          <p className="text-muted">
            {query
              ? "No notes match your search."
              : "No notes yet. Add notes on any topic page."}
          </p>
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {noteEntries.map((entry) => (
            <div
              key={entry.key}
              className="rounded-xl border border-border bg-card p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  {entry.href ? (
                    <Link
                      href={entry.href}
                      className="font-medium text-foreground hover:text-accent"
                    >
                      {entry.title}
                    </Link>
                  ) : (
                    <span className="font-medium text-foreground">
                      {entry.title}
                    </span>
                  )}
                  {entry.topic && (
                    <p className="text-xs text-muted">{entry.topic.sectionTitle}</p>
                  )}
                </div>
                <button
                  onClick={() => setNote(entry.key, "")}
                  className="rounded-md p-1.5 text-muted transition-colors hover:bg-muted-bg hover:text-foreground"
                  aria-label="Delete note"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <p className="mt-3 whitespace-pre-wrap text-sm text-muted line-clamp-6">
                {entry.content}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
