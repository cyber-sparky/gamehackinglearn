import { setStoreSnapshot } from "@/lib/storage";
import { storage } from "@/lib/storage";
import type { ExportedUserData } from "@/types";

export function exportUserData(): ExportedUserData {
  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    progress: storage.getProgress(),
    bookmarks: storage.getBookmarks(),
    notes: storage.getNotes(),
    ratings: storage.getRatings(),
    onboarding: storage.getOnboarding(),
  };
}

export function downloadUserData(): void {
  const data = exportUserData();
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `game-hacking-roadmap-backup-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function importUserData(json: string): ExportedUserData {
  const parsed = JSON.parse(json) as ExportedUserData;
  if (parsed.version !== 1) {
    throw new Error("Unsupported backup version");
  }
  storage.setProgress({ ...storage.getProgress(), ...parsed.progress });
  storage.setBookmarks(parsed.bookmarks);
  storage.setNotes(parsed.notes);
  storage.setRatings(parsed.ratings);
  storage.setOnboarding(parsed.onboarding);
  setStoreSnapshot("progress", storage.getProgress());
  setStoreSnapshot("bookmarks", parsed.bookmarks);
  setStoreSnapshot("notes", parsed.notes);
  setStoreSnapshot("ratings", parsed.ratings);
  setStoreSnapshot("onboarding", parsed.onboarding);
  return parsed;
}
