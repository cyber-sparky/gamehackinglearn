"use client";

import { useState } from "react";
import type { GlossaryTerm } from "@/types";
import Link from "next/link";
import { Search } from "lucide-react";

export function GlossaryView({
  terms,
  topicSlugs,
}: {
  terms: GlossaryTerm[];
  topicSlugs: Record<string, string>;
}) {
  const [query, setQuery] = useState("");
  const lower = query.toLowerCase();

  const filtered = terms.filter(
    (t) =>
      !lower ||
      t.term.toLowerCase().includes(lower) ||
      t.definition.toLowerCase().includes(lower) ||
      t.tags.some((tag) => tag.toLowerCase().includes(lower))
  );

  const byLetter = filtered.reduce<Record<string, GlossaryTerm[]>>((acc, t) => {
    const letter = t.term[0]?.toUpperCase() ?? "#";
    if (!acc[letter]) acc[letter] = [];
    acc[letter].push(t);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search terms (PEB, RVA, IL2CPP...)"
          className="w-full rounded-lg border border-border bg-card py-2.5 pl-10 pr-4 text-foreground outline-none focus:border-accent"
        />
      </div>
      {Object.keys(byLetter)
        .sort()
        .map((letter) => (
          <section key={letter}>
            <h2 className="text-lg font-bold text-accent">{letter}</h2>
            <div className="mt-3 space-y-3">
              {byLetter[letter].map((term) => (
                <article
                  key={term.id}
                  id={term.id}
                  className="rounded-xl border border-border bg-card p-4 scroll-mt-24"
                >
                  <h3 className="text-lg font-semibold text-foreground">
                    {term.term}
                  </h3>
                  <p className="mt-2 text-sm text-muted leading-relaxed">
                    {term.definition}
                  </p>
                  {term.relatedTopicIds.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {term.relatedTopicIds.map((tid) => (
                        <Link
                          key={tid}
                          href={`/sections/${topicSlugs[tid] ?? "foundation"}/${tid}`}
                          className="text-xs text-accent hover:underline"
                        >
                          {tid}
                        </Link>
                      ))}
                    </div>
                  )}
                </article>
              ))}
            </div>
          </section>
        ))}
    </div>
  );
}
