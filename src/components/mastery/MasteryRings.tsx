"use client";

import { BookOpen, HelpCircle, FlaskConical } from "lucide-react";
import type { TopicMasteryState } from "@/types";
import { cn } from "@/lib/utils";

function Ring({
  label,
  done,
  percent,
  icon: Icon,
}: {
  label: string;
  done: boolean;
  percent: number | null;
  icon: typeof BookOpen;
}) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className={cn(
          "flex h-12 w-12 items-center justify-center rounded-full border-2 transition-colors",
          done
            ? "border-success bg-success/10 text-success"
            : "border-border bg-muted-bg/50 text-muted"
        )}
      >
        <Icon className="h-5 w-5" />
      </div>
      <span className="text-xs font-medium text-foreground">{label}</span>
      <span className="text-xs text-muted">
        {percent !== null ? `${percent}%` : "—"}
      </span>
    </div>
  );
}

export function MasteryRings({ mastery }: { mastery: TopicMasteryState }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-foreground">Mastery Progress</h2>
        {mastery.mastered && (
          <span className="rounded-full bg-success/10 px-2 py-0.5 text-xs font-medium text-success">
            Mastered
          </span>
        )}
      </div>
      <div className="mt-4 flex justify-around">
        <Ring
          label="Read"
          done={mastery.read}
          percent={mastery.readPercent}
          icon={BookOpen}
        />
        <Ring
          label="Quiz"
          done={mastery.quiz}
          percent={mastery.quizPercent}
          icon={HelpCircle}
        />
        <Ring
          label={mastery.hasLab ? "Lab" : "Lab (N/A)"}
          done={mastery.lab}
          percent={mastery.hasLab ? mastery.labPercent : null}
          icon={FlaskConical}
        />
      </div>
      <p className="mt-3 text-center text-xs text-muted">
        Complete all three rings to earn mastery (or mark complete manually)
      </p>
    </div>
  );
}
