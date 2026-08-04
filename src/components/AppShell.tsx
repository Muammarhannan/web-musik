"use client";

import Link from "next/link";
import { Compass, Heart, History, Library, Music4, Radio, Settings, Sparkles, Upload, UserRound } from "lucide-react";

const navItems = [
  { label: "Home", href: "/", icon: Sparkles },
  { label: "Discover", href: "/dashboard", icon: Compass },
  { label: "Upload", href: "/upload", icon: Upload },
  { label: "Library", href: "/player", icon: Library },
  { label: "Immersive", href: "/immersive", icon: Radio },
  { label: "Favorite", href: "/", icon: Heart },
  { label: "History", href: "/", icon: History },
  { label: "Profile", href: "/", icon: UserRound },
  { label: "Settings", href: "/", icon: Settings },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#050816] text-zinc-100">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 lg:flex-row">
        <aside className="w-full rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur-xl lg:w-72">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-cyan-400/20 p-3 text-cyan-300">
              <Music4 className="h-6 w-6" />
            </div>
            <div>
              <p className="text-lg font-semibold">LyricMotion</p>
              <p className="text-sm text-zinc-400">Immersive audio</p>
            </div>
          </div>
          <nav className="mt-6 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.label} href={item.href} className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm text-zinc-300 transition hover:bg-white/10 hover:text-white">
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}
