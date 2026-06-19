"use client";

import { useRef, useState } from "react";
import { Download, Upload, AlertCircle, CheckCircle2 } from "lucide-react";
import { downloadUserData, importUserData } from "@/lib/export-data";

export function ProgressExportImport() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleImport = async (file: File) => {
    try {
      const text = await file.text();
      importUserData(text);
      setStatus("success");
      setMessage("Backup restored successfully. Refresh if data looks stale.");
    } catch (e) {
      setStatus("error");
      setMessage(e instanceof Error ? e.message : "Import failed");
    }
  };

  return (
    <section className="rounded-xl border border-border bg-card p-6">
      <h2 className="text-lg font-semibold text-foreground">Backup & Restore</h2>
      <p className="mt-1 text-sm text-muted">
        Export progress, notes, bookmarks, and quiz scores as JSON. Import on
        another device or after clearing browser data.
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => downloadUserData()}
          className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-hover"
        >
          <Download className="h-4 w-4" />
          Export backup
        </button>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted-bg"
        >
          <Upload className="h-4 w-4" />
          Import backup
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="application/json,.json"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleImport(file);
            e.target.value = "";
          }}
        />
      </div>
      {status !== "idle" && (
        <p
          className={`mt-3 flex items-center gap-2 text-sm ${
            status === "success" ? "text-success" : "text-destructive"
          }`}
        >
          {status === "success" ? (
            <CheckCircle2 className="h-4 w-4" />
          ) : (
            <AlertCircle className="h-4 w-4" />
          )}
          {message}
        </p>
      )}
    </section>
  );
}
