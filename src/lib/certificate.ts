import type { Section } from "@/types";

export function downloadSectionCertificate(section: Section, completedCount: number) {
  const total = section.topics.length;
  const percent = Math.round((completedCount / total) * 100);
  const date = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>Certificate — ${section.title}</title>
<style>
  body{font-family:Georgia,serif;text-align:center;padding:60px;background:#0a0a0f;color:#e8e8e8}
  .cert{border:3px solid #6366f1;padding:48px;max-width:700px;margin:0 auto;background:#12121a}
  h1{font-size:2rem;color:#a5b4fc;margin:0}
  h2{font-size:1.5rem;margin:24px 0}
  p{color:#9ca3af;line-height:1.6}
  .badge{font-size:3rem;margin:24px 0}
</style></head><body>
<div class="cert">
  <div class="badge">🏆</div>
  <h1>Game Hacking Roadmap</h1>
  <p>Certificate of Section Completion</p>
  <h2>${section.title}</h2>
  <p>${completedCount} of ${total} topics completed (${percent}%)</p>
  <p>Issued ${date}</p>
  <p style="margin-top:32px;font-size:0.85rem">Educational achievement — self-paced learning platform</p>
</div></body></html>`;

  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `certificate-${section.slug}.html`;
  a.click();
  URL.revokeObjectURL(url);
}
