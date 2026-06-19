"use client";

const SAMPLE_IMPORTS = [
  { dll: "kernel32.dll", func: "ReadProcessMemory", hint: "External memory read" },
  { dll: "user32.dll", func: "FindWindowW", hint: "Window enumeration" },
  { dll: "d3d11.dll", func: "D3D11CreateDevice", hint: "DirectX 11 graphics" },
  { dll: "ws2_32.dll", func: "send", hint: "Network socket send" },
];

export function ImportTableExplorer() {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <h3 className="text-lg font-semibold text-foreground">Import Table Explorer</h3>
      <p className="mt-1 text-sm text-muted">
        Sample imports — infer game capabilities from DLL dependencies.
      </p>
      <table className="mt-4 w-full text-left text-sm">
        <thead>
          <tr className="border-b border-border text-muted">
            <th className="py-2 pr-4">DLL</th>
            <th className="py-2 pr-4">Function</th>
            <th className="py-2">Inference</th>
          </tr>
        </thead>
        <tbody>
          {SAMPLE_IMPORTS.map((row) => (
            <tr key={row.func} className="border-b border-border/50">
              <td className="py-2 pr-4 font-mono text-xs">{row.dll}</td>
              <td className="py-2 pr-4 font-mono text-xs text-accent">
                {row.func}
              </td>
              <td className="py-2 text-muted">{row.hint}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
