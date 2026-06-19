import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getSection, sections } from "@/data";
import { SectionPageClient } from "./SectionPageClient";

export async function generateStaticParams() {
  return sections.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const section = getSection(slug);
  return {
    title: section?.title ?? "Section",
    description: section?.description,
  };
}

export default async function SectionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const section = getSection(slug);
  if (!section) notFound();

  return <SectionPageClient section={section} />;
}
