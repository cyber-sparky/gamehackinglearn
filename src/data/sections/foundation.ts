import type { Section } from "@/types";
import { res, topicTemplate } from "../helpers";

export const foundationSection: Section = {
  id: "foundation",
  slug: "foundation",
  title: "Foundation",
  description:
    "Core computer science and game internals knowledge required before reverse engineering games.",
  icon: "Layers",
  order: 1,
  topics: [
    topicTemplate(
      "how-games-work",
      "How Games Work Internally",
      "Understand the game loop, rendering pipeline, and core subsystems.",
      `Games are real-time interactive applications built around a **game loop** that processes input, updates simulation state, and renders frames. Each frame typically follows: poll input → update physics/AI → render graphics → present to screen.

Key subsystems include:
- **Input handling** — keyboard, mouse, controller via OS APIs
- **Simulation** — game logic, physics, AI running at fixed or variable timesteps
- **Rendering** — draw calls through DirectX/OpenGL/Vulkan to GPU
- **Audio** — sound mixing and playback
- **Networking** — client-server or peer-to-peer communication in multiplayer titles

Understanding this architecture helps you know *where* to look when analyzing a game binary — whether in the render loop, entity update functions, or network packet handlers.`,
      {
        difficulty: "beginner",
        hours: 3,
        tags: ["fundamentals", "architecture", "game-loop"],
        docs: [
          res("gamedev-loop", "Game Programming Patterns — Game Loop", "https://gameprogrammingpatterns.com/game-loop.html", "documentation", "Classic explanation of game loop patterns"),
          res("valve-source", "Source Engine Architecture Overview", "https://developer.valvesoftware.com/wiki/Source", "documentation", "Real-world engine architecture reference"),
        ],
        videos: [
          res("yt-game-loop", "Game Engine Architecture — GDC Talks", "https://www.youtube.com/results?search_query=game+engine+architecture+gdc", "video", "Collection of GDC talks on engine design"),
        ],
        resources: [
          res("handmade-hero", "Handmade Hero Series", "https://handmadehero.org/", "course", "Build a game from scratch to understand internals", "intermediate"),
          res("github-sdl-game", "SDL2 Game Examples", "https://github.com/Ravencwow/SDL2-Game-Engine-Tutorials", "github", "Open source game engine tutorials"),
        ],
        exercises: [
          "Draw a diagram of the game loop for a FPS vs an RTS",
          "Identify which subsystems handle player health in a multiplayer game",
          "Trace one frame from input to screen output conceptually",
        ],
      }
    ),
    topicTemplate(
      "game-engines-intro",
      "Game Engines Overview",
      "Survey major engines and their reverse engineering surface areas.",
      `Game engines provide abstractions over graphics, physics, scripting, and asset management. Each engine exposes different analysis surfaces:

| Engine | Key RE Surface |
|--------|---------------|
| **Unity** | Mono/IL2CPP managed code, asset bundles |
| **Unreal** | UObject reflection, Blueprint VM, SDK layout |
| **Source** | Entity system, networked vars, datamaps |
| **Custom C++** | Direct vtables, manual memory management |

When approaching an unknown game, identifying the engine (via strings, DLLs, or tools like Detect It Easy) immediately narrows your tooling and methodology.`,
      {
        difficulty: "beginner",
        prerequisites: ["how-games-work"],
        hours: 4,
        tags: ["engines", "unity", "unreal", "source"],
        docs: [
          res("unity-manual", "Unity Manual", "https://docs.unity3d.com/Manual/index.html", "documentation", "Official Unity documentation"),
          res("ue-docs", "Unreal Engine Documentation", "https://docs.unrealengine.com/", "documentation", "Official Unreal documentation"),
        ],
        resources: [
          res("engine-detect", "Detect It Easy", "https://github.com/horsicq/Detect-It-Easy", "tool", "Identify packers, compilers, and engine signatures"),
        ],
      }
    ),
    topicTemplate(
      "process-memory",
      "Process Memory",
      "How operating systems organize and protect process memory.",
      `Each running game exists as a **process** with its own virtual address space. The OS maps this space into regions:

- **Code (.text)** — executable instructions, typically read/execute
- **Data (.data/.bss)** — global and static variables
- **Heap** — dynamic allocations (malloc/new)
- **Stack** — function call frames and local variables
- **Mapped modules** — DLLs loaded at specific base addresses

Tools like Process Hacker, VMMap, and Cheat Engine's memory viewer let you inspect these regions. Understanding memory layout is foundational for static/dynamic analysis and debugging.`,
      {
        difficulty: "beginner",
        hours: 5,
        tags: ["memory", "process", "windows"],
        docs: [
          res("ms-memory", "Windows Memory Management", "https://learn.microsoft.com/en-us/windows/win32/memory/memory-management", "documentation", "Microsoft docs on virtual memory"),
          res("ce-docs", "Cheat Engine Memory Scanning", "https://wiki.cheatengine.org/", "documentation", "Practical memory reading guide"),
        ],
        videos: [
          res("yt-process-mem", "Windows Process Memory Layout", "https://www.youtube.com/results?search_query=windows+process+memory+layout", "video", "Visual explanations of address space"),
        ],
        exercises: [
          "Use VMMap to inspect a simple game's memory regions",
          "Identify the base address of game.exe and its main DLLs",
          "Compare virtual vs physical memory concepts in writing",
        ],
      }
    ),
    topicTemplate(
      "cpu-architecture",
      "CPU Architecture",
      "Fundamentals of how CPUs execute instructions and manage state.",
      `Modern CPUs fetch, decode, and execute machine instructions from memory. Key concepts:

- **Registers** — fast storage inside the CPU (RAX, RBX, etc. on x64)
- **Instruction pointer (RIP)** — address of next instruction
- **Flags** — zero, carry, overflow flags set by arithmetic
- **Pipelines & caches** — performance optimizations affecting timing

Reverse engineers must read disassembly fluently. Every high-level construct (if/else, loops, classes) compiles down to these primitives.`,
      {
        difficulty: "beginner",
        hours: 6,
        tags: ["cpu", "architecture", "fundamentals"],
        docs: [
          res("intel-manual", "Intel SDM Volume 1", "https://www.intel.com/content/www/us/en/developer/articles/technical/intel-sdm.html", "documentation", "Official Intel architecture manual"),
          res("amd-manual", "AMD64 Architecture Manual", "https://www.amd.com/en/support/tech-docs", "documentation", "AMD64 reference"),
        ],
        resources: [
          res("godbolt", "Compiler Explorer (Godbolt)", "https://godbolt.org/", "tool", "See C++ compile to assembly live"),
        ],
      }
    ),
    topicTemplate(
      "x86",
      "x86 (32-bit) Architecture",
      "32-bit Intel architecture specifics relevant to legacy games.",
      `x86 uses 32-bit registers (EAX, EBX, ECX, EDX, ESI, EDI, EBP, ESP) and 32-bit addresses. Many older games and some current titles still ship x86 binaries.

Key differences from x64:
- Smaller address space (4 GB user-mode)
- Different calling convention defaults (often \`__stdcall\`/\`__cdecl\`)
- No R8-R15 extended registers

Legacy MMOs, indie games, and injected DLLs frequently target x86. Tools like x32dbg handle 32-bit debugging.`,
      {
        difficulty: "intermediate",
        prerequisites: ["cpu-architecture"],
        hours: 8,
        tags: ["x86", "32-bit", "assembly"],
        docs: [
          res("x86-guide", "x86 Assembly Guide", "https://www.cs.virginia.edu/~evans/cs216/guides/x86.html", "documentation", "University x86 reference"),
        ],
        exercises: [
          "Identify 32-bit vs 64-bit PE files using PE-bear",
          "Debug a 32-bit crackme in x32dbg",
          "Convert between 32-bit and 64-bit register names",
        ],
      }
    ),
    topicTemplate(
      "x64",
      "x64 (64-bit) Architecture",
      "Modern 64-bit Windows calling conventions and register usage.",
      `x64 Windows uses the **Microsoft x64 calling convention**:
- First 4 integer args: RCX, RDX, R8, R9
- Additional args on stack
- Caller allocates 32-byte shadow space
- RAX for return values; RIP-relative addressing common

Most modern AAA games are x64. Understanding this convention lets you trace function calls in disassemblers and set breakpoints on API wrappers.`,
      {
        difficulty: "intermediate",
        prerequisites: ["x86", "calling-conventions"],
        hours: 8,
        tags: ["x64", "64-bit", "assembly"],
        docs: [
          res("ms-x64-abi", "Microsoft x64 Calling Convention", "https://learn.microsoft.com/en-us/cpp/build/x64-calling-convention", "documentation", "Official ABI documentation"),
        ],
        exercises: [
          "Trace a WinAPI call in x64dbg and identify register arguments",
          "Use Godbolt to compare x86 vs x64 codegen for same C++ function",
          "Document shadow space usage in 3 real functions",
        ],
      }
    ),
    topicTemplate(
      "assembly-basics",
      "Assembly Basics",
      "Essential x86/x64 instructions for reading disassembly.",
      `Core instruction categories every RE should know:

**Data movement:** \`mov\`, \`lea\`, \`push\`, \`pop\`
**Arithmetic:** \`add\`, \`sub\`, \`imul\`, \`idiv\`
**Logic:** \`and\`, \`or\`, \`xor\`, \`not\`, \`shl\`, \`shr\`
**Control flow:** \`jmp\`, \`je/jne\`, \`call\`, \`ret\`
**Comparison:** \`cmp\`, \`test\`

Practice reading small functions: prologue → body → epilogue. Recognize compiler patterns for if/else, loops, and switch statements.`,
      {
        difficulty: "intermediate",
        prerequisites: ["cpu-architecture", "x86"],
        hours: 10,
        tags: ["assembly", "disassembly"],
        docs: [
          res("felix-cloutier", "x86 Instruction Reference", "https://www.felixcloutier.com/x86/", "documentation", "Comprehensive instruction reference"),
        ],
        resources: [
          res("crackmes", "Crackmes.one", "https://crackmes.one/", "course", "Beginner reverse engineering challenges"),
        ],
        labs: ["lab-assembly-intro"],
      }
    ),
    topicTemplate(
      "windows-internals-intro",
      "Windows Internals Introduction",
      "Core Windows OS concepts for user-mode analysis.",
      `Windows provides the environment games run in. Key structures:

- **PEB** (Process Environment Block) — process info, loaded modules
- **TEB** (Thread Environment Block) — thread-local storage, stack limits
- **Handles** — kernel object references (files, mutexes, threads)
- **NTDLL** — syscalls gateway to kernel

Games interact with Windows via Win32 APIs (kernel32, user32) which ultimately call into ntdll. Understanding this chain helps trace file I/O, registry access, and anti-debug checks.`,
      {
        difficulty: "intermediate",
        hours: 8,
        tags: ["windows", "internals", "peb", "teb"],
        docs: [
          res("win-internals", "Windows Internals Book", "https://learn.microsoft.com/en-us/sysinternals/resources/windows-internals", "book", "Russinovich's definitive reference"),
        ],
        videos: [
          res("yt-win-internals", "Windows Internals Lectures", "https://www.youtube.com/results?search_query=windows+internals+lecture", "video", "University and conference lectures"),
        ],
      }
    ),
    topicTemplate(
      "pe-files",
      "PE File Format",
      "Portable Executable structure — how Windows loads executables.",
      `PE files (.exe, .dll) contain:
- **DOS Header / NT Headers** — magic, machine type, entry point
- **Section Table** — .text, .data, .rdata, .rsrc sections
- **Import Table** — external DLL functions used
- **Export Table** — functions this module exposes
- **Relocations** — ASLR fixups

Tools: PE-bear, CFF Explorer, dumpbin. Parsing imports reveals API usage (e.g., DirectX, Winsock). Exports identify hookable functions in DLLs.`,
      {
        difficulty: "intermediate",
        prerequisites: ["process-memory"],
        hours: 6,
        tags: ["pe", "binary", "format"],
        docs: [
          res("pe-format", "Microsoft PE Format Specification", "https://learn.microsoft.com/en-us/windows/win32/debug/pe-format", "documentation", "Official PE specification"),
        ],
        resources: [
          res("pe-bear", "PE-bear", "https://github.com/hasherezade/pe-bear", "tool", "PE file analyzer GUI"),
        ],
        exercises: [
          "Parse imports of a game.exe and categorize API usage",
          "Identify the entry point and main sections",
          "Compare PE headers of x86 vs x64 binaries",
        ],
      }
    ),
    topicTemplate(
      "threads",
      "Threads & Concurrency",
      "How games use multiple threads and synchronization.",
      `Modern games use multiple threads: render thread, game logic, physics, audio, networking, job systems. Synchronization via:
- **Mutexes/Critical Sections**
- **Events & Semaphores**
- **Atomic operations**
- **Lock-free structures**

Race conditions and thread timing affect dynamic analysis — values may change between reads. Debuggers can switch thread context to follow execution.`,
      {
        difficulty: "intermediate",
        hours: 5,
        tags: ["threads", "concurrency", "sync"],
        docs: [
          res("ms-threads", "Windows Threads Documentation", "https://learn.microsoft.com/en-us/windows/win32/procthread/threads", "documentation", "Thread creation and management"),
        ],
        exercises: [
          "List all threads in a running game using Process Hacker",
          "Identify render vs logic thread in a simple engine",
          "Explain why memory scans can return different values per scan",
        ],
      }
    ),
    topicTemplate(
      "handles",
      "Handles & Kernel Objects",
      "Windows handle table and object management.",
      `Handles are indirect references to kernel objects. Games use handles for:
- Process/thread manipulation
- File and registry access
- Mutexes for single-instance checks
- Named pipes for IPC

Handle leak detection and handle table inspection (via Process Hacker or WinDbg) reveal resource usage patterns and anti-tamper mechanisms.`,
      {
        difficulty: "intermediate",
        prerequisites: ["windows-internals-intro"],
        hours: 4,
        tags: ["handles", "kernel", "windows"],
        docs: [
          res("ms-handles", "Windows Handles Overview", "https://learn.microsoft.com/en-us/windows/win32/sysinfo/handles-and-objects", "documentation", "Handle management docs"),
        ],
      }
    ),
    topicTemplate(
      "virtual-memory",
      "Virtual Memory",
      "Paging, address translation, and memory protection.",
      `Virtual memory gives each process a private address space. The MMU translates virtual → physical via page tables. Protection flags:
- **PAGE_READONLY**
- **PAGE_READWRITE**
- **PAGE_EXECUTE_READ**

ASLR randomizes load addresses. DEP/NX prevents executing data pages. Understanding protections explains why code injection targets executable regions.`,
      {
        difficulty: "intermediate",
        prerequisites: ["process-memory"],
        hours: 6,
        tags: ["virtual-memory", "paging", "aslr"],
        docs: [
          res("ms-virtual-mem", "Virtual Memory Functions", "https://learn.microsoft.com/en-us/windows/win32/memory/virtual-memory-functions", "documentation", "VirtualAlloc, VirtualProtect APIs"),
        ],
        exercises: [
          "Use VMMap to view memory protection flags",
          "Explain ASLR impact on pointer scanning",
          "Document VirtualProtect usage in a sample DLL",
        ],
      }
    ),
    topicTemplate(
      "dlls",
      "Dynamic Link Libraries (DLLs)",
      "DLL loading, injection concepts, and module analysis.",
      `DLLs are shared libraries loaded at runtime via:
- **Static import** — listed in PE import table
- **LoadLibrary** — dynamic loading at runtime
- **Manual mapping** — advanced loading without LoadLibrary

For educational analysis, study how games load plugin DLLs and how module enumeration (EnumProcessModules) reveals loaded code. Focus on understanding loading mechanisms for security research.`,
      {
        difficulty: "intermediate",
        prerequisites: ["pe-files"],
        hours: 6,
        tags: ["dll", "modules", "loading"],
        docs: [
          res("ms-dll", "DLL Documentation", "https://learn.microsoft.com/en-us/windows/win32/dlls/dynamic-link-libraries", "documentation", "Microsoft DLL guide"),
        ],
        resources: [
          res("github-dll-tutorial", "DLL Tutorial Examples", "https://github.com/carlosrafaelgn/WindowsDllTutorial", "github", "Educational DLL examples"),
        ],
      }
    ),
    topicTemplate(
      "apis",
      "Windows APIs (WinAPI)",
      "Essential Win32 APIs encountered in game binaries.",
      `Games heavily use subsets of WinAPI:

| Category | Common APIs |
|----------|------------|
| Memory | VirtualAlloc, VirtualQuery, ReadProcessMemory |
| Process | CreateThread, OpenProcess, GetModuleHandle |
| Graphics | DirectX COM interfaces, wgl/gl functions |
| Input | GetAsyncKeyState, Raw Input |
| Network | WSA*, send/recv via Winsock |
| Debug | IsDebuggerPresent, CheckRemoteDebuggerPresent |

API monitoring (API Monitor, x64dbg logging) reveals game behavior without source code.`,
      {
        difficulty: "intermediate",
        hours: 8,
        tags: ["winapi", "windows", "api"],
        docs: [
          res("ms-win32", "Win32 API Index", "https://learn.microsoft.com/en-us/windows/win32/api/", "documentation", "Complete Win32 API reference"),
        ],
        resources: [
          res("api-monitor", "API Monitor", "http://www.rohitab.com/apimonitor", "tool", "Log WinAPI calls in running processes"),
        ],
      }
    ),
    topicTemplate(
      "calling-conventions",
      "Calling Conventions",
      "How functions pass arguments and manage the stack.",
      `Calling conventions define argument order, stack cleanup, and register usage:

- **Microsoft x64** — RCX, RDX, R8, R9 + stack, shadow space
- **__cdecl** — caller cleans stack, C default (x86)
- **__stdcall** — callee cleans stack (WinAPI x86)
- **__fastcall** — first args in ECX/EDX (x86)
- **__vectorcall** — SIMD args in XMM registers

Misidentifying conventions leads to wrong argument analysis in decompilers. Set the correct convention in Ghidra/IDA for accurate signatures.`,
      {
        difficulty: "intermediate",
        prerequisites: ["x86", "stack"],
        hours: 5,
        tags: ["calling-convention", "abi", "stack"],
        docs: [
          res("ms-calling", "x64 Calling Convention", "https://learn.microsoft.com/en-us/cpp/build/x64-calling-convention", "documentation", "Microsoft convention details"),
        ],
        exercises: [
          "Identify calling convention of 5 functions in a game DLL",
          "Fix incorrect Ghidra function signatures",
          "Trace register arguments through 3 nested calls",
        ],
      }
    ),
    topicTemplate(
      "stack",
      "The Stack",
      "Stack frames, local variables, and return addresses.",
      `The stack grows downward. Each function call creates a **stack frame**:
1. Push return address (from \`call\`)
2. Push saved RBP (frame pointer)
3. Allocate local variables (sub RSP, N)
4. Epilogue reverses this, \`ret\` pops return address

Stack overflows, buffer overflows, and ROP chains are security topics. For RE, the stack reveals local variables, function arguments (when spilled), and call chains via backtraces.`,
      {
        difficulty: "intermediate",
        prerequisites: ["assembly-basics"],
        hours: 6,
        tags: ["stack", "frames", "memory"],
        exercises: [
          "Draw stack layout during a 3-level function call",
          "Use x64dbg to inspect stack locals",
          "Identify stack canaries in compiled code",
        ],
      }
    ),
    topicTemplate(
      "heap",
      "The Heap",
      "Dynamic memory allocation and heap structures.",
      `The heap manages dynamic allocations. Windows uses:
- **HeapAlloc/HeapFree** (process heap)
- **malloc/free** (CRT)
- **operator new/delete** (C++)

Heap allocators (RtlHeap, jemalloc, custom pools) have internal structures. Games often use custom allocators for performance. Heap analysis helps locate object instances and understand class layouts in memory.`,
      {
        difficulty: "intermediate",
        prerequisites: ["virtual-memory", "stack"],
        hours: 6,
        tags: ["heap", "allocation", "memory"],
        docs: [
          res("ms-heap", "Heap Functions", "https://learn.microsoft.com/en-us/windows/win32/memory/heap-functions", "documentation", "Windows heap API"),
        ],
        exercises: [
          "Trace operator new in a C++ game function",
          "Compare stack vs heap allocated objects",
          "Use CE to find heap-allocated player structures",
        ],
      }
    ),
  ],
};
