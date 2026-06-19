import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AppShell } from "@/components/layout/AppShell";
import { OnboardingModal } from "@/components/onboarding/OnboardingModal";
import { BackupReminder } from "@/components/platform/BackupReminder";
import { getSiteUrl } from "@/lib/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Game Hacking Roadmap (0 → Hero)",
    template: "%s | Game Hacking Roadmap",
  },
  description:
    "The most comprehensive free game hacking learning resource — reverse engineering, memory analysis, anti-cheat research, and game engine internals for educational purposes.",
  keywords: [
    "game hacking",
    "reverse engineering",
    "cheat engine",
    "anti-cheat research",
    "game security",
    "memory analysis",
  ],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    title: "GH Roadmap",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Game Hacking Roadmap",
    title: "Game Hacking Roadmap (0 → Hero)",
    description:
      "Free structured learning for game reverse engineering, memory analysis, and security research.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Game Hacking Roadmap",
    description:
      "Free structured learning for game reverse engineering and security research.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full">
        <AppShell>{children}</AppShell>
        <OnboardingModal />
        <BackupReminder />
      </body>
    </html>
  );
}
