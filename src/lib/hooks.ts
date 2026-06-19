"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";
import {
  getStoreServerSnapshot,
  getStoreSnapshot,
  getThemeSnapshot,
  setStoreSnapshot,
  setThemeSnapshot,
  subscribeStore,
  type PersistKey,
} from "./storage";
import { recordStudyActivity } from "./streak";
import { scheduleNextReview } from "./review";
import { getAllTopics } from "@/data";
import { getTopicMastery } from "./mastery";
import { mergeSkillSync } from "./skill-sync";
import { defaultWeeklyGoal } from "./weekly-goal";
import type {
  UserBookmarks,
  UserNotes,
  UserOnboarding,
  UserProgress,
  UserRatings,
} from "@/types";

// Server snapshot is constant `false`; client snapshot is constant `true`.
// React renders with the server snapshot during SSR/hydration and then
// re-renders with the client value, so `loaded` flips to true after mount.
const getServerLoaded = () => false;
const getClientLoaded = () => true;

function useLoaded(): boolean {
  return useSyncExternalStore(subscribeStore, getClientLoaded, getServerLoaded);
}

/**
 * Reads persisted client state via `useSyncExternalStore`. This is the
 * canonical React pattern for external stores: it avoids `setState`-in-effect
 * (no cascading renders / "Maximum update depth exceeded"), stays
 * hydration-safe, and keeps every tab in sync automatically.
 */
export function useLocalStorage<T>(key: PersistKey) {
  const value = useSyncExternalStore<T>(
    subscribeStore,
    () => getStoreSnapshot<T>(key),
    () => getStoreServerSnapshot<T>(key)
  );
  const loaded = useLoaded();

  // Accepts the next value or an updater. Stable across renders, so consumers
  // can safely list it in effect/callback dependency arrays.
  const persist = useCallback(
    (next: T | ((prev: T) => T)) => {
      const resolved =
        typeof next === "function"
          ? (next as (p: T) => T)(getStoreSnapshot<T>(key))
          : next;
      setStoreSnapshot<T>(key, resolved);
    },
    [key]
  );

  return { value, setValue: persist, loaded };
}

export function useProgress() {
  const { value, setValue, loaded } = useLocalStorage<UserProgress>("progress");

  const toggleTopic = useCallback(
    (topicId: string, force = false) => {
      setValue((prev) => {
        const isDone = prev.completedTopics.includes(topicId);
        if (isDone) {
            const { [topicId]: _removed, ...topicCompletedAt } =
              prev.topicCompletedAt ?? {};
            void _removed;
            return {
            ...prev,
            completedTopics: prev.completedTopics.filter((id) => id !== topicId),
            forceCompletedTopics: prev.forceCompletedTopics.filter(
              (id) => id !== topicId
            ),
            topicCompletedAt,
            weeklyCompletions: {
              ...prev.weeklyCompletions,
              topics: (prev.weeklyCompletions?.topics ?? []).filter(
                (id) => id !== topicId
              ),
            },
          };
        }
        const topic = getAllTopics().find((t) => t.id === topicId);
        const now = Date.now();
        const skillNodes = topic
          ? mergeSkillSync(
              {
                ...prev,
                completedTopics: [...prev.completedTopics, topicId],
              },
              topic
            )
          : prev.completedSkillNodes;
        const mastery = topic ? getTopicMastery(topic, prev) : null;
        const syncedSkills =
          mastery?.mastered || force
            ? skillNodes
            : prev.completedSkillNodes;

        return {
          ...prev,
          completedTopics: [...prev.completedTopics, topicId],
          forceCompletedTopics: force
            ? [...prev.forceCompletedTopics, topicId]
            : prev.forceCompletedTopics,
          reviewSchedule: {
            ...prev.reviewSchedule,
            [topicId]: scheduleNextReview(),
          },
          topicCompletedAt: {
            ...prev.topicCompletedAt,
            [topicId]: now,
          },
          weeklyCompletions: {
            topics: [...new Set([...(prev.weeklyCompletions?.topics ?? []), topicId])],
            labs: prev.weeklyCompletions?.labs ?? [],
          },
          weeklyGoal: prev.weeklyGoal?.weekKey
            ? prev.weeklyGoal
            : defaultWeeklyGoal(),
          completedSkillNodes: syncedSkills,
        };
      });
    },
    [setValue]
  );

  const toggleLabStep = useCallback(
    (labId: string, stepIndex: number, totalSteps: number) => {
      setValue((prev) => {
        const current = prev.labStepProgress[labId] ?? [];
        const steps = Array.from({ length: totalSteps }, (_, i) =>
          i === stepIndex ? !current[i] : (current[i] ?? false)
        );
        const allDone = steps.every(Boolean);
        const now = Date.now();
        const wasComplete = prev.completedLabs.includes(labId);
        const completedLabs =
          allDone && !wasComplete
            ? [...prev.completedLabs, labId]
            : !allDone
              ? prev.completedLabs.filter((id) => id !== labId)
              : prev.completedLabs;
        return {
          ...prev,
          labStepProgress: { ...prev.labStepProgress, [labId]: steps },
          completedLabs,
          ...(allDone && !wasComplete
            ? {
                labCompletedAt: { ...prev.labCompletedAt, [labId]: now },
                weeklyCompletions: {
                  topics: prev.weeklyCompletions?.topics ?? [],
                  labs: [
                    ...new Set([...(prev.weeklyCompletions?.labs ?? []), labId]),
                  ],
                },
              }
            : {}),
        };
      });
    },
    [setValue]
  );

  const recordStudyMinutes = useCallback(
    (topicId: string, minutes: number) => {
      setValue((prev) => ({
        ...prev,
        ...recordStudyActivity(prev, topicId, minutes),
      }));
    },
    [setValue]
  );

  const markReviewComplete = useCallback(
    (topicId: string) => {
      setValue((prev) => ({
        ...prev,
        reviewSchedule: {
          ...prev.reviewSchedule,
          [topicId]: scheduleNextReview(),
        },
      }));
    },
    [setValue]
  );

  const toggleChallenge = useCallback(
    (challengeId: string) => {
      setValue((prev) => {
        const list = prev.completedChallenges ?? [];
        return {
          ...prev,
          completedChallenges: list.includes(challengeId)
            ? list.filter((id) => id !== challengeId)
            : [...list, challengeId],
        };
      });
    },
    [setValue]
  );

  const toggleLab = useCallback(
    (labId: string) => {
      setValue((prev) => ({
        ...prev,
        completedLabs: prev.completedLabs.includes(labId)
          ? prev.completedLabs.filter((id) => id !== labId)
          : [...prev.completedLabs, labId],
      }));
    },
    [setValue]
  );

  const toggleRoadmapNode = useCallback(
    (nodeId: string) => {
      setValue((prev) => ({
        ...prev,
        completedRoadmapNodes: prev.completedRoadmapNodes.includes(nodeId)
          ? prev.completedRoadmapNodes.filter((id) => id !== nodeId)
          : [...prev.completedRoadmapNodes, nodeId],
      }));
    },
    [setValue]
  );

  const setTopicProgress = useCallback(
    (topicId: string, percent: number) => {
      setValue((prev) => ({
        ...prev,
        topicProgress: { ...prev.topicProgress, [topicId]: percent },
      }));
    },
    [setValue]
  );

  const toggleSkillNode = useCallback(
    (nodeId: string) => {
      setValue((prev) => ({
        ...prev,
        completedSkillNodes: prev.completedSkillNodes.includes(nodeId)
          ? prev.completedSkillNodes.filter((id) => id !== nodeId)
          : [...prev.completedSkillNodes, nodeId],
      }));
    },
    [setValue]
  );

  const setActiveLearningPath = useCallback(
    (pathId: string | undefined) => {
      setValue((prev) => ({ ...prev, activeLearningPath: pathId }));
    },
    [setValue]
  );

  const recordTopicVisit = useCallback(
    (topicId: string) => {
      setValue((prev) => ({
        ...prev,
        topicLastVisited: {
          ...prev.topicLastVisited,
          [topicId]: Date.now(),
        },
      }));
    },
    [setValue]
  );

  const setQuizScore = useCallback(
    (topicId: string, percent: number) => {
      setValue((prev) => {
        const next: UserProgress = {
          ...prev,
          quizScores: { ...prev.quizScores, [topicId]: percent },
        };
        const topic = getAllTopics().find((t) => t.id === topicId);
        if (topic && getTopicMastery(topic, next).mastered) {
          next.completedSkillNodes = mergeSkillSync(next, topic);
        }
        return next;
      });
    },
    [setValue]
  );

  const confirmLabOutcome = useCallback(
    (labId: string, confirmed: boolean) => {
      setValue((prev) => ({
        ...prev,
        labOutcomeConfirmed: {
          ...prev.labOutcomeConfirmed,
          [labId]: confirmed,
        },
      }));
    },
    [setValue]
  );

  const setJournalEntry = useCallback(
    (dateKey: string, entry: string) => {
      setValue((prev) => ({
        ...prev,
        learningJournal: { ...prev.learningJournal, [dateKey]: entry },
      }));
    },
    [setValue]
  );

  const setWeeklyGoalTargets = useCallback(
    (topicsTarget: number, labsTarget: number) => {
      setValue((prev) => ({
        ...prev,
        weeklyGoal: {
          ...defaultWeeklyGoal(),
          topicsTarget,
          labsTarget,
        },
      }));
    },
    [setValue]
  );

  const dismissBackupReminder = useCallback(() => {
    const month = new Date().toISOString().slice(0, 7);
    setValue((prev) => ({ ...prev, backupReminderMonth: month }));
  }, [setValue]);

  const acknowledgePlatformTips = useCallback(() => {
    setValue((prev) => ({ ...prev, platformTipsSeen: true }));
  }, [setValue]);

  return {
    progress: value,
    loaded,
    toggleTopic,
    toggleLab,
    toggleLabStep,
    toggleRoadmapNode,
    setTopicProgress,
    toggleSkillNode,
    setActiveLearningPath,
    recordTopicVisit,
    setQuizScore,
    recordStudyMinutes,
    markReviewComplete,
    toggleChallenge,
    confirmLabOutcome,
    setJournalEntry,
    setWeeklyGoalTargets,
    dismissBackupReminder,
    acknowledgePlatformTips,
  };
}

export function useBookmarks() {
  const { value, setValue, loaded } =
    useLocalStorage<UserBookmarks>("bookmarks");

  const toggle = useCallback(
    (type: keyof UserBookmarks, id: string) => {
      setValue((prev) => {
        const list = prev[type];
        return {
          ...prev,
          [type]: list.includes(id)
            ? list.filter((item) => item !== id)
            : [...list, id],
        };
      });
    },
    [setValue]
  );

  const isBookmarked = useCallback(
    (type: keyof UserBookmarks, id: string) => value[type].includes(id),
    [value]
  );

  return { bookmarks: value, loaded, toggle, isBookmarked };
}

export function useNotes() {
  const { value, setValue, loaded } = useLocalStorage<UserNotes>("notes");

  const setNote = useCallback(
    (key: string, note: string) => {
      setValue((prev) => ({ ...prev, [key]: note }));
    },
    [setValue]
  );

  const getNote = useCallback((key: string) => value[key] ?? "", [value]);

  return { notes: value, loaded, setNote, getNote };
}

export function useRatings() {
  const { value, setValue, loaded } = useLocalStorage<UserRatings>("ratings");

  const rate = useCallback(
    (resourceId: string, rating: number) => {
      setValue((prev) => ({ ...prev, [resourceId]: rating }));
    },
    [setValue]
  );

  const getRating = useCallback(
    (resourceId: string) => value[resourceId] ?? 0,
    [value]
  );

  return { ratings: value, loaded, rate, getRating };
}

const getServerTheme = () => "dark" as const;

export function useTheme() {
  const theme = useSyncExternalStore(
    subscribeStore,
    getThemeSnapshot,
    getServerTheme
  );

  // Syncing the <html> class to the current theme is a legitimate effect:
  // it pushes React state out to an external system (the DOM) rather than
  // calling setState, so it does not cause cascading renders.
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const setTheme = useCallback((next: "light" | "dark") => {
    setThemeSnapshot(next);
  }, []);

  const toggle = useCallback(
    () => setThemeSnapshot(theme === "dark" ? "light" : "dark"),
    [theme]
  );

  return { theme, setTheme, toggle };
}

export function useOnboarding() {
  const { value, setValue, loaded } =
    useLocalStorage<UserOnboarding>("onboarding");

  const complete = useCallback(
    (data: Omit<UserOnboarding, "completed">) => {
      setValue({ ...data, completed: true });
    },
    [setValue]
  );

  return { onboarding: value, loaded, complete, setOnboarding: setValue };
}
