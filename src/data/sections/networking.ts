import type { RawSection } from "@/types";
import { res, topicTemplate } from "../helpers";

export const networkingSection: RawSection = {
  id: "networking",
  slug: "networking",
  title: "Networking",
  description: "Game network protocols and packet analysis.",
  icon: "Network",
  order: 12,
  topics: [
    topicTemplate("tcp-udp", "TCP & UDP", "Transport protocols in multiplayer games.", "TCP — reliable, ordered (login, chat, file transfer)\nUDP — fast, unreliable (position updates, shots)\n\nGames often use UDP with custom reliability layers.", { difficulty: "beginner", hours: 4, tags: ["tcp", "udp", "networking"] }),
    topicTemplate("packet-structures", "Packet Structures", "Designing and reverse engineering packet layouts.", "Typical packet: header (opcode, size, sequence) + payload.\n\nRE workflow: capture → identify patterns → correlate with game actions → map fields.", { difficulty: "intermediate", hours: 8, tags: ["packets", "protocol"] }),
    topicTemplate("serialization", "Serialization", "How games encode data for network.", "Common formats: protobuf, flatbuffers, bitstreams, custom binary. Look for serialize/deserialize functions via strings and xrefs.", { difficulty: "intermediate", hours: 6, tags: ["serialization"] }),
    topicTemplate("protocol-analysis", "Protocol Analysis", "Full protocol RE workflow.", "Tools: Wireshark (with dissectors), WPE Pro (legacy), custom parsers.\n\nPractice on open-source multiplayer games with documented protocols.", { difficulty: "advanced", hours: 12, tags: ["protocol", "analysis"], resources: [res("wireshark", "Wireshark", "https://www.wireshark.org/", "tool", "Network protocol analyzer")], labs: ["lab-packet-analysis"] }),
  ],
};
