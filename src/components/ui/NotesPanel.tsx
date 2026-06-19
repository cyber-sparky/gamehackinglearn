"use client";

import { useNotes } from "@/lib/hooks";
import { StickyNote } from "lucide-react";

export function NotesPanel({ noteKey, title }: { noteKey: string; title?: string }) {
  const { getNote, setNote, loaded } = useNotes();
  const note = loaded ? getNote(noteKey) : "";

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="mb-3 flex items-center gap-2">
        <StickyNote className="h-4 w-4 text-accent" />
        <h3 className="text-sm font-semibold text-foreground">
          {title ?? "Your Notes"}
        </h3>
      </div>
      <textarea
        value={note}
        onChange={(e) => setNote(noteKey, e.target.value)}
        placeholder="Add personal notes here — saved locally in your browser..."
        className="min-h-[120px] w-full resize-y rounded-lg border border-border bg-background p-3 text-sm text-foreground outline-none placeholder:text-muted focus:border-accent/50"
      />
      <p className="mt-2 text-xs text-muted">
        Notes are stored locally and never leave your browser.
      </p>
    </div>
  );
}
