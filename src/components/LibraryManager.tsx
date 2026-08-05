"use client";

import { useMemo, useState } from "react";
import type { SongRecord } from "@/lib/song-service";

type LibraryManagerProps = {
  initialSongs: SongRecord[];
};

type SongDraft = {
  title: string;
  artist: string;
  album: string;
  genre: string;
};

function formatDuration(duration?: number | null) {
  if (duration == null) return "—";
  const minutes = Math.floor(duration / 60);
  const seconds = String(duration % 60).padStart(2, "0");
  return `${minutes}:${seconds}`;
}

export function LibraryManager({ initialSongs }: LibraryManagerProps) {
  const [songs, setSongs] = useState<SongRecord[]>(initialSongs);
  const [editingSongId, setEditingSongId] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<Record<string, SongDraft>>({});
  const [saving, setSaving] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const activeSong = editingSongId ? songs.find((song) => song.id === editingSongId) : null;

  const songCount = songs.length;

  const onStartEdit = (song: SongRecord) => {
    setEditingSongId(song.id);
    setDrafts((current) => ({
      ...current,
      [song.id]: {
        title: song.title,
        artist: song.artist,
        album: song.album ?? "",
        genre: song.genre ?? "",
      },
    }));
  };

  const onCancelEdit = () => {
    setEditingSongId(null);
    setError(null);
  };

  const onDraftChange = (id: string, field: keyof SongDraft, value: string) => {
    setDrafts((current) => ({
      ...current,
      [id]: {
        ...current[id],
        [field]: value,
      },
    }));
  };

  const onSave = async (song: SongRecord) => {
    const draft = drafts[song.id];
    if (!draft || !draft.title.trim()) {
      setError("Judul lagu diperlukan.");
      return;
    }

    setSaving(song.id);
    setError(null);

    const response = await fetch(`/api/songs/${song.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: draft.title.trim(),
        artist: draft.artist.trim() || song.artist,
        album: draft.album.trim() || null,
        genre: draft.genre.trim() || null,
      }),
    });

    if (!response.ok) {
      const body = await response.json().catch(() => null);
      setError(body?.error || "Gagal menyimpan perubahan.");
      setSaving(null);
      return;
    }

    const data = (await response.json()) as { song: SongRecord };
    setSongs((current) => current.map((item) => (item.id === song.id ? data.song : item)));
    setEditingSongId(null);
    setSaving(null);
  };

  const onDelete = async (id: string) => {
    const confirmed = window.confirm("Hapus lagu ini dari perpustakaan? Tindakan ini tidak dapat dibatalkan.");
    if (!confirmed) return;

    setSaving(id);
    setError(null);

    const response = await fetch(`/api/songs/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const body = await response.json().catch(() => null);
      setError(body?.error || "Gagal menghapus lagu.");
      setSaving(null);
      return;
    }

    setSongs((current) => current.filter((song) => song.id !== id));
    setSaving(null);
    if (editingSongId === id) {
      setEditingSongId(null);
    }
  };

  const hasSongs = songs.length > 0;

  return (
    <div className="space-y-6">
      <div className="rounded-4xl border border-white/10 bg-slate-950/60 p-8 shadow-2xl shadow-black/20 backdrop-blur-2xl">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Library</p>
            <h1 className="mt-3 text-3xl font-semibold text-white">Your uploaded songs.</h1>
            <p className="mt-2 text-sm text-slate-400">Browse and play music from your private PixelBeats collection.</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300">
            {songCount} songs stored
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
            <p className="text-slate-400">Total songs</p>
            <p className="mt-2 text-2xl font-semibold text-white">{songCount}</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
            <p className="text-slate-400">Cover art</p>
            <p className="mt-2 text-2xl font-semibold text-white">{songs.filter((song) => song.coverUrl).length}</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
            <p className="text-slate-400">Store age</p>
            <p className="mt-2 text-2xl font-semibold text-white">{hasSongs ? new Date(songs[0].createdAt).toLocaleDateString() : "—"}</p>
          </div>
        </div>
      </div>

      {!hasSongs ? (
        <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-6 shadow-xl shadow-slate-950/10 backdrop-blur-xl text-slate-300">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Empty library</p>
          <p className="mt-3 text-lg font-semibold text-white">No songs have been uploaded yet.</p>
          <p className="mt-2 text-sm text-slate-400">Upload an MP3 to start building your personal music collection.</p>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {songs.map((song) => {
            const draft = drafts[song.id];
            const isEditing = editingSongId === song.id;
            return (
              <div key={song.id} className="rounded-3xl border border-white/10 bg-slate-950/60 p-6 shadow-xl shadow-slate-950/10 backdrop-blur-xl">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-4">
                    <img src={song.coverUrl ?? "/album-placeholder.png"} alt={song.title} className="h-20 w-20 rounded-3xl object-cover" />
                    <div>
                      <p className="text-sm uppercase tracking-[0.3em] text-slate-400">{song.artist}</p>
                      {!isEditing ? (
                        <>
                          <h2 className="mt-2 text-xl font-semibold text-white">{song.title}</h2>
                          <p className="mt-1 text-sm text-slate-400">{song.album ?? "Unknown album"}</p>
                        </>
                      ) : (
                        <div className="space-y-3">
                          <label className="block text-sm text-slate-400">Title</label>
                          <input
                            value={draft?.title ?? song.title}
                            onChange={(event) => onDraftChange(song.id, "title", event.target.value)}
                            className="w-full rounded-2xl border border-white/10 bg-slate-900/90 px-3 py-2 text-sm text-white outline-none"
                          />
                          <label className="block text-sm text-slate-400">Album</label>
                          <input
                            value={draft?.album ?? song.album ?? ""}
                            onChange={(event) => onDraftChange(song.id, "album", event.target.value)}
                            className="w-full rounded-2xl border border-white/10 bg-slate-900/90 px-3 py-2 text-sm text-white outline-none"
                          />
                          <label className="block text-sm text-slate-400">Genre</label>
                          <input
                            value={draft?.genre ?? song.genre ?? ""}
                            onChange={(event) => onDraftChange(song.id, "genre", event.target.value)}
                            className="w-full rounded-2xl border border-white/10 bg-slate-900/90 px-3 py-2 text-sm text-white outline-none"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {isEditing ? (
                      <>
                        <button
                          type="button"
                          onClick={() => onSave(song)}
                          disabled={saving === song.id}
                          className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {saving === song.id ? "Saving…" : "Save"}
                        </button>
                        <button
                          type="button"
                          onClick={onCancelEdit}
                          className="rounded-full border border-white/10 bg-transparent px-4 py-2 text-sm text-slate-300 transition hover:bg-white/5"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => onStartEdit(song)}
                          className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white transition hover:bg-white/10"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => onDelete(song.id)}
                          disabled={saving === song.id}
                          className="rounded-full border border-white/10 bg-transparent px-4 py-2 text-sm text-slate-300 transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-3xl bg-white/5 p-4 text-sm text-slate-300">
                    <p className="text-slate-400">Genre</p>
                    <p className="mt-2 text-white">{song.genre ?? "Uncategorized"}</p>
                  </div>
                  <div className="rounded-3xl bg-white/5 p-4 text-sm text-slate-300">
                    <p className="text-slate-400">Duration</p>
                    <p className="mt-2 text-white">{formatDuration(song.duration)}</p>
                  </div>
                  <div className="rounded-3xl bg-white/5 p-4 text-sm text-slate-300">
                    <p className="text-slate-400">Uploaded</p>
                    <p className="mt-2 text-white">{new Date(song.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>

                {error && isEditing ? (
                  <div className="mt-4 rounded-2xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                    {error}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
