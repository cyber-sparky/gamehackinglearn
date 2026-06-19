"use client";

import { useState, useMemo } from "react";

function parsePattern(input: string): { bytes: number[]; mask: string } | null {
  const parts = input.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return null;
  const bytes: number[] = [];
  let mask = "";
  for (const p of parts) {
    if (p === "??" || p === "?") {
      bytes.push(0);
      mask += "?";
    } else {
      const n = parseInt(p, 16);
      if (Number.isNaN(n)) return null;
      bytes.push(n);
      mask += "x";
    }
  }
  return { bytes, mask };
}

function scan(region: number[], pattern: number[], mask: string): number[] {
  const hits: number[] = [];
  for (let i = 0; i + pattern.length <= region.length; i++) {
    let ok = true;
    for (let j = 0; j < pattern.length; j++) {
      if (mask[j] === "x" && region[i + j] !== pattern[j]) {
        ok = false;
        break;
      }
    }
    if (ok) hits.push(i);
  }
  return hits;
}

const SAMPLE: number[] = [
  0x48, 0x8b, 0x05, 0x12, 0x34, 0x56, 0x78, 0x48, 0x85, 0xc0, 0x74, 0x0a, 0x48,
  0x8b, 0x05, 0xaa, 0xbb, 0xcc, 0xdd,
];

export function PatternMatcher() {
  const [pattern, setPattern] = useState("48 8B 05 ?? ?? ?? ?? 48 85 C0");

  const result = useMemo(() => {
    const parsed = parsePattern(pattern);
    if (!parsed) return { error: "Invalid pattern", hits: [] as number[] };
    const hits = scan(SAMPLE, parsed.bytes, parsed.mask);
    return { error: null, hits };
  }, [pattern]);

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <h3 className="text-sm font-semibold text-foreground">Pattern Matcher</h3>
      <p className="mt-1 text-xs text-muted">
        Enter hex bytes with <code className="text-accent">??</code> wildcards.
        Scans a sample buffer.
      </p>
      <input
        value={pattern}
        onChange={(e) => setPattern(e.target.value)}
        className="mt-3 w-full rounded-lg border border-border bg-background px-3 py-2 font-mono text-sm outline-none focus:border-accent/50"
      />
      {result.error ? (
        <p className="mt-2 text-sm text-red-400">{result.error}</p>
      ) : (
        <p className="mt-2 text-sm text-muted">
          Found {result.hits.length} match(es) at offset(s):{" "}
          {result.hits.map((o) => `0x${o.toString(16)}`).join(", ") || "none"}
        </p>
      )}
      <pre className="mt-3 overflow-x-auto rounded-lg bg-muted-bg p-3 font-mono text-xs text-muted">
        {SAMPLE.map((b) => b.toString(16).padStart(2, "0")).join(" ")}
      </pre>
    </div>
  );
}
