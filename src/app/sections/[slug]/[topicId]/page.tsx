import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getSection, getTopic, sections } from "@/data";
import { TopicDetail } from "@/components/content/TopicDetail";

export async function generateStaticParams() {
  return sections.flatMap((s) =>
    s.topics.map((t) => ({ slug: s.slug, topicId: t.id }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; topicId: string }>;
}): Promise<Metadata> {
  const { slug, topicId } = await params;
  const topic = getTopic(slug, topicId);
  return {
    title: topic?.title ?? "Topic",
    description: topic?.description,
  };
}

export default async function TopicPage({
  params,
}: {
  params: Promise<{ slug: string; topicId: string }>;
}) {
  const { slug, topicId } = await params;
  const section = getSection(slug);
  const topic = getTopic(slug, topicId);
  if (!section || !topic) notFound();

  return <TopicDetail section={section} topic={topic} />;
}
