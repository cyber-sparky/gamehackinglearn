"use client";

import { Copy } from "lucide-react";
import { useState } from "react";
import type { CodeSnippet } from "@/types";
import { DifficultyBadge, TagBadge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import { highlightCode } from "@/lib/highlight";

function AnnotatedCode({ code, language }: { code: string; language: string }) {
  const [showNotes, setShowNotes] = useState(false);
  const lines = code.split("\n");

  return (
    <div>
      <label className="mb-2 flex items-center gap-2 text-xs text-muted">
        <input
          type="checkbox"
          checked={showNotes}
          onChange={(e) => setShowNotes(e.target.checked)}
        />
        Highlight comment annotations
      </label>
      {showNotes ? (
        <pre className="overflow-x-auto bg-muted-bg/40 p-4 text-xs leading-relaxed">
          {lines.map((line, i) => (
            <div
              key={i}
              className={cn(
                "flex gap-3",
                line.trim().startsWith("//") && "bg-accent/5 text-accent"
              )}
            >
              <span className="w-6 shrink-0 text-right text-muted">{i + 1}</span>
              <code className="font-mono">{line || " "}</code>
            </div>
          ))}
        </pre>
      ) : (
        <pre className="overflow-x-auto bg-muted-bg/40 p-4 text-xs leading-relaxed">
          <code
            className="font-mono text-foreground"
            dangerouslySetInnerHTML={{
              __html: highlightCode(code, language),
            }}
          />
        </pre>
      )}
    </div>
  );
}

export function SnippetCard({ snippet }: { snippet: CodeSnippet }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(snippet.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <div
      id={snippet.id}
      className="rounded-xl border border-border bg-card scroll-mt-24"
    >
      <div className="border-b border-border p-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-md bg-accent/10 px-2 py-0.5 text-xs font-medium text-accent">
            {snippet.category}
          </span>
          <span className="rounded-md bg-muted-bg px-2 py-0.5 text-xs font-medium text-muted">
            {snippet.language}
          </span>
          <DifficultyBadge difficulty={snippet.difficulty} />
        </div>
        <h3 className="mt-2 text-lg font-semibold text-foreground">
          {snippet.title}
        </h3>
        <p className="mt-1 text-sm text-muted">{snippet.description}</p>
      </div>
      <div className="relative">
        <AnnotatedCode code={snippet.code} language={snippet.language} />
        <button
          onClick={handleCopy}
          className={cn(
            "absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-2.5 py-1.5 text-xs font-medium transition-colors",
            copied
              ? "text-success"
              : "text-muted hover:bg-muted-bg hover:text-foreground"
          )}
          aria-label="Copy code"
        >
          <Copy className="h-3.5 w-3.5" />
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <div className="flex flex-wrap gap-1.5 border-t border-border p-4">
        {snippet.tags.map((tag) => (
          <TagBadge key={tag} tag={tag} />
        ))}
      </div>
    </div>
  );
}
