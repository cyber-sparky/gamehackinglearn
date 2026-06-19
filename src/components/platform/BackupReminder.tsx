"use client";

import { useState } from "react";
import { useProgress } from "@/lib/hooks";
import { Download, X } from "lucide-react";
import { downloadUserData } from "@/lib/export-data";
import Link from "next/link";

export function BackupReminder() {
  const { progress, loaded, dismissBackupReminder, acknowledgePlatformTips } =
    useProgress();
  const [dismissed, setDismissed] = useState(false);

  if (!loaded || dismissed) return null;

  const month = new Date().toISOString().slice(0, 7);
  const showBackup =
    progress.completedTopics.length >= 3 &&
    progress.backupReminderMonth !== month;
  const showTips = !progress.platformTipsSeen;

  if (!showBackup && !showTips) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm rounded-xl border border-border bg-card p-4 shadow-xl">
      <button
        type="button"
        onClick={() => {
          if (showBackup) dismissBackupReminder();
          if (showTips) acknowledgePlatformTips();
          setDismissed(true);
        }}
        className="absolute right-2 top-2 rounded p-1 text-muted hover:bg-muted-bg"
        aria-label="Dismiss"
      >
        <X className="h-4 w-4" />
      </button>
      {showTips && (
        <>
          <p className="pr-6 text-sm font-medium text-foreground">
            Progress stays in this browser
          </p>
          <p className="mt-1 text-xs text-muted">
            Export a backup from the dashboard so you don&apos;t lose notes,
            quiz scores, or mastery progress.
          </p>
        </>
      )}
      {showBackup && (
        <div className={showTips ? "mt-3 border-t border-border pt-3" : ""}>
          <p className="text-sm font-medium text-foreground">Monthly backup</p>
          <button
            type="button"
            onClick={() => {
              downloadUserData();
              dismissBackupReminder();
              setDismissed(true);
            }}
            className="mt-2 inline-flex items-center gap-1 text-sm text-accent hover:underline"
          >
            <Download className="h-3.5 w-3.5" />
            Export now
          </button>
        </div>
      )}
      <Link
        href="/disclaimer"
        className="mt-2 block text-xs text-muted hover:text-accent"
      >
        Educational use policy →
      </Link>
    </div>
  );
}
