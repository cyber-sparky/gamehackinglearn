import type { Metadata } from "next";
import { challenges } from "@/data";
import { ChallengesList } from "@/components/challenges/ChallengesList";

export const metadata: Metadata = {
  title: "Practice Targets",
  description: "External crackmes and lab targets for hands-on RE practice.",
};

export default function ChallengesPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="text-3xl font-bold text-foreground">Practice Targets</h1>
      <p className="mt-2 text-muted">
        Curated external targets for VM-only practice. Mark complete when done.
      </p>
      <div className="mt-8">
        <ChallengesList items={challenges} />
      </div>
    </div>
  );
}
