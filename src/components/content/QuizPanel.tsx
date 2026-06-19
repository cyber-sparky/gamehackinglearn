"use client";

import { useState } from "react";
import type { Topic } from "@/types";
import { getQuizForTopic, scoreQuiz } from "@/lib/quizzes";
import { useProgress } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import { CheckCircle2, HelpCircle } from "lucide-react";

export function QuizPanel({ topic }: { topic: Topic }) {
  const quiz = getQuizForTopic(topic);
  const { progress, setQuizScore, loaded } = useProgress();
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const existing = loaded ? progress.quizScores[topic.id] : undefined;
  const result = submitted ? scoreQuiz(quiz, answers) : null;

  const handleSubmit = () => {
    const scored = scoreQuiz(quiz, answers);
    setSubmitted(true);
    setQuizScore(topic.id, scored.percent);
  };

  return (
    <section id="quiz" className="mt-8 scroll-mt-24">
      <div className="mb-4 flex items-center gap-2">
        <HelpCircle className="h-5 w-5 text-accent" />
        <h2 className="text-xl font-semibold text-foreground">Topic Quiz</h2>
        {existing !== undefined && existing >= 80 && (
          <span className="flex items-center gap-1 text-sm text-success">
            <CheckCircle2 className="h-4 w-4" /> Passed ({existing}%)
          </span>
        )}
      </div>
      <div className="space-y-6 rounded-xl border border-border bg-card p-6">
        {quiz.questions.map((q, qi) => (
          <div key={q.id}>
            <p className="font-medium text-foreground">
              {qi + 1}. {q.question}
            </p>
            <div className="mt-3 space-y-2">
              {q.options.map((opt, oi) => {
                const selected = answers[q.id] === oi;
                const showResult = submitted;
                const isCorrect = oi === q.correctIndex;
                return (
                  <button
                    key={oi}
                    disabled={submitted}
                    onClick={() =>
                      setAnswers((prev) => ({ ...prev, [q.id]: oi }))
                    }
                    className={cn(
                      "block w-full rounded-lg border px-4 py-2.5 text-left text-sm transition-colors",
                      !showResult &&
                        selected &&
                        "border-accent bg-accent/10 text-foreground",
                      !showResult &&
                        !selected &&
                        "border-border text-muted hover:border-accent/30",
                      showResult &&
                        isCorrect &&
                        "border-success/50 bg-success/10 text-success",
                      showResult &&
                        selected &&
                        !isCorrect &&
                        "border-red-500/50 bg-red-500/10 text-red-400"
                    )}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
            {submitted && (
              <p className="mt-2 text-sm text-muted">{q.explanation}</p>
            )}
          </div>
        ))}
        {!submitted ? (
          <button
            onClick={handleSubmit}
            disabled={Object.keys(answers).length < quiz.questions.length}
            className="rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-hover disabled:opacity-50"
          >
            Submit Quiz
          </button>
        ) : (
          result && (
            <div
              className={cn(
                "rounded-lg border p-4",
                result.percent >= 80
                  ? "border-success/30 bg-success/5"
                  : "border-amber-500/30 bg-amber-500/5"
              )}
            >
              <p className="font-semibold text-foreground">
                Score: {result.correct}/{result.total} ({result.percent}%)
              </p>
              <p className="mt-1 text-sm text-muted">
                {result.percent >= 80
                  ? "Great work! You can mark this topic complete."
                  : "Review the topic and try again. Aim for 80% to pass."}
              </p>
              {result.percent < 80 && (
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setAnswers({});
                  }}
                  className="mt-3 text-sm text-accent hover:underline"
                >
                  Retry quiz
                </button>
              )}
            </div>
          )
        )}
      </div>
    </section>
  );
}
