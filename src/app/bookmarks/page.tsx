"use client";

import Link from "next/link";
import { Bookmark, ExternalLink } from "lucide-react";
import { useBookmarks } from "@/lib/hooks";
import {
  getAllTopics,
  tools,
  resources,
  labs,
} from "@/data";
import { DifficultyBadge } from "@/components/ui/Badge";

export default function BookmarksPage() {
  const { bookmarks, loaded, toggle } = useBookmarks();

  if (!loaded) {
    return (
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold text-foreground">Bookmarks</h1>
        <p className="mt-4 text-muted">Loading...</p>
      </div>
    );
  }

  const bookmarkedTopics = getAllTopics().filter((t) =>
    bookmarks.topics.includes(t.id)
  );
  const bookmarkedTools = tools.filter((t) => bookmarks.tools.includes(t.id));
  const bookmarkedResources = resources.filter((r) =>
    bookmarks.resources.includes(r.id)
  );
  const bookmarkedLabs = labs.filter((l) => bookmarks.labs.includes(l.id));

  const total =
    bookmarkedTopics.length +
    bookmarkedTools.length +
    bookmarkedResources.length +
    bookmarkedLabs.length;

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="text-3xl font-bold text-foreground">Bookmarks</h1>
      <p className="mt-2 text-muted">
        {total} saved item{total !== 1 ? "s" : ""} — stored locally in your
        browser.
      </p>

      {total === 0 && (
        <div className="mt-12 text-center">
          <Bookmark className="mx-auto h-12 w-12 text-muted" />
          <p className="mt-4 text-muted">
            No bookmarks yet. Click the bookmark icon on any topic, tool,
            resource, or lab.
          </p>
        </div>
      )}

      {bookmarkedTopics.length > 0 && (
        <section className="mt-8">
          <h2 className="text-lg font-semibold text-foreground">Topics</h2>
          <div className="mt-4 space-y-2">
            {bookmarkedTopics.map((topic) => (
              <div
                key={topic.id}
                className="flex items-center justify-between rounded-lg border border-border bg-card p-4"
              >
                <div>
                  <Link
                    href={`/sections/${topic.sectionSlug}/${topic.id}`}
                    className="font-medium text-foreground hover:text-accent"
                  >
                    {topic.title}
                  </Link>
                  <p className="text-sm text-muted">{topic.sectionTitle}</p>
                </div>
                <button
                  onClick={() => toggle("topics", topic.id)}
                  className="text-accent"
                >
                  <Bookmark className="h-5 w-5 fill-current" />
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {bookmarkedTools.length > 0 && (
        <section className="mt-8">
          <h2 className="text-lg font-semibold text-foreground">Tools</h2>
          <div className="mt-4 space-y-2">
            {bookmarkedTools.map((tool) => (
              <div
                key={tool.id}
                className="flex items-center justify-between rounded-lg border border-border bg-card p-4"
              >
                <div>
                  <a
                    href={tool.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-medium text-foreground hover:text-accent"
                  >
                    {tool.name} <ExternalLink className="h-3 w-3" />
                  </a>
                  <p className="text-sm text-muted">{tool.category}</p>
                </div>
                <button
                  onClick={() => toggle("tools", tool.id)}
                  className="text-accent"
                >
                  <Bookmark className="h-5 w-5 fill-current" />
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {bookmarkedResources.length > 0 && (
        <section className="mt-8">
          <h2 className="text-lg font-semibold text-foreground">Resources</h2>
          <div className="mt-4 space-y-2">
            {bookmarkedResources.map((resource) => (
              <div
                key={resource.id}
                className="flex items-center justify-between rounded-lg border border-border bg-card p-4"
              >
                <div>
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-medium text-foreground hover:text-accent"
                  >
                    {resource.title} <ExternalLink className="h-3 w-3" />
                  </a>
                  <DifficultyBadge difficulty={resource.difficulty} />
                </div>
                <button
                  onClick={() => toggle("resources", resource.id)}
                  className="text-accent"
                >
                  <Bookmark className="h-5 w-5 fill-current" />
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {bookmarkedLabs.length > 0 && (
        <section className="mt-8">
          <h2 className="text-lg font-semibold text-foreground">Labs</h2>
          <div className="mt-4 space-y-2">
            {bookmarkedLabs.map((lab) => (
              <div
                key={lab.id}
                className="flex items-center justify-between rounded-lg border border-border bg-card p-4"
              >
                <div>
                  <Link
                    href={`/labs#${lab.id}`}
                    className="font-medium text-foreground hover:text-accent"
                  >
                    {lab.title}
                  </Link>
                  <DifficultyBadge difficulty={lab.difficulty} />
                </div>
                <button
                  onClick={() => toggle("labs", lab.id)}
                  className="text-accent"
                >
                  <Bookmark className="h-5 w-5 fill-current" />
                </button>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
