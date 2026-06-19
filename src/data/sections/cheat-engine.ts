import type { RawSection } from "@/types";
import { res, topicTemplate } from "../helpers";

export const cheatEngineSection: RawSection = {
  id: "cheat-engine",
  slug: "cheat-engine",
  title: "Cheat Engine Mastery",
  description: "Complete Cheat Engine workflow for educational game analysis.",
  icon: "Target",
  order: 8,
  topics: [
    topicTemplate("exact-scans", "Exact Value Scans", "Finding known values in memory.", "Start with exact scan for known values (health=100, ammo=30). Change value in game, scan again. Repeat until few addresses remain.\n\nFilter by writable, exclude code regions.", { difficulty: "beginner", hours: 3, tags: ["cheat-engine", "scanning"], labs: ["lab-ce-health-scan"] }),
    topicTemplate("unknown-scans", "Unknown Value Scans", "Finding values when you don't know the exact number.", "Use unknown initial value, then changed/unchanged/increased/decreased after game events. Essential for hidden stats, coordinates, timers.", { difficulty: "beginner", hours: 4, tags: ["cheat-engine", "scanning"] }),
    topicTemplate("pointer-scanning", "Pointer Scanning", "Finding stable pointer paths.", "After finding dynamic address, run pointer scan with max level 4-7. Rescan after restart to filter stable paths. Save .PTR files for reuse.", { difficulty: "intermediate", hours: 6, tags: ["pointers", "cheat-engine"], labs: ["lab-ce-pointer"] }),
    topicTemplate("structure-dissect", "Structure Dissect", "Building data structures in CE.", "Use 'Dissect data/structures' to map fields. Change values in-game and watch offsets change. Group related fields into named structures.", { difficulty: "intermediate", hours: 5, tags: ["structures", "cheat-engine"] }),
    topicTemplate("mono-features", "Mono/Unity Features", "Analyzing Unity Mono games in CE.", "CE Mono features:\n- Dissect mono domain\n- Browse classes and fields\n- Find instances of class types\n\nFor IL2CPP games, use Il2CppDumper + CE together.", { difficulty: "intermediate", hours: 6, tags: ["unity", "mono", "cheat-engine"] }),
    topicTemplate("lua-scripting", "Lua Scripting in CE", "Automating scans and analysis with Lua.", "CE supports Lua for automation:\n- Auto-attach and scan\n- Timer-based value monitoring\n- Custom UI forms\n\nLearn CE Lua API from wiki. Use for repetitive research tasks only.", { difficulty: "intermediate", hours: 8, tags: ["lua", "automation"], resources: [res("ce-lua", "CE Lua Documentation", "https://wiki.cheatengine.org/", "documentation", "Cheat Engine Lua API")] }),
  ],
};
