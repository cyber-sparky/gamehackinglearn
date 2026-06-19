"use client";

import { useCallback, useEffect, useState } from "react";
import { storage } from "./storage";
import type { UserBookmarks, UserNotes, UserProgress, UserRatings } from "@/types";

export function useLocalStorage<T>(
  key: "progress" | "bookmarks" | "notes" | "ratings",
  fallback: T
) {
  const [value, setValue] = useState<T>(fallback);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const map = {
      progress: storage.getProgress,
      bookmarks: storage.getBookmarks,
      notes: storage.getNotes,
      ratings: storage.getRatings,
    };
    setValue(map[key]() as T);
    setLoaded(true);
  }, [key]);

  const persist = useCallback(
    (next: T) => {
      setValue(next);
      const writers = {
        progress: storage.setProgress,
        bookmarks: storage.setBookmarks,
        notes: storage.setNotes,
        ratings: storage.setRatings,
      };
      writers[key](next as never);
    },
    [key]
  );

  return { value, setValue: persist, loaded };
}

export function useProgress() {
  const { value, setValue, loaded } = useLocalStorage<UserProgress>(
    "progress",
    storage.getProgress()
  );

  const toggleTopic = (topicId: string) => {
    const completed = value.completedTopics.includes(topicId)
      ? value.completedTopics.filter((id) => id !== topicId)
      : [...value.completedTopics, topicId];
    setValue({ ...value, completedTopics: completed });
  };

  const toggleLab = (labId: string) => {
    const completed = value.completedLabs.includes(labId)
      ? value.completedLabs.filter((id) => id !== labId)
      : [...value.completedLabs, labId];
    setValue({ ...value, completedLabs: completed });
  };

  const toggleRoadmapNode = (nodeId: string) => {
    const completed = value.completedRoadmapNodes.includes(nodeId)
      ? value.completedRoadmapNodes.filter((id) => id !== nodeId)
      : [...value.completedRoadmapNodes, nodeId];
    setValue({ ...value, completedRoadmapNodes: completed });
  };

  const setTopicProgress = (topicId: string, percent: number) => {
    setValue({
      ...value,
      topicProgress: { ...value.topicProgress, [topicId]: percent },
    });
  };

  return {
    progress: value,
    loaded,
    toggleTopic,
    toggleLab,
    toggleRoadmapNode,
    setTopicProgress,
  };
}

export function useBookmarks() {
  const { value, setValue, loaded } = useLocalStorage<UserBookmarks>(
    "bookmarks",
    storage.getBookmarks()
  );

  const toggle = (
    type: keyof UserBookmarks,
    id: string
  ) => {
    const list = value[type];
    const next = list.includes(id)
      ? list.filter((item) => item !== id)
      : [...list, id];
    setValue({ ...value, [type]: next });
  };

  const isBookmarked = (type: keyof UserBookmarks, id: string) =>
    value[type].includes(id);

  return { bookmarks: value, loaded, toggle, isBookmarked };
}

export function useNotes() {
  const { value, setValue, loaded } = useLocalStorage<UserNotes>(
    "notes",
    {}
  );

  const setNote = (key: string, note: string) => {
    setValue({ ...value, [key]: note });
  };

  const getNote = (key: string) => value[key] ?? "";

  return { notes: value, loaded, setNote, getNote };
}

export function useRatings() {
  const { value, setValue, loaded } = useLocalStorage<UserRatings>(
    "ratings",
    {}
  );

  const rate = (resourceId: string, rating: number) => {
    setValue({ ...value, [resourceId]: rating });
  };

  const getRating = (resourceId: string) => value[resourceId] ?? 0;

  return { ratings: value, loaded, rate, getRating };
}

export function useTheme() {
  const [theme, setThemeState] = useState<"light" | "dark">("dark");

  useEffect(() => {
    const stored = storage.getTheme();
    setThemeState(stored);
    document.documentElement.classList.toggle("dark", stored === "dark");
  }, []);

  const setTheme = (next: "light" | "dark") => {
    setThemeState(next);
    storage.setTheme(next);
    document.documentElement.classList.toggle("dark", next === "dark");
  };

  const toggle = () => setTheme(theme === "dark" ? "light" : "dark");

  return { theme, setTheme, toggle };
}
