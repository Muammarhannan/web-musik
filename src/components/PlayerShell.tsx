"use client";

import { useEffect, useMemo, useRef, useState, type MouseEvent } from "react";
import { Pause, Play, SkipBack, SkipForward, Repeat2, Shuffle, Volume2, ListMusic, Maximize2 } from "lucide-react";
import { recordListeningSession } from "@/lib/listening-store";

type Track = {
  id: string;
  title: string;
  artist: string;
  info?: string;
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
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);

  useEffect(() => {
    async function loadSongs() {
      const response = await fetch("/api/songs");
      if (!response.ok) return;
      const data = (await response.json()) as { songs: Array<{ id: string; title: string; artist: string; genre?: string | null; audioUrl?: string; coverUrl?: string; lyricsUrl?: string | null }> };
      const nextTracks = data.songs
        .filter((song) => song.audioUrl)
        .map((song) => ({
          id: song.id,
          title: song.title,
          artist: song.artist,
          info: song.genre ?? undefined,
          cover: song.coverUrl ?? fallbackCover,
          audio: song.audioUrl ?? "",
          lyrics: song.lyricsUrl ?? undefined,
        }));
      setTracks(nextTracks);
    }

    void loadSongs();
  }, []);

  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [trackStarted, setTrackStarted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const activeTrack = useMemo(() => tracks[currentIndex] ?? tracks[0], [currentIndex, tracks]);

  useEffect(() => {
    const audio = document.getElementById("pixelbeats-audio") as HTMLAudioElement | null;
    audioRef.current = audio;
    if (!audio) return;

    audio.volume = volume;
    audio.src = activeTrack.audio;

    if (isPlaying) {
      void audio.play().catch(() => setIsPlaying(false));
    } else {
      audio.pause();
    }
  }, [isPlaying, volume, activeTrack]);

  useEffect(() => {
    const toggleHandler = () => {
      setIsPlaying((current) => !current);
    };

    document.addEventListener("pixelbeats-toggle-play", toggleHandler);
    return () => document.removeEventListener("pixelbeats-toggle-play", toggleHandler);
  }, []);

  useEffect(() => {
    const audio = audioRef.current ?? document.getElementById("pixelbeats-audio") as HTMLAudioElement | null;
    if (!audio) return;

    const refresh = () => {
      setCurrentTime(audio.currentTime);
      setDuration(audio.duration || 0);
      setProgress(audio.currentTime / Math.max(audio.duration || 1, 1));
      if (audio.currentTime > 0 && !trackStarted) {
        setTrackStarted(true);
      }
    };

    const handleEnded = () => {
      if (duration > 0) {
        recordListeningSession({
          songId: activeTrack.id,
          title: activeTrack.title,
          artist: activeTrack.artist,
          duration,
          seconds: Math.round(audio.currentTime),
        });
      }

      if (repeat) {
        audio.currentTime = 0;
        void audio.play().catch(() => setIsPlaying(false));
        return;
      }

      const nextIndex = shuffle
        ? Math.floor(Math.random() * tracks.length)
        : (currentIndex + 1) % tracks.length;
      setCurrentIndex(nextIndex);
      setProgress(0);
      setTrackStarted(false);
    };

    audio.addEventListener("timeupdate", refresh);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", refresh);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [activeTrack, duration, tracks.length, trackStarted]);

  const seek = (event: MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || duration === 0) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const offsetX = event.clientX - rect.left;
    const ratio = Math.min(1, Math.max(0, offsetX / rect.width));
    audio.currentTime = ratio * duration;
    setProgress(ratio);
  };

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
      <audio id="pixelbeats-audio" src={activeTrack.audio} preload="metadata" />
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <img src={activeTrack.cover} alt={activeTrack.title} className="h-16 w-16 rounded-2xl object-cover" />
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-400">Now playing</p>
            <h3 className="text-xl font-semibold text-white">{activeTrack.title}</h3>
            <p className="text-sm text-zinc-400">{activeTrack.artist}</p>
            {activeTrack.info ? <p className="mt-1 text-sm text-slate-400">{activeTrack.info}</p> : null}
            <p className={`mt-1 text-sm ${activeTrack.lyrics ? "text-slate-300" : "text-zinc-500"}`}>
              {activeTrack.lyrics ? "Lyrics available" : "No lyric"}
            </p>
          </div>
        </div>

        <div className="flex-1 lg:max-w-xl">
          <div className="mb-3 h-2 rounded-full bg-white/10" onClick={seek} role="button" aria-label="Seek" tabIndex={0}>
            <div className="h-2 rounded-full bg-white" style={{ width: `${Math.round(progress * 100)}%` }} />
          </div>
          <div className="mb-2 flex items-center justify-between text-xs text-slate-400">
            <span>{new Date(currentTime * 1000).toISOString().slice(14, 19)}</span>
            <span>{duration ? new Date(duration * 1000).toISOString().slice(14, 19) : "0:00"}</span>
          </div>
          <div className="flex items-center justify-center gap-3">
            <button onClick={() => setShuffle((value) => !value)} className={`rounded-full border p-3 transition ${shuffle ? "border-white/30 bg-white/10 text-white" : "border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10"}`}>
              <Shuffle className="h-4 w-4" />
            </button>
            <button onClick={() => setCurrentIndex((value) => (value - 1 + tracks.length) % tracks.length)} className="rounded-full border border-white/10 bg-white/5 p-3 text-zinc-300 transition hover:bg-white/10">
              <SkipBack className="h-4 w-4" />
            </button>
            <button onClick={() => setIsPlaying((value) => !value)} className="rounded-full bg-slate-800 p-4 text-white shadow-lg shadow-slate-900/30">
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </button>
            <button onClick={() => setCurrentIndex((value) => (value + 1) % tracks.length)} className="rounded-full border border-white/10 bg-white/5 p-3 text-zinc-300 transition hover:bg-white/10">
              <SkipForward className="h-4 w-4" />
            </button>
            <button onClick={() => setRepeat((value) => !value)} className={`rounded-full border p-3 transition ${repeat ? "border-white/30 bg-white/10 text-white" : "border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10"}`}>
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
