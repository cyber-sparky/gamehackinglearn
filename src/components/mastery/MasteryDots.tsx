"use client";

import { cn } from "@/lib/utils";
import type { TopicMasteryState } from "@/types";

export function MasteryDots({
  mastery,
  size = "sm",
}: {
  mastery: TopicMasteryState;
  size?: "sm" | "md";
}) {
  const dot = size === "sm" ? "h-2 w-2" : "h-2.5 w-2.5";
  return (
    <div className="flex items-center gap-1" title="Read · Quiz · Lab">
      <span
        className={cn("rounded-full", dot, mastery.read ? "bg-success" : "bg-border")}
        aria-label="Read progress"
      />
      <span
        className={cn("rounded-full", dot, mastery.quiz ? "bg-success" : "bg-border")}
        aria-label="Quiz progress"
      />
      <span
        className={cn(
          "rounded-full",
          dot,
          !mastery.hasLab
            ? "bg-muted/40"
            : mastery.lab
              ? "bg-success"
              : "bg-border"
        )}
        aria-label="Lab progress"
      />
    </div>
  );
}
