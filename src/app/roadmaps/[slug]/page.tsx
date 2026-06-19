import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getRoadmap, roadmaps } from "@/data";
import { RoadmapGraph } from "@/components/roadmap/RoadmapGraph";
import { DifficultyBadge } from "@/components/ui/Badge";
import { formatHours } from "@/lib/utils";

export async function generateStaticParams() {
  return roadmaps.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const roadmap = getRoadmap(slug);
  return {
    title: roadmap?.title ?? "Roadmap",
    description: roadmap?.description,
  };
}

export default async function RoadmapDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const roadmap = getRoadmap(slug);
  if (!roadmap) notFound();

  const totalHours = roadmap.nodes.reduce((s, n) => s + n.estimatedHours, 0);

  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="text-3xl font-bold text-foreground">{roadmap.title}</h1>
      <p className="mt-2 max-w-3xl text-lg text-muted">{roadmap.description}</p>
      <p className="mt-2 text-sm text-muted">
        {roadmap.nodes.length} nodes · {formatHours(totalHours)} estimated
      </p>

      <div className="mt-8">
        <RoadmapGraph roadmap={roadmap} />
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold text-foreground">All Nodes</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {roadmap.nodes.map((node) => (
            <div
              key={node.id}
              className="rounded-lg border border-border bg-card p-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-foreground">{node.label}</h3>
                <DifficultyBadge difficulty={node.difficulty} />
              </div>
              <p className="mt-1 text-sm text-muted">{node.description}</p>
              <p className="mt-2 text-xs text-muted">
                {formatHours(node.estimatedHours)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
