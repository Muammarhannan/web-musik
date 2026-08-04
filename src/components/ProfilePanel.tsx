"use client";

import { Heart, History, Music4, Sparkles, UserRound } from "lucide-react";

const stats = [
  { label: "Songs", value: "128", icon: Music4 },
  { label: "Loved", value: "47", icon: Heart },
  { label: "Plays", value: "2.4k", icon: History },
];

export function ProfilePanel() {
  return (
    <div className="rounded-4xl border border-white/10 bg-zinc-950/70 p-6 backdrop-blur-2xl">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-linear-to-br from-cyan-400 to-fuchsia-500 text-white">
            <UserRound className="h-8 w-8" />
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-400">Profile</p>
            <h3 className="text-2xl font-semibold text-white">Auralis</h3>
            <p className="text-sm text-zinc-400">Curating a cinematic library with a taste for late-night glow.</p>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-zinc-300">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-cyan-300" />
            Favorite genre: Dreamwave
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="rounded-3xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center gap-2 text-cyan-300">
                <Icon className="h-4 w-4" />
                <span className="text-sm">{stat.label}</span>
              </div>
              <p className="mt-3 text-2xl font-semibold text-white">{stat.value}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
