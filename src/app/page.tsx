import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  FlaskConical,
  Map,
  Shield,
  Wrench,
  Layers,
  Clock,
} from "lucide-react";
import {
  sections,
  getAllTopics,
  getTotalEstimatedHours,
  labs,
  tools,
  resources,
  roadmaps,
} from "@/data";
import { getTopicCount } from "@/lib/search";
import { HomeProgress } from "@/components/content/HomeProgress";

export default function HomePage() {
  const topicCount = getTopicCount();
  const totalHours = getTotalEstimatedHours();

  return (
    <div className="mx-auto max-w-6xl">
      <section className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-accent/10 via-card to-card p-8 md:p-12">
        <div className="relative z-10">
          <p className="text-sm font-medium uppercase tracking-widest text-accent">
            Free · Educational · Comprehensive
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            Game Hacking Roadmap
          </h1>
          <p className="mt-2 text-2xl font-light text-muted">0 → Hero</p>
          <p className="mt-6 max-w-2xl text-lg text-muted">
            The most comprehensive free learning resource for game reverse
            engineering, memory analysis, anti-cheat research, malware analysis
            skills, and game engine internals. Structured like roadmap.sh meets
            HackTricks.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/sections/foundation"
              className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
            >
              Start Learning <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/roadmaps"
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted-bg"
            >
              <Map className="h-4 w-4" /> View Roadmaps
            </Link>
          </div>
        </div>
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-accent/5 blur-3xl" />
      </section>

      <section className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        {[
          { label: "Topics", value: topicCount, icon: BookOpen },
          { label: "Sections", value: sections.length, icon: Layers },
          { label: "Labs", value: labs.length, icon: FlaskConical },
          { label: "Est. Hours", value: `${totalHours}+`, icon: Clock },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-border bg-card p-5 text-center"
          >
            <stat.icon className="mx-auto h-5 w-5 text-accent" />
            <p className="mt-2 text-2xl font-bold text-foreground">
              {stat.value}
            </p>
            <p className="text-sm text-muted">{stat.label}</p>
          </div>
        ))}
      </section>

      <HomeProgress />

      <section className="mt-12">
        <h2 className="text-2xl font-bold text-foreground">Learning Sections</h2>
        <p className="mt-2 text-muted">
          13 comprehensive sections covering everything from CPU basics to
          anti-cheat research.
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {sections.map((section) => (
            <Link
              key={section.slug}
              href={`/sections/${section.slug}`}
              className="group rounded-xl border border-border bg-card p-5 transition-all hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5"
            >
              <h3 className="font-semibold text-foreground group-hover:text-accent transition-colors">
                {section.title}
              </h3>
              <p className="mt-1 text-sm text-muted line-clamp-2">
                {section.description}
              </p>
              <p className="mt-3 text-xs text-muted">
                {section.topics.length} topics
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-12 grid gap-6 md:grid-cols-2">
        <Link
          href="/tools"
          className="group flex items-center gap-4 rounded-xl border border-border bg-card p-6 transition-all hover:border-accent/30"
        >
          <div className="rounded-lg bg-accent/10 p-3">
            <Wrench className="h-6 w-6 text-accent" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground group-hover:text-accent">
              Tools Database
            </h3>
            <p className="text-sm text-muted">
              {tools.length} tools with docs, tutorials, and difficulty ratings
            </p>
          </div>
        </Link>
        <Link
          href="/resources"
          className="group flex items-center gap-4 rounded-xl border border-border bg-card p-6 transition-all hover:border-accent/30"
        >
          <div className="rounded-lg bg-accent/10 p-3">
            <BookOpen className="h-6 w-6 text-accent" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground group-hover:text-accent">
              Resource Library
            </h3>
            <p className="text-sm text-muted">
              {resources.length} curated books, courses, papers, and channels
            </p>
          </div>
        </Link>
        <Link
          href="/labs"
          className="group flex items-center gap-4 rounded-xl border border-border bg-card p-6 transition-all hover:border-accent/30"
        >
          <div className="rounded-lg bg-accent/10 p-3">
            <FlaskConical className="h-6 w-6 text-accent" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground group-hover:text-accent">
              Guided Labs
            </h3>
            <p className="text-sm text-muted">
              Hands-on exercises from beginner to advanced
            </p>
          </div>
        </Link>
        <Link
          href="/roadmaps"
          className="group flex items-center gap-4 rounded-xl border border-border bg-card p-6 transition-all hover:border-accent/30"
        >
          <div className="rounded-lg bg-accent/10 p-3">
            <Map className="h-6 w-6 text-accent" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground group-hover:text-accent">
              Visual Roadmaps
            </h3>
            <p className="text-sm text-muted">
              {roadmaps.length} interactive dependency graphs
            </p>
          </div>
        </Link>
      </section>

      <section className="mt-12 rounded-xl border border-amber-500/20 bg-amber-500/5 p-6">
        <div className="flex items-start gap-3">
          <Shield className="h-5 w-5 shrink-0 text-amber-400" />
          <div>
            <h3 className="font-semibold text-foreground">
              Educational & Ethical Use Only
            </h3>
            <p className="mt-1 text-sm text-muted">
              This portal is designed for educational purposes: reverse
              engineering, anti-cheat research, malware analysis skills, and
              software security research. Always use isolated lab environments.
              We do not provide instructions for bypassing anti-cheat
              protections or cheating in online games.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
