"use client";

import { useEffect, useMemo, useState } from "react";
import { Sparkles } from "lucide-react";
import { parseLyrics, readUploads } from "@/lib/local-library";

type LyricLine = {
  time: number;
  text: string;
};

export function LyricPanel() {
  const [lines, setLines] = useState<LyricLine[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

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

      <div className="mt-6 rounded-3xl border border-white/10 bg-linear-to-br from-cyan-500/10 to-fuchsia-500/10 p-6 text-center">
        <div className="mb-5 flex justify-center">
          <div className="rounded-full border border-white/10 bg-white/10 p-3 text-cyan-200">
            <Sparkles className="h-5 w-5" />
          </div>
        </div>

        {lines.length > 0 ? (
          <>
            <div className="space-y-3">
              {lines.map((line, index) => (
                <div key={`${line.text}-${index}`} className={`rounded-2xl px-4 py-3 text-lg font-medium transition ${index === currentIndex ? "bg-white/15 text-white shadow-lg shadow-cyan-500/10" : "bg-black/20 text-zinc-400"}`}>
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
          <p className="text-sm text-zinc-400">Upload a lyric file to see synchronized lines here.</p>
        )}
      </div>
    </div>
  );
}
