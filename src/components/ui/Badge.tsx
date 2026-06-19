"use client";

import { cn, difficultyColor, difficultyLabel } from "@/lib/utils";
import type { Difficulty } from "@/types";

export function Badge({
  children,
  className,
  variant = "default",
}: {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "outline";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium",
        variant === "outline" && "border border-border bg-transparent text-muted",
        variant === "default" && "bg-muted-bg text-muted",
        className
      )}
    >
      {children}
    </span>
  );
}

export function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium",
        difficultyColor(difficulty)
      )}
    >
      {difficultyLabel(difficulty)}
    </span>
  );
}

export function TagBadge({ tag }: { tag: string }) {
  return (
    <span className="inline-flex items-center rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-medium text-accent">
      {tag}
    </span>
  );
}
