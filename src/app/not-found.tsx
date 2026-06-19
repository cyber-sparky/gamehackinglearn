import Link from "next/link";
import { Search, BookOpen, LayoutDashboard } from "lucide-react";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-lg py-16 text-center">
      <p className="text-6xl font-bold text-accent">404</p>
      <h1 className="mt-4 text-2xl font-bold text-foreground">Page not found</h1>
      <p className="mt-2 text-muted">
        This topic or page doesn&apos;t exist. Try search or start from Foundation.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/sections/foundation"
          className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white"
        >
          <BookOpen className="h-4 w-4" />
          Foundation
        </Link>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm"
        >
          <LayoutDashboard className="h-4 w-4" />
          Dashboard
        </Link>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm"
        >
          <Search className="h-4 w-4" />
          Home
        </Link>
      </div>
    </div>
  );
}
