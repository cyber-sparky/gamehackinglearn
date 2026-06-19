"use client";

import { useState } from "react";
import { useProgress } from "@/lib/hooks";

export function LearningJournal() {
  const { progress, loaded, setJournalEntry } = useProgress();
  const today = new Date().toISOString().slice(0, 10);
  const saved = loaded ? (progress.learningJournal?.[today] ?? "") : "";
  const [draft, setDraft] = useState<string | null>(null);
  const entry = draft ?? saved;

  if (!loaded) return null;

  return (
    <section className="rounded-xl border border-border bg-card p-6">
      <h2 className="text-lg font-semibold text-foreground">Learning journal</h2>
      <p className="mt-1 text-sm text-muted">
        What did you learn today? ({today})
      </p>
      <textarea
        value={entry}
        onChange={(e) => setDraft(e.target.value)}
        placeholder="e.g. Found health via exact scan in AssaultCube, documented pointer chain..."
        rows={3}
        className="mt-3 w-full rounded-lg border border-border bg-muted-bg/30 px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
      />
      <button
        type="button"
        onClick={() => {
          setJournalEntry(today, entry);
          setDraft(null);
        }}
        className="mt-2 text-sm text-accent hover:underline"
      >
        Save entry
      </button>
    </section>
  );
}
