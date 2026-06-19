import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Educational Disclaimer",
  description: "Terms of use for the Game Hacking Roadmap learning platform.",
};

export default function DisclaimerPage() {
  return (
    <div className="mx-auto max-w-3xl prose-custom">
      <h1 className="text-3xl font-bold text-foreground">Educational Disclaimer</h1>
      <p className="mt-4 text-muted leading-relaxed">
        Game Hacking Roadmap is a free educational resource for learning reverse
        engineering, memory analysis, Windows internals, and game security
        research. All content is provided for lawful, ethical learning in
        controlled environments.
      </p>

      <h2 className="mt-8 text-xl font-semibold text-foreground">Intended use</h2>
      <ul className="mt-3 list-disc space-y-2 pl-6 text-muted">
        <li>Study in isolated virtual machines with offline or open-source targets</li>
        <li>Develop skills for security research, malware analysis, and defensive engineering</li>
        <li>Understand how games and anti-cheat systems work from a research perspective</li>
      </ul>

      <h2 className="mt-8 text-xl font-semibold text-foreground">Prohibited use</h2>
      <ul className="mt-3 list-disc space-y-2 pl-6 text-muted">
        <li>Cheating in online multiplayer games or violating terms of service</li>
        <li>Bypassing anti-cheat on live production games</li>
        <li>Any activity that harms other players or violates applicable law</li>
      </ul>

      <h2 className="mt-8 text-xl font-semibold text-foreground">Your data</h2>
      <p className="mt-3 text-muted leading-relaxed">
        Progress, notes, and quiz scores are stored in your browser only. Export
        backups from the{" "}
        <Link href="/dashboard" className="text-accent hover:underline">
          dashboard
        </Link>{" "}
        before clearing site data or switching devices.
      </p>

      <h2 className="mt-8 text-xl font-semibold text-foreground">No warranty</h2>
      <p className="mt-3 text-muted leading-relaxed">
        Content is provided as-is for education. Techniques described may not
        apply to all games or versions. Always verify in your own lab environment.
      </p>

      <Link
        href="/"
        className="mt-8 inline-block text-accent hover:underline"
      >
        ← Back to home
      </Link>
    </div>
  );
}
