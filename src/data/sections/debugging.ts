import type { RawSection } from "@/types";
import { res, topicTemplate } from "../helpers";

export const debuggingSection: RawSection = {
  id: "debugging",
  slug: "debugging",
  title: "Debugging",
  description: "Master debuggers for dynamic game analysis.",
  icon: "Bug",
  order: 5,
  topics: [
    topicTemplate("x64dbg", "x64dbg", "Primary user-mode debugger for Windows games.", "x64dbg features:\n- Intuitive GUI, memory map, symbols\n- Conditional breakpoints, logging\n- Plugin ecosystem (Scylla, xAnalyzer)\n- Separate x32/x64 versions\n\nWorkflow: attach → set BP on API/string → run → inspect registers/stack/memory.", { difficulty: "beginner", hours: 12, tags: ["x64dbg", "debugger"], resources: [res("x64dbg", "x64dbg", "https://x64dbg.com/", "tool", "Open source debugger"), res("x64dbg-docs", "x64dbg Documentation", "https://help.x64dbg.com/", "documentation", "Official docs")], labs: ["lab-x64dbg-intro"] }),
    topicTemplate("windbg", "WinDbg", "Advanced Windows debugging with extensions.", "WinDbg debugs user and kernel mode:\n- `.symfix`, `.reload` for symbols\n- `!heap`, `!address` for memory\n- Time Travel Debugging (TTD)\n- Kernel debugging for driver research\n\nEssential for crash analysis and deep internals.", { difficulty: "advanced", hours: 20, tags: ["windbg", "debugger"], resources: [res("windbg", "WinDbg Documentation", "https://learn.microsoft.com/en-us/windows-hardware/drivers/debugger/", "documentation", "Microsoft debugger docs")] }),
    topicTemplate("ce-debugger", "Cheat Engine Debugger", "Integrated debugging in Cheat Engine.", "CE's debugger integrates with memory scanning:\n- Break and trace (find what writes/accesses)\n- Debugger attach with VEH debugger option\n- Auto assembler for patches (research VMs)\n\nBest for correlating memory values with code.", { difficulty: "beginner", hours: 8, tags: ["cheat-engine", "debugger"], prerequisites: ["x64dbg"], labs: ["lab-ce-pointer"] }),
    topicTemplate("hw-breakpoints", "Hardware Breakpoints", "DR0-DR3 debug registers.", "CPU debug registers break on execute/read/write at addresses. Limited to 4 active breakpoints. Bypass some anti-debug that checks for INT3 (0xCC).\n\nSet in x64dbg: Breakpoint → Hardware, Access.", { difficulty: "intermediate", hours: 4, tags: ["breakpoints", "hardware"] }),
    topicTemplate("sw-breakpoints", "Software Breakpoints", "INT3 (0xCC) patching.", "Debugger replaces instruction byte with 0xCC. Original restored on continue. Detectable by integrity checks. Use hardware BPs when SW BPs are cleared.", { difficulty: "beginner", hours: 3, tags: ["breakpoints", "software"] }),
    topicTemplate("memory-tracing", "Memory Tracing", "Find what accesses/writes memory.", "Techniques:\n- CE 'Find what writes to this address'\n- Hardware watchpoints\n- Page guard exceptions\n- x64dbg memory breakpoints\n\nTrace back from known value to setter function.", { difficulty: "intermediate", hours: 6, tags: ["tracing", "memory"], labs: ["lab-memory-trace"] }),
    topicTemplate("exception-handling", "Exception Handling", "SEH, VEH, and debugger interaction.", "Windows uses Structured Exception Handling (SEH linked list) and Vectored Exception Handlers. Debuggers intercept exceptions first.\n\nAnti-debug may use SEH for timing checks. Understand exception flow for analysis.", { difficulty: "advanced", hours: 6, tags: ["exceptions", "seh"], prerequisites: ["windows-internals-intro"] }),
  ],
};
