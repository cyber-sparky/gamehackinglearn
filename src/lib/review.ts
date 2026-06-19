import { getAllTopics } from "@/data";
import { getQuizForTopic } from "@/lib/quizzes";
import type { ReviewCard, UserProgress } from "@/types";

const REVIEW_INTERVAL_MS = 14 * 24 * 60 * 60 * 1000;
const STALE_MS = 7 * 24 * 60 * 60 * 1000;

export function getReviewCards(
  progress: UserProgress,
  limit = 20
): ReviewCard[] {
  const cards: ReviewCard[] = [];
  const allTopics = getAllTopics();
  const now = Date.now();

  for (const topic of allTopics) {
    const visited = progress.topicLastVisited[topic.id];
    const quizScore = progress.quizScores[topic.id];
    const completed = progress.completedTopics.includes(topic.id);
    const nextReview = progress.reviewSchedule[topic.id] ?? 0;

    let dueReason: string | null = null;
    if (quizScore !== undefined && quizScore < 80) {
      dueReason = "Quiz score below 80%";
    } else if (completed && nextReview > 0 && now >= nextReview) {
      dueReason = "Scheduled spaced review";
    } else if (
      visited &&
      !completed &&
      now - visited > STALE_MS
    ) {
      dueReason = "Started over a week ago";
    } else if (completed && (!nextReview || nextReview === 0)) {
      dueReason = "Recently completed — reinforce";
    }

    if (!dueReason) continue;

    const quiz = getQuizForTopic(topic);
    for (const q of quiz.questions.slice(0, 2)) {
      cards.push({
        id: `${topic.id}-${q.id}`,
        topicId: topic.id,
        topicTitle: topic.title,
        sectionSlug: topic.sectionSlug,
        question: q.question,
        answer: q.options[q.correctIndex],
        explanation: q.explanation,
        dueReason,
      });
    }
  }

  return cards
    .sort((a, b) => {
      const priority = (r: string) =>
        r.includes("below") ? 3 : r.includes("Scheduled") ? 2 : 1;
      return priority(b.dueReason) - priority(a.dueReason);
    })
    .slice(0, limit);
}

export function scheduleNextReview(): number {
  return Date.now() + REVIEW_INTERVAL_MS;
}
