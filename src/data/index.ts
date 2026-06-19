import type { Lab, Resource, Roadmap, Section, Tool } from "@/types";
import { foundationSection } from "./sections/foundation";
import { cppSection } from "./sections/cpp-re";
import { reverseEngineeringSection } from "./sections/reverse-engineering";
import { assemblySection } from "./sections/assembly";
import { debuggingSection } from "./sections/debugging";
import { windowsInternalsSection } from "./sections/windows-internals";
import { memoryAnalysisSection } from "./sections/memory-analysis";
import { cheatEngineSection } from "./sections/cheat-engine";
import { gameEnginesSection } from "./sections/game-engines";
import { graphicsSection } from "./sections/graphics";
import { antiCheatSection } from "./sections/anti-cheat";
import { networkingSection } from "./sections/networking";
import { gameSecuritySection } from "./sections/game-security";
import toolsData from "./tools.json";
import resourcesData from "./resources.json";
import labsData from "./labs.json";
import roadmapsData from "./roadmaps.json";

export const sections: Section[] = [
  foundationSection,
  cppSection,
  reverseEngineeringSection,
  assemblySection,
  debuggingSection,
  windowsInternalsSection,
  memoryAnalysisSection,
  cheatEngineSection,
  gameEnginesSection,
  graphicsSection,
  antiCheatSection,
  networkingSection,
  gameSecuritySection,
].sort((a, b) => a.order - b.order);

export const tools: Tool[] = toolsData as Tool[];
export const resources: Resource[] = resourcesData as Resource[];
export const labs: Lab[] = labsData as Lab[];
export const roadmaps: Roadmap[] = roadmapsData as Roadmap[];

export function getSection(slug: string): Section | undefined {
  return sections.find((s) => s.slug === slug);
}

export function getTopic(sectionSlug: string, topicId: string) {
  const section = getSection(sectionSlug);
  return section?.topics.find((t) => t.id === topicId || t.slug === topicId);
}

export function getAllTopics() {
  return sections.flatMap((s) =>
    s.topics.map((t) => ({ ...t, sectionSlug: s.slug, sectionTitle: s.title }))
  );
}

export function getTool(id: string): Tool | undefined {
  return tools.find((t) => t.id === id);
}

export function getLab(id: string): Lab | undefined {
  return labs.find((l) => l.id === id);
}

export function getRoadmap(slug: string): Roadmap | undefined {
  return roadmaps.find((r) => r.slug === slug);
}

export function getTotalEstimatedHours(): number {
  return getAllTopics().reduce((sum, t) => sum + t.estimatedHours, 0);
}

export function getSectionProgress(
  sectionSlug: string,
  completedTopics: string[]
): number {
  const section = getSection(sectionSlug);
  if (!section || section.topics.length === 0) return 0;
  const done = section.topics.filter((t) =>
    completedTopics.includes(t.id)
  ).length;
  return Math.round((done / section.topics.length) * 100);
}

export const navItems = [
  { href: "/", label: "Home", icon: "Home" },
  ...sections.map((s) => ({
    href: `/sections/${s.slug}`,
    label: s.title,
    icon: s.icon,
  })),
  { href: "/tools", label: "Tools Database", icon: "Wrench" },
  { href: "/resources", label: "Resource Library", icon: "Library" },
  { href: "/labs", label: "Labs", icon: "FlaskConical" },
  { href: "/roadmaps", label: "Roadmaps", icon: "Map" },
  { href: "/bookmarks", label: "Bookmarks", icon: "Bookmark" },
  { href: "/progress", label: "Progress", icon: "BarChart3" },
];
