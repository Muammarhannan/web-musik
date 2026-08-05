"use client";

import Link from "next/link";
import { BarChart3, Home, Music2, Settings, Sparkles, Upload } from "lucide-react";

const navItems = [
  { label: "Home", href: "/", icon: Home },
  { label: "Library", href: "/library", icon: Music2 },
  { label: "Player", href: "/player", icon: Sparkles },
  { label: "Statistics", href: "/statistics", icon: BarChart3 },
  { label: "Settings", href: "/settings", icon: Settings },
  { label: "Upload", href: "/upload", icon: Upload },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0b1224] text-slate-100">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 lg:flex-row">
        <aside className="w-full rounded-[32px] border border-white/10 bg-slate-950/50 p-5 shadow-2xl shadow-black/20 backdrop-blur-2xl lg:w-72">
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-gradient-to-br from-sky-400/30 to-fuchsia-500/30 text-sky-200 shadow-inner shadow-sky-500/20">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <p className="text-lg font-semibold text-white">PixelBeats</p>
              <p className="text-sm text-slate-400">My private music library</p>
            </div>
          </div>
          <nav className="mt-8 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex items-center gap-3 rounded-3xl px-4 py-3 text-sm text-slate-300 transition hover:bg-white/10 hover:text-white"
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
