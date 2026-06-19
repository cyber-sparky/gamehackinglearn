import type { Section } from "@/types";
import { res, topicTemplate } from "../helpers";

export const antiCheatSection: Section = {
  id: "anti-cheat",
  slug: "anti-cheat",
  title: "Anti-Cheat Research",
  description: "Understanding anti-cheat architecture for defensive security research. Educational focus only — no bypass instructions.",
  icon: "Shield",
  order: 11,
  topics: [
    topicTemplate("usermode-ac", "User-Mode Anti-Cheats", "Ring 3 detection techniques.", "User-mode AC runs in process or as separate service:\n- Module enumeration\n- Memory integrity checks\n- Window/process scanning\n- Hook detection on game modules\n- Screenshot/hash verification\n\nResearch goal: understand attack surface for defensive hardening.", { difficulty: "intermediate", hours: 8, tags: ["anti-cheat", "usermode"] }),
    topicTemplate("kernelmode-ac", "Kernel-Mode Anti-Cheats", "Ring 0 drivers and callbacks.", "Kernel AC via signed drivers:\n- ObRegisterCallbacks (handle stripping)\n- PsSetCreateProcessNotifyRoutine\n- Image load notify callbacks\n- Minifilter for file integrity\n- IOCTL heartbeat with usermode component\n\nStudy in VM with driver logging.", { difficulty: "expert", hours: 15, tags: ["anti-cheat", "kernel"], prerequisites: ["drivers"] }),
    topicTemplate("integrity-checks", "Integrity Checks", "Code and memory integrity verification.", "Techniques:\n- CRC/hash of code sections\n- Canary values in data\n- Periodic re-scanning\n- Server-side validation\n\nDefense: server authority, encrypted protocols, attestation.", { difficulty: "advanced", hours: 6, tags: ["integrity", "security"] }),
    topicTemplate("driver-communication", "Driver Communication", "User/kernel IPC in AC systems.", "Common patterns:\n- IOCTL via DeviceIoControl\n- Shared memory sections\n- Filter communication ports\n- Named pipes\n\nAnalyze with IRP logging in WinDbg (research VMs).", { difficulty: "expert", hours: 8, tags: ["driver", "ipc"], prerequisites: ["drivers"] }),
    topicTemplate("detection-techniques", "Detection Techniques Overview", "Catalog of detection methods for researchers.", "Categories:\n- **Behavioral** — impossible actions, statistics\n- **Environmental** — known tools, debugger presence\n- **Integrity** — modified code/memory\n- **Network** — anomalous packets\n- **Hardware** — HWID tracking\n\nFocus: how to *design* secure systems, not evade them.", { difficulty: "advanced", hours: 10, tags: ["detection", "research"] }),
  ],
};
