"use client";

import Link from "next/link";
import type { ComparisonSheet } from "@/types";

export function ComparisonTables({
  sheets,
  topicSlugs,
}: {
  sheets: ComparisonSheet[];
  topicSlugs: Record<string, string>;
}) {
  return (
    <div className="space-y-10">
      {sheets.map((sheet) => (
        <section
          key={sheet.id}
          id={sheet.id}
          className="scroll-mt-24 rounded-xl border border-border bg-card p-6"
        >
          <h2 className="text-xl font-semibold text-foreground">{sheet.title}</h2>
          <p className="mt-1 text-sm text-muted">{sheet.description}</p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border">
                  {sheet.columns.map((col) => (
                    <th key={col} className="px-3 py-2 font-semibold text-foreground">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sheet.rows.map((row) => (
                  <tr key={row.feature} className="border-b border-border/50">
                    <td className="px-3 py-2 font-medium text-foreground">
                      {row.feature}
                    </td>
                    {row.values.map((val, i) => (
                      <td key={i} className="px-3 py-2 text-muted">
                        {val}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {sheet.relatedTopicIds.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {sheet.relatedTopicIds.map((tid) => (
                <Link
                  key={tid}
                  href={`/sections/${topicSlugs[tid] ?? "foundation"}/${tid}`}
                  className="text-xs text-accent hover:underline"
                >
                  {tid} →
                </Link>
              ))}
            </div>
          )}
        </section>
      ))}
    </div>
  );
}
