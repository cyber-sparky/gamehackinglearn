import type {
  CodeSnippet,
  ComparisonSheet,
  CrackmeChallenge,
  GlossaryTerm,
  Download,
  Lab,
  LearningPath,
  NavGroup,
  RawSection,
  Resource,
  ResearchItem,
  Roadmap,
  Section,
  SkillTree,
  Tool,
  Video,
} from "@/types";
import { enrichSection } from "./enrich";
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
import labsExtraData from "./labs-extra.json";
import roadmapsData from "./roadmaps.json";
import snippetsData from "./snippets.json";
import videosData from "./videos.json";
import learningPathsData from "./learning-paths.json";
import downloadsData from "./downloads.json";
import researchData from "./research.json";
import skillTreeData from "./skill-tree.json";
import glossaryData from "./glossary.json";
import comparisonsData from "./comparisons.json";
import challengesData from "./challenges.json";

const rawSections: RawSection[] = [
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

export const sections: Section[] = rawSections.map(enrichSection);

export const tools: Tool[] = toolsData as Tool[];
export const resources: Resource[] = resourcesData as Resource[];
export const labs: Lab[] = [...(labsData as Lab[]), ...(labsExtraData as Lab[])];
export const roadmaps: Roadmap[] = roadmapsData as Roadmap[];
export const snippets: CodeSnippet[] = snippetsData as CodeSnippet[];
export const videos: Video[] = videosData as Video[];
export const learningPaths: LearningPath[] =
  learningPathsData as LearningPath[];
export const downloads: Download[] = downloadsData as Download[];
export const research: ResearchItem[] = researchData as ResearchItem[];
export const skillTree: SkillTree = skillTreeData as SkillTree;
export const glossary: GlossaryTerm[] = glossaryData as GlossaryTerm[];
export const comparisons: ComparisonSheet[] =
  comparisonsData as ComparisonSheet[];
export const challenges: CrackmeChallenge[] =
  challengesData as CrackmeChallenge[];

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

export function getLearningPath(slug: string): LearningPath | undefined {
  return learningPaths.find((p) => p.slug === slug);
}

export function getSnippet(id: string): CodeSnippet | undefined {
  return snippets.find((s) => s.id === id);
}

export function getVideo(id: string): Video | undefined {
  return videos.find((v) => v.id === id);
}

export function getDownload(id: string): Download | undefined {
  return downloads.find((d) => d.id === id);
}

export function getResearchItem(id: string): ResearchItem | undefined {
  return research.find((r) => r.id === id);
}

export function getLearningPathModuleProgress(
  path: LearningPath,
  completedTopicIds: string[]
): number {
  if (path.modules.length === 0) return 0;
  const done = path.modules.filter((m) =>
    completedTopicIds.includes(m.topicId)
  ).length;
  return Math.round((done / path.modules.length) * 100);
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

export const navGroups: NavGroup[] = [
  {
    id: "learn",
    label: "Learn",
    items: [
      { href: "/", label: "Home", icon: "Home" },
      { href: "/dashboard", label: "Dashboard", icon: "LayoutDashboard" },
      { href: "/learning-paths", label: "Learning Paths", icon: "Route" },
      { href: "/skill-tree", label: "Skill Tree", icon: "GitBranch" },
      { href: "/roadmaps", label: "Roadmaps", icon: "Map" },
    ],
  },
  {
    id: "sections",
    label: "Sections",
    collapsible: true,
    items: sections.map((s) => ({
      href: `/sections/${s.slug}`,
      label: s.title,
      icon: s.icon,
    })),
  },
  {
    id: "practice",
    label: "Practice",
    items: [
      { href: "/labs", label: "Labs", icon: "FlaskConical" },
      { href: "/study", label: "Study Session", icon: "GraduationCap" },
      { href: "/review", label: "Review Queue", icon: "Brain" },
      { href: "/challenges", label: "Practice Targets", icon: "Target" },
      { href: "/snippets", label: "Code Snippets", icon: "Code" },
      { href: "/downloads", label: "Download Center", icon: "Download" },
    ],
  },
  {
    id: "reference",
    label: "Reference",
    items: [
      { href: "/glossary", label: "Glossary", icon: "BookMarked" },
      { href: "/cheat-sheets", label: "Cheat Sheets", icon: "Table" },
      { href: "/tools", label: "Tools Database", icon: "Wrench" },
      { href: "/resources", label: "Resource Library", icon: "Library" },
      { href: "/videos", label: "Video Library", icon: "Video" },
      { href: "/research", label: "Research Archive", icon: "FileSearch" },
    ],
  },
  {
    id: "you",
    label: "You",
    items: [
      { href: "/notes", label: "My Notes", icon: "StickyNote" },
      { href: "/bookmarks", label: "Bookmarks", icon: "Bookmark" },
      { href: "/progress", label: "Progress", icon: "BarChart3" },
    ],
  },
];

/** Flat list for backward compatibility */
export const navItems = navGroups.flatMap((g) => g.items);
