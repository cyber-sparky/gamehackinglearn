"use client";

import Link from "next/link";
import {
  FlaskConical,
  Code,
  Video,
  Wrench,
  BookOpen,
  Route,
  Link2,
} from "lucide-react";
import type { Topic } from "@/types";
import { getRelatedContent } from "@/lib/related-content";

const icons = {
  lab: FlaskConical,
  snippet: Code,
  video: Video,
  tool: Wrench,
  topic: BookOpen,
  path: Route,
};

export function RelatedContentSidebar({ topic }: { topic: Topic }) {
  const items = getRelatedContent(topic);
  if (items.length === 0) return null;

  return (
    <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="flex items-center gap-2">
          <Link2 className="h-4 w-4 text-accent" />
          <h2 className="text-sm font-semibold text-foreground">Related</h2>
        </div>
        <ul className="mt-3 space-y-2">
          {items.slice(0, 10).map((item) => {
            const Icon = icons[item.type];
            return (
              <li key={`${item.type}-${item.id}`}>
                <Link
                  href={item.href}
                  className="flex items-start gap-2 rounded-lg p-2 text-sm transition-colors hover:bg-muted-bg"
                >
                  <Icon className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                  <span className="text-foreground line-clamp-2">{item.title}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
      <Link
        href={`/study?topic=${topic.id}`}
        className="block rounded-xl border border-accent/30 bg-accent/5 p-4 text-center text-sm font-medium text-accent transition-colors hover:bg-accent/10"
      >
        Start focused study session →
      </Link>
    </aside>
  );
}
