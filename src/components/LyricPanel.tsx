"use client";

import { useMemo, useState } from "react";
import { Sparkles } from "lucide-react";

type LyricLine = {
  time: number;
  text: string;
};

const lines: LyricLine[] = [
  { time: 0, text: "A glow in the dark" },
  { time: 4, text: "A pulse beneath the city" },
  { time: 8, text: "We move like light" },
  { time: 12, text: "Softly into midnight" },
];

export function LyricPanel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const activeLine = useMemo(() => lines[currentIndex] ?? lines[0], [currentIndex]);

  return (
    <div className="rounded-[32px] border border-white/10 bg-zinc-950/70 p-6 backdrop-blur-2xl">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-400">Lyrics</p>
          <h3 className="text-xl font-semibold text-white">Karaoke-like synchronicity</h3>
        </div>
        <div className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-zinc-300">Live mode</div>
      </div>

      <div className="mt-6 rounded-[28px] border border-white/10 bg-gradient-to-br from-cyan-500/10 to-fuchsia-500/10 p-6 text-center">
        <div className="mb-5 flex justify-center">
          <div className="rounded-full border border-white/10 bg-white/10 p-3 text-cyan-200">
            <Sparkles className="h-5 w-5" />
          </div>
        </div>

        <div className="space-y-3">
          {lines.map((line, index) => (
            <div key={line.text} className={`rounded-2xl px-4 py-3 text-lg font-medium transition ${index === currentIndex ? "bg-white/15 text-white shadow-lg shadow-cyan-500/10" : "bg-black/20 text-zinc-400"}`}>
              {line.text}
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-center gap-2">
          <button onClick={() => setCurrentIndex((value) => Math.max(0, value - 1))} className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-300">Previous</button>
          <button onClick={() => setCurrentIndex((value) => (value + 1) % lines.length)} className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-300">Next</button>
        </div>

        <p className="mt-4 text-sm text-cyan-200">Now: {activeLine.text}</p>
      </div>
    </div>
  );
}
