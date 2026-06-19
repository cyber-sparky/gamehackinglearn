import {
  getAllTopics,
  labs,
  snippets,
  videos,
  tools,
  learningPaths,
} from "@/data";
import type { Topic } from "@/types";

export interface RelatedItem {
  type: "lab" | "snippet" | "video" | "tool" | "topic" | "path";
  id: string;
  title: string;
  href: string;
  description?: string;
}

const VIDEO_TOPIC_MAP: Record<string, string[]> = {
  Ghidra: ["static-analysis", "ghidra", "strings-analysis"],
  x64dbg: ["x64dbg", "dynamic-analysis", "sw-breakpoints"],
  Assembly: ["registers", "stack-frames", "calling-conventions"],
  "Windows Internals": ["processes", "peb", "syscalls"],
  Unity: ["unity-mono", "unity-il2cpp"],
  Unreal: ["unreal-uobject", "unreal-sdk"],
  Graphics: ["directx11", "renderdoc"],
  Networking: ["packet-analysis", "protocol-basics"],
  "Anti-Cheat Architecture": ["usermode-ac", "kernelmode-ac"],
};

export function getRelatedContent(topic: Topic): RelatedItem[] {
  const items: RelatedItem[] = [];
  const tagSet = new Set(topic.tags.map((t) => t.toLowerCase()));
  const topicId = topic.id;

  for (const lab of labs) {
    if (lab.topicId === topicId || topic.labs.includes(lab.id)) {
      items.push({
        type: "lab",
        id: lab.id,
        title: lab.title,
        href: `/labs#${lab.id}`,
        description: lab.description,
      });
    }
  }

  for (const snippet of snippets) {
    if (
      snippet.tags.some((t) => tagSet.has(t.toLowerCase())) ||
      snippet.title.toLowerCase().includes(topicId.replace(/-/g, " "))
    ) {
      items.push({
        type: "snippet",
        id: snippet.id,
        title: snippet.title,
        href: `/snippets#${snippet.id}`,
      });
    }
  }

  for (const video of videos) {
    const mapped = VIDEO_TOPIC_MAP[video.topic] ?? [];
    if (
      mapped.includes(topicId) ||
      video.tags.some((t) => tagSet.has(t.toLowerCase()))
    ) {
      items.push({
        type: "video",
        id: video.id,
        title: video.title,
        href: `/videos#${video.id}`,
      });
    }
  }

  for (const tool of tools) {
    if (tool.tags.some((t) => tagSet.has(t.toLowerCase()))) {
      items.push({
        type: "tool",
        id: tool.id,
        title: tool.name,
        href: `/tools#${tool.id}`,
      });
    }
  }

  const allTopics = getAllTopics();
  for (const t of allTopics) {
    if (t.prerequisites.includes(topicId)) {
      items.push({
        type: "topic",
        id: t.id,
        title: `Unlocks: ${t.title}`,
        href: `/sections/${t.sectionSlug}/${t.id}`,
      });
    }
  }

  for (const path of learningPaths) {
    if (path.modules.some((m) => m.topicId === topicId)) {
      items.push({
        type: "path",
        id: path.id,
        title: path.title,
        href: `/learning-paths/${path.slug}`,
        description: "Part of this learning path",
      });
      break;
    }
  }

  const seen = new Set<string>();
  return items.filter((item) => {
    const key = `${item.type}-${item.id}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
