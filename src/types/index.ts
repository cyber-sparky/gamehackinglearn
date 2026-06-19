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
}

export interface Topic {
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
  type: "section" | "topic" | "tool" | "resource" | "lab" | "roadmap";
  description: string;
  href: string;
  tags: string[];
}

export interface UserProgress {
  completedTopics: string[];
  completedLabs: string[];
  completedRoadmapNodes: string[];
  topicProgress: Record<string, number>;
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
