"use client";

import { useMemo, useState } from "react";
import { Search, Sparkles } from "lucide-react";

const catalog = [
  { title: "Velvet Stars", artist: "Mina", genre: "Dreamwave" },
  { title: "Neon Drift", artist: "Aster", genre: "Synth" },
  { title: "Midnight Pulse", artist: "Liora", genre: "Ambient" },
];

export function SearchRecommendations() {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const value = query.toLowerCase();
    if (!value) return catalog;
    return catalog.filter((item) => `${item.title} ${item.artist} ${item.genre}`.toLowerCase().includes(value));
  }, [query]);

  return (
    <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
      <div className="rounded-4xl border border-white/10 bg-zinc-950/70 p-6 backdrop-blur-2xl">
        <div className="flex items-center gap-2 text-cyan-300">
          <Search className="h-5 w-5" />
          <h3 className="text-xl font-semibold text-white">Search</h3>
        </div>
        <div className="mt-4 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
          <Search className="h-4 w-4 text-zinc-400" />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by title, artist or genre" className="w-full bg-transparent text-sm text-white outline-none placeholder:text-zinc-500" />
        </div>
        <div className="mt-5 space-y-3">
          {results.map((item) => (
            <div key={item.title} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <p className="font-medium text-white">{item.title}</p>
              <p className="text-sm text-zinc-400">{item.artist} • {item.genre}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-4xl border border-white/10 bg-zinc-950/70 p-6 backdrop-blur-2xl">
        <div className="flex items-center gap-2 text-cyan-300">
          <Sparkles className="h-5 w-5" />
          <h3 className="text-xl font-semibold text-white">Recommendations</h3>
        </div>
        <div className="mt-5 space-y-3">
          {[
            { title: "Aurora Bloom", reason: "Based on your dreamwave taste" },
            { title: "Silent City", reason: "Inspired by your recent play history" },
            { title: "Velvet Motion", reason: "Curated from your favorites" },
          ].map((item) => (
            <div key={item.title} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <p className="font-medium text-white">{item.title}</p>
              <p className="text-sm text-zinc-400">{item.reason}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
