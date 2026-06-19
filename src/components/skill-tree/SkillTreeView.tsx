"use client";

import Link from "next/link";
import { CheckCircle2, Lock, Circle } from "lucide-react";
import type { SkillTreeNode } from "@/types";
import { skillTree } from "@/data";
import { useProgress } from "@/lib/hooks";
import { getSkillTreeNodeState } from "@/lib/progression";
import { DifficultyBadge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

type NodeState = "locked" | "available" | "completed";

function SkillNodeCard({
  node,
  state,
  onToggle,
}: {
  node: SkillTreeNode;
  state: NodeState;
  onToggle: () => void;
}) {
  return (
    <div
      className={cn(
        "relative rounded-xl border p-4 transition-all",
        state === "completed" && "border-success/50 bg-success/5",
        state === "available" && "border-accent/40 bg-card hover:border-accent",
        state === "locked" && "border-border bg-muted-bg/30 opacity-60"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            {state === "completed" && (
              <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />
            )}
            {state === "available" && (
              <Circle className="h-4 w-4 shrink-0 text-accent" />
            )}
            {state === "locked" && (
              <Lock className="h-4 w-4 shrink-0 text-muted" />
            )}
            <h3 className="font-semibold text-foreground">{node.label}</h3>
          </div>
          <p className="mt-1 text-xs text-muted line-clamp-2">
            {node.description}
          </p>
          <div className="mt-2">
            <DifficultyBadge difficulty={node.difficulty} />
          </div>
        </div>
        {state !== "locked" && (
          <button
            onClick={onToggle}
            className={cn(
              "shrink-0 rounded-md px-2 py-1 text-xs font-medium transition-colors",
              state === "completed"
                ? "text-success hover:bg-success/10"
                : "text-accent hover:bg-accent/10"
            )}
          >
            {state === "completed" ? "Undo" : "Complete"}
          </button>
        )}
      </div>
      {node.sectionSlug && node.topicId && state !== "locked" && (
        <Link
          href={`/sections/${node.sectionSlug}/${node.topicId}`}
          className="mt-2 block text-xs text-accent hover:underline"
        >
          View topic →
        </Link>
      )}
    </div>
  );
}

export function SkillTreeView() {
  const { progress, toggleSkillNode, loaded } = useProgress();
  const completedSkill = loaded ? progress.completedSkillNodes : [];
  const completedTopics = loaded ? progress.completedTopics : [];

  const getState = (node: SkillTreeNode): NodeState =>
    loaded
      ? getSkillTreeNodeState(
          node.id,
          completedSkill,
          completedTopics
        )
      : "locked";

  const nodesByLevel = new Map<number, SkillTreeNode[]>();
  const levels = new Map<string, number>();

  function assignLevel(id: string, level: number) {
    const node = skillTree.nodes.find((n) => n.id === id);
    if (!node) return;
    levels.set(id, Math.max(levels.get(id) ?? 0, level));
    for (const child of skillTree.nodes) {
      if (child.prerequisites.includes(id)) {
        assignLevel(child.id, level + 1);
      }
    }
  }

  const roots = skillTree.nodes.filter((n) => n.prerequisites.length === 0);
  roots.forEach((r) => assignLevel(r.id, 0));
  skillTree.nodes.forEach((n) => {
    if (!levels.has(n.id)) assignLevel(n.id, 0);
  });

  skillTree.nodes.forEach((n) => {
    const level = levels.get(n.id) ?? 0;
    if (!nodesByLevel.has(level)) nodesByLevel.set(level, []);
    nodesByLevel.get(level)!.push(n);
  });

  const maxLevel = Math.max(...levels.values(), 0);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-4 text-sm text-muted">
        <span className="flex items-center gap-1.5">
          <Lock className="h-4 w-4" /> Locked
        </span>
        <span className="flex items-center gap-1.5">
          <Circle className="h-4 w-4 text-accent" /> Available
        </span>
        <span className="flex items-center gap-1.5">
          <CheckCircle2 className="h-4 w-4 text-success" /> Completed
        </span>
      </div>

      {Array.from({ length: maxLevel + 1 }, (_, level) => {
        const levelNodes = nodesByLevel.get(level) ?? [];
        if (levelNodes.length === 0) return null;
        return (
          <div key={level}>
            {level > 0 && (
              <div className="mb-4 flex justify-center">
                <div className="h-6 w-px bg-border" />
              </div>
            )}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {levelNodes.map((node) => (
                <SkillNodeCard
                  key={node.id}
                  node={node}
                  state={getState(node)}
                  onToggle={() => toggleSkillNode(node.id)}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
