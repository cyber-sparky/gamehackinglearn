import type { Metadata } from "next";
import { ReviewFlashcards } from "@/components/review/ReviewFlashcards";

export const metadata: Metadata = {
  title: "Review Queue",
  description: "Spaced repetition flashcards from your completed topics and quizzes.",
};

export default function ReviewPage() {
  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="text-3xl font-bold text-foreground">Review Queue</h1>
      <p className="mt-2 text-muted">
        Active recall from quiz questions — topics you need to reinforce.
      </p>
      <div className="mt-8">
        <ReviewFlashcards />
      </div>
    </div>
  );
}
