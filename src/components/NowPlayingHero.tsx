"use client";

import { PlayCircle, Sparkles } from "lucide-react";

export function NowPlayingHero() {
  return (
    <div className="rounded-4xl border border-white/10 bg-linear-to-br from-cyan-500/15 to-fuchsia-500/15 p-6 backdrop-blur-2xl">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Now playing</p>
          <h2 className="mt-2 text-3xl font-semibold text-white">Velvet Skyline</h2>
          <p className="mt-2 max-w-2xl text-sm text-zinc-300">A cinematic soundscape designed for late-night focus, floating lights, and immersive listening.</p>
        </div>
        <div className="flex items-center gap-3 rounded-full border border-white/10 bg-black/20 px-4 py-3 text-sm text-zinc-300">
          <Sparkles className="h-4 w-4 text-cyan-300" />
          Immersive mode ready
          <button className="rounded-full bg-linear-to-r from-cyan-400 to-fuchsia-500 px-3 py-2 text-sm font-semibold text-black">
            <PlayCircle className="mr-2 inline h-4 w-4" />Play
          </button>
        </div>
      </div>
    </div>
  );
}
