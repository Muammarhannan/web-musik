"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Sparkles } from "lucide-react";
import { parseLyrics, readUploads } from "@/lib/local-library";

type LyricLine = {
  time: number;
  text: string;
};

export function LyricPanel() {
  const [lines, setLines] = useState<LyricLine[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const uploads = readUploads();
    const lyricItem = uploads.find((item) => item.type === "text");
    if (!lyricItem) {
      setLines([]);
      return;
    }

    const content = lyricItem.previewText ?? lyricItem.name;
    setLines(parseLyrics(content));
  }, []);

  useEffect(() => {
    const audio = document.getElementById("pixelbeats-audio") as HTMLAudioElement | null;
    if (!audio || lines.length === 0) return;

    const updateCurrentLine = () => {
      const currentTime = audio.currentTime;
      const nextIndex = lines.findIndex((line, index) => {
        const nextLine = lines[index + 1];
        return currentTime >= line.time && (!nextLine || currentTime < nextLine.time);
      });
      if (nextIndex >= 0) setCurrentIndex(nextIndex);
    };

    audio.addEventListener("timeupdate", updateCurrentLine);
    return () => audio.removeEventListener("timeupdate", updateCurrentLine);
  }, [lines]);

  useEffect(() => {
    if (!containerRef.current) return;
    const activeLine = containerRef.current.querySelector(".active-lyric") as HTMLElement | null;
    activeLine?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [currentIndex]);

  const activeLine = useMemo(() => lines[currentIndex] ?? lines[0], [currentIndex, lines]);

  return (
    <div className="rounded-4xl border border-white/10 bg-zinc-950/70 p-6 backdrop-blur-2xl">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-400">Lyrics</p>
          <h3 className="text-xl font-semibold text-white">Karaoke-like synchronicity</h3>
        </div>
        <div className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-zinc-300">Live mode</div>
      </div>

      <div className="mt-6 rounded-3xl border border-white/10 bg-slate-950/70 p-6 text-center">
        <div className="mb-5 flex justify-center">
          <div className="rounded-full border border-white/10 bg-white/10 p-3 text-white">
            <Sparkles className="h-5 w-5" />
          </div>
        </div>

        {lines.length > 0 ? (
          <>
            <div ref={containerRef} className="space-y-3">
              {lines.map((line, index) => (
                <div key={`${line.text}-${index}`} className={`rounded-2xl px-4 py-3 text-lg font-medium transition ${index === currentIndex ? "active-lyric bg-white/15 text-white shadow-lg shadow-black/20" : "bg-black/20 text-zinc-400"}`}>
                  {line.text}
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-center gap-2">
              <button onClick={() => setCurrentIndex((value) => Math.max(0, value - 1))} className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-300">Previous</button>
              <button onClick={() => setCurrentIndex((value) => (value + 1) % lines.length)} className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-300">Next</button>
            </div>

            <p className="mt-4 text-sm text-cyan-200">Now: {activeLine?.text}</p>
          </>
        ) : (
          <p className="text-sm text-zinc-400">No lyric</p>
        )}
      </div>
    </div>
  );
}
