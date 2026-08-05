"use client";

import { useEffect, useMemo, useState } from "react";
import { Sparkles } from "lucide-react";

type VisualMode = "bars" | "circle" | "aurora";

const modes: VisualMode[] = ["bars", "circle", "aurora"];

export function VisualizerPanel() {
  const [mode, setMode] = useState<VisualMode>("bars");
  const [energy, setEnergy] = useState(0.5);

  useEffect(() => {
    let audioContext: AudioContext | null = null;
    let analyser: AnalyserNode | null = null;
    let source: MediaElementAudioSourceNode | null = null;
    let raf: number | null = null;

    const audio = document.getElementById("pixelbeats-audio") as HTMLAudioElement | null;
    if (audio && window.AudioContext) {
      try {
        audioContext = new AudioContext();
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 128;
        source = audioContext.createMediaElementSource(audio);
        source.connect(analyser);
        analyser.connect(audioContext.destination);

        const data = new Uint8Array(analyser.frequencyBinCount);
        const tick = () => {
          if (!analyser) return;
          analyser.getByteFrequencyData(data);
          const average = data.reduce((sum, value) => sum + value, 0) / data.length / 255;
          setEnergy(Math.max(0.12, Math.min(1, average * 1.8)));
          raf = requestAnimationFrame(tick);
        };

        raf = requestAnimationFrame(tick);
      } catch {
        // ignore Web Audio initialization failures
      }
    }

    if (!audio || !window.AudioContext) {
      const interval = window.setInterval(() => {
        setEnergy(Math.random() * 0.9 + 0.1);
      }, 180);
      return () => window.clearInterval(interval);
    }

    return () => {
      if (raf) cancelAnimationFrame(raf);
      analyser?.disconnect();
      source?.disconnect();
      audioContext?.close();
    };
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

      <div className="mt-6 rounded-3xl border border-white/10 bg-slate-950/70 p-6">
        {mode === "bars" ? (
          <div className="flex h-48 items-end justify-between gap-2">
            {bars.map((bar) => (
              <div key={bar.id} className="w-full rounded-full bg-white/40" style={{ height: bar.height }} />
            ))}
          </div>
        ) : null}

        {mode === "circle" ? (
          <div className="flex h-48 items-center justify-center">
            <div className="relative h-40 w-40 rounded-full border border-white/20" style={{ boxShadow: `0 0 70px rgba(255,255,255,0.08)` }}>
              <div className="absolute inset-4 rounded-full border border-white/20" />
              <div className="absolute inset-8 rounded-full border border-white/10" />
              <div className="absolute inset-0 rounded-full border border-white/20" style={{ transform: `rotate(${energy * 360}deg)` }} />
            </div>
          </div>
        ) : null}

        {mode === "aurora" ? (
          <div className="relative h-48 overflow-hidden rounded-3xl border border-white/10 bg-black/20">
            <div className="absolute left-[-10%] top-10 h-28 w-28 rounded-full bg-white/10 blur-3xl" style={{ transform: `scale(${0.8 + energy})` }} />
            <div className="absolute bottom-[-10%] right-[-10%] h-36 w-36 rounded-full bg-white/10 blur-3xl" style={{ transform: `scale(${0.7 + energy})` }} />
            <div className="absolute inset-0 flex items-center justify-center text-white">
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
