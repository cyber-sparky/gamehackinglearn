import Fuse from "fuse.js";
import {
  sections,
  tools,
  resources,
  labs,
  roadmaps,
  getAllTopics,
} from "@/data";
import type { SearchResult } from "@/types";

function buildSearchIndex(): SearchResult[] {
  const results: SearchResult[] = [];

  for (const section of sections) {
    results.push({
      id: section.id,
      title: section.title,
      type: "section",
      description: section.description,
      href: `/sections/${section.slug}`,
      tags: [section.slug],
    });

    for (const topic of section.topics) {
      results.push({
        id: topic.id,
        title: topic.title,
        type: "topic",
        description: topic.description,
        href: `/sections/${section.slug}/${topic.id}`,
        tags: topic.tags,
      });
    }
  }

  for (const tool of tools) {
    results.push({
      id: tool.id,
      title: tool.name,
      type: "tool",
      description: tool.description,
      href: `/tools#${tool.id}`,
      tags: tool.tags,
    });
  }

  for (const resource of resources) {
    results.push({
      id: resource.id,
      title: resource.title,
      type: "resource",
      description: resource.description,
      href: `/resources#${resource.id}`,
      tags: resource.tags,
    });
  }

  for (const lab of labs) {
    results.push({
      id: lab.id,
      title: lab.title,
      type: "lab",
      description: lab.description,
      href: `/labs#${lab.id}`,
      tags: lab.tags,
    });
  }

  for (const roadmap of roadmaps) {
    results.push({
      id: roadmap.id,
      title: roadmap.title,
      type: "roadmap",
      description: roadmap.description,
      href: `/roadmaps/${roadmap.slug}`,
      tags: [roadmap.slug],
    });
  }

  return results;
}

const searchIndex = buildSearchIndex();

const fuse = new Fuse(searchIndex, {
  keys: [
    { name: "title", weight: 0.4 },
    { name: "description", weight: 0.3 },
    { name: "tags", weight: 0.3 },
  ],
  threshold: 0.4,
  includeScore: true,
});

export function search(query: string, limit = 20): SearchResult[] {
  if (!query.trim()) return [];
  return fuse.search(query, { limit }).map((r) => r.item);
}

export function getTopicCount(): number {
  return getAllTopics().length;
}
