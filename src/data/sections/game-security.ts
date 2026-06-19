import type { Section } from "@/types";
import { res, topicTemplate } from "../helpers";

export const gameSecuritySection: Section = {
  id: "game-security",
  slug: "game-security",
  title: "Game Security Research",
  description: "Client trust, authority models, and secure game design.",
  icon: "Lock",
  order: 13,
  topics: [
    topicTemplate("client-trust", "Client Trust Issues", "Why clients cannot be trusted.", "Any data on the client can be modified. Never trust:\n- Position, health, inventory (authoritative on server)\n- Timestamps from client\n- Claimed hit results\n\nDesign: server validates all critical actions.", { difficulty: "intermediate", hours: 4, tags: ["security", "client-trust"] }),
    topicTemplate("economy-abuse", "Economy Abuse", "Virtual economy exploitation case studies.", "Cases: duplicated items, price manipulation, currency generation via logic bugs.\n\nPrevention: server-side transactions, audit logs, rate limiting.", { difficulty: "intermediate", hours: 5, tags: ["economy", "abuse"] }),
    topicTemplate("logic-flaws", "Logic Flaws", "Game logic vulnerabilities.", "Examples: race conditions in trading, integer overflow in damage calc, state machine bypass.\n\nMethodology: threat modeling, fuzzing game actions, code review.", { difficulty: "advanced", hours: 8, tags: ["logic", "vulnerabilities"] }),
    topicTemplate("authority-models", "Authority Models", "Client-server authority patterns.", "Models:\n- **Server authoritative** — gold standard for competitive\n- **Client authoritative** — acceptable for co-op casual\n- **Hybrid** — client prediction + server reconciliation\n\nSource: Gabriel Gambetta's networked physics articles.", { difficulty: "intermediate", hours: 6, tags: ["authority", "networking"], resources: [res("gambetta", "Gabriel Gambetta — Game Networking", "https://gabrielgambetta.com/client-server-game-architecture.html", "article", "Authoritative networking explained")] }),
    topicTemplate("secure-design", "Secure Game Design", "Building cheat-resistant game systems.", "Principles:\n- Server validates everything critical\n- Obscurity is not security\n- Encrypt + authenticate packets\n- Behavioral analysis and reporting\n- Regular security audits", { difficulty: "advanced", hours: 8, tags: ["design", "security"] }),
  ],
};
