"use client";

import { useEffect, useMemo, useState } from "react";
import { Sparkles } from "lucide-react";

type VisualMode = "bars" | "circle" | "aurora";

const modes: VisualMode[] = ["bars", "circle", "aurora"];

export function VisualizerPanel() {
  const [mode, setMode] = useState<VisualMode>("bars");
  const [energy, setEnergy] = useState(0.5);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setEnergy(Math.random() * 0.9 + 0.1);
    }, 180);
    return () => window.clearInterval(interval);
  }, []);

  const bars = useMemo(() => Array.from({ length: 24 }, (_, index) => ({
    id: index,
    height: `${24 + ((index * 13) % 65) * energy}%`,
  })), [energy]);

  return (
    <div className="rounded-4xl border border-white/10 bg-zinc-950/70 p-6 backdrop-blur-2xl">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-400">Visualizer</p>
          <h3 className="text-xl font-semibold text-white">Realtime motion layers</h3>
        </div>
        <div className="flex gap-2">
          {modes.map((item) => (
            <button key={item} onClick={() => setMode(item)} className={`rounded-full px-3 py-2 text-sm capitalize ${mode === item ? "bg-cyan-400/20 text-cyan-200" : "bg-white/5 text-zinc-400"}`}>
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 rounded-3xl border border-white/10 bg-linear-to-br from-cyan-500/10 to-fuchsia-500/10 p-6">
        {mode === "bars" ? (
          <div className="flex h-48 items-end justify-between gap-2">
            {bars.map((bar) => (
              <div key={bar.id} className="w-full rounded-full bg-linear-to-t from-cyan-400 to-fuchsia-500" style={{ height: bar.height }} />
            ))}
          </div>
        ) : null}

        {mode === "circle" ? (
          <div className="flex h-48 items-center justify-center">
            <div className="relative h-40 w-40 rounded-full border border-cyan-400/30" style={{ boxShadow: `0 0 70px rgba(34,211,238,0.25)` }}>
              <div className="absolute inset-4 rounded-full border border-fuchsia-400/40" />
              <div className="absolute inset-8 rounded-full border border-white/20" />
              <div className="absolute inset-0 rounded-full border border-cyan-300/40" style={{ transform: `rotate(${energy * 360}deg)` }} />
            </div>
          </div>
        ) : null}

        {mode === "aurora" ? (
          <div className="relative h-48 overflow-hidden rounded-3xl border border-white/10 bg-black/20">
            <div className="absolute left-[-10%] top-10 h-28 w-28 rounded-full bg-cyan-400/40 blur-3xl" style={{ transform: `scale(${0.8 + energy})` }} />
            <div className="absolute bottom-[-10%] right-[-10%] h-36 w-36 rounded-full bg-fuchsia-500/40 blur-3xl" style={{ transform: `scale(${0.7 + energy})` }} />
            <div className="absolute inset-0 flex items-center justify-center text-cyan-100">
              <div className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm backdrop-blur-xl">
                <Sparkles className="mr-2 inline h-4 w-4" /> Aurora pulse
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
