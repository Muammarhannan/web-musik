"use client";

import { useEffect, useMemo, useState } from "react";
import { formatSeconds, readListeningStats } from "@/lib/listening-store";

export default function StatisticsPage() {
  const [stats, setStats] = useState({
    totalPlays: 0,
    totalSeconds: 0,
    topSongs: {} as Record<string, number>,
    history: [] as Array<{ songId: string; title: string; artist: string; playedAt: string; duration: number; seconds: number }> ,
    lastPlayed: undefined as string | undefined,
  });

  useEffect(() => {
    const loaded = readListeningStats();
    setStats({
      totalPlays: loaded.totalPlays,
      totalSeconds: loaded.totalSeconds,
      topSongs: loaded.topSongs,
      history: loaded.history,
      lastPlayed: loaded.lastPlayed ?? undefined,
    });
  }, []);

  const topSong = useMemo(() => {
    const entries = Object.entries(stats.topSongs || {});
    if (entries.length === 0) return "—";
    const [songId] = entries.sort((a, b) => b[1] - a[1])[0];
    const historyItem = stats.history.find((item) => item.songId === songId[0]);
    return historyItem ? historyItem.title : "—";
  }, [stats.topSongs, stats.history]);

  return (
    <main className="min-h-screen px-6 py-10 text-slate-100">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="rounded-4xl border border-white/10 bg-slate-950/40 p-8 shadow-2xl shadow-black/20 backdrop-blur-2xl">
          <p className="text-sm uppercase tracking-[0.3em] text-sky-400">Statistics</p>
          <h1 className="mt-3 text-3xl font-semibold text-white">Your listening analytics.</h1>
          <p className="mt-2 text-sm text-slate-400">Track play history, total listening time, and your most-played songs.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {[
            { label: "Total plays", value: String(stats.totalPlays) },
            { label: "Listening time", value: formatSeconds(stats.totalSeconds) },
            { label: "Top song", value: topSong },
          ].map((stat) => (
            <div key={stat.label} className="rounded-3xl border border-white/10 bg-slate-950/60 p-6 shadow-xl shadow-slate-950/10 backdrop-blur-xl">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">{stat.label}</p>
              <p className="mt-4 text-3xl font-semibold text-white">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-6 shadow-xl shadow-slate-950/10 backdrop-blur-xl">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Last played</p>
            <p className="mt-4 text-xl font-semibold text-white">{stats.lastPlayed ? new Date(stats.lastPlayed).toLocaleString() : "No plays yet"}</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-6 shadow-xl shadow-slate-950/10 backdrop-blur-xl">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Recent plays</p>
            <div className="mt-4 space-y-3">
              {stats.history.slice(0, 4).map((item) => (
                <div key={item.playedAt} className="rounded-3xl bg-white/5 p-4">
                  <p className="font-medium text-white">{item.title}</p>
                  <p className="text-sm text-slate-400">{item.artist} • {formatSeconds(item.seconds)}</p>
                </div>
              ))}
              {stats.history.length === 0 ? <p className="text-sm text-slate-400">No listening history yet.</p> : null}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
