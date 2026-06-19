"use client";

import { useState } from "react";
import { useProgress } from "@/lib/hooks";
import { getReviewCards } from "@/lib/review";
import { cn } from "@/lib/utils";
import { RotateCcw, ChevronRight } from "lucide-react";
import Link from "next/link";

export function ReviewFlashcards() {
  const { progress, loaded, markReviewComplete } = useProgress();
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  if (!loaded) {
    return <p className="text-muted">Loading review queue...</p>;
  }

  const cards = getReviewCards(progress);
  const card = cards[index];

  if (cards.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-12 text-center">
        <p className="text-lg font-medium text-foreground">All caught up!</p>
        <p className="mt-2 text-sm text-muted">
          No topics due for review. Complete more topics or revisit quizzes.
        </p>
        <Link
          href="/dashboard"
          className="mt-4 inline-block text-sm text-accent hover:underline"
        >
          Back to dashboard
        </Link>
      </div>
    );
  }

  const handleNext = () => {
    markReviewComplete(card.topicId);
    setFlipped(false);
    setIndex((i) => (i + 1) % cards.length);
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center justify-between text-sm text-muted">
        <span>
          Card {index + 1} of {cards.length}
        </span>
        <span className="rounded-full bg-accent/10 px-2 py-0.5 text-xs text-accent">
          {card.dueReason}
        </span>
      </div>

      <button
        type="button"
        onClick={() => setFlipped((f) => !f)}
        className={cn(
          "min-h-[220px] w-full rounded-2xl border border-border bg-card p-8 text-left transition-all hover:border-accent/30",
          flipped && "border-accent/40 bg-accent/5"
        )}
      >
        {!flipped ? (
          <>
            <p className="text-xs font-medium uppercase text-accent">
              {card.topicTitle}
            </p>
            <p className="mt-4 text-lg font-medium text-foreground">
              {card.question}
            </p>
            <p className="mt-6 text-sm text-muted">Tap to reveal answer</p>
          </>
        ) : (
          <>
            <p className="text-xs font-medium uppercase text-success">Answer</p>
            <p className="mt-4 text-lg font-medium text-foreground">
              {card.answer}
            </p>
            <p className="mt-4 text-sm text-muted">{card.explanation}</p>
          </>
        )}
      </button>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => setFlipped(false)}
          className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm hover:bg-muted-bg"
        >
          <RotateCcw className="h-4 w-4" />
          Flip back
        </button>
        <button
          type="button"
          onClick={handleNext}
          className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-hover"
        >
          Got it — next
          <ChevronRight className="h-4 w-4" />
        </button>
        <Link
          href={`/sections/${card.sectionSlug}/${card.topicId}`}
          className="inline-flex items-center rounded-lg border border-border px-4 py-2 text-sm hover:bg-muted-bg"
        >
          Re-read topic
        </Link>
      </div>
    </div>
  );
}
