"use client";

import { Heart, History } from "lucide-react";

const favorites = [
  { title: "Velvet Stars", artist: "Mina" },
  { title: "Lunar Bloom", artist: "Aster" },
];

const history = [
  { title: "Echoes of Dawn", artist: "Liora" },
  { title: "Subtle Static", artist: "Niko" },
];

export function FavoriteHistoryPanel() {
  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <div className="rounded-[32px] border border-white/10 bg-zinc-950/70 p-6 backdrop-blur-2xl">
        <div className="flex items-center gap-2 text-cyan-300">
          <Heart className="h-5 w-5" />
          <h3 className="text-xl font-semibold text-white">Favorites</h3>
        </div>
        <div className="mt-5 space-y-3">
          {favorites.map((track) => (
            <div key={track.title} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <div>
                <p className="font-medium text-white">{track.title}</p>
                <p className="text-sm text-zinc-400">{track.artist}</p>
              </div>
              <button className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-zinc-300">Play</button>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-[32px] border border-white/10 bg-zinc-950/70 p-6 backdrop-blur-2xl">
        <div className="flex items-center gap-2 text-cyan-300">
          <History className="h-5 w-5" />
          <h3 className="text-xl font-semibold text-white">Listening history</h3>
        </div>
        <div className="mt-5 space-y-3">
          {history.map((track) => (
            <div key={track.title} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <div>
                <p className="font-medium text-white">{track.title}</p>
                <p className="text-sm text-zinc-400">{track.artist}</p>
              </div>
              <button className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-zinc-300">Replay</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
