import type { Section } from "@/types";
import { res, topicTemplate } from "../helpers";

export const assemblySection: Section = {
  id: "assembly",
  slug: "assembly",
  title: "Assembly",
  description: "Deep dive into x86/x64 assembly for game reverse engineering.",
  icon: "Cpu",
  order: 4,
  topics: [
    topicTemplate("registers", "Registers", "General purpose, segment, and flags registers.", "x64 GPRs: RAX (accumulator), RBX (base), RCX (counter/arg1), RDX (data/arg2), RSI/RDI (source/dest index), RBP (frame pointer), RSP (stack pointer), R8-R15 (extended).\n\nSpecial: RIP (instruction pointer), RFLAGS (ZF, CF, SF, OF). SIMD: XMM0-XMM15 for SSE/AVX.", { difficulty: "beginner", hours: 4, tags: ["registers", "x64"] }),
    topicTemplate("instructions", "Instructions Deep Dive", "Instruction categories and encoding basics.", "Categories: data transfer, arithmetic, logic, shift/rotate, control transfer, string ops, SIMD.\n\nPrefixes modify behavior (REX for 64-bit, LOCK for atomics). ModR/M byte encodes operands.", { difficulty: "intermediate", hours: 10, tags: ["instructions"], prerequisites: ["registers"], resources: [res("felix", "Felix Cloutier x86 Reference", "https://www.felixcloutier.com/x86/", "documentation", "Instruction reference")] }),
    topicTemplate("stack-frames", "Stack Frames", "Prologue, epilogue, and frame pointers.", "Typical x64 prologue:\n```asm\npush rbp\nmov rbp, rsp\nsub rsp, 0x40\n```\nLocal variables at `[rbp-0x10]`. With optimizations, RBP may be omitted — use RSP-relative addressing.", { difficulty: "intermediate", hours: 6, tags: ["stack", "frames"], prerequisites: ["stack"] }),
    topicTemplate("function-calls", "Function Calls", "call/ret, tail calls, and thunks.", "`call` pushes return address and jumps. `ret` pops into RIP. Tail call optimization reuses stack frame. Import thunks jump through IAT entries.", { difficulty: "intermediate", hours: 5, tags: ["calls", "functions"], prerequisites: ["calling-conventions"] }),
    topicTemplate("jump-instructions", "Jump Instructions", "Conditional and unconditional jumps.", "Unconditional: jmp. Conditional: je/jz, jne/jnz, jg, jl, ja, jb (based on flags). Loops: loop, jecxz (rare in modern code). Switch: jump table via `jmp [reg*8+disp]`.", { difficulty: "intermediate", hours: 4, tags: ["jumps", "control-flow"] }),
    topicTemplate("memory-addressing", "Memory Addressing Modes", "Effective address calculation.", "Forms: `[base + index*scale + displacement]`. RIP-relative common in x64: `[rip+0x1234]`. LEA computes addresses without memory access.", { difficulty: "intermediate", hours: 5, tags: ["addressing", "memory"] }),
    topicTemplate("simd", "SIMD Instructions", "SSE, AVX for vector math in games.", "Games use SIMD for physics, graphics, audio. XMM registers hold 128-bit vectors. Instructions: movaps, addps, mulps, shufps.\n\nRecognize SIMD-heavy functions by XMM register usage.", { difficulty: "advanced", hours: 8, tags: ["simd", "sse", "avx"], prerequisites: ["instructions"] }),
  ],
};
