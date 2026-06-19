import type { RawSection } from "@/types";
import { topicTemplate } from "../helpers";

export const windowsInternalsSection: RawSection = {
  id: "windows-internals",
  slug: "windows-internals",
  title: "Windows Internals",
  description: "Deep Windows OS knowledge for security and RE research.",
  icon: "Monitor",
  order: 6,
  topics: [
    topicTemplate("processes", "Processes", "EPROCESS, process creation, and enumeration.", "Each process has an EPROCESS kernel structure. User-mode sees PID, handles, PEB. Tools: Process Explorer, NtQueryInformationProcess.\n\nGames may enumerate processes for integrity checks — understand detection from a defensive research perspective.", { difficulty: "intermediate", hours: 6, tags: ["process", "eprocess"] }),
    topicTemplate("threads-deep", "Threads Deep Dive", "ETHREAD, scheduling, and TLS.", "Threads share process address space but have unique stacks and TEBs. Thread Local Storage (TLS) slots store per-thread data accessed via fs:[0x58] (x64 TEB offset).", { difficulty: "intermediate", hours: 5, tags: ["threads", "ethread"], prerequisites: ["threads"] }),
    topicTemplate("peb", "Process Environment Block (PEB)", "PEB structure and module list traversal.", "PEB contains:\n- ImageBaseAddress\n- Ldr (PEB_LDR_DATA) — loaded module linked lists\n- BeingDebugged flag\n- ProcessParameters\n\nReading PEB via GS:[0x60] (x64) reveals loaded DLLs without API calls.", { difficulty: "advanced", hours: 6, tags: ["peb", "internals"] }),
    topicTemplate("teb", "Thread Environment Block (TEB)", "TEB layout and thread-local data.", "TEB accessed via GS segment register (x64). Contains stack bounds, last error, TLS array, SEH chain (x86). Useful for identifying current thread context in dumps.", { difficulty: "advanced", hours: 4, tags: ["teb", "internals"] }),
    topicTemplate("syscalls", "System Calls", "User-mode to kernel transition.", "ntdll exports Nt/Zw functions that execute `syscall` instruction with service number in EAX. Direct syscalls bypass hooked ntdll (research topic for EDR analysis).\n\nStudy syscall tables for understanding API monitoring evasion *detection*.", { difficulty: "advanced", hours: 8, tags: ["syscall", "ntdll"] }),
    topicTemplate("handles-deep", "Handles Deep Dive", "Object manager and handle tables.", "Kernel object manager tracks all handles. DuplicateHandle, CloseHandle semantics. Handle grants access per ACL/security descriptor.", { difficulty: "advanced", hours: 5, tags: ["handles", "kernel"], prerequisites: ["handles"] }),
    topicTemplate("drivers", "Windows Drivers", "Kernel-mode driver basics for AC research.", "Drivers run in ring 0 with full system access. Anti-cheat drivers monitor user-mode via callbacks (PsSetCreateProcessNotifyRoutine, ObRegisterCallbacks).\n\nResearch focus: understand callback architecture, IOCTL communication, driver signing.", { difficulty: "expert", hours: 15, tags: ["drivers", "kernel"] }),
    topicTemplate("kernel-basics", "Kernel Basics", "Ring 0/3, IRQL, and kernel debugging intro.", "CPU privilege rings: ring 3 (user), ring 0 (kernel). IRQL manages interrupt priority. Kernel debugging via WinDbg + VM for driver/AC research.\n\nAlways research in isolated VMs.", { difficulty: "expert", hours: 12, tags: ["kernel", "ring0"], prerequisites: ["drivers"] }),
  ],
};
