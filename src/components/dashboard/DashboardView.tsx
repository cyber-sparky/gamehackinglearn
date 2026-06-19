"use client";

import Link from "next/link";
import {
  BookOpen,
  Bookmark,
  FlaskConical,
  Map,
  Route,
  StickyNote,
  ArrowRight,
  Zap,
  Flame,
  Brain,
} from "lucide-react";
import { getReviewCards } from "@/lib/review";
import { ProgressExportImport } from "@/components/dashboard/ProgressExportImport";
import { ContinueLearningList } from "@/components/learning/ContinueLearningCard";
import { WeeklyGoalCard } from "@/components/learning/WeeklyGoalCard";
import { LearningJournal } from "@/components/learning/LearningJournal";
import {
  sections,
  getAllTopics,
  labs,
  learningPaths,
  getLearningPathModuleProgress,
} from "@/data";
import { useProgress, useBookmarks, useNotes } from "@/lib/hooks";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { formatHours } from "@/lib/utils";
import { getRecommendedActions } from "@/lib/recommendations";

export function DashboardView() {
  const { progress, loaded, setActiveLearningPath } = useProgress();
  const { bookmarks, loaded: bookmarksLoaded } = useBookmarks();
  const { notes, loaded: notesLoaded } = useNotes();

  if (!loaded) {
    return <p className="text-muted">Loading dashboard...</p>;
  }

  const allTopics = getAllTopics();
  const topicPercent = Math.round(
    (progress.completedTopics.length / allTopics.length) * 100
  );
  const labPercent = Math.round(
    (progress.completedLabs.length / labs.length) * 100
  );
  const notesCount = Object.values(notes).filter((n) => n.trim()).length;
  const bookmarkCount =
    bookmarks.topics.length +
    bookmarks.tools.length +
    bookmarks.resources.length +
    bookmarks.labs.length;

  const activePath = learningPaths.find(
    (p) => p.id === progress.activeLearningPath
  );
  const pathPercent = activePath
    ? getLearningPathModuleProgress(activePath, progress.completedTopics)
    : 0;

  const recentTopics = allTopics
    .filter((t) => !progress.completedTopics.includes(t.id))
    .slice(0, 5);

  const nextActions = getRecommendedActions(progress, 4);
  const reviewCount = getReviewCards(progress, 50).length;
  const totalStudyMins = Object.values(progress.studyMinutes ?? {}).reduce(
    (a, b) => a + b,
    0
  );

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-orange-500/30 bg-orange-500/5 p-4">
          <div className="flex items-center gap-2">
            <Flame className="h-5 w-5 text-orange-400" />
            <span className="text-2xl font-bold text-foreground">
              {progress.studyStreak ?? 0}
            </span>
          </div>
          <p className="text-sm text-muted">Day study streak</p>
        </div>
        <Link
          href="/review"
          className="rounded-xl border border-border bg-card p-4 transition-colors hover:border-accent/30"
        >
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-accent" />
            <span className="text-2xl font-bold text-foreground">
              {reviewCount}
            </span>
          </div>
          <p className="text-sm text-muted">Cards due for review</p>
        </Link>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-2xl font-bold text-foreground">
            {Math.round(totalStudyMins / 60)}h
          </p>
          <p className="text-sm text-muted">Focused study time</p>
        </div>
      </div>

      {nextActions.length > 0 && (
        <section className="rounded-xl border border-accent/30 bg-accent/5 p-6">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-accent" />
            <h2 className="text-lg font-semibold text-foreground">
              What to do next
            </h2>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {nextActions.map((action) => (
              <Link
                key={`${action.type}-${action.href}`}
                href={action.href}
                className="rounded-lg border border-border bg-card p-4 transition-colors hover:border-accent/30"
              >
                <span className="text-xs font-medium uppercase text-accent">
                  {action.reason}
                </span>
                <p className="mt-1 font-medium text-foreground">{action.title}</p>
                <p className="mt-0.5 text-sm text-muted line-clamp-2">
                  {action.description}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-5">
          <p className="text-3xl font-bold text-accent">{topicPercent}%</p>
          <p className="text-sm text-muted">Topics Complete</p>
          <ProgressBar value={topicPercent} className="mt-3" showLabel={false} />
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <p className="text-3xl font-bold text-accent">{labPercent}%</p>
          <p className="text-sm text-muted">Labs Complete</p>
          <ProgressBar value={labPercent} className="mt-3" showLabel={false} />
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <p className="text-3xl font-bold text-accent">{notesCount}</p>
          <p className="text-sm text-muted">Notes Saved</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <p className="text-3xl font-bold text-accent">{bookmarkCount}</p>
          <p className="text-sm text-muted">Bookmarks</p>
        </div>
      </div>

      <section className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Route className="h-5 w-5 text-accent" />
            <h2 className="text-lg font-semibold text-foreground">
              Current Learning Path
            </h2>
          </div>
          <Link href="/learning-paths" className="text-sm text-accent hover:underline">
            View all paths
          </Link>
        </div>
        {activePath ? (
          <div className="mt-4">
            <Link
              href={`/learning-paths/${activePath.slug}`}
              className="font-medium text-foreground hover:text-accent"
            >
              {activePath.title}
            </Link>
            <p className="mt-1 text-sm text-muted">{activePath.description}</p>
            <ProgressBar value={pathPercent} className="mt-3" />
            <p className="mt-1 text-xs text-muted">
              {pathPercent}% complete · {formatHours(activePath.estimatedHours)}
            </p>
          </div>
        ) : (
          <div className="mt-4">
            <p className="text-sm text-muted">No active learning path selected.</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {learningPaths.slice(0, 3).map((path) => (
                <button
                  key={path.id}
                  onClick={() => setActiveLearningPath(path.id)}
                  className="rounded-lg border border-border px-3 py-1.5 text-sm text-foreground transition-colors hover:border-accent/30 hover:text-accent"
                >
                  {path.title}
                </button>
              ))}
            </div>
          </div>
        )}
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-accent" />
            <h2 className="text-lg font-semibold text-foreground">
              Continue Learning
            </h2>
          </div>
          <ul className="mt-4 space-y-2">
            {recentTopics.map((topic) => (
              <li key={topic.id}>
                <Link
                  href={`/sections/${topic.sectionSlug}/${topic.id}`}
                  className="flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors hover:bg-muted-bg"
                >
                  <span className="text-foreground">{topic.title}</span>
                  <ArrowRight className="h-4 w-4 text-muted" />
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-xl border border-border bg-card p-6">
          <h2 className="text-lg font-semibold text-foreground">Quick Links</h2>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {[
              { href: "/labs", label: "Labs", icon: FlaskConical, count: labs.length },
              { href: "/roadmaps", label: "Roadmaps", icon: Map, count: sections.length },
              { href: "/bookmarks", label: "Bookmarks", icon: Bookmark, count: bookmarkCount },
              { href: "/notes", label: "Notes", icon: StickyNote, count: notesCount },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-3 rounded-lg border border-border p-3 transition-colors hover:border-accent/30"
              >
                <link.icon className="h-4 w-4 text-accent" />
                <div>
                  <p className="text-sm font-medium text-foreground">{link.label}</p>
                  <p className="text-xs text-muted">{link.count} items</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>

      <section className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold text-foreground">Section Progress</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {sections.map((section) => {
            const done = section.topics.filter((t) =>
              progress.completedTopics.includes(t.id)
            ).length;
            const pct = Math.round((done / section.topics.length) * 100);
            return (
              <Link
                key={section.slug}
                href={`/sections/${section.slug}`}
                className="rounded-lg border border-border p-3 transition-colors hover:border-accent/30"
              >
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-foreground">{section.title}</span>
                  <span className="text-muted">{pct}%</span>
                </div>
                <ProgressBar value={pct} className="mt-2" showLabel={false} />
              </Link>
            );
          })}
        </div>
      </section>

      {bookmarksLoaded && bookmarkCount > 0 && (
        <section className="rounded-xl border border-border bg-card p-6">
          <h2 className="text-lg font-semibold text-foreground">
            Recent Bookmarks
          </h2>
          <p className="mt-1 text-sm text-muted">
            {bookmarkCount} saved across topics, tools, resources, and labs.
          </p>
          <Link
            href="/bookmarks"
            className="mt-3 inline-flex items-center gap-1 text-sm text-accent hover:underline"
          >
            View all bookmarks <ArrowRight className="h-4 w-4" />
          </Link>
        </section>
      )}

      {notesLoaded && notesCount > 0 && (
        <section className="rounded-xl border border-border bg-card p-6">
          <h2 className="text-lg font-semibold text-foreground">Your Notes</h2>
          <p className="mt-1 text-sm text-muted">
            {notesCount} topic note{notesCount !== 1 ? "s" : ""} saved locally.
          </p>
          <Link
            href="/notes"
            className="mt-3 inline-flex items-center gap-1 text-sm text-accent hover:underline"
          >
            Manage notes <ArrowRight className="h-4 w-4" />
          </Link>
        </section>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <WeeklyGoalCard />
        <section className="rounded-xl border border-border bg-card p-6">
          <h2 className="text-lg font-semibold text-foreground">Resume</h2>
          <div className="mt-4">
            <ContinueLearningList limit={3} />
          </div>
        </section>
      </div>

      <LearningJournal />

      <div id="backup">
        <ProgressExportImport />
      </div>
    </div>
  );
}
