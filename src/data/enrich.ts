import type { RawSection, RawTopic, Section, Topic } from "@/types";

const SECTION_CONTEXT: Record<string, string> = {
  foundation: "every game reverse engineering workflow",
  "cpp-re": "understanding C++ game code in memory and disassembly",
  "reverse-engineering": "static and dynamic binary analysis",
  assembly: "reading disassembly and CPU-level game logic",
  debugging: "runtime analysis and breakpoint-driven RE",
  "windows-internals": "Windows OS mechanics used by games and anti-cheat",
  "memory-analysis": "finding and mapping game data in process memory",
  "cheat-engine": "practical memory scanning and pointer chains",
  "game-engines": "Unity, Unreal, and proprietary engine internals",
  graphics: "render pipeline and GPU debugging research",
  "anti-cheat": "defensive security and anti-cheat architecture research",
  networking: "game protocol and packet analysis",
  "game-security": "holistic game security and hardening",
};

const GENERIC_LEARNING_PATH = (title: string) => [
  `Read the overview and identify why ${title} matters for your goals`,
  "Study the explanation and cross-reference official documentation",
  "Complete the hands-on practice project in an isolated lab VM",
  "Pass the topic quiz to verify understanding",
  "Apply the technique to a simple open-source game target",
];

function isGenericLearningPath(path: string[]): boolean {
  return path.some((s) => s.includes("Read the overview and core concepts"));
}

function isGenericExercises(exercises: string[]): boolean {
  return exercises.some((e) => e.includes("in your own words"));
}

export function enrichTopic(topic: RawTopic, section: Pick<Section, "slug" | "title">): Topic {
  const ctx = SECTION_CONTEXT[section.slug] ?? "game security research";
  const prereqNote =
    topic.prerequisites.length > 0
      ? ` Builds on ${topic.prerequisites.length} prerequisite topic(s).`
      : "";

  return {
    ...topic,
    whyItMatters:
      topic.whyItMatters ??
      `${topic.title} is a core skill for ${ctx}. Without it, you will struggle to move from reading tutorials to analyzing real game binaries.${prereqNote} This topic connects directly to hands-on labs and downstream advanced modules.`,
    learningObjectives: topic.learningObjectives ?? [
      `Explain the core concepts of ${topic.title} in plain language`,
      `Identify ${topic.title} patterns in a real game binary or process`,
      `Apply ${topic.title} techniques in an isolated lab environment`,
      `Document findings using proper RE methodology`,
    ],
    commonMistakes: topic.commonMistakes ?? [
      "Skipping prerequisites and jumping to advanced targets too early",
      "Analyzing online multiplayer games instead of isolated lab targets",
      "Trusting tool output without verifying against disassembly or memory",
      "Not documenting addresses, offsets, and reproduction steps",
    ],
    furtherReading: topic.furtherReading ?? [
      "Official documentation for tools mentioned in this topic",
      "Related topics in the prerequisite chain",
      "Research papers and blogs linked in the Resources section below",
    ],
    practiceProject:
      topic.practiceProject ??
      `In an isolated VM, apply ${topic.title} to AssaultCube or a crackmes.one level matching your difficulty. Document each step: target selection, tools used, findings, and what you would verify next.`,
    learningPath: isGenericLearningPath(topic.learningPath)
      ? GENERIC_LEARNING_PATH(topic.title)
      : topic.learningPath,
    exercises: isGenericExercises(topic.exercises)
      ? [
          `Map how ${topic.title} appears in a game you are analyzing`,
          "Complete the linked lab or practice project for this topic",
          "Pass the topic quiz with at least 80% correct",
        ]
      : topic.exercises,
    interactiveWidget:
      topic.interactiveWidget ??
      (topic.id === "registers"
        ? "registers"
        : topic.id === "pattern-scanning" || topic.id === "signatures"
          ? "pattern-matcher"
          : topic.id === "pe-files"
            ? "pe-headers"
            : topic.id === "pointer-chains"
              ? "pointer-chain"
              : topic.id === "reading-memory" || topic.id === "process-memory"
                ? "hex-viewer"
                : topic.id === "stack-frames"
                  ? "stack-frame"
                  : topic.id === "calling-conventions"
                    ? "calling-convention"
                    : topic.id === "import-tables"
                      ? "import-table"
                      : topic.id === "memory-scanning" ||
                          topic.id === "unknown-scans"
                        ? "pointer-scan-sim"
                        : undefined),
  };
}

export function enrichSection(section: RawSection): Section {
  return {
    ...section,
    topics: section.topics.map((t) => enrichTopic(t, section)),
  };
}
