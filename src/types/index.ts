export type Difficulty = "beginner" | "intermediate" | "advanced" | "expert";

export type ResourceType =
  | "documentation"
  | "video"
  | "article"
  | "book"
  | "course"
  | "github"
  | "blog"
  | "paper"
  | "tool";

export interface Resource {
  id: string;
  title: string;
  url: string;
  type: ResourceType;
  description: string;
  difficulty: Difficulty;
  cost: "free" | "paid" | "freemium";
  tags: string[];
  rating?: number;
}

export type SnippetCategory =
  | "WinAPI"
  | "C++"
  | "Memory Reading"
  | "Pattern Scanning"
  | "DLL Analysis"
  | "PE Parsing"
  | "Reverse Engineering Helpers"
  | "Assembly Examples"
  | "Debugging Helpers";

export type VideoTopic =
  | "Assembly"
  | "Ghidra"
  | "x64dbg"
  | "Windows Internals"
  | "Unity"
  | "Unreal"
  | "Graphics"
  | "Networking"
  | "Anti-Cheat Architecture";

export type DownloadCategory =
  | "Research Papers"
  | "Whitepapers"
  | "Cheat Engine Tables"
  | "Open Source Projects"
  | "Example Repositories"
  | "Practice Targets"
  | "Reference Material";

export type ResearchType =
  | "blog"
  | "whitepaper"
  | "conference"
  | "notes";

export interface Lab {
  id: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  section: string;
  topicId?: string;
  steps: string[];
  objectives: string[];
  resources: string[];
  estimatedHours: number;
  tags: string[];
  skillsRequired?: string[];
  setupInstructions?: string[];
  hints?: string[];
  expectedOutcome?: string;
  learningGoals?: string[];
}

export interface Tool {
  id: string;
  name: string;
  category: string;
  difficulty: Difficulty;
  website: string;
  documentation: string;
  tutorials: string[];
  description: string;
  tags: string[];
  downloadLink?: string;
  useCases?: string[];
  alternatives?: string[];
  relatedTools?: string[];
}

export interface CodeSnippet {
  id: string;
  title: string;
  description: string;
  category: SnippetCategory;
  language: string;
  code: string;
  tags: string[];
  difficulty: Difficulty;
}

export interface Video {
  id: string;
  title: string;
  description: string;
  topic: VideoTopic;
  difficulty: Difficulty;
  youtubeUrl: string;
  duration: string;
  tags: string[];
}

export interface LearningPathModule {
  id: string;
  title: string;
  sectionSlug: string;
  topicId: string;
  estimatedHours: number;
}

export interface LearningPath {
  id: string;
  slug: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  estimatedHours: number;
  prerequisites: string[];
  modules: LearningPathModule[];
}

export interface Download {
  id: string;
  title: string;
  description: string;
  category: DownloadCategory;
  url: string;
  fileType?: string;
  size?: string;
  tags: string[];
  difficulty: Difficulty;
}

export interface ResearchItem {
  id: string;
  title: string;
  description: string;
  type: ResearchType;
  url?: string;
  author?: string;
  date?: string;
  tags: string[];
  difficulty: Difficulty;
}

export interface SkillTreeNode {
  id: string;
  label: string;
  description: string;
  difficulty: Difficulty;
  prerequisites: string[];
  sectionSlug?: string;
  topicId?: string;
}

export interface SkillTree {
  nodes: SkillTreeNode[];
}

export interface TopicQuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface TopicQuiz {
  topicId: string;
  questions: TopicQuizQuestion[];
}

export interface RawTopic {
  id: string;
  title: string;
  slug: string;
  description: string;
  explanation: string;
  learningPath: string[];
  difficulty: Difficulty;
  prerequisites: string[];
  estimatedHours: number;
  tags: string[];
  resources: Resource[];
  labs: string[];
  youtubeVideos: Resource[];
  documentation: Resource[];
  exercises: string[];
  whyItMatters?: string;
  learningObjectives?: string[];
  commonMistakes?: string[];
  furtherReading?: string[];
  practiceProject?: string;
  interactiveWidget?: InteractiveWidget;
  learningBundle?: boolean;
}

export type InteractiveWidget =
  | "registers"
  | "pattern-matcher"
  | "pe-headers"
  | "pointer-chain"
  | "hex-viewer"
  | "stack-frame"
  | "calling-convention"
  | "import-table"
  | "pointer-scan-sim";

export interface Topic extends RawTopic {
  whyItMatters: string;
  learningObjectives: string[];
  commonMistakes: string[];
  furtherReading: string[];
  practiceProject: string;
}

export interface RawSection {
  id: string;
  slug: string;
  title: string;
  description: string;
  icon: string;
  order: number;
  topics: RawTopic[];
}

export interface Section {
  id: string;
  slug: string;
  title: string;
  description: string;
  icon: string;
  order: number;
  topics: Topic[];
}

export interface RoadmapNode {
  id: string;
  label: string;
  description: string;
  difficulty: Difficulty;
  sectionSlug?: string;
  topicId?: string;
  estimatedHours: number;
}

export interface RoadmapEdge {
  from: string;
  to: string;
}

export interface Roadmap {
  id: string;
  slug: string;
  title: string;
  description: string;
  nodes: RoadmapNode[];
  edges: RoadmapEdge[];
}

export interface SearchResult {
  id: string;
  title: string;
  type:
    | "section"
    | "topic"
    | "tool"
    | "resource"
    | "lab"
    | "roadmap"
    | "snippet"
    | "video"
    | "download"
    | "research"
    | "path"
    | "note";
  description: string;
  href: string;
  tags: string[];
}

export interface UserProgress {
  completedTopics: string[];
  completedLabs: string[];
  completedRoadmapNodes: string[];
  completedSkillNodes: string[];
  topicProgress: Record<string, number>;
  activeLearningPath?: string;
  completedPathModules: Record<string, string[]>;
  quizScores: Record<string, number>;
  topicLastVisited: Record<string, number>;
  labStepProgress: Record<string, boolean[]>;
  studyMinutes: Record<string, number>;
  lastStudyDate?: string;
  studyStreak: number;
  forceCompletedTopics: string[];
  reviewSchedule: Record<string, number>;
  completedChallenges: string[];
  topicCompletedAt: Record<string, number>;
  labCompletedAt: Record<string, number>;
  labOutcomeConfirmed: Record<string, boolean>;
  weeklyGoal: { weekKey: string; topicsTarget: number; labsTarget: number };
  weeklyCompletions: { topics: string[]; labs: string[] };
  learningJournal: Record<string, string>;
  backupReminderMonth?: string;
  platformTipsSeen?: boolean;
}

export interface GlossaryTerm {
  id: string;
  term: string;
  definition: string;
  relatedTopicIds: string[];
  tags: string[];
}

export interface ComparisonRow {
  feature: string;
  values: string[];
}

export interface ComparisonSheet {
  id: string;
  title: string;
  description: string;
  columns: string[];
  rows: ComparisonRow[];
  relatedTopicIds: string[];
}

export interface CrackmeChallenge {
  id: string;
  title: string;
  url: string;
  difficulty: Difficulty;
  topicIds: string[];
  description: string;
  platform: string;
}

export interface TopicMasteryState {
  read: boolean;
  quiz: boolean;
  lab: boolean;
  mastered: boolean;
  readPercent: number;
  quizPercent: number | null;
  labPercent: number;
  hasLab: boolean;
}

export interface ReviewCard {
  id: string;
  topicId: string;
  topicTitle: string;
  sectionSlug: string;
  question: string;
  answer: string;
  explanation: string;
  dueReason: string;
}

export interface ExportedUserData {
  version: 1;
  exportedAt: string;
  progress: UserProgress;
  bookmarks: UserBookmarks;
  notes: UserNotes;
  ratings: UserRatings;
  onboarding: UserOnboarding;
}

export interface UserOnboarding {
  completed: boolean;
  experienceLevel: "none" | "beginner" | "intermediate" | "advanced";
  interests: string[];
  recommendedPathSlug?: string;
}

export interface NavItem {
  href: string;
  label: string;
  icon: string;
}

export interface NavGroup {
  id: string;
  label: string;
  items: NavItem[];
  collapsible?: boolean;
}

export interface ProgressionNode {
  id: string;
  topicId: string;
  sectionSlug: string;
  sectionTitle: string;
  title: string;
  difficulty: Difficulty;
  prerequisites: string[];
  estimatedHours: number;
  labIds: string[];
}

export interface RecommendedAction {
  type: "topic" | "lab" | "quiz" | "path" | "review";
  title: string;
  description: string;
  href: string;
  reason: string;
  priority: number;
}

export interface UserBookmarks {
  resources: string[];
  topics: string[];
  tools: string[];
  labs: string[];
}

export interface UserNotes {
  [key: string]: string;
}

export interface UserRatings {
  [resourceId: string]: number;
}
