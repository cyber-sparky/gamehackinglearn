import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Study Session",
  description: "Distraction-free focused study with timer and Pomodoro.",
};

export default function StudyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
