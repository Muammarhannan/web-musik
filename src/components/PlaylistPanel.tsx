"use client";

import { useEffect, useMemo, useState } from "react";
import { PlusCircle, Trash2, Music4, GripVertical } from "lucide-react";
import { readPlaylists, writePlaylists, type PlaylistItem } from "@/lib/local-library";

export function PlaylistPanel() {
  const [playlists, setPlaylists] = useState<PlaylistItem[]>([]);
  const [draft, setDraft] = useState("");

  useEffect(() => {
    const persisted = readPlaylists();
    if (persisted.length > 0) {
      setPlaylists(persisted);
    }
  }, []);

  const totalDuration = useMemo(() => playlists.length * 3 + 8, [playlists.length]);

  function addPlaylist() {
    if (!draft.trim()) return;
    const next = [...playlists, { id: crypto.randomUUID(), title: draft.trim(), artist: "You", createdAt: new Date().toISOString() }];
    setPlaylists(next);
    writePlaylists(next);
    setDraft("");
  }

  function removePlaylist(id: string) {
    const next = playlists.filter((item) => item.id !== id);
    setPlaylists(next);
    writePlaylists(next);
  }

  return (
    <div className="rounded-4xl border border-white/10 bg-zinc-950/70 p-6 backdrop-blur-2xl">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-400">Playlists</p>
          <h3 className="text-xl font-semibold text-white">Curated listening sessions</h3>
        </div>
        <div className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-zinc-300">{playlists.length} lists</div>
      </div>

      <div className="mt-5 flex gap-2">
        <input value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Create a new playlist" className="flex-1 rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-500" />
        <button onClick={addPlaylist} className="rounded-full bg-linear-to-r from-cyan-400 to-fuchsia-500 px-4 py-3 text-sm font-semibold text-black">
          <PlusCircle className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-6 space-y-3">
        {playlists.map((playlist) => (
          <div key={playlist.id} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-3">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-cyan-400/10 p-2 text-cyan-300">
                <GripVertical className="h-4 w-4" />
              </div>
              <div>
                <p className="font-medium text-white">{playlist.title}</p>
                <p className="text-sm text-zinc-400">{playlist.artist}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs text-zinc-400">{totalDuration} min</div>
              <button onClick={() => removePlaylist(playlist.id)} className="rounded-full border border-white/10 bg-white/5 p-2 text-zinc-300 transition hover:bg-white/10">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
