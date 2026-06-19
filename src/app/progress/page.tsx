"use client";

import Link from "next/link";
import {
  sections,
  getAllTopics,
  labs,
  roadmaps,
  getSectionProgress,
} from "@/data";
import { useProgress } from "@/lib/hooks";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { DifficultyBadge } from "@/components/ui/Badge";
import { formatHours } from "@/lib/utils";
import { CheckCircle2, Circle } from "lucide-react";

export default function ProgressPage() {
  const { progress, loaded, toggleTopic, toggleLab } = useProgress();

  if (!loaded) {
    return (
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold text-foreground">Progress</h1>
        <p className="mt-4 text-muted">Loading...</p>
      </div>
    );
  }

  const allTopics = getAllTopics();
  const totalTopics = allTopics.length;
  const completedTopics = progress.completedTopics.length;
  const overallPercent = Math.round((completedTopics / totalTopics) * 100);
  const labPercent = Math.round(
    (progress.completedLabs.length / labs.length) * 100
  );
  const totalHours = allTopics
    .filter((t) => progress.completedTopics.includes(t.id))
    .reduce((s, t) => s + t.estimatedHours, 0);

  const roadmapProgress = roadmaps.map((r) => ({
    ...r,
    completed: r.nodes.filter((n) =>
      progress.completedRoadmapNodes.includes(n.id)
    ).length,
    total: r.nodes.length,
  }));

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="text-3xl font-bold text-foreground">Progress Tracking</h1>
      <p className="mt-2 text-muted">
        Your learning progress is saved locally in your browser.
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-5 text-center">
          <p className="text-3xl font-bold text-accent">{overallPercent}%</p>
          <p className="text-sm text-muted">Topics Complete</p>
          <ProgressBar value={overallPercent} className="mt-3" showLabel={false} />
        </div>
        <div className="rounded-xl border border-border bg-card p-5 text-center">
          <p className="text-3xl font-bold text-accent">{labPercent}%</p>
          <p className="text-sm text-muted">Labs Complete</p>
          <ProgressBar value={labPercent} className="mt-3" showLabel={false} />
        </div>
        <div className="rounded-xl border border-border bg-card p-5 text-center">
          <p className="text-3xl font-bold text-accent">
            {formatHours(totalHours)}
          </p>
          <p className="text-sm text-muted">Learning Time</p>
        </div>
      </div>

      <section className="mt-10">
        <h2 className="text-lg font-semibold text-foreground">
          Section Progress
        </h2>
        <div className="mt-4 space-y-3">
          {sections.map((section) => {
            const pct = getSectionProgress(
              section.slug,
              progress.completedTopics
            );
            return (
              <Link
                key={section.slug}
                href={`/sections/${section.slug}`}
                className="block rounded-lg border border-border bg-card p-4 transition-colors hover:border-accent/30"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-foreground">
                    {section.title}
                  </span>
                  <span className="text-sm text-muted">{pct}%</span>
                </div>
                <ProgressBar value={pct} className="mt-2" showLabel={false} />
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-semibold text-foreground">
          Roadmap Progress
        </h2>
        <div className="mt-4 space-y-3">
          {roadmapProgress.map((r) => (
            <Link
              key={r.slug}
              href={`/roadmaps/${r.slug}`}
              className="block rounded-lg border border-border bg-card p-4 transition-colors hover:border-accent/30"
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-foreground">{r.title}</span>
                <span className="text-sm text-muted">
                  {r.completed}/{r.total} nodes
                </span>
              </div>
              <ProgressBar
                value={Math.round((r.completed / r.total) * 100)}
                className="mt-2"
                showLabel={false}
              />
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-semibold text-foreground">All Topics</h2>
        <div className="mt-4 max-h-96 space-y-1 overflow-y-auto rounded-lg border border-border bg-card p-2">
          {allTopics.map((topic) => {
            const done = progress.completedTopics.includes(topic.id);
            return (
              <div
                key={topic.id}
                className="flex items-center gap-3 rounded-md px-3 py-2 hover:bg-muted-bg/50"
              >
                <button
                  onClick={() => toggleTopic(topic.id)}
                  className={done ? "text-success" : "text-muted"}
                >
                  {done ? (
                    <CheckCircle2 className="h-4 w-4 fill-success/20" />
                  ) : (
                    <Circle className="h-4 w-4" />
                  )}
                </button>
                <Link
                  href={`/sections/${topic.sectionSlug}/${topic.id}`}
                  className="flex-1 text-sm text-foreground hover:text-accent"
                >
                  {topic.title}
                </Link>
                <DifficultyBadge difficulty={topic.difficulty} />
              </div>
            );
          })}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-semibold text-foreground">All Labs</h2>
        <div className="mt-4 space-y-1 rounded-lg border border-border bg-card p-2">
          {labs.map((lab) => {
            const done = progress.completedLabs.includes(lab.id);
            return (
              <div
                key={lab.id}
                className="flex items-center gap-3 rounded-md px-3 py-2 hover:bg-muted-bg/50"
              >
                <button
                  onClick={() => toggleLab(lab.id)}
                  className={done ? "text-success" : "text-muted"}
                >
                  {done ? (
                    <CheckCircle2 className="h-4 w-4 fill-success/20" />
                  ) : (
                    <Circle className="h-4 w-4" />
                  )}
                </button>
                <Link
                  href={`/labs#${lab.id}`}
                  className="flex-1 text-sm text-foreground hover:text-accent"
                >
                  {lab.title}
                </Link>
                <DifficultyBadge difficulty={lab.difficulty} />
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
