import type {
  UserBookmarks,
  UserNotes,
  UserProgress,
  UserRatings,
} from "@/types";

const KEYS = {
  progress: "ghr-progress",
  bookmarks: "ghr-bookmarks",
  notes: "ghr-notes",
  ratings: "ghr-ratings",
  theme: "ghr-theme",
} as const;

const defaultProgress: UserProgress = {
  completedTopics: [],
  completedLabs: [],
  completedRoadmapNodes: [],
  topicProgress: {},
};

const defaultBookmarks: UserBookmarks = {
  resources: [],
  topics: [],
  tools: [],
  labs: [],
};

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

export const storage = {
  getProgress: () => read(KEYS.progress, defaultProgress),
  setProgress: (value: UserProgress) => write(KEYS.progress, value),

  getBookmarks: () => read(KEYS.bookmarks, defaultBookmarks),
  setBookmarks: (value: UserBookmarks) => write(KEYS.bookmarks, value),

  getNotes: () => read<UserNotes>(KEYS.notes, {}),
  setNotes: (value: UserNotes) => write(KEYS.notes, value),

  getRatings: () => read<UserRatings>(KEYS.ratings, {}),
  setRatings: (value: UserRatings) => write(KEYS.ratings, value),

  getTheme: () =>
    typeof window === "undefined"
      ? "dark"
      : (localStorage.getItem(KEYS.theme) as "light" | "dark" | null) ??
        "dark",
  setTheme: (theme: "light" | "dark") =>
    localStorage.setItem(KEYS.theme, theme),
};
