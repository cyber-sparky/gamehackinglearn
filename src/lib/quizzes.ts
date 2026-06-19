import type { Topic, TopicQuizQuestion } from "@/types";
import quizOverrides from "@/data/quizzes.json";

const overrides = quizOverrides as Record<string, TopicQuizQuestion[]>;

function contextualQuestions(topic: Topic): TopicQuizQuestion[] {
  const obj = topic.learningObjectives[0] ?? topic.description;
  const mistake = topic.commonMistakes[0] ?? "skipping hands-on practice";
  const tag = topic.tags[0] ?? "research";

  return [
    {
      id: `${topic.id}-ctx1`,
      question: `What is the main focus of "${topic.title}"?`,
      options: [
        topic.description.slice(0, 80) + (topic.description.length > 80 ? "…" : ""),
        "Bypassing live multiplayer anti-cheat",
        "Replacing all tools with one script",
        "Avoiding documentation entirely",
      ],
      correctIndex: 0,
      explanation: topic.whyItMatters.slice(0, 200),
    },
    {
      id: `${topic.id}-ctx2`,
      question: `Which learning objective fits ${topic.title}?`,
      options: [
        obj,
        "Memorize offsets without verification",
        "Test only on production games",
        "Skip prerequisite topics",
      ],
      correctIndex: 0,
      explanation: "Learning objectives define measurable outcomes for this topic.",
    },
    {
      id: `${topic.id}-ctx3`,
      question: `A common mistake when studying ${topic.title} is:`,
      options: [
        mistake,
        "Using isolated VMs for practice",
        "Documenting reproduction steps",
        "Reading official tool documentation",
      ],
      correctIndex: 0,
      explanation: "Avoiding listed common mistakes speeds up real skill acquisition.",
    },
    {
      id: `${topic.id}-ctx4`,
      question: `The tag "${tag}" for this topic suggests it relates to:`,
      options: [
        `${tag} concepts in game RE workflows`,
        "Unrelated web development only",
        "Hardware GPU driver signing",
        "Mobile iOS SwiftUI",
      ],
      correctIndex: 0,
      explanation: `Topic tags group related skills — ${topic.tags.slice(0, 3).join(", ")}.`,
    },
  ];
}

function genericQuestions(topic: Topic): TopicQuizQuestion[] {
  return [
    {
      id: `${topic.id}-q1`,
      question: `What is the primary purpose of learning "${topic.title}"?`,
      options: [
        "To bypass online game anti-cheat in production",
        "To build foundational skills for isolated lab research",
        "To replace all debugging tools with one technique",
        "To avoid reading documentation",
      ],
      correctIndex: 1,
      explanation:
        "All content on this platform is for educational research in isolated lab environments.",
    },
    {
      id: `${topic.id}-q2`,
      question: `Which practice best reinforces ${topic.title}?`,
      options: [
        "Read only without hands-on practice",
        "Use isolated VMs and document reproduction steps",
        "Test techniques on live multiplayer games",
        "Skip prerequisites to save time",
      ],
      correctIndex: 1,
      explanation:
        "Hands-on lab work with documentation is the core learning methodology.",
    },
    {
      id: `${topic.id}-q3`,
      question: `Before advancing past ${topic.title}, you should:`,
      options: [
        "Complete prerequisites and linked labs if available",
        "Memorize every API without context",
        "Ignore common mistakes listed in the topic",
        "Avoid taking notes",
      ],
      correctIndex: 0,
      explanation:
        "Prerequisites and labs exist to ensure concepts stack correctly.",
    },
  ];
}

export function getQuizForTopic(topic: Topic) {
  const questions =
    overrides[topic.id] ??
    (topic.learningObjectives.length >= 2
      ? contextualQuestions(topic)
      : genericQuestions(topic));
  return { topicId: topic.id, questions };
}

export function scoreQuiz(
  quiz: { questions: TopicQuizQuestion[] },
  answers: Record<string, number>
) {
  let correct = 0;
  for (const q of quiz.questions) {
    if (answers[q.id] === q.correctIndex) correct++;
  }
  const percent = Math.round((correct / quiz.questions.length) * 100);
  return { correct, total: quiz.questions.length, percent };
}
