"use client";

import { useEffect, useMemo } from "react";
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
  Target,
  AlertTriangle,
  Lightbulb,
  Lock,
} from "lucide-react";
import type { Section, Topic } from "@/types";
import { GlossaryMarkdown } from "@/components/content/GlossaryMarkdown";
import { TopicLearningBundle } from "@/components/learning/TopicLearningBundle";
import { ResourceCard } from "@/components/content/ResourceCard";
import { LabCard } from "@/components/content/LabCard";
import { QuizPanel } from "@/components/content/QuizPanel";
import { RegisterPlayground } from "@/components/interactive/RegisterPlayground";
import { PatternMatcher } from "@/components/interactive/PatternMatcher";
import { PEHeaderExplorer } from "@/components/interactive/PEHeaderExplorer";
import { PointerChainBuilder } from "@/components/interactive/PointerChainBuilder";
import { HexViewer } from "@/components/interactive/HexViewer";
import { StackFrameVisualizer } from "@/components/interactive/StackFrameVisualizer";
import { CallingConventionPlayground } from "@/components/interactive/CallingConventionPlayground";
import { ImportTableExplorer } from "@/components/interactive/ImportTableExplorer";
import { PointerScanSimulator } from "@/components/interactive/PointerScanSimulator";
import { MasteryRings } from "@/components/mastery/MasteryRings";
import { ScrollProgressTracker } from "@/components/mastery/ScrollProgressTracker";
import { RelatedContentSidebar } from "@/components/content/RelatedContentSidebar";
import { videos } from "@/data";
import { DifficultyBadge, TagBadge } from "@/components/ui/Badge";
import { BookmarkButton } from "@/components/ui/BookmarkButton";
import { NotesPanel } from "@/components/ui/NotesPanel";
import { useProgress } from "@/lib/hooks";
import { labs, getAllTopics } from "@/data";
import { formatHours, cn } from "@/lib/utils";
import { getTopicUnlockState } from "@/lib/progression";
import { getTopicMastery } from "@/lib/mastery";

export function TopicDetail({
  section,
  topic,
}: {
  section: Section;
  topic: Topic;
}) {
  const { progress, toggleTopic, loaded, recordTopicVisit } = useProgress();
  const completed = loaded && progress.completedTopics.includes(topic.id);
  const mastery = loaded
    ? getTopicMastery(topic, progress)
    : {
        read: false,
        quiz: false,
        lab: false,
        mastered: false,
        readPercent: 0,
        quizPercent: null,
        labPercent: 0,
        hasLab: false,
      };
  const topicLabs = labs.filter(
    (l) => topic.labs.includes(l.id) || l.topicId === topic.id
  );
  const allTopics = getAllTopics();
  const unlockState = loaded
    ? getTopicUnlockState(topic.id, progress.completedTopics)
    : "available";

  useEffect(() => {
    if (loaded) recordTopicVisit(topic.id);
  }, [topic.id, loaded, recordTopicVisit]);

  const embeddedVideos = useMemo(
    () =>
      videos.filter(
        (v) =>
          v.tags.some((t) => topic.tags.includes(t)) ||
          topic.tags.some((t) => v.tags.includes(t))
      ),
    [topic.tags]
  );

  const handleToggleComplete = () => {
    if (completed) {
      toggleTopic(topic.id);
      return;
    }
    if (mastery.mastered) {
      toggleTopic(topic.id);
      return;
    }
    if (
      window.confirm(
        "Mastery not complete (read 80%, quiz 80%, lab steps). Mark complete anyway?"
      )
    ) {
      toggleTopic(topic.id, true);
    }
  };

  if (loaded && unlockState === "locked") {
    return (
      <div className="mx-auto max-w-4xl text-center py-16">
        <Lock className="mx-auto h-12 w-12 text-muted" />
        <h1 className="mt-4 text-2xl font-bold text-foreground">{topic.title}</h1>
        <p className="mt-2 text-muted">Complete prerequisites before starting this topic.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {topic.prerequisites.map((pre) => {
            const preTopic = allTopics.find((t) => t.id === pre);
            if (!preTopic) return null;
            return (
              <Link
                key={pre}
                href={`/sections/${preTopic.sectionSlug}/${preTopic.id}`}
                className="rounded-md bg-accent/10 px-3 py-1 text-sm text-accent hover:underline"
              >
                {preTopic.title}
              </Link>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <>
      <ScrollProgressTracker topicId={topic.id} />
      <div className="mx-auto max-w-6xl lg:grid lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-8">
        <div className="min-w-0">
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
            onClick={handleToggleComplete}
            className={cn(
              "inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors",
              completed
                ? "border-success/50 bg-success/10 text-success"
                : mastery.mastered
                  ? "border-success/30 text-success hover:bg-success/10"
                  : "border-border text-muted hover:border-success/30 hover:text-success"
            )}
          >
            <CheckCircle2 className={cn("h-4 w-4", completed && "fill-success/20")} />
            {completed ? "Completed" : mastery.mastered ? "Mark Mastered" : "Mark Complete"}
          </button>
          <BookmarkButton type="topics" id={topic.id} />
        </div>
      </div>

      {loaded && (
        <div className="mt-6">
          <MasteryRings mastery={mastery} />
        </div>
      )}

      <TopicLearningBundle topic={topic} />

      {topic.prerequisites.length > 0 && (
        <div className="mt-6 rounded-xl border border-border bg-card p-4">
          <h2 className="text-sm font-semibold text-foreground">Prerequisites</h2>
          <div className="mt-2 flex flex-wrap gap-2">
            {topic.prerequisites.map((pre) => {
              const preTopic = allTopics.find(
                (t) => t.id === pre || t.slug === pre
              );
              if (preTopic) {
                return (
                  <Link
                    key={pre}
                    href={`/sections/${preTopic.sectionSlug}/${preTopic.id}`}
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

      <section className="mt-6 rounded-xl border border-accent/20 bg-accent/5 p-5">
        <div className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-accent" />
          <h2 className="text-lg font-semibold text-foreground">Why It Matters</h2>
        </div>
        <p className="mt-2 text-sm text-muted leading-relaxed">{topic.whyItMatters}</p>
      </section>

      <section className="mt-6 rounded-xl border border-border bg-card p-5">
        <div className="flex items-center gap-2">
          <Target className="h-5 w-5 text-accent" />
          <h2 className="text-lg font-semibold text-foreground">Learning Objectives</h2>
        </div>
        <ul className="mt-3 space-y-2">
          {topic.learningObjectives.map((obj, i) => (
            <li key={i} className="flex gap-2 text-sm text-muted">
              <span className="text-accent">✓</span>
              {obj}
            </li>
          ))}
        </ul>
      </section>

      <section id="explanation" className="mt-8 scroll-mt-24">
        <div className="mb-4 flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-accent" />
          <h2 className="text-xl font-semibold text-foreground">Explanation</h2>
        </div>
        <div className="rounded-xl border border-border bg-card p-6">
          <GlossaryMarkdown content={topic.explanation} />
        </div>
      </section>

      {topic.interactiveWidget === "registers" && (
        <section className="mt-8">
          <RegisterPlayground />
        </section>
      )}
      {topic.interactiveWidget === "pattern-matcher" && (
        <section className="mt-8">
          <PatternMatcher />
        </section>
      )}
      {topic.interactiveWidget === "pe-headers" && (
        <section className="mt-8">
          <PEHeaderExplorer />
        </section>
      )}
      {topic.interactiveWidget === "pointer-chain" && (
        <section className="mt-8">
          <PointerChainBuilder />
        </section>
      )}
      {topic.interactiveWidget === "hex-viewer" && (
        <section className="mt-8">
          <HexViewer />
        </section>
      )}
      {topic.interactiveWidget === "stack-frame" && (
        <section className="mt-8">
          <StackFrameVisualizer />
        </section>
      )}
      {topic.interactiveWidget === "calling-convention" && (
        <section className="mt-8">
          <CallingConventionPlayground />
        </section>
      )}
      {topic.interactiveWidget === "import-table" && (
        <section className="mt-8">
          <ImportTableExplorer />
        </section>
      )}
      {topic.interactiveWidget === "pointer-scan-sim" && (
        <section className="mt-8">
          <PointerScanSimulator />
        </section>
      )}

      <section className="mt-8 rounded-xl border border-border bg-card p-5">
        <h2 className="text-lg font-semibold text-foreground">Practice Project</h2>
        <p className="mt-2 text-sm text-muted">{topic.practiceProject}</p>
      </section>

      <section className="mt-8 rounded-xl border border-amber-500/20 bg-amber-500/5 p-5">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-amber-400" />
          <h2 className="text-lg font-semibold text-foreground">Common Mistakes</h2>
        </div>
        <ul className="mt-3 space-y-2">
          {topic.commonMistakes.map((m, i) => (
            <li key={i} className="text-sm text-muted">
              • {m}
            </li>
          ))}
        </ul>
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

      {embeddedVideos.length > 0 && (
        <section className="mt-8">
          <div className="mb-4 flex items-center gap-2">
            <Video className="h-5 w-5 text-accent" />
            <h2 className="text-xl font-semibold text-foreground">
              Recommended Videos
            </h2>
          </div>
          <div className="grid gap-3">
            {embeddedVideos.slice(0, 3).map((v) => (
              <a
                key={v.id}
                href={v.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border border-border bg-card p-4 transition-colors hover:border-accent/30"
              >
                <p className="font-medium text-foreground">{v.title}</p>
                <p className="mt-1 text-sm text-muted">{v.description}</p>
              </a>
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

      <QuizPanel topic={topic} />

      {topic.furtherReading.length > 0 && (
        <section className="mt-8 rounded-xl border border-border bg-card p-5">
          <h2 className="text-lg font-semibold text-foreground">Further Reading</h2>
          <ul className="mt-3 space-y-2">
            {topic.furtherReading.map((item, i) => (
              <li key={i} className="text-sm text-muted">
                • {item}
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mt-8">
        <NotesPanel noteKey={`topic-${topic.id}`} title="Topic Notes" />
      </section>
        </div>
        <RelatedContentSidebar topic={topic} />
      </div>
    </>
  );
}
