"use client";

import { useEffect, useMemo, useState } from "react";
import { Pause, Play, SkipBack, SkipForward, Repeat2, Shuffle, Volume2, ListMusic, Maximize2 } from "lucide-react";

type Track = {
  id: string;
  title: string;
  artist: string;
  cover: string;
  audio: string;
  lyrics?: string;
};

const fallbackCover = "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=900&q=80";

export function PlayerShell() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.8);

  useEffect(() => {
    async function loadSongs() {
      const response = await fetch("/api/songs");
      if (!response.ok) return;
      const data = (await response.json()) as { songs: Array<{ id: string; title: string; artist: string; audioUrl?: string; coverUrl?: string }> };
      const nextTracks = data.songs
        .filter((song) => song.audioUrl)
        .map((song) => ({
          id: song.id,
          title: song.title,
          artist: song.artist,
          cover: song.coverUrl ?? fallbackCover,
          audio: song.audioUrl ?? "",
          lyrics: "",
        }));
      setTracks(nextTracks);
    }

    void loadSongs();
  }, []);

  const activeTrack = useMemo(() => tracks[currentIndex] ?? tracks[0], [currentIndex, tracks]);

  useEffect(() => {
    const audio = document.getElementById("lyricmotion-audio") as HTMLAudioElement | null;
    if (!audio) return;
    audio.volume = volume;
    if (isPlaying) {
      void audio.play().catch(() => setIsPlaying(false));
    } else {
      audio.pause();
    }
  }, [isPlaying, volume, activeTrack]);

  useEffect(() => {
    const audio = document.getElementById("lyricmotion-audio") as HTMLAudioElement | null;
    if (!audio) return;

    const refresh = () => {
      setProgress(audio.currentTime / Math.max(audio.duration || 1, 1));
    };

    audio.addEventListener("timeupdate", refresh);
    audio.addEventListener("ended", () => {
      setCurrentIndex((value) => (value + 1) % tracks.length);
      setProgress(0);
    });

    return () => {
      audio.removeEventListener("timeupdate", refresh);
    };
  }, [tracks.length, activeTrack]);

  if (!activeTrack) {
    return (
      <div className="rounded-4xl border border-white/10 bg-zinc-950/70 p-6 shadow-2xl shadow-black/30 backdrop-blur-2xl">
        <p className="text-sm uppercase tracking-[0.3em] text-cyan-400">Player</p>
        <h3 className="mt-2 text-xl font-semibold text-white">Upload a track to start playback.</h3>
      </div>
    );
  }

  return (
    <div className="rounded-4xl border border-white/10 bg-zinc-950/70 p-6 shadow-2xl shadow-black/30 backdrop-blur-2xl">
      <audio id="lyricmotion-audio" src={activeTrack.audio} preload="metadata" />
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <img src={activeTrack.cover} alt={activeTrack.title} className="h-16 w-16 rounded-2xl object-cover" />
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-400">Now playing</p>
            <h3 className="text-xl font-semibold text-white">{activeTrack.title}</h3>
            <p className="text-sm text-zinc-400">{activeTrack.artist}</p>
          </div>
        </div>

        <div className="flex-1 lg:max-w-xl">
          <div className="mb-3 h-2 rounded-full bg-white/10">
            <div className="h-2 rounded-full bg-linear-to-r from-cyan-400 to-fuchsia-500" style={{ width: `${Math.round(progress * 100)}%` }} />
          </div>
          <div className="flex items-center justify-center gap-3">
            <button className="rounded-full border border-white/10 bg-white/5 p-3 text-zinc-300 transition hover:bg-white/10">
              <Shuffle className="h-4 w-4" />
            </button>
            <button onClick={() => setCurrentIndex((value) => (value - 1 + tracks.length) % tracks.length)} className="rounded-full border border-white/10 bg-white/5 p-3 text-zinc-300 transition hover:bg-white/10">
              <SkipBack className="h-4 w-4" />
            </button>
            <button onClick={() => setIsPlaying((value) => !value)} className="rounded-full bg-linear-to-r from-cyan-400 to-fuchsia-500 p-4 text-black shadow-lg shadow-cyan-500/30">
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </button>
            <button onClick={() => setCurrentIndex((value) => (value + 1) % tracks.length)} className="rounded-full border border-white/10 bg-white/5 p-3 text-zinc-300 transition hover:bg-white/10">
              <SkipForward className="h-4 w-4" />
            </button>
            <button className="rounded-full border border-white/10 bg-white/5 p-3 text-zinc-300 transition hover:bg-white/10">
              <Repeat2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-zinc-300">
            <Volume2 className="h-4 w-4" />
            <input type="range" min="0" max="1" step="0.01" value={volume} onChange={(event) => setVolume(Number(event.target.value))} className="w-20 accent-cyan-400" />
          </div>
          <button className="rounded-full border border-white/10 bg-white/5 p-3 text-zinc-300 transition hover:bg-white/10">
            <ListMusic className="h-4 w-4" />
          </button>
          <button className="rounded-full border border-white/10 bg-white/5 p-3 text-zinc-300 transition hover:bg-white/10">
            <Maximize2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
