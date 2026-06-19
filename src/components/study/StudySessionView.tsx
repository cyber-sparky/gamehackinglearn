"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Play, Pause, Square, Clock, ArrowLeft } from "lucide-react";
import { getAllTopics } from "@/data";
import { useProgress } from "@/lib/hooks";
import { MarkdownContent } from "@/components/content/MarkdownContent";
import { cn } from "@/lib/utils";

export function StudySessionView({ topicId }: { topicId: string }) {
  const topic = getAllTopics().find((t) => t.id === topicId);
  const { recordStudyMinutes } = useProgress();
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(true);
  const [pomodoro, setPomodoro] = useState(false);
  const [phase, setPhase] = useState<"work" | "break">("work");

  const tick = useCallback(() => {
    setSeconds((s) => {
      const next = s + 1;
      if (pomodoro) {
        const limit = phase === "work" ? 25 * 60 : 5 * 60;
        if (next >= limit) {
          setPhase((p) => (p === "work" ? "break" : "work"));
          return 0;
        }
      }
      return next;
    });
  }, [pomodoro, phase]);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [running, tick]);

  const endSession = () => {
    const mins = Math.max(1, Math.round(seconds / 60));
    recordStudyMinutes(topicId, mins);
    setRunning(false);
  };

  if (!topic) {
    return (
      <div className="text-center py-16">
        <p className="text-muted">Topic not found.</p>
        <Link href="/study" className="mt-4 text-accent hover:underline">
          Pick a topic
        </Link>
      </div>
    );
  }

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        href={`/sections/${topic.sectionSlug}/${topic.id}`}
        className="inline-flex items-center gap-1 text-sm text-muted hover:text-accent"
      >
        <ArrowLeft className="h-4 w-4" />
        Exit study mode
      </Link>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-accent/30 bg-accent/5 p-4">
        <div>
          <p className="text-xs uppercase text-accent">Focused study</p>
          <h1 className="text-xl font-bold text-foreground">{topic.title}</h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 font-mono text-2xl text-foreground">
            <Clock className="h-5 w-5 text-accent" />
            {formatTime(seconds)}
          </span>
          <button
            type="button"
            onClick={() => setRunning((r) => !r)}
            className="rounded-lg border border-border p-2 hover:bg-muted-bg"
            aria-label={running ? "Pause" : "Resume"}
          >
            {running ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </button>
          <button
            type="button"
            onClick={endSession}
            className="rounded-lg border border-border p-2 hover:bg-muted-bg"
            aria-label="End session"
          >
            <Square className="h-4 w-4" />
          </button>
        </div>
      </div>

      <label className="mt-4 flex items-center gap-2 text-sm text-muted">
        <input
          type="checkbox"
          checked={pomodoro}
          onChange={(e) => {
            setPomodoro(e.target.checked);
            setSeconds(0);
            setPhase("work");
          }}
        />
        Pomodoro (25 min work / 5 min break)
        {pomodoro && (
          <span
            className={cn(
              "rounded-full px-2 py-0.5 text-xs",
              phase === "work" ? "bg-accent/10 text-accent" : "bg-success/10 text-success"
            )}
          >
            {phase === "work" ? "Focus" : "Break"}
          </span>
        )}
      </label>

      <section className="mt-8 rounded-xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold text-foreground">Core explanation</h2>
        <div className="mt-4 prose-sm">
          <MarkdownContent content={topic.explanation} />
        </div>
      </section>

      <section className="mt-6 rounded-xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold text-foreground">Practice project</h2>
        <p className="mt-2 text-sm text-muted">{topic.practiceProject}</p>
        {topic.labs.length > 0 && (
          <Link
            href="/labs"
            className="mt-3 inline-block text-sm text-accent hover:underline"
          >
            Open related labs →
          </Link>
        )}
      </section>
    </div>
  );
}

export function StudyTopicPicker() {
  const allTopics = getAllTopics();
  const [query, setQuery] = useState("");

  const filtered = allTopics.filter(
    (t) =>
      !query ||
      t.title.toLowerCase().includes(query.toLowerCase()) ||
      t.id.includes(query.toLowerCase())
  );

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Study Session</h1>
        <p className="mt-1 text-muted">
          Pick a topic for distraction-free study with a built-in timer.
        </p>
      </div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search topics..."
        className="w-full rounded-lg border border-border bg-card px-4 py-2 text-foreground outline-none focus:border-accent"
      />
      <ul className="space-y-2">
        {filtered.slice(0, 30).map((t) => (
          <li key={t.id}>
            <Link
              href={`/study?topic=${t.id}`}
              className="block rounded-lg border border-border bg-card px-4 py-3 transition-colors hover:border-accent/30"
            >
              <span className="font-medium text-foreground">{t.title}</span>
              <span className="ml-2 text-xs text-muted">{t.sectionTitle}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
