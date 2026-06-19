"use client";

const FIELDS = [
  { name: "e_magic", offset: "0x00", value: "MZ", desc: "DOS signature" },
  { name: "e_lfanew", offset: "0x3C", value: "0x80", desc: "Offset to PE header" },
  { name: "Signature", offset: "0x80", value: "PE", desc: "PE signature" },
  { name: "Machine", offset: "0x84", value: "0x8664", desc: "AMD64" },
  { name: "NumberOfSections", offset: "0x86", value: "6", desc: "Section count" },
  { name: "SizeOfOptionalHeader", offset: "0x94", value: "0xF0", desc: "Optional header size" },
  { name: "EntryPoint", offset: "0xA0", value: "0x1234", desc: "AddressOfEntryPoint (RVA)" },
  { name: "ImageBase", offset: "0xB0", value: "0x140000000", desc: "Preferred load address" },
];

export function PEHeaderExplorer() {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <h3 className="text-sm font-semibold text-foreground">PE Header Explorer</h3>
      <p className="mt-1 text-xs text-muted">
        Click fields to explore a simplified PE layout (educational sample).
      </p>
      <div className="mt-4 space-y-2">
        {FIELDS.map((f) => (
          <div
            key={f.name}
            className="flex flex-wrap items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm"
          >
            <span className="font-mono text-xs text-accent">{f.offset}</span>
            <span className="font-medium text-foreground">{f.name}</span>
            <span className="font-mono text-muted">{f.value}</span>
            <span className="text-xs text-muted">— {f.desc}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
