import type { Metadata } from "next";
import { comparisons, getAllTopics } from "@/data";
import { ComparisonTables } from "@/components/reference/ComparisonTables";

export const metadata: Metadata = {
  title: "Cheat Sheets",
  description: "Quick comparison tables for debuggers, Unity backends, and CE scans.",
};

export default function CheatSheetsPage() {
  const topicSlugs = Object.fromEntries(
    getAllTopics().map((t) => [t.id, t.sectionSlug])
  );

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="text-3xl font-bold text-foreground">Cheat Sheets</h1>
      <p className="mt-2 text-muted">
        Side-by-side comparisons to pick the right tool or technique.
      </p>
      <div className="mt-8">
        <ComparisonTables sheets={comparisons} topicSlugs={topicSlugs} />
      </div>
    </div>
  );
}
