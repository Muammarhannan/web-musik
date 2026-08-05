"use client";

import { useEffect, useState } from "react";
import { Palette } from "lucide-react";

const themes = ["Midnight", "Aurora", "Ocean", "Sakura", "Cyberpunk", "Dream"];

export function ThemeSelector() {
  const [activeTheme, setActiveTheme] = useState("Midnight");

  useEffect(() => {
    const stored = typeof window !== "undefined" ? window.localStorage.getItem("pixelbeats-theme") : null;
    if (stored) setActiveTheme(stored);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem("pixelbeats-theme", activeTheme);
    document.documentElement.dataset.theme = activeTheme.toLowerCase();
  }, [activeTheme]);

  return (
    <div className="rounded-4xl border border-white/10 bg-zinc-950/70 p-6 backdrop-blur-2xl">
      <div className="flex items-center gap-2 text-cyan-300">
        <Palette className="h-5 w-5" />
        <h3 className="text-xl font-semibold text-white">Theme</h3>
      </div>
      <div className="mt-5 grid gap-3 md:grid-cols-3">
        {themes.map((theme) => (
          <button key={theme} onClick={() => setActiveTheme(theme)} className={`rounded-2xl border px-4 py-3 text-left text-sm transition ${activeTheme === theme ? "border-white/20 bg-white/10 text-white" : "border-white/10 bg-white/5 text-zinc-400"}`}>
            {theme}
          </button>
        ))}
      </div>
      <p className="mt-4 text-sm text-zinc-400">Selected theme: {activeTheme}</p>
    </div>
  );
}
