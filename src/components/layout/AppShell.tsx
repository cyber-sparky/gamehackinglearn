"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { PlatformFooter } from "./PlatformFooter";
import { cn } from "@/lib/utils";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <div className={cn("lg:block", mobileOpen ? "block" : "hidden lg:block")}>
        <Sidebar
          collapsed={collapsed}
          onToggle={() => setCollapsed((c) => !c)}
          onNavigate={() => setMobileOpen(false)}
        />
      </div>

      <div
        className={cn(
          "flex min-h-screen flex-col transition-all duration-300",
          collapsed ? "lg:ml-16" : "lg:ml-64"
        )}
      >
        <div className="flex items-center gap-3 border-b border-border px-4 lg:hidden">
          <button
            onClick={() => setMobileOpen((o) => !o)}
            className="rounded-lg p-2 text-muted hover:bg-muted-bg"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <span className="text-sm font-bold text-foreground">
            Game Hacking Roadmap
          </span>
        </div>
        <Header />
        <main className="flex flex-1 flex-col p-4 md:p-6">
          {children}
          <PlatformFooter />
        </main>
      </div>
    </div>
  );
}
