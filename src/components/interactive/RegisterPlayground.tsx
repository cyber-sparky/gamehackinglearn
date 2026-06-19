"use client";

import { useState } from "react";

const REGS = ["RAX", "RBX", "RCX", "RDX", "RSI", "RDI", "RBP", "RSP"] as const;

export function RegisterPlayground() {
  const [regs, setRegs] = useState<Record<string, string>>({
    RAX: "0x0",
    RBX: "0x0",
    RCX: "0x1",
    RDX: "0x2",
    RSI: "0x0",
    RDI: "0x0",
    RBP: "0x7FFE0000",
    RSP: "0x7FFDD000",
  });
  const [op, setOp] = useState("mov rax, rcx");
  const [log, setLog] = useState<string[]>([]);

  const run = () => {
    const parts = op.toLowerCase().replace(/,/g, "").split(/\s+/);
    if (parts[0] === "mov" && parts.length === 3) {
      const dst = parts[1].toUpperCase();
      const src = parts[2].toUpperCase();
      if (REGS.includes(dst as (typeof REGS)[number])) {
        const val =
          REGS.includes(src as (typeof REGS)[number]) && regs[src]
            ? regs[src]
            : src.startsWith("0x")
              ? src
              : `0x${src}`;
        setRegs((r) => ({ ...r, [dst]: val }));
        setLog((l) => [`${op} → ${dst} = ${val}`, ...l].slice(0, 5));
      }
    } else if (parts[0] === "add" && parts.length === 3) {
      setLog((l) => [`add not fully simulated — study in x64dbg`, ...l].slice(0, 5));
    } else {
      setLog((l) => [`Unknown or unsupported: ${op}`, ...l].slice(0, 5));
    }
  };

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <h3 className="text-sm font-semibold text-foreground">
        x64 Register Playground
      </h3>
      <p className="mt-1 text-xs text-muted">
        Try: <code className="text-accent">mov rax, rcx</code> or{" "}
        <code className="text-accent">mov rdx, 0x40</code>
      </p>
      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {REGS.map((r) => (
          <div key={r} className="rounded-md bg-muted-bg px-2 py-1.5 font-mono text-xs">
            <span className="text-accent">{r}</span>{" "}
            <span className="text-foreground">{regs[r]}</span>
          </div>
        ))}
      </div>
      <div className="mt-4 flex gap-2">
        <input
          value={op}
          onChange={(e) => setOp(e.target.value)}
          className="flex-1 rounded-lg border border-border bg-background px-3 py-2 font-mono text-sm outline-none focus:border-accent/50"
        />
        <button
          onClick={run}
          className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-hover"
        >
          Step
        </button>
      </div>
      {log.length > 0 && (
        <ul className="mt-3 space-y-1 font-mono text-xs text-muted">
          {log.map((l, i) => (
            <li key={i}>{l}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
