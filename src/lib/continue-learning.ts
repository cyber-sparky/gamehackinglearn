import { getAllTopics, labs, learningPaths } from "@/data";
import { getTopicMastery } from "@/lib/mastery";
import type { UserProgress } from "@/types";

export interface ContinueItem {
  topicId: string;
  title: string;
  sectionSlug: string;
  href: string;
  reason: string;
  masteryPercent: number;
  nextStep: string;
}

function masteryPercent(
  read: number,
  quiz: number | null,
  lab: number,
  hasLab: boolean
): number {
  const parts = [read, quiz ?? 0, hasLab ? lab : 100];
  return Math.round(parts.reduce((a, b) => a + b, 0) / parts.length);
}

export function getContinueLearning(
  progress: UserProgress,
  limit = 3
): ContinueItem[] {
  const allTopics = getAllTopics();
  const items: ContinueItem[] = [];

  const activePath = learningPaths.find(
    (p) => p.id === progress.activeLearningPath
  );
  if (activePath) {
    const nextMod = activePath.modules.find(
      (m) => !progress.completedTopics.includes(m.topicId)
    );
    if (nextMod) {
      const t = allTopics.find((x) => x.id === nextMod.topicId);
      if (t) {
        const m = getTopicMastery(t, progress);
        items.push({
          topicId: t.id,
          title: t.title,
          sectionSlug: t.sectionSlug,
          href: `/sections/${t.sectionSlug}/${t.id}`,
          reason: `Active path: ${activePath.title}`,
          masteryPercent: masteryPercent(
            m.readPercent,
            m.quizPercent,
            m.labPercent,
            m.hasLab
          ),
          nextStep: !m.read
            ? "Finish reading"
            : !m.quiz
              ? "Pass the quiz"
              : m.hasLab && !m.lab
                ? "Complete the lab"
                : "Mark mastered",
        });
      }
    }
  }

  const inProgress = allTopics
    .filter((t) => {
      if (progress.completedTopics.includes(t.id)) return false;
      const visited = progress.topicLastVisited[t.id];
      const read = progress.topicProgress[t.id] ?? 0;
      return visited || read > 0;
    })
    .sort((a, b) => {
      const ta = progress.topicLastVisited[a.id] ?? 0;
      const tb = progress.topicLastVisited[b.id] ?? 0;
      return tb - ta;
    });

  for (const t of inProgress) {
    if (items.some((i) => i.topicId === t.id)) continue;
    const m = getTopicMastery(t, progress);
    items.push({
      topicId: t.id,
      title: t.title,
      sectionSlug: t.sectionSlug,
      href: `/sections/${t.sectionSlug}/${t.id}`,
      reason: "In progress",
      masteryPercent: masteryPercent(
        m.readPercent,
        m.quizPercent,
        m.labPercent,
        m.hasLab
      ),
      nextStep: !m.read
        ? "Continue reading"
        : !m.quiz
          ? "Take the quiz"
          : m.hasLab && !m.lab
            ? "Finish lab steps"
            : "Complete topic",
    });
  }

  if (items.length < limit) {
    const nextNew = allTopics.find(
      (t) =>
        !progress.completedTopics.includes(t.id) &&
        !items.some((i) => i.topicId === t.id) &&
        t.prerequisites.every((p) => progress.completedTopics.includes(p))
    );
    if (nextNew) {
      items.push({
        topicId: nextNew.id,
        title: nextNew.title,
        sectionSlug: nextNew.sectionSlug,
        href: `/sections/${nextNew.sectionSlug}/${nextNew.id}`,
        reason: "Ready to start",
        masteryPercent: 0,
        nextStep: "Start topic",
      });
    }
  }

  return items.slice(0, limit);
}

export function getTopicBundle(topicId: string) {
  const topic = getAllTopics().find((t) => t.id === topicId);
  if (!topic) return null;
  const topicLabs = labs.filter(
    (l) => l.topicId === topicId || topic.labs.includes(l.id)
  );
  return {
    topic,
    labs: topicLabs,
    hasQuiz: true,
    steps: [
      { label: "Read explanation", href: `#explanation`, done: false },
      ...(topicLabs.length
        ? [{ label: `Lab: ${topicLabs[0].title}`, href: `/labs#${topicLabs[0].id}`, done: false }]
        : []),
      { label: "Pass topic quiz", href: `#quiz`, done: false },
    ],
  };
}
