"use client";

import { useMemo, useState } from "react";

function parseHex(input: string): number[] {
  const cleaned = input.replace(/[^0-9a-fA-F]/g, "");
  const bytes: number[] = [];
  for (let i = 0; i < cleaned.length - 1; i += 2) {
    bytes.push(parseInt(cleaned.slice(i, i + 2), 16));
  }
  return bytes;
}

export function HexViewer() {
  const [hex, setHex] = useState("48 8B 05 DE AD BE EF 00 00 00 40");
  const bytes = useMemo(() => parseHex(hex), [hex]);

  const interpretations = useMemo(() => {
    if (bytes.length < 4) return null;
    const u32 =
      bytes[0] | (bytes[1] << 8) | (bytes[2] << 16) | (bytes[3] << 24);
    const i32 = u32 > 0x7fffffff ? u32 - 0x100000000 : u32;
    const f32 = new DataView(new Uint8Array(bytes.slice(0, 4)).buffer).getFloat32(
      0,
      true
    );
    return { u32, i32, f32 };
  }, [bytes]);

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <h3 className="text-lg font-semibold text-foreground">Hex / Memory Viewer</h3>
      <p className="mt-1 text-sm text-muted">
        Type bytes (space-separated hex) and see little-endian interpretations.
      </p>
      <textarea
        value={hex}
        onChange={(e) => setHex(e.target.value)}
        rows={3}
        className="mt-4 w-full rounded-lg border border-border bg-muted-bg/30 px-3 py-2 font-mono text-sm"
      />
      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        {bytes.map((b, i) => (
          <span
            key={i}
            className="rounded bg-muted-bg px-2 py-1 font-mono text-xs text-foreground"
          >
            [{i.toString().padStart(2, "0")}] 0x{b.toString(16).padStart(2, "0").toUpperCase()}{" "}
            ({b})
          </span>
        ))}
      </div>
      {interpretations && (
        <div className="mt-4 rounded-lg border border-accent/20 bg-accent/5 p-4 text-sm">
          <p>
            <span className="text-muted">uint32 (LE):</span>{" "}
            <span className="font-mono">{interpretations.u32}</span>
          </p>
          <p className="mt-1">
            <span className="text-muted">int32 (LE):</span>{" "}
            <span className="font-mono">{interpretations.i32}</span>
          </p>
          <p className="mt-1">
            <span className="text-muted">float32 (LE):</span>{" "}
            <span className="font-mono">{interpretations.f32.toFixed(4)}</span>
          </p>
        </div>
      )}
    </div>
  );
}
