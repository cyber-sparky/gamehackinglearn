import type { RawSection } from "@/types";
import { res, topicTemplate } from "../helpers";

export const memoryAnalysisSection: RawSection = {
  id: "memory-analysis",
  slug: "memory-analysis",
  title: "Memory Analysis",
  description: "Techniques for reading, scanning, and interpreting game memory.",
  icon: "MemoryStick",
  order: 7,
  topics: [
    topicTemplate("reading-memory", "Reading Memory", "Safe and effective memory reading techniques.", "ReadProcessMemory (external) or direct pointer dereference (internal/injected). Alignment matters for multi-byte types. Endianness: x86/x64 is little-endian.\n\nDocument values at rest vs during gameplay — many game values are transient.", { difficulty: "beginner", hours: 4, tags: ["memory", "reading"] }),
    topicTemplate("memory-layouts", "Memory Layouts", "How game data is organized in memory.", "Typical layout:\n- Global singletons in .data\n- Entity arrays/pools on heap\n- Stack locals per frame\n- GPU resources in separate heaps\n\nDraw memory maps linking classes to regions.", { difficulty: "intermediate", hours: 6, tags: ["layout", "structures"], exercises: ["Create a memory map diagram for a simple game's player entity"] }),
    topicTemplate("memory-scanning", "Memory Scanning", "Exact, fuzzy, and changed-value scans.", "Cheat Engine scan types:\n- Exact value\n- Unknown initial → changed/unchanged\n- Increased/decreased\n- Fuzzy (float tolerance)\n\nNarrow results by changing game state between scans.", { difficulty: "beginner", hours: 6, tags: ["scanning", "cheat-engine"], labs: ["lab-ce-health-scan"] }),
    topicTemplate("pattern-scanning", "Pattern Scanning", "AOB scanning in modules.", "Scan executable regions for byte patterns with wildcards. Account for ASLR by scanning module-relative offsets.\n\n`48 8B 05 ?? ?? ?? ?? 48 85 C0` — common mov rax, [rip+rel]; test rax, rax pattern.", { difficulty: "intermediate", hours: 5, tags: ["patterns", "aob"], prerequisites: ["signatures"] }),
    topicTemplate("pointer-chains", "Pointer Chains", "Multi-level pointer resolution.", "Static base + offsets → dynamic heap address:\n`game.exe+0x1234568` → `[+0x20]` → `[+0x18]` → health\n\nPointer scan in CE finds stable chains across restarts (module-relative bases).", { difficulty: "intermediate", hours: 8, tags: ["pointers", "chains"], labs: ["lab-ce-pointer"] }),
    topicTemplate("structures", "Structure Analysis", "Reverse engineering C++ structures from memory.", "Workflow:\n1. Find base address of object\n2. Dump surrounding memory\n3. Identify vtable pointer, member fields\n4. Correlate changes with game actions\n5. Define struct in CE/ReClass.NET\n\nTools: ReClass.NET, Ghidra struct editor.", { difficulty: "advanced", hours: 10, tags: ["structures", "reclass"], resources: [res("reclass", "ReClass.NET", "https://github.com/ReClassNET/ReClass.NET", "tool", "Memory structure editor")] }),
    topicTemplate("rtti", "Run-Time Type Information", "Identifying C++ types via RTTI.", "MSVC RTTI includes TypeDescriptor, ClassHierarchyDescriptor. Scanners locate vtables and type names.\n\nUseful for identifying unknown objects in engine binaries. Tools: ClassInformer (IDA), Ghidra RTTI scripts.", { difficulty: "advanced", hours: 6, tags: ["rtti", "cpp"], prerequisites: ["classes"] }),
  ],
};
