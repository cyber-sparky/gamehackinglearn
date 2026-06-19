import Link from "next/link";

export function PlatformFooter() {
  return (
    <footer className="mt-auto border-t border-border pt-6 pb-2 text-center text-xs text-muted">
      <p>
        Educational research only · Use isolated VMs ·{" "}
        <Link href="/disclaimer" className="text-accent hover:underline">
          Disclaimer
        </Link>
        {" · "}
        <Link href="/glossary" className="text-accent hover:underline">
          Glossary
        </Link>
      </p>
      <p className="mt-1">Progress is stored locally in your browser.</p>
    </footer>
  );
}
