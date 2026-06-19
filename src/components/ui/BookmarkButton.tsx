"use client";

import { Bookmark } from "lucide-react";
import { useBookmarks } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import type { UserBookmarks } from "@/types";

export function BookmarkButton({
  type,
  id,
  className,
}: {
  type: keyof UserBookmarks;
  id: string;
  className?: string;
}) {
  const { isBookmarked, toggle, loaded } = useBookmarks();
  const active = loaded && isBookmarked(type, id);

  return (
    <button
      onClick={() => toggle(type, id)}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border border-border p-2 text-muted transition-colors hover:bg-muted-bg hover:text-foreground",
        active && "border-accent/50 bg-accent/10 text-accent",
        className
      )}
      aria-label={active ? "Remove bookmark" : "Add bookmark"}
      aria-pressed={active}
    >
      <Bookmark className={cn("h-4 w-4", active && "fill-current")} />
    </button>
  );
}
