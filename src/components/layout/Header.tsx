"use client";

import { useEffect, useState } from "react";
import { SearchTrigger, SearchModal } from "@/components/ui/SearchModal";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-background/80 px-6 backdrop-blur-md">
        <div className="flex-1">
          <SearchTrigger
            onClick={() => setSearchOpen(true)}
            className="max-w-md"
          />
        </div>
        <ThemeToggle />
      </header>
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
