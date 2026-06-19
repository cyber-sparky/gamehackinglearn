"use client";

import { useState } from "react";

const DEFAULT_LOCALS = [
  { name: "health", offset: "-0x14", size: 4 },
  { name: "ammo", offset: "-0x10", size: 4 },
  { name: "padding", offset: "-0x0C", size: 4 },
];

export function StackFrameVisualizer() {
  const [subRsp, setSubRsp] = useState("0x30");
  const [locals, setLocals] = useState(DEFAULT_LOCALS);

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <h3 className="text-lg font-semibold text-foreground">Stack Frame Visualizer</h3>
      <p className="mt-1 text-sm text-muted">
        Map x64 stack locals relative to RBP after a typical prologue.
      </p>
      <label className="mt-4 block text-sm">
        <span className="text-muted">sub rsp, ___</span>
        <input
          value={subRsp}
          onChange={(e) => setSubRsp(e.target.value)}
          className="mt-1 w-32 rounded-lg border border-border bg-muted-bg/30 px-3 py-2 font-mono text-sm"
        />
      </label>
      <div className="mt-6 font-mono text-sm">
        <div className="rounded-t-lg border border-border bg-accent/10 px-4 py-2 text-accent">
          Higher addresses ↑
        </div>
        <div className="border-x border-border bg-muted-bg/20 px-4 py-2">
          [rbp+8] return address
        </div>
        <div className="border-x border-border bg-accent/5 px-4 py-2 font-semibold text-foreground">
          [rbp+0] saved RBP ← RBP points here
        </div>
        {locals.map((loc) => (
          <div
            key={loc.name}
            className="border-x border-border px-4 py-2 text-muted"
          >
            [rbp{loc.offset}] {loc.name} ({loc.size} bytes)
          </div>
        ))}
        <div className="rounded-b-lg border border-border bg-muted-bg/20 px-4 py-2">
          RSP (stack top) — shadow space + locals = {subRsp}
        </div>
      </div>
      <button
        type="button"
        onClick={() =>
          setLocals((l) => [
            ...l,
            { name: `local_${l.length}`, offset: `-0x${(8 + l.length * 4).toString(16)}`, size: 4 },
          ])
        }
        className="mt-3 text-sm text-accent hover:underline"
      >
        + Add local variable
      </button>
    </div>
  );
}
