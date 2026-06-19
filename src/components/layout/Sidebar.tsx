"use client";

import { useState } from "react";
import {
  Home,
  Layers,
  Code2,
  Search,
  Cpu,
  Bug,
  Monitor,
  MemoryStick,
  Target,
  Gamepad2,
  Palette,
  Shield,
  Network,
  Lock,
  Wrench,
  Library,
  FlaskConical,
  Map,
  Bookmark,
  BarChart3,
  LayoutDashboard,
  Route,
  GitBranch,
  Code,
  Video,
  Download,
  FileSearch,
  StickyNote,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  GraduationCap,
  Brain,
  BookMarked,
  Table,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { navGroups } from "@/data";

const iconMap: Record<string, LucideIcon> = {
  Home,
  Layers,
  Code2,
  Search,
  Cpu,
  Bug,
  Monitor,
  MemoryStick,
  Target,
  Gamepad2,
  Palette,
  Shield,
  Network,
  Lock,
  Wrench,
  Library,
  FlaskConical,
  Map,
  Bookmark,
  BarChart3,
  LayoutDashboard,
  Route,
  GitBranch,
  Code,
  Video,
  Download,
  FileSearch,
  StickyNote,
  GraduationCap,
  Brain,
  BookMarked,
  Table,
};

export function Sidebar({
  collapsed,
  onToggle,
  onNavigate,
}: {
  collapsed: boolean;
  onToggle: () => void;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    sections: true,
  });

  const toggleGroup = (id: string) => {
    setOpenGroups((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 flex h-full flex-col border-r border-border bg-sidebar transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex h-16 items-center justify-between border-b border-border px-4">
        {!collapsed && (
          <Link href="/" className="flex flex-col">
            <span className="text-sm font-bold text-foreground">GHR</span>
            <span className="text-[10px] text-muted">0 → Hero</span>
          </Link>
        )}
        <button
          onClick={onToggle}
          className="rounded-md p-1.5 text-muted hover:bg-sidebar-hover hover:text-foreground"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>
      </div>
      <nav className="flex-1 overflow-y-auto p-2">
        {navGroups.map((group) => {
          const isCollapsible = group.collapsible && !collapsed;
          const isOpen = openGroups[group.id] !== false;

          return (
            <div key={group.id} className="mb-3">
              {!collapsed && (
                <button
                  type="button"
                  onClick={() => isCollapsible && toggleGroup(group.id)}
                  className={cn(
                    "mb-1 flex w-full items-center justify-between px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted",
                    isCollapsible && "hover:text-foreground"
                  )}
                >
                  {group.label}
                  {isCollapsible && (
                    <ChevronDown
                      className={cn(
                        "h-3 w-3 transition-transform",
                        !isOpen && "-rotate-90"
                      )}
                    />
                  )}
                </button>
              )}
              {(!isCollapsible || isOpen || collapsed) &&
                group.items.map((item) => {
                  const Icon = iconMap[item.icon] ?? Home;
                  const active =
                    item.href === "/"
                      ? pathname === "/"
                      : pathname.startsWith(item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onNavigate}
                      title={collapsed ? item.label : undefined}
                      className={cn(
                        "mb-0.5 flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                        active
                          ? "bg-accent/10 font-medium text-accent"
                          : "text-muted hover:bg-sidebar-hover hover:text-foreground",
                        collapsed && "justify-center px-2"
                      )}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      {!collapsed && (
                        <span className="truncate">{item.label}</span>
                      )}
                    </Link>
                  );
                })}
            </div>
          );
        })}
      </nav>
      {!collapsed && (
        <div className="border-t border-border p-4">
          <p className="text-xs text-muted">
            Educational purposes only. Use in isolated lab environments.
          </p>
        </div>
      )}
    </aside>
  );
}
