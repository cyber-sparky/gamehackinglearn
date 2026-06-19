"use client";

import { useMemo } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { glossary } from "@/data";

const termMap = new Map(
  glossary.map((g) => [g.term.toLowerCase(), g])
);

function linkifyTerms(text: string): string {
  let result = text;
  const sorted = [...glossary].sort((a, b) => b.term.length - a.term.length);
  for (const g of sorted) {
    const re = new RegExp(`\\b(${escapeRe(g.term)})\\b`, "gi");
    result = result.replace(
      re,
      (match) => `[${match}](/glossary#${g.id})`
    );
  }
  return result;
}

function escapeRe(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function GlossaryMarkdown({ content }: { content: string }) {
  const processed = useMemo(() => linkifyTerms(content), [content]);

  return (
    <div className="prose-custom max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ href, children }) => {
            if (href?.startsWith("/glossary#")) {
              return (
                <Link
                  href={href}
                  className="font-medium text-accent underline decoration-accent/40 underline-offset-2 hover:decoration-accent"
                  title={
                    termMap.get(String(children).toLowerCase())?.definition
                  }
                >
                  {children}
                </Link>
              );
            }
            return (
              <a href={href} className="text-accent hover:underline">
                {children}
              </a>
            );
          },
        }}
      >
        {processed}
      </ReactMarkdown>
    </div>
  );
}
