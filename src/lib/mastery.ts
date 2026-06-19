import { labs } from "@/data";
import type { Topic, UserProgress, TopicMasteryState } from "@/types";

const READ_THRESHOLD = 80;
const QUIZ_THRESHOLD = 80;

export function getTopicLabs(topicId: string, topicLabIds: string[]) {
  return labs.filter(
    (l) => topicLabIds.includes(l.id) || l.topicId === topicId
  );
}

export function getLabStepProgress(
  labId: string,
  stepCount: number,
  progress: UserProgress
): boolean[] {
  const stored = progress.labStepProgress[labId] ?? [];
  return Array.from({ length: stepCount }, (_, i) => stored[i] ?? false);
}

export function getLabCompletionPercent(
  labId: string,
  stepCount: number,
  progress: UserProgress
): number {
  if (stepCount === 0) return 100;
  const steps = getLabStepProgress(labId, stepCount, progress);
  const done = steps.filter(Boolean).length;
  return Math.round((done / stepCount) * 100);
}

export function isLabFullyComplete(
  labId: string,
  stepCount: number,
  progress: UserProgress
): boolean {
  return getLabCompletionPercent(labId, stepCount, progress) === 100;
}

export function getTopicMastery(
  topic: Topic,
  progress: UserProgress
): TopicMasteryState {
  const topicLabs = getTopicLabs(topic.id, topic.labs);
  const hasLab = topicLabs.length > 0;
  const readPercent = progress.topicProgress[topic.id] ?? 0;
  const read = readPercent >= READ_THRESHOLD;
  const quizScore = progress.quizScores[topic.id];
  const quizPercent = quizScore ?? null;
  const quiz = quizScore !== undefined && quizScore >= QUIZ_THRESHOLD;

  let labPercent = 100;
  if (hasLab) {
    const labPercents = topicLabs.map((l) =>
      getLabCompletionPercent(l.id, l.steps.length, progress)
    );
    labPercent = Math.round(
      labPercents.reduce((a, b) => a + b, 0) / labPercents.length
    );
  }
  const lab =
    !hasLab ||
    topicLabs.every(
      (l) =>
        progress.completedLabs.includes(l.id) ||
        (isLabFullyComplete(l.id, l.steps.length, progress) &&
          (!l.expectedOutcome || progress.labOutcomeConfirmed?.[l.id]))
    );

  const forceCompleted = progress.forceCompletedTopics.includes(topic.id);
  const mastered = forceCompleted || (read && quiz && lab);

  return {
    read,
    quiz,
    lab,
    mastered,
    readPercent,
    quizPercent,
    labPercent,
    hasLab,
  };
}

export function canAutoCompleteTopic(
  topic: Topic,
  progress: UserProgress
): boolean {
  return getTopicMastery(topic, progress).mastered;
}
