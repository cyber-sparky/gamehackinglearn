import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { getLearningPath, learningPaths } from "@/data";
import { DifficultyBadge } from "@/components/ui/Badge";
import { LearningPathDetail } from "./LearningPathDetail";
import { formatHours } from "@/lib/utils";

export async function generateStaticParams() {
  return learningPaths.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const path = getLearningPath(slug);
  return {
    title: path?.title ?? "Learning Path",
    description: path?.description,
  };
}

export default async function LearningPathPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const path = getLearningPath(slug);
  if (!path) notFound();

  return (
    <div className="mx-auto max-w-4xl">
      <nav className="mb-6 text-sm text-muted">
        <Link href="/learning-paths" className="hover:text-accent">
          Learning Paths
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{path.title}</span>
      </nav>

      <h1 className="text-3xl font-bold text-foreground">{path.title}</h1>
      <p className="mt-2 text-lg text-muted">{path.description}</p>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <DifficultyBadge difficulty={path.difficulty} />
        <span className="text-sm text-muted">
          {path.modules.length} modules · {formatHours(path.estimatedHours)}
        </span>
      </div>

      <LearningPathDetail path={path} />
    </div>
  );
}
