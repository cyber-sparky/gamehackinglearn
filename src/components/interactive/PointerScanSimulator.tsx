"use client";

import { useState } from "react";

const MEMORY = [
  0x48, 0x8b, 0x05, 0x12, 0x34, 0x56, 0x78, 0x90, 0x00, 0x64, 0x00, 0x00,
  0x00, 0xc3, 0x48, 0x89, 0x5c, 0x24,
];

export function PointerScanSimulator() {
  const [filter, setFilter] = useState<"all" | "changed" | "unchanged">("all");
  const [scan, setScan] = useState(1);

  const results = MEMORY.map((b, i) => ({
    offset: i,
    value: b,
    changed: i % 3 === 0,
  })).filter((r) => {
    if (filter === "changed") return r.changed;
    if (filter === "unchanged") return !r.changed;
    return true;
  });

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <h3 className="text-lg font-semibold text-foreground">
        Pointer Scan Simulator
      </h3>
      <p className="mt-1 text-sm text-muted">
        Narrow fake memory results between scans (like CE changed-value filter).
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {(["all", "changed", "unchanged"] as const).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`rounded-lg px-3 py-1 text-sm ${
              filter === f
                ? "bg-accent text-white"
                : "border border-border hover:bg-muted-bg"
            }`}
          >
            {f}
          </button>
        ))}
        <button
          type="button"
          onClick={() => setScan((s) => s + 1)}
          className="rounded-lg border border-border px-3 py-1 text-sm hover:bg-muted-bg"
        >
          Next scan (#{scan + 1})
        </button>
      </div>
      <div className="mt-4 max-h-40 overflow-y-auto font-mono text-xs">
        {results.map((r) => (
          <div key={r.offset} className="flex gap-4 py-0.5 text-muted">
            <span>module+0x{r.offset.toString(16).padStart(2, "0")}</span>
            <span className="text-foreground">0x{r.value.toString(16).padStart(2, "0")}</span>
          </div>
        ))}
      </div>
      <p className="mt-2 text-xs text-muted">{results.length} addresses</p>
    </div>
  );
}
