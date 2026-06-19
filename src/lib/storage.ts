import type {
  UserBookmarks,
  UserNotes,
  UserOnboarding,
  UserProgress,
  UserRatings,
} from "@/types";

const KEYS = {
  progress: "ghr-progress",
  bookmarks: "ghr-bookmarks",
  notes: "ghr-notes",
  ratings: "ghr-ratings",
  theme: "ghr-theme",
  onboarding: "ghr-onboarding",
} as const;

// Stable fallback references. They MUST be module-level constants (not
// recreated per render) so that `useSyncExternalStore`'s server snapshot is
// referentially stable and does not trigger re-render loops.
export const defaultProgress: UserProgress = {
  completedTopics: [],
  completedLabs: [],
  completedRoadmapNodes: [],
  completedSkillNodes: [],
  topicProgress: {},
  completedPathModules: {},
  quizScores: {},
  topicLastVisited: {},
  labStepProgress: {},
  studyMinutes: {},
  studyStreak: 0,
  forceCompletedTopics: [],
  reviewSchedule: {},
  completedChallenges: [],
  topicCompletedAt: {},
  labCompletedAt: {},
  labOutcomeConfirmed: {},
  weeklyGoal: { weekKey: "", topicsTarget: 2, labsTarget: 1 },
  weeklyCompletions: { topics: [], labs: [] },
  learningJournal: {},
};

export const defaultOnboarding: UserOnboarding = {
  completed: false,
  experienceLevel: "none",
  interests: [],
};

export const defaultBookmarks: UserBookmarks = {
  resources: [],
  topics: [],
  tools: [],
  labs: [],
};

export const defaultNotes: UserNotes = {};
export const defaultRatings: UserRatings = {};

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
  getProgress: () => {
    const stored = read(KEYS.progress, defaultProgress);
    return {
      ...defaultProgress,
      ...stored,
      completedSkillNodes: stored.completedSkillNodes ?? [],
      completedPathModules: stored.completedPathModules ?? {},
      quizScores: stored.quizScores ?? {},
      topicLastVisited: stored.topicLastVisited ?? {},
      labStepProgress: stored.labStepProgress ?? {},
      studyMinutes: stored.studyMinutes ?? {},
      studyStreak: stored.studyStreak ?? 0,
      forceCompletedTopics: stored.forceCompletedTopics ?? [],
      reviewSchedule: stored.reviewSchedule ?? {},
      completedChallenges: stored.completedChallenges ?? [],
      topicCompletedAt: stored.topicCompletedAt ?? {},
      labCompletedAt: stored.labCompletedAt ?? {},
      labOutcomeConfirmed: stored.labOutcomeConfirmed ?? {},
      weeklyGoal: stored.weeklyGoal ?? {
        weekKey: "",
        topicsTarget: 2,
        labsTarget: 1,
      },
      weeklyCompletions: stored.weeklyCompletions ?? { topics: [], labs: [] },
      learningJournal: stored.learningJournal ?? {},
      backupReminderMonth: stored.backupReminderMonth,
      platformTipsSeen: stored.platformTipsSeen,
    };
  },
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

  getOnboarding: () => read(KEYS.onboarding, defaultOnboarding),
  setOnboarding: (value: UserOnboarding) => write(KEYS.onboarding, value),
};

/* -------------------------------------------------------------------------- */
/* Reactive store layer (for useSyncExternalStore)                            */
/* -------------------------------------------------------------------------- */

export type PersistKey = "progress" | "bookmarks" | "notes" | "ratings" | "onboarding";

const STORAGE_KEY_BY_NAME: Record<PersistKey, string> = {
  progress: KEYS.progress,
  bookmarks: KEYS.bookmarks,
  notes: KEYS.notes,
  ratings: KEYS.ratings,
  onboarding: KEYS.onboarding,
};

// Snapshots must be cached so that getSnapshot() returns a referentially
// stable value between renders — otherwise useSyncExternalStore loops forever.
const snapshotCache = new Map<string, unknown>();
const listeners = new Set<() => void>();
let storageListenerAttached = false;

function emit() {
  for (const listener of listeners) listener();
}

function ensureStorageListener() {
  if (storageListenerAttached || typeof window === "undefined") return;
  storageListenerAttached = true;
  // Keep the in-memory cache in sync when another tab mutates localStorage.
  window.addEventListener("storage", (event) => {
    if (!event.key) {
      snapshotCache.clear();
      emit();
      return;
    }
    for (const [name, storageKey] of Object.entries(STORAGE_KEY_BY_NAME)) {
      if (storageKey === event.key) snapshotCache.delete(name);
    }
    if (event.key === KEYS.theme) snapshotCache.delete("theme");
    emit();
  });
}

export function subscribeStore(listener: () => void): () => void {
  ensureStorageListener();
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

const SNAPSHOT_READERS: Record<PersistKey, () => unknown> = {
  progress: storage.getProgress,
  bookmarks: storage.getBookmarks,
  notes: storage.getNotes,
  ratings: storage.getRatings,
  onboarding: storage.getOnboarding,
};

// Stable defaults used for the server/hydration snapshot. They must be the
// exact same references on server and client so hydration stays consistent.
const SNAPSHOT_DEFAULTS: Record<PersistKey, unknown> = {
  progress: defaultProgress,
  bookmarks: defaultBookmarks,
  notes: defaultNotes,
  ratings: defaultRatings,
  onboarding: defaultOnboarding,
};

export function getStoreSnapshot<T>(name: PersistKey): T {
  if (!snapshotCache.has(name)) {
    snapshotCache.set(name, SNAPSHOT_READERS[name]());
  }
  return snapshotCache.get(name) as T;
}

export function getStoreServerSnapshot<T>(name: PersistKey): T {
  return SNAPSHOT_DEFAULTS[name] as T;
}

const SNAPSHOT_WRITERS: Record<PersistKey, (value: unknown) => void> = {
  progress: storage.setProgress as (v: unknown) => void,
  bookmarks: storage.setBookmarks as (v: unknown) => void,
  notes: storage.setNotes as (v: unknown) => void,
  ratings: storage.setRatings as (v: unknown) => void,
  onboarding: storage.setOnboarding as (v: unknown) => void,
};

export function setStoreSnapshot<T>(name: PersistKey, value: T): void {
  snapshotCache.set(name, value);
  SNAPSHOT_WRITERS[name](value);
  emit();
}

export function getThemeSnapshot(): "light" | "dark" {
  if (!snapshotCache.has("theme")) {
    snapshotCache.set("theme", storage.getTheme());
  }
  return snapshotCache.get("theme") as "light" | "dark";
}

export function setThemeSnapshot(theme: "light" | "dark"): void {
  snapshotCache.set("theme", theme);
  storage.setTheme(theme);
  emit();
}
