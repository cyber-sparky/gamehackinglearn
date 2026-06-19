"use client";

import { useState } from "react";

export function PointerChainBuilder() {
  const [base, setBase] = useState("game.exe+0x123456");
  const [offsets, setOffsets] = useState(["0x20", "0x18", "0x10"]);

  const chain = offsets.reduce<string[]>((acc, off, i) => {
    if (i === 0) return [`[${base}]`];
    return [...acc, `[${acc[acc.length - 1]} + ${off}]`];
  }, []);

  const addOffset = () => setOffsets((o) => [...o, "0x0"]);
  const updateOffset = (i: number, val: string) =>
    setOffsets((o) => o.map((x, j) => (j === i ? val : x)));

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <h3 className="text-lg font-semibold text-foreground">Pointer Chain Builder</h3>
      <p className="mt-1 text-sm text-muted">
        Visualize multi-level pointer chains used in Cheat Engine pointer scans.
      </p>
      <label className="mt-4 block text-sm">
        <span className="text-muted">Static base</span>
        <input
          value={base}
          onChange={(e) => setBase(e.target.value)}
          className="mt-1 w-full rounded-lg border border-border bg-muted-bg/30 px-3 py-2 font-mono text-sm"
        />
      </label>
      <div className="mt-4 space-y-2">
        {offsets.map((off, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="text-xs text-muted w-16">Offset {i + 1}</span>
            <input
              value={off}
              onChange={(e) => updateOffset(i, e.target.value)}
              className="flex-1 rounded-lg border border-border bg-muted-bg/30 px-3 py-2 font-mono text-sm"
            />
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={addOffset}
        className="mt-3 text-sm text-accent hover:underline"
      >
        + Add offset level
      </button>
      <div className="mt-4 rounded-lg bg-muted-bg/40 p-4 font-mono text-sm text-foreground">
        {chain.map((step, i) => (
          <div key={i} className="py-0.5">
            {i > 0 && "→ "}
            {step}
          </div>
        ))}
        <div className="mt-2 text-accent">Final field at last dereference</div>
      </div>
    </div>
  );
}
