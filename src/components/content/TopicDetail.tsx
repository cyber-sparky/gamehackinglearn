"use client";

import Link from "next/link";
import {
  Clock,
  CheckCircle2,
  BookOpen,
  FlaskConical,
  Video,
  FileText,
  ListChecks,
  Route,
} from "lucide-react";
import type { Section, Topic } from "@/types";
import { MarkdownContent } from "@/components/content/MarkdownContent";
import { ResourceCard } from "@/components/content/ResourceCard";
import { LabCard } from "@/components/content/LabCard";
import { DifficultyBadge, TagBadge } from "@/components/ui/Badge";
import { BookmarkButton } from "@/components/ui/BookmarkButton";
import { NotesPanel } from "@/components/ui/NotesPanel";
import { useProgress } from "@/lib/hooks";
import { labs } from "@/data";
import { formatHours, cn } from "@/lib/utils";

export function TopicDetail({
  section,
  topic,
}: {
  section: Section;
  topic: Topic;
}) {
  const { progress, toggleTopic, loaded } = useProgress();
  const completed = loaded && progress.completedTopics.includes(topic.id);
  const topicLabs = labs.filter((l) => topic.labs.includes(l.id));

  return (
    <div className="mx-auto max-w-4xl">
      <nav className="mb-6 text-sm text-muted">
        <Link href="/" className="hover:text-accent">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link href={`/sections/${section.slug}`} className="hover:text-accent">
          {section.title}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{topic.title}</span>
      </nav>

      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{topic.title}</h1>
          <p className="mt-2 text-lg text-muted">{topic.description}</p>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <DifficultyBadge difficulty={topic.difficulty} />
            <span className="flex items-center gap-1 text-sm text-muted">
              <Clock className="h-4 w-4" />
              {formatHours(topic.estimatedHours)} estimated
            </span>
            {topic.tags.map((tag) => (
              <TagBadge key={tag} tag={tag} />
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => toggleTopic(topic.id)}
            className={cn(
              "inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors",
              completed
                ? "border-success/50 bg-success/10 text-success"
                : "border-border text-muted hover:border-success/30 hover:text-success"
            )}
          >
            <CheckCircle2 className={cn("h-4 w-4", completed && "fill-success/20")} />
            {completed ? "Completed" : "Mark Complete"}
          </button>
          <BookmarkButton type="topics" id={topic.id} />
        </div>
      </div>

      {topic.prerequisites.length > 0 && (
        <div className="mt-6 rounded-xl border border-border bg-card p-4">
          <h2 className="text-sm font-semibold text-foreground">Prerequisites</h2>
          <div className="mt-2 flex flex-wrap gap-2">
            {topic.prerequisites.map((pre) => {
              const preTopic = section.topics.find((t) => t.id === pre);
              const preSection = preTopic ? section : undefined;
              if (preTopic && preSection) {
                return (
                  <Link
                    key={pre}
                    href={`/sections/${preSection.slug}/${preTopic.id}`}
                    className="rounded-md bg-muted-bg px-3 py-1 text-sm text-accent hover:underline"
                  >
                    {preTopic.title}
                  </Link>
                );
              }
              return (
                <span
                  key={pre}
                  className="rounded-md bg-muted-bg px-3 py-1 text-sm text-muted"
                >
                  {pre}
                </span>
              );
            })}
          </div>
        </div>
      )}

      <section className="mt-8">
        <div className="mb-4 flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-accent" />
          <h2 className="text-xl font-semibold text-foreground">Explanation</h2>
        </div>
        <div className="rounded-xl border border-border bg-card p-6">
          <MarkdownContent content={topic.explanation} />
        </div>
      </section>

      <section className="mt-8">
        <div className="mb-4 flex items-center gap-2">
          <Route className="h-5 w-5 text-accent" />
          <h2 className="text-xl font-semibold text-foreground">Learning Path</h2>
        </div>
        <ol className="space-y-3">
          {topic.learningPath.map((step, i) => (
            <li
              key={i}
              className="flex gap-3 rounded-lg border border-border bg-card p-4"
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent/10 text-sm font-bold text-accent">
                {i + 1}
              </span>
              <p className="text-sm text-muted">{step}</p>
            </li>
          ))}
        </ol>
      </section>

      {topic.exercises.length > 0 && (
        <section className="mt-8">
          <div className="mb-4 flex items-center gap-2">
            <ListChecks className="h-5 w-5 text-accent" />
            <h2 className="text-xl font-semibold text-foreground">
              Practice Exercises
            </h2>
          </div>
          <ul className="space-y-2">
            {topic.exercises.map((ex, i) => (
              <li
                key={i}
                className="flex gap-2 rounded-lg border border-border bg-card p-3 text-sm text-muted"
              >
                <span className="font-mono text-accent">{i + 1}.</span>
                {ex}
              </li>
            ))}
          </ul>
        </section>
      )}

      {topic.documentation.length > 0 && (
        <section className="mt-8">
          <div className="mb-4 flex items-center gap-2">
            <FileText className="h-5 w-5 text-accent" />
            <h2 className="text-xl font-semibold text-foreground">Documentation</h2>
          </div>
          <div className="grid gap-4">
            {topic.documentation.map((r) => (
              <ResourceCard key={r.id} resource={r} />
            ))}
          </div>
        </section>
      )}

      {topic.resources.length > 0 && (
        <section className="mt-8">
          <div className="mb-4 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-accent" />
            <h2 className="text-xl font-semibold text-foreground">
              Free Resources
            </h2>
          </div>
          <div className="grid gap-4">
            {topic.resources.map((r) => (
              <ResourceCard key={r.id} resource={r} />
            ))}
          </div>
        </section>
      )}

      {topic.youtubeVideos.length > 0 && (
        <section className="mt-8">
          <div className="mb-4 flex items-center gap-2">
            <Video className="h-5 w-5 text-accent" />
            <h2 className="text-xl font-semibold text-foreground">
              YouTube Videos
            </h2>
          </div>
          <div className="grid gap-4">
            {topic.youtubeVideos.map((r) => (
              <ResourceCard key={r.id} resource={r} />
            ))}
          </div>
        </section>
      )}

      {topicLabs.length > 0 && (
        <section className="mt-8">
          <div className="mb-4 flex items-center gap-2">
            <FlaskConical className="h-5 w-5 text-accent" />
            <h2 className="text-xl font-semibold text-foreground">Labs</h2>
          </div>
          <div className="grid gap-4">
            {topicLabs.map((lab) => (
              <LabCard key={lab.id} lab={lab} />
            ))}
          </div>
        </section>
      )}

      <section className="mt-8">
        <NotesPanel noteKey={`topic-${topic.id}`} title="Topic Notes" />
      </section>
    </div>
  );
}
