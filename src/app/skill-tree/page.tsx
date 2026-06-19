import type { Metadata } from "next";
import { SkillTreeView } from "@/components/skill-tree/SkillTreeView";

export const metadata: Metadata = {
  title: "Skill Tree",
  description: "Interactive skill tree with locked, available, and completed states.",
};

export default function SkillTreePage() {
  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="text-3xl font-bold text-foreground">Interactive Skill Tree</h1>
      <p className="mt-2 max-w-3xl text-lg text-muted">
        Visual progression from Assembly through Reverse Engineering, Debugging,
        Windows Internals, and Engine Internals. Progress is saved locally.
      </p>
      <div className="mt-8">
        <SkillTreeView />
      </div>
    </div>
  );
}
