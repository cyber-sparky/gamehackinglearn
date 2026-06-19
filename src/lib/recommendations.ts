import {
  getAllTopics,
  learningPaths,
  getLearningPathModuleProgress,
} from "@/data";
import { arePrerequisitesMet, getLabsForTopic } from "@/lib/progression";
import { getReviewCards } from "@/lib/review";
import type { RecommendedAction, UserProgress } from "@/types";

export function getRecommendedActions(
  progress: UserProgress,
  limit = 5
): RecommendedAction[] {
  const actions: RecommendedAction[] = [];
  const allTopics = getAllTopics();
  const completed = new Set(progress.completedTopics);

  const reviewCards = getReviewCards(progress, 3);
  if (reviewCards.length > 0) {
    actions.push({
      type: "review",
      title: "Review flashcards",
      description: `${reviewCards.length}+ cards due for spaced repetition`,
      href: "/review",
      reason: "Retention boost",
      priority: 95,
    });
  }

  const activePath = learningPaths.find(
    (p) => p.id === progress.activeLearningPath
  );
  if (activePath) {
    const nextModule = activePath.modules.find(
      (m) => !completed.has(m.topicId)
    );
    if (nextModule) {
      actions.push({
        type: "topic",
        title: nextModule.title,
        description: `Next module in ${activePath.title}`,
        href: `/sections/${nextModule.sectionSlug}/${nextModule.topicId}`,
        reason: "Active learning path",
        priority: 100,
      });
    }
  }

  for (const topic of allTopics) {
    if (completed.has(topic.id)) continue;
    if (!arePrerequisitesMet(topic.id, progress.completedTopics)) continue;

    const hasQuiz =
      progress.quizScores[topic.id] === undefined ||
      (progress.quizScores[topic.id] ?? 0) < 80;
    const topicLabs = getLabsForTopic(topic.id);
    const incompleteLab = topicLabs.find(
      (l) => !progress.completedLabs.includes(l.id)
    );

    if (incompleteLab) {
      actions.push({
        type: "lab",
        title: incompleteLab.title,
        description: `Practice lab for ${topic.title}`,
        href: `/labs#${incompleteLab.id}`,
        reason: "Topic ready — complete hands-on lab",
        priority: 85,
      });
    }

    if (hasQuiz && progress.topicLastVisited[topic.id]) {
      actions.push({
        type: "quiz",
        title: `Quiz: ${topic.title}`,
        description: "Verify your understanding before moving on",
        href: `/sections/${topic.sectionSlug}/${topic.id}#quiz`,
        reason: "Topic visited but quiz not passed",
        priority: 75,
      });
    }

    actions.push({
      type: "topic",
      title: topic.title,
      description: topic.description,
      href: `/sections/${topic.sectionSlug}/${topic.id}`,
      reason:
        topic.prerequisites.length > 0
          ? "Prerequisites met — ready to learn"
          : "Foundation topic — start here",
      priority: topic.prerequisites.length === 0 ? 70 : 60,
    });
    if (actions.length >= limit * 2) break;
  }

  if (!activePath) {
    const bestPath = learningPaths.find(
      (p) => getLearningPathModuleProgress(p, progress.completedTopics) < 100
    );
    if (bestPath) {
      actions.push({
        type: "path",
        title: bestPath.title,
        description: bestPath.description,
        href: `/learning-paths/${bestPath.slug}`,
        reason: "Structured curriculum available",
        priority: 50,
      });
    }
  }

  const stale = allTopics
    .filter((t) => {
      const visited = progress.topicLastVisited[t.id];
      if (!visited || completed.has(t.id)) return false;
      return Date.now() - visited > 7 * 24 * 60 * 60 * 1000;
    })
    .slice(0, 1);

  for (const t of stale) {
    actions.push({
      type: "topic",
      title: `Review: ${t.title}`,
      description: "You started this over a week ago",
      href: `/sections/${t.sectionSlug}/${t.id}`,
      reason: "Stale topic — revisit to retain knowledge",
      priority: 90,
    });
  }

  return actions
    .sort((a, b) => b.priority - a.priority)
    .filter(
      (a, i, arr) => arr.findIndex((x) => x.href === a.href) === i
    )
    .slice(0, limit);
}
