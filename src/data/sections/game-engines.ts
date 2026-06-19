import type { RawSection } from "@/types";
import { res, topicTemplate } from "../helpers";

export const gameEnginesSection: RawSection = {
  id: "game-engines",
  slug: "game-engines",
  title: "Game Engines",
  description: "Engine-specific architecture and analysis approaches.",
  icon: "Gamepad2",
  order: 9,
  topics: [
    topicTemplate("unity-il2cpp", "Unity IL2CPP", "IL2CPP build pipeline and analysis.", "IL2CPP converts Unity scripts to C++ then native code. Analysis workflow:\n1. Locate global-metadata.dat and GameAssembly.dll\n2. Use Il2CppDumper for types/methods\n3. Load script.json in Ghidra/IDA\n4. Map managed names to native functions", { difficulty: "advanced", hours: 12, tags: ["unity", "il2cpp"], resources: [res("il2cppdumper", "Il2CppDumper", "https://github.com/Perfare/Il2CppDumper", "tool", "Dump IL2CPP metadata")] }),
    topicTemplate("unity-mono", "Unity Mono", "Mono runtime analysis.", "Mono builds embed metadata in Assembly-CSharp.dll. Tools: dnSpy, ILSpy, CE Mono dissect.\n\nEasier than IL2CPP — managed code can be decompiled to readable C#.", { difficulty: "intermediate", hours: 8, tags: ["unity", "mono"], resources: [res("dnspy", "dnSpy", "https://github.com/dnSpy/dnSpy", "tool", ".NET debugger and decompiler")] }),
    topicTemplate("unity-assets", "Unity Asset Extraction", "Extracting and analyzing Unity assets.", "Assets in sharedassets*.assets, bundles. Tools: AssetStudio, UABE.\n\nUseful for understanding game data structures, textures, prefab hierarchies.", { difficulty: "intermediate", hours: 4, tags: ["unity", "assets"], resources: [res("assetstudio", "AssetStudio", "https://github.com/Perfare/AssetStudio", "tool", "Unity asset extractor")] }),
    topicTemplate("unreal-uobject", "Unreal UObject System", "UObject, UClass, and reflection.", "All Unreal objects inherit UObject. GNames/GObjects arrays locate class info. UProperty system describes fields.\n\nSDK generators parse these arrays for typed offsets.", { difficulty: "advanced", hours: 15, tags: ["unreal", "uobject"] }),
    topicTemplate("unreal-sdk", "Unreal SDK Generation", "Generating SDKs from game dumps.", "Workflow: dump GNames/GObjects → parse with dumper → generate C++ headers with offsets.\n\nUnderstand padding, inheritance, and property types for accurate layouts.", { difficulty: "advanced", hours: 10, tags: ["unreal", "sdk"], prerequisites: ["unreal-uobject"] }),
    topicTemplate("unreal-blueprints", "Unreal Blueprints", "Visual scripting VM analysis.", "Blueprints compile to bytecode executed by UE VM. Harder to analyze than C++ but strings and UFunction names help locate logic.", { difficulty: "advanced", hours: 6, tags: ["unreal", "blueprints"] }),
    topicTemplate("source-entities", "Source Engine Entity System", "Entities, datamaps, and netvars.", "Source uses CBaseEntity hierarchy. Datamaps describe networked fields. Netvar dumps via interfaces reveal offsets.\n\nPractice on CS:GO/TF2 open SDK references.", { difficulty: "intermediate", hours: 8, tags: ["source", "entities"], resources: [res("csgo-sdk", "CS:GO SDK (reference)", "https://github.com/perilouswithadeofbread/csgo-sdk", "github", "Community SDK reference")] }),
    topicTemplate("source-networking", "Source Engine Networking", "Net channels, prediction, and lag compensation.", "Source networking: server authority, client prediction, interpolation. Study net_graph, cl_showpos for understanding.\n\nFocus on protocol analysis for security research.", { difficulty: "advanced", hours: 8, tags: ["source", "networking"], prerequisites: ["source-entities"] }),
  ],
};
