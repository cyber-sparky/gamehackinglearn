import { skillTree } from "@/data";
import type { Topic, UserProgress } from "@/types";
import { getTopicMastery } from "@/lib/mastery";

export function getSkillNodesToSync(
  topic: Topic,
  progress: UserProgress
): string[] {
  const mastery = getTopicMastery(topic, progress);
  if (!mastery.mastered) return [];

  return skillTree.nodes
    .filter(
      (n) =>
        n.topicId === topic.id &&
        !progress.completedSkillNodes.includes(n.id)
    )
    .map((n) => n.id);
}

export function mergeSkillSync(
  progress: UserProgress,
  topic: Topic
): string[] {
  const toAdd = getSkillNodesToSync(topic, progress);
  if (toAdd.length === 0) return progress.completedSkillNodes;
  return [...new Set([...progress.completedSkillNodes, ...toAdd])];
}
