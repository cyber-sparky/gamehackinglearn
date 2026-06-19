import type { MetadataRoute } from "next";
import {
  sections,
  learningPaths,
  roadmaps,
} from "@/data";
import { getSiteUrl } from "@/lib/site";

const BASE = getSiteUrl();

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    "",
    "/dashboard",
    "/learning-paths",
    "/skill-tree",
    "/tools",
    "/resources",
    "/snippets",
    "/videos",
    "/labs",
    "/downloads",
    "/research",
    "/roadmaps",
    "/notes",
    "/bookmarks",
    "/review",
    "/study",
    "/glossary",
    "/cheat-sheets",
    "/challenges",
    "/disclaimer",
    "/progress",
  ].map((path) => ({
    url: `${BASE}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.8,
  }));

  const sectionPages = sections.flatMap((s) => [
    {
      url: `${BASE}/sections/${s.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    },
    ...s.topics.map((t) => ({
      url: `${BASE}/sections/${s.slug}/${t.id}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ]);

  const pathPages = learningPaths.map((p) => ({
    url: `${BASE}/learning-paths/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const roadmapPages = roadmaps.map((r) => ({
    url: `${BASE}/roadmaps/${r.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...sectionPages, ...pathPages, ...roadmapPages];
}
