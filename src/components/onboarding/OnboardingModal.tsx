"use client";

import { useState } from "react";
import { learningPaths } from "@/data";
import { useOnboarding, useProgress } from "@/lib/hooks";
import { cn } from "@/lib/utils";

const INTERESTS = [
  "Reverse Engineering",
  "Memory Analysis",
  "Game Engines",
  "Anti-Cheat Research",
  "Windows Internals",
  "Networking",
];

export function OnboardingModal() {
  const { onboarding, loaded, complete } = useOnboarding();
  const { setActiveLearningPath } = useProgress();
  const [step, setStep] = useState(0);
  const [level, setLevel] = useState<
    "none" | "beginner" | "intermediate" | "advanced"
  >("none");
  const [interests, setInterests] = useState<string[]>([]);

  if (!loaded || onboarding.completed) return null;

  const recommendPath = () => {
    if (interests.includes("Anti-Cheat Research"))
      return "windows-internals-engineer";
    if (interests.includes("Game Engines")) return "unity-researcher";
    if (interests.includes("Memory Analysis"))
      return "memory-analysis-specialist";
    if (level === "none" || level === "beginner")
      return "beginner-reverse-engineer";
    if (level === "intermediate") return "memory-analysis-specialist";
    return "windows-internals-engineer";
  };

  const finish = () => {
    const slug = recommendPath();
    const path = learningPaths.find((p) => p.slug === slug);
    if (path) setActiveLearningPath(path.id);
    complete({
      experienceLevel: level,
      interests,
      recommendedPathSlug: slug,
    });
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div className="relative z-10 w-full max-w-lg rounded-xl border border-border bg-card p-6 shadow-2xl">
        <h2 className="text-xl font-bold text-foreground">
          Welcome to Game Hacking Roadmap
        </h2>
        <p className="mt-2 text-sm text-muted">
          Answer a few questions to personalize your learning path.
        </p>

        {step === 0 && (
          <div className="mt-6">
            <p className="text-sm font-medium text-foreground">
              What is your experience level?
            </p>
            <div className="mt-3 grid gap-2">
              {(
                [
                  ["none", "Complete beginner"],
                  ["beginner", "Some programming"],
                  ["intermediate", "Done basic RE/debugging"],
                  ["advanced", "Comfortable with asm & tools"],
                ] as const
              ).map(([id, label]) => (
                <button
                  key={id}
                  onClick={() => setLevel(id)}
                  className={cn(
                    "rounded-lg border px-4 py-3 text-left text-sm transition-colors",
                    level === id
                      ? "border-accent bg-accent/10 text-foreground"
                      : "border-border text-muted hover:border-accent/30"
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="mt-6">
            <p className="text-sm font-medium text-foreground">
              What interests you most? (select all that apply)
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {INTERESTS.map((interest) => (
                <button
                  key={interest}
                  onClick={() =>
                    setInterests((prev) =>
                      prev.includes(interest)
                        ? prev.filter((i) => i !== interest)
                        : [...prev, interest]
                    )
                  }
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                    interests.includes(interest)
                      ? "border-accent bg-accent/10 text-accent"
                      : "border-border text-muted hover:bg-muted-bg"
                  )}
                >
                  {interest}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="mt-6 rounded-lg border border-accent/30 bg-accent/5 p-4">
            <p className="text-sm font-medium text-foreground">
              Recommended path
            </p>
            <p className="mt-1 text-lg font-semibold text-accent">
              {learningPaths.find((p) => p.slug === recommendPath())?.title}
            </p>
            <p className="mt-2 text-sm text-muted">
              You can change this anytime from the Dashboard or Learning Paths
              page.
            </p>
          </div>
        )}

        <div className="mt-6 flex justify-between">
          {step > 0 ? (
            <button
              onClick={() => setStep((s) => s - 1)}
              className="text-sm text-muted hover:text-foreground"
            >
              Back
            </button>
          ) : (
            <button
              onClick={() =>
                complete({
                  experienceLevel: "none",
                  interests: [],
                })
              }
              className="text-sm text-muted hover:text-foreground"
            >
              Skip
            </button>
          )}
          {step < 2 ? (
            <button
              onClick={() => setStep((s) => s + 1)}
              className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-hover"
            >
              Continue
            </button>
          ) : (
            <button
              onClick={finish}
              className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-hover"
            >
              Start learning
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
