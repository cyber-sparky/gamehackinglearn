import type { Metadata } from "next";
import { glossary, getAllTopics } from "@/data";
import { GlossaryView } from "@/components/glossary/GlossaryView";

export const metadata: Metadata = {
  title: "Glossary",
  description: "Game hacking and reverse engineering terminology reference.",
};

export default function GlossaryPage() {
  const topicSlugs = Object.fromEntries(
    getAllTopics().map((t) => [t.id, t.sectionSlug])
  );

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="text-3xl font-bold text-foreground">Glossary</h1>
      <p className="mt-2 text-muted">
        {glossary.length} terms — PEB, RVA, IL2CPP, AOB, and more.
      </p>
      <div className="mt-8">
        <GlossaryView terms={glossary} topicSlugs={topicSlugs} />
      </div>
    </div>
  );
}
