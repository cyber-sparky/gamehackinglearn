import type { LearningPath, UserProgress } from "@/types";
import { getAllTopics } from "@/data";

const HOURS_PER_WEEK = 8;

export function estimatePathTimeline(
  path: LearningPath,
  progress: UserProgress
): {
  remainingHours: number;
  weeksAtPace: number;
  percentComplete: number;
  modulesRemaining: number;
} {
  const completed = new Set(progress.completedTopics);
  const remainingModules = path.modules.filter((m) => !completed.has(m.topicId));
  const remainingHours = remainingModules.reduce((s, m) => {
    const t = getAllTopics().find((x) => x.id === m.topicId);
    return s + (t?.estimatedHours ?? m.estimatedHours);
  }, 0);
  const total = path.modules.length;
  const done = total - remainingModules.length;
  return {
    remainingHours,
    weeksAtPace: Math.max(1, Math.ceil(remainingHours / HOURS_PER_WEEK)),
    percentComplete: total ? Math.round((done / total) * 100) : 0,
    modulesRemaining: remainingModules.length,
  };
}
