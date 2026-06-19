import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";
import { sections } from "../src/data/index";

const outDir = join(__dirname, "../src/data/sections-json");
mkdirSync(outDir, { recursive: true });

for (const section of sections) {
  const path = join(outDir, `${section.slug}.json`);
  writeFileSync(path, JSON.stringify(section, null, 2));
  console.log(`Exported ${path}`);
}

writeFileSync(
  join(outDir, "index.json"),
  JSON.stringify(
    sections.map((s) => ({
      id: s.id,
      slug: s.slug,
      title: s.title,
      description: s.description,
      icon: s.icon,
      order: s.order,
      topicCount: s.topics.length,
    })),
    null,
    2
  )
);

console.log(`Exported ${sections.length} sections to ${outDir}`);
