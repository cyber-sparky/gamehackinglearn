"use client";

import { useCallback, useEffect } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge,
  MarkerType,
  Handle,
  Position,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import Link from "next/link";
import type { Roadmap, RoadmapNode } from "@/types";
import { useProgress } from "@/lib/hooks";
import { DifficultyBadge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import { CheckCircle2 } from "lucide-react";

function RoadmapNodeComponent({ data }: { data: RoadmapNode & { completed: boolean; onToggle: () => void } }) {
  return (
    <div
      className={cn(
        "min-w-[180px] max-w-[220px] rounded-lg border bg-card p-3 shadow-lg transition-all",
        data.completed ? "border-success/50" : "border-border"
      )}
    >
      <Handle type="target" position={Position.Top} className="!bg-accent" />
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-foreground leading-tight">
            {data.label}
          </p>
          <p className="mt-1 text-xs text-muted line-clamp-2">{data.description}</p>
        </div>
        <button
          onClick={data.onToggle}
          className={cn(
            "shrink-0 rounded-full p-0.5 transition-colors",
            data.completed ? "text-success" : "text-muted hover:text-success"
          )}
          aria-label={data.completed ? "Mark incomplete" : "Mark complete"}
        >
          <CheckCircle2 className={cn("h-5 w-5", data.completed && "fill-success/20")} />
        </button>
      </div>
      <div className="mt-2 flex items-center gap-2">
        <DifficultyBadge difficulty={data.difficulty} />
        <span className="text-xs text-muted">{data.estimatedHours}h</span>
      </div>
      {data.sectionSlug && data.topicId && (
        <Link
          href={`/sections/${data.sectionSlug}/${data.topicId}`}
          className="mt-2 block text-xs text-accent hover:underline"
        >
          View topic →
        </Link>
      )}
      <Handle type="source" position={Position.Bottom} className="!bg-accent" />
    </div>
  );
}

const nodeTypes = { roadmapNode: RoadmapNodeComponent };

function layoutNodes(
  roadmap: Roadmap,
  completedNodes: string[],
  onToggle: (id: string) => void
): { nodes: Node[]; edges: Edge[] } {
  const levels = new Map<string, number>();
  const visited = new Set<string>();

  function assignLevel(id: string, level: number) {
    if (visited.has(id)) return;
    visited.add(id);
    levels.set(id, Math.max(levels.get(id) ?? 0, level));
    roadmap.edges
      .filter((e) => e.from === id)
      .forEach((e) => assignLevel(e.to, level + 1));
  }

  const roots = roadmap.nodes.filter(
    (n) => !roadmap.edges.some((e) => e.to === n.id)
  );
  roots.forEach((r) => assignLevel(r.id, 0));
  roadmap.nodes.forEach((n) => {
    if (!visited.has(n.id)) assignLevel(n.id, 0);
  });

  const byLevel = new Map<number, RoadmapNode[]>();
  roadmap.nodes.forEach((n) => {
    const level = levels.get(n.id) ?? 0;
    if (!byLevel.has(level)) byLevel.set(level, []);
    byLevel.get(level)!.push(n);
  });

  const nodes: Node[] = [];
  byLevel.forEach((levelNodes, level) => {
    const totalWidth = levelNodes.length * 260;
    levelNodes.forEach((node, i) => {
      nodes.push({
        id: node.id,
        type: "roadmapNode",
        position: {
          x: i * 260 - totalWidth / 2 + 130,
          y: level * 180,
        },
        data: {
          ...node,
          completed: completedNodes.includes(node.id),
          onToggle: () => onToggle(node.id),
        },
      });
    });
  });

  const edges: Edge[] = roadmap.edges.map((e) => ({
    id: `${e.from}-${e.to}`,
    source: e.from,
    target: e.to,
    animated: true,
    markerEnd: { type: MarkerType.ArrowClosed, color: "#818cf8" },
    style: { stroke: "#818cf8", strokeWidth: 2 },
  }));

  return { nodes, edges };
}

export function RoadmapGraph({ roadmap }: { roadmap: Roadmap }) {
  const { progress, toggleRoadmapNode, loaded } = useProgress();
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  const refresh = useCallback(() => {
    const { nodes: n, edges: e } = layoutNodes(
      roadmap,
      loaded ? progress.completedRoadmapNodes : [],
      toggleRoadmapNode
    );
    setNodes(n);
    setEdges(e);
  }, [roadmap, progress.completedRoadmapNodes, toggleRoadmapNode, loaded, setNodes, setEdges]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <div className="h-[600px] w-full rounded-xl border border-border bg-card overflow-hidden">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        minZoom={0.3}
        maxZoom={1.5}
        proOptions={{ hideAttribution: true }}
      >
        <Background color="#27272a" gap={20} />
        <Controls className="!bg-card !border-border !shadow-lg [&>button]:!bg-card [&>button]:!border-border [&>button]:!text-foreground" />
        <MiniMap
          className="!bg-card !border-border"
          nodeColor={(n) => {
            const d = (n.data as unknown as RoadmapNode)?.difficulty;
            return d ? "#818cf8" : "#27272a";
          }}
        />
      </ReactFlow>
    </div>
  );
}
