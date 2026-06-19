import type { Metadata } from "next";
import { DashboardView } from "@/components/dashboard/DashboardView";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your learning dashboard — progress, bookmarks, notes, and current path.",
};

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="text-3xl font-bold text-foreground">Learner Dashboard</h1>
      <p className="mt-2 max-w-3xl text-lg text-muted">
        Track your progress, continue learning, and manage your study journey.
      </p>
      <div className="mt-8">
        <DashboardView />
      </div>
    </div>
  );
}
