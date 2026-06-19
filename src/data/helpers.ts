import type { Resource, RawTopic } from "@/types";

export function res(
  id: string,
  title: string,
  url: string,
  type: Resource["type"],
  description: string,
  difficulty: Resource["difficulty"] = "beginner",
  tags: string[] = []
): Resource {
  return {
    id,
    title,
    url,
    type,
    description,
    difficulty,
    cost: "free",
    tags,
    rating: 4,
  };
}

export function topicTemplate(
  id: string,
  title: string,
  description: string,
  explanation: string,
  opts: {
    difficulty?: Resource["difficulty"];
    prerequisites?: string[];
    hours?: number;
    tags?: string[];
    learningPath?: string[];
    exercises?: string[];
    resources?: Resource[];
    docs?: Resource[];
    videos?: Resource[];
    labs?: string[];
  } = {}
): RawTopic {
  return {
    id,
    title,
    slug: id,
    description,
    explanation,
    learningPath: opts.learningPath ?? [
      `Read the overview and core concepts for ${title}`,
      "Study official documentation and recommended articles",
      "Complete hands-on exercises in a controlled lab environment",
      "Apply knowledge to a simple open-source game target",
      "Document findings and review prerequisites for advanced topics",
    ],
    difficulty: opts.difficulty ?? "beginner",
    prerequisites: opts.prerequisites ?? [],
    estimatedHours: opts.hours ?? 4,
    tags: opts.tags ?? [],
    resources: opts.resources ?? [],
    labs: opts.labs ?? [],
    youtubeVideos: opts.videos ?? [],
    documentation: opts.docs ?? [],
    exercises: opts.exercises ?? [
      `Write a summary explaining ${title} in your own words`,
      "Create a diagram mapping key concepts and relationships",
      "Complete one guided lab exercise related to this topic",
    ],
  };
}
