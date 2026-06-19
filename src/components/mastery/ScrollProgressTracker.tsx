"use client";

import { useEffect, useRef } from "react";
import { getStoreSnapshot } from "@/lib/storage";
import { useProgress } from "@/lib/hooks";
import type { UserProgress } from "@/types";

export function ScrollProgressTracker({ topicId }: { topicId: string }) {
  const { setTopicProgress, loaded } = useProgress();
  const lastWritten = useRef(0);

  useEffect(() => {
    if (!loaded) return;

    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const percent =
        docHeight > 0
          ? Math.min(100, Math.round((scrollTop / docHeight) * 100))
          : 0;
      const current =
        getStoreSnapshot<UserProgress>("progress").topicProgress[topicId] ?? 0;
      if (percent > current && percent - lastWritten.current >= 5) {
        lastWritten.current = percent;
        setTopicProgress(topicId, percent);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [topicId, loaded, setTopicProgress]);

  return null;
}
