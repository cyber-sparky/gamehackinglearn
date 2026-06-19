"use client";

import { Star } from "lucide-react";
import { useRatings } from "@/lib/hooks";
import { cn } from "@/lib/utils";

export function RatingStars({ resourceId }: { resourceId: string }) {
  const { getRating, rate, loaded } = useRatings();
  const current = loaded ? getRating(resourceId) : 0;

  return (
    <div className="flex items-center gap-0.5" role="group" aria-label="Rate resource">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => rate(resourceId, star)}
          className="p-0.5 text-muted transition-colors hover:text-amber-400"
          aria-label={`Rate ${star} stars`}
        >
          <Star
            className={cn(
              "h-4 w-4",
              star <= current && "fill-amber-400 text-amber-400"
            )}
          />
        </button>
      ))}
    </div>
  );
}
