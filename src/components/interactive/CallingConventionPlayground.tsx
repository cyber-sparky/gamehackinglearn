"use client";

import { useState } from "react";

const REGS = [
  { name: "RCX", role: "1st integer/pointer arg" },
  { name: "RDX", role: "2nd integer/pointer arg" },
  { name: "R8", role: "3rd integer/pointer arg" },
  { name: "R9", role: "4th integer/pointer arg" },
  { name: "RAX", role: "Return value" },
  { name: "RSP", role: "Stack pointer" },
];

export function CallingConventionPlayground() {
  const [args, setArgs] = useState(["0x100", "42", "0", "1"]);

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <h3 className="text-lg font-semibold text-foreground">
        x64 Windows Calling Convention
      </h3>
      <p className="mt-1 text-sm text-muted">
        Microsoft x64 passes the first four arguments in RCX, RDX, R8, R9.
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {REGS.slice(0, 4).map((reg, i) => (
          <label key={reg.name} className="text-sm">
            <span className="font-mono text-accent">{reg.name}</span>
            <input
              value={args[i]}
              onChange={(e) =>
                setArgs((a) => a.map((v, j) => (j === i ? e.target.value : v)))
              }
              className="mt-1 w-full rounded-lg border border-border bg-muted-bg/30 px-3 py-2 font-mono text-sm"
            />
          </label>
        ))}
      </div>
      <div className="mt-4 rounded-lg bg-muted-bg/40 p-4 font-mono text-sm">
        <p className="text-muted">{"// Pseudocode call"}</p>
        <p>
          SomeFunction(<span className="text-accent">{args[0]}</span>,{" "}
          <span className="text-accent">{args[1]}</span>,{" "}
          <span className="text-accent">{args[2]}</span>,{" "}
          <span className="text-accent">{args[3]}</span>);
        </p>
        <p className="mt-2 text-muted">
          RCX={args[0]} RDX={args[1]} R8={args[2]} R9={args[3]}
        </p>
      </div>
    </div>
  );
}
