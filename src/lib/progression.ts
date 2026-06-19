import { getAllTopics, labs, learningPaths, skillTree } from "@/data";
import type { ProgressionNode } from "@/types";

let _graph: ProgressionNode[] | null = null;

export function getProgressionGraph(): ProgressionNode[] {
  if (_graph) return _graph;
  _graph = getAllTopics().map((t) => ({
    id: `node-${t.id}`,
    topicId: t.id,
    sectionSlug: t.sectionSlug,
    sectionTitle: t.sectionTitle,
    title: t.title,
    difficulty: t.difficulty,
    prerequisites: t.prerequisites,
    estimatedHours: t.estimatedHours,
    labIds: t.labs,
  }));
  return _graph;
}

export function getProgressionNode(topicId: string): ProgressionNode | undefined {
  return getProgressionGraph().find((n) => n.topicId === topicId);
}

export function arePrerequisitesMet(
  topicId: string,
  completedTopicIds: string[]
): boolean {
  const node = getProgressionNode(topicId);
  if (!node) return true;
  return node.prerequisites.every((p) => completedTopicIds.includes(p));
}

export function getTopicUnlockState(
  topicId: string,
  completedTopicIds: string[]
): "locked" | "available" | "completed" {
  if (completedTopicIds.includes(topicId)) return "completed";
  return arePrerequisitesMet(topicId, completedTopicIds) ? "available" : "locked";
}

export function getSkillTreeNodeState(
  nodeId: string,
  completedSkillNodes: string[],
  completedTopicIds: string[]
): "locked" | "available" | "completed" {
  const node = skillTree.nodes.find((n) => n.id === nodeId);
  if (!node) return "locked";
  if (completedSkillNodes.includes(nodeId)) return "completed";
  const prereqsMet = node.prerequisites.every((p) => {
    const prereqNode = skillTree.nodes.find((n) => n.id === p);
    if (!prereqNode) return true;
    return (
      completedSkillNodes.includes(p) ||
      (prereqNode.topicId
        ? completedTopicIds.includes(prereqNode.topicId)
        : false)
    );
  });
  return prereqsMet ? "available" : "locked";
}

export function getPathModulesForTopic(topicId: string): string[] {
  return learningPaths
    .filter((p) => p.modules.some((m) => m.topicId === topicId))
    .map((p) => p.slug);
}

export function getLabsForTopic(topicId: string) {
  return labs.filter((l) => l.topicId === topicId || l.id.includes(topicId));
}
